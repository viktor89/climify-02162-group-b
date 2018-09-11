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
dragViewOffset = 30;
dragOffset =  20;
drag = false;
newLocationAllowed = false;
data="";
mapData = "";
touchedCircle = -1;
touchX = 0;
touchY = 0;
circleRadius = 10;
markedCircle = -1;
numberOfPointsSet = false;
homeScreen = 1;
locationScreen = 2;
sensorScreen = 3;
// TODO: change to Linux server IP
serverIP = "http://10.16.174.45:8888/app/";
userLocID = -1;
liveLocationName = "Unknown"
liveLocationID = -1;
locationMarked = -1;
locationIDMarked = -1;
locations = [];


function assignListeners() {
    $("#btn-refresh").click(refresh);
    $("#btn-register-sensor").click(registerSensor);
    $("#btn-add-location").click(allowNewLocation);
    $("#btn-add-sensor").click(addSensor);
    $("#btn-next").click(nextStep);
    $("#btn-back").click(goBack);
}

function loadMapData(){
    screenID = 1;

    backButton = document.getElementById('btn-back')
    request={"mapID": data.MapID};
    $.ajax({
        url: serverIP + 'get-filename.php',
        data : request,
        dataType: 'text',
        type: 'post',
        // async: false,

        error: function (request, error) {
            alert(" Can't do because: loadMapData " + error);
        }

    }).done(function (data) {
        currentFileName = JSON.parse(data);

        //wait for image src to change, then set canvas and container sizes
        $("#img").load(function() {
            //sets size and listeners of canvas
            setSizes();

            //gets current location, then calculates and draws position 
            drawPosition();
            drawCurrentLocations();
        }).attr("src",serverIP + currentFileName.FileName);
    });
}


function goBack() {
    if (screenID == homeScreen) {
        signOut();
    } else {
        if (screenID == locationScreen) {
            $("#step2").hide();
            $("#step1").show();
            $("#btn-next").text("Next");
            $(".guide").hide();
            step = 1;
            // Reset input
            $("#inp-location-name").val("");
            emptyNewLocation();
        } else if (screenID == sensorScreen) {
            $("#innerContainer").show();
            $("#btn-add-sensor").text("Add sensor");
            $("#sensorForm").hide();
            $("#app-footer").show();

            // Reset input
            $("#inp-sensor-id").val("");
        }

    }
    $(".nav-buttons").show();
    $("#btn-back").text("Exit");
    screenID = homeScreen;
}

function wrongInput(input){
    input.val("");
    input.addClass("wrong-login");
    setTimeout(() => {
        input.removeClass("wrong-login"); 
    }, 2000);
}

