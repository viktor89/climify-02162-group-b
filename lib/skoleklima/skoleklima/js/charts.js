/**********************************/
//		JS specific for Charts
/**********************************/


$(document).ready(function() {


    $("#retrunNoSchoolData").html("Choose the following to get data:<br/>" + "<br/><br/>" + "1) institution" + "<br/><br/>" + "2) floorplan" + "<br/><br/>" + "3) location");

    $("#retrunNoSchoolGraph2").html("Choose the following to compare locations on a floorplan:<br/>" + "<br/><br/>");
    $("#retrunNoSchoolGraph2Part2").html("1) institution" + "<br/><br/>" + "2) floorplan");
    $("#retrunNoSchoolGraph2").show();
    $("#retrunNoSchoolGraph2").attr('attr', 'visibility:visible');

    compareData = {
        dataDates: [],
        dataTemperature: [],
        dataHumidity: [],
        dataCO2: [],
        dataNoiseAvg: [],
        dataLabel: [],
        dataColor: []
    };
    dateRangePicker2();
    dateRangePicker1();





})


$("#btn-get-compare-data").click(function(){
    startCompareCharset()});



$('#check-chart-data-temperature').prop('checked', true);
$('#check-chart-data-temperature').change(function() {
    if ( enableDataSettings == true ) {
        if ($(this).is(":checked") ) {
            numberOfChecked++;
            graph.dataSetHidden.temperature = false;
            howToDraw();
        } else {
            numberOfChecked--;
            graph.dataSetHidden.temperature = true;
            howToDraw();
        }
    }
});


$('#check-chart-data-noiseAvg').change(function() {
    if ( enableDataSettings == true ) {
        if ($(this).is(":checked")) {
            numberOfChecked++;
            graph.dataSetHidden.noiseAvg = false;
            howToDraw();
        } else {
            numberOfChecked--;
            graph.dataSetHidden.noiseAvg = true;
            howToDraw();
        }
    }
});

$('#check-chart-data-noisePeak').change(function() {
    if ( enableDataSettings == true ) {
        if ($(this).is(":checked")) {
            numberOfChecked++;
            graph.dataSetHidden.noisePeak = false;
            howToDraw();
        } else {
            numberOfChecked--;
            graph.dataSetHidden.noisePeak = true;
            howToDraw();
        }
    }
});

$(document).on("change", "#check-chart-data-xData", function(){
    if (enableDataSettings == true) {
        if ($(this).is(":checked")) {			
            numberOfChecked++;
            graph.dataSetHidden.xData = false;
            howToDraw();	
        } else {			
            numberOfChecked--;
            graph.dataSetHidden.xData = true;
            howToDraw();
        }
    }
});



$('#check-chart-data-humidity').change(function() {
    if ( enableDataSettings == true ) {
        if ($(this).is(":checked")) {
            numberOfChecked++;
            graph.dataSetHidden.humidity = false;
            howToDraw();
        } else {
            numberOfChecked--;
            graph.dataSetHidden.humidity = true;    
            howToDraw();
        }
    }	
});

$('#check-chart-data-co2').change(function() {
    if ( enableDataSettings == true ) {
        if ($(this).is(":checked")) {
            numberOfChecked++;
            graph.dataSetHidden.co2 = false;
            howToDraw();
        } else {
            numberOfChecked--;
            graph.dataSetHidden.co2 = true;
            howToDraw();
        }
    }
});


function howToDraw(){

    if(numberOfChecked==1){
        drawGraphSingle();
    }
    else if(numberOfChecked==2){
        drawGraphDouble();   
    }

}


var graph = {
    icMeterQR:false,
    startDate:false,
    startTime: 00+hourDiff+":00:00",
    endDate:false,
    endTime: 23+hourDiff+":55:00",
    chartType: "line",
    chartFill: false,
    autoUpdate: false,
    animationDuration: 500,
    dataSetHidden: {
        temperature: false,
        humidity: true,
        co2: true,
        noiseAvg: true,
        noisePeak: true,
        xData: true
    },
    dataSetColer1: {
        temperature: "rgba(153, 176, 239, 1)",
        humidity: "rgba(75,192,192, 1)",
        co2: "rgba(19, 198, 40, 1)",
        noiseAvg: "rgba(255, 168, 30, 1)",
        noisePeak: "rgba(242, 22, 2, 1)",
        xData: "rgba(39, 135, 199, 1)"
    },
    dataSetColer2: {
        temperature: "rgba(153, 176, 239, 0.4)",
        humidity: "rgba(75,192,192, 0.4)",
        co2: "rgba(19, 198, 40, 0.4)",
        noiseAvg: "rgba(255, 168, 30, 0.4)",
        noisePeak: "rgba(242, 22, 2, 0.4)",
        xData: "rgba(39, 135, 199, 0.4)"
    }
};

var graphDrawn = false;
var numberOfChecked = 1;
var dataDates = [];
var dataTemperature = [];
var dataHumidity = [];
var dataCO2 = [];
var dataNoiseAvg = [];
var dataNoisePeak = [];
var dataXData = [];
var enableDataSettings = true;
var liveTryUpdateData = 0;
var chart1TryUpdateData = 0;
var xDataExist = false;
var xDataTypeSettings;

var graphCompare = {
    selecteDevices: [],
    begin: false,
    startDate:false,
    startTime: 00+hourDiff+":00:00", 
    endDate:false,
    endTime: 23+hourDiff+":55:00", 
    chartType: "line",
    chartFill: false,
    animationDuration: 500,
    maxSelections: 10
};

var disableCompareBtn = false;
var autoUpdateMapGraphLine;
var currentIcMeterNameAlias;

function clearChartData() {
    dataDates = [];
    dataTemperature = [];
    dataHumidity = [];
    dataCO2 = [];
    dataNoiseAvg = [];
    dataNoisePeak = [];
    dataXData = [];
}

function clearCompareChartData() { 
    graphCompare.selecteDevices = []
}

setInterval(function(){
    if ( showSchool !== "" ) {
        graph.animationDuration = 0;
        graph.autoUpdate = true;
        getGraphData();
    }
}, 300000) // Update every five minutes

$(".maxSelectedDevices").append(graphCompare.maxSelections);

// Set moment.js language
moment.locale("da");

function startCharset() {
    graph.icMeterQR = $(".chart-select-device").val();
    if ( showSchool == "") {
        $("#btn-toggle-chart-map").addClass("button-disabled");
    } else {
        $("#btn-toggle-chart-map").removeClass("button-disabled");
        getGraphData();
    }
}

showWarningNoSchool ();
function showWarningNoSchool () {
    if ( showSchool == "" ) {
        $("#retrunNoSchoolData").show();
    } else {
        $("#retrunNoSchoolData").hide();
    }
}

showWarningNoSchoolGraph2 ();
function showWarningNoSchoolGraph2 () {
    if ( showSchool == "" ) {
        $("#retrunNoSchoolGraph2").show();
    } else {
        $("#retrunNoSchoolGraph2").hide();
        $("#retrunNoSchoolGraph2Part2").hide();

    }
}



function clearGraphMetaInfo() {
    $(".view-data-control .currentDeciveText h4").text("");
    $(".view-data-control .current-device-live ").text("");
}

// Daterangepicker
function dateRangePicker1() {


    var start = moment().subtract(1, 'days');
    var end = moment();

    function cb(start, end) {


        $('#reportrange1 span').html(start.format('D. MMMM YYYY') + ' - ' + end.format('D. MMMM YYYY'));


        startDateReplacement = start.format('YYYY-MM-DD');
        endDateReplacement = end.format('YYYY-MM-DD');



        if ( fetchingDataGraph == false ) {
            fetchingDataGraph = true;
            disableGraphSettingsSelections(); 
        }
    }

    $('#reportrange1').daterangepicker({
        locale: {
            "format": "DD-MM-YY",
            "monthNames": [
                "Januar",
                "Februar",
                "Marts",
                "April",
                "Maj",
                "Juni",
                "Juli",
                "August",
                "September",
                "Oktober",
                "November",
                "December"
            ],
            "firstDay": 1
        },
        startDate: start,
        endDate: end,
        minDate: moment().subtract(29, 'days'),
        maxDate: moment(),
        period: "month",
        ranges: {
            'I dag': [moment(), moment()],
            'I går': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Sidste 7 dage': [moment().subtract(6, 'days'), moment()],
            'Sidste 30 dage': [moment().subtract(29, 'days'), moment()],
            'Denne måned': [moment().startOf('month'), moment().endOf('month')],
        },

    }, cb);

    cb(start, end);
}

