import * as lockfile from "@yarnpkg/lockfile";
import { parseConcatNameAndVersionString, PackageBasicPairData } from "./parser";
import { uniq } from "./utils";

export interface UsingRelation {
  realUsedVersion: string;
  used: PackageBasicPairData[];
}

export interface DisplayPackageData {
  [displayVersion: string]: UsingRelation;
}

export interface InstalledStructure {
  [displayName: string]: DisplayPackageData;
}

export const generateAllDependencies = (obj: lockfile.YarnLockObject): PackageBasicPairData[] => {
  const concatPackageAndVersionList = Object.values(obj).reduce<string[]>((all, value) => {
    return all.concat(Object.entries(value.dependencies || {}).map(entry => `${entry[0]}@${entry[1]}`));
  }, []);
  return uniq(concatPackageAndVersionList).map(parseConcatNameAndVersionString);
}

export const generateDisplayPackageData = (obj: lockfile.YarnLockObject) => {
  const allDependencyPairDataList = generateAllDependencies(obj);
  const installedPairDataList = Object.keys(obj).map(parseConcatNameAndVersionString);

  return {
    allDependencyPairDataList,
    installedPairDataList,
  };
}
