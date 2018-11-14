import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import FormControl from "@material-ui/core/FormControl/FormControl";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import Divider from "@material-ui/core/Divider/Divider";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Switch from "@material-ui/core/Switch/Switch";
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

const handleHubChanged = (hub, event) => {
  console.log('local change');
  console.log(hub, { [event.target.name]: event.target.value });
};

function DetailedExpansionPanel(props) {
  const { classes, hubs, onHubChange, onSavehub, onUnregisterHub } = props;
  return hubs.map((hub) => (
    <div key={hub.mac} className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div className={classes.column}>
            <Typography className={classes.heading}>MAC Addres:</Typography>
            <Typography className={classes.heading}>{hub.mac}</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>Building:</Typography>
            <Typography className={classes.secondaryHeading}>{hub.building}</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>Room:</Typography>
            <Typography className={classes.secondaryHeading}>{hub.room}</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <div className={classes.column}>
            <InputLabel htmlFor="receiveMode">Receive Mode</InputLabel>
            <Switch
              name="receiveMode"
              onChange={(e, val) => onHubChange(hub, e, val)}
            />
          </div>
          <div className={classes.column}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="component-simple">Building</InputLabel>
              <Input name="building" defaultValue={hub.building} onChange={(e) => onHubChange(hub, e)} />
            </FormControl>
          </div>
          <div className={classes.column}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="component-simple">Room</InputLabel>
              <Input name="room" defaultValue={hub.room} onChange={(e) => onHubChange(hub, e)} />
            </FormControl>
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Grid container spacing={16}>
            <Grid item xs={6}>
              <Button fullWidth size="small" color="primary" variant="outlined" onClick={() => onSavehub(hub.mac)}>Save</Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth size="small" color="secondary" variant="outlined" onClick={() => onUnregisterHub(hub.mac)}>Remove</Button>
            </Grid>
          </Grid>
        </ExpansionPanelActions>
      </ExpansionPanel>
    </div>
  ));
}

DetailedExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DetailedExpansionPanel);