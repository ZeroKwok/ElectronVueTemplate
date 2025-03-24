class Cache {
  constructor() {
    this._store = new Map();
    this._listeners = new Map();
  }

  set(key, value) {
    const oldValue = this._store.get(key);
    if (oldValue === value) 
      return this;
    this._store.set(key, value);
    this._emit('set', key, value, oldValue);
    return this;
  }

  get(key, defaultValue) {
    if (this._store.has(key))
      return this._store.get(key);
    return defaultValue;
  }

  delete(key) {
    if (this._store.has(key)) {
      const oldValue = this._store.get(key);
      this._store.delete(key);
      this._emit('delete', key, undefined, oldValue);
      return true;
    }
    return false;
  }

  on(event, callback) {
    if (!this._listeners.has(event))
      this._listeners.set(event, new Set());
    this._listeners.get(event).add(callback);
    return this;
  }

  off(event, callback) {
    if (this._listeners.has(event))
      this._listeners.get(event).delete(callback);
    return this;
  }

  _emit(event, key, value, oldValue) {
    const listeners = this._listeners.get(event);
    if (listeners)
      listeners.forEach(cb => cb(key, value, oldValue));
  }
};

export default new Cache();