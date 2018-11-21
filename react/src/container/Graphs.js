import React, { Component } from "react";
import Grid from "@material-ui/core/Grid/Grid";
import { withStyles } from "@material-ui/core/styles";
import {Line} from "react-chartjs-2";

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

const data = {
  labels: Array.apply(null, {length: 25}).map(Number.call, Number).map((item) => (item<10 ? `0${item}:00` : `${item}:00`)),
  datasets: [
    {
      label: 'Room 45',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [20, 19.4, 21, 20.2, 19.9, 20.5, 19.8, 20, 19.4, 21, 20.2, 19.9, 20.5, 19.8, 20.1, 20.2, 20.1, 20.2, 20.3, 20.2, 20.2, 20, 19.9, 20.1, 20]
    }
  ]
};

class Graphs extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  componentDidMount() {
    $('.view-data').on('displayChanged', (e, state) => {
      if(state === 'show'){
        console.log(state);
      }
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container className={classes.root} spacing={16}>
        <Grid item xs={12}>
          <h2>Graphs</h2>
          <Grid container spacing={16}>
            <Grid item xs={12} md={6}>
              <Line data={data} options={{
              scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Time'
                  }}],
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Temperature'
                  }}]
              }
            }}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <Line data={data} options={{
                scales: {
                  yAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Time'
                    }}],
                  xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Temperature'
                    }}]
                }
              }}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(Graphs);
