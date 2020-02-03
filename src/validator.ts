import { CategorizedData } from "./reporter";
import chalk from "chalk";
import * as logger from "./logger";

const messageFormat = (obj1: { name: string; version: string }, obj2: { name: string; version: string }) => {
  return `${obj1.name}@${obj1.version} <- ${obj2.name}@${obj2.version}`;
};

export const validate = (data: CategorizedData) => {
  const result = {
    includeWarning: false,
    includeError: false,
  };
  logger.info("");
  data.warning.forEach(warningPkg => {
    warningPkg.dependencies.forEach(relation => {
      relation.usingPackages.map(used => {
        logger.info(
          chalk.yellow("Warning") + " " +
            messageFormat({ name: warningPkg.name, version: relation.realUsedVersion }, { name: used.name, version: used.version }),
        );
        if (!result.includeWarning) {
          result.includeWarning = true;
        }
      });
    });
  });
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
  if (result.includeWarning) {
    logger.info("");
    logger.info(chalk.bgYellow(chalk.black(" Warning ")) + ` Multi version included.`);
  }
  if (result.includeError) {
    logger.info("");
    logger.info(chalk.red("Failed") + ` Multi version included.`);
    process.exit(1);
  }
  logger.info("");
  logger.info(chalk.green("Success"));
};
