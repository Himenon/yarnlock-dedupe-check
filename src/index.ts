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
};

export const generateCategorizedData = (
  obj: lockfile.YarnLockObject,
  found: Found,
  testPattern: RegExp | undefined = undefined,
  warningPattern: RegExp | undefined = undefined,
  testSkipPattern: RegExp | undefined = undefined,
): CategorizedData => {
  const isWarningTarget = (name: string): boolean => !!warningPattern && !!name.match(warningPattern);
  const isErrorTarget = (name: string): boolean => !!testPattern && !!name.match(testPattern);
  const isTarget = (name: string) => isWarningTarget(name) || isErrorTarget(name) || false;
  const isIgnore = (name: string) => !!testSkipPattern && !!name.match(testSkipPattern);
  const { installedPackage } = factory.generatePackageStructure({ type: "yarn", data: obj }, found, isTarget, isIgnore);
  const categorizedData: CategorizedData = {
    errors: [],
    warning: [],
  };
  Object.entries(installedPackage).forEach(([packageName, value]) => {
    // TODO exclude "|| {}""
    if (Object.keys(value || {}).length > 1) {
      const valueObject = value || {};
      const realInstalledVersions = uniq(Object.values(valueObject).map(d => d.realUsedVersion));
      const isCheckTarget: boolean = !!testPattern && !!packageName.match(testPattern);
      // 実際に利用しているバージョンが異なるものを複数もつ場合 かつ、チェック対象の場合
      if (realInstalledVersions.length > 1 && isErrorTarget(packageName)) {
        categorizedData.errors.push({
          name: packageName,
          dependencies: Object.values(valueObject),
        });
      } else if (realInstalledVersions.length > 1 && isWarningTarget(packageName)) {
        categorizedData.warning.push({
          name: packageName,
          dependencies: Object.values(valueObject),
        });
      }
    }
  });
  return categorizedData;
};

const main = async () => {
  const params = getInputParams();
  const parsedValue = getParsedValue(params.inputLockFile);
  const found = findPackageJson(path.dirname(params.inputLockFile));

  const categorizedData = generateCategorizedData(
    parsedValue.object,
    found,
    params.testPattern ? new RegExp(params.testPattern) : undefined,
    params.warningPattern ? new RegExp(params.warningPattern) : undefined,
    params.ignorePattern ? new RegExp(params.ignorePattern) : undefined,
  );
  if (params.jsonFileName) {
    fs.mkdirSync(path.dirname(params.jsonFileName), { recursive: true });
    fs.writeFileSync(params.jsonFileName, JSON.stringify(categorizedData, null, 2));
    logger.info("");
    logger.info(`Generate JSON File: ${params.jsonFileName}`);
    logger.info("");
  }
  if (params.html) {
    const reportHtml = generateReport(categorizedData);
    fs.writeFileSync(params.html, reportHtml);
    logger.info("");
    logger.info(`Generate HTML: ${params.html}`);
    logger.info("");
  }
  if (!params.jsonFileName && !params.html) {
    validate(categorizedData);
  }
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
