import commander from "commander";
const pkg = require("../package.json");

export interface InputParams {
  inputLockFile: string;
  jsonFileName: string | undefined;
  test: boolean;
  checkPattern: string | undefined;
  testSkipPattern: string | undefined;
  html: string | undefined;
}

export const getInputParams = (): InputParams => {
  commander
    .version(pkg.version)
    .description(pkg.description)
    .option("-i --input <yarn.lock>", "input yarn.lock file")
    .option("--json <output.json>", "output filename.")
    .option("--html <output.html>", "output html filename.")
    .option("-p --pattern <regex>", "test target pattern")
    .option("--skip <regex>", "skip regex pattern")
    .option("--test", "flag")
    .parse(process.argv);

  return {
    inputLockFile: commander["input"],
    jsonFileName: commander["json"],
    checkPattern: commander["pattern"],
    testSkipPattern: commander["skip"],
    html: commander["html"],
    test: !!commander["test"],
  };
};
