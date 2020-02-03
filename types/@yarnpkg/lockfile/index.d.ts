declare module "@yarnpkg/lockfile" {
  export interface YarnLockObject {
    [packageNameAtVersion: string]: {
      version: string;
      // resolved: string; // not necessary
      // integrity: string; // not necessary
      dependencies?: {
        [packageName: string]: string; // value is version
      };
    }
  }
  export interface SuccessValue {
    type: "success";
    object: YarnLockObject;
  }
  export interface MergeValue {
    type: "merge";
    object: YarnLockObject;
  }
  export interface ConflictValue {
    type: "conflict";
    object: {};
  }
  export function parse (raw: string): SuccessValue | MergeValue | ConflictValue;
  export function stringify (obj: YarnLockObject): string;
}
