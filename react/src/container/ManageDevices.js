import React, { Component } from "react";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import Typography from "@material-ui/core/Typography/Typography";
import SensorsTable from "../component/SensorsTable";
import PendingSensorsTable from "../component/PendingSensorsTable";
import LocationSelector from "../component/LocationSelector";

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
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

class ManageUsers extends Component {
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
          this.setState(() => {
              return { getSensor: [[]] };
          });
      });
  }
  render() {
    const { classes } = this.props;
    const { getSensor } = this.state;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
            <Grid container spacing={16}>
                <Grid item xs={6}>
                    <h2>Manage Devices</h2>
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={16} justify="flex-end">
                    <LocationSelector />
                  </Grid>
                </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">Pending  Sensors</Typography>
                <PendingSensorsTable hubs={getSensor} />
              </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5">Sensors</Typography>
                    <SensorsTable hubs={getSensor} />
                </Grid>
            </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(ManageUsers);
