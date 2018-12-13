import React, { Component } from "react";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import PendingHubsTable from "../component/PendingHubsTable";
import RegisteredHubsTable from "../component/RegisteredHubsTable";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
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
    padding: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  loadingBar: {
    width: '100%',
  },
  refreshIcon: {
    position: 'absolute',
    right: '1em',
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
      rooms: [],
      labelWidth: 65,
      loading: true,
    };
  }

  componentWillMount() {
    const promises = [];
    promises.push(axios.get('/api/v2/institution/getInstitutions.php'));
    promises.push(this.getBuildings());
    Promise.all(promises).then((response) => {
      this.setState(() => {
        return {institutions: response[0].data};
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

  getHubs = (institutionID) => {
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

  getBuildings = () => {
      return axios.get('/api/v2/institution/getBuildings.php').then((response) => {
          this.setState(() => {
              return {buildings: response.data};
          });
      });
  };

  handleRegisteredHubChanged = (mac, name, value) => {
    const { registeredHubs } = this.state;
    const newHub = Object.assign(registeredHubs.filter(hub => (hub.mac === mac)).shift(), { [name]: value });
    Object.assign(registeredHubs, registeredHubs.map(el=> el.mac === newHub.mac? newHub : el));
    this.setState({registeredHubs});
    console.log(registeredHubs);
  };

  handleUnregisterHub = (hubID) => {
    const { selectedInstitution } = this.state;
    axios
      .post("/api/v2/hub/remove.php", {
        hubID
      })
      .then(() => {
        this.getHubs(selectedInstitution);
      });
  };

  handleSaveRegisteredHub = (mac) => {
    const { registeredHubs, selectedInstitution, buildings } = this.state;
    const hub = registeredHubs.filter((hub) => (hub.mac === mac)).shift();
    axios
      .post("/api/v2/hub/update.php", {
        mac: hub.mac,
        room: hub.room,
        building: hub.building,
        receiveMode: hub.receiveMode || false,
      })
      .then(() => {
        this.getHubs(selectedInstitution);
      });
  };

  handlePendingHubChanged = (mac, name, value) => {
    const { pendingHubs } = this.state;
    const newHub = Object.assign(pendingHubs.filter(hub => (hub.mac === mac)).shift(), { [name]: value });
    Object.assign(pendingHubs, pendingHubs.map(el=> el.mac === newHub.mac? newHub : el));
    this.setState({pendingHubs});
  };

  handleSavePendingHub = (mac) => {
    const { pendingHubs, selectedInstitution } = this.state;
    const hub = pendingHubs.filter((hub) => (hub.mac === mac)).shift();
    console.log(hub);
    axios
      .post("/api/v2/hub/approve.php", {
        mac: hub.mac,
        room: hub.room,
        building: hub.building
      })
      .then(() => {
        this.getHubs(selectedInstitution);
      });
  };

  // Creatable component
  handleCreateBuilding = (value) => {
    const {buildings} = this.state;
    buildings.push({
      id: buildings[buildings.length-1].id+1,
      name: value,
      rooms: []
    });
    this.setState({buildings});
  };

  render() {
    const { classes } = this.props;
    const { pendingHubs, registeredHubs, loading, buildings, selectedInstitution} = this.state;
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
          <IconButton className={classes.refreshIcon} aria-label="refresh" onClick={() => {this.getHubs(selectedInstitution)}}>
              <CachedIcon />
          </IconButton>
        {loading
          ? (<LinearProgress className={classes.loadingBar} />)
          : (registeredHubs.length === 0 && pendingHubs.length === 0)
            ? (<h3>No Hubs found</h3>)
            : (
              <Grid container spacing={16}>
                <Grid item md={6} xs={12}>
                  <h3>Registered Hubs</h3>
                  {registeredHubs && <RegisteredHubsTable
                      hubs={registeredHubs}
                      buildings={buildings}
                      onCreateBuilding={this.handleCreateBuilding}
                      onSavehub={this.handleSaveRegisteredHub}
                      onHubChange={this.handleRegisteredHubChanged}
                      onUnregisterHub={this.handleUnregisterHub} />}
                </Grid>
                <Grid item md={6} xs={12}>
                  <h3>Unregistered Hubs</h3>
                  {pendingHubs && <PendingHubsTable
                      hubs={pendingHubs}
                      buildings={buildings}
                      onCreateBuilding={this.handleCreateBuilding}
                      onSavehub={this.handleSavePendingHub}
                      onHubChange={this.handlePendingHubChanged}
                      onUnregisterHub={this.handleUnregisterHub}
                  />}
                </Grid>
              </Grid>)
        }
      </Grid>
    );
  }
};

export default withStyles(styles)(ManageInstitution);