function dateRangePicker2() {


    var start = moment().subtract(1, 'days');
    var end = moment();

    function cb(start, end) {
        $('#reportrange2 span').html(start.format('D. MMMM YYYY') + ' - ' + end.format('D. MMMM YYYY'));


        startDateReplacement = start.format('YYYY-MM-DD');
        endDateReplacement = end.format('YYYY-MM-DD');


    }

    $('#reportrange2').daterangepicker({
        locale: {
            "format": "DD-MM-YY",
            "monthNames": [
                "Januar",
                "Februar",
                "Marts",
                "April",
                "Maj",
                "Juni",
                "Juli",
                "August",
                "September",
                "Oktober",
                "November",
                "December"
            ],
            "firstDay": 1
        },
        startDate: start,
        endDate: end,
        minDate: moment().subtract(29, 'days'),
        maxDate: moment(),
        ranges: {
            'I dag': [moment(), moment()],
            'I går': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Sidste 7 dage': [moment().subtract(6, 'days'), moment()],
            'Sidste 30 dage': [moment().subtract(29, 'days'), moment()],
            'Denne måned': [moment().startOf('month'), moment().endOf('month')],
        }
    }, cb);

    cb(start, end);
}

function GTMtimeRound(time){
    var coeff = 1000 * 60 * 5;
    var GTMtime = new Date(time);
    var GTMtime = new Date(Math.round(GTMtime.getTime() / coeff) * coeff)

    var month;
    switch (GTMtime.getMonth()) {
        case 0:
            month = "Januar";
            break;
        case 1:
            month = "Februar";
            break;
        case 2:
            month = "Marts";
            break;
        case 3:
            month = "April";
            break;
        case 4:
            month = "Maj";
            break;
        case 5:
            month = "Juni";
            break;
        case 6:
            month = "Juli";
            break;
        case 7:
            month = "August";
            break;
        case 8:
            month = "September";
            break;
        case 9:
            month = "Oktober";
            break;
        case 10:
            month = "November";
            break;        
        case 11:
            month = "December";
    }

    var realtime = GTMtime.getDate()+". "+month+" "+GTMtime.toTimeString().split(' ')[0].slice(0, -3);
    return realtime;
}

function getGraphData(){


    //hide user "directions/manual"
    $("#retrunNoSchoolData").hide();


    $("#retrunNoSchoolGraph2").hide();
    $("#retrunNoSchoolGraph2Part2").hide();




    LocationID = $(".chart-select-location").find('option:selected').attr('id');
    LocationName = $(".chart-select-location").find('option:selected').attr('value');

    currentIcMeterNameAlias = $(".chart-select-device").find(':selected').attr('data-box-name')
    $(".view-data-control .currentDeciveText h4").text("Location: "+LocationName);
    clearChartData();

    if ( graph.autoUpdate == false ) {
        $("#retrunNoICMeterData").hide();
        $("#gettingDataWait").show();
        $("#canvas1").hide();
        downloadDataDisable = true;
        $("#btn-download-graph-data").addClass("button-disabled");
    }

    graph.autoUpdate = false;

    xDataTypeSettings = $('.chart-select-device option:selected').attr('data-xData');
    var templateChekXData = '<span class="canvas-settings-check inline-checkbox xDataCheckbox">\
<input id="check-chart-data-xData" class="canvas-settings regular-checkbox" type="checkbox" value="false">\
<label for="check-chart-data-xData"></label>\
<p>'+ xDataTypeSettings + '</p>\
</span>';

    var sUrl = "api/api-get-graph-data.php";



    clearChartData();
    $.post(sUrl, {
        fAY2YfpdKvR: sender,
        LocationID: LocationID,
        from: startDateReplacement + "T00:00:00Z",
        to: endDateReplacement + "T23:59:59Z"

    }, function (sData) {


        var jData = JSON.parse(sData); 
        if (jData.status!="nodata"){



            var counter = 0;


            sensorIDs = [];
            sensorAlias = [];
            dataDates = [];
            dataDates2 = [];
            dataTemperature = [];
            dataHumidity = [];
            dataCO2 = [];
            dataNoiseAvg = [];
            dataNoisePeak  = [];





            xDataExist = false;

            $("btn-download-graph-data").removeClass("button-disabled");



            for( var i = 0 ; i < jData[0].length ; i++ ){
                sensorIDs[i]=jData[0][i].SensorID;
                sensorAlias[i]=jData[0][i].SensorAlias;
                dataHumidity[i]=jData[0][i].Humidity;
                dataNoiseAvg[i]=jData[0][i].NoiseAvg;
                dataNoisePeak[i]=jData[0][i].NoisePeak;
                dataTemperature[i]=jData[0][i].Temperature;

                var time = jData[0][i].time

                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                h= time.substring(11, 13);
                if (String(h).length==1){
                    h = "0" +h;

                }
                m= time.substring(14,16);
                if (String(m).length==1){
                    m= "0" + m;
                }

                month = months[parseInt(time.substring(5,7))-1];

                date = time.substring(8,10);



                dataDates[i]= date + ". " + month + " " + h + ":" + m;
                dataCO2[i]=jData[0][i].CO2;




            }


            enableDataSettings = true;
            $('.canvas-settings').attr('disabled', false);
            $('#chart-fill').attr('disabled', false);
            $('#chart-select-type').attr('disabled', false);


            howToDraw();


            downloadDataDisable = false;
            $("#btn-download-graph-data").removeClass("button-disabled");

            chart1TryUpdateData = 0;






        }  

        else {


            $('#canvas1').remove();
            $('.chartjs-hidden-iframe').remove();



            $("#gettingDataWait").hide();
            $("#retrunNoSchoolData").text("There are no data for the chosen location at the specified time interval");
            $("#retrunNoSchoolData").show();
            enableGraphSettingsSelections();



        }
    });


}

function disableGraphSettingsSelections() {
    $("#reportrange1, #reportrange2").css("opacity", ".5");
    $(".daterangepicker").css("visibility", "hidden");
    $('.canvas-settings-2-input').attr('disabled', true);
    $("#retrunNoDeviceGraph2").css("visibility", "hidden");
    $("#btn-get-compare-data").addClass("button-disabled");
    disableCompareBtn = true;
}
function enableGraphSettingsSelections() {
    if ( enableDataSettings == true ) {
        $("#reportrange1, #reportrange2").css("opacity", "1");
        $(".daterangepicker").css("visibility", "visible");
    } else {
        $("#reportrange2").css("opacity", "1");
        $(".daterangepicker:eq( 1 )").css("visibility", "visible");
    }
    $('.canvas-settings-2-input').attr('disabled', false);
    $("#retrunNoDeviceGraph2").css("visibility", "visible");
    $("#btn-get-compare-data").removeClass("button-disabled");
    disableCompareBtn = false;
}

