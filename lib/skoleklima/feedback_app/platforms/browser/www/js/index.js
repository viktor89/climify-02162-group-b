/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

currentMapID = -1;
isInsideMap = false;
drag = false;
window.newLocationAllowed = false;
data="";
mapData = "";
homeScreen = 1;
locationScreen = 2;
sensorScreen = 3;
// TODO: change to Linux server IP
serverIP = "http://10.16.174.45:8888/app/"
userLocID = -1;                                                                 
locations = [];

dragViewOffset = 30;
dragOffset =  20;
drag = false;
window.newLocationAllowed = false;
window.data="";
homeScreen = 1;
formScreen = 2;

rating = {
    locID: -1,
    temp: 0, 
    humid: 0, 
    co2: 0, 
    noise: 0
};

function setUp(){
    screen = homeScreen;

    checkIfInsideMap();

    wait();

    assignListeners();

    getLiveUnit();
    getLiveData();
}

function assignListeners() {
    $("#btn-next").click(next);
    $("#btn-back").click(goBack);
    $("#btn-info").click(showInfo);
    $("#btn-send").click(sendFeedback);
    $("#btn-refresh").click(refresh);

    $(".good").click(ratedGood);
    $(".bad").click(ratedBad);
}

function showInfo () {
    // Display help information
    swal("What do the icons mean?","Sun: temperature \n Drop: humidity \n Cloud: CO2 (air quality) \n Ear: noise", "info");
}
// Toggle between questionnaire and main screen
function goBack() {
    if (screen == homeScreen) {
        // Not used, as user login is not required
    } else {
        if (screen == formScreen) {
            $("#innerContainer").show();

            screen = homeScreen;

            if (formStep == 1) {
                $("#feedback-p1").hide();
            } else if (formStep == 2) {
                $("#feedback-p2").hide();
            } else if (formStep == 3) {
                $("#feedback-p3").hide();
            } else if (formStep == 4) {
                $("#feedback-p4").hide();
            }

            formStep = 0;

            $("#btn-next").text("Questionnaire");
            $("#btn-next").show();
            $("#btn-back").hide();
            $("#btn-info").show();
        }
    }
}


function showClimateInfo(){
    window.location="climateInfo.html";
}

// Check if user is still in a map
function refresh() {
    var tempIsInsideMap = isInsideMap;
    isInsideMap = false;
    checkIfInsideMap();
    if (tempIsInsideMap) {
        wait();
    }
}

// Toggle between steps of questionnaire
var formStep = 0;
function next() {
    if (screen == homeScreen) {
        // TODO: load questionnaire from DB

        $("#innerContainer").hide();
        $("#feedback-p1").show();
        $("#btn-next").text("Next");
        $("#btn-back").show();
        $("#btn-info").hide();
        screen = formScreen;
        formStep++;
    } else if (screen == formScreen) {
        if (formStep == 1) {
            $("#feedback-p1").hide();
            $("#feedback-p2").show();
            formStep++;
        } else if (formStep == 2) {
            $("#feedback-p2").hide();
            $("#feedback-p3").show();

            $("#btn-next").text("Submit");

            formStep++;
        } else if (formStep == 3) {
            $("#feedback-p3").hide();
            $("#feedback-p4").show();
            $("#btn-next").hide();
        }
    }
}

// User rated a parameter good
// or reset
function ratedGood() {
    // Reset
    if ($(this).hasClass("good-selected")) {
        $(this).removeClass("good-selected");

        if ($(this).hasClass("temp")) {
            rating["temp"] = 0;
        } else if ($(this).hasClass("humid")) {
            rating["humid"] = 0;
        } else if ($(this).hasClass("co2")) {
            rating["co2"] = 0;
        } else if ($(this).hasClass("noise")) {
            rating["noise"] = 0;
        }
    } else {
        $(this).addClass("good-selected");

        if ($(this).hasClass("temp")) {
            if (rating["temp"] < 0) {
                $("#btn-bad-temp").removeClass("bad-selected");
            }
            rating["temp"] = 1;
        } else if ($(this).hasClass("humid")) {
            if (rating["humid"] < 0) {
                $("#btn-bad-humid").removeClass("bad-selected");
            }
            rating["humid"] = 1;
        } else if ($(this).hasClass("co2")) {
            if (rating["co2"] < 0) {
                $("#btn-bad-co2").removeClass("bad-selected");
            }
            rating["co2"] = 1;
        } else if ($(this).hasClass("noise")) {
            if (rating["noise"] < 0) {
                $("#btn-bad-noise").removeClass("bad-selected");
            }
            rating["noise"] = 1;
        }
    }
}

