/* eslint-disable */
import Redis from "ioredis";

let redis = new Redis(process.env.REDIS_URL!);

export default class Cache<Key extends string, Value> {
  private _seconds: number;
  constructor(seconds: number) {
    this._seconds = seconds;
  }

  async get(key: Key) {
    const value = await redis.get(key);

    console.log(value);

    if (!value) return null;
    return (await JSON.parse(value,reviver)) as Value;
  }

  async set(key: Key, value: Value) {
    console.log(value);
    await redis.setex(key, this._seconds, JSON.stringify(value,replacer));
  }
}

function replacer(key: any, value: any) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}
function reviver(key: any, value: any) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}
