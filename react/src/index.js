import React from "react";
import ReactDOM from "react-dom";
import ManageInstitution from "./container/ManageInstitution";
import ManageSensors from "./container/ManageSensors";
import Graphs from "./container/Graphs";
import ManageUsers from "./container/ManageUsers";
import MuiThemeProvider from "@material-ui/core/es/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/es/styles/createMuiTheme";
import ClimateControl from "./container/ClimateControl";

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

class ManageClimateControlComponent extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <ClimateControl />
      </MuiThemeProvider>
    );
  }
}

const manageInstitutionEntrypoint = document.getElementById("manageInstitution");
const manageSensorsEntrypoint = document.getElementById("manageSensors");
const GraphsEntrypoint = document.getElementById("graphs");
const ManageUsersEntrypoint = document.getElementById("manageUsers");
const ManageClimateControlEntrypoint = document.getElementById("climateControl");

manageInstitutionEntrypoint && ReactDOM.render(<ManageInstitutionComponent name="manage-institution" />, manageInstitutionEntrypoint);
manageSensorsEntrypoint && ReactDOM.render(<ManageSensorsComponent name="manage-devices" />, manageSensorsEntrypoint);
GraphsEntrypoint && ReactDOM.render(<GraphsComponent  name="graphs" />, GraphsEntrypoint);
ManageUsersEntrypoint && ReactDOM.render(<ManageUsersComponent  name="manage-users" />, ManageUsersEntrypoint);
ManageClimateControlEntrypoint && ReactDOM.render(<ManageClimateControlComponent  name="climate-control" />, ManageClimateControlEntrypoint);

(function() {
  var eventDisplay = new $.Event('displayChanged'),
    origShow = $.fn.show,
    origHide = $.fn.hide;
  //
  $.fn.show = function() {
    origShow.apply(this, arguments);
    $(this).trigger(eventDisplay,['show']);
  };
  //
  $.fn.hide = function() {
    origHide.apply(this, arguments);
    $(this).trigger(eventDisplay,['hide']);
  };
  //
})();