import { CategorizedData } from "./reporter";
import chalk from "chalk";
import * as logger from "./logger";

const messageFormat = (obj1: { name: string; version: string }, obj2: { name: string; version: string }) => {
  return `"${obj1.name}@${obj1.version}" <- "${obj2.name}@${obj2.version}"`;
};

export const validate = (data: CategorizedData) => {
  const result = {
    includeWarning: false,
    includeError: false,
  };
  data.warning.forEach(warningPkg => {
    warningPkg.dependencies.forEach(relation => {
      relation.usingPackages.map(used => {
        logger.info(
          chalk.yellow("Warning") +
            " " +
            messageFormat({ name: warningPkg.name, version: relation.realUsedVersion }, { name: used.name, version: used.version }),
        );
        if (!result.includeWarning) {
          result.includeWarning = true;
        }
      });
    });
  });
  if (result.includeWarning) {
    logger.info("");
    logger.info(chalk.bgYellow(chalk.black(" Warning ")) + ` ${data.warning.length} packages contains multiple versions.`);
    logger.info("");
  }
  data.errors.forEach(errorPkg => {
    errorPkg.dependencies.forEach(relation => {
      relation.usingPackages.map(used => {
        logger.info(
          chalk.red("Error") +
            " " +
            messageFormat({ name: errorPkg.name, version: relation.realUsedVersion }, { name: used.name, version: used.version }),
        );
        if (!result.includeError) {
          result.includeError = true;
        }
      });
    });
  });
  if (result.includeError) {
    logger.info("");
    logger.info(chalk.bgRed(chalk.black(" Failed ")) + ` ${data.errors.length} packages contains multiple versions.`);
    logger.info("");
    process.exit(1);
  }
  logger.info(chalk.green("Success"));
};
