import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TreeSelect, {SHOW_PARENT} from 'rc-tree-select';
import 'rc-tree-select/assets/index.css';
import './LocationSelector.css';

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
      searchValue: '0-0-0-label',
      // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
      lv: {value: '0-0-0-value', label: 'spe label'},
      multipleValue: [],
      simpleSearchValue: 'test111',
      simpleTreeData: [
        {key: 1, pId: 0, label: 'test1', value: 'test1'},
        {key: 121, pId: 0, label: 'test2', value: 'test2'},
        {key: 11, pId: 1, label: 'test11', value: 'test11'},
        {key: 12, pId: 1, label: 'test12', value: 'test12'},
        {key: 111, pId: 11, label: 'test111', value: 'test111'},
      ],
      treeDataSimpleMode: {
        id: 'key',
        rootPId: 0,
      },
    }
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeChildren = this.onChangeChildren.bind(this);
    this.onMultipleChange = this.onMultipleChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onDropdownVisibleChange = this.onDropdownVisibleChange.bind(this);
  }

  onClick() {
    this.setState({
      visible: true,
    });
  }

  onChange(value, ...rest) {
    console.log('onChange', value, ...rest);
    this.setState({ value });
  }

  onChangeChildren(...args) {
    console.log('onChangeChildren', ...args);
    const value = args[0];
    const pre = value ? this.state.value : undefined;
    this.setState({ value: isLeaf(value) ? value : pre });
  }

  onMultipleChange(value) {
    console.log('onMultipleChange', arguments);
    this.setState({ multipleValue: value });
  }

  onSelect() {
    // use onChange instead
    console.log(arguments);
  }

  onDropdownVisibleChange(visible, info) {
    console.log(visible, this.state.value, info);
    return true;
  }

  render() {
    return (
      <TreeSelect
        transitionName="rc-tree-select-dropdown-slide-up"
        choiceTransitionName="rc-tree-select-selection__choice-zoom"
        dropdownStyle={{ height: 200, overflow: 'auto' }}
        dropdownPopupAlign={{ overflow: { adjustY: 0, adjustX: 0 }, offset: [0, 2] }}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
        placeholder={<i>Select Buildings and rooms here</i>}
        searchPlaceholder="please search"
        treeLine maxTagTextLength={10}
        value={this.state.value}
        autoClearSearchValue
        treeData={[
          {value: 0, title: '0', children: [
              {value: 1, title: '11'},
              {value: 12, title: '12'},
            ]},
          {value: 2, title: '2'}
        ]}
        treeNodeFilterProp="title"
        treeCheckable showCheckedStrategy={SHOW_PARENT}
        onChange={this.onChange}
        onSelect={this.onSelect}
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