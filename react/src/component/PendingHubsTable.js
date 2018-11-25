import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import CreatableSelect from 'react-select/lib/Creatable';
import Grid from "@material-ui/core/Grid/Grid";

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
    padding: `${theme.spacing.unit}px ${theme.spacing.unit}px`,
  },

  spacing: {
      padding: `${theme.spacing.unit}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

function DetailedExpansionPanel({ classes, hubs, buildings, onHubChange, onSavehub, rooms, handleCreate, handleChange, onUnregisterHub}) {
  return hubs.map((hub) => (
    <div key={hub.mac} className={classes.root} >
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div className={classes.column}>
            <Typography className={classes.heading}>MAC Addres:</Typography>
            <Typography className={classes.heading}>{hub.mac}</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>IP Address:</Typography>
            <Typography className={classes.secondaryHeading}>{hub.ip}</Typography>
          </div>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails className={classes.details}>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <Typography className={classes.secondaryHeading}>Building</Typography>
              <CreatableSelect isClearable
                               placeholder='Building'
                               options={buildings}
                               onChange={handleChange}
                               onCreateOption={handleCreate}/>
            </Grid>
            <Grid item xs={6}>
              <Typography className={ classes.secondaryHeading}>Room</Typography>
              <CreatableSelect placeholder='Room' options={rooms} />
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth size="small" variant="outlined" color="primary" onClick={() => onSavehub(hub.mac)}>Register</Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth size="small" variant="outlined" color="secondary"  onClick={() => onUnregisterHub(hub.mac)}>Remove</Button>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  ));
}

DetailedExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DetailedExpansionPanel);