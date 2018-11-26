import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid/Grid";
import CreateSelect from '../component/CreateSelect';

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

function PendingsHubsTable({ classes, hubs, buildings, onHubChange, onSavehub, rooms, onCreateBuilding, onCreateRoom, onUnregisterHub}) {
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
              {buildings && <CreateSelect
                  name="building"
                  onChange={(name, value) => onHubChange(hub.mac, name, value)}
                  onCreate={onCreateBuilding}
                  options={buildings.map(building => ({label: building.name, value: building.name}))}
                  placeholder='Building'
              />}
            </Grid>
            <Grid item xs={6}>
              <CreateSelect
                key={hub.building}
                disabled={hub.building === undefined || hub.building === ''}
                name="room"
                options={
                  buildings
                    .filter(building => (building.name === hub.building)).length > 0
                    ? buildings.filter(building => (building.name === hub.building)).shift().rooms.map(room => ({label: room.roomName, value: room.roomName}))
                    : null}
                onChange={(name, value) => onHubChange(hub.mac, name, value)}
                onCreate={() => {}}
                placeholder='Room'
              />
            </Grid>
            <Grid item xs={6}>
              <Button disabled={!hub.building || !hub.room} fullWidth size="small" variant="outlined" color="primary" onClick={() => onSavehub(hub.mac)}>Register</Button>
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

PendingsHubsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PendingsHubsTable);