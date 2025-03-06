var r=class{config;colors={fg:{black:"\x1B[30m",red:"\x1B[31m",green:"\x1B[32m",yellow:"\x1B[33m",blue:"\x1B[34m",magenta:"\x1B[35m",cyan:"\x1B[36m",white:"\x1B[37m",gray:"\x1B[90m",default:"\x1B[37m",clear:"\x1B[0m"},bg:{black:"\x1B[40m",red:"\x1B[41m",green:"\x1B[42m",yellow:"\x1B[43m",blue:"\x1B[44m",magenta:"\x1B[45m",cyan:"\x1B[46m",white:"\x1B[47m",gray:"\x1B[100m",default:"\x1B[47m",clear:""}};icons={success:"\u{1F7E2}",warning:"\u{1F7E0}",danger:"\u{1F534}",info:"\u{1F535}",default:"\u26AA\uFE0F"};constructor(o){this.config=o;}_getIcon=o=>{let e=this.icons[o.toLowerCase()]||this.icons.default;return this.config.showIcon?`${e} `:""};_setConsoleColor=(o="",e="")=>{let t=this.colors.fg[o.toLowerCase()]||this.colors.fg.white,s=this.colors.bg[e.toLowerCase()]||this.colors.bg.clear;return `${t}${s}`};_resetConsoleColor=()=>this.colors.fg.clear;_composeConsoleMessage=o=>{let e,t,s,l;switch(o.type){case "SUCCESS":e=this._setConsoleColor("black","green"),t=this._getIcon(o.type);break;case "WARNING":e=this._setConsoleColor("black","yellow"),t=this._getIcon(o.type);break;case "ERROR":e=this._setConsoleColor("black","red"),t=this._getIcon(o.type);break;case "INFO":e=this._setConsoleColor("black","blue"),t=this._getIcon(o.type);break;case "LOG":e=this._setConsoleColor("default",""),t=this._getIcon(o.type);break;case "SANDBOX":e=this._setConsoleColor("black","white"),t=this._getIcon(o.type);break;default:e=this._setConsoleColor("default",""),t=this._getIcon("default");break}switch(o.origin.type){case "PLAY":s=this._setConsoleColor("blue",""),l=`[ PLAY / ${o.origin.id?.toUpperCase()} ]`;break;case "PUPPET":s=this._setConsoleColor("magenta",""),l=`[ PUPPET / ${o.origin.id?.toUpperCase()} ]`;break;case "AGENT":s=this._setConsoleColor("yellow",""),l=`< ${o.origin.id?.toUpperCase()} >`;break;case "USER":s=this._setConsoleColor("cyan",""),l=`< ${o.origin.id?.toUpperCase()} >`;break;case "PLUGIN":s=this._setConsoleColor("green",""),l="[ PLUGIN ]";break;default:s=this._setConsoleColor("default",""),l="[ LOG ]";break}console.log(s+l+this._resetConsoleColor(),e+` ${t}${o.type} `+this._resetConsoleColor()),console.log(o.data.message),o.data.payload&&o.data.payload!==null&&(console.log(""),console.log("PAYLOAD =",o.data.payload)),console.log("");};send=o=>{this._composeConsoleMessage(o);}};export{r as NodeConsoleClient};