// Taken from webapp
function signOut(){
    // Store link to api in variable
    // TODO: replace with linux server address
    var sUrl = serverIP + "api-clear-all-sessions.php";
    // Do AJAX and phase link to api
    $.get( sUrl , function( sData ){
        var jData = JSON.parse(sData); 
        if( jData.status == "signOut" ){
            window.location="index.html";
        }
    });	
}
function setSizes(){
    var img = document.getElementById("img");
    var width = img.naturalWidth;
    var height = img.naturalHeight;
    $(function(){
        $( "myCanvas" ).bind( "tap", tapHandler );

        function tapHandler( event ){
            $( event.target ).addClass( "tap" );
        }
    });
    $("#myCanvas").attr("width", width);
    $("#myCanvas").attr("height", height);
    $("#myCanvasCurrentLocation").attr("width", width);
    $("#myCanvasCurrentLocation").attr("height", height);
    $("#myCanvasLocations").attr("width", width);
    $("#myCanvasLocations").attr("height", height);
    var canvas=document.getElementById("myCanvas");  
    var ctx=canvas.getContext("2d");
    circles = [];
    canvas.addEventListener('touchstart', function(e) {
        var touch = e.touches[0];
        var parentOffset = $(this).offset();  
        touchX = touch.pageX - parentOffset.left;
        touchY = touch.pageY - parentOffset.top;  
        if (newLocationAllowed === true){
            touchedCircle = -1;

            var i;
            for(i = 0; i<circles.length; i++){
                if(intersects(circles[i])){
                    touchedCircle = i;
                    drag = true;
                    break;
                }
            }
        }
    });
    canvas.addEventListener('touchend', function(event) {
        if (newLocationAllowed === true){
            //object is not dragged anymore
            drag = false;
        }
    });
    canvas.addEventListener('click', function(event) {
        if (newLocationAllowed === true){    
            if(!numberOfPointsSet && touchedCircle === -1){
                var newCircle = new Circle(touchX, touchY);
                newCircle.draw(ctx);
                if(circles.length > 0){
                    newCircle.drawLine(ctx, circles[circles.length-1]);
                }
                circles.push(newCircle); 
                redraw();
            }                       
        }else{
            for(var i = 0; i<locations.length;i++){
                if (checkIfInsideBox(touchX, touchY,i)){
                    if (locationMarked === i){
                        locationMarked = -1;
                        locationIDMarked = -1;
                        setUserLocationName(liveLocationName);
                        if (liveLocationName == "Unknown") {
                            locationKnown(false);
                        }
                    }else{
                        locationMarked = i;
                        //MarkedLocation
                        //TODO: ADD SENSOR WITH THE IS ID: locations[i][0].LocationID
                        locationIDMarked =  locations[i][0].LocationID;
                        setUserLocationName("" + locations[i][0].LocationName);
                        locationKnown(true);
                    }
                    drawLocations();
                    return;
                }
            } 
            setUserLocationName(liveLocationName);
            locationMarked = -1;
            locationIDMarked = -1;
            drawLocations();
            locationKnown(false);
        }
    });
    canvas.addEventListener('touchmove', function(event) {
        if (newLocationAllowed === true){
            if (drag) {
                var touch = event.touches[0];
                var parentOffset = $(this).offset(); 
                touchX = touch.pageX - parentOffset.left;
                touchY = touch.pageY - parentOffset.top;
                if(touchY <=dragViewOffset+circleRadius){

                    touchY = dragViewOffset+circleRadius;
                }
                if(touchX <=circleRadius){
                    touchX = circleRadius;

                }
                circles[touchedCircle].x = touchX;
                circles[touchedCircle].y = touchY - dragViewOffset; 
                redraw();
                event.preventDefault(); 
            }
        }
    });
}   
function redraw(){
    var canvas=document.getElementById("myCanvas");  
    var ctx=canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width,canvas.height);
    var i;
    for(i = 0; i < circles.length;i++){
        circles[i].draw(ctx);
        if (i!==0){
            circles[i].drawLine(ctx, circles[i-1])
        }        
    }
    if (circles.length >2){
        circles[circles.length-1].drawLine(ctx, circles[0]);
    }

}
function intersects(circle){
    var areaX = touchX - circlesle.x;
    var areaY = touchY - circle.y;
    return areaX * areaX + areaY * areaY <= (circleRadius+dragOffset) * (circleRadius+dragOffset);
}
function showMap(){
    window.location="map.html";
}

function drawCurrentGeolocation(x, y){

    var canvas=document.getElementById("myCanvasCurrentLocation");
    var ctx=canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x,y,8,0,2*Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill(); 
    ctx.stroke();
}
function drawPosition(){
    getMyLocation(draw);
}

function refresh() {
    tempIsInsideMap = isInsideMap;
    isInsideMap = false;
    checkIfInsideMap();
    if (tempIsInsideMap){
        wait();
    }
}