function drawGraphDouble() {


    //choosing yaxes:
    var numAttributes=0;

    yAxisIDTemp='left-y-axis';
    yAxisIDHum='left-y-axis';
    yAxisIDco2='left-y-axis';
    yAxisIDnoiseAvg='left-y-axis';
    yAxisIDnoisePeak='left-y-axis';


    if(!graph.dataSetHidden.temperature){
        numAttributes++;
        if (numAttributes==1){
            yAxisIDTemp='left-y-axis';
        }
        else{
            yAxisIDTemp='right-y-axis';
        }
    }


    if(!graph.dataSetHidden.humidity){
        numAttributes++;
        if (numAttributes==1){
            yAxisIDHum='left-y-axis';
        }
        else{
            yAxisIDHum='right-y-axis';
        }
    }


    if(!graph.dataSetHidden.co2){
        numAttributes++;
        if (numAttributes==1){
            yAxisIDco2='left-y-axis';
        }
        else{
            yAxisIDco2='right-y-axis';
        }
    }


    if(!graph.dataSetHidden.noiseAvg){
        numAttributes++;
        if (numAttributes==1){
            yAxisIDnoiseAvg='left-y-axis';
        }
        else{
            yAxisIDnoiseAvg='right-y-axis';
        }
    }


    if(!graph.dataSetHidden.noisePeak){
        numAttributes++;
        if (numAttributes==1){
            yAxisIDnoisePeak='left-y-axis';
        }
        else{
            yAxisIDnoisePeak='right-y-axis';
        }
    }



    if (numAttributes==2){
        if(graph.dataSetHidden.temperature){
            $("#check-chart-data-temperature").attr('disabled','disabled');  
        }
        if(graph.dataSetHidden.humidity){
            $("#check-chart-data-humidity").attr('disabled','disabled');
        }
        if(graph.dataSetHidden.co2){
            $("#check-chart-data-co2").attr('disabled','disabled');
        }
        if(graph.dataSetHidden.noiseAvg){
            $("#check-chart-data-noiseAvg").attr('disabled','disabled');
        }
        if(graph.dataSetHidden.noisePeak){
            $("#check-chart-data-noisePeak").attr('disabled','disabled');
        }
    }




    if ( dataDates.length !== 0 ) {

        $('#canvas1').remove();
        $('.chartjs-hidden-iframe').remove();
        $('.canvas1').append('<canvas id="canvas1" width="2" height="1"></canvas>');

        //updateLiveData();

        $("#gettingDataWait").hide();
        $("#canvas1").show();

        if ( graphDrawn == false ) {
            graphDrawn = true;
        }

        var canvas1 = document.getElementById("canvas1");
        var context = canvas1.getContext('2d');

        var aniDone = false;
        Chart.defaults.global.animation.onComplete = function(){
            if ( aniDone == false ) {
                aniDone = true;
                fetchingDataGraph = false;
                enableGraphSettingsSelections();
            }
        };

        Chart.defaults.global.elements.point.radius = 1;

        chart1 = new Chart(context, {

            type: graph.chartType,
            data: {
                labels: dataDates,
                datasets: [
                    {


                        label: "Temperature (°C)",
                        fill: graph.chartFill,
                        backgroundColor: graph.dataSetColer2.temperature,
                        borderColor: graph.dataSetColer1.temperature,
                        pointBorderColor: graph.dataSetColer1.temperature,
                        pointBackgroundColor: graph.dataSetColer1.temperature,
                        pointHoverBackgroundColor: graph.dataSetColer2.temperature,
                        pointHoverBorderColor: graph.dataSetColer1.temperature,
                        data: dataTemperature,
                        spanGaps: false,
                        hidden: graph.dataSetHidden.temperature,
                        yAxisID: yAxisIDTemp
                    },
                    {
                        label: "Humidity (%)",
                        fill: graph.chartFill,
                        backgroundColor: graph.dataSetColer2.humidity,
                        borderColor: graph.dataSetColer1.humidity,           
                        pointBorderColor: graph.dataSetColer1.humidity,
                        pointBackgroundColor: graph.dataSetColer1.humidity,			            
                        pointHoverBackgroundColor: graph.dataSetColer2.humidity,
                        pointHoverBorderColor: graph.dataSetColer1.humidity,
                        data: dataHumidity,
                        spanGaps: false,
                        hidden: graph.dataSetHidden.humidity,
                        yAxisID: yAxisIDHum
                    }, 
                    {
                        label: "CO2 (ppm)",
                        fill: graph.chartFill,
                        backgroundColor: graph.dataSetColer2.co2,
                        borderColor: graph.dataSetColer1.co2,
                        pointBorderColor: graph.dataSetColer1.co2,
                        pointBackgroundColor: graph.dataSetColer1.co2,
                        pointHoverBackgroundColor: graph.dataSetColer2.co2,
                        pointHoverBorderColor: graph.dataSetColer1.co2,
                        data: dataCO2,
                        spanGaps: false,
                        hidden: graph.dataSetHidden.co2,
                        yAxisID: yAxisIDco2
                    },
                    {
                        label: "Støj-gennemsnit (dB(A))",
                        fill: graph.chartFill,
                        backgroundColor: graph.dataSetColer2.noiseAvg,
                        borderColor: graph.dataSetColer1.noiseAvg,
                        pointBorderColor: graph.dataSetColer1.noiseAvg,
                        pointBackgroundColor: graph.dataSetColer1.noiseAvg,
                        pointHoverBackgroundColor: graph.dataSetColer2.noiseAvg,
                        pointHoverBorderColor: graph.dataSetColer1.noiseAvg,
                        data: dataNoiseAvg,
                        spanGaps: false,
                        hidden: graph.dataSetHidden.noiseAvg,
                        yAxisID: yAxisIDnoiseAvg
                    },
                    {
                        label: "Støj-max (dB(A))",
                        fill: graph.chartFill,
                        backgroundColor: graph.dataSetColer2.noisePeak,
                        borderColor: graph.dataSetColer1.noisePeak,
                        pointBorderColor: graph.dataSetColer1.noisePeak,
                        pointBackgroundColor: graph.dataSetColer1.noisePeak,
                        pointHoverBackgroundColor: graph.dataSetColer2.noisePeak,
                        pointHoverBorderColor: graph.dataSetColer1.noisePeak,
                        data: dataNoisePeak,
                        spanGaps: false,
                        hidden: graph.dataSetHidden.noisePeak,
                        yAxisID: yAxisIDnoisePeak
                    }
                    /*
                    {
						label: xDataTypeSettings,
						fill: graph.chartFill,
						backgroundColor: graph.dataSetColer2.xData,
						borderColor: graph.dataSetColer1.xData,
						pointBorderColor: graph.dataSetColer1.xData,
						pointBackgroundColor: graph.dataSetColer1.xData,
						pointHoverBackgroundColor: graph.dataSetColer2.xData,
						pointHoverBorderColor: graph.dataSetColer1.xData,
						data: dataXData,
						spanGaps: false,
						hidden: graph.dataSetHidden.xData
					}*/

                ]
            }, 
            options: {

                animation: {
                    duration: graph.animationDuration, 
                },
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            maxRotation: 0 // angle in degrees
                        }
                    }],
                    yAxes:
                    [{
                        id: 'left-y-axis',
                        position: 'left'

                    }, {
                        id: 'right-y-axis',
                        position: 'right'

                    }],
                    type: 'time',
                    xAxes: [{
                        ticks: {
                            maxTicksLimit: 25		
                        }
                    }]
                }

            } 

        });

        graph.animationDuration = 500;
    }	
}


