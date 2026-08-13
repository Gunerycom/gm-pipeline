// GM x GG Pipeline - Comments, Feedback & Review System
import { Storage } from './storage.js';
import { TRANSLATIONS } from './i18n.js';

export class CommentManager {
  constructor(options = {}) {
    this.onUpdate = options.onUpdate || (() => {});
  }

  getCommentsForVideo(videoId) {
    const all = Storage.getComments();
    return all.filter(c => c.videoId === Number(videoId));
  }

  getAllComments() {
    return Storage.getComments();
  }

  addComment({ videoId, text, timecode = null, authorRole = 'client' }) {
    const authorName = authorRole === 'client' 
      ? 'Dr. Mario Pinilla (Grupo Médico)' 
      : 'Gunery Creative Team (Agencia)';

    const newComment = {
      id: `c-${Date.now()}`,
      videoId: Number(videoId),
      authorRole,
      authorName,
      timestamp: new Date().toISOString(),
      text: text.trim(),
      timecode: timecode ? timecode.trim() : null,
      resolved: false,
      replies: []
    };

    const updated = Storage.addComment(newComment);
    this.onUpdate(updated);
    return newComment;
  }

  addReply({ commentId, text, authorRole = 'agency' }) {
    const authorName = authorRole === 'client' 
      ? 'Dr. Mario Pinilla (Grupo Médico)' 
      : 'Gunery Creative Team (Agencia)';

    const newReply = {
      id: `r-${Date.now()}`,
      authorRole,
      authorName,
      timestamp: new Date().toISOString(),
      text: text.trim()
    };

    const updated = Storage.addReply(commentId, newReply);
    this.onUpdate(updated);
    return newReply;
  }

  toggleResolved(commentId) {
    const updated = Storage.toggleCommentResolved(commentId);
    this.onUpdate(updated);
    return updated;
  }

  renderCommentThreadHTML(comment, lang = 'es', currentRole = 'client') {
    const t = TRANSLATIONS[lang].comments;
    const isClientAuthor = comment.authorRole === 'client';
    const roleBadgeClass = isClientAuthor ? 'badge-client' : 'badge-agency';
    const roleBadgeText = isClientAuthor 
      ? (lang === 'es' ? 'Cliente • Grupo Médico' : 'Client • Grupo Médico') 
      : (lang === 'es' ? 'Agencia • Gunery' : 'Agency • Gunery');
    const dateFormatted = new Date(comment.timestamp).toLocaleString(lang === 'es' ? 'es-CO' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const timecodeHTML = comment.timecode 
      ? `<span class="comment-timecode-tag" title="Timecode">⏱️ ${comment.timecode}</span>` 
      : '';

    const resolvedBadgeHTML = comment.resolved 
      ? `<span class="badge-resolved">✓ ${t.resolvedBadge}</span>` 
      : '';

    const repliesHTML = (comment.replies || []).map(r => {
      const isRClient = r.authorRole === 'client';
      const rDate = new Date(r.timestamp).toLocaleString(lang === 'es' ? 'es-CO' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      return `
        <div class="reply-item ${isRClient ? 'from-client' : 'from-agency'}">
          <div class="reply-header">
            <div class="reply-author">
              <span class="author-dot ${isRClient ? 'dot-client' : 'dot-agency'}"></span>
              <strong>${r.authorName}</strong>
            </div>
            <span class="reply-date">${rDate}</span>
          </div>
          <div class="reply-body">${this.escapeHTML(r.text)}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="comment-card ${comment.resolved ? 'is-resolved' : ''}" data-comment-id="${comment.id}">
        <div class="comment-header">
          <div class="comment-author-info">
            <span class="comment-role-pill ${roleBadgeClass}">${roleBadgeText}</span>
            <strong class="comment-author-name">${comment.authorName}</strong>
            ${timecodeHTML}
          </div>
          <div class="comment-meta-right">
            ${resolvedBadgeHTML}
            <span class="comment-date">${dateFormatted}</span>
          </div>
        </div>
        <div class="comment-content">
          ${this.escapeHTML(comment.text)}
        </div>
        
        <div class="comment-actions-bar">
          <button type="button" class="btn-sm btn-text btn-toggle-reply" data-comment-id="${comment.id}">
            💬 ${t.replyBtn} (${(comment.replies || []).length})
          </button>
          <button type="button" class="btn-sm btn-text btn-toggle-resolved" data-comment-id="${comment.id}">
            ${comment.resolved ? `↩️ ${t.markPending}` : `✓ ${t.markResolved}`}
          </button>
        </div>

        ${comment.replies && comment.replies.length > 0 ? `
          <div class="replies-list">
            ${repliesHTML}
          </div>
        ` : ''}

        <div class="reply-form-container" id="reply-box-${comment.id}" style="display: none;">
          <div class="reply-form">
            <textarea class="reply-input" placeholder="${t.replyPlaceholder}" rows="2"></textarea>
            <div class="reply-form-actions">
              <button type="button" class="btn-xs btn-outline btn-cancel-reply" data-comment-id="${comment.id}">${t.cancelReply}</button>
              <button type="button" class="btn-xs btn-primary btn-submit-reply" data-comment-id="${comment.id}">${t.sendReplyBtn}</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n/g, '<br>');
  }
}
