import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Report, ReportProps, RowProps, ColumnProps } from "./template/report";
import { PackageData } from "./factory/types";

export interface CategorizedData {
  warning: PackageData[];
  errors: PackageData[];
}

const convertPackageDataToRow = (pkgData: PackageData): RowProps[] => {
  const packageRows: RowProps[] = [];
  pkgData.dependencies.forEach((dependency) => {
    if (dependency.usingPackages.length > 0) {
      dependency.usingPackages.forEach((usingPkg) => {
        const relationColumn: ColumnProps = { text: `${usingPkg.name}@${usingPkg.version}` };
        packageRows.push({ columns: [{ text: pkgData.name }, { text: dependency.realUsedVersion }, relationColumn] });
      });
    } else {
      packageRows.push({ columns: [{ text: pkgData.name }, { text: dependency.realUsedVersion }, { text: "skip search" }] });
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
