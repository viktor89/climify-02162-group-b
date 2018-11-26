import React, {Component} from 'react';
import CreatableSelect from "react-select/lib/Creatable";

class CreateSelect extends Component {
    constructor(props){
        super(props);
        this.state = {
            value: '',
            inputValue: '',
        }
    }
    handleChange = (selectedOption) => {
      const {onChange, name} = this.props;
      this.setState({selectedOption });
      onChange(name, selectedOption ? selectedOption.value : '');
    };

    handleCreate = (inputValue) => {
        const {onCreate, onChange, name} = this.props;
        onCreate(inputValue);
        onChange(name, inputValue);
        this.setState({selectedOption: {label: inputValue, value: inputValue}});
    };

    handleInputChange = (inputValue) => {
      this.setState({ inputValue });
    };

    render() {
        const {selectedOption, inputValue} = this.state;
        const {options, placeholder, disabled} = this.props;
        return (
            <CreatableSelect isClearable
                             isDisabled={disabled}
                             placeholder={!disabled ? placeholder : 'Select building first...'}
                             options={options}
                             value={selectedOption}
                             inputValue={inputValue}
                             onChange={this.handleChange}
                             onInputChange={this.handleInputChange}
                             onCreateOption={this.handleCreate}
            />
        )
    }
}

export default (CreateSelect);