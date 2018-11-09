import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
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

function UsersTable(props) {
  const { classes, users, onHubChange, onSavehub } = props;
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
            <Typography className={classes.heading}>Role:</Typography>
            <Typography className={classes.secondaryHeading}>{user.role}</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <div className={classes.column}/>
          <div className={classes.column}/>
          <div className={classes.column}/>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Button fullWidth size="small" color="primary">Save</Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    </div>
  ));
}

UsersTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UsersTable);