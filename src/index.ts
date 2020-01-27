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
  const { installedStructure } = factory.generateDisplayPackageData(obj, checkPackageName);
  const messageData: MessageData = {
    errors: [],
    warning: [],
  };
  Object.entries(installedStructure).forEach(([packageName, value]) => {
    // TODO exclude "|| {}""
    if (Object.keys(value || {}).length > 1) {
      const realInstalledVersions = uniq(Object.values(value || {}).map(d => d.realUsedVersion));
      if (realInstalledVersions.length > 1 && (!!checkPackageName && packageName.match(checkPackageName))) {
        messageData.errors.push({
          name: packageName,
          data: realInstalledVersions,
          message: "multi version error!"
        })
      }
    }
  })
  fs.writeFileSync("output/result.json", JSON.stringify(messageData, null , 2));
}

const main = () => {
  const params = getInputParams();
  const raw = fs.readFileSync(params.inputYarnLockPath, "utf8");
  const parsedValue = getParsedValue(raw);
  checkDeduplicateInstalledVersion(parsedValue.object, params.checkPattern ? new RegExp(params.checkPattern) : undefined);
  fs.mkdirSync(path.dirname(params.outputFilename), { recursive: true });
  fs.writeFileSync(params.outputFilename, JSON.stringify(parsedValue, null, 2));
  logger.info(`Write: ${params.outputFilename}`);
}

main();
