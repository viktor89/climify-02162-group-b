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
        console.log(selectedOption);
        this.setState({selectedOption });
        console.log(`Option selected:`, selectedOption);

    };

    handleCreate = (inputValue) => {
        const {onCreate} = this.props;
        onCreate(inputValue);
    };

    handleInputChange = (inputValue, actionMeta) => {
        console.log(inputValue, actionMeta);
        this.setState({ inputValue });
    };

    render() {
        const {selectedOption, inputValue} = this.state;
        const {options, placeholder} = this.props;
        return (
            <CreatableSelect isClearable
                             placeholder={placeholder}
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