function drawGraphSingle() {

    $("#check-chart-data-temperature").removeAttr('disabled');
    $("#check-chart-data-humidity").removeAttr('disabled');
    $("#check-chart-data-co2").removeAttr('disabled');
    $("#check-chart-data-noiseAvg").removeAttr('disabled');
    $("#check-chart-data-noisePeak").removeAttr('disabled');


    if ( dataDates.length !== 0 ) {


        $('#canvas1').remove();
        $('.chartjs-hidden-iframe').remove();
        $('.canvas1').append('<canvas id="canvas1" width="2" height="1"></canvas>');

        //updateLiveData();

        $("#gettingDataWait").hide();
        $("#canvas1").show();

        if ( graphDrawn == false ) {
            graphDrawn = true;
        }

        var canvas1 = document.getElementById("canvas1");
        var context = canvas1.getContext('2d');

        var aniDone = false;
        Chart.defaults.global.animation.onComplete = function(){
            if ( aniDone == false ) {
                aniDone = true;
                fetchingDataGraph = false;
                enableGraphSettingsSelections();
            }
        };

        Chart.defaults.global.elements.point.radius = 1;

        chart1 = new Chart(context, {

            type: graph.chartType,
            data: {
                labels: dataDates,
                datasets: [
                    {


                        label: "Temperature (°C)",
                        fill: graph.chartFill,
                        backgroundColor: graph.dataSetColer2.temperature,
                        borderColor: graph.dataSetColer1.temperature,
                        pointBorderColor: graph.dataSetColer1.temperature,
                        pointBackgroundColor: graph.dataSetColer1.temperature,
                        pointHoverBackgroundColor: graph.dataSetColer2.temperature,
                        pointHoverBorderColor: graph.dataSetColer1.temperature,
                        data: dataTemperature,
                        spanGaps: false,
                        hidden: graph.dataSetHidden.temperature
                    },
                    {
                        label: "Humidity (%)",
                        fill: graph.chartFill,
                        backgroundColor: graph.dataSetColer2.humidity,
                        borderColor: graph.dataSetColer1.humidity,           
                        pointBorderColor: graph.dataSetColer1.humidity,
                        pointBackgroundColor: graph.dataSetColer1.humidity,			            
                        pointHoverBackgroundColor: graph.dataSetColer2.humidity,
                        pointHoverBorderColor: graph.dataSetColer1.humidity,
                        data: dataHumidity,
                        spanGaps: false,
                        hidden: graph.dataSetHidden.humidity
                    }, 
                    {
                        label: "CO2 (ppm)",
                        fill: graph.chartFill,
                        backgroundColor: graph.dataSetColer2.co2,
                        borderColor: graph.dataSetColer1.co2,
                        pointBorderColor: graph.dataSetColer1.co2,
                        pointBackgroundColor: graph.dataSetColer1.co2,
                        pointHoverBackgroundColor: graph.dataSetColer2.co2,
                        pointHoverBorderColor: graph.dataSetColer1.co2,
                        data: dataCO2,
                        spanGaps: false,
                        hidden: graph.dataSetHidden.co2
                    },
                    {
                        label: "Støj-gennemsnit (dB(A))",
                        fill: graph.chartFill,
                        backgroundColor: graph.dataSetColer2.noiseAvg,
                        borderColor: graph.dataSetColer1.noiseAvg,
                        pointBorderColor: graph.dataSetColer1.noiseAvg,
                        pointBackgroundColor: graph.dataSetColer1.noiseAvg,
                        pointHoverBackgroundColor: graph.dataSetColer2.noiseAvg,
                        pointHoverBorderColor: graph.dataSetColer1.noiseAvg,
                        data: dataNoiseAvg,
                        spanGaps: false,
                        hidden: graph.dataSetHidden.noiseAvg
                    },
                    {
                        label: "Støj-max (dB(A))",
                        fill: graph.chartFill,
                        backgroundColor: graph.dataSetColer2.noisePeak,
                        borderColor: graph.dataSetColer1.noisePeak,
                        pointBorderColor: graph.dataSetColer1.noisePeak,
                        pointBackgroundColor: graph.dataSetColer1.noisePeak,
                        pointHoverBackgroundColor: graph.dataSetColer2.noisePeak,
                        pointHoverBorderColor: graph.dataSetColer1.noisePeak,
                        data: dataNoisePeak,
                        spanGaps: false,
                        hidden: graph.dataSetHidden.noisePeak
                    }
                    /*
                    {
						label: xDataTypeSettings,
						fill: graph.chartFill,
						backgroundColor: graph.dataSetColer2.xData,
						borderColor: graph.dataSetColer1.xData,
						pointBorderColor: graph.dataSetColer1.xData,
						pointBackgroundColor: graph.dataSetColer1.xData,
						pointHoverBackgroundColor: graph.dataSetColer2.xData,
						pointHoverBorderColor: graph.dataSetColer1.xData,
						data: dataXData,
						spanGaps: false,
						hidden: graph.dataSetHidden.xData
					}*/

                ]
            }, 
            options: {

                animation: {
                    duration: graph.animationDuration, 
                },
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            maxRotation: 0 // angle in degrees
                        }
                    }],
                    type: 'time',
                    xAxes: [{
                        ticks: {
                            maxTicksLimit: 25		
                        }
                    }]
                }

            } 

        });

        graph.animationDuration = 500;
    }	
}



// Select chart content

$('.canvas-settings').attr('disabled', false);
$('#chart-select-type').attr('disabled', false);


// Checkbox compare settings
$(document).on("click",".canvas-settings-2-input", function() {
    var thisBoxQR = $(this).attr("data-box-qr");
    var boxName = $(this).attr("data-box-name");
    var thisBGColor = $(this).attr("data-check-color");
    if ( graphCompare.begin == false ) {
        graphCompare.begin = true;
    }
    $(".txt-max-compare-device-selected").hide();
    $(this).parent().find("label").removeClass('no-after');
    if ($(this).is(":checked")) {

        if ( graphCompare.selecteDevices.length < graphCompare.maxSelections ) {			
            $(this).parent().find("label").css("background-color", hexToRgbA(thisBGColor));
            addCompareDevices(thisBoxQR, boxName, thisBGColor);  
        } else if ( graphCompare.selecteDevices.length == graphCompare.maxSelections ) {
            $(this).parent().find("label").css("background-color", "#fafafa");
            $(this).parent().find("label").addClass('no-after');
            $(this).prop( "checked", false )
            $(".txt-max-compare-device-selected").show();
        }

    } else {
        $(this).parent().find("label").css("background-color", "#fafafa");
        removeCompareDevices(thisBoxQR);  
    }
});

function addCompareDevices(boxQR, boxName, color) {
    var sTemp = '{"boxQR":"'+boxQR+'","boxName": "'+boxName+'","color": "'+color+'"}';
    jTemp = JSON.parse(sTemp)
    graphCompare.selecteDevices.push(jTemp);
}

function removeCompareDevices(boxQR) {
    for (var i in graphCompare.selecteDevices) {
        if (graphCompare.selecteDevices[i]["boxQR"] == boxQR)
            graphCompare.selecteDevices.splice(i, 1);
    }
}





function startCompareCharset() {
    $("#gettingCompareDataWait").show();
    clearCompareGraph();
    getCompareCharsetData();
    disableGraphSettingsSelections();

}

