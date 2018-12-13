import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '20%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  buttonRoot: {
    '& span': {
      marginTop: '0 !important',
    }
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

function RolesTable({ classes, roles, handleRoleNameChange, handlePermissionChange, onSaveRole, onDeleteRole }) {
  return roles.map((role) => (
    <div key={role.id} className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.column}>
                <Typography className={classes.heading}>Role ID:</Typography>
                <Typography className={classes.secondaryHeading}>{role.id}</Typography>
            </div>
          <div className={classes.column}>
            <Typography className={classes.heading}>Role Name:</Typography>
            <Typography className={classes.secondaryHeading}>{role.name}</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.heading}>Permissions:</Typography>
            <Typography className={classes.secondaryHeading}>{role.permissions.length}</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <div className={classes.column}>
                <Typography className={classes.secondaryHeading}>Role ID:</Typography>
                <Typography className={classes.secondaryHeading}>{role.id}</Typography>
          </div>
          <div className={classes.column}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="component-simple">Role Name</InputLabel>
              <Input name="rolename" defaultValue={role.name} onChange={(e) => handleRoleNameChange(e, role)} />
            </FormControl>
          </div>
          
          <FormGroup row>
            {role.permissions.map(permission => (
              <div key={permission.permID} className={classes.column}>
                <FormControlLabel
                control={
                  <Checkbox
                    name={`${permission.permID}-${permission.permName}`}
                    checked={permission.hasPermission !== 0}
                    value={`${permission.permID}-${permission.permName}`}
                    onChange={(e, checked) => handlePermissionChange(checked, role, permission)}
                  />
                }
                label={permission.permName}
                />
            </div>
            ))}
            </FormGroup>

        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Button disabled={!role.changed} classes={{root: classes.buttonRoot}} fullWidth size="small" color="primary" variant="outlined" onClick={() => onSaveRole(role)}>Save</Button>
          <Button classes={{root: classes.buttonRoot}} fullWidth size="small" color="secondary" variant="outlined" onClick={() => onDeleteRole(role)}>Delete</Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    </div>
  ));
}

RolesTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RolesTable);