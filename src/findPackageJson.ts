import { PackageJson } from "type-fest";
import * as fs from "fs";
import * as path from "path";
import Glob from "glob";

export interface Found {
  [path: string]: {
    data: PackageJson;
  }
}

const getPackageJson = (filename: string): PackageJson | undefined => {
  try {
    return JSON.parse(fs.readFileSync(filename, { encoding: "utf-8" }));
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export const findPackageJson = (baseDir: string, ignore: string[] = ["**/node_modules/**"]): Found => {
  const searchPatternString = path.join(baseDir, "**", "package.json");
  return Glob.sync(searchPatternString, { ignore }).reduce<Found>((found, packageJsonPath) => {
    const pkg = getPackageJson(packageJsonPath);
    if (pkg) {
      found[packageJsonPath] = {
        data: pkg,
      }
    }
    return found;
  }, {});
}
