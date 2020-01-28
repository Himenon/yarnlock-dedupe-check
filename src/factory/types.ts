import { PackageBasicPairData } from "../types";

export { PackageBasicPairData };

export interface UsingRelation {
  realUsedVersion: string;
  used: PackageBasicPairData[];
}

export interface DisplayPackageData {
  [displayVersion: string]: UsingRelation;
}

export interface InstalledStructure {
  [displayName: string]: DisplayPackageData | undefined;
}

export interface PackageStructure {
  installedStructure: InstalledStructure;
}