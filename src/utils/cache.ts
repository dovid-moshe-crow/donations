/* eslint-disable */


export default class Cache<Key, Value> {
    private _cache: Map<Key, { value: Value; time: Date }>;
    private _time: number;
    constructor(time: number) {
      this._cache = new Map();
      this._time = time;
    }
  
    has(key: Key) {
      return (
        this._cache.has(key) &&
        Date.now() - this._cache.get(key)!.time.getTime() < this._time
      );
    }
  
    get(key: Key) {
      return this._cache.get(key)?.value;
    }
  
    set(key: Key, value: Value) {
      this._cache.set(key, { time: new Date(), value });
    }
  }