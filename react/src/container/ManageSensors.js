import React, { Component } from "react";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import Typography from "@material-ui/core/Typography/Typography";
import SensorsTable from "../component/SensorsTable";
import PendingSensorsTable from "../component/PendingSensorsTable";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import LocationDropdown from "../component/LocationDropdown";
import CachedIcon from '@material-ui/icons/Cached';
import IconButton from "@material-ui/core/IconButton/IconButton";

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
  refreshIcon: {

  }
});

class ManageSensors extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      sensors: [],
      pendingSensors: [],
      loading: true,
      availableBuildings: [],
      selectedBuilding: "",
      selectedRoom: "" 
    };
  }

  componentWillMount() {
    this.fetchAndResolveInitialState();
  }

  componentDidMount() {
    $('.view-manage-sensors').on('displayChanged', (e, state) => {
      if(state === 'show'){
        this.setState(() => {
          return {loading: true};
        });
        this.fetchAndResolveInitialState();
      }
    });
  }

  fetchAndResolveInitialState = () => {
    let promises = [];
    promises.push(axios.get("/api/v2/sensor/getSensors.php"));
    promises.push(axios.get("/api/v2/sensor/getPendingSensors.php"));
    promises.push(axios.get("/api/v2/institution/getBuildings.php"));
    Promise.all(promises).then((response) => {
      // Responses
      const vSensors = response[0].data;
      const vPendingSensors = response[1].data;
      const vAvailableBuildings = response[2].data;
      // Array of filtered buildings. Only buildings with rooms
      const vFilteredBuildings = vAvailableBuildings.filter(building => (building.rooms.length > 0));
      // Array of filtered rooms. Only rooms with pending or attached/approved sensors
      const vFilteredRooms = vFilteredBuildings.length > 0 ? vFilteredBuildings[0].rooms.filter(room => (((vPendingSensors.filter(sensor => (sensor.HubID === room.hubID)).length > 0) || (vSensors.filter(sensor => (sensor.HubID === room.hubID)).length > 0)))) : null;

      this.setState(() => {
        return {
          sensors: vSensors,
          pendingSensors: vPendingSensors,
          availableBuildings: vAvailableBuildings,
          selectedBuilding: vFilteredBuildings.length > 0 ? vFilteredBuildings[0].id : null,
          selectedRoom: vFilteredRooms !== null && vFilteredRooms.length > 0 ? vFilteredRooms[0].hubID : null,
          loading: false,
        }
      });
    })
  }

  getSensors = () => {
    let promises = [];
    promises.push(axios.get("/api/v2/sensor/getSensors.php"));
    promises.push(axios.get("/api/v2/sensor/getPendingSensors.php"));
    Promise.all(promises).then((response) => {
      this.setState(() => {
        return {
          sensors: response[0].data,
          pendingSensors: response[1].data,
          loading: false
        }
      });
    })
  }

  handleRemoveSensor = (sensorID) => {
    axios.post("/api/v2/sensor/remove.php", {
        sensorID: sensorID
      }).then(() => {
        this.getSensors();
      });
  }

  handleApproveSensor = (sensorID) => {
    axios.post("/api/v2/sensor/approve.php", {
        sensorID: sensorID
      }).then(() => {
        this.getSensors();
      });
  }

  handleRoomSelectionChange = (value) => {
    this.setState(() => {
      return {selectedRooms: value};
    });
  }

  handleSelectBuilding = (e) => {
    this.setState({
      selectedBuilding: e.target.value,
      selectedRoom: ''
    })
  }

  handleSelectRoom = (e) => {
    this.setState({
      selectedRoom: e.target.value
    })
  }

  render () {
    const { classes } = this.props;
    const { sensors, pendingSensors, loading, availableBuildings, selectedBuilding, selectedRoom } = this.state;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
            <Grid container spacing={16}>
                <Grid item xs={6}>
                    <h2>Manage Sensors</h2>
                </Grid>
                <Grid item xs={6}>
                  <Grid container spacing={16} justify="flex-end">
                    <Grid item xs={3}>
                      <LocationDropdown
                          placeholder="Building"
                          value={selectedBuilding || 0}
                          options={availableBuildings
                              .filter(building => (building.rooms
                                  .map(room => ({id: room.hubID, name: room.roomName}))
                                  .filter(room => ((pendingSensors.filter(sensor => (sensor.HubID === room.id)).length > 0 || (sensors.filter(sensor => (sensor.HubID === room.id)).length > 0))))
                                  .length > 0))}
                          onChangeCB={this.handleSelectBuilding} />
                    </Grid>
                    <Grid item xs={3}>
                      <LocationDropdown 
                      placeholder="Room"
                      value={selectedRoom || 0}
                      options={availableBuildings.filter(building => (building.id === selectedBuilding))
                        .flatMap(building => (building.rooms))
                        .map(room => ({id: room.hubID, name: room.roomName}))
                        .filter(room => ((pendingSensors.filter(sensor => (sensor.HubID === room.id)).length > 0 || (sensors.filter(sensor => (sensor.HubID === room.id)).length > 0))))}
                      onChangeCB={this.handleSelectRoom} />
                    </Grid>
                      <Grid item xs={1}>
                          <IconButton className={classes.refreshIcon} aria-label="refresh" onClick={() => {this.fetchAndResolveInitialState()}}>
                              <CachedIcon />
                          </IconButton>
                      </Grid>
                  </Grid>
                </Grid>
              {loading ? <LinearProgress className={classes.loadingBar} /> : (
                <Grid container spacing={16}>
                  <Grid item xs={12}>
                    <Typography variant="h5">Pending  Sensors</Typography>
                    <PendingSensorsTable sensors={pendingSensors.filter(sensor => (sensor.HubID === selectedRoom))} onApproveSensor={this.handleApproveSensor} onRemoveSensor={this.handleRemoveSensor} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">Sensors</Typography>
                    <SensorsTable sensors={sensors.filter(sensor => (sensor.HubID === selectedRoom))} onRemoveSensor={this.handleRemoveSensor} />
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
