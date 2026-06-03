import { CACHE_TTL } from './constants.js';

export class TTLCache {
  constructor(defaultTTLms) {
    this.defaultTTLms = defaultTTLms;
    this.store = new Map();
  }

  set(key, value, ttlMs = this.defaultTTLms) {
    const expiresAt = Date.now() + ttlMs;
    this.store.set(key, { value, expiresAt });
  }

  get(key) {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  delete(key) {
    return this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  size() {
    for (const key of this.store.keys()) {
      this.get(key);
    }

    return this.store.size;
  }
}

export const geocodeCache = new TTLCache(CACHE_TTL.GEOCODE);
export const feedCache = new TTLCache(CACHE_TTL.FEED);
export const profileCache = new TTLCache(CACHE_TTL.PROFILE);
export const forumCache = new TTLCache(CACHE_TTL.FORUM);
