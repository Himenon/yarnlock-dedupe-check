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
  [displayName: string]: DisplayPackageData | undefined;
}

export const generateUsed = ({ name, version }: PackageBasicPairData, obj: lockfile.YarnLockObject): PackageBasicPairData[] => {
  return Object.entries(obj).reduce<PackageBasicPairData[]>((used, [packageName, value]) => {
    // dependenciesに指定したバージョンのライブラリが含まれているかどうか
    const hasDependency = Object.entries(value.dependencies || {}).find(([depName, depVersion]) => depName === name && depVersion === version);
    if (hasDependency) {
      used.push(parseConcatNameAndVersionString(packageName));
    }
    return used;
  }, []);
}

export const generateDisplayPackageData = (obj: lockfile.YarnLockObject, checkPackageName: RegExp | undefined = undefined) => {
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
