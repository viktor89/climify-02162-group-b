import React from "react";
import ReactDOM from "react-dom";
import ManageInstitution from "./container/ManageInstitution";
import ManageDevices from "./container/ManageDevices";

class DeviceListComponent extends React.Component {
  render() {
    return (
      <div>
          <ManageInstitution />
      </div>
    );
  }
}
class ManageDevicesComponent extends React.Component {
    render() {
        return (
            <div>
                <ManageDevices />
            </div>
        );
    }
}

let deviceListEntrypoint = document.getElementById("deviceList");
let manageDevicesEntrypoint = document.getElementById("manageDevices");
ReactDOM.render(<DeviceListComponent name="list-hubs" />, deviceListEntrypoint );
ReactDOM.render(<ManageDevicesComponent  name="manage-devices" />, manageDevicesEntrypoint );
