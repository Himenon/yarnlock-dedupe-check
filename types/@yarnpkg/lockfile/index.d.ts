declare module "@yarnpkg/lockfile" {
  export interface YarnLockObject {
    [packageName: string]: {
      version: string;
      resolved: string;
      integrity: string;
      dependencies?: {
        [key: string]: string;
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
