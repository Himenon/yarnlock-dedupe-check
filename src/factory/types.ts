import { PurePackageData } from "../types";

export { PurePackageData };

export type CheckCallback = (name: string) => boolean;

export interface Dependency {
  realUsedVersion: string;
  usingPackages: PurePackageData[];
}

export interface DisplayPackageData {
  [displayVersion: string]: Dependency;
}

export interface InstalledPackage {
  [displayName: string]: DisplayPackageData | undefined;
}

export interface PackageStructure {
  installedPackage: InstalledPackage;
}

export interface PackageData {
  name: string;
  dependencies: Dependency[];
}
