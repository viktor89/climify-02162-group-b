import React from "react";
import ReactDOM from "react-dom";
import ManageInstitution from "./container/ManageInstitution";
import ManageDevices from "./container/ManageDevices";
import Graphs from "./container/Graphs";
import ManageUsers from "./container/ManageUsers";
import MuiThemeProvider from "@material-ui/core/es/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/es/styles/createMuiTheme";

const theme = createMuiTheme();

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
            <MuiThemeProvider theme={theme}>
                <ManageDevices />
            </MuiThemeProvider>
        );
    }
}

class GraphsComponent extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Graphs />
      </MuiThemeProvider>
    );
  }
}


class ManageUsersComponent extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <ManageUsers />
      </MuiThemeProvider>
    );
  }
}

let deviceListEntrypoint = document.getElementById("deviceList");
let manageDevicesEntrypoint = document.getElementById("manageDevices");
let GraphsEntrypoint = document.getElementById("graphs");
let ManageUsersEntrypoint = document.getElementById("manageUsers");
ReactDOM.render(<DeviceListComponent name="list-hubs" />, deviceListEntrypoint );
ReactDOM.render(<ManageDevicesComponent  name="manage-devices" />, manageDevicesEntrypoint );
ReactDOM.render(<GraphsComponent  name="graphs" />, GraphsEntrypoint );
ReactDOM.render(<ManageUsersComponent  name="manage-users" />, ManageUsersEntrypoint );