import { CategorizedData } from "./reporter";
import chalk from "chalk";
import * as logger from "./logger";

export const validate = (data: CategorizedData) => {
  logger.info("");
  data.errors.forEach(errorPkg => {
    errorPkg.dependencies.forEach(relation => {
      relation.usingPackages.map(used => {
        logger.info(chalk.red("Error") + ` ${errorPkg.name} -> ${relation.realUsedVersion} - ${used.name}@${used.version}`);
      })
    });
  });
  data.warning.forEach(warningPkg => {
    warningPkg.dependencies.forEach(relation => {
      relation.usingPackages.map(used => {
        logger.info(chalk.yellow("Warning") + ` ${warningPkg.name} -> ${relation.realUsedVersion} - ${used.name}@${used.version}`);
      })
    });
  });
  if (data.errors.length > 0) {
    logger.info("");
    logger.info(chalk.red("Failed") + ` Multi version included.`);
    process.exit(1);
  } else {
    logger.info("");
    logger.info(chalk.green("Success"));
  }
}