function getCompareCharsetData(){

    //Possible old warning should be hidden
    $("#retrunNoDeviceGraph2").hide();


    var noDataAlert = false;
    var callGraphTimes = 0;


    LocationIDs =[];
    numberOfLocations=0;

    $(".chart-select-location option").each(function(){

        // Add $(this).val() to your list

        //locStand is the standard location option "Choose Location"...

        LocID = $(this).attr('id'); 

        if (!LocationIDs.includes(LocID)){

            if($(this).val()!="locStand"){



                var isChecked = document.getElementById('check'+LocID).checked;


                if (isChecked){
                    numberOfLocations++;
                    LocationIDs.push(LocID);
                }

            }
        }


    });



    LocationIDs = JSON.stringify(LocationIDs)






    var sUrl = "api/api-get-compare-data.php"

    $.post(sUrl, {
        fAY2YfpdKvR: sender,
        LocationIDs: LocationIDs,
        from: startDateReplacement + "T00:00:00Z",
        to: endDateReplacement + "T23:59:59Z"

    }, function (sData) {

        clearCompareData();
        clearCompareGraph();

        //potential old warning should should disapear
        $("#retrunNoSchoolGraph2").hide();
        $("#retrunNoSchoolGraph2Part2").hide();


        var jData = JSON.parse(sData); 

        if (jData.status!="nodata"){
            //[i][j]  -> i = different sensors, j = different datapoints



            dates = [];
            temperature = [];
            humidity = [];
            CO2 = [];
            noiseAvg = [];
            colors = ['rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'];





            for( var i = 0 ; i < jData.length ; i++ ){
                for( var j = 0 ; j < jData[i].length; j++ ){


                    var time = jData[i][j].time;

                    if (typeof time != "undefined"){
                        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



                        h= time.substring(11, 13);
                        if (String(h).length==1){
                            h = "0" +h;

                        }
                        m= time.substring(14,16);
                        if (String(m).length==1){
                            m= "0" + m;
                        }

                        month = months[parseInt(time.substring(5,7))-1];

                        date = time.substring(8,10);






                        dToInsert = date + ". " + month + " " + h + ":" + m; 
                        dates.push(dToInsert);
                        temperature.push(jData[i][j].Temperature);
                        humidity.push(jData[i][j].Humidity);
                        CO2.push(jData[i][j].CO2);
                        noiseAvg.push(jData[i][j].NoiseAvg);


                        if (j==0){
                            LocID=jData[i][j].LocationID;
                        }

                    }
                    else {


                        $("#retrunNoDeviceGraph2").html("OBS! Some locations didn't have any data for this period.");
                        $("#retrunNoDeviceGraph2").show();

                    }
                }
                compareData.dataDates = dates;
                compareData.dataTemperature.push(temperature);
                compareData.dataHumidity.push(humidity);
                compareData.dataCO2.push(CO2);
                compareData.dataNoiseAvg.push(noiseAvg);
                compareData.dataLabel.push(LocID);
                compareData.dataColor.push(colors[i]); 

                dates = [];
                temperature = [];
                humidity = [];
                CO2 = [];
                noiseAvg = [];




            }





            callDrawCompareGraph();





            if(jData.length!=numberOfLocations){

                $("#retrunNoDeviceGraph2").html("OBS! Some locations didn't have any data for this period.");
                $("#retrunNoDeviceGraph2").show();
            }

        }

        else{

            $("#gettingCompareDataWait").hide();
            $("#retrunNoSchoolGraph2").text("There are no data for the chosen location at the specified time interval");
            $("#retrunNoSchoolGraph2").show();
            enableGraphSettingsSelections();
        }
    });
}



function callDrawCompareGraph(){

    drawCompareGraph(); 
}


function clearCompareData() {
    compareData.dataDates = [];
    compareData.dataTemperature = [];
    compareData.dataHumidity = [];
    compareData.dataCO2 = [];
    compareData.dataNoiseAvg = [];
    compareData.dataLabel = [];
    compareData.dataColor = [];
}

function clearCompareGraph() {
    $('#canvas2, #canvas3, #canvas4 , #canvas5').remove();
    $('.canvas-2-3-4-5-type').remove();
    $('.chartjs-hidden-iframe').remove();
}

function drawCompareGraph() {

    $("#gettingCompareDataWait").hide();
    $('.canvas-wrapper-2').append('<div class="canvas-2-3-4-5-type"><i class="fa fa-thermometer-full" aria-hidden="true"></i>Temperatur</div><canvas id="canvas2" width="3" height="1"></canvas>');
    $('.canvas-wrapper-2').append('<div class="canvas-2-3-4-5-type"><i class="fa fa-tint" aria-hidden="true"></i>Luftfugtighed</div><canvas id="canvas3" width="3" height="1"></canvas>');
    $('.canvas-wrapper-2').append('<div class="canvas-2-3-4-5-type"><i class="fa fa-cloud" aria-hidden="true"></i>CO2 niveau</div><canvas id="canvas4" width="3" height="1"></canvas>');
    $('.canvas-wrapper-2').append('<div class="canvas-2-3-4-5-type"><i class="fa fa-microphone" aria-hidden="true"></i>Støj gennemsnit</div><canvas id="canvas5" width="3" height="1"></canvas>');

    var ctx2 = document.getElementById("canvas2").getContext('2d');
    var ctx3 = document.getElementById("canvas3").getContext('2d');
    var ctx4 = document.getElementById("canvas4").getContext('2d');
    var ctx5 = document.getElementById("canvas5").getContext('2d');

    Chart.defaults.global.legend.display = false;
    Chart.defaults.global.elements.line.fill = false;
    Chart.defaults.global.elements.point.radius = 1;

    var aniDone = false;
    Chart.defaults.global.animation.onComplete = function(){
        if ( aniDone == false ) {
            aniDone = true;
            fetchingDataGraph = false;
            enableGraphSettingsSelections();
        }
    };

    var Chart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: compareData.dataDates,
            datasets: [
                {
                    label: compareData.dataLabel[0],
                    data: compareData.dataTemperature[0],
                    borderColor: compareData.dataColor[0],
                },
                {
                    label: compareData.dataLabel[1],
                    data: compareData.dataTemperature[1],
                    borderColor: compareData.dataColor[1],
                },
                {
                    label: compareData.dataLabel[2],
                    data: compareData.dataTemperature[2],
                    borderColor: compareData.dataColor[2],
                },
                {
                    label: compareData.dataLabel[3],
                    data: compareData.dataTemperature[3],
                    borderColor: compareData.dataColor[3],
                },
                {
                    label: compareData.dataLabel[4],
                    data: compareData.dataTemperature[4],
                    borderColor: compareData.dataColor[4],
                },
                {
                    label: compareData.dataLabel[5],
                    data: compareData.dataTemperature[5],
                    borderColor: compareData.dataColor[5],
                },
                {
                    label: compareData.dataLabel[6],
                    data: compareData.dataTemperature[6],
                    borderColor: compareData.dataColor[6],
                },
                {
                    label: compareData.dataLabel[7],
                    data: compareData.dataTemperature[7],
                    borderColor: compareData.dataColor[7],
                },
                {
                    label: compareData.dataLabel[8],
                    data: compareData.dataTemperature[8],
                    borderColor: compareData.dataColor[8],
                },
                {
                    label: compareData.dataLabel[9],
                    data: compareData.dataTemperature[9],
                    borderColor: compareData.dataColor[9],
                }
            ]
        },
        hidden: true,
        options: {
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function(tooltipItems, data) { 
                        return compareData.dataLabel[tooltipItems.datasetIndex]+': '+tooltipItems.yLabel + ' ºC';
                    }
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:false,	           
                    }
                }],
                xAxes: [{
                    ticks: {
                        maxTicksLimit: 25,
                        display: true
                    }
                }]
            }
        }
    });

    var Chart3 = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: compareData.dataDates,
            datasets: [
                {
                    label: compareData.dataLabel[0],
                    data: compareData.dataHumidity[0],
                    borderColor: compareData.dataColor[0],
                },
                {
                    label: compareData.dataLabel[1],
                    data: compareData.dataHumidity[1],
                    borderColor: compareData.dataColor[1],
                },
                {
                    label: compareData.dataLabel[2],
                    data: compareData.dataHumidity[2],
                    borderColor: compareData.dataColor[2],
                },
                {
                    label: compareData.dataLabel[3],
                    data: compareData.dataHumidity[3],
                    borderColor: compareData.dataColor[3],
                },
                {
                    label: compareData.dataLabel[4],
                    data: compareData.dataHumidity[4],
                    borderColor: compareData.dataColor[4],
                },
                {
                    label: compareData.dataLabel[5],
                    data: compareData.dataHumidity[5],
                    borderColor: compareData.dataColor[5],
                },
                {
                    label: compareData.dataLabel[6],
                    data: compareData.dataHumidity[6],
                    borderColor: compareData.dataColor[6],
                },
                {
                    label: compareData.dataLabel[7],
                    data: compareData.dataHumidity[7],
                    borderColor: compareData.dataColor[7],
                },
                {
                    label: compareData.dataLabel[8],
                    data: compareData.dataHumidity[8],
                    borderColor: compareData.dataColor[8],
                },
                {
                    label: compareData.dataLabel[9],
                    data: compareData.dataHumidity[9],
                    borderColor: compareData.dataColor[9],
                }
            ]
        },
        hidden: true,
        options: {
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function(tooltipItems, data) { 
                        return compareData.dataLabel[tooltipItems.datasetIndex]+': '+tooltipItems.yLabel + ' %';
                    }
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:false,	           
                    }
                }],
                xAxes: [{
                    ticks: {
                        maxTicksLimit: 25,
                        display: true
                    }
                }]
            }
        }
    });

    var Chart4 = new Chart(ctx4, {
        type: 'line',
        data: {
            labels: compareData.dataDates,
            datasets: [
                {
                    label: compareData.dataLabel[0],
                    data: compareData.dataCO2[0],
                    borderColor: compareData.dataColor[0],
                },
                {
                    label: compareData.dataLabel[1],
                    data: compareData.dataCO2[1],
                    borderColor: compareData.dataColor[1],
                },
                {
                    label: compareData.dataLabel[2],
                    data: compareData.dataCO2[2],
                    borderColor: compareData.dataColor[2],
                },
                {
                    label: compareData.dataLabel[3],
                    data: compareData.dataCO2[3],
                    borderColor: compareData.dataColor[3],
                },
                {
                    label: compareData.dataLabel[4],
                    data: compareData.dataCO2[4],
                    borderColor: compareData.dataColor[4],
                },
                {
                    label: compareData.dataLabel[5],
                    data: compareData.dataCO2[5],
                    borderColor: compareData.dataColor[5],
                },
                {
                    label: compareData.dataLabel[6],
                    data: compareData.dataCO2[6],
                    borderColor: compareData.dataColor[6],
                },
                {
                    label: compareData.dataLabel[7],
                    data: compareData.dataCO2[7],
                    borderColor: compareData.dataColor[7],
                },
                {
                    label: compareData.dataLabel[8],
                    data: compareData.dataCO2[8],
                    borderColor: compareData.dataColor[8],
                },
                {
                    label: compareData.dataLabel[9],
                    data: compareData.dataCO2[9],
                    borderColor: compareData.dataColor[9],
                }
            ]
        },
        hidden: true,
        options: {
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function(tooltipItems, data) { 
                        return compareData.dataLabel[tooltipItems.datasetIndex]+': '+tooltipItems.yLabel + ' ppm';
                    }
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:false,	           
                    }
                }],
                xAxes: [{
                    ticks: {
                        maxTicksLimit: 25,
                        display: true
                    }
                }]
            }
        }
    });

    var Chart5 = new Chart(ctx5, {
        type: 'line',
        spanGaps: false,
        data: {
            labels: compareData.dataDates,
            datasets: [
                {
                    label: compareData.dataLabel[0],
                    data: compareData.dataNoiseAvg[0],
                    borderColor: compareData.dataColor[0],
                },
                {
                    label: compareData.dataLabel[1],
                    data: compareData.dataNoiseAvg[1],
                    borderColor: compareData.dataColor[1],
                },
                {
                    label: compareData.dataLabel[2],
                    data: compareData.dataNoiseAvg[2],
                    borderColor: compareData.dataColor[2],
                },
                {
                    label: compareData.dataLabel[3],
                    data: compareData.dataNoiseAvg[3],
                    borderColor: compareData.dataColor[3],
                },
                {
                    label: compareData.dataLabel[4],
                    data: compareData.dataNoiseAvg[4],
                    borderColor: compareData.dataColor[4],
                },
                {
                    label: compareData.dataLabel[5],
                    data: compareData.dataNoiseAvg[5],
                    borderColor: compareData.dataColor[5],
                },
                {
                    label: compareData.dataLabel[6],
                    data: compareData.dataNoiseAvg[6],
                    borderColor: compareData.dataColor[6],
                },
                {
                    label: compareData.dataLabel[7],
                    data: compareData.dataNoiseAvg[7],
                    borderColor: compareData.dataColor[7],
                },
                {
                    label: compareData.dataLabel[8],
                    data: compareData.dataNoiseAvg[8],
                    borderColor: compareData.dataColor[8],
                },
                {
                    label: compareData.dataLabel[9],
                    data: compareData.dataNoiseAvg[9],
                    borderColor: compareData.dataColor[9],
                }
            ]
        },
        hidden: true,
        options: {
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function(tooltipItems, data) { 
                        return compareData.dataLabel[tooltipItems.datasetIndex]+': '+tooltipItems.yLabel + ' dB';
                    }
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 32,
                        beginAtZero:false
                    }
                }],
                xAxes: [{
                    ticks: {
                        maxTicksLimit: 25,	
                        display: true
                    }
                }]
            }
        }
    });
}