function draw(position){ 
    var currentLatitude = position.coords.latitude;
    var currentLongitude = position.coords.longitude;
    hardCodeCurrentLatitude =  55.784686; //hardcoding
    hardCodeCurrentLongitude = 12.519707; // hardcoding
    var distance = calculateDistance(data.Latitude, data.Longitude, currentLatitude, currentLongitude);
    distance = distance*data.Scale;
    var angle = angleFromCoordinate(data.Latitude, data.Longitude, toRadians(currentLatitude), toRadians(currentLongitude));
    angle = (angle-1/2*Math.PI-toRadians(data.Angle));
    if(angle<0){
        angle += 2*Math.PI;
    }
    var x = distance*Math.cos(angle);
    var y = distance*Math.sin(angle);
    //Should be moved down under the if-statement
    checkIfInsideLocation(x,y);
    if(y < 500 && y >0 && x > 0 && x < 800){
        drawCurrentGeolocation(x,y);
        // if not inside (maybe for more then 5 times), clear map. 
        // call function checkIfInsideMap(), if wanting to load all geometryData first or  
        // getMyLocation(setIfInsideMap); if only to check if inside current loaded maps. 
    } else {
        $("#img").attr("src", "")
        locations = [];
        swal("No map found", "Please refresh to try again", "error");
        drawLocations();
        $("#btn-refresh").css("visibility","visible");
        return;
    }
    setTimeout(getMyLocation(draw), 3000);
}

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
function angleFromCoordinate(latStart, longStart, latCurrent, longCurrent) {

    var dLon = (longCurrent - longStart);

    var y = Math.sin(dLon) * Math.cos(latCurrent);
    var x = Math.cos(latStart) * Math.sin(latCurrent) - Math.sin(latStart)
    * Math.cos(latCurrent) * Math.cos(dLon);

    var angle = Math.atan2(y, x);

    return angle;
}


function readMapData(){
    data = {};
    request={"vcode": "yo3"};
    $.ajax({
        url: serverIP + 'getMapData.php',
        data : request,
        dataType: 'text',
        type: 'post',
        async: false,
        error: function (request, error) {
            alert(" Can't do because: readMapData " + error);
        }
    }).done(function (data) {
        data = JSON.parse(data);
    });
}
function getCurrentLocation(callback){
    var options = {desiredAccuracy:10, maxWait:20000};
    var pos = getAccurateCurrentPosition(function(position){callback(position);}, testError, options);   
}
function onError(error){
    alert("code " + error.code + " message: " + error.message);
}
function toRadians (angle) {
    angleRadians = angle*(Math.PI / 180);
    return angleRadians;
}
function toDegrees (radians) {
    angleDegrees = radians * 180 / Math.PI;
    return angleDegrees;
}
var step = 1;
function nextStep() {
    if (step == 1) {
        if (enoughPoints()){
            $("#step1").hide();
            $("#step2").show();
            $("#btn-next").text("Finish");
            newLocationAllowed = false;
            numberOfPointsSet = true;
            redraw();
             step++;
        } else{
            swal("Too few points!", "Please select at least three points", "error");
            return;
        }

    } else if (step == 2) {
        // reset guide
        if ($("#inp-location-name").val() != "") {
            savePointsInDatabase();
            goBack();
        } else {
            wrongInput($("#inp-location-name"));
        }
    } 
}
// Add sensors
function addSensor() {
    if (userLocName != "Unknown") {
        $("#innerContainer").hide();
        $(".nav-buttons").hide();
        $("#sensorForm").show();
        $("#app-footer").hide();
        screenID = sensorScreen;
        $("#btn-back").text("Back");
        //userLocName = $("#user-location").html();
        $("#add-sensor-location").html(userLocName);
    }
}

function registerSensor() {
    // Set parameter for location ID
    // to assign sensor ID to
    if (locationMarked == -1) {
        userLocID = liveLocationID;
    } else {
        userLocID = locationIDMarked;
    }

    if ($("#inp-sensor-id").val() == "") {
        wrongInput($("#inp-sensor-id"));
    } else {

        if (userLocName != "Unknown") {
            var sensorID = $("#inp-sensor-id").val();
            // Get sensor type name from sensor id
            var sensorTypeName = sensorID.split(".");

            // Post info to MariaDB
            // i.e. assign sensor to location
            request={
                "sensorID": sensorID,
                "userLocID": userLocID,
                "sensorTypeName": sensorTypeName[0]
            };

            $.ajax({
                url: serverIP + 'api-assign-sensor.php',
                data : request,
                dataType: 'text',
                type: 'post',
                async: false,

                error: function (request, error) {
                    alert(" Can't do because: registerSensor " + error);
                }

            }).done(function (data) {
                jData = JSON.parse(data);
                if (jData.status == "ok") {
                    swal("Success!", "The sensor has been assigned to your location", "success");
                    // Reset form
                    goBack();
                } else {
                    swal("Invalid ID!", "Please input a valid sensor ID", "error");
                    wrongInput($("#inp-sensor-id"));
                }
            });
        } else {
            swal("Invalid location!", "Please refresh your location", "error");
        }
    }
}

