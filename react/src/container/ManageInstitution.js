import React, { Component } from "react";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import PendingHubsTable from "../component/PendingHubsTable";
import RegisteredHubsTable from "../component/RegisteredHubsTable";
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
    padding: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  loadingBar: {
    width: '100%',
  },
});

class ManageInstitution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingHubs: [],
      registeredHubs: [],
      institutions: [],
      selectedInstitution: 1,
      buildings: [],
      labelWidth: 65,
      loading: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.getHubs = this.getHubs.bind(this);
    this.handleRegisteredHubChanged = this.handleRegisteredHubChanged.bind(this);
    this.handleSaveRegisteredHub = this.handleSaveRegisteredHub.bind(this);
    this.handlePendingHubChanged = this.handlePendingHubChanged.bind(this);
    this.handlePendingHubChanged = this.handlePendingHubChanged.bind(this);
    this.handleUnregisterHub = this.handleUnregisterHub.bind(this);
  }

  componentWillMount() {
    const promises = [];
    promises.push(axios.get('/api/v2/institution/getInstitutions.php'));
    promises.push(axios.get('/api/v2/room/getRooms.php'));
    Promise.all(promises).then((response) => {
      this.setState(() => {
        return {institutions: response[0].data};
      });
      this.setState(() => {
        return {buildings: response[1].data};
      });
      this.getHubs(response[0].data[0].id);
    });
  }

  componentDidMount() {
    const { selectedInstitution } = this.state;
    $('.view-manage-institution').on('displayChanged', (e, state) => {
      if(state === 'show'){
        this.setState(() => {
          return {
            loading: true,
          };
        });
        this.getHubs(selectedInstitution);
      }
    });
  }

  getHubs(institutionID) {
    let promises = [];
    promises.push(
      axios.get('/api/v2/hub/getPendingHubs.php')
    );
    promises.push(
      axios.post("/api/v2/hub/getRegisteredHubs.php", {
        institutionID: institutionID
      })
    );
    Promise.all(promises).then((response) => {
      this.setState(() => {
        return {
          pendingHubs: response[0].data,
          registeredHubs: response[1].data,
          loading: false,
        };
      });
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    this.getHubs(event.target.value);
  }

  handleRegisteredHubChanged(hub, event, val) {
    const { registeredHubs } = this.state;
    const newHub = Object.assign(hub, { [event.target.name]: event.target.value || val });
    Object.assign(registeredHubs, registeredHubs.map(el=> el.mac === newHub.mac? newHub : el));
  }

  handleUnregisterHub(hubID){
    const { selectedInstitution } = this.state;
    axios
      .post("/api/v2/hub/remove.php", {
        hubID
      })
      .then(() => {
        this.getHubs(selectedInstitution);
      });
  }

  handleSaveRegisteredHub(mac){
    const { registeredHubs, selectedInstitution, buildings } = this.state;
    const hub = registeredHubs.filter((hub) => (hub.mac === mac)).shift();
    axios
      .post("/api/v2/hub/update.php", {
        mac: hub.mac,
        room: hub.room,
        building: buildings.filter((building) => (building.name === hub.building)).shift().id || "",
        receiveMode: hub.receiveMode || false,
      })
      .then(() => {
        this.getHubs(selectedInstitution);
      });
  }

  handlePendingHubChanged(hub, event) {
    const { registeredHubs } = this.state;
    const newHub = Object.assign(hub, { [event.target.name]: event.target.value });
    Object.assign(registeredHubs, registeredHubs.map(el=> el.mac === newHub.mac? newHub : el));
  }

  handleSavePendingHub(mac){
    const { pendingHubs, selectedInstitution, buildings } = this.state;
    const hub = pendingHubs.filter((hub) => (hub.mac === mac)).shift();
    axios
      .post("/api/v2/hub/approve.php", {
        mac: hub.mac,
        room: hub.room,
        building: buildings.filter((building) => (building.name === hub.building)).shift().id || ""
      })
      .then(() => {
        this.getHubs(selectedInstitution);
      });
  }

  render() {
    const { classes } = this.props;
    const { pendingHubs, registeredHubs, loading } = this.state;
    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Grid container className={classes.root} spacing={16} alignItems="center">
            <Grid item xs={10}>
              <h2>Manage Institution</h2>
            </Grid>
          </Grid>
          <hr />
        </Grid>
        {loading
          ? (<LinearProgress className={classes.loadingBar} />)
          : (registeredHubs.length === 0 && pendingHubs.length === 0)
            ? (<h3>No Hubs found</h3>)
            : (
              <Grid container spacing={16}>
                <Grid item md={6} xs={12}>
                  <h3>Registered Hubs</h3>
                  {registeredHubs && <RegisteredHubsTable hubs={registeredHubs} onSavehub={this.handleSaveRegisteredHub.bind(this)} onHubChange={this.handleRegisteredHubChanged.bind(this)} onUnregisterHub={this.handleUnregisterHub.bind(this)} />}
                </Grid>
                <Grid item md={6} xs={12}>
                  <h3>Unregistered Hubs</h3>
                  <PendingHubsTable hubs={pendingHubs} onSavehub={this.handleSavePendingHub.bind(this)} onHubChange={this.handlePendingHubChanged.bind(this)} />
                </Grid>
              </Grid>)
        }
      </Grid>
    );
  }
}
export default withStyles(styles)(ManageInstitution);