// Map chart

var dataMapTemp;
var dataMapHum;
var dataMapCo2;
var dataMapNoi;
var ChartTemp;
var ChartHum;
var ChartCo2;
var ChartNoi;
var lineAtIndex;
var showTooltipsMapChart = true;

function drawMapChart(DiveseSel) {
    $('.data-map-charts-content').remove();
    $('.data-map-charts').append('<div class="data-map-charts-content"></div>');
    var canvasHeight = $(".update-map-settings-graph-size").val();
    var canvasWidth = 4;
    if (mapShow.monitor.temperature) {
        $('.data-map-charts-content').append('<div class="canvas-6-7-8-9-type"><i class="fa fa-thermometer-full" aria-hidden="true"></i>Temperatur</div><canvas id="canvas6" height="'+canvasHeight+'" width="'+canvasWidth+'"></canvas>');
    }	
    if (mapShow.monitor.humidity) {
        $('.data-map-charts-content').append('<div class="canvas-6-7-8-9-type"><i class="fa fa-tint" aria-hidden="true"></i>Luftfugtighed</div><canvas id="canvas7" height="'+canvasHeight+'" width="'+canvasWidth+'"></canvas>');
    }	
    if (mapShow.monitor.co2) {
        $('.data-map-charts-content').append('<div class="canvas-6-7-8-9-type"><i class="fa fa-cloud" aria-hidden="true"></i>CO2 niveau</div><canvas id="canvas8" height="'+canvasHeight+'" width="'+canvasWidth+'"></canvas>');
    }	
    if (mapShow.monitor.noiseAvg) {
        $('.data-map-charts-content').append('<div class="canvas-6-7-8-9-type"><i class="fa fa-microphone" aria-hidden="true"></i>Støj gennemsnit</div><canvas id="canvas9" height="'+canvasHeight+'" width="'+canvasWidth+'"></canvas>');
    }	
    Chart.defaults.global.legend.display = false;
    Chart.defaults.global.elements.line.fill = false;
    Chart.defaults.global.elements.point.radius = 1;
    if (DiveseSel == false) {
        Chart.defaults.global.animation.duration = 3000;
    } else {
        Chart.defaults.global.animation.duration = 0;
    }

    var originalLineDraw = Chart.controllers.line.prototype.draw;
    Chart.helpers.extend(Chart.controllers.line.prototype, {
        draw: function() {
            originalLineDraw.apply(this, arguments);
            var chart = this.chart;
            var ctx = chart.chart.ctx;
            var index = chart.config.data.lineAtIndex;
            if (index) {
                var xaxis = chart.scales['x-axis-0'];
                var yaxis = chart.scales['y-axis-0'];
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(xaxis.getPixelForValue(undefined, index), yaxis.top);
                ctx.strokeStyle = '#ff4242';
                ctx.lineTo(xaxis.getPixelForValue(undefined, index), yaxis.bottom);
                ctx.stroke();
                ctx.restore();
            }
        }
    });
    if (mapShow.monitor.temperature) {
        dataMapTemp = {
            labels: mapShowData.times,
            lineAtIndex: $("#map-set-timerange").val(),
            datasets: [],
        };
        var Chart6 = $("#canvas6").get(0).getContext("2d");
        ChartTemp = new Chart(Chart6, {
            type: "line",
            data: dataMapTemp,
            options: {
                tooltips: {
                    enabled: showTooltipsMapChart,
                    mode: 'single',
                    callbacks: {
                        label: function(tooltipItems, data) { 
                            return mapShowData.name[tooltipItems.datasetIndex]+': '+tooltipItems.yLabel + ' ºC';
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 32,
                            beginAtZero:false
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            maxTicksLimit: 25,	
                            display: true
                        }
                    }]
                }
            }
        });
    }
    if (mapShow.monitor.humidity) {
        dataMapHum = {
            labels: mapShowData.times,
            lineAtIndex: $("#map-set-timerange").val(),
            datasets: [],
        };
        var Chart7 = $("#canvas7").get(0).getContext("2d");
        ChartHum = new Chart(Chart7, {
            type: "line",
            data: dataMapHum,
            options: {
                tooltips: {
                    enabled: showTooltipsMapChart,
                    mode: 'single',
                    callbacks: {
                        label: function(tooltipItems, data) { 
                            return mapShowData.name[tooltipItems.datasetIndex]+': '+tooltipItems.yLabel + ' %';
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 32,
                            beginAtZero:false
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            maxTicksLimit: 25,	
                            display: true
                        }
                    }]
                }
            }
        });
    }
    if (mapShow.monitor.co2) {
        dataMapCo2 = {
            labels: mapShowData.times,
            lineAtIndex: $("#map-set-timerange").val(),
            datasets: []
        };
        var Chart8 = $("#canvas8").get(0).getContext("2d");
        ChartCo2 = new Chart(Chart8, {
            type: "line",
            data: dataMapCo2,
            options: {
                tooltips: {
                    enabled: showTooltipsMapChart,
                    mode: 'single',
                    callbacks: {
                        label: function(tooltipItems, data) { 
                            return mapShowData.name[tooltipItems.datasetIndex]+': '+tooltipItems.yLabel + ' ppm';
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 32,
                            beginAtZero:false
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            maxTicksLimit: 25,	
                            display: true
                        }
                    }]
                }
            }
        });
    }
    if (mapShow.monitor.noiseAvg) {
        dataMapNoi = {
            labels: mapShowData.times,
            lineAtIndex: $("#map-set-timerange").val(),
            datasets: []
        };
        var Chart9 = $("#canvas9").get(0).getContext("2d");
        ChartNoi = new Chart(Chart9, {
            type: "line",
            data: dataMapNoi,
            options: {
                tooltips: {
                    enabled: showTooltipsMapChart,
                    mode: 'single',
                    callbacks: {
                        label: function(tooltipItems, data) { 
                            return mapShowData.name[tooltipItems.datasetIndex]+': '+tooltipItems.yLabel + ' dB';
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 32,
                            beginAtZero:false
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            maxTicksLimit: 25,	
                            display: true
                        }
                    }]
                }
            }
        });
    }

    function addData(){
        counter = 0;
        for (i = 0; i < mapShowData.qr.length; i++) {
            if (highlightDeviceFromMap==true) {
                if (DiveseSel !== mapShowData.qr[i]) {
                    tempBorderColor = 'rgba(0, 0, 0, 0.05)';
                } else {
                    tempBorderColor = mapShowData.color[i];
                }
            } else {
                tempBorderColor = mapShowData.color[i];
            }
            if (mapShow.monitor.temperature) {
                var newDatasetTemp = {
                    label: mapShowData.qr[i],
                    fill: false,
                    borderColor: tempBorderColor,
                    data: mapShowData.temperature[i],
                }
                dataMapTemp.datasets.push(newDatasetTemp);
            }
            if (mapShow.monitor.humidity) {
                var newDatasetHum = {
                    label: mapShowData.qr[i],
                    fill: false,
                    borderColor: tempBorderColor,
                    data: mapShowData.humidity[i],
                }
                dataMapHum.datasets.push(newDatasetHum);
            }
            if (mapShow.monitor.co2) {
                var newDatasetCo2 = {
                    label: mapShowData.qr[i],
                    fill: false,
                    borderColor: tempBorderColor,
                    data: mapShowData.co2[i],
                }
                dataMapCo2.datasets.push(newDatasetCo2);
            }
            if (mapShow.monitor.noiseAvg) {
                var newDatasetNoi = {
                    label: mapShowData.qr[i],
                    fill: false,
                    borderColor: tempBorderColor,
                    data: mapShowData.noise[i],
                }
                dataMapNoi.datasets.push(newDatasetNoi);
            }
            counter++;
            if (counter == mapShowData.qr.length) {
                if (mapShow.monitor.temperature) {
                    ChartTemp.update();
                }
                if (mapShow.monitor.humidity) {
                    ChartHum.update();
                }
                if (mapShow.monitor.co2) {
                    ChartCo2.update();
                }
                if (mapShow.monitor.noiseAvg) {
                    ChartNoi.update();
                }
            }
        }
    }
    addData();	
}

