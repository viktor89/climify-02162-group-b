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

class ManageUsers extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: 0,
      users: [],
      roles: []
    };
  }

  componentWillMount(){
    this.getUsersAndRoles();
  }

  componentDidMount() {
    $('.view-other-users').on('displayChanged', (e, state) => {
      if(state === 'show'){
        this.getUsersAndRoles();
      }
    });
  }

  getUsersAndRoles = () => {
    axios.get("/api/v2/users/getUsers.php")
      .then(response => {
        this.setState(() => {
          return { users: response.data };
        });
      });
    axios.get("/api/v2/roles/getRoles.php")
      .then(response => {
        this.setState(() => {
          return { roles: response.data };
        });
      });
  };

  onDeleteUser = (user) => {
    axios.post("/api/v2/users/deleteUser.php", { userID: user.id })
      .then(response => {
        if(response.status === 200) {
          const {users} = this.state;
          this.setState({
            users: users.filter(currentUser => currentUser.id !== user.id)
          });
        }
      });
  }

  onSaveUser = (user) => {
    axios.put("/api/v2/users/editUser.php", { 
      userID: user.id, 
      userName: user.username, 
      firstName: user.firstname, 
      lastName: user.lastname, 
      email: user.email, 
      roleName: user.role
    })
    .then(response => {
        if(response.status === 200) {
          this.getUsersAndRoles();
        }
      });
  }

  handleChange = (e, value) => {
    this.setState({
      value: value,
    });
  };

  handleUserChange = (e, user) => {
    const {users} = this.state;
    this.setState({
      users: users.map(currentUser => (currentUser.id === user.id ? {...user, [e.target.name]: e.target.value, changed: true} : currentUser))
    });
  }

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
        {value === 0 && <UsersTable users={users} handleChange={this.handleUserChange} onSaveUser={this.onSaveUser} onDeleteUser={this.onDeleteUser}/>}
        {value === 1 && <RolesTable roles={roles}/>}
      </div>
    );
  }
}

ManageUsers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageUsers);