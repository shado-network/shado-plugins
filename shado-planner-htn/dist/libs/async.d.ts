declare const asyncForEach: (array: any[], callback: any) => Promise<void>;
declare const asyncSome: (array: any[], callback: any) => Promise<boolean>;
declare const asyncEvery: (array: any[], callback: any) => Promise<boolean>;
declare const asyncSleep: (seconds: number) => Promise<unknown>;

export { asyncEvery, asyncForEach, asyncSleep, asyncSome };
