(function () {
  'use strict';
  const CONFIG = {
    API_ENDPOINT: 'http://localhost:5001/api/events',
    QUEUE_MAX_SIZE: 100,
    DEBOUNCE_DELAY: 100,
    STORAGE_KEY_SESSION: 'analytics_session_id',
    STORAGE_KEY_QUEUE: 'analytics_event_queue',
  };
  function getApiUrl() {
    return CONFIG.API_ENDPOINT;
  }
  function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  const storage = {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        try {
          document.cookie = `${key}=${JSON.stringify(value)};path=/;max-age=86400`;
          return true;
        } catch (cookieError) {
          return false;
        }
      }
    },
    get(key) {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (e) {
        try {
          const cookieStr = document.cookie;
          const match = cookieStr.match(`${key}=([^;]+)`);
          return match ? JSON.parse(match[1]) : null;
        } catch (cookieError) {
          return null;
        }
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        document.cookie = `${key}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
      }
    },
  };
  class SessionManager {
    constructor() {
      this.sessionId = this.getSessionId();
    }
    getSessionId() {
      let sessionId = storage.get(CONFIG.STORAGE_KEY_SESSION);
      if (!sessionId || !this.isValidUUID(sessionId)) {
        sessionId = generateUUID();
        storage.set(CONFIG.STORAGE_KEY_SESSION, sessionId);
      }
      if (sessionId && this.isValidUUID(sessionId)) {
        return sessionId;
      }
      sessionId = generateUUID();
      storage.set(CONFIG.STORAGE_KEY_SESSION, sessionId);
      return sessionId;
    }
    isValidUUID(uuid) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(uuid);
    }
    refresh() {
      this.sessionId = this.getSessionId();
    }
  }
  class EventQueue {
    constructor() {
      this.queue = storage.get(CONFIG.STORAGE_KEY_QUEUE) || [];
    }
    add(event) {
      if (this.queue.length >= CONFIG.QUEUE_MAX_SIZE) {
        console.warn('Event queue full, dropping oldest event');
        this.queue.shift();
      }
      this.queue.push(event);
      this.save();
    }
    save() {
      storage.set(CONFIG.STORAGE_KEY_QUEUE, this.queue);
    }
    clear() {
      this.queue = [];
      this.save();
    }
    getLength() {
      return this.queue.length;
    }
    getAll() {
      return this.queue;
    }
  }
  class AnalyticsTracker {
    constructor() {
      this.sessionManager = new SessionManager();
      this.eventQueue = new EventQueue();
      this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
      this.debounceTimers = {};
      this.init();
    }
    init() {
      if (typeof window === 'undefined') return;
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.flushQueue();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
      this.trackPageView();
      this.trackClicks();
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          this.trackPageView();
        }
      });
      console.log('✅ Analytics Tracker initialized');
      console.log('📝 Session ID:', this.sessionManager.sessionId);
    }
    trackPageView() {
      const event = {
        sessionId: this.sessionManager.sessionId,
        eventType: 'page_view',
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString()
      };
      this.sendEvent(event);
    }
    trackClicks() {
      if (typeof document === 'undefined') return;
      document.addEventListener('click', (e) => {
        const targetId = e.target.id || e.target.className || 'default';
        const debounceKey = 'click_' + targetId;
        if (this.debounceTimers[debounceKey]) {
          return;
        }
        this.debounceTimers[debounceKey] = setTimeout(() => {
          this.debounceTimers[debounceKey] = null;
        }, CONFIG.DEBOUNCE_DELAY);
        const event = {
          sessionId: this.sessionManager.sessionId,
          eventType: 'click',
          pageUrl: window.location.href,
          timestamp: new Date().toISOString(),
          coordinates: {
            x: e.clientX,
            y: e.clientY,
          },
        };
        this.sendEvent(event);
      });
    }
    sendEvent(event) {
      if (this.isOnline) {
        this.sendEventOnline(event);
      } else {
        this.eventQueue.add(event);
        console.warn('📍 Event queued (offline):', event.eventType);
      }
    }
    sendEventOnline(event) {
      const apiUrl = getApiUrl();
      if (typeof fetch === 'undefined') return Promise.resolve();
      return fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })
        .then((response) => {
          if (response.ok) {
            console.log('✅ Event sent:', event.eventType);
          } else {
            console.error('❌ Failed to send event:', response.status);
            this.eventQueue.add(event);
          }
        })
        .catch((error) => {
          console.error('❌ Network error:', error);
          this.eventQueue.add(event);
        });
    }
    flushQueue() {
      if (this.eventQueue.getLength() === 0) {
        return;
      }
      console.log(`🔄 Flushing ${this.eventQueue.getLength()} queued events`);
      const events = this.eventQueue.getAll();
      let sentCount = 0;
      events.forEach((event) => {
        this.sendEventOnline(event).then(() => {
          sentCount++;
          if (sentCount === events.length) {
            this.eventQueue.clear();
            console.log('✅ Queue flushed successfully');
          }
        });
      });
    }
    getSessionId() {
      return this.sessionManager.sessionId;
    }
    refreshSession() {
      this.sessionManager.refresh();
    }
  }
  function initializeTracker() {
    if (window.analyticsTracker) {
      console.warn('⚠️ Analytics Tracker already initialized');
      return;
    }
    window.analyticsTracker = new AnalyticsTracker();
    window.analyticsTrackerAPI = {
      getSessionId: () => window.analyticsTracker.getSessionId(),
      refreshSession: () => window.analyticsTracker.refreshSession(),
      trackPageView: () => window.analyticsTracker.trackPageView(),
    };
  }
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeTracker);
    } else {
      initializeTracker();
    }
  }
})();
