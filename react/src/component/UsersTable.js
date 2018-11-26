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
import Grid from "@material-ui/core/Grid/Grid";
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
  buttonRoot: {
    '& span': {
      marginTop: '0 !important',
    }
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

function UsersTable({ classes, users, onHubChange, onSavehub }) {
  return users.map((user) => (
    <div key={user.id} className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div className={classes.column}>
            <Typography className={classes.heading}>User ID:</Typography>
            <Typography className={classes.secondaryHeading}>{user.id}</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.heading}>Username:</Typography>
            <Typography className={classes.secondaryHeading}>{user.username}</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.heading}>First name:</Typography>
            <Typography className={classes.secondaryHeading}>{user.firstname}</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.heading}>Last name:</Typography>
            <Typography className={classes.secondaryHeading}>{user.lastname}</Typography>
          </div>
            <div className={classes.column}>
                <Typography className={classes.heading}>E-mail:</Typography>
                <Typography className={classes.secondaryHeading}>{user.email}</Typography>
            </div>
          <div className={classes.column}>
            <Typography className={classes.heading}>Role:</Typography>
            <Typography className={classes.secondaryHeading}>{user.role}</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
            <div className={classes.column}/>
            <div className={classes.column}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="component-simple">Username</InputLabel>
                    <Input name="building" defaultValue={user.username} onChange={(e) => onHubChange(user, e)} />
                </FormControl>
            </div>
            <div className={classes.column}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="component-simple">First name</InputLabel>
                    <Input name="building" defaultValue={user.firstname} onChange={(e) => onHubChange(user, e)} />
                </FormControl>
            </div>
            <div className={classes.column}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="component-simple">Last name</InputLabel>
                    <Input name="building" defaultValue={user.lastname} onChange={(e) => onHubChange(user, e)} />
                </FormControl>
            </div>
            <div className={classes.column}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="component-simple">E-mail</InputLabel>
                    <Input name="building" defaultValue={user.email} onChange={(e) => onHubChange(user, e)} />
                </FormControl>
            </div>
            <div className={classes.column}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="component-simple">Role</InputLabel>
                    <Input name="building" defaultValue={user.role} onChange={(e) => onHubChange(user, e)} />
                </FormControl>
            </div>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <Button classes={{root: classes.buttonRoot}} fullWidth size="small" color="primary" variant="outlined">Save</Button>
            </Grid>
            <Grid item xs={6}>
              <Button classes={{root: classes.buttonRoot}} fullWidth size="small" color="secondary" variant="outlined">Delete</Button>
            </Grid>
          </Grid>
        </ExpansionPanelActions>
      </ExpansionPanel>
    </div>
  ));
}

UsersTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UsersTable);