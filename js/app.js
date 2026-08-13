// GM x GG Pipeline - Main Application Controller
import { CAMPAIGN_DATA } from './data.js';
import { TRANSLATIONS } from './i18n.js';
import { Storage } from './storage.js';
import { VoiceoverRecorder } from './audioRecorder.js';
import { TeleprompterEngine } from './teleprompter.js';
import { CommentManager } from './comments.js';

class App {
  constructor() {
    this.lang = Storage.getLang();
    this.theme = Storage.getTheme();
    this.role = Storage.getRole(); // 'client' | 'agency'
    this.activeView = 'pipeline'; // 'pipeline' | 'timeline' | 'calendar' | 'teleprompter' | 'discussions'
    this.selectedVideoId = 1;
    this.searchQuery = '';
    this.selectedCategory = 'all';
    
    // Subsystems
    this.comments = new CommentManager({
      onUpdate: () => this.handleCommentsUpdate()
    });
    this.recorder = new VoiceoverRecorder({
      onStateChange: (state) => this.handleRecorderStateChange(state),
      onTimerTick: (sec) => this.handleRecorderTimerTick(sec),
      onVisualizerData: (data) => this.handleVisualizerData(data)
    });
    this.prompter = null;
    this.activeModalTab = 'script'; // 'script' | 'prompter' | 'comments' | 'specs'
    this.prompterFontSize = 26;
    this.prompterSpeed = 1.0;
    this.prompterMirrored = false;
  }

  init() {
    this.applyTheme(this.theme);
    this.renderHeader();
    this.renderWhatsNext();
    this.renderStats();
    this.renderView();
    this.renderMobileNav();
    this.setupGlobalEvents();
    this.startCountdownTimer();
  }

