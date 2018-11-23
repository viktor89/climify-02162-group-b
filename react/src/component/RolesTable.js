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

function RolesTable({ classes, roles }) {
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
            <div className={classes.column}/>
          <div className={classes.column}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="component-simple">Role Name</InputLabel>
              <Input name="building" defaultValue={role.name} onChange={(e) => onHubChange(role, e)} />
            </FormControl>
          </div>
          <div className={classes.column}>

          </div>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Button classes={{root: classes.buttonRoot}} fullWidth size="small" color="primary" variant="outlined">Save</Button>
          <Button classes={{root: classes.buttonRoot}} fullWidth size="small" color="secondary" variant="outlined">Delete</Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    </div>
  ));
}

RolesTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RolesTable);