// User rated a parameter bad
// or reset
function ratedBad() {
    // Reset
    if ($(this).hasClass("bad-selected")) {
        $(this).removeClass("bad-selected");

        if ($(this).hasClass("temp")) {
            rating["temp"] = 0;
        } else if ($(this).hasClass("humid")) {
            rating["humid"] = 0;
        } else if ($(this).hasClass("co2")) {
            rating["co2"] = 0;
        } else if ($(this).hasClass("noise")) {
            rating["noise"] = 0;
        }
    } else {
        $(this).addClass("bad-selected");

        if ($(this).hasClass("temp")) {
            showDialog("temp");
            if (rating["temp"] == 1) {
                $("#btn-good-temp").removeClass("good-selected");
            }
        } else if ($(this).hasClass("humid")) {
            showDialog("humid");
            if (rating["humid"] == 1) {
                $("#btn-good-humid").removeClass("good-selected");
            }
        } else if ($(this).hasClass("co2")) {
            if (rating["co2"] == 1) {
                $("#btn-good-co2").removeClass("good-selected");
            }
            rating["co2"] = -1;
        } else if ($(this).hasClass("noise")) {
            if (rating["noise"] == 1) {
                $("#btn-good-noise").removeClass("good-selected");
            }
            rating["noise"] = -1;
        }
    }
}

// Prompt user for reason for bad rating
// This is relevant for temperature and humidity
function showDialog(parameter) {
    opt1 = "";
    opt2 = "";
    if (parameter == "temp") {
        opt1 = "Too hot";
        opt2 = "Too cold";
    } else if (parameter == "humid") {
        opt1 = "Too humid";
        opt2 = "Too dry";
    }

    // Prompt user to specify reason
    swal("Reason for rating","What do you dislike about the climate?", {
        closeOnClickOutside: false,
        buttons: {
            cancel: false,
            opt1: {
                text: opt1,
                value: false,
            },
            opt2: {
                text: opt2,
                value: true,
            },
        }
    }).then((value) => {
        if (value) {
            rating[parameter] = -2;
        } else {
            rating[parameter] = -1;
        }
    });
}

// Send feedback to database
function sendFeedback() {
    rating["locID"] = userLocID;

    if (userLocID != -1) {

        if (rating["temp"] == 0 && rating["humid"] == 0 && rating["co2"] == 0 && rating["noise"] == 0) {
            swal("No parameters rated","Please rate at least one parameter", "error");
        }

        $.ajax({
            url: serverIP + 'api-send-feedback.php',
            data : rating,
            dataType: 'text',
            type: 'post',
            async: false,

            error: function (request, error) {
                alert(" Can't do because: sendFeedback " + error);
            }
        }).done(function (data) {
            var jData = JSON.parse(data);
            if (jData.status == "ok") {
                swal("Thanks!", "Your feedback has been sent!", "success");
            } else {
                alert(" Can't do because: sendFeedback status" + "error");
            }
        });

        resetRating("temp");
        resetRating("humid");
        resetRating("co2");
        resetRating("noise");
    }
}

function resetRating(param) {
    if (rating[param] == 1) {
        $("#btn-good-"+param).removeClass("good-selected");

    } else if (rating[param] < 0) {
        $("#btn-bad-"+param).removeClass("bad-selected");
    }
    rating[param] = 0;
}

// Calculate x and y on map
function calcPosition(position){
    var currentLatitude = position.coords.latitude;
    var currentLongitude = position.coords.longitude;
    var distance = calculateDistance(data.Latitude, data.Longitude, currentLatitude, currentLongitude);
    distance = distance*data.Scale;
    var angle = angleFromCoordinate(data.Latitude, data.Longitude, toRadians(currentLatitude), toRadians(currentLongitude));
    angle = (angle-1/2*Math.PI-toRadians(data.Angle));
    if(angle<0){
        angle += 2*Math.PI;
    }
    var x = distance*Math.cos(angle);
    var y = distance*Math.sin(angle);

    if(distance*Math.sin(angle) < 500 && distance*Math.cos(angle) < 800){
        checkIfInsideLocation(x,y);
    }      
}


// Check if user location is inside a location
function checkIfInsideLocation(x,y){
    for(var i = 0; i<locations.length; i++){
        if (checkIfInsideBox(x, y, i)){
            $("#user-location").text("" + locations[i][0].LocationName);
            userLocID = locations[i][0].LocationID;
            if ($("#btn-send").hasClass("button-disabled")) {
                $("#btn-send").removeClass("button-disabled");
            }
            return;
        }
    }
    $("#user-location").text("Unknown");
    if (!$("#btn-send").hasClass("button-disabled")) {
        $("#btn-send").addClass("button-disabled");
    }
}

