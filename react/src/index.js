import React from "react";
import ReactDOM from "react-dom";
import ManageInstitution from "./container/ManageInstitution";
import ManageDevices from "./container/ManageDevices";

class DeviceListComponent extends React.Component {
  render() {
    return (
      <div>
        <h2>Manage Institution</h2>
        <hr />
        <ManageInstitution />
      </div>
    );
  }
}

class DeviceManagement extends React.Component {
  render() {
    return (
      <div>
        <h2>Manage Devices</h2>
        <hr />
        <ManageDevices />
      </div>
    );
  }
}

let DeviceListEntrypoint = document.getElementById("deviceList");
let ManageDevicesEntrypoint = document.getElementById("manageDevices");

ReactDOM.render(<DeviceListComponent name="test" />, DeviceListEntrypoint);
ReactDOM.render(<DeviceManagement name="test" />, ManageDevicesEntrypoint);
