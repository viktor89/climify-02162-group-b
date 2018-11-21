import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import './LocationSelector.css';
import axios from "axios";
import Collapse from "@material-ui/core/Collapse/Collapse";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Grid from "@material-ui/core/Grid/Grid";

const styles = () => ({
  treeSelect: {
    minWidth: 300,
  }
});

class RuleLocationSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buildings: [],
    };
  }

  componentWillMount() {
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
    if (!checked) return;
    const { buildings } = this.state;
    this.setState(() => {
      return {
        buildings: buildings.map(building => ({
          id: building.id,
          name: building.name,
          hubId: building.hubId,
          rooms: building.rooms.map(room => ({
            hubID: room.hubID,
            roomName: room.roomName,
            checked: building.name === name ? checked : room.checked,
          }))
        }))
      }
    });
  }

  handleSelect = (name, value) => {
    const { buildings } = this.state;
    this.setState(() => {
      return {
        buildings: buildings.map(building => ({
          id: building.id,
          name: building.name,
          hubId: building.hubId,
          rooms: building.rooms.map(room => ({
            hubID: room.hubID,
            roomName: room.roomName,
            checked: room.roomName === name ? value : room.checked,
          }))
        }))
      }
    });
  };

  render() {
    const { buildings } = this.state;

    return (<Grid container spacing={16}>
      {buildings.map(building => (
        <Grid key={building.name} item xs={12}>
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
          <Collapse in={true}>
            <Grid container spacing={16} justify={"space-evenly"}>
              {building.rooms.map(room => (
                <Grid key={room.roomName} item xs={11}>
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