// Check if a point is inside a box (used for user location)
function checkIfInsideBox(x,y,i){
    var vertx;
    var verty;
    var testx = x;
    var testy = y;
    var i, j,k, l= 0;
    var c = false;
    vertx = [];
    verty = [];
    for(var j = 0; j<locations[i].length;j++){
        vertx.push(locations[i][j].XAxis);
        verty.push(locations[i][j].YAxis);
    }
    var nvert = vertx.length;
    for (k = 0, l = nvert-1; k < nvert; l = k++) {        
        if  (((verty[k]>testy) !== (verty[l]>testy)) &&
             (testx < (vertx[l]-vertx[k]) * (testy-verty[k]) / (verty[l]-verty[k]) + vertx[k])) {
            c = !c;
        }
    }
    return c;
}

// Alternative option for getting user location
function getCurrentLocation(callback){

    var options = {desiredAccuracy:10, maxWait:10000}; 
    var pos = getAccurateCurrentPosition(function(position){callback(position);}, testError, options);   
}

// Check if user is inside a map
function checkIfInsideMap(){
    request={"appName": "feedbackApp"};
    $.ajax({ 
        url: serverIP + 'getMultipleMapData.php',
        data : request,
        dataType: 'text',
        type: 'post',
        async: false,

        error: function (request, error) {
            alert(" Can't do because: checkIfInsideMap " + error);
        }

    }).done(function (data) {
        mapData = JSON.parse(data);
        getMyLocation(setIfInsideMap);
    });
}

// Find user location
function getMyLocation(callback){
    var options = {enableHighAccuracy: true};
    var pos = navigator.geolocation.getCurrentPosition(function(position){callback(position);}, onError, options);    
}
function onError(error){
    alert("code " + error.code + " message: " + error.message);
}

function wait(){
    if (!isInsideMap){
        setTimeout(wait,100);
    } else {
        findMapLocations();
        getMyLocation(calcPosition);
    }
}

// Find all locations in all maps
function findMapLocations(){

    request={"mapID": data.MapID};
    $.ajax({
        url: serverIP + 'api-get-points.php',
        data : request,
        dataType: 'text',
        type: 'post',
        async: false,

        error: function (request, error) {
            alert(" Can't do because: drawCurrentLocationError " + error);
        }
    }).done(function (data) {
        var locationsData = JSON.parse(data);
        if(locationsData.length == 0){
            //no locations
        }
        else {
            locations = [];
            tempLocation = [];
            tempID = locationsData[0].LocationID;
            for(var i = 0; i<locationsData.length;i++){
                if (locationsData[i].LocationID != tempID ){
                    locations.push(tempLocation);
                    tempID = locationsData[i].LocationID;
                    tempLocation = [];
                }
                tempLocation.push(locationsData[i]);

                if (i == locationsData.length-1){
                    locations.push(tempLocation);
                }

            }
        }
    }); 
}
// Set map of user location
function setIfInsideMap(position){
    var currentLatitude = position.coords.latitude;
    var currentLongitude = position.coords.longitude;
    var i;
    for(i = 0; i<mapData.length; i++){
        var distance = calculateDistance(mapData[i].Latitude, mapData[i].Longitude, currentLatitude, currentLongitude);
        distance = distance*mapData[i].Scale;
        var angle = angleFromCoordinate(mapData[i].Latitude, mapData[i].Longitude, toRadians(currentLatitude), toRadians(currentLongitude));
        angle = (angle-1/2*Math.PI-toRadians(mapData[i].Angle));
        if(angle<0){
            angle += 2*Math.PI;
        }
        var x = distance*Math.cos(angle);
        var y = distance*Math.sin(angle);

        if(y < 500 && y >0 && x > 0 && x < 800){
            currentMapID = mapData[i].MapID; 
            isInsideMap = true;
            data = mapData[i];
            break;
        }

        if (i===(mapData.length-1)){
            currentMapID =  mapData[i].MapID;
            isInsideMap = true;
            data = mapData[i];
            break;
        }

        if (i===(mapData.length-1)){

            $("#user-location").text("Unknown");
            $("#btn-send").addClass("button-disabled");
            getMyLocation(setIfInsideMap);
        }
    }
    //nothing found 

}

