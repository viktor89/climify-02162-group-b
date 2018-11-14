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

class ManageSensors extends Component {
  constructor(props) {
    super(props);
    this.state = { sensors: [], pendingSensors: [] };
    this.handleApproveSensor = this.handleApproveSensor.bind(this);
    this.handleRemoveSensor = this.handleRemoveSensor.bind(this);
    this.getSensors = this.getSensors.bind(this);
  }

  componentWillMount() {
    this.getSensors();
  }

  getSensors(){
    axios
      .get("/api/v2/sensor/getSensors.php")
      .then(response => {
        this.setState(() => {
          return { sensors: response.data };
        });
      });
    axios
      .get("/api/v2/sensor/getPendingSensors.php")
      .then(response => {
        this.setState(() => {
          return { pendingSensors: response.data };
        });
      });
  }

  handleRemoveSensor(sensorID){
    axios
      .post("/api/v2/sensor/remove.php", {
        sensorID: sensorID
      })
      .then(() => {
        this.getSensors();
      });
  }

  handleApproveSensor(sensorID){
    axios
      .post("/api/v2/sensor/approve.php", {
        sensorID: sensorID
      })
      .then(() => {
        this.getSensors();
      });
  }

  render() {
    const { classes } = this.props;
    const { sensors, pendingSensors } = this.state;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
            <Grid container spacing={16}>
                <Grid item xs={6}>
                    <h2>Manage Sensors</h2>
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={16} justify="flex-end">
                    <LocationSelector />
                  </Grid>
                </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">Pending  Sensors</Typography>
                <PendingSensorsTable hubs={pendingSensors} onApproveSensor={this.handleApproveSensor.bind(this)} onRemoveSensor={this.handleRemoveSensor.bind(this)} />
              </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5">Sensors</Typography>
                    <SensorsTable hubs={sensors} onRemoveSensor={this.handleRemoveSensor.bind(this)} />
                </Grid>
            </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(ManageSensors);
