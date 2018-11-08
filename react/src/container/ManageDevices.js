import React, { Component } from "react";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import GetSensorInstance from "../component/GetSensorInstance";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    height: 140,
    width: 100
  },
  control: {
    padding: theme.spacing.unit * 2
  }
});

class ManageDevice extends Component {
  constructor(props) {
    super(props);
    this.state = { getSensor: [] };
  }
  componentWillMount() {
    axios
      .get("/api/v2/sensor/getSensors.php")
      .then(response => {
        this.setState(() => {
          return { getSensor: response.data };
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    const { classes } = this.props;
    const {
      getSensor: []
    } = this.state;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={6}>
          <h3>Devices</h3>
          <GetSensorInstance hubs={getSensor} />
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(ManageDevice);