function allowNewLocation(){
    newLocationAllowed = true;
    screenID = locationScreen;
    $(".guide").show();
    $(".nav-buttons").hide();
    $("#btn-back").text("Back");
}

function Circle(x, y) {
    this.x = x;
    this.y = y;
    this.draw = function(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, circleRadius, 0, Math.PI*2);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.strokeStyle = "black"
        ctx.stroke();
    }
    this.drawLine = function(ctx, circle){
        ctx.beginPath();
        ctx.strokeStyle = "black"
        ctx.moveTo(this.x,this.y);
        ctx.lineTo(circle.x,circle.y);
        ctx.stroke();

    } 
}
function removeCircle(){
    if (markedCircle !==-1){
        circles.splice(markedCircle,1);
        markedCircle = -1;
        redraw();
    }
}
function enoughPoints(){
    if (circles.length > 2){
        return true;
    }else{
        return false;
    }

}
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
        vertx.push(locations[i][j].X);
        verty.push(locations[i][j].Y);
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


function checkIfInsideMap(){
    request={"appName": "sensorApp"};
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

function wait(){
    if (!isInsideMap){
        setTimeout(wait,100);
    } else {
        loadMapData();
    }
}

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
            $("#btn-refresh").css("visibility","hidden");
            currentMapID = mapData[i].MapID; 
            isInsideMap = true;
            data = mapData[i];
            mapKnown(true);
            break;
        }
        
        // Used for testing
        // when not in a map

        if (i===(mapData.length-1)){
            swal("No map found", "Please refresh to try again", "error");
            setUserLocationName("Unknown");
            mapKnown(false);
            locationKnown(false);
            $("#btn-refresh").css("visibility","visible");
        }
    }
    //nothing found 

}

function setUserLocationName(name) {
    $("#user-location").text(name);
    userLocName = name;
}

function mapKnown(bool) {
    if (bool) {
        $("#btn-add-location").removeClass("button-disabled");
    } else {
        $("#unknown-location-text").css("visibility", "visible");
        $("#btn-add-location").addClass("button-disabled");
    }
}

function locationKnown(bool) {
    if (bool) {
        $("#unknown-location-text").css("visibility", "hidden");
        $("#btn-add-sensor").removeClass("button-disabled");
    } else {
        $("#unknown-location-text").css("visibility", "visible");
        $("#btn-add-sensor").addClass("button-disabled");
    }
}

function getMyLocation(callback){
    var options = {enableHighAccuracy: true};
    var pos = navigator.geolocation.getCurrentPosition(function(position){callback(position);}, onError, options);    
}
function watchMyLocation(callback){
    var options = {enableHighAccuracy: true};
    var pos = navigator.geolocation.watchPosition(function(position){callback(position);}, onError, options);    
}

function calcXandY() {
    var sumX = 0;
    var sumY = 0;
    for (var i = 0; i < circles.length; i++) {
        sumX += circles[i].x;
        sumY += circles[i].y; 
    }

    // Get mean of points
    xaxis = sumX / circles.length;
    yaxis = sumY / circles.length;

    // Convert to percentages for web app
    xaxis /= 8;
    yaxis /= 5;
}

