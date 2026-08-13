// GM x GG Pipeline - State Management & IndexedDB Audio Vault
import { CAMPAIGN_DATA } from './data.js';

const STORAGE_KEYS = {
  LANG: 'gm_gg_lang',
  THEME: 'gm_gg_theme',
  ROLE: 'gm_gg_role',
  STATUSES: 'gm_gg_statuses',
  APPROVALS: 'gm_gg_approvals',
  COMMENTS: 'gm_gg_comments',
  NOTES: 'gm_gg_notes'
};

const DB_NAME = 'GM_GG_AudioVault';
const DB_VERSION = 1;
const STORE_NAME = 'takes';

// Initialize IndexedDB
function openAudioDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('videoId', 'videoId', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const Storage = {
  // Settings & UI state
  getLang() {
    return localStorage.getItem(STORAGE_KEYS.LANG) || 'es';
  },
  setLang(lang) {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  },

  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  },
  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  getRole() {
    return localStorage.getItem(STORAGE_KEYS.ROLE) || 'client'; // default Dr. Mario
  },
  setRole(role) {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  },

  // Cloud Sync System (Vercel Cloud Storage)
  async pushStateToCloud() {
    try {
      const payload = {
        statuses: this.getVideoStatuses(),
        approvals: this.getScriptApprovals(),
        comments: this.getComments(),
        updatedAt: new Date().toISOString()
      };
      await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn('Cloud sync push offline/skipped:', e.message);
    }
  },

  async syncFromCloud(onUpdatedCallback) {
    try {
      const res = await fetch('/api/state', { cache: 'no-store' });
      if (res.ok) {
        const remote = await res.json();
        if (remote && remote.statuses) {
          localStorage.setItem(STORAGE_KEYS.STATUSES, JSON.stringify(remote.statuses));
          if (remote.approvals) {
            localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(remote.approvals));
          }
          if (remote.comments && Array.isArray(remote.comments)) {
            localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(remote.comments));
          }
          if (typeof onUpdatedCallback === 'function') {
            onUpdatedCallback(remote);
          }
          return remote;
        }
      }
    } catch (e) {
      console.warn('Cloud sync fetch offline/skipped:', e.message);
    }
    return null;
  },

  // Video Statuses
  getVideoStatuses() {
    const raw = localStorage.getItem(STORAGE_KEYS.STATUSES);
    if (!raw) {
      const defaults = {};
      CAMPAIGN_DATA.videos.forEach(v => {
        defaults[v.id] = v.defaultStatus || 'script_approved';
      });
      return defaults;
    }
    try {
      const parsed = JSON.parse(raw);
      Object.keys(parsed).forEach(k => {
        if (parsed[k] === 'client_review') parsed[k] = 'editing';
      });
      return parsed;
    } catch {
      return {};
    }
  },
  setVideoStatus(videoId, statusKey) {
    const statuses = this.getVideoStatuses();
    statuses[videoId] = statusKey;
    localStorage.setItem(STORAGE_KEYS.STATUSES, JSON.stringify(statuses));
    this.pushStateToCloud();
  },

  // Script Approvals
  getScriptApprovals() {
    const raw = localStorage.getItem(STORAGE_KEYS.APPROVALS);
    if (!raw) {
      const defaults = {};
      CAMPAIGN_DATA.videos.forEach(v => {
        defaults[v.id] = true; // By default scripts are approved
      });
      return defaults;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  },
  setScriptApproval(videoId, isApproved) {
    const approvals = this.getScriptApprovals();
    approvals[videoId] = isApproved;
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(approvals));
    this.pushStateToCloud();
  },

  // Comments & Discussions
  getComments() {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    if (!raw) {
      return [...CAMPAIGN_DATA.initialComments];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [...CAMPAIGN_DATA.initialComments];
    }
  },
  saveComments(comments) {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    this.pushStateToCloud();
  },
  addComment(comment) {
    const comments = this.getComments();
    comments.unshift(comment);
    this.saveComments(comments);
    return comments;
  },
  addReply(commentId, reply) {
    const comments = this.getComments();
    const target = comments.find(c => c.id === commentId);
    if (target) {
      if (!target.replies) target.replies = [];
      target.replies.push(reply);
      this.saveComments(comments);
    }
    return comments;
  },
  toggleCommentResolved(commentId) {
    const comments = this.getComments();
    const target = comments.find(c => c.id === commentId);
    if (target) {
      target.resolved = !target.resolved;
      this.saveComments(comments);
    }
    return comments;
  },

  // IndexedDB Audio Vault (Local + Cloud Hybrid)
  async saveAudioTake(takeData) {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(takeData);
      req.onsuccess = () => resolve(takeData);
      req.onerror = () => reject(req.error);
    });
  },

  async getAudioTakesByVideo(videoId) {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('videoId');
      const req = index.getAll(videoId);
      req.onsuccess = () => {
        const sorted = (req.result || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        resolve(sorted);
      };
      req.onerror = () => reject(req.error);
    });
  },

  async getAllAudioTakes() {
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async deleteAudioTake(takeId, cloudUrl = null) {
    if (cloudUrl) {
      fetch(`/api/upload?url=${encodeURIComponent(cloudUrl)}`, { method: 'DELETE' }).catch(() => {});
    }
    const db = await openAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(takeId);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  },

  // Reset all state to defaults
  async resetAll() {
    localStorage.removeItem(STORAGE_KEYS.STATUSES);
    localStorage.removeItem(STORAGE_KEYS.APPROVALS);
    localStorage.removeItem(STORAGE_KEYS.COMMENTS);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    const db = await openAudioDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    this.pushStateToCloud();
  }
};
