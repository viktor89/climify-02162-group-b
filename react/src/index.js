import React from "react";
import ReactDOM from "react-dom";
import ManageInstitution from './container/ManageInstitution';
import Counter from './container/Counter';

class DeviceListComponent extends React.Component {
  render() {
    return <div>
      <ManageInstitution />
    </div>
  }
}

class CounterComponent extends React.Component {
  render () {
    return <div>
      <h2>Manage Devices</h2>
      <hr />
      <Counter />
    </div>
  }
}

let DeviceListEntrypoint = document.getElementById("deviceList");
let ManageDevicesEntrypoint = document.getElementById("manageDevices");

ReactDOM.render(<DeviceListComponent name="test" />, DeviceListEntrypoint);
ReactDOM.render(<CounterComponent name="test" />, ManageDevicesEntrypoint);