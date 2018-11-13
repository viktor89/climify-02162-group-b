import React from "react";
import ReactDOM from "react-dom";
import ManageInstitution from "./container/ManageInstitution";
import ManageSensors from "./container/ManageSensors";
import Graphs from "./container/Graphs";
import ManageUsers from "./container/ManageUsers";
import MuiThemeProvider from "@material-ui/core/es/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/es/styles/createMuiTheme";

const theme = createMuiTheme();

class ManageInstitutionComponent extends React.Component {
  render() {
    return (
      <div>
          <ManageInstitution />
      </div>
    );
  }
}
class ManageSensorsComponent extends React.Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <ManageSensors />
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

let manageInstitutionEntrypoint = document.getElementById("manageInstitution");
let manageSensorsEntrypoint = document.getElementById("manageSensors");
let GraphsEntrypoint = document.getElementById("graphs");
let ManageUsersEntrypoint = document.getElementById("manageUsers");

ReactDOM.render(<ManageInstitutionComponent name="manage-institution" />, manageInstitutionEntrypoint  );
ReactDOM.render(<ManageSensorsComponent name="manage-devices" />, manageSensorsEntrypoint  );
ReactDOM.render(<GraphsComponent  name="graphs" />, GraphsEntrypoint );
ReactDOM.render(<ManageUsersComponent  name="manage-users" />, ManageUsersEntrypoint );