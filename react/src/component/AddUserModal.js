import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Modal from "@material-ui/core/Modal/Modal";
import Typography from "@material-ui/core/Typography/Typography";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button/Button";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

const styles = theme => ({
    root: {
      flexGrow: 1
    },
    paper: {
      height: 140,
      width: 100
    },
    modal: {
      position: 'absolute',
      width: theme.spacing.unit * 50,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing.unit * 4,
      top: '50%',
      left: '50%',
      transform: `translate(-${50}%, -${50}%)`,
    },
    addRuleButton: {
      position: 'absolute',
      bottom: theme.spacing.unit * 2,
      left: theme.spacing.unit * 2,
    },
    control: {
      padding: theme.spacing.unit * 2
    },
    ruleFormType: {
      lineHeight: '5em',
    },
});

function AddUserModal({ classes, open, roles, newUser, addUserModalClose, handleAddUserInputChange, onAddUser}) {
    return <Modal
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
    open={open}
    onClose={addUserModalClose}>

    <div className={classes.modal}>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Typography variant="h6" id="modal-title">
            Add user
          </Typography>
        </Grid>
        <Grid item xs={12}>
            <TextField
                label="Username"
                name="username"
                fullWidth
                onChange={(e) => handleAddUserInputChange(e)}
                />
        </Grid>
        <Grid item xs={12}>
            <TextField
                label="Firstname"
                name="firstname"
                fullWidth
                onChange={(e) => handleAddUserInputChange(e)}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
                label="Lastname"
                name="lastname"
                fullWidth
                onChange={(e) => handleAddUserInputChange(e)}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
                label="Email"
                name="email"
                fullWidth
                onChange={(e) => handleAddUserInputChange(e)}
            />
        </Grid>
        <Grid item xs={12}>
            <FormControl disabled={roles.length === 0} fullWidth className={classes.select}>
                <InputLabel shrink htmlFor="role">{"Role"}</InputLabel>
                <Select className={classes.select} value={newUser !== null ? newUser.role : 'Nothing'} name="role" onChange={(e) => handleAddUserInputChange(e)}>{roles.map(role => {
                    return (<MenuItem key={role.id} value={role.name}>
                        <em>{role.name}</em>
                    </MenuItem>)
                })}</Select>
            </FormControl>
        </Grid>
        <Grid item xs={12}>
            <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                onChange={(e) => handleAddUserInputChange(e)}
            />
        </Grid>
        <Grid item xs={12}>
            <Button color={"primary"} variant={"outlined"} fullWidth onClick={onAddUser}>Save</Button>
        </Grid>
      </Grid>
    </div>
  </Modal>
}

export default withStyles(styles)(AddUserModal);