import React from "react";
import ReactDOM from "react-dom";
import ManageInstitution from './container/ManageInstitution';

class HelloMessage extends React.Component {
  render() {
    return <div>
      <h2>Manage Institution</h2>
      <ManageInstitution />
    </div>
  }
}

let DeviceList = document.getElementById("deviceList");

ReactDOM.render(<HelloMessage name="test" />, DeviceList);