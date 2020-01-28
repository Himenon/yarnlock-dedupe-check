import { PackageStructure } from "./types";
import * as Yarn from "./yarn";

export type OriginData = {
  type: "yarn";
  data: Yarn.OriginData;
}

export type CheckPackagePattern = RegExp | undefined;

export const generatePackageStructure = ({ type, data }: OriginData, checkPattern: CheckPackagePattern = undefined): PackageStructure => {
  if (type === "yarn") {
    return Yarn.generateDisplayPackageData(data, checkPattern);
  }
  throw new Error("Please choice type 'yarn' or 'npm'");
}
