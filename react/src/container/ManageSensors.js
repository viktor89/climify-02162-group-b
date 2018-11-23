import React, { Component } from "react";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import Typography from "@material-ui/core/Typography/Typography";
import SensorsTable from "../component/SensorsTable";
import PendingSensorsTable from "../component/PendingSensorsTable";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import LocationDropdown from "../component/LocationDropdown";

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
    this.getSensors();
    this.getAvailableBuildings();
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

  getSensors = () => {
    let promises = [];
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

  getAvailableBuildings = () => {
    axios.get("/api/v2/institution/getBuildings.php").then((response) => {
      this.setState({
          availableBuildings: response.data,
          selectedBuilding: response.data.filter(building => (building.rooms.length > 0))[0].id
        });
        console.log(this.state);
    });
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
                      <LocationDropdown placeholder="Building" value={selectedBuilding} options={availableBuildings.filter(building => (building.rooms.length > 0))} onChangeCB={this.handleSelectBuilding} />
                    </Grid>
                    <Grid item xs={3}>
                      <LocationDropdown 
                      placeholder="Room"
                      value={selectedRoom}
                      options={availableBuildings.filter(building => (building.id === selectedBuilding))
                        .flatMap(building => (building.rooms))
                        .map(room => ({id: room.hubID, name: room.roomName}))
                        .filter(room => ((pendingSensors.filter(sensor => (sensor.HubID === room.id)).length > 0 || (sensors.filter(sensor => (sensor.HubID === room.id)).length > 0))                          ))
                      }
                      onChangeCB={this.handleSelectRoom} />
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
