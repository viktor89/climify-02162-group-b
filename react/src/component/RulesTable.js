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
import LocationSelector from "./LocationSelector";
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
  columnCenterText: {
    flexBasis: '33.33%',
    textAlign: 'center',
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

function RulesTable({ classes, rules }) {
  console.log(rules);
  return (<Grid container spacing={16} justify="center" alignItems="center">
      <Grid item xs={12} md={6}>
    {rules.map((rule) => (
    <div key={rule.id} className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <div className={classes.column}>
            <Typography className={classes.heading}>Rule ID:</Typography>
            <Typography className={classes.secondaryHeading}>{rule.id}</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.heading}>Rule Type:</Typography>
            <Typography className={classes.secondaryHeading}>{rule.type}</Typography>
          </div>
          <div className={classes.columnCenterText}>
            <Typography className={classes.heading}>Rule:</Typography>
            <Typography className={classes.secondaryHeading}>{rule.lowerThreshold} {'<'} {rule.unit} {'>'} {rule.upperThreshold}</Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <div className={classes.column}/>
          <div className={classes.column}/>
          <div className={classes.column}/>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Button classes={{root: classes.buttonRoot}} fullWidth size="small" color="primary" variant="outlined">Save</Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    </div>))}
      </Grid>
    <Grid item xs={12} md={6}>
      <LocationSelector />
    </Grid>
  </Grid>
  );
}

export default withStyles(styles)(RulesTable);