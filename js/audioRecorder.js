// GM x GG Pipeline - Audio Recording & Media Management
import { Storage } from './storage.js';

export class VoiceoverRecorder {
  constructor(options = {}) {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.animationFrameId = null;
    this.startTime = null;
    this.timerInterval = null;
    this.isRecording = false;
    this.currentTakeBlob = null;
    this.currentDurationSec = 0;
    
    this.onStateChange = options.onStateChange || (() => {});
    this.onTimerTick = options.onTimerTick || (() => {});
    this.onVisualizerData = options.onVisualizerData || (() => {});
  }

  async initMic() {
    try {
      if (this.stream) return true;
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      return true;
    } catch (err) {
      console.error('Microphone initialization error:', err);
      return false;
    }
  }

  async start(videoId, targetDurationSec = 75) {
    const micReady = await this.initMic();
    if (!micReady) {
      throw new Error('MICROPHONE_DENIED');
    }

    this.audioChunks = [];
    this.currentDurationSec = 0;

    // Audio Context for Live Waveform Visualizer
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextClass();
    const source = this.audioContext.createMediaStreamSource(this.stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 64;
    source.connect(this.analyser);
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    // Pick best supported MIME type
    const mimeTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      ''
    ];
    let selectedMime = '';
    for (const m of mimeTypes) {
      if (!m || MediaRecorder.isTypeSupported(m)) {
        selectedMime = m;
        break;
      }
    }

    const options = selectedMime ? { mimeType: selectedMime } : {};
    this.mediaRecorder = new MediaRecorder(this.stream, options);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const mime = this.mediaRecorder.mimeType || 'audio/webm';
      this.currentTakeBlob = new Blob(this.audioChunks, { type: mime });
      this.stopVisualizer();
      this.isRecording = false;
      this.onStateChange({ isRecording: false, hasTake: true, blob: this.currentTakeBlob, duration: this.currentDurationSec });
    };

    this.mediaRecorder.start(100); // 100ms chunk interval
    this.isRecording = true;
    this.startTime = Date.now();

    this.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.currentDurationSec = elapsed;
      this.onTimerTick(elapsed);
      if (elapsed >= targetDurationSec) {
        this.stop();
      }
    }, 250);

    this.startVisualizer();
    this.onStateChange({ isRecording: true, hasTake: false });
  }

  stop() {
    if (!this.isRecording || !this.mediaRecorder) return;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  startVisualizer() {
    const draw = () => {
      if (!this.isRecording || !this.analyser) return;
      this.analyser.getByteFrequencyData(this.dataArray);
      
      // Calculate overall volume level
      let sum = 0;
      for (let i = 0; i < this.dataArray.length; i++) {
        sum += this.dataArray[i];
      }
      const average = sum / this.dataArray.length;
      const normalizedVolume = Math.min(100, Math.round((average / 128) * 100));

      this.onVisualizerData({
        volume: normalizedVolume,
        rawBins: Array.from(this.dataArray)
      });

      this.animationFrameId = requestAnimationFrame(draw);
    };
    draw();
  }

  stopVisualizer() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
    }
  }

  releaseMic() {
    this.stop();
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  async saveCurrentTake(videoId, takeNumber, authorRole = 'client') {
    if (!this.currentTakeBlob) return null;
    const id = `take-${videoId}-${Date.now()}`;
    const ext = this.currentTakeBlob.type.includes('mp4') ? 'm4a' : 'webm';
    const filename = `gm_video_${String(videoId).padStart(2, '0')}_take_${takeNumber || 1}_${Date.now()}.${ext}`;

    const takeRecord = {
      id,
      videoId: Number(videoId),
      takeNumber: takeNumber || 1,
      blob: this.currentTakeBlob,
      mimeType: this.currentTakeBlob.type,
      durationSec: this.currentDurationSec,
      timestamp: new Date().toISOString(),
      authorRole,
      cloudUrl: null
    };

    // Save locally first for instant access
    await Storage.saveAudioTake(takeRecord);

    // Attempt background cloud upload to Vercel Blob
    try {
      const uploadRes = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: 'POST',
        headers: { 'Content-Type': this.currentTakeBlob.type },
        body: this.currentTakeBlob
      });
      if (uploadRes.ok) {
        const blobData = await uploadRes.json();
        if (blobData && blobData.url) {
          takeRecord.cloudUrl = blobData.url;
          await Storage.saveAudioTake(takeRecord);
        }
      }
    } catch (e) {
      console.warn('Vercel Blob upload skipped/offline:', e.message);
    }

    return takeRecord;
  }

  static formatDuration(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  static downloadTake(take) {
    const url = take.blob ? URL.createObjectURL(take.blob) : take.cloudUrl;
    if (!url) return;
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    const ext = (take.mimeType && take.mimeType.includes('mp4')) ? 'm4a' : 'webm';
    a.download = `GM_Video_${String(take.videoId).padStart(2, '0')}_Toma_${take.takeNumber || 1}.${ext}`;
    if (take.cloudUrl && !take.blob) {
      a.target = '_blank';
    }
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      if (take.blob) URL.revokeObjectURL(url);
    }, 1000);
  }

  static getWhatsAppShareUrl(video, take, lang = 'es', doctorName = 'Dr. Mario Pinilla') {
    const formattedDuration = VoiceoverRecorder.formatDuration(take.durationSec || 75);
    const isEs = lang === 'es';
    const audioLinkLine = take.cloudUrl ? `\n🔗 *Audio Cloud Link:* ${take.cloudUrl}\n` : '';

    const message = isEs
      ? `🎙️ *Grabación de Voz en Off — Grupo Médico*\n\n` +
        `*Video #${video.number}:* ${video.topic.es}\n` +
        `*Toma:* #${take.takeNumber || 1}\n` +
        `*Duración:* ${formattedDuration} / 1:15 min\n` +
        `*Grabado por:* ${doctorName}\n` +
        `*Fecha:* ${new Date(take.timestamp).toLocaleDateString('es-CO')}\n` +
        audioLinkLine + `\n` +
        `¡Hola Gunery! Acabo de grabar la voz en off para este video. Por favor revísenla en el portal de producción o descarguen el archivo.`
      : `🎙️ *Voiceover Recording — Grupo Médico*\n\n` +
        `*Video #${video.number}:* ${video.topic.en}\n` +
        `*Take:* #${take.takeNumber || 1}\n` +
        `*Duration:* ${formattedDuration} / 1:15 min\n` +
        `*Recorded by:* ${doctorName}\n` +
        `*Date:* ${new Date(take.timestamp).toLocaleDateString('en-US')}\n` +
        audioLinkLine + `\n` +
        `Hi Gunery! I just recorded the voiceover for this video. Please review it on the production portal or download the audio file.`;
    
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  }
    
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  }
}
