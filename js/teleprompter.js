// GM x GG Pipeline - Teleprompter Engine
export class TeleprompterEngine {
  constructor(containerEl, options = {}) {
    this.container = containerEl;
    this.lines = [];
    this.totalDurationSec = 75; // 1:15 min
    this.currentTimeSec = 0;
    this.isPlaying = false;
    this.speed = 1.0;
    this.fontSize = 28; // px
    this.isMirrored = false;
    this.timerInterval = null;
    this.onTick = options.onTick || (() => {});
    this.onComplete = options.onComplete || (() => {});
    this.onLineChange = options.onLineChange || (() => {});
  }

  loadScript(scriptLines, lang = 'es') {
    this.lines = scriptLines.map((item, idx) => ({
      index: idx,
      time: item.time,
      start: item.secondsStart,
      end: item.secondsEnd,
      text: item[lang] || item.es
    }));
    this.currentTimeSec = 0;
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    this.container.style.fontSize = `${this.fontSize}px`;
    this.container.classList.toggle('prompter-mirrored', this.isMirrored);

    const list = document.createElement('div');
    list.className = 'prompter-script-list';

    this.lines.forEach((line) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'prompter-line-item';
      itemEl.dataset.index = line.index;
      itemEl.dataset.start = line.start;
      itemEl.dataset.end = line.end;

      itemEl.innerHTML = `
        <div class="prompter-time-badge">${line.time}</div>
        <div class="prompter-text">${line.text}</div>
      `;

      itemEl.addEventListener('click', () => {
        this.seekTo(line.start);
      });

      list.appendChild(itemEl);
    });

    this.container.appendChild(list);
    this.highlightActiveLine();
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    const tickMs = 100;

    this.timerInterval = setInterval(() => {
      this.currentTimeSec += (tickMs / 1000) * this.speed;
      this.onTick(this.currentTimeSec);
      this.highlightActiveLine();

      if (this.currentTimeSec >= this.totalDurationSec) {
        this.pause();
        this.currentTimeSec = this.totalDurationSec;
        this.onComplete();
      }
    }, tickMs);
  }

  pause() {
    this.isPlaying = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  reset() {
    this.pause();
    this.currentTimeSec = 0;
    this.highlightActiveLine();
    this.scrollToTop();
    this.onTick(0);
  }

  seekTo(seconds) {
    this.currentTimeSec = Math.max(0, Math.min(seconds, this.totalDurationSec));
    this.highlightActiveLine();
    this.onTick(this.currentTimeSec);
  }

  setFontSize(sizePx) {
    this.fontSize = sizePx;
    if (this.container) {
      this.container.style.fontSize = `${sizePx}px`;
    }
  }

  setSpeed(speedVal) {
    this.speed = Math.max(0.5, Math.min(2.0, speedVal));
  }

  setMirrored(mirrored) {
    this.isMirrored = !!mirrored;
    if (this.container) {
      this.container.classList.toggle('prompter-mirrored', this.isMirrored);
    }
  }

  highlightActiveLine() {
    if (!this.container) return;
    const items = this.container.querySelectorAll('.prompter-line-item');
    let activeItem = null;

    items.forEach((el) => {
      const start = parseFloat(el.dataset.start);
      const end = parseFloat(el.dataset.end);
      const isActive = this.currentTimeSec >= start && this.currentTimeSec < end;
      const isPast = this.currentTimeSec >= end;

      el.classList.toggle('active', isActive);
      el.classList.toggle('past', isPast);

      if (isActive) {
        activeItem = el;
      }
    });

    if (activeItem) {
      // Smooth scroll active line to upper middle of container
      const containerRect = this.container.getBoundingClientRect();
      const activeRect = activeItem.getBoundingClientRect();
      const relativeTop = activeRect.top - containerRect.top;
      const targetScroll = this.container.scrollTop + relativeTop - (containerRect.height * 0.35);

      this.container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth'
      });

      this.onLineChange(parseInt(activeItem.dataset.index, 10));
    }
  }

  scrollToTop() {
    if (this.container) {
      this.container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
