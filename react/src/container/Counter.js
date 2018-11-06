import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

let id = 0;
function createData(MACAdress, name, type, building, room, status) {
  id += 1;
  return { id, MACAdress, name, type, building, room, status };
}

const rows = [
  createData(
    "86:90:a8:bd:3a:22",
    "Temp sens NW Corner",
    "Temperature Sensor",
    "303A",
    46,
    <div>
      <button className="btn btn-success btn.sm"> Accept</button>{" "}
      <button className="btn btn-danger btn.sm"> Decline</button>
    </div>
  ),
  createData(
    "ca:ee:c0:ea:58:7f",
    "Humid Sens NW Corner",
    "Temperature Sensor",
    "303A",
    46,
    <div>
      <button className="btn btn-success btn.sm"> Accept</button>{" "}
      <button className="btn btn-danger btn.sm"> Decline</button>
    </div>
  ),
  createData(
    "d2:19:34:69:25:be",
    "Temp sens NW Corner",
    "Humidity Sensor",
    "101",
    "Hall 1",
    <div>
      <button className="btn btn-success btn.sm"> </button> <span>running</span>
    </div>
  ),
  createData(
    "d6:f5:fe:5e:b7:8e",
    "C02 Sens North",
    "CO2 Sensor",
    101,
    "Hall 1",
    <div>
      <button className="btn btn-success btn.sm"> </button> <span>running</span>
    </div>
  ),
  createData(
    "c2:bd:64:e3:19:ed",
    "Temp Sens NE Corner",
    "Temperature Sensor",
    101,
    "Hall 1",
    <div>
      <button className="btn btn-danger btn.sm"> </button>{" "}
      <span> not running</span>
    </div>
  )
];
class Counter extends Component {
  render() {
    return (
      <div>
        <h1>Device Overview </h1>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <CustomTableCell>MAC Adreess</CustomTableCell>
                <CustomTableCell numeric>Name/ Description </CustomTableCell>
                <CustomTableCell numeric>Type </CustomTableCell>
                <CustomTableCell numeric>Building </CustomTableCell>
                <CustomTableCell numeric>Room </CustomTableCell>
                <CustomTableCell numeric>Status </CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => {
                return (
                  <TableRow key={row.id}>
                    <CustomTableCell component="th" scope="row">
                      {row.MACAdress}
                    </CustomTableCell>
                    <CustomTableCell numeric>{row.name}</CustomTableCell>
                    <CustomTableCell numeric>{row.type}</CustomTableCell>
                    <CustomTableCell numeric>{row.building}</CustomTableCell>
                    <CustomTableCell numeric>{row.room}</CustomTableCell>
                    <CustomTableCell numeric>{row.status}</CustomTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

export default Counter;