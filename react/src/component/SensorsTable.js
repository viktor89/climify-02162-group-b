import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import RefreshIcon from '@material-ui/icons/Refresh';
import Chip from "@material-ui/core/Chip/Chip";

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
  }
});

function SensorsTable(props) {
  const { classes, hubs } = props;
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
          {hubs.map(hub => {
            return (
              <TableRow key={hub.HubID}>
                <TableCell component="th" scope="row">
                  {hub.HubID}
                </TableCell>
                <TableCell>{hub.SensorID}</TableCell>
                <TableCell>{hub.sensorType}</TableCell>
                <TableCell>{hub.Building}</TableCell>
                <TableCell numeric>{hub.Room}</TableCell>
                <TableCell><Chip
                  label="Running"
                  clickable
                  className={classes.chip}
                  color="green"
                  onDelete={() => console.log('clicked')}
                  deleteIcon={<RefreshIcon className={classes.chipRefresh} />}
                /></TableCell>
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
