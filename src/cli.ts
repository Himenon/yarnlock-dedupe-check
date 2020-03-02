import commander from "commander";
const pkg = require("../package.json");

export interface InputParams {
  inputLockFile: string;
  jsonFileName: string | undefined;
  testPattern: string | undefined;
  warningPattern: string | undefined;
  ignorePattern: string | undefined;
  html: string | undefined;
}

export const getInputParams = (): InputParams => {
  commander
    .version(pkg.version)
    .description(pkg.description)
    .option("-i --input <yarn.lock>", "input yarn.lock file")
    .option("--json <output.json>", "output filename.")
    .option("--html <output.html>", "output html filename.")
    .option("--ignore <regex>", "ignore regex pattern")
    .option("--test <regex>", "test target pattern")
    .option("--warn <regex>", "warning target pattern")
    .parse(process.argv);

  return {
    inputLockFile: commander["input"],
    jsonFileName: commander["json"],
    testPattern: commander["test"],
    warningPattern: commander["warn"],
    ignorePattern: commander["ignore"],
    html: commander["html"],
  };
};
