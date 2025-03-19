import env from "../utils/env.js";
import setting from "../store/settings.js";
import cache from "../store/cache.js";

console.log(env);

console.log(setting.get("settings.language"));
console.log(setting.get("settings.language", "en"));
setting.set("settings.language", "zh-CN");
console.log(setting.get("settings.language", "en"));

console.log(cache.get("WindowId", 0));
cache.set("WindowId", 1);
console.log(cache.get("WindowId", 0));
