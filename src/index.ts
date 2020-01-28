import { getInputParams } from "./cli";
import * as fs from "fs";
import * as path from "path";
import * as logger from "./logger";
import * as lockfile from "@yarnpkg/lockfile";
import * as factory from "./factory";
import { uniq } from "./utils";
import { MessageData } from "./message";

export const getParsedValue = (raw: string) => {
  return lockfile.parse(raw);
}

export const checkDeduplicateInstalledVersion = (obj: lockfile.YarnLockObject, checkPackageName: RegExp | undefined = undefined) => {
  const { installedStructure } = factory.generatePackageStructure({ type: "yarn", data: obj }, checkPackageName);
  fs.writeFileSync("output/installedStructure.json", JSON.stringify(installedStructure, null , 2));
  const messageData: MessageData = {
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
        messageData.errors.push({
          name: packageName,
          data: Object.values(valueObject),
        });
      } else if (realInstalledVersions.length > 1) {
        messageData.warning.push({
          name: packageName,
          data: Object.values(valueObject),
        });
      }
    }
  })
  fs.writeFileSync("output/result.json", JSON.stringify(messageData, null , 2));
}

const main = () => {
  const params = getInputParams();
  const raw = fs.readFileSync(params.inputYarnLockPath, "utf8");
  const parsedValue = getParsedValue(raw);
  fs.mkdirSync(path.dirname(params.outputFilename), { recursive: true });
  checkDeduplicateInstalledVersion(parsedValue.object, params.checkPattern ? new RegExp(params.checkPattern) : undefined);
  fs.writeFileSync(params.outputFilename, JSON.stringify(parsedValue, null, 2));
  logger.info(`Write: ${params.outputFilename}`);
}

main();