// Map chart Live

var dataMapLiveTemp;
var dataMapLiveHum;
var dataMapLiveCo2;
var dataMapLiveNoi;
var ChartTempLive;
var ChartHumLive;
var ChartCo2Live;
var ChartNoiLive;
var showTooltipsMapChartLive = true;
var dataLenght = {
    temperature: 0,
    humidity: 0,
    co2: 0,
    noise: 0
}

function drawMapChartDay(DiveseSel) {
    $("#gettingLiveDataMapDay").hide();
    $('.data-map-charts-content-live').remove();
    $('.data-map-charts-live').append('<div class="data-map-charts-content-live"></div>');
    // Place line at the end of data lenght

    var canvasHeight = $(".update-map-settings-graph-size-day").val();
    var canvasWidth = 4;
    if (mapShow.monitor.temperature) {
        $('.data-map-charts-content-live').append('<div class="canvas-10-11-12-13-type"><i class="fa fa-thermometer-full" aria-hidden="true"></i>Temperatur</div><canvas id="canvas10" height="'+canvasHeight+'" width="'+canvasWidth+'"></canvas>');
    }	
    if (mapShow.monitor.humidity) {
        $('.data-map-charts-content-live').append('<div class="canvas-10-11-12-13-type"><i class="fa fa-tint" aria-hidden="true"></i>Luftfugtighed</div><canvas id="canvas11" height="'+canvasHeight+'" width="'+canvasWidth+'"></canvas>');
    }	
    if (mapShow.monitor.co2) {
        $('.data-map-charts-content-live').append('<div class="canvas-10-11-12-13-type"><i class="fa fa-cloud" aria-hidden="true"></i>CO2 niveau</div><canvas id="canvas12" height="'+canvasHeight+'" width="'+canvasWidth+'"></canvas>');
    }	
    if (mapShow.monitor.noiseAvg) {
        $('.data-map-charts-content-live').append('<div class="canvas-10-11-12-13-type"><i class="fa fa-microphone" aria-hidden="true"></i>Støj gennemsnit</div><canvas id="canvas13" height="'+canvasHeight+'" width="'+canvasWidth+'"></canvas>');
    }	
    Chart.defaults.global.legend.display = false;
    Chart.defaults.global.elements.line.fill = false;
    Chart.defaults.global.elements.point.radius = 1;
    if (DiveseSel == false) {
        Chart.defaults.global.animation.duration = 3000;
    } else {
        Chart.defaults.global.animation.duration = 0;
    }

    var originalLineDraw = Chart.controllers.line.prototype.draw;
    Chart.helpers.extend(Chart.controllers.line.prototype, {
        draw: function() {
            originalLineDraw.apply(this, arguments);
            var chart = this.chart;
            var ctx = chart.chart.ctx;
            var index = chart.config.data.lineAtIndex;
            if (index) {
                var xaxis = chart.scales['x-axis-0'];
                var yaxis = chart.scales['y-axis-0'];
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(xaxis.getPixelForValue(undefined, index), yaxis.top);
                ctx.strokeStyle = '#ff4242';
                ctx.lineTo(xaxis.getPixelForValue(undefined, index), yaxis.bottom);
                ctx.stroke();
                ctx.restore();
            }
        }
    });
    if (mapShow.monitor.temperature) {
        dataMapLiveTemp = {
            labels: mapShowDataLive.times,
            lineAtIndex: dataLenght.temperature,
            datasets: [],
        };
        var Chart10 = $("#canvas10").get(0).getContext("2d");
        ChartTempLive = new Chart(Chart10, {
            type: "line",
            data: dataMapLiveTemp,
            options: {
                tooltips: {
                    enabled: showTooltipsMapChartLive,
                    mode: 'single',
                    callbacks: {
                        label: function(tooltipItems, data) { 
                            return mapShowDataLive.name[tooltipItems.datasetIndex]+': '+tooltipItems.yLabel + ' ºC';
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 32,
                            beginAtZero:false
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            maxTicksLimit: 25,	
                            display: true
                        }
                    }]
                }
            }
        });
    }
    if (mapShow.monitor.humidity) {
        dataMapLiveHum = {
            labels: mapShowDataLive.times,
            lineAtIndex: dataLenght.humidity,
            datasets: [],
        };
        var Chart11 = $("#canvas11").get(0).getContext("2d");
        ChartHumLive = new Chart(Chart11, {
            type: "line",
            data: dataMapLiveHum,
            options: {
                tooltips: {
                    enabled: showTooltipsMapChartLive,
                    mode: 'single',
                    callbacks: {
                        label: function(tooltipItems, data) { 
                            return mapShowDataLive.name[tooltipItems.datasetIndex]+': '+tooltipItems.yLabel + ' %';
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 32,
                            beginAtZero:false
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            maxTicksLimit: 25,	
                            display: true
                        }
                    }]
                }
            }
        });
    }
    if (mapShow.monitor.co2) {
        dataMapLiveCo2 = {
            labels: mapShowDataLive.times,
            lineAtIndex: dataLenght.co2,
            datasets: []
        };
        var Chart12 = $("#canvas12").get(0).getContext("2d");
        ChartCo2Live = new Chart(Chart12, {
            type: "line",
            data: dataMapLiveCo2,
            options: {
                tooltips: {
                    enabled: showTooltipsMapChartLive,
                    mode: 'single',
                    callbacks: {
                        label: function(tooltipItems, data) {
                            return mapShowDataLive.name[tooltipItems.datasetIndex]+': '+tooltipItems.yLabel + ' ppm';
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 32,
                            beginAtZero:false
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            maxTicksLimit: 25,
                            display: true
                        }
                    }]
                }
            }
        });
    }
    if (mapShow.monitor.noiseAvg) {
        dataMapLiveNoi = {
            labels: mapShowDataLive.times,
            lineAtIndex: dataLenght.noise,
            datasets: []
        };
        var Chart13 = $("#canvas13").get(0).getContext("2d");
        ChartNoiLive = new Chart(Chart13, {
            type: "line",
            data: dataMapLiveNoi,
            options: {
                tooltips: {
                    enabled: showTooltipsMapChartLive,
                    mode: 'single',
                    callbacks: {
                        label: function(tooltipItems, data) { 
                            return mapShowDataLive.name[tooltipItems.datasetIndex]+': '+tooltipItems.yLabel + ' dB';
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            suggestedMin: 32,
                            beginAtZero:false
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            maxTicksLimit: 25,	
                            display: true
                        }
                    }]
                }
            }
        });
    }

    function addData(){
        counter = 0;
        for (i = 0; i < mapShowDataLive.qr.length; i++) {
            if (mapShowDataLive.temperature[i].length > dataLenght.temperature) {
                dataLenght.temperature = mapShowDataLive.temperature[i].length;
            }
            if (mapShowDataLive.humidity[i].length > dataLenght.humidity) {
                dataLenght.humidity = mapShowDataLive.humidity[i].length;
            }
            if (mapShowDataLive.co2[i].length > dataLenght.co2) {
                dataLenght.co2 = mapShowDataLive.co2[i].length;
            }
            if (mapShowDataLive.noise[i].length > dataLenght.noise) {
                dataLenght.noise = mapShowDataLive.noise[i].length;
            }
            if (highlightDeviceFromMap==true) {
                if (DiveseSel !== mapShowDataLive.qr[i]) {
                    tempBorderColor = 'rgba(0, 0, 0, 0.05)';
                } else {
                    tempBorderColor = mapShowDataLiveColor[i];
                    printAdvice(selectedDeviceFromMap)
                }
            } else {
                tempBorderColor = mapShowDataLiveColor[i];
            }
            if (mapShow.monitor.temperature) {
                var newDatasetTemp = {
                    label: mapShowDataLive.qr[i],
                    fill: false,
                    borderColor: tempBorderColor,
                    data: mapShowDataLive.temperature[i],
                }
                dataMapLiveTemp.datasets.push(newDatasetTemp);
            }
            if (mapShow.monitor.humidity) {
                var newDatasetHum = {
                    label: mapShowDataLive.qr[i],
                    fill: false,
                    borderColor: tempBorderColor,
                    data: mapShowDataLive.humidity[i],
                }
                dataMapLiveHum.datasets.push(newDatasetHum);
            }
            if (mapShow.monitor.co2) {
                var newDatasetCo2 = {
                    label: mapShowDataLive.qr[i],
                    fill: false,
                    borderColor: tempBorderColor,
                    data: mapShowDataLive.co2[i],
                }
                dataMapLiveCo2.datasets.push(newDatasetCo2);
            }
            if (mapShow.monitor.noiseAvg) {
                var newDatasetNoi = {
                    label: mapShowDataLive.qr[i],
                    fill: false,
                    borderColor: tempBorderColor,
                    data: mapShowDataLive.noise[i],
                }
                dataMapLiveNoi.datasets.push(newDatasetNoi);
            }
            counter++;
            if (counter == mapShowDataLive.qr.length) {
                if (mapShow.monitor.temperature) {
                    dataMapLiveTemp.lineAtIndex = dataLenght.temperature;
                    ChartTempLive.update();
                }
                if (mapShow.monitor.humidity) {
                    dataMapLiveHum.lineAtIndex = dataLenght.humidity;
                    ChartHumLive.update();
                }
                if (mapShow.monitor.co2) {
                    dataMapLiveCo2.lineAtIndex = dataLenght.co2;
                    ChartCo2Live.update();
                }
                if (mapShow.monitor.noiseAvg) {
                    dataMapLiveNoi.lineAtIndex = dataLenght.noise;
                    ChartNoiLive.update();

                }
            }
        }
    }
    addData();	
}

