import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button/Button";

const styles = theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20
  },
  details: {
    alignItems: "center"
  },
  column: {
    flexBasis: "33.33%"
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline"
    }
  },
  rowButton: {
    marginRight: '2em',
  },
  chip: {
    margin: theme.spacing.unit,
    backgroundColor: 'green',
    color: 'white'
  },
  chipRefresh: {
    color: 'white',
  },
  redText: {
    color: 'red'
  },
  greenText: {
    color: 'green'
  }
});

function SensorsTable({ classes, sensors, onRemoveSensor }) {
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>MAC Address</TableCell>
            <TableCell>Name/Description</TableCell>
            <TableCell>Sensor Type</TableCell>
            <TableCell>Building</TableCell>
            <TableCell numeric>Room</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sensors.map(sensor => {
            return (
              <TableRow key={sensor.SensorID}>
                <TableCell component="th" scope="row">
                  {sensor.HubID}
                </TableCell>
                <TableCell>{sensor.SensorID}</TableCell>
                <TableCell>{sensor.SensorType}</TableCell>
                <TableCell>{sensor.Building}</TableCell>
                <TableCell numeric>{sensor.Room}</TableCell>
                <TableCell className={sensor.running ? classes.greenText : classes.redText}>{sensor.running ? 'Running' : 'Not Running'}</TableCell>
                <TableCell>
                  <Grid container spacing={16} justify="center">
                    <Grid item xs={12}>
                      <Button fullWidth variant="outlined" color="secondary" onClick={(e) => {onRemoveSensor(sensor.HubID, sensor.SensorID)}}>
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

SensorsTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SensorsTable);
