import { getInputParams } from "./cli";
import * as fs from "fs";
import * as path from "path";
import * as logger from "./logger";
import * as lockfile from "@yarnpkg/lockfile";
import * as factory from "./factory";

export const getParsedValue = (raw: string) => {
  return lockfile.parse(raw);
}

export const checkDeduplicateInstalledVersion = (obj: lockfile.YarnLockObject) => {
  const result = factory.generateDisplayPackageData(obj);
  fs.writeFileSync("output/result.json", JSON.stringify(result, null , 2));
}

const main = () => {
  const params = getInputParams();
  const raw = fs.readFileSync(params.inputYarnLockPath, "utf8");
  const parsedValue = getParsedValue(raw);
  checkDeduplicateInstalledVersion(parsedValue.object);
  fs.mkdirSync(path.dirname(params.outputFilename), { recursive: true });
  fs.writeFileSync(params.outputFilename, JSON.stringify(parsedValue, null, 2));
  logger.info(`Write: ${params.outputFilename}`);
}

main();
