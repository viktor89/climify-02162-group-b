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
  }
});

function SensorsTable(props) {
  const { classes, hubs, onRemoveSensor } = props;
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
                  label=""
                  clickable
                  className={classes.chip}
                /></TableCell>
                <TableCell>
                  <Grid container spacing={16} justify="center">
                    <Grid item xs={12}>
                      <Button fullWidth variant="outlined" color="secondary" onClick={(e) => {onRemoveSensor(hub.SensorID)}}>
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
