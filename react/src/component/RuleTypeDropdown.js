import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

const styles = () => ({
    select: {
        width: '100%',
    },
})

function LocationDropdown({ classes, placeholder, options, value, onChangeCB }) {
    return (
        <FormControl className={classes.select}>
            <InputLabel shrink htmlFor="placeholder">{placeholder}</InputLabel>
            <Select value={value} className={classes.select} onChange={(e) => onChangeCB(e.target.value)}>
              {options.map(option => {
                return (<MenuItem key={option.id} value={option.id}>
                    <em>{option.type}</em>
                </MenuItem>)
              })}
            </Select>
        </FormControl>
    )
}

export default withStyles(styles)(LocationDropdown);