function updateMapChartLine(){
    if ( mapAutoPlay == false ) { 
        if (mapShow.monitor.temperature) {
            ChartTemp.options.tooltips.enabled = false;
        }
        if (mapShow.monitor.humidity) {	
            ChartHum.options.tooltips.enabled = false; 
        }
        if (mapShow.monitor.co2) {
            ChartCo2.options.tooltips.enabled = false;
        }	
        if (mapShow.monitor.noiseAvg) {
            ChartNoi.options.tooltips.enabled = false;
        }
    } else {
        if (mapShow.monitor.temperature) {
            ChartTemp.options.tooltips.enabled = true;
        }	
        if (mapShow.monitor.humidity) {
            ChartHum.options.tooltips.enabled = true;
        }
        if (mapShow.monitor.co2) {
            ChartCo2.options.tooltips.enabled = true;
        }	
        if (mapShow.monitor.noiseAvg) {
            ChartNoi.options.tooltips.enabled = true;
        }
    }
    if (mapShow.monitor.temperature) {
        dataMapTemp.lineAtIndex = ($("#map-set-timerange").val());
        ChartTemp.update();
    }
    if (mapShow.monitor.humidity) {
        ChartHum.update();
        dataMapHum.lineAtIndex = ($("#map-set-timerange").val());
    }
    if (mapShow.monitor.co2) {
        ChartCo2.update();
        dataMapCo2.lineAtIndex = ($("#map-set-timerange").val());
    }
    if (mapShow.monitor.noiseAvg) {
        ChartNoi.update();
        dataMapNoi.lineAtIndex = ($("#map-set-timerange").val());
    }
}