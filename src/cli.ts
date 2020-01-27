import commander from "commander";

export interface InputParams {
  inputYarnLockPath: string;
  outputFilename: string;
}

export const getInputParams = (): InputParams => {
  commander
    .option("-i --input <yarn.lock>", "input yarn.lock file")
    .option("-o --output <output.json>", "output filename")
    .parse(process.argv);

  return {
    inputYarnLockPath: commander["input"],
    outputFilename: commander["output"],
  };
}