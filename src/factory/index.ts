import { CheckCallback, PackageStructure } from "./types";
import * as Yarn from "./yarn";
import { Found } from "../findPackageJson";

export type OriginData = {
  type: "yarn";
  data: Yarn.OriginData;
};

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

export const generatePackageStructure = (
  { type, data }: OriginData,
  found: Found,
  isTargetCallback: CheckCallback,
  isIgnoreTarget: CheckCallback,
): PackageStructure => {
  if (type === "yarn") {
    const convertedData = foundDataToYarnLockObject(found);
    return Yarn.generateDisplayPackageData({ ...data, ...convertedData }, isTargetCallback, isIgnoreTarget);
  }
  throw new Error("Please choice type 'yarn' or 'npm'");
};
