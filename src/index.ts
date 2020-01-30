import { getInputParams } from "./cli";
import * as fs from "fs";
import * as path from "path";
import * as logger from "./logger";
import * as lockfile from "@yarnpkg/lockfile";
import * as factory from "./factory";
import { uniq } from "./utils";
import { CategorizedData, generateReport } from "./reporter";
import { check } from "./validator";

export const getParsedValue = (raw: string) => {
  return lockfile.parse(raw);
}

export const generateCategorizedData = (obj: lockfile.YarnLockObject, checkPackageName: RegExp | undefined = undefined): CategorizedData => {
  const { installedPackage: installedStructure } = factory.generatePackageStructure({ type: "yarn", data: obj }, checkPackageName);
  const categorizedData: CategorizedData = {
    errors: [],
    warning: [],
  };
  Object.entries(installedStructure).forEach(([packageName, value]) => {
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
  const raw = fs.readFileSync(params.inputYarnLockPath, "utf8");
  const parsedValue = getParsedValue(raw);

  const categorizedData = generateCategorizedData(parsedValue.object, params.checkPattern ? new RegExp(params.checkPattern) : undefined);
  if (params.outputFilename) {
    fs.mkdirSync(path.dirname(params.outputFilename), { recursive: true });
    fs.writeFileSync(params.outputFilename, JSON.stringify(categorizedData, null, 2));
    logger.info(`Write: ${params.outputFilename}`);
  }
  if (params.html) {
    const reportHtml = generateReport(categorizedData);
    fs.writeFileSync(params.html, reportHtml);
    logger.info(`Write: ${params.html}`);
  }
  if (params.check) {
    check(categorizedData);
  }
}

main();