// Retrieve live data from InfluxDB
function getLiveUnit(){
    var sUrl = serverIP + "api-get-sensor-units.php?LocationID=" + userLocID; 
    $.ajax({
        url: sUrl,
        //type: 'post',
        async: false,
        success: function (sData) {
            unitData = JSON.parse(sData); 
        },
        error: function (request, error) {
            alert(" Can't do because: getLiveData " + error);
        }
    });
}
function getLiveData(){
    var sUrl = serverIP + "api-get-sensor-on-school.php?LocationID=" + userLocID; 

    $.ajax({
        url: sUrl,
        //type: 'post',
        async: false,
        success: function (sData) {
            var jData = JSON.parse(sData); 

            //Update sensor lists
            dates = [];
            temperature = 0;
            humidity = 0;
            co2 = 0;
            noise = 0;

            var noiseCounter = 0;
            var temperatureCounter = 0;
            var co2Counter = 0;
            var humidityCounter = 0;
            var lastTemperature;
            var lastNoise; 
            var lastCo2;
            var lastHumidity; 
            for( var i = 0 ; i < jData.length ; i++ ){
                for (var j = 0; j<unitData[i].length; j++){
                    switch (unitData[i][j].SensorAttributeName) {
                        case "temperature":
                            tempUnit = unitData[i][j].SensorUnitName;
                            break;
                        case "CO2":
                            CO2Unit = unitData[i][j].SensorUnitName;
                            break;
                        case "humidity":
                            humidityUnit = unitData[i][j].SensorUnitName;
                            break;
                        case "noise":
                            noiseUnit = unitData[i][j].SensorUnitName;
                            break;
                    }
                }

                //TODO: Sensortype instead of checking if null
                //sum all parameters 
                if(jData[i][0].last_Temperature!=null){
                    lastTemperature = parseInt(jData[i][0].last_Temperature);
                    switch (tempUnit) {
                        case "celsius":
                            break;
                        case "fahrenheit":
                            lastTemperature = (lastTemperature - 32)*5/9
                            break;
                        case "kelvin":
                            lastTemperature = (lastTemperature - 273.15)
                            break;
                    }
                    temperature+= lastTemperature; 
                    temperatureCounter++;
                }
                if(jData[i][0].last_NoiseAvg!=null){
                    noise+=parseInt(jData[i][0].last_NoiseAvg);
                    noiseCounter++;
                }
                if(jData[i][0].last_Humidity!=null){
                    humidity +=parseInt(jData[i][0].last_Humidity);
                    humidityCounter++;
                }
                if(jData[i][0].last_CO2!=null){
                    co2 +=parseInt(jData[i][0].last_CO2);
                    co2Counter++;
                }

            } 
            //calculate mean

            temperature /= temperatureCounter;
            noise /= noiseCounter;
            humidity /= humidityCounter;
            co2 /= co2Counter;

            // Change data on GUI
            if (!isNaN(humidity)) {
                $("#info-humid-level").text(humidity + " %");
            }
            if (!isNaN(temperature)) {
                $("#info-temp-level").text(temperature + " ºC");
            }
            if (!isNaN(co2)) {
                $("#info-co2-level").text(co2 + " ppm");
            }
            if (!isNaN(noise)) {
                $("#info-noise-level").text(noise + " dB");
            }    
        },
        error: function (request, error) {
            alert(" Can't do because: getLiveData " + error);
        }
    });
}

// Calculate angle between origo and user's location
function angleFromCoordinate(latStart, longStart, latCurrent, longCurrent) {

    var dLon = (longCurrent - longStart);

    var y = Math.sin(dLon) * Math.cos(latCurrent);
    var x = Math.cos(latStart) * Math.sin(latCurrent) - Math.sin(latStart)
    * Math.cos(latCurrent) * Math.cos(dLon);

    var angle = Math.atan2(y, x);

    return angle;
}

// Calculate distance between origo and user's location
function calculateDistance(latStart,longStart, latCurrent, longCurrent){

    latStart = toDegrees(latStart);
    longStart = toDegrees(longStart);
    var R = 6371e3; // metres
    var phi1 = toRadians(latStart);
    var phi2 = toRadians(latCurrent);
    var deltaPhi = toRadians((latCurrent-latStart));
    var deltaLambda = toRadians(longCurrent-longStart);

    var a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var distance = R * c;    
    return distance;    
}

function toRadians (angle) {

    angleRadians = angle*(Math.PI / 180);
    return angleRadians;
}

function toDegrees (radians) {
    angleDegrees = radians * 180 / Math.PI;
    return angleDegrees;
}