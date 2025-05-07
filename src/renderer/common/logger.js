import constant from "@/common/constant.js"

class Logger {
  constructor() {
    this.shadow = null;
    if (constant.IS_ELECTRON) {
      import("./electron-log-wrapper.js")
        .then((module) => {
          this.shadow = module.default.scope("renderer");
        })
    }
  }

  write(level, ...args) {
    // console: trace, log, info, warn, error
    // electron-log: silly, debug, verbose, log, info, warn, error
    ["trace", "log", "info", "warn", "error"].includes(level) || (level = "log");
    if (this.shadow)
      "trace" === level && (level = "debug"), this.shadow[level](...args)
    else
      console[level](...args)
  }

  trace(...args) {
    this.write("trace", ...args)
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