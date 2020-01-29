import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Report, ReportProps, RowProps, ColumnProps } from "./template/report";
import { UsingRelation } from "./factory/types";

export interface PackageData {
  name: string;
  usingRelation: UsingRelation[];
}

export interface CategorizedData {
  warning: PackageData[];
  errors: PackageData[];
}

const convertPackageDataToRow = (pkgData: PackageData): RowProps[] => {
  const packageRows: RowProps[] = [];
  pkgData.usingRelation.forEach((relation) => {
    if (relation.used.length > 0) {
      relation.used.forEach((used) => {
        const relationColumn: ColumnProps = { text: `${used.name}@${used.version}` };
        packageRows.push({ columns: [{ text: pkgData.name }, { text: relation.realUsedVersion } , relationColumn] });
      });
    } else {
      packageRows.push({ columns: [{ text: pkgData.name }, { text: relation.realUsedVersion } , { text: "your application package.json or yarn.lock" }] });
    }
  });
  return packageRows;
}

const convertReportProps = (categorizedData: CategorizedData): ReportProps => {
  const errorRowsList: RowProps[][] = categorizedData.errors.map(convertPackageDataToRow);
  const warningRowsList: RowProps[][] = categorizedData.warning.map(convertPackageDataToRow);
  return {
    errorRows: errorRowsList.reduce((all, row) => all.concat(row), []),
    warningRows: warningRowsList.reduce((all, row) => all.concat(row), []),
  };
};

export const generateReport = (data: CategorizedData): string => {
  const props = convertReportProps(data);
  return "<!doctype html>" + renderToStaticMarkup(<Report {...props} />);
};
