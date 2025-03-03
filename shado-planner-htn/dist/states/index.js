var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// src/states/telegram.ts
var telegramDefaultState = {
  "telegram-last-updated": 0,
  //
  "telegram-has-messages": false,
  "telegram-messages": [],
  "telegram-last-replied": 0
};

// src/states/twitter.ts
var twitterDefaultState = {
  "twitter-last-updated": 0,
  //
  "twitter-has-logged-in": false,
  "twitter-last-log-in-attempt": 0,
  // 'twitter-has-messages': false,
  // 'twitter-messages': [],
  "twitter-last-sent": 0
  // 'twitter-last-replied': 0,
};

// src/states/index.ts
var defaultStates = {
  telegram: __spreadValues({}, telegramDefaultState),
  twitter: __spreadValues({}, twitterDefaultState)
};
export {
  defaultStates
};
