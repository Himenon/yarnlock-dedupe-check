import * as fs from "fs";
import Mustache from "mustache";
import * as path from "path";
import { UsingRelation } from "./factory/types";


export interface Data {
  name: string;
  data: UsingRelation[];
}

export interface CategorizedData {
  warning: Data[];
  errors: Data[];
}

interface RowData {
  
}

export const generateReport = (data: CategorizedData): string => {
  const template = fs.readFileSync(path.join(__dirname, "../templates/report.html"), { encoding: "utf-8" });
  return Mustache.render(template, { ...data, sample: "<h1>helllo!</h1>" });
}
