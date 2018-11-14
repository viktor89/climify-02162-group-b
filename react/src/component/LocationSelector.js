import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TreeSelect, {SHOW_ALL, SHOW_PARENT} from 'rc-tree-select';
import 'rc-tree-select/assets/index.css';
import './LocationSelector.css';
import axios from "axios";

const styles = theme => ({
  treeSelect: {
    minWidth: 300,
  }
});

class LocationSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tsOpen: false,
      visible: false,
      multipleValue: [],
      buildings: []
    }
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getBuildings = this.getBuildings.bind(this);
  }

  componentWillMount(){
    this.getBuildings();
  }

  getBuildings() {
    axios
      .get("/api/v2/institution/getBuildings.php")
      .then(response => {
        this.setState(() => {
          return { buildings: response.data.filter((building => (building.rooms.length > 0))).map((building => ({
              value: building.name,
              title: building.name,
              children: building.rooms.map((room) => ({
                value: room.hubID,
                title: room.roomName,
              }))
            }))) };
        });
      })
  }

  onClick() {
    this.setState({
      visible: true,
    });
  }

  onChange(value, label, extra) {
    const { onchangeCB } = this.props;
    onchangeCB(value);
    this.setState({ value });
  }

  render() {
    const { buildings } = this.state;
    const { onchangeCB } = this.props;
    return (
      <TreeSelect
        transitionName="rc-tree-select-dropdown-slide-up"
        choiceTransitionName="rc-tree-select-selection__choice-zoom"
        dropdownPopupAlign={{ overflow: { adjustY: 0, adjustX: 0 }, offset: [0, 2] }}
        placeholder={<i>Select Buildings and rooms here</i>}
        searchPlaceholder="please search"
        treeLine maxTagTextLength={10}
        value={this.state.value}
        autoClearSearchValue
        treeData={ buildings }
        treeNodeFilterProp="title"
        treeCheckable showCheckedStrategy={SHOW_PARENT}
        onChange={this.onChange}
        maxTagCount={20}
        maxTagPlaceholder={(valueList) => {
          console.log('Max Tag Rest Value:', valueList);
          return `${valueList.length} rest...`
        }}
      />
    );
  }
}

LocationSelector.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LocationSelector);