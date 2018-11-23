import React from 'react';
import PropTypes from "prop-types";
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

function LocationDropdown({ classes, placeholder, value, options, onChangeCB }) {
    return (
        <FormControl className={classes.select}>
            <InputLabel shrink htmlFor="placeholder">{placeholder}</InputLabel>
            <Select className={classes.select} value={value} onChange={(e) => onChangeCB(e)}>{options.map(option => {
                return (<MenuItem key={option.id} value={option.id}>
                    <em>{option.name}</em>
                </MenuItem>)
            })}</Select>
        </FormControl>
    )
}

export default withStyles(styles)(LocationDropdown);