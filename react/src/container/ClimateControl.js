import React, { Component } from "react";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import RulesTable from "../component/RulesTable";
import CachedIcon from '@material-ui/icons/Cached';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Modal from "@material-ui/core/Modal/Modal";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import AddIcon from '@material-ui/icons/Add';
import TextField from "@material-ui/core/TextField/TextField";
import RuleTypeDropdown from "../component/RuleTypeDropdown";

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
  refreshIcon: {
    position: 'absolute',
    right: '1em',
  },
  ruleFormType: {
    lineHeight: '5em',
  },
});

class Graphs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rules: [],
      ruleTypes: [],
      buildings: [],
      loading: true,
      addRuleModalOpen: false,
      newRule: {
        type: 0,
        lowerThreshold: '',
        upperThreshold: '',
      },
    }
  }

  componentDidMount() {
    $('.view-climate-control').on('displayChanged', (e, state) => {
      if(state === 'show'){
        this.getRules();
      }
    });
    this.getRules();
  }

  getRules = () => {
    let promises = [];
    promises.push(axios.get("/api/v2/rule/read.php"));
    promises.push(axios.get("/api/v2/rule/type/read.php"));
    promises.push(axios.get("/api/v2/institution/getBuildings.php"));
    Promise.all(promises).then((response) => {
      this.setState(() => {
        return {
          rules: response[0].data,
          ruleTypes: response[1].data,
          buildings: response[2].data,
          loading: false,
        }
      });
    })
  };

  addRuleOpen = () => {
    this.setState({ addRuleModalOpen: true });
  };

  addRuleClose = () => {
    this.setState({ addRuleModalOpen: false });
  };

  typeSelect = (ruleType) => {
    const { newRule } = this.state;
    this.setState({
      newRule: {
        type: ruleType,
        upperThreshold: newRule.upperThreshold,
        lowerThreshold: newRule.lowerThreshold,
      }
    });
  };

  handleRuleChange = (ruleId, e) => {
    const { rules } = this.state;
    this.setState({
      rules: rules.map(rule => (ruleId === rule.id ? {...rule, [e.target.name]: e.target.value} : rule))
    });
  };

  handleRoomRuleChange = (ruleId, rooms) => {
    const { rules } = this.state;
    this.setState({
      rules: rules.map(rule => (ruleId === rule.id ? {...rule, rooms: rooms} : rule))
    });
  };

  handleAddRuleChange = (e) => {
    const { newRule } = this.state;
    let newState = {};
    Object.assign(newState, newRule);
    newState[e.target.name] = e.target.value;
    this.setState({
      newRule: newState
    });
  };

  addRule = () => {
    const { newRule } = this.state;
    axios.post('/api/v2/rule/create.php', newRule).then(() => {
      this.getRules();
      this.addRuleClose();
      this.setState({
        newRule: {
          type: 0,
          lowerThreshold: '',
          upperThreshold: '',
        },
      });
    });
  };

  saveRule = (rule) => {
    axios.post('/api/v2/rule/update.php', {
      ...rule,
      rooms: rule.rooms.map(room => ({hubID: room.hubID})),
      type: rule.type.id
    }).then(() => {
      this.getRules();
    })
  };

  deleteRule = (id) => {
    axios.post('/api/v2/rule/delete.php', {id}).then(() => {
      this.getRules();
    })
  };

  handleBuildingChange = (buildings) => {
    this.setState({
      buildings
    })
  };

  render() {
    const { rules, ruleTypes, newRule, buildings } = this.state;
    const { classes } = this.props;
    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={11}>
          <h2>Climate Control</h2>
          <h3>Manage Rules</h3>
        </Grid>
        <IconButton className={classes.refreshIcon} aria-label="refresh" onClick={() => {this.getRules()}}>
          <CachedIcon />
        </IconButton>
        <Grid item xs={12}>
            {rules && <RulesTable onExpandBuilding={this.handleBuildingChange} rules={rules} ruleTypes={ruleTypes} buildings={buildings} saveRuleCB={this.saveRule} deleteRuleCB={this.deleteRule} onRuleChange={this.handleRuleChange} roomRuleChangeCB={this.handleRoomRuleChange} />}
        </Grid>
        <Button className={classes.addRuleButton} variant="fab" color={"primary"} onClick={this.addRuleOpen}><AddIcon /></Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.addRuleModalOpen}
          onClose={this.addRuleClose}
        >
          <div className={classes.modal}>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <Typography variant="h6" id="modal-title">
                  Add new rule
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <RuleTypeDropdown value={newRule.type} options={ruleTypes} placeholder={"Type"} onChangeCB={this.typeSelect} />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  disabled={newRule.type === 0}
                  label="From"
                  name="lowerThreshold"
                  helperText={newRule.type === 0 && 'select a type first'}
                  value={newRule.lowerThreshold}
                  onChange={(e) => {this.handleAddRuleChange(e)}}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant={"body2"} align={"center"} className={classes.ruleFormType}>
                  {newRule.type > 0 && ruleTypes.length > 0 ? ruleTypes.filter(rule => (rule.id === newRule.type)).shift().unit : ''}
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  disabled={newRule.type === 0}
                  label="To"
                  helperText={newRule.type === 0 && 'select a type first'}
                  name="upperThreshold"
                  value={newRule.upperThreshold}
                  onChange={(e) => {this.handleAddRuleChange(e)}}
                />
              </Grid>
              <Grid item xs={12}>
                <Button color={"primary"} variant={"outlined"} fullWidth onClick={(e) => this.addRule()}>Save</Button>
              </Grid>
            </Grid>
          </div>
        </Modal>
      </Grid>
    );
  }
}
export default withStyles(styles)(Graphs);
