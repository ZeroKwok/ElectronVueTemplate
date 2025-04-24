import { isDeepStrictEqual } from 'node:util';
import { getProperty, hasProperty, setProperty, deleteProperty, } from 'dot-prop';

class Cache {
  constructor() {
    this._store = {};
    this._events = new EventTarget();
  }

  has(key) {
    return hasProperty(this._store, key);
  }

  set(key, value) {
    const oldValue = this.get(key, undefined);
    if (oldValue === value)
      return this;
    setProperty(this._store, key, value);
    this._change();
    return this;
  }

  get(key, defaultValue) {
    return getProperty(this._store, key, defaultValue);
  }

  delete(key) {
    if (this.has(key)) {
      deleteProperty(this._store, key);
      this._change();
      return true;
    }
    return false;
  }

  clear() {
    this._store = {};
    this._change();
    return this;
  }

  onChange(key, callback) {
    return this._handleChange(() => structuredClone(this.get(key)), callback);
  }

  _handleChange(getter, callback) {
    let currentValue = getter();
    const onChange = () => {
      const oldValue = currentValue;
      const newValue = getter();
      if (isDeepStrictEqual(newValue, oldValue)) {
        return;
      }
      currentValue = newValue;
      callback.call(this, newValue, oldValue);
    };
    this._events.addEventListener('change', onChange);
    return () => {
      this._events.removeEventListener('change', onChange);
    };
  }

  _change() {
    this._events.dispatchEvent(new Event('change'));
  }
};

export default new Cache();