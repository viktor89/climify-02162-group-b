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

const manageInstitutionEntrypoint = document.getElementById("manageInstitution");
const manageSensorsEntrypoint = document.getElementById("manageSensors");
const GraphsEntrypoint = document.getElementById("graphs");
const ManageUsersEntrypoint = document.getElementById("manageUsers");

manageInstitutionEntrypoint && ReactDOM.render(<ManageInstitutionComponent name="manage-institution" />, manageInstitutionEntrypoint);
manageSensorsEntrypoint && ReactDOM.render(<ManageSensorsComponent name="manage-devices" />, manageSensorsEntrypoint);
GraphsEntrypoint && ReactDOM.render(<GraphsComponent  name="graphs" />, GraphsEntrypoint);
ManageUsersEntrypoint && ReactDOM.render(<ManageUsersComponent  name="manage-users" />, ManageUsersEntrypoint);

$('.menu-link-manage-institution').click(() => {
  ReactDOM.unmountComponentAtNode(manageInstitutionEntrypoint);
  ReactDOM.render(<ManageInstitutionComponent name="manage-institution" />, manageInstitutionEntrypoint);
});
$('.menu-link-manage-sensors').click(() => {
  ReactDOM.unmountComponentAtNode(manageSensorsEntrypoint);
  ReactDOM.render(<ManageSensorsComponent name="manage-devices" />, manageSensorsEntrypoint);
});
$('.menu-link-data').click(() => {
  ReactDOM.unmountComponentAtNode(GraphsEntrypoint);
  ReactDOM.render(<GraphsComponent  name="graphs" />, GraphsEntrypoint);
});
$('.menu-link-other-users').click(() => {
  ReactDOM.unmountComponentAtNode(ManageUsersEntrypoint);
  ReactDOM.render(<ManageUsersComponent  name="manage-users" />, ManageUsersEntrypoint);
});
$('.menu-link-climate-control').click(() => {
  console.log('Climate control clicked');
});