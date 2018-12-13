import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Modal from "@material-ui/core/Modal/Modal";
import Typography from "@material-ui/core/Typography/Typography";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button/Button";

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

function AddRoleModal({ classes, open, addRoleModalClose, handleAddRoleInputChange, onAddRole}) {
    return <Modal
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
    open={open}
    onClose={addRoleModalClose}>

    <div className={classes.modal}>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Typography variant="h6" id="modal-title">
            Add role
          </Typography>
        </Grid>
        <Grid item xs={12}>
            <TextField
                label="Role name"
                name="rolename"
                fullWidth
                onChange={(e) => handleAddRoleInputChange(e)}
                />
        </Grid>
        <Grid item xs={12}>
            <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                onChange={(e) => handleAddRoleInputChange(e)}
            />
        </Grid>
        <Grid item xs={12}>
            <Button color={"primary"} variant={"outlined"} fullWidth onClick={onAddRole}>Save</Button>
        </Grid>
      </Grid>
    </div>
  </Modal>
}

export default withStyles(styles)(AddRoleModal);