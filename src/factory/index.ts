import { PackageStructure } from "./types";
import * as Yarn from "./yarn";
import { Found } from "../findPackageJson";

export type OriginData = {
  type: "yarn";
  data: Yarn.OriginData;
}

export type CheckPackagePattern = RegExp | undefined;

const foundDataToYarnLockObject = (found: Found): Yarn.OriginData => {
  return Object.values(found).reduce<Yarn.OriginData>((data, pkg) => {
    if (pkg.packageName && pkg.data.version) {
      data[pkg.packageName] = {
        version: pkg.data.version,
        dependencies: pkg.data.dependencies,
      }
    }
    return data;
  }, {});
}

export const generatePackageStructure = ({ type, data }: OriginData, found: Found, checkPattern: CheckPackagePattern = undefined): PackageStructure => {
  if (type === "yarn") {
    const convertedData = foundDataToYarnLockObject(found);
    return Yarn.generateDisplayPackageData({ ...data, ...convertedData }, checkPattern);
  }
  throw new Error("Please choice type 'yarn' or 'npm'");
}
