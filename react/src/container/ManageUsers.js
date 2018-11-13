import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from "@material-ui/core/Typography/Typography";
import axios from "axios";
import UsersTable from "../component/UsersTable";
import RolesTable from "../component/RolesTable";

const styles = {
  root: {
    flexGrow: 1,
  },
};

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

class ManageUsers extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: 0,
      users: [],
      roles: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount(){
    axios
      .get("/api/v2/users/getUsers.php")
      .then(response => {
        this.setState(() => {
          return { users: response.data };
        });
      });
    axios
      .get("/api/v2/roles/getRoles.php")
      .then(response => {
        this.setState(() => {
          return { roles: response.data };
        });
      });
  }

  handleChange(event, value) {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value, users, roles } = this.state;
    return (
      <div className={classes.root}>
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
        {value === 0 && <UsersTable users={users} />}
        {value === 1 && <RolesTable roles={roles}/>}
      </div>
    );
  }
}

ManageUsers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageUsers);