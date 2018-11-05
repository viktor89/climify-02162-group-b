import React, {Component} from "react";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from '@material-ui/core/styles';
import axios from "axios";
import PendingHubsTable from "../component/PendingHubsTable";
import RegisteredHubsTable from "../component/RegisteredHubsTable";

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
});

class ManageInstitution extends Component {
  constructor(props){
    super(props);
    this.state = {pendingHubs: [], registeredHubs: [{mac: "test", building: "303A", room: "45"}]}
  }
  componentWillMount() {
    axios.get('/api/v2/hub/getPendingHubs.php')
      .then((response) => {
        this.setState(() => {
          return {pendingHubs: response.data};
        });
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    const { classes } = this.props;
    const { pendingHubs, registeredHubs } = this.state;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={6}>
          <h3>Registered Hubs</h3>
          <RegisteredHubsTable hubs={registeredHubs}/>
        </Grid>
        <Grid item xs={6}>
          <h3>Unregistered Hubs</h3>
          <PendingHubsTable hubs={pendingHubs}/>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(ManageInstitution);