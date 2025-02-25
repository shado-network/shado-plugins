// src/libs/node-console.ts
var NodeConsoleClient = class {
  constructor(config) {
    this.colors = {
      fg: {
        black: "\x1B[30m",
        red: "\x1B[31m",
        green: "\x1B[32m",
        yellow: "\x1B[33m",
        blue: "\x1B[34m",
        magenta: "\x1B[35m",
        cyan: "\x1B[36m",
        white: "\x1B[37m",
        gray: "\x1B[90m",
        //
        default: "\x1B[37m",
        clear: "\x1B[0m"
      },
      bg: {
        black: "\x1B[40m",
        red: "\x1B[41m",
        green: "\x1B[42m",
        yellow: "\x1B[43m",
        blue: "\x1B[44m",
        magenta: "\x1B[45m",
        cyan: "\x1B[46m",
        white: "\x1B[47m",
        gray: "\x1B[100m",
        //
        default: "\x1B[47m",
        clear: ""
      }
    };
    this.icons = {
      success: "\u{1F7E2}",
      warning: "\u{1F7E0}",
      danger: "\u{1F534}",
      info: "\u{1F535}",
      //
      default: "\u26AA\uFE0F"
    };
    this._getIcon = (type) => {
      const icon = this.icons[type.toLowerCase()] || this.icons.default;
      if (this.config.showIcon) {
        return `${icon} `;
      } else {
        return "";
      }
    };
    this._setConsoleColor = (fgColorName = "", bgColorName = "") => {
      const fgColor = this.colors.fg[fgColorName.toLowerCase()] || this.colors.fg.white;
      const bgColor = this.colors.bg[bgColorName.toLowerCase()] || this.colors.bg.clear;
      return `${fgColor}${bgColor}`;
    };
    this._resetConsoleColor = () => {
      return this.colors.fg.clear;
    };
    this._composeConsoleMessage = (loggerMessage) => {
      var _a, _b, _c, _d;
      let typeStyling;
      let icon;
      let headerStyling;
      let header;
      switch (loggerMessage.type) {
        case "SUCCESS":
          typeStyling = this._setConsoleColor("black", "green");
          icon = this._getIcon(loggerMessage.type);
          break;
        case "WARNING":
          typeStyling = this._setConsoleColor("black", "yellow");
          icon = this._getIcon(loggerMessage.type);
          break;
        case "ERROR":
          typeStyling = this._setConsoleColor("black", "red");
          icon = this._getIcon(loggerMessage.type);
          break;
        case "INFO":
          typeStyling = this._setConsoleColor("black", "blue");
          icon = this._getIcon(loggerMessage.type);
          break;
        case "LOG":
          typeStyling = this._setConsoleColor("default", "");
          icon = this._getIcon(loggerMessage.type);
          break;
        case "SANDBOX":
          typeStyling = this._setConsoleColor("black", "white");
          icon = this._getIcon(loggerMessage.type);
          break;
        //
        default:
          typeStyling = this._setConsoleColor("default", "");
          icon = this._getIcon("default");
          break;
      }
      switch (loggerMessage.origin.type) {
        case "PLAY":
          headerStyling = this._setConsoleColor("blue", "");
          header = `[ PLAY / ${(_a = loggerMessage.origin.id) == null ? void 0 : _a.toUpperCase()} ]`;
          break;
        case "PUPPET":
          headerStyling = this._setConsoleColor("magenta", "");
          header = `[ PUPPET / ${(_b = loggerMessage.origin.id) == null ? void 0 : _b.toUpperCase()} ]`;
          break;
        //
        case "AGENT":
          headerStyling = this._setConsoleColor("yellow", "");
          header = `< ${(_c = loggerMessage.origin.id) == null ? void 0 : _c.toUpperCase()} >`;
          break;
        case "USER":
          headerStyling = this._setConsoleColor("cyan", "");
          header = `< ${(_d = loggerMessage.origin.id) == null ? void 0 : _d.toUpperCase()} >`;
          break;
        //
        case "PLUGIN":
          headerStyling = this._setConsoleColor("green", "");
          header = "[ PLUGIN ]";
          break;
        //
        default:
          headerStyling = this._setConsoleColor("default", "");
          header = "[ LOG ]";
          break;
      }
      console.log(
        headerStyling + header + this._resetConsoleColor(),
        typeStyling + ` ${icon}${loggerMessage.type} ` + this._resetConsoleColor()
      );
      console.log(loggerMessage.data.message);
      if (loggerMessage.data.payload && loggerMessage.data.payload !== null) {
        console.log("");
        console.log("PAYLOAD =", loggerMessage.data.payload);
      }
      console.log("");
    };
    this.send = (loggerMessage) => {
      this._composeConsoleMessage(loggerMessage);
    };
    this.config = config;
  }
};
export {
  NodeConsoleClient
};