function savePointsInDatabase(){
    // Calculate x and y axis to display location in webapp
    calcXandY();

    request={
        "points": JSON.stringify(circles), 
        "mapID": currentMapID, 
        "locName": $("#inp-location-name").val(),
        "xaxis": xaxis,
        "yaxis": yaxis
    };
    $.ajax({
        url: serverIP + 'insertLocation.php',
        data : request,
        dataType: 'text',
        type: 'post',
        async: false,
        error: function (request, error) {
            alert(" Can't do because: savePointsInDatabase " + error);
        }
    }).done(function (data) {
        swal("Success!", "A new location has been added", "success");
    });
    emptyNewLocation();
    drawCurrentLocations();
}
function emptyNewLocation(){
    //empty circles
    circles = [];
    // exit draw mode
    numberOfPointsSet = false;
    newLocationAllowed = false;
    redraw();
}

function checkIfInsideLocation(x,y){
    for(var i = 0; i<locations.length; i++){
        if (checkIfInsideBox(x, y, i)){
            liveLocationName = locations[i][0].LocationName;
            liveLocationID = locations[i][0].LocationID;
            if (locationMarked == -1){
                setUserLocationName(liveLocationName);
                locationKnown(true);
            }
            userLocID = locations[i][0].LocationID;
            return;
        }
    }
    liveLocationName = "Unknown";
    if (locationMarked == -1) {
        setUserLocationName(liveLocationName);
        locationKnown(false);
    } 

} 

function testError(error) {
    alert('unavailable GPS');
}

function getAccurateCurrentPosition(geolocationSuccess, geolocationError, options) {
    var lastCheckedPosition;
    locationEventCount = 0;
    options = options || {};

    var checkLocation = function (position) {
        lastCheckedPosition = position;
        ++locationEventCount;

        if ((position.coords.accuracy <= options.desiredAccuracy) && (locationEventCount > 0)) {
            clearTimeout(timerID);
            navigator.geolocation.clearWatch(watchID);
            foundPosition(position);
        } else {

        }
    }


    var stopTrying = function () {
        navigator.geolocation.clearWatch(watchID);
        foundPosition(lastCheckedPosition);
    }


    var onError = function (error) {
        clearTimeout(timerID);
        navigator.geolocation.clearWatch(watchID);
        geolocationError(error);
    }


    var foundPosition = function (position) {
        geolocationSuccess(position);
    }


    if (!options.maxWait) options.maxWait = 10000; // Default 10 seconds
    if (!options.desiredAccuracy) options.desiredAccuracy = 20; // Default 20 meters
    if (!options.timeout) options.timeout = options.maxWait; // Default to maxWait


    options.maximumAge = 0; // Force current locations only
    options.enableHighAccuracy = true; // Force high accuracy (otherwise, why are you using this function?)


    var watchID = navigator.geolocation.watchPosition(checkLocation, onError, options);
    var timerID = setTimeout(stopTrying, options.maxWait); // Set a timeout that will abandon the location loop
}


var setIntervalSynchronous = function (func, delay) {
    var intervalFunction, timeoutId, clear;
    // Call to clear the interval.
    clear = function () {
        clearTimeout(timeoutId);
    };
    intervalFunction = function () {
        func();
        timeoutId = setTimeout(intervalFunction, delay);
    }
    // Delay start.
    timeoutId = setTimeout(intervalFunction, delay);
    // You should capture the returned function for clearing.
    return clear;
}


function drawCurrentLocations(){

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
            alert("no locations to display");
        }else {
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
        drawLocations();
    }); 
}

function drawLocations(){
    var canvas=document.getElementById("myCanvasLocations");
    var ctx=canvas.getContext("2d");
    ctx.fillStyle="#55a31d";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha=0.3;
    for(var i = 0; i<locations.length; i++){
        ctx.beginPath();
        ctx.moveTo(locations[i][0].X, locations[i][0].Y);
        for(var j = 1; j < locations[i].length; j++){
            ctx.lineTo(locations[i][j].X, locations[i][j].Y);
        }
        ctx.closePath();
        ctx.fill();
        if (locationMarked===i){
            ctx.strokeStyle = "#FF0000";
            ctx.lineWidth=5;
            ctx.stroke();
        }
    }
}
function Point(px, py) {
    this.x = px;
    this.y = py;
}
