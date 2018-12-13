import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from "@material-ui/core/Grid/Grid";
import axios from "axios";
import UsersTable from "../component/UsersTable";
import RolesTable from "../component/RolesTable";
import Button from "@material-ui/core/Button/Button";
import AddIcon from '@material-ui/icons/Add';
import AddUserModal from '../component/AddUserModal';
import AddRoleModal from '../component/AddRoleModal';

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
      roles: [],
      addUserModalOpen: false,
      addRoleModalOpen: false,
      newUser: null,
      newRole: null
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

  addRoleOpen = () => {
    this.setState({ addRoleModalOpen: true });
  }

  addRoleClose = () => {
    this.setState({ addRoleModalOpen: false });
  }

  addUserOpen = () => {
    this.setState({ addUserModalOpen: true });
  };
    
  addUserClose = () => {
    this.setState({ addUserModalOpen: false });
  };

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

  onAddUser = () => {
    const { users, newUser } = this.state;
    if (users.filter(currentUser => (currentUser.id === newUser.id) || (currentUser.username === newUser.username)).length === 0) {
      axios.post("/api/v2/users/createUser.php", {
        userName: newUser.username, 
        firstName: newUser.firstname, 
        lastName: newUser.lastname, 
        email: newUser.email, 
        roleName: newUser.role,
        password: newUser.password
      })
        .then(response => {
          this.getUsersAndRoles();
          this.setState({
            addUserModalOpen: false
          });
        });
    }
  }

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

  onAddRole = () => {

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

  handleRoleChange = (e, role) => {

  }

  handleAddUserInputChange = (e) => {
    const { newUser } = this.state;
    this.setState({
      newUser: {...newUser, [e.target.name]: e.target.value}
    });
  }

  handleAddRoleInputChange = (e) => {

  }

  render() {
    const { classes } = this.props;
    const { value, users, roles, addUserModalOpen, addRoleModalOpen } = this.state;
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
        {value === 0 && 
        <div>
          <UsersTable users={users} handleChange={this.handleUserChange} onSaveUser={this.onSaveUser} onDeleteUser={this.onDeleteUser}/>
          <Grid container spacing={16}>
            <Grid item xs={12}></Grid>
            <Button className={classes.addRuleButton} variant="fab" color={"primary"} onClick={this.addUserOpen}><AddIcon /></Button>
          </Grid>
          <AddUserModal open={addUserModalOpen} addUserModalClose={this.addUserClose} handleAddUserInputChange={this.handleAddUserInputChange} onAddUser={this.onAddUser}/>
        </div>
        }
        {value === 1 && 
        <div>  
          <RolesTable roles={roles} handleChange={this.handleRoleChange} onSaveRole={this.onSaveRole} onDeleteRole={this.onDeleteRole}/>
          <Grid container spacing={16}>
            <Grid item xs={12}></Grid>
            <Button className={classes.addRoleButton} variant="fab" color={"primary"} onClick={this.addRoleOpen}><AddIcon/></Button>
          </Grid>
          <AddRoleModal open={addRoleModalOpen} addRoleModalClose={this.addRoleClose} handleAddRoleInputChange={this.handleAddRoleInputChange} onAddRole={this.onAddRole}/>
        </div>
        }
      </div>
    );
  }
}

ManageUsers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageUsers);