import React, { Component } from "react";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import PendingHubsTable from "../component/PendingHubsTable";
import RegisteredHubsTable from "../component/RegisteredHubsTable";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput/OutlinedInput";
import * as ReactDOM from "react-dom";

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
});

class ManageInstitution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingHubs: [],
      registeredHubs: [],
      institutions: [],
      selectedInstitution: 1,
      labelWidth: 65,
    };
    this.handleChange = this.handleChange.bind(this);
    this.getHubs = this.getHubs.bind(this);
    this.handleHubChanged = this.handleHubChanged.bind(this);
  }

  componentWillMount() {
    axios.get('/api/v2/institution/getInstitutions.php')
      .then((response) => {
        this.setState(() => {
          return {institutions: response.data};
        });
        this.getHubs(response.data[0].id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getHubs(institutionID) {
    axios.get('/api/v2/hub/getPendingHubs.php')
      .then((response) => {
        this.setState(() => {
          return { pendingHubs: response.data };
        });
      })
      .catch(error => {
        console.log(error);
      });
    axios
      .post("/api/v2/hub/getRegisteredHubs.php", {
        institutionID: institutionID
      })
      .then(response => {
        this.setState(() => {
          return { registeredHubs: response.data };
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    this.getHubs(event.target.value);
  };

  handleHubChanged(hub) {
    console.log(hub);
  }

  render() {
    const { classes } = this.props;
    const { pendingHubs, registeredHubs, institutions } = this.state;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <Grid container className={classes.root} spacing={16} alignItems="center">
            <Grid item xs={10}>
              <h2>Manage Institution</h2>
            </Grid>
            <Grid item xs={2}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel
                  htmlFor="institution-id"
                >
                  Institution
                </InputLabel>
                <Select
                  value={this.state.selectedInstitution}
                  onChange={this.handleChange.bind(this)}
                  input={
                    <OutlinedInput
                      labelWidth={this.state.labelWidth}
                      name="selectedInstitution"
                      id="institution-id"
                    />
                  }
                >
                  {institutions.map((institution) => {
                    return <MenuItem key={institution.id} value={institution.id}>{institution.name}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <hr />
        </Grid>
        <Grid item md={6} xs={12}>
          <h3>Registered Hubs</h3>
          <RegisteredHubsTable hubs={registeredHubs} />
        </Grid>
        <Grid item md={6} xs={12}>
          <h3>Unregistered Hubs</h3>
          <PendingHubsTable hubs={pendingHubs} onHubChange={this.handleHubChanged.bind(this)} />
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(ManageInstitution);
