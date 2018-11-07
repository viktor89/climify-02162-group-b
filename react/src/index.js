import React from "react";
import ReactDOM from "react-dom";
import ManageInstitution from "./container/ManageInstitution";

class DeviceListComponent extends React.Component {
  render() {
    return (
      <div>
        <ManageInstitution />
      </div>
    );
  }
}

let DeviceListEntrypoint = document.getElementById("deviceList");

ReactDOM.render(<DeviceListComponent name="test" />, DeviceListEntrypoint);
