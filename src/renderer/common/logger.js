import constant from "@/common/constant.js"

let shadow = null
if (constant.IS_ELECTRON) {
  shadow = (await import("electron-log/renderer")).default;
}

class Logger {
  constructor() {
    this.shadow = shadow
  }

  write(level, ...args) {
    // console: trace, log, info, warn, error
    // electron-log: silly, debug, verbose, log, info, warn, error
    if (level === "wran") level = "warn";
    if (["log", "info", "warn", "error"].includes(level)) {
      if (this.shadow) {
        this.shadow[level](...args)
      }
      console[level](...args)
    }
  }

  info(...args) {
    this.write("info", ...args)
  }

  warn(...args) {
    this.write("warn", ...args)
  }

  error(...args) {
    this.write("error", ...args)
  }
};

export default new Logger()