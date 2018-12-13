import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import axios from "axios";
import Collapse from "@material-ui/core/Collapse/Collapse";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Grid from "@material-ui/core/Grid/Grid";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import IconButton from "@material-ui/core/IconButton/IconButton";
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';

const styles = () => ({
  treeSelect: {
    minWidth: 300,
  },
  iconButton: {
    '&:hover': {
      backgroundColor: 'white',
    },
  },
});

class RuleLocationSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buildings: [],
    };
  }

  componentDidMount() {
    this.getBuildings();
  }

  getBuildings = () => {
    axios.get("/api/v2/institution/getBuildings.php")
      .then(response => {
        this.setState(() => {
          return {
            loading: false,
            buildings: response.data,
          };
        });
      });
  };

  selectAllChildren(name, checked) {
    const { onChangeCB } = this.props;
    const { buildings } = this.state;
    const newState = {
      buildings: buildings.map(building => ({
        id: building.id,
        expanded: building.expanded,
        name: building.name,
        rooms: building.rooms.map(room => ({
          hubID: room.hubID,
          roomName: room.roomName,
          checked: building.name === name ? checked : room.checked,
        }))
      }))
    };
    this.setState(() => {
      return newState
    });
    onChangeCB(newState.buildings);
  }

  handleSelect = (name, value) => {
    const { onChangeCB } = this.props;
    const { buildings } = this.state;
    const newState = {
      buildings: buildings.map(building => ({
        id: building.id,
        expanded: building.expanded,
        name: building.name,
        rooms: building.rooms.map(room => ({
          hubID: room.hubID,
          roomName: room.roomName,
          checked: room.roomName === name ? value : room.checked,
        }))
      }))
    };
    this.setState(() => {
      return newState
    });
    onChangeCB(newState.buildings);
  };

  expandBuilding = (name) => {
    const { buildings } = this.state;
    this.setState(() => {
      return {
        buildings: buildings.map(building => ({
          id: building.id,
          expanded: building.name === name ? !building.expanded : building.expanded,
          name: building.name,
          rooms: building.rooms
        }))
      }
    });
  };

  render() {
    const { classes, ruleId } = this.props;
    const { buildings } = this.state;
    return (<Grid key={ruleId} container spacing={16}>
      {buildings.map(building => (
        <Grid key={building.id+ruleId} item xs={12}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  indeterminate={(building.rooms.filter(room => (room.checked)).length !== building.rooms.length) && building.rooms.filter(room => (room.checked)).length > 0}
                  disabled={building.rooms.length === 0}
                  color="primary"
                  checked={(building.rooms.filter(room => (room.checked)).length === building.rooms.length) && building.rooms.length > 0}
                  onChange={(e, checked) => {this.selectAllChildren(building.name, checked)}}
                />
              }
              label={building.name}
            />
            {building.rooms.length > 0 && <IconButton className={classes.iconButton} disableRipple aria-label="expand" onClick={(e) => {this.expandBuilding(building.name)}}>
              {building.expanded ? <ClearIcon /> : <AddIcon />}
            </IconButton>}
          </FormGroup>
          <Collapse in={building.expanded}>
            <Grid container spacing={16} justify={"space-evenly"}>
              {console.log(building)}
              {building.rooms.map(room => (
                <Grid key={ruleId + room.hubID + room.roomName + room.checked} item xs={11}>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e, checked) => {this.handleSelect(room.roomName, checked)}}
                          checked={room.checked}
                          color="primary"
                        />
                      }
                      label={room.roomName}
                    />
                  </FormGroup>
                </Grid>
              ))}
            </Grid>
          </Collapse>
        </Grid>
      ))}
    </Grid>)
  }
}

RuleLocationSelector.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RuleLocationSelector);