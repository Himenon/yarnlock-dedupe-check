import * as lockfile from "@yarnpkg/lockfile";
import { parseConcatNameAndVersionString } from "../parser";
import { PackageBasicPairData, DisplayPackageData, InstalledStructure, PackageStructure } from "./types";
import { uniq } from "../utils";

export type OriginData = lockfile.YarnLockObject;

export const generateUsed = ({ name, version }: PackageBasicPairData, obj: OriginData): PackageBasicPairData[] => {
  return Object.entries(obj).reduce<PackageBasicPairData[]>((used, [packageName, value]) => {
    // dependenciesに指定したバージョンのライブラリが含まれているかどうか
    const hasDependency = Object.entries(value.dependencies || {}).find(([depName, depVersion]) => depName === name && depVersion === version);
    if (hasDependency) {
      used.push(parseConcatNameAndVersionString(packageName));
    }
    return used;
  }, []);
}

export const generateDisplayPackageData = (obj: OriginData, checkPackageName: RegExp | undefined = undefined): PackageStructure => {
  const packageNameList: string[] = [];
  const dataSet = Object.entries(obj).map(([key, value]) => {
    const packageBasicPairData = parseConcatNameAndVersionString(key);
    const ignore: boolean = !!checkPackageName && !packageBasicPairData.name.match(checkPackageName);
    const used = ignore ? [] : generateUsed(packageBasicPairData, obj);
    packageNameList.push(packageBasicPairData.name);
    return {
      ...packageBasicPairData,
      realVersion: value.version,
      used,
      ignore,
      rootLibrary: ignore ? "unknown" : used.length === 0,
    }
  });

  const installedStructure = uniq(packageNameList).reduce<InstalledStructure>((structure, packageName) => {
    dataSet.filter(data => data.name === packageName).forEach(d => {
      const newDisplayPackageData: DisplayPackageData = {
        [d.version]: {
          realUsedVersion: d.realVersion,
          used: d.used,
        }
      }
      structure[packageName] = {
        ...(structure[packageName] || {}),
        ...newDisplayPackageData,
      };;
    })
    return structure;
  }, {});

  return {
    installedStructure
  };
}
