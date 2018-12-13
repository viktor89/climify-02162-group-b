import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid/Grid";
import RuleLocationSelector from "./RuleLocationSelector";
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import Chip from "@material-ui/core/Chip/Chip";
import TextField from '@material-ui/core/TextField';

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
  chip: {
    margin: theme.spacing.unit,
  },
});

class RulesTable extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedRule: null,
    }
  }

  handleRuleSelect = (ruleId) => {
    const { selectedRule } = this.state;
    this.setState({
      selectedRule: selectedRule === ruleId ? '' : ruleId,
    })
  } ;

  handleRuleRoomChange = (buildings) => {
    const { selectedRule } = this.state;
    const { roomRuleChangeCB } = this.props;
    roomRuleChangeCB(selectedRule, buildings.flatMap(building => (building.rooms)).filter(room => (room.checked)));
  };

  handleDeleteRule = (ruleId) => {
    const { deleteRuleCB } = this.props;
    this.setState({
      selectedRule: null
    }, deleteRuleCB(ruleId));
  };

  render() {
    const { classes, rules, buildings, onRuleChange, onExpandBuilding, saveRuleCB } = this.props;
    const { selectedRule } = this.state;
    return (<Grid container spacing={16} alignItems={selectedRule ? "flex-start" : "center"}>
        <Grid item xs={12} md={6}>
          {rules.map((rule) => (
            <Grid key={rule.id} className={classes.root}>
              <ExpansionPanel expanded={selectedRule === rule.id}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} onClick={(e) => {this.handleRuleSelect(rule.id)}}>
                  <div className={classes.column}>
                    <Typography className={classes.heading}>Rule ID:</Typography>
                    <Typography className={classes.secondaryHeading}>{rule.id}</Typography>
                  </div>
                  <div className={classes.column}>
                    <Typography className={classes.heading}>Rule Type:</Typography>
                    <Typography className={classes.secondaryHeading}>{rule.type.name}</Typography>
                  </div>
                  <div className={classes.columnCenterText}>
                    <Typography className={classes.heading}>Rule:</Typography>
                    <Typography
                      className={classes.secondaryHeading}>{rule.lowerThreshold} {'<'} {rule.unit} {'<'} {rule.upperThreshold}</Typography>
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details}>
                  <Grid container space={16}>
                    <Grid item xs={6}>
                    {rule.rooms.map(room => (
                      <Chip key={room.hubID + room.roomName} variant={"outlined"} color={"primary"} label={room.roomName} className={classes.chip} icon={<MeetingRoomIcon />} />
                    ))}
                    </Grid>
                    <Grid item xs={2} />
                    <Grid item xs={2}>
                      <TextField value={rule.lowerThreshold} label="Lower Threshold" name="lowerThreshold" onChange={(e) => onRuleChange(rule.id, e)} />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField value={rule.upperThreshold} label="Upper Threshold" name="upperThreshold" onChange={(e) => onRuleChange(rule.id, e)} />
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
                <ExpansionPanelActions>
                  <Grid container spacing={16}>
                    <Grid item xs={6}>
                      <Button
                        classes={{root: classes.buttonRoot}}
                        fullWidth
                        size="small"
                        color="primary"
                        variant="outlined"
                        onClick={() => saveRuleCB(rule)}
                      >
                        Save
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button onClick={(e) => {this.handleDeleteRule(rule.id)}} classes={{root: classes.buttonRoot}} fullWidth size="small" color="secondary"
                            variant="outlined">Delete</Button>
                    </Grid>
                  </Grid>
                </ExpansionPanelActions>
              </ExpansionPanel>
            </Grid>))}
        </Grid>
        <Grid item xs={12} md={6}>
          {selectedRule
          && <RuleLocationSelector
            key={selectedRule}
            ruleId={selectedRule}
            onChangeCB={this.handleRuleRoomChange}
            onExpandBuildingCB={onExpandBuilding}
            buildings={
              buildings.map(building => (
                {
                  ...building,
                  rooms: building.rooms.map(
                    room => (
                      {...room,
                        checked: rules.filter(rule => (rule.id === selectedRule)).shift().rooms.findIndex(ruleRoom => ruleRoom .hubID === room.hubID && ruleRoom.name === room.name) >= 0
                      }
                    )
                  )
                }
              ))
            }
          />}
          {!selectedRule && <em>Select a rule</em>}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(RulesTable);