  // --- Theme & Language ---
  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    Storage.setTheme(theme);
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      themeBtn.setAttribute('title', theme === 'dark' ? TRANSLATIONS[this.lang].header.themeLight : TRANSLATIONS[this.lang].header.themeDark);
    }
  }

  toggleTheme() {
    const next = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
  }

  setLanguage(lang) {
    this.lang = lang;
    Storage.setLang(lang);
    this.renderHeader();
    this.renderWhatsNext();
    this.renderStats();
    this.renderView();
    this.renderMobileNav();
    if (document.getElementById('video-modal').classList.contains('open')) {
      this.openVideoModal(this.selectedVideoId, this.activeModalTab);
    }
  }

  setRole(role) {
    this.role = role;
    Storage.setRole(role);
    this.renderHeader();
    this.renderWhatsNext();
    if (document.getElementById('video-modal').classList.contains('open')) {
      this.renderModalComments(this.selectedVideoId);
    }
  }

  t(keyPath) {
    const keys = keyPath.split('.');
    let current = TRANSLATIONS[this.lang];
    for (const k of keys) {
      if (!current || current[k] === undefined) return keyPath;
      current = current[k];
    }
    return current;
  }

  // --- Header Rendering ---
  renderHeader() {
    const headerEl = document.getElementById('app-header');
    if (!headerEl) return;
    const t = TRANSLATIONS[this.lang].header;

    headerEl.innerHTML = `
      <div class="header-inner">
        <div class="brand-partnership">
          <img src="grupomedico-logo-mini.png" alt="Grupo Médico Logo" class="brand-logo-gm" />
          <div class="brand-divider"></div>
          <img src="Gunery Company Logo mail.png" alt="GUNERY Logo" class="brand-logo-gg" />
        </div>

        <div class="header-center-info">
          <div class="header-center-title">${t.centerTitle}</div>
          <div class="header-center-sub">${t.centerSub}</div>
        </div>

        <div class="header-controls">
          <!-- Language Switcher -->
          <button type="button" class="lang-toggle-btn" id="lang-toggle-btn" title="Español / English">
            <span class="lang-opt ${this.lang === 'es' ? 'active' : ''}">ES</span>
            <span>/</span>
            <span class="lang-opt ${this.lang === 'en' ? 'active' : ''}">EN</span>
          </button>

          <!-- Theme Switcher -->
          <button type="button" class="btn-icon" id="theme-toggle-btn" title="${this.theme === 'dark' ? t.themeLight : t.themeDark}">
            ${this.theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    `;

    document.getElementById('lang-toggle-btn')?.addEventListener('click', () => {
      this.setLanguage(this.lang === 'es' ? 'en' : 'es');
    });

    document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  // --- "What's Next" Pulse & Metrics Section ---
  renderWhatsNext() {
    const container = document.getElementById('whats-next-container');
    if (!container) return;
    const t = TRANSLATIONS[this.lang].whatsNext;
    const tStats = TRANSLATIONS[this.lang].stats;
    const statuses = Storage.getVideoStatuses();

    let countApproved = 0;
    let countShooting = 0;
    let countEditing = 0;
    let countPublished = 0;

    Object.values(statuses).forEach(st => {
      if (st === 'script_approved') countApproved++;
      else if (st === 'shooting') countShooting++;
      else if (st === 'editing') countEditing++;
      else if (st === 'published') countPublished++;
    });

    // Nearest upcoming shoot: Aug 15 @ 9:00 AM (Video 1)
    const nextVideo = CAMPAIGN_DATA.videos[0];

    container.innerHTML = `
      <section class="pulse-section">
        <div class="pulse-card">
          <div class="pulse-header">
            <div class="pulse-title-wrap">
              <span class="pulse-indicator-dot"></span>
              <span class="pulse-title">${t.title}</span>
            </div>
            
            <div class="countdown-box" id="next-shoot-countdown" title="${t.nextShoot}">
              <div class="countdown-unit">
                <span class="countdown-num" id="cd-days">01</span>
                <span class="countdown-lbl">${t.daysLeft}</span>
              </div>
              <span class="countdown-sep">:</span>
              <div class="countdown-unit">
                <span class="countdown-num" id="cd-hours">19</span>
                <span class="countdown-lbl">${t.hoursLeft}</span>
              </div>
              <span class="countdown-sep">:</span>
              <div class="countdown-unit">
                <span class="countdown-num" id="cd-mins">30</span>
                <span class="countdown-lbl">${t.minsLeft}</span>
              </div>
            </div>
          </div>

          <div class="pulse-integrated-grid">
            <!-- Next Session Spotlight Card -->
            <div class="next-shoot-card" id="next-shoot-spotlight-card">
              <div class="next-shoot-top">
                <span class="next-shoot-badge">🎬 ${t.nextShoot}</span>
                <span class="next-shoot-time-pill">${nextVideo.shootTime}</span>
              </div>
              <div class="next-shoot-date-row">
                <span class="next-shoot-date-main">${nextVideo.shootDateFormatted[this.lang]}</span>
                <span class="next-shoot-sep">•</span>
                <span class="next-shoot-category">${nextVideo.category[this.lang]}</span>
              </div>
              <div class="next-shoot-video-topic">
                <span class="video-pill-num">#${nextVideo.number}</span>
                <span class="video-pill-title">${nextVideo.topic[this.lang]}</span>
              </div>
              <div class="next-shoot-location">
                <span class="loc-icon">📍</span>
                <span>${nextVideo.location[this.lang]}</span>
              </div>
            </div>

            <!-- Integrated Analytics Metric Cards -->
            <div class="integrated-stats-grid">
              <div class="stat-card">
                <span class="stat-label">${tStats.totalVideos}</span>
                <span class="stat-value">09</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">${tStats.scriptsApproved}</span>
                <span class="stat-value" style="color: var(--color-script);">${countApproved}</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">${tStats.inProduction}</span>
                <span class="stat-value" style="color: var(--color-shoot);">${countShooting}</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">${tStats.inEditing}</span>
                <span class="stat-value" style="color: var(--color-edit);">${countEditing}</span>
              </div>
              <div class="stat-card">
                <span class="stat-label">${tStats.published}</span>
                <span class="stat-value" style="color: var(--color-publish);">${countPublished}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    document.getElementById('next-shoot-spotlight-card')?.addEventListener('click', () => {
      this.openVideoModal(nextVideo.id, 'script');
    });
  }

  startCountdownTimer() {
    const targetDate = new Date('2026-08-15T09:00:00-05:00').getTime();
    const update = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      const daysEl = document.getElementById('cd-days');
      const hoursEl = document.getElementById('cd-hours');
      const minsEl = document.getElementById('cd-mins');

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    };
    update();
    setInterval(update, 30000);
  }

  // --- Campaign Summary Stats Row (merged into pulse) ---
  renderStats() {
    const statsContainer = document.getElementById('stats-container');
    if (statsContainer) statsContainer.innerHTML = '';
  }

  // --- Main View Dispatcher & Filters ---
  renderView() {
    const mainViewContainer = document.getElementById('main-view-container');
    if (!mainViewContainer) return;

    this.renderToolbar();

    if (this.activeView === 'pipeline') {
      this.renderKanbanPipeline(mainViewContainer);
    } else if (this.activeView === 'timeline') {
      this.renderTimelineView(mainViewContainer);
    } else if (this.activeView === 'calendar') {
      this.renderCalendarView(mainViewContainer);
    } else if (this.activeView === 'teleprompter') {
      this.renderPrompterStudioView(mainViewContainer);
    } else if (this.activeView === 'discussions') {
      this.renderDiscussionsView(mainViewContainer);
    }
  }

  renderToolbar() {
    const toolbar = document.getElementById('views-toolbar');
    if (!toolbar) return;
    const tNav = TRANSLATIONS[this.lang].nav;
    const tFil = TRANSLATIONS[this.lang].filters;

    toolbar.innerHTML = `
      <div class="nav-tabs-group">
        <button type="button" class="view-tab-btn ${this.activeView === 'pipeline' ? 'active' : ''}" data-view="pipeline">
          📋 ${tNav.pipeline}
        </button>
        <button type="button" class="view-tab-btn ${this.activeView === 'timeline' ? 'active' : ''}" data-view="timeline">
          ⏳ ${tNav.timeline}
        </button>
        <button type="button" class="view-tab-btn ${this.activeView === 'calendar' ? 'active' : ''}" data-view="calendar">
          📅 ${tNav.calendar}
        </button>
        <button type="button" class="view-tab-btn ${this.activeView === 'teleprompter' ? 'active' : ''}" data-view="teleprompter">
          🎙️ ${tNav.teleprompter}
        </button>
        <button type="button" class="view-tab-btn ${this.activeView === 'discussions' ? 'active' : ''}" data-view="discussions">
          💬 ${tNav.discussions}
        </button>
      </div>

      <div class="filter-search-group">
        <div class="search-input-wrap">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            class="search-input" 
            id="video-search-input" 
            placeholder="${tFil.searchPlaceholder}" 
            value="${this.searchQuery}"
          />
        </div>
        <select class="category-select" id="category-filter-select">
          <option value="all">${tFil.allCategories}</option>
          <option value="brand" ${this.selectedCategory === 'brand' ? 'selected' : ''}>${this.lang === 'es' ? 'Institucional' : 'Brand & Overview'}</option>
          <option value="nutrition" ${this.selectedCategory === 'nutrition' ? 'selected' : ''}>${this.lang === 'es' ? 'Nutrición' : 'Nutrition & Wellness'}</option>
          <option value="services" ${this.selectedCategory === 'services' ? 'selected' : ''}>${this.lang === 'es' ? 'Servicios' : 'Special Services'}</option>
          <option value="education" ${this.selectedCategory === 'education' ? 'selected' : ''}>${this.lang === 'es' ? 'Educación' : 'Education & Prevention'}</option>
          <option value="pediatrics" ${this.selectedCategory === 'pediatrics' ? 'selected' : ''}>${this.lang === 'es' ? 'Pediatría' : 'Pediatrics'}</option>
          <option value="cardiology" ${this.selectedCategory === 'cardiology' ? 'selected' : ''}>${this.lang === 'es' ? 'Cardiología' : 'Cardiology'}</option>
          <option value="ultrasound" ${this.selectedCategory === 'ultrasound' ? 'selected' : ''}>${this.lang === 'es' ? 'Ecografías' : 'Ultrasounds'}</option>
          <option value="tutorial" ${this.selectedCategory === 'tutorial' ? 'selected' : ''}>${this.lang === 'es' ? 'WhatsApp / Citas' : 'WhatsApp / Booking'}</option>
          <option value="trust" ${this.selectedCategory === 'trust' ? 'selected' : ''}>${this.lang === 'es' ? '13+ Años Confianza' : '13+ Yrs Trust'}</option>
        </select>
      </div>
    `;

    toolbar.querySelectorAll('.view-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeView = btn.dataset.view;
        this.renderView();
        this.renderMobileNav();
      });
    });

    const searchInput = document.getElementById('video-search-input');
    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.renderView();
    });

    const catSelect = document.getElementById('category-filter-select');
    catSelect?.addEventListener('change', (e) => {
      this.selectedCategory = e.target.value;
      this.renderView();
    });
  }

  renderMobileNav() {
    const nav = document.getElementById('mobile-bottom-nav');
    if (!nav) return;
    const t = TRANSLATIONS[this.lang].nav;

    nav.innerHTML = `
      <button type="button" class="bottom-nav-item ${this.activeView === 'pipeline' ? 'active' : ''}" data-view="pipeline">
        <span class="nav-icon">📋</span>
        <span>${t.pipeline}</span>
      </button>
      <button type="button" class="bottom-nav-item ${this.activeView === 'timeline' ? 'active' : ''}" data-view="timeline">
        <span class="nav-icon">⏳</span>
        <span>${t.timeline}</span>
      </button>
      <button type="button" class="bottom-nav-item ${this.activeView === 'calendar' ? 'active' : ''}" data-view="calendar">
        <span class="nav-icon">📅</span>
        <span>${t.calendar}</span>
      </button>
      <button type="button" class="bottom-nav-item ${this.activeView === 'teleprompter' ? 'active' : ''}" data-view="teleprompter">
        <span class="nav-icon">🎙️</span>
        <span>Prompter</span>
      </button>
      <button type="button" class="bottom-nav-item ${this.activeView === 'discussions' ? 'active' : ''}" data-view="discussions">
        <span class="nav-icon">💬</span>
        <span>Feedback</span>
      </button>
    `;

    nav.querySelectorAll('.bottom-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeView = btn.dataset.view;
        this.renderView();
        this.renderMobileNav();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // --- Filtered Videos Helper ---
  getFilteredVideos() {
    return CAMPAIGN_DATA.videos.filter(v => {
      if (this.selectedCategory !== 'all' && v.categoryKey !== this.selectedCategory) {
        return false;
      }
      if (this.searchQuery) {
        const topic = (v.topic[this.lang] || '').toLowerCase();
        const number = v.number.toLowerCase();
        const notes = (v.notes[this.lang] || '').toLowerCase();
        const fullScript = v.script.map(s => s[this.lang] || '').join(' ').toLowerCase();
        return topic.includes(this.searchQuery) || number.includes(this.searchQuery) || notes.includes(this.searchQuery) || fullScript.includes(this.searchQuery);
      }
      return true;
    });
  }

  // --- View 1: Kanban Pipeline ---
  async renderKanbanPipeline(container) {
    const stages = CAMPAIGN_DATA.pipelineStages;
    const statuses = Storage.getVideoStatuses();
    const filteredVideos = this.getFilteredVideos();
    const allTakes = await Storage.getAllAudioTakes();
    const allComments = Storage.getComments();
    const t = TRANSLATIONS[this.lang].pipeline;

    let html = `<div class="kanban-board">`;

    stages.forEach(st => {
      const stageVideos = filteredVideos.filter(v => (statuses[v.id] || 'script_approved') === st.key);

      html += `
        <div class="kanban-col" data-stage="${st.key}">
          <div class="kanban-col-header">
            <div class="kanban-col-title-wrap">
              <span class="col-stage-dot dot-${st.color}"></span>
              <span class="kanban-col-title">${st.title[this.lang]}</span>
            </div>
            <span class="kanban-col-count">${stageVideos.length}</span>
          </div>
          <div class="kanban-col-cards">
      `;

      if (stageVideos.length === 0) {
        html += `
          <div style="padding: 1.5rem 0.5rem; text-align: center; color: var(--text-muted); font-size: 0.75rem;">
            —
          </div>
        `;
      } else {
        stageVideos.forEach(v => {
          const videoTakes = allTakes.filter(take => take.videoId === v.id);
          const videoComments = allComments.filter(c => c.videoId === v.id);

          html += `
            <div class="video-card" data-video-id="${v.id}" draggable="true">
              <div class="video-card-top">
                <span class="video-card-num">#${v.number}</span>
                <span class="video-card-category">${v.category[this.lang]}</span>
              </div>
              
              <div class="video-card-title">${v.topic[this.lang]}</div>

              <div class="video-card-meta-grid">
                <div class="video-card-meta-item">
                  <span class="meta-icon">🎬</span>
                  <span><strong>${v.shootDateFormatted[this.lang]}</strong> (${v.shootTime})</span>
                </div>
                <div class="video-card-meta-item">
                  <span class="meta-icon">🚀</span>
                  <span><strong>${v.publishDateFormatted[this.lang]}</strong></span>
                </div>
              </div>

              <div class="video-card-footer">
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  ${videoTakes.length > 0 ? `
                    <span class="takes-pill" title="${videoTakes.length} ${t.audioTakesCount}">
                      🎙️ ${videoTakes.length}
                    </span>
                  ` : ''}
                  <span class="comments-pill" title="${this.lang === 'es' ? 'Comentarios' : 'Comments'}">
                    💬 ${videoComments.length}
                  </span>
                </div>

                <select class="stage-quick-select" data-video-id="${v.id}" onclick="event.stopPropagation()">
                  ${stages.map(s => `
                    <option value="${s.key}" ${statuses[v.id] === s.key ? 'selected' : ''}>
                      ${s.shortTitle[this.lang]}
                    </option>
                  `).join('')}
                </select>
              </div>
            </div>
          `;
        });
      }

      html += `
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Drag and Drop implementation
    container.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('dragstart', (e) => {
        const vidId = card.dataset.videoId;
        e.dataTransfer.setData('text/plain', vidId);
        e.dataTransfer.effectAllowed = 'move';
        card.classList.add('dragging');
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        container.querySelectorAll('.kanban-col').forEach(c => c.classList.remove('drag-over'));
      });

      // Card click opens modal
      card.addEventListener('click', (e) => {
        if (e.target.closest('.stage-quick-select')) return;
        const vidId = parseInt(card.dataset.videoId, 10);
        this.openVideoModal(vidId, 'script');
      });
    });

    // Column Drop zones
    container.querySelectorAll('.kanban-col').forEach(col => {
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        col.classList.add('drag-over');
      });

      col.addEventListener('dragleave', (e) => {
        // Only remove if leaving the column itself
        if (!col.contains(e.relatedTarget)) {
          col.classList.remove('drag-over');
        }
      });

      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('drag-over');
        const vidIdStr = e.dataTransfer.getData('text/plain');
        if (!vidIdStr) return;
        const vidId = parseInt(vidIdStr, 10);
        const targetStage = col.dataset.stage;

        if (targetStage) {
          Storage.setVideoStatus(vidId, targetStage);
          this.renderWhatsNext();
          this.renderKanbanPipeline(container);
        }
      });
    });

    // Quick stage change dropdown events
    container.querySelectorAll('.stage-quick-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const vidId = parseInt(sel.dataset.videoId, 10);
        const newStage = e.target.value;
        Storage.setVideoStatus(vidId, newStage);
        this.renderWhatsNext();
        this.renderKanbanPipeline(container);
      });
    });
  }

  // --- View 2: Timeline Gantt Roadmap ---
  renderTimelineView(container) {
    const t = TRANSLATIONS[this.lang].timeline;
    const videos = this.getFilteredVideos();
    const statuses = Storage.getVideoStatuses();

    let html = `
      <div class="timeline-view-wrapper">
        <div class="timeline-header">
          <h2 class="timeline-title">${t.title}</h2>
          <p class="timeline-subtitle">${t.subtitle}</p>
        </div>
        <div class="timeline-track-list">
    `;

    videos.forEach(v => {
      const currentStatus = statuses[v.id] || 'script_approved';
      const stageObj = CAMPAIGN_DATA.pipelineStages.find(s => s.key === currentStatus);

      html += `
        <div class="timeline-row" data-video-id="${v.id}">
          <div class="timeline-video-meta">
            <span class="timeline-video-num">Video #${v.number} • ${v.category[this.lang]}</span>
            <span class="timeline-video-title">${v.topic[this.lang]}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">
              🎬 ${v.shootDateFormatted[this.lang]} (${v.shootTime}) ➔ 🚀 ${v.publishDateFormatted[this.lang]}
            </span>
          </div>

          <div class="timeline-bar-container">
            <div class="timeline-progress-bar bar-${stageObj.color}" style="width: 100%;">
              <span>${this.lang === 'es' ? 'Fase Actual' : 'Current Stage'}: ${stageObj.title[this.lang]} (${this.lang === 'es' ? 'Edición ~4 días' : 'Editing ~4 days'})</span>
            </div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;

    container.querySelectorAll('.timeline-row').forEach(row => {
      row.addEventListener('click', () => {
        const vidId = parseInt(row.dataset.videoId, 10);
        this.openVideoModal(vidId, 'script');
      });
    });
  }

  // --- View 3: Master Calendar View ---
  renderCalendarView(container) {
    const t = TRANSLATIONS[this.lang].calendar;
    const days = CAMPAIGN_DATA.campaign.shootingDays;

    let html = `
      <div class="calendar-view-wrapper">
        <div class="calendar-legend-bar">
          <div class="legend-item">
            <span class="col-stage-dot dot-amber"></span>
            <span>${t.legendShoot}</span>
          </div>
          <div class="legend-item">
            <span class="col-stage-dot dot-purple"></span>
            <span>${t.legendPost}</span>
          </div>
          <div class="legend-item">
            <span class="col-stage-dot dot-emerald"></span>
            <span>${t.legendPublish}</span>
          </div>
        </div>

        <div class="calendar-events-grid">
    `;

    days.forEach((d, idx) => {
      const dayVideos = CAMPAIGN_DATA.videos.filter(v => d.videos.includes(v.id));

      html += `
        <div class="shoot-day-card ${idx === 0 ? 'active-day' : ''}">
          <div class="shoot-day-header">
            <span class="badge badge-amber">${this.lang === 'es' ? 'Jornada' : 'Session'} #${idx + 1}</span>
            <span class="shoot-day-date">${d.label[this.lang]}</span>
          </div>

          <div class="shoot-day-videos-list">
            ${dayVideos.map(v => `
              <div class="calendar-video-item" data-video-id="${v.id}">
                <div class="calendar-video-item-top">
                  <strong>#${v.number} • ${v.shootTime}</strong>
                  <span style="color: var(--color-publish); font-weight: 600;">${this.lang === 'es' ? 'Publica' : 'Publishes'}: ${v.publishDateFormatted[this.lang]}</span>
                </div>
                <div class="calendar-video-title">${v.topic[this.lang]}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;

    container.querySelectorAll('.calendar-video-item').forEach(item => {
      item.addEventListener('click', () => {
        const vidId = parseInt(item.dataset.videoId, 10);
        this.openVideoModal(vidId, 'script');
      });
    });
  }

  // --- View 4: Teleprompter & Recording Studio Hub ---
  async renderPrompterStudioView(container) {
    const t = TRANSLATIONS[this.lang].prompter;
    const currentVideo = CAMPAIGN_DATA.videos.find(v => v.id === this.selectedVideoId) || CAMPAIGN_DATA.videos[0];
    const takes = await Storage.getAudioTakesByVideo(currentVideo.id);

    container.innerHTML = `
      <div class="prompter-studio-container">
        <!-- Video Select Header -->
        <div class="prompter-toolbar">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <select class="category-select" id="prompter-video-picker" style="font-weight: 700;">
              ${CAMPAIGN_DATA.videos.map(v => `
                <option value="${v.id}" ${v.id === currentVideo.id ? 'selected' : ''}>
                  Video #${v.number}: ${v.topic[this.lang]} (${v.duration} min)
                </option>
              `).join('')}
            </select>
          </div>

          <div class="prompter-timer-badge">
            <span id="prompter-timer-display">0:00</span>
            <span class="prompter-timer-max">/ 1:15</span>
          </div>

          <div class="prompter-controls-group">
            <button type="button" class="btn btn-record" id="btn-prompter-record">
              ${t.startRecord}
            </button>
            <button type="button" class="btn btn-secondary" id="btn-prompter-reset">
              ${t.resetPrompter}
            </button>
          </div>
        </div>

        <!-- Audio Live Meter Visualizer -->
        <div class="audio-visualizer-bar">
          <span class="visualizer-label">🎙️ ${t.micVisualizer}</span>
          <div class="visualizer-meter-track">
            <div class="visualizer-meter-fill" id="visualizer-meter-fill"></div>
          </div>
        </div>

        <!-- Prompter Viewport -->
        <div class="prompter-viewport" id="prompter-viewport-hub">
          <!-- Script auto-rendered here -->
        </div>

        <!-- Recorded Audio Takes Section -->
        <div class="takes-vault-section">
          <h4 class="takes-vault-title">🎙️ ${t.takesSaved} (${takes.length})</h4>
          <div class="takes-list" id="prompter-takes-list">
            ${this.renderTakesListHTML(takes, currentVideo)}
          </div>
        </div>
      </div>
    `;

    // Init Prompter Engine
    const prompterContainer = document.getElementById('prompter-viewport-hub');
    this.prompter = new TeleprompterEngine(prompterContainer, {
      onTick: (sec) => {
        const display = document.getElementById('prompter-timer-display');
        if (display) display.textContent = VoiceoverRecorder.formatDuration(sec);
      }
    });
    this.prompter.loadScript(currentVideo.script, this.lang);

    // Bind Controls
    document.getElementById('prompter-video-picker')?.addEventListener('change', (e) => {
      this.selectedVideoId = parseInt(e.target.value, 10);
      this.renderPrompterStudioView(container);
    });

    const recordBtn = document.getElementById('btn-prompter-record');
    recordBtn?.addEventListener('click', async () => {
      if (!this.recorder.isRecording) {
        try {
          await this.recorder.start(currentVideo.id, 75);
          this.prompter.reset();
          this.prompter.play();
          recordBtn.textContent = t.stopRecord;
          recordBtn.classList.add('recording-active');
        } catch (err) {
          alert(t.micError);
        }
      } else {
        this.recorder.stop();
        this.prompter.pause();
        recordBtn.textContent = t.startRecord;
        recordBtn.classList.remove('recording-active');
      }
    });

    document.getElementById('btn-prompter-reset')?.addEventListener('click', () => {
      this.recorder.stop();
      this.prompter.reset();
      recordBtn.textContent = t.startRecord;
      recordBtn.classList.remove('recording-active');
    });

    this.bindTakeActionEvents(document.getElementById('prompter-takes-list'), currentVideo);
  }

  // --- View 5: General Discussions View ---
  renderDiscussionsView(container) {
    const t = TRANSLATIONS[this.lang].comments;
    const allComments = this.comments.getAllComments();

    let html = `
      <div class="comments-container">
        <div class="comments-header">
          <h2>${t.title}</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${t.subtitle}</p>
        </div>

        <div class="comment-input-box">
          <textarea class="comment-textarea" id="general-comment-input" placeholder="${t.newCommentPlaceholder}" rows="3"></textarea>
          <div class="comment-input-footer">
            <div class="timecode-input-group">
              <select class="category-select" id="comment-video-select" style="font-size: 0.8rem;">
                ${CAMPAIGN_DATA.videos.map(v => `
                  <option value="${v.id}">
                    Video #${v.number}: ${v.topic[this.lang]}
                  </option>
                `).join('')}
              </select>
            </div>
            <button type="button" class="btn btn-primary" id="btn-post-general-comment">${t.postCommentBtn}</button>
          </div>
        </div>

        <div class="comments-list" id="general-comments-list">
          ${allComments.map(c => this.comments.renderCommentThreadHTML(c, this.lang, this.role)).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;

    document.getElementById('btn-post-general-comment')?.addEventListener('click', () => {
      const input = document.getElementById('general-comment-input');
      const videoSel = document.getElementById('comment-video-select');
      if (!input || !input.value.trim()) return;

      this.comments.addComment({
        videoId: parseInt(videoSel.value, 10),
        text: input.value,
        authorRole: this.role
      });

      input.value = '';
      this.renderDiscussionsView(container);
    });

    this.bindCommentActionEvents(document.getElementById('general-comments-list'));
  }

  // --- Deep-Dive Video Modal Drawer ---
  async openVideoModal(videoId, initialTab = 'script') {
    this.selectedVideoId = videoId;
    this.activeModalTab = initialTab;
    const video = CAMPAIGN_DATA.videos.find(v => v.id === videoId);
    if (!video) return;

    const modal = document.getElementById('video-modal');
    const t = TRANSLATIONS[this.lang].drawer;
    const approvals = Storage.getScriptApprovals();
    const isApproved = !!approvals[videoId];
    const takes = await Storage.getAudioTakesByVideo(videoId);

    modal.innerHTML = `
      <div class="modal-dialog">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-title-wrap">
            <div class="modal-tag-row">
              <span class="video-card-num">#${video.number}</span>
              <span class="video-card-category">${video.category[this.lang]}</span>
              <span class="badge ${isApproved ? 'badge-emerald' : 'badge-amber'}">
                ${isApproved ? t.approvedBadge : t.pendingBadge}
              </span>
            </div>
            <h3 class="modal-title">${video.topic[this.lang]}</h3>
          </div>

          <button type="button" class="modal-close-btn" id="modal-close-btn">&times;</button>
        </div>

        <!-- Modal Tabs -->
        <div class="modal-tabs-nav">
          <button type="button" class="modal-tab-btn ${this.activeModalTab === 'script' ? 'active' : ''}" data-tab="script">
            📜 ${t.scriptTab}
          </button>
          <button type="button" class="modal-tab-btn ${this.activeModalTab === 'prompter' ? 'active' : ''}" data-tab="prompter">
            🎙️ ${t.prompterTab} (${takes.length})
          </button>
          <button type="button" class="modal-tab-btn ${this.activeModalTab === 'feedback' ? 'active' : ''}" data-tab="feedback">
            💬 ${t.feedbackTab}
          </button>
          <button type="button" class="modal-tab-btn ${this.activeModalTab === 'specs' ? 'active' : ''}" data-tab="specs">
            ⚙️ ${t.productionTab}
          </button>
        </div>

        <!-- Modal Body Content -->
        <div class="modal-body" id="modal-body-content">
          <!-- Rendered via switchTab -->
        </div>
      </div>
    `;

    modal.classList.add('open');

    // Close handler
    document.getElementById('modal-close-btn')?.addEventListener('click', () => {
      this.closeVideoModal();
    });

    // Tab buttons
    modal.querySelectorAll('.modal-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeModalTab = btn.dataset.tab;
        this.renderModalTabContent(video);
      });
    });

    this.renderModalTabContent(video);
  }

  closeVideoModal() {
    const modal = document.getElementById('video-modal');
    modal.classList.remove('open');
    if (this.recorder.isRecording) {
      this.recorder.stop();
    }
    if (this.prompter) {
      this.prompter.pause();
    }
  }

  async renderModalTabContent(video) {
    const body = document.getElementById('modal-body-content');
    if (!body) return;
    const t = TRANSLATIONS[this.lang].drawer;
    const tPrompter = TRANSLATIONS[this.lang].prompter;
    const approvals = Storage.getScriptApprovals();
    const isApproved = !!approvals[video.id];

    if (this.activeModalTab === 'script') {
      body.innerHTML = `
        <!-- Client Approval Gate Bar -->
        <div class="approval-gate-card">
          <div class="approval-gate-info">
            <span>${isApproved ? '✅' : '⏳'}</span>
            <div>
              <div class="approval-status-text">${isApproved ? t.approvedByClient : t.needsRevision}</div>
              <span style="font-size: 0.75rem; color: var(--text-muted);">
                ${this.role === 'client' ? t.clientApprovalHint : t.agencyApprovalHint}
              </span>
            </div>
          </div>
          ${this.role === 'client' ? `
            <button type="button" class="btn btn-sm ${isApproved ? 'btn-outline' : 'btn-teal'}" id="btn-toggle-approval">
              ${isApproved ? t.btnRequestChanges : t.btnApproveScript}
            </button>
          ` : ''}
        </div>

        <!-- Shooting notes & Overlays -->
        <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem; border: 1px solid var(--border-subtle);">
          <strong style="font-size: 0.85rem; color: var(--text-secondary); display: block; margin-bottom: 0.35rem;">
            🎬 ${t.recordingNotes}:
          </strong>
          <p style="font-size: 0.875rem; line-height: 1.45; color: var(--text-primary);">
            ${video.notes[this.lang]}
          </p>
        </div>

        <!-- Voiceover Script Table -->
        <div class="script-table-wrap">
          <table class="script-table">
            <thead>
              <tr>
                <th style="width: 110px;">${t.timecode}</th>
                <th>${t.voiceoverLine}</th>
              </tr>
            </thead>
            <tbody>
              ${video.script.map(line => `
                <tr>
                  <td><span class="timecode-chip">${line.time}</span></td>
                  <td>${line[this.lang] || line.es}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      document.getElementById('btn-toggle-approval')?.addEventListener('click', () => {
        Storage.setScriptApproval(video.id, !isApproved);
        this.openVideoModal(video.id, 'script');
        this.renderStats();
      });

    } else if (this.activeModalTab === 'prompter') {
      const takes = await Storage.getAudioTakesByVideo(video.id);

      body.innerHTML = `
        <div class="prompter-studio-container">
          <div class="prompter-toolbar">
            <div class="prompter-timer-badge">
              <span id="modal-prompter-timer">0:00</span>
              <span class="prompter-timer-max">/ 1:15</span>
            </div>

            <div class="prompter-controls-group">
              <button type="button" class="btn btn-record" id="modal-btn-record">
                ${tPrompter.startRecord}
              </button>
              <button type="button" class="btn btn-secondary" id="modal-btn-reset">
                ${tPrompter.resetPrompter}
              </button>
            </div>
          </div>

          <div class="audio-visualizer-bar">
            <span class="visualizer-label">🎙️ ${tPrompter.micVisualizer}</span>
            <div class="visualizer-meter-track">
              <div class="visualizer-meter-fill" id="modal-visualizer-fill"></div>
            </div>
          </div>

          <div class="prompter-viewport" id="modal-prompter-viewport"></div>

          <div class="takes-vault-section">
            <h4 class="takes-vault-title">🎙️ ${tPrompter.takesSaved} (${takes.length})</h4>
            <div class="takes-list" id="modal-takes-list">
              ${this.renderTakesListHTML(takes, video)}
            </div>
          </div>
        </div>
      `;

      const prompterContainer = document.getElementById('modal-prompter-viewport');
      this.prompter = new TeleprompterEngine(prompterContainer, {
        onTick: (sec) => {
          const display = document.getElementById('modal-prompter-timer');
          if (display) display.textContent = VoiceoverRecorder.formatDuration(sec);
        }
      });
      this.prompter.loadScript(video.script, this.lang);

      const recordBtn = document.getElementById('modal-btn-record');
      recordBtn?.addEventListener('click', async () => {
        if (!this.recorder.isRecording) {
          try {
            await this.recorder.start(video.id, 75);
            this.prompter.reset();
            this.prompter.play();
            recordBtn.textContent = tPrompter.stopRecord;
            recordBtn.classList.add('recording-active');
          } catch (err) {
            alert(tPrompter.micError);
          }
        } else {
          this.recorder.stop();
          this.prompter.pause();
          recordBtn.textContent = tPrompter.startRecord;
          recordBtn.classList.remove('recording-active');
        }
      });

      document.getElementById('modal-btn-reset')?.addEventListener('click', () => {
        this.recorder.stop();
        this.prompter.reset();
        recordBtn.textContent = tPrompter.startRecord;
        recordBtn.classList.remove('recording-active');
      });

      this.bindTakeActionEvents(document.getElementById('modal-takes-list'), video);

    } else if (this.activeModalTab === 'feedback') {
      this.renderModalComments(video.id);

    } else if (this.activeModalTab === 'specs') {
      body.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div class="pulse-col">
            <strong style="font-size: 0.9rem;">📍 ${t.location}</strong>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">${video.location[this.lang]}</p>
          </div>
          <div class="pulse-col">
            <strong style="font-size: 0.9rem;">⏱️ ${t.targetRuntime}</strong>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">${video.duration} min (${this.lang === 'es' ? 'máximo 1:15 min' : 'maximum 1:15 min'})</p>
          </div>
          <div class="pulse-col">
            <strong style="font-size: 0.9rem;">📺 ${t.onScreenOverlays}</strong>
            <ul class="todo-checklist" style="margin-top: 0.4rem;">
              ${video.overlays.map(ov => `<li class="todo-item"><span class="todo-bullet">✓</span> ${ov}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }
  }

  // --- Modal Comments & Discussion ---
  renderModalComments(videoId) {
    const body = document.getElementById('modal-body-content');
    if (!body || this.activeModalTab !== 'feedback') return;
    const t = TRANSLATIONS[this.lang].comments;
    const videoComments = this.comments.getCommentsForVideo(videoId);

    body.innerHTML = `
      <div class="comments-container">
        <div class="comment-input-box">
          <textarea class="comment-textarea" id="modal-comment-input" placeholder="${t.newCommentPlaceholder}" rows="2"></textarea>
          <div class="comment-input-footer">
            <div class="timecode-input-group">
              <span>⏱️ ${t.timecodeOptional}</span>
              <input type="text" class="timecode-input" id="modal-timecode-input" placeholder="0:22" />
            </div>
            <button type="button" class="btn btn-primary" id="btn-modal-post-comment">${t.postCommentBtn}</button>
          </div>
        </div>

        <div class="comments-list" id="modal-comments-list">
          ${videoComments.length === 0 ? `
            <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
              ${t.noComments}
            </div>
          ` : videoComments.map(c => this.comments.renderCommentThreadHTML(c, this.lang, this.role)).join('')}
        </div>
      </div>
    `;

    document.getElementById('btn-modal-post-comment')?.addEventListener('click', () => {
      const input = document.getElementById('modal-comment-input');
      const timeInput = document.getElementById('modal-timecode-input');
      if (!input || !input.value.trim()) return;

      this.comments.addComment({
        videoId,
        text: input.value,
        timecode: timeInput ? timeInput.value : null,
        authorRole: this.role
      });

      this.renderModalComments(videoId);
    });

    this.bindCommentActionEvents(document.getElementById('modal-comments-list'));
  }

  // --- HTML Generator for Audio Takes ---
  renderTakesListHTML(takes, video) {
    const t = TRANSLATIONS[this.lang].prompter;
    if (!takes || takes.length === 0) {
      return `<p style="font-size: 0.85rem; color: var(--text-muted);">${t.noTakesYet}</p>`;
    }

    return takes.map((take, idx) => {
      const dur = VoiceoverRecorder.formatDuration(take.durationSec || 75);
      const waUrl = VoiceoverRecorder.getWhatsAppShareUrl(video, take, this.lang);
      const audioBlobUrl = URL.createObjectURL(take.blob);

      return `
        <div class="take-item-card" data-take-id="${take.id}">
          <div class="take-meta">
            <span class="take-num-badge">${t.takeLabel} #${take.takeNumber || (takes.length - idx)}</span>
            <span class="take-duration">⏱️ ${dur}</span>
            <audio controls src="${audioBlobUrl}" style="height: 32px; max-width: 200px;"></audio>
          </div>

          <div class="take-actions">
            <button type="button" class="btn btn-xs btn-outline btn-download-take" data-take-id="${take.id}" title="${t.downloadAudio}">
              💾 ${t.downloadAudio}
            </button>
            <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-xs btn-teal" title="${t.sendWhatsApp}">
              📲 WhatsApp
            </a>
            <button type="button" class="btn btn-xs btn-text btn-delete-take" data-take-id="${take.id}" title="${t.deleteTake}" style="color: var(--color-danger);">
              🗑️
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  bindTakeActionEvents(container, video) {
    if (!container) return;

    container.querySelectorAll('.btn-download-take').forEach(btn => {
      btn.addEventListener('click', async () => {
        const takeId = btn.dataset.takeId;
        const takes = await Storage.getAudioTakesByVideo(video.id);
        const take = takes.find(t => t.id === takeId);
        if (take) VoiceoverRecorder.downloadTake(take);
      });
    });

    container.querySelectorAll('.btn-delete-take').forEach(btn => {
      btn.addEventListener('click', async () => {
        const takeId = btn.dataset.takeId;
        const confirmMsg = this.lang === 'es' ? '¿Eliminar esta toma de audio?' : 'Delete this audio take?';
        if (confirm(confirmMsg)) {
          await Storage.deleteAudioTake(takeId);
          if (this.activeModalTab === 'prompter') {
            this.renderModalTabContent(video);
          } else {
            this.renderPrompterStudioView(document.getElementById('main-view-container'));
          }
        }
      });
    });
  }

  bindCommentActionEvents(container) {
    if (!container) return;

    // Toggle reply form
    container.querySelectorAll('.btn-toggle-reply').forEach(btn => {
      btn.addEventListener('click', () => {
        const cid = btn.dataset.commentId;
        const box = document.getElementById(`reply-box-${cid}`);
        if (box) {
          box.style.display = box.style.display === 'none' ? 'block' : 'none';
        }
      });
    });

    // Cancel reply
    container.querySelectorAll('.btn-cancel-reply').forEach(btn => {
      btn.addEventListener('click', () => {
        const cid = btn.dataset.commentId;
        const box = document.getElementById(`reply-box-${cid}`);
        if (box) box.style.display = 'none';
      });
    });

    // Submit reply
    container.querySelectorAll('.btn-submit-reply').forEach(btn => {
      btn.addEventListener('click', () => {
        const cid = btn.dataset.commentId;
        const box = document.getElementById(`reply-box-${cid}`);
        const input = box?.querySelector('.reply-input');
        if (!input || !input.value.trim()) return;

        this.comments.addReply({
          commentId: cid,
          text: input.value,
          authorRole: this.role
        });

        if (document.getElementById('video-modal').classList.contains('open')) {
          this.renderModalComments(this.selectedVideoId);
        } else {
          this.renderDiscussionsView(document.getElementById('main-view-container'));
        }
      });
    });

    // Toggle resolved
    container.querySelectorAll('.btn-toggle-resolved').forEach(btn => {
      btn.addEventListener('click', () => {
        const cid = btn.dataset.commentId;
        this.comments.toggleResolved(cid);
        if (document.getElementById('video-modal').classList.contains('open')) {
          this.renderModalComments(this.selectedVideoId);
        } else {
          this.renderDiscussionsView(document.getElementById('main-view-container'));
        }
      });
    });
  }

  // --- Recorder Callbacks ---
  async handleRecorderStateChange(state) {
    if (!state.isRecording && state.hasTake && state.blob) {
      const takes = await Storage.getAudioTakesByVideo(this.selectedVideoId);
      const takeNumber = takes.length + 1;
      await this.recorder.saveCurrentTake(this.selectedVideoId, takeNumber, this.role);
      
      const currentVideo = CAMPAIGN_DATA.videos.find(v => v.id === this.selectedVideoId);
      if (document.getElementById('video-modal').classList.contains('open')) {
        this.renderModalTabContent(currentVideo);
      } else if (this.activeView === 'teleprompter') {
        this.renderPrompterStudioView(document.getElementById('main-view-container'));
      }
    }
  }

  handleRecorderTimerTick(sec) {
    const hubTimer = document.getElementById('prompter-timer-display');
    const modalTimer = document.getElementById('modal-prompter-timer');
    const formatted = VoiceoverRecorder.formatDuration(sec);
    if (hubTimer) hubTimer.textContent = formatted;
    if (modalTimer) modalTimer.textContent = formatted;
  }

  handleVisualizerData(data) {
    const hubMeter = document.getElementById('visualizer-meter-fill');
    const modalMeter = document.getElementById('modal-visualizer-fill');
    if (hubMeter) hubMeter.style.width = `${data.volume}%`;
    if (modalMeter) modalMeter.style.width = `${data.volume}%`;
  }

  handleCommentsUpdate() {
    this.renderStats();
  }

  // --- Settings & Reset Dialog ---
  showSettingsDialog() {
    const t = TRANSLATIONS[this.lang].header;
    const isReset = confirm(`⚙️ ${t.exportData} / ${t.resetData}\n\n¿Deseas restablecer todos los datos del portal a los valores iniciales? (Esto no borra los guiones ni el calendario base).`);
    if (isReset) {
      Storage.resetAll().then(() => {
        location.reload();
      });
    }
  }

  setupGlobalEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeVideoModal();
      }
    });

    document.getElementById('video-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'video-modal') {
        this.closeVideoModal();
      }
    });
  }
}

// Instantiate on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});
