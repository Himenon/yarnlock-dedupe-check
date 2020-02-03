export interface RequiredDependency {
  /**
   * "^", "~"が含まれないバージョン
   */
  version: string;
  resolved: string;
  integrity: string;
  dev?: boolean;
  requires?: {
    [name: string]: string; // valueは "^", "~"を含むバージョン情報
  };
}

export interface Dependency extends RequiredDependency {
  /**
   * 異なるバージョンが含まれている
   */
  dependencies?: {
    [packageName: string]: RequiredDependency;
  };
}

export interface OriginData {
  name: string;
  version: string;
  lockfileVersion: number;
  dependencies: {
    [packageName: string]: Dependency;
  };
}