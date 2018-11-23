import React, { Component } from "react";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import RulesTable from "../component/RulesTable";
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
  refreshIcon: {
    position: 'absolute',
    right: '1em',
  },
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
    promises.push(axios.get("/api/v2/rule/read.php"));
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
        <Grid item xs={11}>
          <h2>Climate Control</h2>
          <h3>Manage Rules</h3>
        </Grid>
        <IconButton className={classes.refreshIcon} aria-label="refresh" onClick={(e) => {this.getRules()}}>
          <CachedIcon />
        </IconButton>
        <Grid item xs={12}>
          <RulesTable rules={rules} />
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(Graphs);
