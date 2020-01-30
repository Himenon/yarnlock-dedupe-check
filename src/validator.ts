import { CategorizedData } from "./reporter";
import chalk from "chalk";

export const check = (data: CategorizedData) => {
  data.errors.forEach(errorPkg => {
    errorPkg.dependencies.forEach(relation => {
      relation.usingPackages.map(used => {
        console.info(chalk.red("Error") + ` ${errorPkg.name} -> ${relation.realUsedVersion} - ${used.name}@${used.version}`);
      })
    });
  });
  data.warning.forEach(warningPkg => {
    warningPkg.dependencies.forEach(relation => {
      relation.usingPackages.map(used => {
        console.info(chalk.yellow("Warning") + ` ${warningPkg.name} -> ${relation.realUsedVersion} - ${used.name}@${used.version}`);
      })
    });
  });
  if (data.errors.length > 0) {
    process.exit(1);
  }
}