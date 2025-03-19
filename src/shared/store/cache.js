class Cache extends Map {
    get(key, defaultValue) {
        if (this.has(key)) {
            return super.get(key);
        }
        return defaultValue;
    }
}

export default new Cache()