import React, { Component } from "react";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import Typography from "@material-ui/core/Typography/Typography";
import SensorsTable from "../component/SensorsTable";
import PendingSensorsTable from "../component/PendingSensorsTable";
import LocationSelector from "../component/LocationSelector";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";

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
  loadingBar: {
    width: '100%',
  },
});

class ManageSensors extends Component {
  constructor(props) {
    super(props);
    this.state = { sensors: [], pendingSensors: [], loading: true, selectedRooms: [] };
    this.handleApproveSensor = this.handleApproveSensor.bind(this);
    this.handleRemoveSensor = this.handleRemoveSensor.bind(this);
    this.getSensors = this.getSensors.bind(this);
    this.handleRoomSelectionChange = this.handleRoomSelectionChange.bind(this);
  }

  componentWillMount() {
    this.getSensors();
  }

  componentDidMount() {
    $('.view-manage-sensors').on('displayChanged', (e, state) => {
      if(state === 'show'){
        this.setState(() => {
          return {loading: true};
        });
        this.getSensors();
      }
    });
  }

  getSensors(){
    let promises = []
    promises.push(axios.get("/api/v2/sensor/getSensors.php"));
    promises.push(axios.get("/api/v2/sensor/getPendingSensors.php"));
    Promise.all(promises).then((response) => {
      this.setState(() => {
        return {
          sensors: response[0].data,
          pendingSensors: response[1].data,
          loading: false,
        }
      });
    })
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

  handleRoomSelectionChange(value){
    this.setState(() => {
      return {selectedRooms: value}
    });
  }

  render() {
    const { classes } = this.props;
    const { sensors, pendingSensors, loading, selectedRooms } = this.state;

    console.log(selectedRooms);

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
            <Grid container spacing={16}>
                <Grid item xs={6}>
                    <h2>Manage Sensors</h2>
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={16} justify="flex-end">
                    <LocationSelector onchangeCB={this.handleRoomSelectionChange.bind(this)} />
                  </Grid>
                </Grid>
              {loading ? <LinearProgress className={classes.loadingBar} /> : (
                <Grid container spacing={16}>
                  <Grid item xs={12}>
                    <Typography variant="h5">Pending  Sensors</Typography>
                    <PendingSensorsTable sensors={pendingSensors.filter((sensor) => (selectedRooms.indexOf(sensor.Building)>=0 || selectedRooms.indexOf(sensor.Room)>=0))} onApproveSensor={this.handleApproveSensor.bind(this)} onRemoveSensor={this.handleRemoveSensor.bind(this)} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">Sensors</Typography>
                    <SensorsTable sensors={sensors} onRemoveSensor={this.handleRemoveSensor.bind(this)} />
                  </Grid>
                </Grid>
              )}
            </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(ManageSensors);
