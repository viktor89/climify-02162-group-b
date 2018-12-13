import React, { Component } from "react";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from "@material-ui/core/styles";
import { Line } from "react-chartjs-2";
import axios from "axios";
import LocationDropdown from "../component/LocationDropdown";
import IconButton from "@material-ui/core/IconButton/IconButton";
import CachedIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Typography from '@material-ui/core/es/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
  refreshIcon: {
    position: 'absolute',
    right: '1em',
  },
});

class Graphs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availableBuildings: [],
      selectedBuilding: null,
      selectedRoom: null,
      sensorTypes: [],
      timeFrame: "60"
    };
  }

  componentDidMount() {
    $('.view-data').on('displayChanged', (e, state) => {
      if (state === 'show') {
        this.fetchAndResolveInitialState();
      }
    });
    this.fetchAndResolveInitialState();
  }

  fetchAndResolveInitialState = () => {
    let promises = [];
    axios.get("/api/v2/institution/getBuildings.php").then((response) => {
      this.setState(() => {
        return {
          availableBuildings: response.data,
          loading: false,
        }
      });
    })
    axios.get("/api/v2/sensor/getSensorTypes.php").then((response) => {
      this.setState(() => {
        return {
          sensorTypes: response.data,
        }
      });
    })
  };

  getGraphDataObject = (type) => {
    const { roomData, selectedRoom } = this.state;
    return {
      labels: roomData.filter(rd => rd.tags.sensor_type === type).map(dataPoint => (dataPoint.values.map(value => value[0]))).shift(),
      datasets: [
        {
          label: selectedRoom.name,
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: roomData.filter(rd => rd.tags.sensor_type === type).map(dataPoint => (dataPoint.values.map(value => value[1]))).shift(),
        },
      ],
    }
  }

  getData = () => {
    const { selectedRoom, sensorTypes, timeFrame } = this.state;
    const promises = sensorTypes.map(sensorType => (
        axios.post("/api/v2/room/getData.php", { hubID: selectedRoom.id, minutes: timeFrame, type: sensorType.name })
    ));
    Promise.all(promises).then(responses => {
      this.setState({
        roomData: responses.map(response => response.data.shift())
      })
    });
  };

  handleSelectBuilding = (event) => {
    const { availableBuildings } = this.state;
    this.setState({
      selectedBuilding: availableBuildings.filter(building => building.id === event.target.value).shift(),
    });
  };

  handleSelectRoom = (event) => {
    const { availableBuildings, selectedBuilding } = this.state;
    this.setState({
      selectedRoom: availableBuildings.filter(building => building.id === selectedBuilding.id).shift().rooms
        .filter(room => (room.hubID === event.target.value))
        .map(room => ({ id: room.hubID, name: room.roomName })).shift(),
    }, () => {
      this.getData();
    });
  };

  handleTimeChange = event => {
    this.setState({ timeFrame: event.target.value }, this.getData());
  };

  render() {
    const { classes } = this.props;
    const { availableBuildings, selectedBuilding, selectedRoom, roomData, sensorTypes } = this.state;
    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={6}>
          <h2>Graphs</h2>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={16} justify="flex-end">
            <Grid item xs={3}>
              <LocationDropdown
                placeholder="Building"
                value={selectedBuilding ? selectedBuilding.id : ''}
                onChangeCB={this.handleSelectBuilding}
                options={availableBuildings.map(building => ({ id: building.id, name: building.name }))} />
            </Grid>
            <Grid item xs={3}>
              {selectedBuilding && <LocationDropdown
                placeholder="Room"
                value={selectedRoom ? selectedRoom.id : ''}
                onChangeCB={this.handleSelectRoom}
                options={availableBuildings.filter(building => building.id === selectedBuilding.id).shift().rooms.map(room => ({
                  id: room.hubID,
                  name: room.roomName,
                }))}
              />}
            </Grid>
            <Grid item xs={1}>
              <IconButton className={classes.refreshIcon} aria-label="refresh" onClick={() => {this.getData()}}>
                <CachedIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Time Frame</FormLabel>
              <RadioGroup
                aria-label="position"
                name="position"
                row
                value={this.state.timeFrame}
                onChange={this.handleTimeChange}
              >
                <FormControlLabel
                  value="60"
                  control={<Radio color="primary" />}
                  label="1 Hour"
                />
                <FormControlLabel
                  value="1440"
                  control={<Radio color="primary" />}
                  label="1 Day"
                />
                <FormControlLabel
                  value="10080"
                  control={<Radio color="primary" />}
                  label="7 Days"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          {roomData && roomData.length > 0 && roomData.map(roomDataType => (
            <Grid key={roomDataType.tags.sensor_type} item xs={12} md={6}>
              <Typography variant="h6" align="center">
                {roomDataType.tags.sensor_type}
              </Typography>
              <Line data={this.getGraphDataObject(roomDataType.tags.sensor_type)} options={{
                scales: {
                  yAxes: [{
                    scaleLabel: {
                      display: true,
                    },
                  }],
                  xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Time',
                    },
                  }],
                },
              }} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Graphs);
