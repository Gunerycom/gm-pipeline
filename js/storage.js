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

// Safe LocalStorage memory fallback for Incognito/restricted browsers
const memStorage = {};

function safeGet(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = window.localStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch {
    // Storage access denied / private browsing
  }
  return memStorage[key] || null;
}

function safeSet(key, val) {
  memStorage[key] = String(val);
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, String(val));
    }
  } catch {
    // Storage access denied / private browsing
  }
}

function safeRemove(key) {
  delete memStorage[key];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Storage access denied / private browsing
  }
}

// In-memory fallback for audio takes if IndexedDB is blocked
let memTakes = [];

// Initialize IndexedDB with safe catch
function openAudioDB() {
  return new Promise((resolve) => {
    try {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return resolve(null);
      }
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        try {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            store.createIndex('videoId', 'videoId', { unique: false });
            store.createIndex('timestamp', 'timestamp', { unique: false });
          }
        } catch (e) {
          console.warn('IndexedDB upgrade issue:', e);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export const Storage = {
  // Settings & UI state
  getLang() {
    return safeGet(STORAGE_KEYS.LANG) || 'es';
  },
  setLang(lang) {
    safeSet(STORAGE_KEYS.LANG, lang);
  },

  getTheme() {
    return safeGet(STORAGE_KEYS.THEME) || 'light';
  },
  setTheme(theme) {
    safeSet(STORAGE_KEYS.THEME, theme);
  },

  getRole() {
    return safeGet(STORAGE_KEYS.ROLE) || 'client'; // default Dr. Mario
  },
  setRole(role) {
    safeSet(STORAGE_KEYS.ROLE, role);
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
          safeSet(STORAGE_KEYS.STATUSES, JSON.stringify(remote.statuses));
          if (remote.approvals) {
            safeSet(STORAGE_KEYS.APPROVALS, JSON.stringify(remote.approvals));
          }
          if (remote.comments && Array.isArray(remote.comments)) {
            safeSet(STORAGE_KEYS.COMMENTS, JSON.stringify(remote.comments));
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
    const raw = safeGet(STORAGE_KEYS.STATUSES);
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
    safeSet(STORAGE_KEYS.STATUSES, JSON.stringify(statuses));
    this.pushStateToCloud();
  },

  // Script Approvals
  getScriptApprovals() {
    const raw = safeGet(STORAGE_KEYS.APPROVALS);
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
    safeSet(STORAGE_KEYS.APPROVALS, JSON.stringify(approvals));
    this.pushStateToCloud();
  },

  // Comments & Discussions
  getComments() {
    const raw = safeGet(STORAGE_KEYS.COMMENTS);
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
    safeSet(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
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
    try {
      const db = await openAudioDB();
      if (!db) {
        memTakes = memTakes.filter(t => t.id !== takeData.id);
        memTakes.push(takeData);
        return takeData;
      }
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const req = store.put(takeData);
          req.onsuccess = () => resolve(takeData);
          req.onerror = () => {
            memTakes.push(takeData);
            resolve(takeData);
          };
        } catch {
          memTakes.push(takeData);
          resolve(takeData);
        }
      });
    } catch {
      memTakes.push(takeData);
      return takeData;
    }
  },

  async getAudioTakesByVideo(videoId) {
    try {
      const db = await openAudioDB();
      if (!db) {
        return memTakes.filter(t => t.videoId === Number(videoId)).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const index = store.index('videoId');
          const req = index.getAll(Number(videoId));
          req.onsuccess = () => {
            const sorted = (req.result || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            resolve(sorted);
          };
          req.onerror = () => {
            resolve(memTakes.filter(t => t.videoId === Number(videoId)));
          };
        } catch {
          resolve(memTakes.filter(t => t.videoId === Number(videoId)));
        }
      });
    } catch {
      return memTakes.filter(t => t.videoId === Number(videoId));
    }
  },

  async getAllAudioTakes() {
    try {
      const db = await openAudioDB();
      if (!db) {
        return [...memTakes];
      }
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([...memTakes]);
        } catch {
          resolve([...memTakes]);
        }
      });
    } catch {
      return [...memTakes];
    }
  },

  async deleteAudioTake(takeId, cloudUrl = null) {
    if (cloudUrl) {
      try {
        fetch(`/api/upload?url=${encodeURIComponent(cloudUrl)}`, { method: 'DELETE' }).catch(() => {});
      } catch {}
    }
    memTakes = memTakes.filter(t => t.id !== takeId);
    try {
      const db = await openAudioDB();
      if (!db) return true;
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const req = store.delete(takeId);
          req.onsuccess = () => resolve(true);
          req.onerror = () => resolve(true);
        } catch {
          resolve(true);
        }
      });
    } catch {
      return true;
    }
  },

  // Reset all state to defaults
  async resetAll() {
    safeRemove(STORAGE_KEYS.STATUSES);
    safeRemove(STORAGE_KEYS.APPROVALS);
    safeRemove(STORAGE_KEYS.COMMENTS);
    safeRemove(STORAGE_KEYS.NOTES);
    memTakes = [];
    try {
      const db = await openAudioDB();
      if (db) {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).clear();
      }
    } catch {}
    this.pushStateToCloud();
  }
};
