import { getInputParams } from "./cli";
import * as fs from "fs";
import * as path from "path";
import * as logger from "./logger";
import * as lockfile from "@yarnpkg/lockfile";
import * as factory from "./factory";
import { uniq } from "./utils";
import { CategorizedData, generateReport } from "./reporter";
import { validate } from "./validator";
import { findPackageJson, Found } from "./findPackageJson";

export const getParsedValue = (lockfilePath: string) => {
  const raw = fs.readFileSync(lockfilePath, "utf8");
  return lockfile.parse(raw);
}

export const generateCategorizedData = (obj: lockfile.YarnLockObject, found: Found, checkPackageName: RegExp | undefined = undefined): CategorizedData => {
  const { installedPackage } = factory.generatePackageStructure({ type: "yarn", data: obj }, found, checkPackageName);
  const categorizedData: CategorizedData = {
    errors: [],
    warning: [],
  };
  Object.entries(installedPackage).forEach(([packageName, value]) => {
    // TODO exclude "|| {}""
    if (Object.keys(value || {}).length > 1) {
      const valueObject = value || {};
      const realInstalledVersions = uniq(Object.values(valueObject).map(d => d.realUsedVersion));
      const isCheckTarget: boolean = !!checkPackageName && !!packageName.match(checkPackageName);
      // 実際に利用しているバージョンが異なるものを複数もつ場合 かつ、チェック対象の場合
      if (realInstalledVersions.length > 1 && isCheckTarget) {
        categorizedData.errors.push({
          name: packageName,
          dependencies: Object.values(valueObject),
        });
      } else if (realInstalledVersions.length > 1) {
        categorizedData.warning.push({
          name: packageName,
          dependencies: Object.values(valueObject),
        });
      }
    }
  });
  return categorizedData;
}

const main = () => {
  const params = getInputParams();
  const parsedValue = getParsedValue(params.inputLockFile);
  const found = findPackageJson(path.dirname(params.inputLockFile));

  const categorizedData = generateCategorizedData(parsedValue.object, found, params.checkPattern ? new RegExp(params.checkPattern) : undefined);
  if (params.jsonFileName) {
    fs.mkdirSync(path.dirname(params.jsonFileName), { recursive: true });
    fs.writeFileSync(params.jsonFileName, JSON.stringify(categorizedData, null, 2));
    logger.info("");
    logger.info(`Generate JSON File: ${params.jsonFileName}`);
  }
  if (params.html) {
    const reportHtml = generateReport(categorizedData);
    fs.writeFileSync(params.html, reportHtml);
    logger.info("");
    logger.info(`Generate HTML: ${params.html}`);
  }
  if (params.check) {
    validate(categorizedData);
  }
  logger.info("");
  logger.info("libcheck Done.");
}

main();
