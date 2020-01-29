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
  const packageRowSpan = pkgData.usingRelation.reduce<number>((total, current) => current.used.length + total, 0);
  const firstColumn: ColumnProps = { text: pkgData.name, rowSpan: packageRowSpan === 0 ? undefined : packageRowSpan };
  if (pkgData.usingRelation.length === 0) {
    packageRows.push({ columns: [firstColumn] });
  }
  pkgData.usingRelation.forEach((relation, relationIdx) => {
    const usingRelationRowSpan = relation.used.length === 0 ? undefined : relation.used.length;
    const usingRelationColumn: ColumnProps = { text: relation.realUsedVersion, rowSpan: usingRelationRowSpan } ;
    const columns: ColumnProps[] = [];
    if (relationIdx === 0) {
      columns.push(firstColumn);
    }
    columns.push(usingRelationColumn);
    relation.used.forEach((used, usedIdx) => {
      const relationColumn: ColumnProps = { text: `${used.name}@${used.version}` };
      if (usedIdx === 0) {
        columns.push(relationColumn);
        packageRows.push({ columns });
      } else {
        packageRows.push({ columns: [relationColumn] });
      }
    });
  });
  return packageRows;
}

const convertReportProps = (categorizedData: CategorizedData): ReportProps => {
  const errorRowsList: RowProps[][] = categorizedData.errors.map(convertPackageDataToRow);
  return {
    errorRows: errorRowsList.reduce((all, row) => all.concat(row), []),
  };
};

export const generateReport = (data: CategorizedData): string => {
  const props = convertReportProps(data);
  return "<!doctype html>" + renderToStaticMarkup(<Report {...props} />);
};
