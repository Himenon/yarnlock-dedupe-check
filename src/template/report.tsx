import * as React from "react";

export const createTemplate = () => {
  return (
    <html lang="en">

<head>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>yarn.lock checker report</title>
  <link rel="stylesheet" type="text/css"
    href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" />
  <link rel="stylesheet" type="text/css"
    href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/components/container.css" />
  <script src="https://code.jquery.com/jquery-3.1.1.min.js"
    integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js"></script>
  <style />
</head>

<body>
  <div className="ui container">
    <h1 className="ui header">yarn.lock checker report</h1>
    <div className="ui">
      <h2 className="ui header">Errors</h2>
      <div className="ui top attached error icon message">
        <i className="attention icon"></i>
        <div className="content">
          multi version installed error!
        </div>
      </div>
      <table className="ui attached selectable celled table">
        <thead>
          <tr>
            <th>Package</th>
            <th>Real used version</th>
            <th>used packages</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowspan="3">
              package name 1
            </td>
            <td rowSpan= className="negative">
              0.1.2
            </td>
            <td>
              root package json
            </td>
          </tr>
          <tr>
            <td>
              root package json2
            </td>
          </tr>
          <tr>
            <td  className="negative">
              0.1.4
            </td>
            <td>
              hogee
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
  </div>
</body>

</html>
  );
}