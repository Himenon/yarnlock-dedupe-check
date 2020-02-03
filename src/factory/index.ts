import { PackageStructure } from "./types";
import * as Npm from "./npm";
import * as Yarn from "./yarn";
import { Found } from "../findPackageJson";
import { uniq } from "../utils";
import { parseConcatNameAndVersionString } from "../parser";
import semver from "semver";

export interface YarnOriginData {
  type: "yarn";
  data: Yarn.OriginData;
}

export interface NpmOriginData {
  type: "npm";
  data: Npm.OriginData;
}

export type OriginData = YarnOriginData | NpmOriginData;

export type CheckPackagePattern = RegExp | undefined;

const foundDataToYarnLockObject = (found: Found): Yarn.OriginData => {
  return Object.values(found).reduce<Yarn.OriginData>((data, pkg) => {
    if (pkg.data.name && pkg.data.version) {
      data[`${pkg.data.name}@${pkg.data.version}`] = {
        version: pkg.data.version,
        dependencies: { ...pkg.data.dependencies, ...pkg.data.devDependencies },
      };
    }
    return data;
  }, {});
};

const npmDataToYarnLockObject = (npm: Npm.OriginData): Yarn.OriginData => {
  const allPackageAndVersionList: string[] = uniq(Object.values(npm.dependencies).reduce<string[]>((all, dependency) => {
    const p1: string[] = Object.entries(dependency.requires || {}).map(([pkgName, pkgVersion]) => `${pkgName}@${pkgVersion}`);
    // TODO まだ dep.dependenciesが存在する
    const p2: string[] = Object.entries(dependency.dependencies || {}).map(([pkgName, dep]) => `${pkgName}@${dep.version}`);
    return all.concat(p1).concat(p2);
  }, []));

  const result = allPackageAndVersionList.reduce<Yarn.OriginData>((obj, pkgAndVersion) => {
    const { name, version } = parseConcatNameAndVersionString(pkgAndVersion);
    const dependencies = Object.entries(npm.dependencies).filter(([depName, depBody]) => {
      return name === depName && semver.satisfies(version, depBody.version);
    }).reduce<{ [pkgName: string]: string }>((all, [depName, depBody]) => {
      all[npm.name] = npm.version;
      return all;
    }, {});
    
    obj[pkgAndVersion/** @babel/core-frame@^7.8.3 */] = {
      version, // 7.8.3 no caret
      dependencies, // { "@babel/highlight": "^7.8.3" }
    }
    return obj;
  }, {});
  console.info(result);
  return result;
}

export const generatePackageStructure = (
  originData: OriginData,
  found: Found,
  checkPattern: CheckPackagePattern = undefined,
): PackageStructure => {
  const convertedData = foundDataToYarnLockObject(found);
  if (originData.type === "yarn") {
    return Yarn.generateDisplayPackageData({ ...originData.data, ...convertedData }, checkPattern);
  } else if (originData.type === "npm") {
    const npmData = npmDataToYarnLockObject(originData.data);
    return Yarn.generateDisplayPackageData({ ...npmData, ...convertedData }, checkPattern);
  }
  throw new Error("Please choice type 'yarn' or 'npm'");
};
