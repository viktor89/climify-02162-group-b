import React, { Component } from "react";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from "@material-ui/core/styles";
import LocationSelector from "../component/LocationSelector";
import axios from "axios";
import RulesTable from "../component/RulesTable";

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
  }
});

class Graphs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rules: [],
      loading: true,
    }
  }

  componentDidMount() {
    $('.view-climate-control').on('displayChanged', (e, state) => {
      if(state === 'show'){
        this.getRules();
      }
    });
    this.getRules();
  }

  getRules = () => {
    let promises = [];
    promises.push(axios.get("/api/v2/rule/getRules.php"));
    Promise.all(promises).then((response) => {
      this.setState(() => {
        return {
          rules: response[0].data,
          loading: false,
        }
      });
    })
  };

  render() {
    const { rules } = this.state;
    const { classes } = this.props;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <h2>Climate Control</h2>
          <Grid container spacing={16}>
            <Grid item xs={12} md={6}>
              <h3>Manage Rules</h3>
              <RulesTable rules={rules} />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocationSelector />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(Graphs);
