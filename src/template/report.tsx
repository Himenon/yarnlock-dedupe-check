import { h, Component } from "preact";

export interface ColumnProps {
  rowSpan?: number;
  text: string;
}

export interface RowProps {
  columns: ColumnProps[];
}

export interface ReportProps {
  errorRows: RowProps[];
  warningRows: RowProps[];
}

export const createTableRow = (row: RowProps, rowIdx: number) => {
  const elements = row.columns.map((col, colIdx) => {
    return (
      <td rowSpan={col.rowSpan} key={`col-${colIdx}`}>
        {col.text}
      </td>
    );
  });
  return <tr key={`row-${rowIdx}`}>{elements}</tr>;
};

const styleProps = `
.ui.container {
  padding-top: 5em;
  padding-bottom: 5em;
}
`;

export const Report = ({ errorRows, warningRows }: ReportProps) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>Library Check Report</title>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/components/container.css" />
        <script
          src="https://code.jquery.com/jquery-3.1.1.min.js"
          integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="
          crossOrigin="anonymous"
        ></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js"></script>
        <style>{styleProps}</style>
      </head>
      <body>
        <div className="ui container">
          <h1 className="ui header">yarn.lock checker report</h1>
          {errorRows.length > 0 && (
            <div className="ui">
              <h2 className="ui header">Errors</h2>
              <div className="ui top attached error icon message">
                <i className="attention icon" />
                <div className="content">multi version installed error!</div>
              </div>
              <table className="ui structured selectable celled table">
                <thead>
                  <tr>
                    <th>Package</th>
                    <th>Real used version</th>
                    <th>used packages</th>
                  </tr>
                </thead>
                <tbody>{errorRows.map(createTableRow)}</tbody>
              </table>
            </div>
          )}
          <div className="ui section divider" />
          {warningRows.length > 0 && (
            <div className="ui">
              <h2 className="ui header">Warning</h2>
              <div className="ui top attached warning icon message">
                <i className="attention icon" />
                <div className="content">Warning</div>
              </div>
              <table className="ui structured selectable celled table">
                <thead>
                  <tr>
                    <th>Package</th>
                    <th>Real used version</th>
                    <th>used packages</th>
                  </tr>
                </thead>
                <tbody>{warningRows.map(createTableRow)}</tbody>
              </table>
            </div>
          )}
        </div>
      </body>
    </html>
  );
};
