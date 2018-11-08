import React, { Component } from "react";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import GetSensorInstance from "../component/GetSensorInstance";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    height: 140,
    width: 100
  },
  control: {
    padding: theme.spacing.unit * 2
  }
});

class ManageDevice extends Component {
  constructor(props) {
    super(props);
    this.state = { getSensor: [] };
  }
  componentWillMount() {
    axios
      .get("/api/v2/sensor/getSensors.php")
      .then(response => {
        this.setState(() => {
          return { getSensor: response.data };
        });
      })
      .catch(error => {
          this.setState(() => {
              return { getSensor: [[]] };
          });
      });
  }
  render() {
    const { classes } = this.props;
    const { getSensor } = this.state;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
            <Grid container spacing={16}>
                <Grid item xs={6}>
                    <h2>Manage Devices</h2>
                </Grid>
                <Grid item xs={3}>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel
                            htmlFor="institution-id"
                        >
                            Building
                        </InputLabel>
                        <Select
                            value={1}
                            input={
                                <OutlinedInput
                                    labelWidth={85}
                                    name="selectedInstitution"
                                    id="institution-id"
                                />
                            }
                        >
                                return <MenuItem key={1} value={1}>303A</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={3}>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel
                            htmlFor="institution-id"
                        >
                            Room
                        </InputLabel>
                        <Select
                            value={45}
                            input={
                                <OutlinedInput
                                    labelWidth={65}
                                    name="selectedInstitution"
                                    id="institution-id"
                                />
                            }
                        >
                            <MenuItem key={45} value={45}>45</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <GetSensorInstance hubs={getSensor} />
                </Grid>
            </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(ManageDevice);
