import { CategorizedData } from "./reporter";

export const check = (data: CategorizedData) => {
  data.errors.forEach(errorPkg => {
    errorPkg.usingRelation.forEach(relation => {
      relation.used.map(used => {
        console.info(`Error: ${errorPkg.name} -> ${relation.realUsedVersion} - ${used.name}@${used.version}`);
      })
    });
  })
}