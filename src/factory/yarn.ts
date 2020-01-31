import * as lockfile from "@yarnpkg/lockfile";
import { parseConcatNameAndVersionString } from "../parser";
import { PurePackageData, DisplayPackageData, InstalledPackage, PackageStructure } from "./types";
import { uniq } from "../utils";

export type OriginData = lockfile.YarnLockObject;

interface DependencyItem extends PurePackageData {
  realVersion: string;
  usingPackages: PurePackageData[];
  ignore: boolean;
  rootLibrary: "unknown" | boolean;
}

export const generateUsed = ({ name, version }: PurePackageData, obj: OriginData): PurePackageData[] => {
  return Object.entries(obj).reduce<PurePackageData[]>((used, [packageName, value]) => {
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

  const dataSet: DependencyItem[] = Object.entries(obj).map(([key, value]) => {
    const purePackageData = parseConcatNameAndVersionString(key);
    const ignore: boolean = !!checkPackageName && !purePackageData.name.match(checkPackageName);
    const usingPackages = ignore ? [] : generateUsed(purePackageData, obj);
    packageNameList.push(purePackageData.name);
    return {
      ...purePackageData,
      realVersion: value.version,
      usingPackages,
      ignore,
      rootLibrary: ignore ? "unknown" : usingPackages.length === 0,
    }
  });

  const installedPackage = uniq(packageNameList).reduce<InstalledPackage>((structure, packageName) => {
    dataSet.filter(data => data.name === packageName).forEach(item => {
      const newDisplayPackageData: DisplayPackageData = {
        [item.version]: {
          realUsedVersion: item.realVersion,
          usingPackages: item.usingPackages,
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
    installedPackage,
  };
}
