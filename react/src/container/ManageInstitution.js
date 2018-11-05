import React, {Component} from "react";
import HubsTable from "../component/HubsTable";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from '@material-ui/core/styles';
import axios from "axios";

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
  componentWillMount() {
    axios.get('/api/v2/hub/getPendingHubs.php')
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    const { classes } = this.props;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={6}>
          <HubsTable/>
        </Grid>
        <Grid item xs={6}>
          <HubsTable/>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(ManageInstitution);