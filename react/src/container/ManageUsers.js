import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import axios from "axios";
import UsersTable from "../component/UsersTable";
import RolesTable from "../component/RolesTable";
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CachedIcon from '@material-ui/core/SvgIcon/SvgIcon';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  root: {
    flexGrow: 1,
  },
  refreshIcon: {
    color: 'black',
  },
};

class ManageUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      users: [],
      roles: [],
      loading: true,
    };
  }

  componentWillMount() {
    this.getUsersAndRoles();
  }

  componentDidMount() {
    $('.view-other-users').on('displayChanged', (e, state) => {
      if (state === 'show') {
        this.getUsersAndRoles();
      }
    });
  }

  getUsersAndRoles = () => {
    let promises = [];
    promises.push(axios.get("/api/v2/users/getUsers.php"));
    promises.push(axios.get("/api/v2/roles/getRoles.php"))
    Promise.all(promises).then(response => {
      this.setState(() => {
        return {
          users: response[0].data,
          roles: response[1].data,
          loading: false,
        };
      });
    });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value, users, roles, loading } = this.state;
    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={6}>
          <h2>Users & Roles</h2>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={16} justify="flex-end">
            <Grid item xs={1}>
              <IconButton color="primary" className={classes.refreshIcon} aria-label="refresh" onClick={() => {
                this.getUsersAndRoles()
              }}>
                <CachedIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        {loading ? <LinearProgress className={classes.loadingBar} /> : (
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Tabs
                value={this.state.value}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Users" />
                <Tab label="Roles" />
              </Tabs>
            </Grid>
            {value === 0 && <UsersTable users={users} />}
            {value === 1 && <RolesTable roles={roles} />}
          </Grid>
        )};
      </Grid>
    );
  }
}

ManageUsers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageUsers);