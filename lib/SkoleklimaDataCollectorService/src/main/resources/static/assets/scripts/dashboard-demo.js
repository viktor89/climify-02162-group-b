$(function() {
    //  morris Area chart on dashboard///
    Morris.Area({
        element: 'morris-area-chart',
        data: [{
            period: '2017 Q1',
            RaspberryPI: 2666,
            Thermostat: null,
            Sensors: 2647
        }, {
            period: '2018 Q2',
            RaspberryPI: 2778,
            Thermostat: 2294,
            Sensors: 2441
        }, {
            period: '2017 Q3',
            RaspberryPI: 4912,
            Thermostat: 1969,
            Sensors: 2501
        }, {
            period: '2016 Q4',
            RaspberryPI: 3767,
            Thermostat: 3597,
            Sensors: 5689
        }, {
            period: '2015 Q1',
            RaspberryPI: 6810,
            Thermostat: 1914,
            Sensors: 2293
        }, {
            period: '2018 Q2',
            RaspberryPI: 5670,
            Thermostat: 4293,
            Sensors: 1881
  
        }],
        xkey: 'period',
        ykeys: ['RaspberryPI', 'Thermostat', 'Sensors'],
        labels: ['RaspberryPI', 'Thermostat', 'Sensors'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });
    //  morris donut chart on dashboard///
    Morris.Donut({
        element: 'morris-donut-chart',
        data: [{
            label: "Download Sales",
            value: 12
        }, {
            label: "In-Store Sales",
            value: 30
        }, {
            label: "Mail-Order Sales",
            value: 20
        }],
        resize: true
    });

    Morris.Bar({
        element: 'morris-bar-chart',
        data: [{
            y: '2015',
            a: 100,
            b: 90
        },  {
            y: '2016',
            a: 50,
            b: 40
        }, {
            y: '2017',
            a: 75,
            b: 65
        }, {
            y: '2018',
            a: 100,
            b: 90
        }],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Series A', 'Series B'],
        hideHover: 'auto',
        resize: true
    });

});
