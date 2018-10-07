/**********************************/
//		Main JS After login
/**********************************/

// Variables
var showSchool = "";
var showChangeOwnPass = false;
var showSchoolID = currentUserSchool;
var showMapVal;
var showDataInfo = false;
var showInfoDivecesMap = false;
var showDevicesOnDevices = false;
var runChartFirstTime = true;
var currentDate = moment().format("YYYY-MM-DD");
var disableMapUp;
var disableMapDel;
var deviceHasBeenDragged = false;
var devicePositionStart = 0;
var mapAutoPlay = false;
var highlightDeviceFromMap = false;
var selectedDeviceFromMap = "";
var date = new Date();
var utcHour = date.getUTCHours();
var localHour = date.getHours();
var hourDiff = utcHour-localHour;
var fetchingDataGraph = false;
var updateMapGraphLineTime = 800;
var startNumberMessageUser = 0;
var startNumberMessageAdmin = 0;
var hideOwnUserPass = true;
var getLiveDataForMapDay;
var getLiveDataForMap;
var schoolID = 0;
var enableMapMonitorSettings = true;
var clickSelectorLiveChart = true;
var downloadDataDisable = true;
var alreadyCreated = false;
var hasUnactivatedUsers = false;
window.nav="";
locationIDs = [];
locationXAxis = [];
locationYAxis = [];
locationName = [];
dates = [];
temperature = [];
humidity = [];
co2 = [];
noise = [];
firstChange = true;
isStart=1;

$(document).ready(function() {

	if (currentUserRole == 1 || currentUserRole == 15){

		showSchool="";

		findInstsFromInput();




        //List buildings associated with users
        getBuildingList();
        //Creates other user text 
        removeunactivated();

    } else {



    	showSchool = currentUserSchoolName;
    	showSchoolID = currentUserSchool;

    	if (currentUserRole == 2){
    		listAllPermissions();
    	}
    	setOtherUsersText();
        //Since you already know school - load maps,locations and messages

        graphSelectMap = $(".chart-select-map");
        graphSelectLocation = $(".chart-select-location");


        //Create list of maps 
        createMapList();


        loadMessages();


        //Hide option of writing news if not build man. og project man.
        $(".list-communication-type").hide();


        //if ( currentUserRole == "1" || currentUserRole == "15" || currentUserRole == "2" || currentUserRole == "3" || currentUserRole == "4" ) {
        	if (currentUserRole!=1){
        		loadMaps();	


        	}


        	if (currentUserRole == 2){
        		listAllPermissions();
        	}


        }



    //dateRangePicker1();
    //dateRangePicker2();


    if (showSchool == "") {
    	$("#create-message-from-user").addClass("button-disabled");
    	$(".load-more-message-user, .load-more-message-admin").hide();
    	$(".load-more-message-info-no-school").show();
    }
})


function findInstsFromInput(){

	$("#buildingResults").empty();


	$.get("api/api-get-schools-names.php", function( sData ){

		var jData = JSON.parse(sData); 

		muns = [];
		$.each(jData, function(key,valueObj){
			if (valueObj !== null && valueObj !=="") {
                //we need MunID and MunName for possible creation of new building within the Municipality UPDATE: No longer the case - might be of use anyways tho
                //var jsonValue = JSON.stringify({"InstName":valueObj.InstName,"MunID":valueObj.MunID,"MunName":valueObj.MunName});
                $(".list-schools-other-users").append('<option id="'+ valueObj.InstID + '" value=' + valueObj.InstName + '>' + valueObj.InstName + '</option>');


                $("#buildingResults").append('<option id="' + valueObj.InstID +'" value="' + valueObj.InstName + '"></option>');

            }
        });
	});
}

function removeunactivated(){
	$(".unactivated-users-list").hide();
}

$("#inp-building-name").on("input", function(e) {


	saveBuildingButton = true;
	deleteBuildingButton = false;
    //$("#btn-save-building").text("Save").removeClass("button-disabled");
    $("#btn-save-building").attr('class', " ");
    $("#btn-delete-building").addClass("button-disabled");
    $("#btn-update-building").addClass("button-disabled");
    $(".building-detail-h4").text("Choose institution");


    var val = $(this).val();
    if(val === ""){
    	$("#btn-save-building").addClass("button-disabled");
    	return;}
    //You could use this to limit results
    //if(val.length < 3) return;


    dataList = $("#buildingResults");
    var options = document.getElementById("buildingResults").options;

    for (var i=0; i<options.length; i++){


    	if ((options[i].value).localeCompare(val)==0){
    		itMatches = options[i].id;


    		saveBuildingButton = false;
    		deleteBuildingButton = true;
    		$("#btn-save-building").addClass("button-disabled");

            //$("#btn-delete-building").removeClass("button-disabled");

            $("#btn-delete-building").attr('class', " ");
            $("#btn-update-building").attr('class', " ");

        }
    }
}); 

//setOtherUsersText();

function setOtherUsersText(){
    //Alerts user if there are limited users they need to activate.

    if(currentUserRole == 2|| currentUserRole == 3){
        //check how many unactivated limited users have requested
        var sUrl = "api/api-get-user-activate.php?fAY2YfpdKvR="+sender+"&userID="+currentUserID;

        $.get(sUrl, function( sData ){
        	var jData = JSON.parse(sData); 

        	if(jData.length != 0){
        		var otherUserString = "Other users (" + jData.length + ")";
        		document.getElementById("menu-link-text-other-users").innerHTML = otherUserString;
        		document.getElementById("menu-link-text-other-users").style.color = '#d00';
        		hasUnactivatedUsers = true;
        	}
        	listAllUsers();
        });
    } else {
    	resetOtherUserText();
    	hasUnactivatedUsers = false;
    }

}

function resetOtherUserText(){
	document.getElementById("menu-link-text-other-users").innerHTML = "Other users";
	document.getElementById("menu-link-text-other-users").style.color = '#000000';
	removeunactivated();
}


var reP = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}$/);

// Advices to users
var liveAdvices = {
	tem1: "Too cold, close windows and put the thermostat on 4.",
	tem2: "Ok temperature, but a little chilly.",
	tem3: "A little too hot, consider turning the thermostat down.",
	tem4: "Too hot, put the thermostat on 3.",
	hum1: "The air is a little dry.",
	hum2: "The air is a little dry.",
	hum3: "The air is a little moist, consider opening windows.",
	hum4: "The air is very moist, open the windows.",
	co21: "Ventilation is necesary. When the room is in use, open window slightly and turn off the radiator. During break: systematic ventilation.",
	co22: "Ventilation is strictly needed.",
	noi1: "Sound level is moderately too loud.",
	noi2: "Sound level is much too high."
};

// Subject suggestions - communication
var subSugestions = {
	tem: "Fx. It is too warm when the sun is shining, turn down the thermostat and open more windows.",
	noi: "Fx. the accoustics in the room is bad and it quickly gets too loud in the room",
	air: "Fx. We opened the windows, but the air quality, quickly became bad again.",
	system: "Feedback and points for improvements to " + window.location.href,
	other: "All good proposals, feedback, and descriptions that revolves around indoor climate and energy."
}

// Startpage
if (window.matchMedia('(min-width: 800px)').matches) {
    if ( currentUserRole == 1 ) { // Administrator
    	var userStartPage = "data-map";
    } else if ( currentUserRole == 15 ) { // Systemobservatør
    	var userStartPage = "data-map";
    } else if ( currentUserRole == 2 ) { // Lokal admin
    	var userStartPage = "data-map";
    } else if ( currentUserRole == 3 ) { // Lærer
    	var userStartPage = "data-map";
    } else if ( currentUserRole == 4 ) { // Elev
    	var userStartPage = "data-map";
    } else {
    	var userStartPage = "data";
    }
} else {
	var userStartPage = "data";
}

// Accept cookies
if ($.cookie("cookie-accept") !== "true" ||  $.cookie("cookie-accept") == null) { 
	$(".cookie-info-wrapper").css("display", "flex").addClass("flex");
}

$('#btn-accept-cookie').click(function () {
	$.cookie("cookie-accept", true);
	$(".cookie-info-wrapper").hide();
});

function dealyDone() {
	liveStreemOnOff();
}

if (siteOnline) {
	window.location = "/#/" + userStartPage;
}
$(".view-"+userStartPage).show();
$(".map-info-no-school").show();
$(".map-frame").hide();
$("#btn-save-devices-placement").addClass("button-disabled");
ga('set', 'page', '/' + changeHeaderName(userStartPage) + '/');
ga('send', 'pageview');

// Smooth scroll
$('.ico-go-to-top').click(function(){
	$("html, body").animate({ 
		scrollTop: 0 }, 500);
	return false;
});

// Change view name in the header 
function changeHeaderName(nav) {
	window.nav=nav;
	switch (nav) {
		case "devices":
		nav = "Manage Building";
		break;
		case "data-map":
		nav = "Sensors";
		break;
		case "data":
		nav = "Graphs";
		break;
		case "communication":
		nav = "Logbook";
		break;
		case "other-users":
		nav = "Other Users";
		break;
		case "own-user":
		nav = "Your profile";
		break;
		case "system-settings":
		nav = "Settings";
		break;
		default:
		nav = "Climate monitoring";
		break;
	}
	$(".view-name-header-wrapper").text(nav);
	return nav;
}

if (window.matchMedia('(max-width: 800px)').matches) {
	changeHeaderName(userStartPage);
	var viewAtTop = false;
	$(window).scroll(function () {
		var $this = $(this)
		var $element = $(".go-to-top");
		if ($this.scrollTop() > 200) {
			if (viewAtTop == false) {
				$element.css("bottom", "0px");
				viewAtTop = true;
			}
		} else {
			if (viewAtTop == true) {
				$element.css("bottom", "-50px");
				viewAtTop = false;
			}
		}
	});
}



// Administate locations / buildings
if (currentUserRole == "1") {

    // Test influx connection
    var sUrl = "api/api-get-influx-info.php"
    $.post(sUrl, {
    	fAY2YfpdKvR: sender
    }, function (sData) {
    	var jData = JSON.parse(sData); 
    	if (jData.status == "ok") {
    		$(".status-ok").show();
    	} else {
    		$(".status-error").show();
    	}
    });
    // Get current company information for admin display
    $(".company-contant-info-wrapper").empty();
    var sUrl = "api/api-get-company-info.php"
    $.post(sUrl, {
    	fAY2YfpdKvR: sender
    }, function (sData) {
    	var jData = JSON.parse(sData);
    	if (jData.status == "ok") {
    		var temp = '<div class="company-info-wrapper-left">\
    		<h4>Contact information</h4>\
    		<p>'+jData.firstName+' '+jData.lastName+'</p>\
    		<p>'+jData.email+'</p>\
    		<p>'+jData.phone1+'</p>\
    		<p>'+jData.phone2+'</p>\
    		</div >\
    		<div class="company-info-wrapper-right">\
    		<h4>Address</h4>\
    		<p>'+jData.company+'</p>\
    		<p>'+jData.address1+'</p>\
    		<p>'+jData.address2+'</p>\
    		<p>'+jData.zip+' '+jData.city+'</p>\
    		</div>\
    		';
    		$(".company-contant-info-wrapper").append(temp);
    	}
    });



    // List buildings associated with user

    function getBuildingList() {
    	var sUrl = "api/api-get-buildings.php"
    	$.post(sUrl, {
    		fAY2YfpdKvR: sender,
    		userID: currentUserID,
    	}, function (sData) {
    		var jData = JSON.parse(sData); 
    		$("#building-list-wapper").empty();


    		var temp = '<div class="building-single" data-building-list-id="{{buildingID}}"\
    		data-building-list-name="{{buildingName}}"\
    		data-building-list-decription="{{buildingDecription}}"\
    		data-building-list-weather="{{WeatherLocationID}}">\
    		<i class="link ico-edit-building fa fa-pencil-square-o" aria-hidden="true"></i>\
    		<p>{{buildingNameShow}}</p>\
    		</div>';
    		for (var i = 0; i < jData.length; i++) {
                var template1 = temp; // Phase jData to variable by order
                template1 = template1.replace("{{buildingID}}", jData[i].InstID);
                template1 = template1.replace("{{buildingName}}", jData[i].InstName);
                template1 = template1.replace("{{buildingNameShow}}", jData[i].InstName);
                template1 = template1.replace("{{buildingDecription}}", jData[i].InstDescription);
                $("#building-list-wapper").append(template1);	
            }
        });
    }



    var showBuildigDetail = false;
    var saveBuildingButton = false;
    var deleteBuildingButton = false;

    // Show Manage Buildings
    $(document).on("click", "#btn-create-new-building-show", function () {
    	saveBuildingButton = false;
    	deleteBuildingButton = false;
    	$("#btn-save-building").text("Save").addClass("button-disabled");
    	$("#btn-delete-building").addClass("button-disabled");
    	$("#btn-update-building").addClass("button-disabled");
    	clearBuildingDetails();
    	if (showBuildigDetail) {
    		$("#btn-create-new-building-show").text("Manage Buildings")
    		$(".building-detail-wapper").slideUp();
    		showBuildigDetail = false;
    	} else {
    		$("#btn-create-new-building-show").text("Close building detail");
    		$(".building-detail-wapper").slideDown();
    		showBuildigDetail = true;
    	}		
    })

    function clearBuildingDetails() {
    	$(".building-detail-wapper").attr("data-selected-building-id", "");
    	$("#inp-building-name, #inp-building-decription").val("");
    	$(".building-detail-h4").text("Choose institution");
    }

    // Activete save/update button bulding

    /*
    $('#inp-building-name, #inp-building-decription').on('input', function () {
        enableBuildingSaveBtn();
    });
    */
    function enableBuildingSaveBtn() {
    	if (saveBuildingButton == false) {
    		saveBuildingButton = true;
    		$("#btn-save-building").text("Save").removeClass("button-disabled");
    	}
    }

    // Edit building
    $(document).on("click", ".ico-edit-building", function() {
        //moved to top of document when input string matches already created institution
    })

    // Save/Update building
    $(document).on("click", "#btn-update-building", function(){


    	var thisBuildingId = itMatches;
    	if (thisBuildingId) {

    		var sUrl = "api/api-update-building.php";
    		$.post(sUrl, {
    			fAY2YfpdKvR: sender,
    			id: thisBuildingId,
    			name: $("#inp-building-name").val(),
    			decription: $("#inp-building-decription").val(),
    		}, function (data) {
    			var jData = JSON.parse(data);
    			if (jData.status == "ok") {
    				swal("", "New building has been updated", "success");
    				getBuildingList();
    				saveBuildingButton = false;
    				deleteBuildingButton = false;
    				$("#btn-save-building").text("Save").addClass("button-disabled");
    				$("#btn-delete-building").addClass("button-disabled");
    				clearBuildingDetails();
    				$("#btn-create-new-building-show").text("Manage Buildings")
    				$(".building-detail-wapper").slideUp();
    				showBuildigDetail = false;
    			} else {
    				swal("", "Missing information!", "error");
    				$("#inp-building-name").addClass("wrong-login")
    				setTimeout(() => {
    					$("#inp-building-name").removeClass("wrong-login")
    				}, 2000);
    			}
    		});


    	}

    });

    $(document).on("click", "#btn-save-building", function(){




    	var sUrl = "api/api-create-building.php";
    	$.post(sUrl, {
    		fAY2YfpdKvR: sender,
    		name: $("#inp-building-name").val(),
    		decription: $("#inp-building-decription").val(),
    	}, function (data) {
    		var jData = JSON.parse(data);
    		if (jData.status == "ok") {
    			swal("", "New building has been created", "success");
    			getBuildingList();
    			saveBuildingButton = false;
    			deleteBuildingButton = false;
    			$("#btn-save-building").text("Save").addClass("button-disabled");
    			$("#btn-delete-building").addClass("button-disabled");
    			clearBuildingDetails();
    			$("#btn-create-new-building-show").text("Manage Buildings")
    			$(".building-detail-wapper").slideUp();
    			showBuildigDetail = false;
                findInstsFromInput(); //update institutions
            } else {
            	swal("", "Missing information!", "error");
            	$("#inp-building-name").addClass("wrong-login")
            	setTimeout(() => {
            		$("#inp-building-name").removeClass("wrong-login")
            	}, 2000);
            }
        });


    });

    // Delete building

    $(document).on("click", "#btn-delete-building", function () {
    	var selectedBuildingID = itMatches;
    	if (deleteBuildingButton) {
    		swal({
    			title: "",
    			text: 'are you sure you want to delete this building?',
    			type: "warning",
    			showCancelButton: true,
    			confirmButtonColor: "#DD6B55",
    			confirmButtonText: "Yes",
    			closeOnConfirm: true
    		},
                 // If warning accepted do...
                 function () {
                 	requestDeleBuilding(selectedBuildingID);
                 });
    		$(".cancel").html("No");
    	}
    });

    function requestDeleBuilding(buildingID) {

    	var sUrl = "api/api-delete-building.php"
    	$.post(sUrl, {
    		fAY2YfpdKvR: sender,
    		buildingID: buildingID
    	}, function (sData) {
    		var jData = JSON.parse(sData);
    		if (jData.status == "ok" ) {
    			$("#btn-create-new-building-show").text("Manage Buildings")
    			$(".building-detail-wapper").slideUp();
    			showBuildigDetail = false;
    			clearBuildingDetails();
    			getBuildingList();
                findInstsFromInput(); //update institutions
            }
        });

    }
}



$("#inp-set-system-user, #inp-set-system-pass").click(function(){
	$("#inp-set-system-user, #inp-set-system-pass").removeClass("wrong-login");
});

// Set new own password 
$(".change-own-pass-click").click(function(){
	showChangePassword();
});

$("#btn-update-own-user").click(function(){
	requestUpdateOwnUser();
});

$(".user-info-input input").click(function(){
	$(".user-info-input input").removeClass("wrong-login");
	$(".msg-own-user-type-current-pass").hide();
});

// Hide/show own user password
$(document).on("click", ".ico-hide-show-own-user-pass", function() {
	if (hideOwnUserPass == true) {
		$(".ico-hide-own-user-pass").hide();
		$(".ico-show-own-user-pass").show();
		$("#inp-onw-user-new-pass, #inp-onw-user-new-pass-repeat").attr('type','text');
		hideOwnUserPass = false;
	} else {
		$(".ico-hide-own-user-pass").show();
		$(".ico-show-own-user-pass").hide();
		$("#inp-onw-user-new-pass, #inp-onw-user-new-pass-repeat").attr('type','password');
		hideOwnUserPass = true;
	}
});



$(document).on('change', '.chart-select-map', function() { 


    //One should be able to compare locations at this point
    $("#btn-get-compare-data").removeClass("button-disabled");
    disableCompareBtn = false;


    MapID=$(this).find('option:selected').attr('value');

    createLocationList(MapID);


    if (firstChange == false){
    	graphSelectLocation.find('option').not(':first').remove();
    	$("#compare-devices-list").empty();
        //first = true; //so next chosen map standLoc won't be removed
    }

    else {
    	firstChange = false;
    }



    if ($(this).attr('id')!="mapLogbook"){
    	showWarningNoSchoolGraph2();
    	clearCompareChartData();
    	clearCompareGraph();
    }


});



$(document).on('change', '.chart-select-location', function() { 
    //Now you can write messages!
    $("#create-message-from-user").removeClass("button-disabled");
    
    showSchoolStatus();
    
    
    if ($(this).attr('id')!="comuSelect"){
    	showWarningNoSchool();
    	getGraphData();
    }
});


// Others users
/*
$('#schoolOptions').val('trigger');
$('#schoolOptions').trigger('change'); //trigger change
*/
$(document).on('change', '.list-schools-other-users', function() { //hereyo


	if (firstChange == false){
		$(".chart-select-map").find('option').not(':first').remove();
		$(".chart-select-location").find('option').not(':first').remove();
		$("#compare-devices-list").empty();
	}

	showSchool = $(this).find('option:selected').attr('value');
	showSchoolID = $(this).find('option:selected').attr('id');


	if ( showSchool == "" ) {
		$(".map-settings-show-info-live-start, .map-settings-show-info-live").addClass("mapLiveInfo");
		endGetLiveDataForMap();
		mapShow.live = false;
		enableMapMonitorSettings = true;
		$("#btn-map-show-live-data").text("Start livestream")
		$('.map-show-monitor').attr('disabled', false);
		$("#create-message-from-user").addClass("button-disabled");
		$(".load-more-message-user, .load-more-message-admin").hide();
		$(".load-more-message-info-no-school").show();
		setUpDatePickerMap();
	}
	if ( currentUserRole == "1" ) {
		$(".create-other-user-school-info").text("Profil for: "+showSchool);
	}
	if ( showSchool !== "" ) {
		$(".load-more-message-info-no-school").hide();
		$(".load-more-message-user, .load-more-message-admin").show();
		loadMessages();
	}
	if (mapShow.live == true) {
		$('.data-map-charts-content-live').remove();
		$("#gettingLiveDataMapDay").show();
	}
	$(".list-schools-other-users").removeClass("wrong-login");
	$("#inp-other-user-school").val(showSchool);
	$('.list-schools-other-users').val(showSchool);
    //When you select school all this happens:
    resetMapSelection();
    listAllUsers();
    //getAllDevicesFromSchool(); TODO give standard MapID here for Admin
    loadMaps();
    if ( showSchool !== "" && runChartFirstTime == true) {
    	setTimeout(function(){
            //startCharset();
        }, 1000);
    	runChartFirstTime = false;
    } else {
    	if ( showSchool == "" ) {
    		runChartFirstTime = true;
    	}
    }
    setTimeout(function(){
        //getDataShowMap();
    }, 1000);



    //select1 = $(".chart-select-floor-plan");
    graphSelectMap = $(".chart-select-map");
    //select = $(".chart-select-floor-plan");
    graphSelectLocation = $(".chart-select-location");


    //Create list of maps 
    createMapList();


    listAllUsers();
    //getAllSchoolUsers();

});




function createMapList(){

	var sUrl = "api/api-get-nonICMeter-Maps.php?fAY2YfpdKvR="+sender+"&userrole="+currentUserRole+"&InstID="+showSchoolID;
    // Do AJAX and pahse
    $.get( sUrl , function( sData ){

    	var jData = JSON.parse(sData); 
    	var i=0;

    	while (i < jData.length ){

    		MapID = jData[i].MapID;
    		MapName = jData[i].MapName;

    		if (document.getElementById("map"+MapID)==null){
                //If Map option has NOT been created:



                mapGroup = $('<option id="map' + MapID + '" value="' + MapID +'">' + MapName + '</option>');


            } 
            graphSelectMap.append(mapGroup);
            i++;
        } //While ends



        graphSelectMap.val('stand');

    });


}



function createLocationList(MapID) {

	var sUrl = "api/api-get-nonICMeter-Area-Location.php?fAY2YfpdKvR="+sender+"&userrole="+currentUserRole+"&MapID="+MapID;

    // Do AJAX and pahse
    $.get( sUrl , function( sData ){

    	var jData = JSON.parse(sData); 

    	var i=0;

    	while (i < jData.length ){
            //Each Map name is unique so we try to categorize after map name

            MapID = jData[i].MapID;
            AreaID = jData[i].AreaID;
            MapName = jData[i].MapName;
            AreaName = jData[i].AreaName;
            LocationName = jData[i].LocationName;
            LocationID = jData[i].LocationID;

            if (document.getElementById("area"+AreaID)==null){
                //If Area option has NOT been created:

                areaGroup = $('<optgroup label="' + AreaName + '" value="' + AreaName + '" id="area' + AreaID + '"></optgroup>');
                locationGroup = $('<option id="' + LocationID + '" value="' + LocationName +'">' + LocationName + '</option>');
                areaGroup.append(locationGroup);


            } 

            else {

                //If Area option has been created:
                $("#area" + AreaID).append('<option id="' + LocationID + '" value="' + LocationName +'">' + LocationName + '</option>');


            }

            locationGroup = $('<option id="' + LocationID + '" value="' + LocationName +'">' + LocationName + '</option>');

            graphSelectLocation.append(locationGroup);


            i++;

            graphSelectLocation.val("locStand");


            //To compare Locations at a map (in graphs)

            $("#compare-devices-list").append(
            	'<span style="margin:10px" class="canvas-settings-check inline-checkbox" >' +
            	'<input type="checkbox" value="false" class="canvas-settings regular-checkbox" id="check' + LocationID + '" name="'  + LocationName + '"></input>' +
            	'<label for="check' + LocationID + '"></label>' +
            	'<p>' + LocationName +'</p>' +
            	'</span>');



        } //While ends

    }); //GET ends
}







$(document).on('change', '.chart-select-device', function() {
	var val = $(".chart-select-device").val();
	$(".chart-select-device-communication").val(val);
	$.cookie("set-device", val);
    // startCharset();
});

$(document).on('change', '.chart-select-device-communication', function () {
	var val = $(".chart-select-device-communication").val();
	if (val !== "other") {
		$(".chart-select-device").val(val);
		$.cookie("set-device", val);
        //startCharset();
    }
});

// Tricker #createAdminButton on press enter when password-field is selected
$(".other-users-top :input").keyup(function(event){
	if(event.keyCode == 13){
		$("#btn-search-user-user").click();
	}
});

var disabledShowAllDevicesButton = false;
var disabledOtherUserButton = false;
$(".other-users-create").hide();

function showSchoolStatus() {
	if ( showSchool == "") {
		disabledOtherUserButton = true;
		disabledShowAllDevicesButton = true;
		$("#btn-toggle-create-user, #btn-search-user-user, #btn-show-all-decices").addClass("button-disabled");
		$(".other-users-create, .list-all-devices-wrapper").slideUp();
		$("#btn-show-all-decices").text("Show locations");
		showDevicesOnDevices = false;
		$('#canvas1').remove();
		clearChartData();
		resetCreateOtherUser();
		clearGraphMetaInfo();
		disableGraphSettingsSelections();
	} else {
		disabledOtherUserButton = false;
		disabledShowAllDevicesButton = false;
		$("#btn-toggle-create-user, #btn-search-user-user, #btn-show-all-decices").removeClass("button-disabled");
        //enableGraphSettingsSelections();
    }
}

$('#btn-toggle-create-user').click(function(){
	if (disabledOtherUserButton == false) {
		$("#inp-other-user-school").val(showSchool);
		$(".other-users-create").slideToggle(); 
	}
});

$('#icn-close-create-other-user').click(function(){
	$(".other-users-create").slideUp();
	resetCreateOtherUser();
});

$('#btn-search-user-user').click(function(){
	if (disabledOtherUserButton == true) {
		$(".list-schools-other-users").addClass("wrong-login");
	}
});

function resetCreateOtherUser() {
	$(".other-users-create input").val("");
}

function resetCreateOtherAdmin() {
	$(".other-admin-edit input").val("");
}

// Create other user
$("#btn-create-other-user").click(function(){
	requestCreateOtherUser();
});

// Create other admin

$("#btn-create-other-admin").click(function(){
	requestCreateOtherAdmin();
});

// Search school user
$('#btn-search-user-user').click(function(){
	$(".other-users-create").slideUp();
	getSearchSchoolUsers();
}); 

// Show save user icon
$(document).on("change",".school-user input, .school-user select", function() {
	$(this).css("border", "solid 1px #92b2c7");
	$(this).siblings().find(".icon-save-user").show();
});


// Show save permission icon
$(document).on("change",".permission input ", function() {
	$(this).css("border", "solid 1px #92b2c7");
	$(this).siblings().find(".icon-save-permission").show();
});

// Delete school user 
$(document).on("click",".icon-delete-user", function() {
	selectedUser = $(this).parent().parent().find(".list-user-username").val();
	swal({
		title: "",
		text: 'Are you sure you want to delete this user '+selectedUser+'?',
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Yes, delete this user",
		closeOnConfirm: true
	},
         // If warning accepted do...
         function (){
         	deleteSchoolUser(selectedUser);
         });
	$(".cancel").html("Cancel");
});

// Accept school user 
$(document).on("click",".icon-activate-user", function() {
	selectedUser = $(this).parent().parent().find(".list-user-username").val();
	swal({
		title: "",
		text: 'Are you sure you want to activate this user '+selectedUser+'?',
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Yes, activate this user",
		closeOnConfirm: true
	},
         // If warning accepted do...
         function (){
         	acceptSchoolUser(selectedUser);
         });
	$(".cancel").html("Cancel");
});

// Delete admin user 
$(document).on("click",".icon-delete-admin", function() {
	selectedUser = $(this).parent().find(".list-admin-username").val();
	swal({
		title: "",
		text: 'Are you sure you want to delete this administrator?',
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Yes, delete this user",
		closeOnConfirm: true
	},
         // If warning accepted do...
         function (){
         	deleteAdminUser(selectedUser);
         });
	$(".cancel").html("Cancel");
});


// Update Permission 
$(document).on("click",".icon-save-permission", function() {
	thisClick = $(this);
	permID = $(this).parent().parent().find(".list-permission-role-2").val();
	permRole2 = $(this).parent().parent().find(".list-permission-role-2").is(':checked');
	permRole3 = $(this).parent().parent().find(".list-permission-role-3").is(':checked');
	permRole4 = $(this).parent().parent().find(".list-permission-role-4").is(':checked');

	updatePermission(thisClick, permID, permRole2, permRole3, permRole4);
});

// Update school user 
$(document).on("click",".icon-save-user", function() {
	thisClick = $(this);
	selectedUser = $(this).parent().parent().find(".list-user-username").val();
	selectedFirstName = $(this).parent().parent().find(".list-user-first-name").val();
	selectedLastName = $(this).parent().parent().find(".list-user-last-name").val();
	selectedEmail = $(this).parent().parent().find(".list-user-email").val();
	selectedPassword = $(this).parent().parent().find(".list-user-password").val();
	selectedRole = $(this).parent().parent().find('select').val();
	updateSchoolUser(thisClick, selectedUser, selectedFirstName, selectedLastName, selectedEmail, selectedPassword, selectedRole);
});

// Admin user buttons

$(".other-admin-edit, .list-other-admin-users-create").hide();

$('#btn-toggle-create-admin').click(function(){
	$(".other-admin-edit").slideToggle();
	$(".list-other-admin-users-create").slideUp();
}); 

$('#btn-toggle-list-admin').click(function(){
	$(".list-other-admin-users-create").slideToggle();
	$(".other-admin-edit").slideUp();
	listAdminUsers();
});

$('#icn-close-list-other-admin-users-create').click(function(){
	$(".list-other-admin-users-create").slideUp();
});

$('#icn-close-create-admin-user').click(function(){
	$(".other-admin-edit").slideUp();
});

// Devices
$("#btn-show-all-decices").text("Show locations");
$("#btn-show-all-decices").click(function(){
	if ( disabledShowAllDevicesButton == false ) {
		if ( showDevicesOnDevices == false ) {
			$(".list-all-devices-wrapper").slideDown();
			$("#btn-show-all-decices").text("Hide locations");
			showDevicesOnDevices = true;
		} else {
			$(".list-all-devices-wrapper").slideUp();
			$("#btn-show-all-decices").text("Show locations");
			showDevicesOnDevices = false;
		}
	}
});

$('#icn-close-data-map-info').click(function(){
	$(".data-map-info-wrapper").slideUp();
	$(".btn-show-view-map-info").text("Vis info");
	showInfoDivecesMap = false;
});


$(".btn-show-view-map-info").click(function(){
	if ( showInfoDivecesMap == false ) {
		$("html, body").animate({
			scrollTop: 0
		}, 1000);
		$(".data-map-info-wrapper").slideDown();
		$(".btn-show-view-map-info").text("Skjul info");
		showInfoDivecesMap = true;
	} else {
		$(".data-map-info-wrapper").slideUp();
		$(".btn-show-view-map-info").text("Vis info");
		showInfoDivecesMap = false;
	}
});

$('#icn-close-devices-wrapper').click(function(){
	$(".list-all-devices-wrapper").slideUp();
	$("#btn-show-all-decices").text("Show location list");
	showDevicesOnDevices = false;
}); 

// Update Device alias
$(document).on("change",".ic-meter-device input", function() {
	$(this).css("border", "solid 1px #92b2c7");
	$(this).siblings().find(".icon-save-device-alias").css("visibility", "visible");
});




// Update school user 
$(document).on("click",".icon-save-device-alias", function() {
	thisClick = $(this);
	var selectedBoxQR = $(this).parent().parent().find(".device-box-QR").val();
	var selectedAlias = $(this).parent().parent().find(".device-alias").val();
	updateLocationName(selectedBoxQR,selectedAlias)
	setTimeout(function(){
		showMap();
	},500);
});

// Charts 

$(document).on('change', '#chart-select-type', function() {
	if ( graph.chartType == "bar") {
		$(".chart-fill").show();
		$(".chart-fill").prop('checked', false);
	} else {
		$(".chart-fill").hide();
	}
	graph.chartType = $(this).val();
	drawGraph();
});

$('#chart-fill').change(function() {
	if ( enableDataSettings == true ) {
		graph.animationDuration = 0;
		if ($(this).is(":checked")) {
			graph.chartFill = true;
			drawGraph();
		} else {
			graph.chartFill = false;
			drawGraph();
		}
	}
});

if (window.matchMedia('(min-width: 800px)').matches) {
	$(".view-live-data-wrapper").hover(function(){
		$('.liveUpdateExplain').show();
	},function(){
		$('.liveUpdateExplain').hide();
	});

	$(".download-data-icon, .download-info-box-wrapper").hover(function () {
		$('.download-info-box-wrapper').show();
	}, function () {
		$('.download-info-box-wrapper').hide();
	});
}

// Download data from chart

$(document).on("click", "#btn-download-graph-data", function(){
	if (!downloadDataDisable){
		fnExcelReport();
	}
});

var tab_text;
var data_type = 'data:application/vnd.ms-excel';
var dataExportFileName = 'Data_Export';

function CreateHiddenTable(ListOfDataDates, ListOfDataTemperature, ListOfDataHumidity, ListOfDataHumidity, ListOfDataCO2, ListOfDataNoiseAvg, ListOfDataNoisePeak, ListOfDataXData) {

	LocationID = $(".chart-select-location").find('option:selected').attr('value');
	dataExportFileName = 'Data_Export_' + showSchool + '_' + currentDate;
	var currentTimeStamp = moment().format("DD-MM-YYYY HH:mm");
	var TableMarkUp = '<table id="myModifiedTable" class="visibilityHide">\
	<thead>\
	<tr>\
	<td>\
	<i>Data from skoleklima.dk '+ currentTimeStamp +'</i>\
	</td>\
	</tr>\
	<tr>\
	<td>\
	<i>'+ showSchool +' - '+ LocationID +'</i>\
	</td>\
	</tr>\
	<tr>\
	<td>\
	<b>Time stamp</b>\
	</td>\
	<td>\
	<b>Temperature (°C)</b>\
	</td>\
	<td>\
	<b>Humidity (%)</b>\
	</td>\
	<td>\
	<b>CO2 level (ppm)</b>\
	</td>\
	<td>\
	<b>Sound (dB average)</b>\
	</td>\
	<td>\
	<b>Sound (dB Max)</b>\
	</td>\
	<td>\
	<b>Extra data type</b>\
	</td>\
	</tr>\
	</thead><tbody>';

	if (dataXData.length === 0) {
		for (i = 0; i < dataDates.length; i++) {
			var exportDates = dataDates[i].toString();
			var exportTemperature = dataTemperature[i].toString().replace(/\./g, ',');
			var exportHumidity = dataHumidity[i].toString().replace(/\./g, ',');
			var exportCo2 = dataCO2[i].toString().replace(/\./g, ',');
			var exportNoiseAvg = dataNoiseAvg[i].toString().replace(/\./g, ',');
			var exportNoisePeak = dataNoisePeak[i].toString().replace(/\./g, ',');
			TableMarkUp += '<tr><td>' + exportDates + '</td><td>' + exportTemperature + '</td><td>' + exportHumidity + '</td><td>' + exportCo2 + '</td><td>' + exportNoiseAvg + '</td><td>' + exportNoisePeak + '</td><td></td></tr>';
		}
	} else {
		for (i = 0; i < dataDates.length; i++) {
			var exportDates = dataDates[i].toString();
			var exportTemperature = dataTemperature[i].toString().replace(/\./g, ',');
			var exportHumidity = dataHumidity[i].toString().replace(/\./g, ',');
			var exportCo2 = dataCO2[i].toString().replace(/\./g, ',');
			var exportNoiseAvg = dataNoiseAvg[i].toString().replace(/\./g, ',');
			var exportNoisePeak = dataNoisePeak[i].toString().replace(/\./g, ',');
			var exporXData = dataXData[i].toString().replace(/\./g, ',');
			TableMarkUp += '<tr><td>' + exportDates + '</td><td>' + exportTemperature + '</td><td>' + exportHumidity + '</td><td>' + exportCo2 + '</td><td>' + exportNoiseAvg + '</td><td>' + exportNoisePeak + '</td><td>' + exporXData + '</td></tr>';
		}
	}

	TableMarkUp += "</tbody></table>";
	$('#exportDataHolder').append(TableMarkUp);
}



function fnExcelReport() {
	var ListOfDataDates = dataDates;
	var ListOfDataTemperature = dataTemperature;
	var ListOfDataHumidity = dataHumidity;
	var ListOfDataCO2 = dataCO2;
	var ListOfDataNoiseAvg = dataNoiseAvg;
	var ListOfDataNoisePeak = dataNoisePeak;
	var ListOfDataXData = dataXData;

	CreateHiddenTable(ListOfDataDates, ListOfDataTemperature, ListOfDataHumidity, ListOfDataHumidity, ListOfDataCO2, ListOfDataNoiseAvg, ListOfDataNoisePeak, ListOfDataXData);

	tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
	tab_text = tab_text + '<head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
	tab_text = tab_text + '<x:Name>Error Messages</x:Name>';
	tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
	tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
	tab_text = tab_text + "<table border='1px'>";
	tab_text = tab_text + $('#myModifiedTable').html();;
	tab_text = tab_text + '</table></body></html>';
	data_type = 'data:application/vnd.ms-excel';
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");

	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		if (window.navigator.msSaveBlob) {
			var blob = new Blob([tab_text], {
				type: "application/csv;charset=utf-8;"
			});
			navigator.msSaveBlob(blob, dataExportFileName + '.xls');
		}
	} else {
		$('#testExportDataAnchor')[0].click()
	}
	$('#exportDataHolder').html("");
}

$($("#testExportDataAnchor")[0]).click(function () {
	$('#testExportDataAnchor').attr('href', data_type + ', ' + encodeURIComponent(tab_text));
	$('#testExportDataAnchor').attr('download', dataExportFileName + '.xls');
});

// Chart map
$("#btn-toggle-chart-info").text("Vis info");
$("#btn-toggle-chart-info").click(function(){
	if ( showSchool !== "") {
		if ( showDataInfo == false ) {
			$(".view-data-info-box").slideDown();
			$("#btn-toggle-chart-info").text("Skjul info");
			showDataInfo = true;
		} else {
			$(".view-data-info-box").slideUp();
			$("#btn-toggle-chart-info").text("Vis info");
			showDataInfo = false;
		}
	}
});

$('#icn-close-view-data-info').click(function(){
	$(".view-data-info-box").slideUp();
	$("#btn-toggle-chart-info").text("Vis info");
	showDataInfo = false;
});

/**********************************/
//		Functions
/**********************************/

function showMenu() {
	$("#side-navigation").animate({left: '0px'}, 500, "swing");
	$(".dashboard").animate({left: '200px'}, 500, "swing");
	$("#btn-sign-out").animate({marginRight: '200px'}, 500, "swing");
	menuShown = true;
}

function hideMenu() {
	$("#side-navigation").animate({left: '-200px'}, 500, "swing");
	$(".dashboard").animate({left: '0px'}, 500, "swing");
	$("#btn-sign-out").animate({marginRight: '0px'}, 500, "swing");
	menuShown = false;
}

$(".menu-icon-show").show();
function showHideMenu() {

	if ( menuShown == false ) {
		$(".menu-icon-hide").show();
		$(".menu-icon-show").hide();
		showMenu();

	} else {
		$(".menu-icon-show").show();
		$(".menu-icon-hide").hide();
		hideMenu();
	}
}




function showChangePassword() {
	if ( showChangeOwnPass == false ) {
		$(".change-own-pass").slideDown();
		$(".change-own-pass-click i").removeClass("fa-lock");
		$(".change-own-pass-click i").addClass("fa-unlock-alt");
		showChangeOwnPass = true;
	} else {
		$(".change-own-pass").slideUp();
		$(".change-own-pass-click i").removeClass("fa-unlock-alt");
		$(".change-own-pass-click i").addClass("fa-lock");
		$("#inp-onw-user-new-pass, #inp-onw-user-new-pass-repeat").val("");
		showChangeOwnPass = false;
	}
};

function requestUpdateOwnUser() {
	var currentUserID = $("#txt-current-user-ID").val();
	var currentUserFirstName = $("#inp-onw-user-first-name").val();
	var currentUserLastName =  $("#inp-onw-user-last-name").val();
	var currentUserEmail =  $("#inp-onw-user-email").val();
	var currentUserNewPass =  $("#inp-onw-user-new-pass").val();
	var currentUserNepPassRepeat =  $("#inp-onw-user-new-pass-repeat").val();
	var currentUserCurrentPass =  $("#inp-onw-user-current-pass").val();

    // Set up variables for validation
    var validateInput = {
    	firstName:false,
    	lastName:false,
    	email:false,
    	newPassword:false,
    	newPasswordRepeat:false,
    	changePass:false,
    	currentPassword:false
    };

    // Clear all password inputfields
    function clearOwnPassword(){
    	$("#inp-onw-user-new-pass, #inp-onw-user-new-pass-repeat, #inp-onw-user-current-pass").val("");
    }

    // Validate userinput

    if ( currentUserFirstName.length < 1 ) {
    	$("#inp-onw-user-first-name").addClass('wrong-login');
    	validateInput.firstName = false;
    } else {
    	$("#inp-onw-user-first-name").removeClass('wrong-login');
    	validateInput.firstName = true;
    }

    if ( currentUserLastName.length < 1 ) {
    	$("#inp-onw-user-last-name").addClass('wrong-login');
    	validateInput.lastName = false;
    } else {
    	$("#inp-onw-user-last-name").removeClass('wrong-login');
    	validateInput.lastName = true;
    }

    if ( reE.test(currentUserEmail) || currentUserEmail == "") {
    	$("#inp-onw-user-email").removeClass('wrong-login');
    	validateInput.email = true;
    } else {
    	$("#inp-onw-user-email").addClass('wrong-login');
    	validateInput.email = false;
    }

    if ( showChangeOwnPass == true ) {
    	if(currentUserNewPass !== currentUserNepPassRepeat) {
    		$("#inp-onw-user-new-pass, #inp-onw-user-new-pass-repeat").addClass('wrong-login');
    		validateInput.changePass = false;
    	} else {
    		$("#inp-onw-user-new-pass, #inp-onw-user-new-pass-repeat").removeClass('wrong-login');
    		if ( !reP.test(currentUserNewPass) ) { 
    			$("#inp-onw-user-new-pass").addClass('wrong-login');
    			validateInput.newPassword = false;
    		} else {
    			$("#inp-onw-user-new-pass").removeClass('wrong-login');
    			validateInput.newPassword = true;
    		}

    		if ( currentUserNepPassRepeat.length < 8 ) { 
    			$("#inp-onw-user-new-pass-repeat").addClass('wrong-login');
    			validateInput.newPasswordRepeat = false;
    		} else {
    			$("#inp-onw-user-new-pass-repeat").removeClass('wrong-login');
    			validateInput.newPasswordRepeat = true;
    		}
    		validateInput.changePass = true;
    	}
    }

    if ( currentUserCurrentPass == "" || currentUserCurrentPass.length < 8 ) {
    	$("#inp-onw-user-current-pass").addClass('wrong-login');
    	$(".msg-own-user-type-current-pass").show();
    	validateInput.currentPassword = false;
    } else {
    	$("#inp-onw-user-current-pass").removeClass('wrong-login');
    	$(".msg-own-user-type-current-pass").hide();
    	validateInput.currentPassword = true;
    }

    if ( showChangeOwnPass == true ) { 
    	if (validateInput.firstName == true && validateInput.lastName == true && validateInput.email == true && validateInput.newPassword == true && validateInput.newPasswordRepeat == true && validateInput.changePass == true && validateInput.currentPassword == true) {
    		sendOwnUserChangeRequest();
    	}
    } else {
    	if (validateInput.firstName == true && validateInput.lastName == true && validateInput.email == true && validateInput.currentPassword == true) {
    		sendOwnUserChangeRequest();
    	}
    }

    function sendOwnUserChangeRequest() {

    	var sUrl = "api/api-update-own-user.php?fAY2YfpdKvR="+sender+"&userID="+currentUserID+"&firstName="+currentUserFirstName+"&lastName="+currentUserLastName+"&email="+currentUserEmail+"&newPass="+currentUserNewPass+"&currentPass="+currentUserCurrentPass;

    	$.get( sUrl , function( sData ){
    		var jData = JSON.parse(sData); 
    		if( jData.status == "ok" ){
    			swal({
    				title: "",
    				text: 'Your profile has been updated',
    				type: "success"     
    			}, function(){
    				location.reload();
    			});
    		} else if ( jData.status == "error" ) {
    			if ( jData.message == "wrong_pass") {
    				clearOwnPassword();
    				$("#inp-onw-user-current-pass").addClass('wrong-login');
    				$(".msg-own-user-type-current-pass").show();
    			} else {
    				swal({
    					title: "Error",
    					text: 'Your profile was updated',
    					type: "error"     
    				});
    			}	
    		}
    	});

    }

};

function requestCreateOtherUser() {
	var currentUserName = $("#txt-current-user-name").val();
	var createRole = $("#inp-other-user-role").val();
	var createUserName = $("#inp-other-user-username").val();
	var createFirstName = $("#inp-other-user-firstname").val();
	var createLastName = $("#inp-other-user-lastname").val();
	var createEmail = $("#inp-other-user-email").val();	

    // Set up variables for validation
    var validateInput = {
    	username:false,
    	firstName:false,
    	lastName:false,
    	email:false    
    };

    // Validate userinput

    if ( createUserName.length < 4 || createUserName.length > 8 ) {
    	$("#inp-other-user-username").addClass('wrong-login');
    	$("#inp-other-user-username").val("");
    	validateInput.username = false;
    } else {
    	$("#inp-other-user-username").removeClass('wrong-login');
    	validateInput.username = true;
    }

    if ( createFirstName.length < 1 ) {
    	$("#inp-other-user-firstname").addClass('wrong-login');
    	validateInput.firstName = false;
    } else {
    	$("#inp-other-user-firstname").removeClass('wrong-login');
    	validateInput.firstName = true;
    }

    if ( createLastName.length < 1 ) {
    	$("#inp-other-user-lastname").addClass('wrong-login');
    	validateInput.lastName = false;
    } else {
    	$("#inp-other-user-lastname").removeClass('wrong-login');
    	validateInput.lastName = true;
    }

    if ( reE.test(createEmail) || createEmail == "") {
    	$("#inp-other-user-email").removeClass('wrong-login');
    	validateInput.email = true;
    } else {
    	$("#inp-other-user-email").addClass('wrong-login');
    	validateInput.email = false;	
    }

    if (validateInput.username == true && validateInput.firstName == true && validateInput.lastName == true && validateInput.email == true ) {
    	sendOtherUserCreateRequest();
    }

    function sendOtherUserCreateRequest() {
    	var sUrl = "api/api-create-user.php?fAY2YfpdKvR="+sender+"&currentUserName="+currentUserName+"&firstName="+createFirstName+"&lastName="+createLastName+"&userName="+createUserName+"&email="+createEmail+"&role="+createRole+"&school="+showSchoolID;

    	$.get( sUrl , function( Data ){

    		var jData = JSON.parse(Data); 


    		if( jData.status == "ok" ){
    			swal({
    				title: "",
    				text: 'The profile '+createUserName+' was created with the password: '+jData.genPassword,
    				type: "success"     
    			}, function(){
    				resetCreateOtherUser();
    				listAllUsers();
    			});
    		} else if ( jData.message == "userOcupied") {
    			swal({
    				title: "",
    				text: 'The username '+createUserName+' is already in use, possibly by a user from another school',
    				type: "error"
    			});
    			$("#inp-other-user-username").val("");	
    		} else if ( jData.message == "illegal") {
    			swal({
    				title: "",
    				text: 'The username '+createUserName+' is unsafe and cannot be used',
    				type: "error"
    			});
    			$("#inp-other-user-username").val("");	
    		} else { 


    			swal({
    				title: "",
    				text: 'The profile was not created',
    				type: "error"
    			});
    			resetCreateOtherUser();

    		}


    	});

    }
}	

function requestCreateOtherAdmin() {
	var currentUserName = $("#txt-current-user-name").val();
	var createUserRole = $("#inp-other-admin-user-role").val();
	if (createUserRole == 1){
		var createRole = "1";
	} else if (createUserRole == 15) {
		var createRole = "15";
	}
	var createUserName = $("#inp-other-admin-username").val();
	var createFirstName = $("#inp-other-admin-firstname").val();
	var createLastName = $("#inp-other-admin-lastname").val();
	var createEmail = $("#inp-other-admin-email").val();	

    // Set up variables for validation
    var validateInput = {
    	username:false,
    	firstName:false,
    	lastName:false,
    	email:false    
    };

    // Validate userinput

    if ( createUserName.length < 4 || createUserName.length > 8 ) {
    	$("#inp-other-admin-username").addClass('wrong-login');
    	$("#inp-other-admin-username").val("");
    	validateInput.username = false;
    } else {
    	$("#inp-other-admin-username").removeClass('wrong-login');
    	validateInput.username = true;
    }

    if ( createFirstName.length < 1 ) {
    	$("#inp-other-admin-firstname").addClass('wrong-login');
    	validateInput.firstName = false;
    } else {
    	$("#inp-other-admin-firstname").removeClass('wrong-login');
    	validateInput.firstName = true;
    }

    if ( createLastName.length < 1 ) {
    	$("#inp-other-admin-lastname").addClass('wrong-login');
    	validateInput.lastName = false;
    } else {
    	$("#inp-other-admin-lastname").removeClass('wrong-login');
    	validateInput.lastName = true;
    }

    if ( reE.test(createEmail) || createEmail == "") {
    	$("#inp-other-admin-email").removeClass('wrong-login');
    	validateInput.email = true;
    } else {
    	$("#inp-other-admin-email").addClass('wrong-login');
    	validateInput.email = false;	
    }

    if (validateInput.username == true && validateInput.firstName == true && validateInput.lastName == true && validateInput.email == true ) {
    	sendOtherAdminCreateRequest();
    }

    function sendOtherAdminCreateRequest() {
    	var sUrl = "api/api-create-user.php?fAY2YfpdKvR="+sender+"&currentUserName="+currentUserName+"&firstName="+createFirstName+"&lastName="+createLastName+"&userName="+createUserName+"&email="+createEmail+"&role="+createRole+"&school=";

    	$.get( sUrl , function( Data ){
    		var jData = JSON.parse(Data); 
    		if( jData.status == "ok" ){
    			swal({
    				title: jData.genPassword,
    				text: 'The profile '+createUserName+' was created with the above password',
    				type: "success"     
    			}, function(){
    				resetCreateOtherAdmin()
    				listAdminUsers();
    			});
    		} else if ( jData.message == "userOcupied") {
    			swal({
    				title: '',
    				text: 'The username '+createUserName+' is occupied, possibly by a user on another school',
    				type: "error"     
    			});
    			$("#inp-other-admin-username").val("");
    		} else if ( jData.message == "illegal") {
    			swal({
    				title: "",
    				text: 'The username '+createUserName+' is unsafe and cannot be used',
    				type: "error"     
    			});
    			$("#inp-other-admin-username").val("");
    		} else { 


    		}


    	});
    }
}

function listAllPermissions() {
	getAllPermissions();
	$(".permissions-list-school-info").text("Check the boxes to allow different user roles to do different actions");


}



// List all locations and their coordinates
function getAllLocationsFromSchool(){


	var sUrl = "api/api-get-locations.php";



	$.ajax({
		url: sUrl,
		data: {
			"mapID" : MapID,
			"fAY2YfpdKvR" : sender
		},
		dataType: 'text',
		type: 'post',
		async: false,

		error: function (request, error) {
			alert("Error");
		}
	}).done(function (data) {
        //Update sensor lists
        locationIDs = [];
        locationXAxis = [];
        locationYAxis = [];
        dates = [];
        temperature = [];
        humidity = [];
        co2 = [];
        noise = [];

        var jData = JSON.parse(data); 

        var sDevice1 = '<div class="ic-meter-device">\
        <input type="hidden" class="input-disabled device-box-QR" value="{{1boxQR}}" readonly>\
        <input type="text" class="input-disabled device-box-name" value="{{1boxName}}" readonly>\
        <input type="text" class="device-alias" value="{{1alias}}">\
        <span>\
        <i class="icon-save-device-alias link fa fa-floppy-o" aria-hidden="true"></i>\
        </span>\
        </div>\
        ';

        var sDevice2 = '<span class="canvas-settings-2-check inline-checkbox">\
        <input id="canvas-settings-2-{{2boxID}}" data-check-color="{{2checkColor}}" data-box-qr="{{2boxQR}}" data-box-name="{{2boxName}}" class="regular-checkbox canvas-settings-2-input" type="checkbox" value="{{2value}}">\
        <label for="canvas-settings-2-{{2boxFor}}"></label>\
        <p>{{2boxDecription}}</p>\
        </span>\
        ';

        $("#devices-list-content-wrapper").empty();
        $(".chart-select-device").empty();
        $(".chart-select-device-communication").empty();
        $("#compare-devices-list").empty();



        for( var i = 0 ; i < jData.length ; i++ ){
            var sDeviceTemplate1 = sDevice1; // Phase jData to variable by order

            //Add to arrays
            locationIDs[i]=jData[i].LocationID;
            locationXAxis[i]=jData[i].XAxis;
            locationYAxis[i]=jData[i].YAxis;
            locationName[i]=jData[i].LocationName;

            // TODO: kobl data på location
            getLiveUnit(locationIDs[i]);
            getLiveDataForEachLocation(locationIDs[i],i);

            sDeviceTemplate1 = sDeviceTemplate1.replace( "{{1boxQR}}" , jData[i].LocationID );
            sDeviceTemplate1 = sDeviceTemplate1.replace( "{{1boxName}}" , jData[i].LocationName);
            sDeviceTemplate1 = sDeviceTemplate1.replace( "{{1alias}}" , jData[i].LocationName);


            if ( currentUserRole == 1 || currentUserRole == 2 ) {		//changed to integers instead of strings	
            	$("#devices-list-content-wrapper").append( sDeviceTemplate1 );
            }
            var xDataType = "Ekstra datatype";
            if (jData[i].xData !== null && jData[i].xData !==""){
            	var xDataType = "Ekstra datatype";
            }
            var boxQR = jData[i].LocationID;
            var boxName = jData[i].LocationName;
            var boxAlias = jData[i].LocationName;

            var randomColor = getRandomColor();

            var sDeviceTemplate2 = sDevice2;
            sDeviceTemplate2 = sDeviceTemplate2.replace( "{{2boxID}}" , jData[i].LocationID );
            sDeviceTemplate2 = sDeviceTemplate2.replace( "{{2boxQR}}" , jData[i].LocationID );
            sDeviceTemplate2 = sDeviceTemplate2.replace( "{{2boxFor}}" , jData[i].LocationID );
            sDeviceTemplate2 = sDeviceTemplate2.replace( "{{2value}}" , jData[i].SensorID );
            sDeviceTemplate2 = sDeviceTemplate2.replace( "{{2checkColor}}" , randomColor );


            if ( boxAlias == "" ) {
            	if ($.cookie("set-device") == boxQR) {
                    //data-xData="' + xDataType + '"
                    $(".chart-select-device").append('<option data-box-name="' + boxName + '" value="' + boxQR + '" selected>' + boxName + '</option>');
                } else {
                	$(".chart-select-device").append('<option data-box-name="' + boxName + '" value="' + boxQR + '">' + boxName + '</option>');
                }
                sDeviceTemplate2 = sDeviceTemplate2.replace( "{{2boxName}}" , boxName );
                sDeviceTemplate2 = sDeviceTemplate2.replace( "{{2boxDecription}}" , boxName );
                $(".chart-select-device-communication").append('<option data-box-name="'+boxName+'" value="'+boxQR+'">'+boxName+'</option>');
            } else {
            	if ($.cookie("set-device") == boxQR) {
            		$(".chart-select-device").append('<option data-box-name="' + boxAlias + '" value="' + boxQR + '" selected>' + boxAlias + ' </option>');
            	} else {
            		$(".chart-select-device").append('<option data-box-name="' + boxAlias + '" value="' + boxQR + '">' + boxAlias + '</option>');
            	}
            	sDeviceTemplate2 = sDeviceTemplate2.replace( "{{2boxName}}" , boxAlias );
            	sDeviceTemplate2 = sDeviceTemplate2.replace( "{{2boxDecription}}" , boxAlias );
            	$(".chart-select-device-communication").append('<option data-box-name="'+boxAlias+'" value="'+boxQR+'">'+boxAlias+'</option>');
            }
            $("#compare-devices-list").append(sDeviceTemplate2);
        }



    });
$(".view-devices-list-device-info").text("All locations at "+showSchool);


}


// Retrive live sensor data units
function getLiveUnit(locID){
	var locationID=locID;
	var sUrl = "api/api-get-sensor-units.php?LocationID=" + locationID + "&fAY2YfpdKvR="+sender; 
	$.ajax({
		url: sUrl,
        //type: 'post',
        async: false,
        success: function (sData) {
        	jData = JSON.parse(sData);
        	if (jData.status == "error") {
        		swal("", "Something went wrong. Try again later", "error");
        	} else {
        		unitData = jData.sensorData;
        	}
        },
        error: function (request, error) {
        	alert(" Can't do because: getLiveUnit " + error);
        }
    });
}



// Retrieve live sensor data
// from all sensors assigned to a location
function getLiveDataForEachLocation(locID, index){
	var locationID = locID;
	var sUrl = "api/api-get-sensor-on-school.php?LocationID=" + locationID + "&fAY2YfpdKvR="+sender;

	$.ajax({
		url: sUrl,
        //type: 'post',
        async: false,
        success: function (sData) {

            //alert("getLiveData success");
            //alert("sData from getsensoronschool: "+sData);
            //alert(sData);
            console.log(sData);
            var jData = JSON.parse(sData);

            if (jData.status == "error") {
            	swal("", "Something went wrong. Try again later", "error");
            } else {

            //Update sensor lists
            dates = [];
            var temperatureSum = 0;
            var humiditySum = 0;
            var co2Sum = 0;
            var noiseSum = 0;

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
                    //alert("attributeName: " + unitData[i][j].SensorAttributeName)
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
                	lastTemperature = parseFloat(jData[i][0].last_Temperature);
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
                	temperatureSum+= lastTemperature; 
                	temperatureCounter++;
                }
                //alert(jData[i][0].last_NoiseAvg);
                if(jData[i][0].last_NoiseAvg!=null){
                	noiseSum+=parseFloat(jData[i][0].last_NoiseAvg);
                	noiseCounter++;
                }
                if(jData[i][0].last_Humidity!=null){
                	humiditySum +=parseFloat(jData[i][0].last_Humidity);
                	humidityCounter++;
                }
                if(jData[i][0].last_CO2!=null){
                	co2Sum +=parseFloat(jData[i][0].last_CO2);
                	co2Counter++;
                }
            }

            //calculate mean
            temperatureSum /= temperatureCounter;
            temperatureSum = (Math.round(temperatureSum * 100) / 100).toFixed(2);
            noiseSum /= noiseCounter;
            noiseSum = (Math.round(noiseSum * 100) / 100).toFixed(2);
            humiditySum /= humidityCounter;
            humiditySum = (Math.round(humiditySum * 100) / 100).toFixed(2);
            co2Sum /= co2Counter;
            co2Sum = (Math.round(co2Sum * 100) / 100).toFixed(2);

            // Change data on GUI        
            humidity[index]=humiditySum;
            noise[index]=noiseSum;
            temperature[index]=temperatureSum;
            dates[index]="DATES";
            co2[index]=co2Sum;
        }
    },
    error: function (request, error) {
    	alert(" Can't do because: getLiveData " + error);
    }
});
}





// Update Device Alias

function updateLocationName(locID,locName) {


	var sUrl = "api/api-update-nonICMeter-alias.php?LocationID=" + locID +"&LocationName=" + locName;


	$.get( sUrl , function( sData ){
		var jData = JSON.parse(sData); 
		if( jData.status == "ok" ){
			swal("", "Location name has been updated!", "success");
			$(thisClick).parent().parent().find("input").css("border", "solid 1px #4f5567");
			$(thisClick).css("visibility", "hidden");
			$(".chart-select-device option[value="+boxQR+"]").remove();
			$("#canvas-settings-2-"+boxQR).parent().remove();

			$(".chart-select-location").find('option').not(':first').remove();


			MapID=graphSelectMap.find('option:selected').attr('value');

			createLocationList(MapID);
		} 
		else{
			swal("", "Something went wrong try again later!", "error");
		}
	});

}

//List all permissions
function getAllPermissions(){

	var sUrl = "api/api-get-permissions.php?\
	fAY2YfpdKvR="+sender+"&\
	school="+showSchoolID;

	$.getJSON( sUrl , function( jData ){

		var perm = '<div class="permission">\
		<div id="list-permission-id" value={{value}} class="tooltip">{{permissionname}}\
		<span class="tooltiptext">{{permissiondescription}}</span>\
		</div>\
		<input id="checkBox2" class="list-permission-role-2" type="checkbox" value="{{value1}}" {{checked2}}>\
		<input id="checkBox3" class="list-permission-role-3" type="checkbox" value="3" {{checked3}}>\
		<input id="checkBox4" class="list-permission-role-4" type="checkbox" value="4" {{checked4}}>\
		<span>\
		<i class="icon-save-permission tooltip link fa fa-floppy-o" aria-hidden="true"><span class="tooltiptext">Save changes</span></i>\
		</span>\
		</div>\
		';

		$("#permissions-list-content-wrapper").empty();
        // Loop through users
        for( var i = 0 ; i < jData.length ; i++ ){              
            var permTemplate = perm; // Phase jData to variable by order
            permTemplate = permTemplate.replace( "{{value}}" , jData[i].PermID );
            permTemplate = permTemplate.replace( "{{value1}}" , jData[i].PermID );
            permTemplate = permTemplate.replace( "{{permissionname}}" , jData[i].PermName );
            permTemplate = permTemplate.replace( "{{permissiondescription}}" , jData[i].PermDescription );

            if(i + 1 == jData.length || jData[i+1].PermID!=jData[i].PermID ){
            	permTemplate = permTemplate.replace( "{{checked2}}" , "" );
            	permTemplate = permTemplate.replace( "{{checked3}}" , "" );
            	permTemplate = permTemplate.replace( "{{checked4}}" , "" );
            	$("#permissions-list-content-wrapper").append(permTemplate);

            } else {
            	while(true){
            		if(jData[i].RoleID==1){
            			i++;
            		}
            		if (jData[i].RoleID==2) {
            			permTemplate = permTemplate.replace( "{{checked2}}" , "checked" );
            		} else if (jData[i].RoleID == 3) {
            			permTemplate = permTemplate.replace( "{{checked3}}" , "checked" );
            		} else if (jData[i].RoleID == 4) {
            			permTemplate = permTemplate.replace( "{{checked4}}" , "checked" );
            		}
            		if(i + 1 == jData.length || jData[i+1].PermID!=jData[i].PermID){
            			permTemplate = permTemplate.replace( "{{checked2}}" , "" );
            			permTemplate = permTemplate.replace( "{{checked3}}" , "" );
            			permTemplate = permTemplate.replace( "{{checked4}}" , "" );
            			$("#permissions-list-content-wrapper").append(permTemplate);
            			break;
            		} else {
            			i++;
            		}
            	}
            }
        }
    });
}


// Update permissions
function updatePermission(thisClick, permID, permRole2, permRole3, permRole4){

	if ( permID != null) {
		var sUrl = "api/api-update-permission.php?\
		fAY2YfpdKvR="+sender+"&\
		permID="+permID+"&\
		permRole2="+permRole2+"&\
		permRole3="+permRole3+"&\
		permRole4="+permRole4+"&\
		user-school="+showSchoolID;

		$.get( sUrl , function( sData ){
			var jData = JSON.parse(sData); 
			if( jData.status == "ok" ){
				swal("", "The permission has been updated", "success");
				$(thisClick).hide();
			}
			else{
				swal("", "Something went wrong. Try again later", "error");
			}
		});
	}		
}


// List all users

//List all permissions
function getAllPermissions(){

	var sUrl = "api/api-get-permissions.php?\
	fAY2YfpdKvR="+sender+"&\
	school="+showSchoolID;

	$.getJSON( sUrl , function( jData ){


		var perm = '<div class="permission">\
		<div id="list-permission-id" value={{value}} class="tooltip">{{permissionname}}\
		<span class="tooltiptext">{{permissiondescription}}</span>\
		</div>\
		<input id="checkBox2" class="list-permission-role-2" type="checkbox" value="{{value1}}" {{checked2}}>\
		<input id="checkBox3" class="list-permission-role-3" type="checkbox" value="3" {{checked3}}>\
		<input id="checkBox4" class="list-permission-role-4" type="checkbox" value="4" {{checked4}}>\
		<span>\
		<i class="icon-save-permission tooltip link fa fa-floppy-o" aria-hidden="true"><span class="tooltiptext">Save changes</span></i>\
		</span>\
		</div>\
		';

        // Remove all content from #userList
        $("#permissions-list-content-wrapper").empty();
        // Loop through users
        for( var i = 0 ; i < jData.length ; i++ ){              
            var permTemplate = perm; // Phase jData to variable by order
            permTemplate = permTemplate.replace( "{{value}}" , jData[i].PermID );
            permTemplate = permTemplate.replace( "{{value1}}" , jData[i].PermID );
            permTemplate = permTemplate.replace( "{{permissionname}}" , jData[i].PermName );
            permTemplate = permTemplate.replace( "{{permissiondescription}}" , jData[i].PermDescription );

            if(i + 1 == jData.length || jData[i+1].PermID!=jData[i].PermID ){
            	permTemplate = permTemplate.replace( "{{checked2}}" , "" );
            	permTemplate = permTemplate.replace( "{{checked3}}" , "" );
            	permTemplate = permTemplate.replace( "{{checked4}}" , "" );
            	$("#permissions-list-content-wrapper").append(permTemplate);

            } else {
            	while(true){
            		if(jData[i].RoleID==1){
            			i++;
            		}
            		if (jData[i].RoleID==2) {
            			permTemplate = permTemplate.replace( "{{checked2}}" , "checked" );
            		} else if (jData[i].RoleID == 3) {
            			permTemplate = permTemplate.replace( "{{checked3}}" , "checked" );
            		} else if (jData[i].RoleID == 4) {
            			permTemplate = permTemplate.replace( "{{checked4}}" , "checked" );
            		}
            		if(i + 1 == jData.length || jData[i+1].PermID!=jData[i].PermID){
            			permTemplate = permTemplate.replace( "{{checked2}}" , "" );
            			permTemplate = permTemplate.replace( "{{checked3}}" , "" );
            			permTemplate = permTemplate.replace( "{{checked4}}" , "" );
            			$("#permissions-list-content-wrapper").append(permTemplate);
            			break;
            		} else {
            			i++;
            		}
            	}
            }
        }
    });
}


// Update permissions
function updatePermission(thisClick, permID, permRole2, permRole3, permRole4){

	if ( permID != null) {
		var sUrl = "api/api-update-permission.php?\
		fAY2YfpdKvR="+sender+"&\
		permID="+permID+"&\
		permRole2="+permRole2+"&\
		permRole3="+permRole3+"&\
		permRole4="+permRole4+"&\
		user-school="+showSchoolID;

		$.get( sUrl , function( sData ){
			var jData = JSON.parse(sData); 
			if( jData.status == "ok" ){
				swal("", "The permission has been updated", "success");
				$(thisClick).hide();
			}
			else{
				swal("", "Something went wrong. Try again later", "error");
			}
		});
	}		
}



// List all users

function getAllSchoolUsers(){
	if ( currentUserRole == "1" || currentUserRole == "2" || currentUserRole == "3") {

		var sUrl = "api/api-get-users-from-school.php?\
		fAY2YfpdKvR="+sender+"&\
		school="+showSchoolID;

		$.getJSON( sUrl , function( jData ){
			if(currentUserRole == 3){
				var sUser = '<div class="school-user">\
				<input type="text" class="list-user-username" value="{{username}}" readonly>\
				<input type="text" class="list-user-first-name" value="{{firstname}}">\
				<input type="text" class="list-user-last-name" value="{{lastname}}">\
				<input type="text" class="list-user-email" value="{{email}}">\
				<input type="password" class="list-user-password" value="{{password}}">\
				<select id="inp-other-user-role" name="option">\
				<option value="4" {{role4}}>Elev</option>\
				</select>\
				<span>\
				<i class="icon-delete-user tooltip link fa fa-trash-o" aria-hidden="true"><span class="tooltiptext">Slet bruger</span></i>\
				<i class="icon-save-user tooltip link fa fa-floppy-o" aria-hidden="true"><span class="tooltiptext">Gem ændringer</span></i>\
				</span>\
				</div>\
				';
			} else {
				var sUser = '<div class="school-user">\
				<input type="text" class="list-user-username" value="{{username}}" readonly>\
				<input type="text" class="list-user-first-name" value="{{firstname}}">\
				<input type="text" class="list-user-last-name" value="{{lastname}}">\
				<input type="text" class="list-user-email" value="{{email}}">\
				<input type="password" class="list-user-password" value="{{password}}">\
				<select id="inp-other-user-role" name="option">\
				<option value="4" {{role4}}>Elev</option>\
				<option value="3" {{role3}}>Lærer</option>\
				<option value="2" {{role2}}>Skole administrator</option>\
				</select>\
				<span>\
				<i class="icon-delete-user tooltip link fa fa-trash-o" aria-hidden="true"><span class="tooltiptext">Slet bruger</span></i>\
				<i class="icon-save-user tooltip link fa fa-floppy-o" aria-hidden="true"><span class="tooltiptext">Gem ændringer</span></i>\
				</span>\
				</div>\
				';
			}



			$("#other-users-list-content-wrapper").empty();
            // Loop through users
            for( var i = 0 ; i < jData.length ; i++ ){
            	if ( jData[i].userName !== currentUserName ) {

            		if(currentUserRole == 1 || currentUserRole == 2 || (currentUserRole == 3 && jData[i].RoleName == 4)){
                        var sUserTemplate = sUser; // Phase jData to variable by order
                        sUserTemplate = sUserTemplate.replace( "{{username}}" , jData[i].UserName );
                        sUserTemplate = sUserTemplate.replace( "{{firstname}}" , jData[i].FirstName );
                        sUserTemplate = sUserTemplate.replace( "{{lastname}}" , jData[i].LastName );
                        sUserTemplate = sUserTemplate.replace( "{{email}}" , jData[i].Email );
                        sUserTemplate = sUserTemplate.replace( "{{password}}" , jData[i].UserPassword );

                        if ( jData[i].RoleName == 4) {
                        	sUserTemplate = sUserTemplate.replace( "{{role4}}" , "selected" );
                        } else if ( jData[i].RoleName == 3) {
                        	sUserTemplate = sUserTemplate.replace( "{{role3}}" , "selected" );
                        } else {
                        	sUserTemplate = sUserTemplate.replace( "{{role2}}" , "selected" );
                        }	
                        $("#other-users-list-content-wrapper").append( sUserTemplate );
                    }

                }	
            }
        });
	}
}

$(document).on("click", ".school-user input", function(){ 
	$(".list-user-password").not(this).prop('type', 'password');
	if ($(this).hasClass("list-user-password")) {
		$(this).prop('type', 'text');
	}
});

function getSearchSchoolUsers(){

	var searchInput = $("#inp-search-user").val();

    // Store link to api
    var sUrl = "api/api-get-users-from-search.php?\
    fAY2YfpdKvR="+sender+"&\
    search="+searchInput;

    // Do AJAX and phase url
    $.getJSON( sUrl , function( jData ){

        // Content in this variable is what gets append to div #userList
        var sUser = '<div class="school-user">\
        <input type="text" class="list-user-username" value="{{username}}" readonly>\
        <input type="text" class="list-user-first-name" value="{{firstname}}">\
        <input type="text" class="list-user-last-name" value="{{lastname}}">\
        <input type="text" class="list-user-email" value="{{email}}">\
        <input type="text" class="list-user-password" value="{{password}}">\
        <select id="inp-other-user-role" name="option">\
        <option value="4" {{role4}}>Elev</option>\
        <option value="3" {{role3}}>Lærer</option>\
        <option value="2" {{role2}}>Skole administrator</option>\
        </select>\
        <span>\
        <i class="icon-delete-user link fa fa-trash-o" aria-hidden="true"></i>\
        <i class="icon-save-user link fa fa-floppy-o" aria-hidden="true"></i>\
        </span>\
        </div>\
        ';
        // Remove all content from #userList
        $("#other-users-list-content-wrapper").empty();
        // Loop through users
        for( var i = 0 ; i < jData.length ; i++ ){
        	if ( jData[i].userName !== currentUserName ) {
                var sUserTemplate = sUser; // Phase jData to variable by order
                sUserTemplate = sUserTemplate.replace( "{{username}}" , jData[i].userName );
                sUserTemplate = sUserTemplate.replace( "{{firstname}}" , jData[i].firstName );
                sUserTemplate = sUserTemplate.replace( "{{lastname}}" , jData[i].lastName );
                sUserTemplate = sUserTemplate.replace( "{{email}}" , jData[i].eMail );
                sUserTemplate = sUserTemplate.replace( "{{password}}" , jData[i].userPassword );
                if ( jData[i].role == "4") {
                	sUserTemplate = sUserTemplate.replace( "{{role4}}" , "selected" );
                } else if ( jData[i].role == "3") {
                	sUserTemplate = sUserTemplate.replace( "{{role3}}" , "selected" );
                } else {
                	sUserTemplate = sUserTemplate.replace( "{{role2}}" , "selected" );
                }
                $("#other-users-list-content-wrapper").append( sUserTemplate );
            }	
        }
    });
}





// Update school user
function updateSchoolUser(thisClick, username, firsname, lastname, email, password, role){

    // Set up variables for validation
    var validateInput = {
    	username:false,
    	firstName:false,
    	lastName:false,
    	email:false,
    	password: false    
    };


    if ( firsname.length < 1 ) {
    	$(thisClick).parent().parent().find(".list-user-first-name").addClass('wrong-login');
    	validateInput.firstName = false;
    } else {
    	$(thisClick).parent().parent().find(".list-user-first-name").removeClass('wrong-login');
    	validateInput.firstName = true;
    }

    if ( lastname.length < 1 ) {
    	$(thisClick).parent().parent().find(".list-user-last-name").addClass('wrong-login');
    	validateInput.lastName = false;
    } else {
    	$(thisClick).parent().parent().find(".list-user-last-name").removeClass('wrong-login');
    	validateInput.lastName = true;
    }

    if ( reE.test(email) || email == "") {
    	$(thisClick).parent().parent().find(".list-user-email").removeClass('wrong-login');
    	validateInput.email = true;
    } else {
    	$(thisClick).parent().parent().find(".list-user-email").addClass('wrong-login');
    	validateInput.email = false;	
    }

    if ( !reP.test(password) ) { 
    	$(thisClick).parent().parent().find(".list-user-password").addClass('wrong-login');
    	validateInput.password = false;
    	$(".admin-pass-info").show();
    } else {
    	$(thisClick).parent().parent().find(".list-user-password").removeClass('wrong-login');
    	validateInput.password = true;
    	$(".admin-pass-info").hide();
    }

    if ( validateInput.firstName == true && validateInput.lastName == true && validateInput.email == true && validateInput.password == true) {

    	var sUrl = "api/api-update-other-user.php?\
    	fAY2YfpdKvR="+sender+"&\
    	current-username="+currentUserName+"&\
    	username="+username+"&\
    	password="+password+"&\
    	first-name="+firsname+"&\
    	last-name="+lastname+"&\
    	role="+role+"&\
    	email="+email;

    	$.get( sUrl , function( sData ){
    		var jData = JSON.parse(sData); 
    		if( jData.status == "ok" ){
    			swal("", "Brugeren er opdateret", "success");
    			$(thisClick).parent().parent().find("input").css("border", "none");
    			$(thisClick).parent().parent().find("select").css("border", "none");
    			$(thisClick).hide();
    			$(".list-user-password").prop('type', 'password');
    		}
    		else{
    			swal("", "Something went wrong. Please try again later", "error");
    			$(".list-user-password").prop('type', 'password');
    		}
    	});
    }		
}


function listAllUsers() {
	getAllSchoolUsers();
	if ( showSchool !== "") {
		$(".other-users-list-school-info").text("All users on "+showSchool);
	} else {
		$(".other-users-list-school-info").text("Choose a school to see a list of users");
	}
	if(currentUserRole == 2 || currentUserRole == 3){

		if ( showSchool !== "" && hasUnactivatedUsers) {
			$(".unactivated-users-list-school-info").text("Activate users on "+showSchool);
		} else if (!hasUnactivatedUsers){
			$(".unactivated-users-list-school-info").text("");
		}   else if (showSchool !== ""){
			$(".unactivated-users-list-school-info").text("Choose school to see unactivated users");
		}
		getAllUnactivatedStudents();
	}

}


// Delete school user
function deleteSchoolUser(username) {
	var sUrl = "api/api-delete-user.php?\
	fAY2YfpdKvR="+sender+"&\
	current-username="+currentUserName+"&\
	delete-username="+username;

	$.get( sUrl, function(sData){
		var jData = JSON.parse(sData); 
		if( jData.status == "ok" ){
			listAllUsers();
		}		
	});
}

// Accept school user
function acceptSchoolUser(userName) {
	var sUrl = "api/api-activate-user.php?\
	fAY2YfpdKvR="+sender+"&\
	current-userID="+currentUserID+"&\
	delete-username="+userName;

    //$.getJSON( sUrl, function(jData){
    	$.get( sUrl, function(jData){
    		if( jData.status == "ok" ){
    			listAllUsers();
    			setOtherUsersText();
    			location.reload();
    			$(".view-other-users").show();
    			window.location.href = window.location.href;
    		}


    	});
    }

// Delete school user
function deleteAdminUser(username) {
	var sUrl = "api/api-delete-user.php?\
	fAY2YfpdKvR="+sender+"&\
	current-username="+currentUserName+"&\
	delete-username="+username;

	$.getJSON( sUrl, function(jData){
		if( jData.status == "ok" ){
			listAdminUsers();
		}		
	});
}

//List all unactivated users

function getAllUnactivatedStudents(){
	if (showSchoolID != 0){

		if ( currentUserRole == "1" || currentUserRole == "2" || currentUserRole == "3") {

			var sUrl = "api/api-get-unactivated-users-for-user.php?\
			fAY2YfpdKvR="+sender+"&\
			userID="+currentUserID;


			$.getJSON( sUrl , function( jData ){

				var sUser = '<div class="unactivated-school-user">\
				<input type="text" class="list-user-username" value="{{username}}" readonly>\
				<input type="text" class="list-user-first-name" value="{{firstname}}" readonly>\
				<input type="text" class="list-user-last-name" value="{{lastname}}" readonly>\
				<input type="text" class="list-user-email" value="{{email}}" readonly>\
				<span>\
				<i class="icon-delete-user tooltip link fa fa-trash-o" aria-hidden="true"><span class="tooltiptext">Slet bruger</span></i>\
				<i class="icon-activate-user tooltip link fa fa-check" aria-hidden="true"><span class="tooltiptext">Aktiver bruger</span></i>\
				</span>\
				</div>\
				';

				$("#unactivated-users-list-content-wrapper").empty();
                // Loop through users
                for( var i = 0 ; i < jData.length ; i++ ){
                	if ( jData[i].userName !== currentUserName ) {
                		if(currentUserRole == 1 || currentUserRole == 2 || currentUserRole == 3){
                            var sUserTemplate = sUser; // Phase jData to variable by order

                            sUserTemplate = sUserTemplate.replace( "{{username}}" , jData[i].UserName );
                            sUserTemplate = sUserTemplate.replace( "{{firstname}}" , jData[i].FirstName );
                            sUserTemplate = sUserTemplate.replace( "{{lastname}}" , jData[i].LastName );
                            sUserTemplate = sUserTemplate.replace( "{{email}}" , jData[i].Email );

                            $("#unactivated-users-list-content-wrapper").append( sUserTemplate );
                        }

                    }	
                }
            });
		}

	}

}



// List admin users

function listAdminUsers() {
	var sUrl = "api/api-get-users-admin.php?\
	fAY2YfpdKvR="+sender+"&\
	current-username="+currentUserName;

    // Do AJAX and phase url
    $.getJSON( sUrl , function( jData ){

        // Content in this variable is what gets append to div #userList
        var sUser = '<div class="admin-user">\
        <input type="hidden" class="list-admin-username" value="{{username}}" readonly>\
        <i class="icon-delete-admin link fa fa-trash-o" aria-hidden="true"></i>\
        <p class="list-admin list-admin-role"><strong>{{role}}</strong> - </p>\
        <p class="list-admin list-admin-first-name">{{firstname}} </p>\
        <p class="list-admin list-admin-last-name">{{lastname}} </p>\
        <p class="list-admin list-admin-email">- {{email}} </p>\
        <p class="list-admin list-admin-last-login">{{loginTime}} </p>\
        </div>\
        ';
        // Remove all content from #userList
        $("#other-admin-list-content-wrapper").empty();
        // Loop through users
        for( var i = 0 ; i < jData.length ; i++ ){
        	if ( jData[i].userName !== currentUserName ) {
                var sUserTemplate = sUser; // Phase jData to variable by order
                sUserTemplate = sUserTemplate.replace( "{{username}}" , jData[i].userName );
                sUserTemplate = sUserTemplate.replace( "{{firstname}}" , jData[i].firstName );
                sUserTemplate = sUserTemplate.replace( "{{lastname}}" , jData[i].lastName );
                sUserTemplate = sUserTemplate.replace( "{{email}}" , jData[i].eMail );
                if ( jData[i].lastLogin == null ) {
                	sUserTemplate = sUserTemplate.replace( "{{loginTime}}" , "" );
                } else {
                	sUserTemplate = sUserTemplate.replace( "{{loginTime}}" , jData[i].lastLogin );
                }
                if ( jData[i].role == 1 ) {
                	sUserTemplate = sUserTemplate.replace( "{{role}}" , "System administrator" );
                } else if ( jData[i].role == 15 ) {
                	sUserTemplate = sUserTemplate.replace( "{{role}}" , "System observatør" );
                } else {
                	sUserTemplate = sUserTemplate.replace( "{{role}}" , "-" );
                }
                $("#other-admin-list-content-wrapper").append( sUserTemplate );
            }	

        }
    });
}

// Generate a random color for chart
function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
// Convert HEX to RGBA
function hexToRgbA(hex){
	var c;
	if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
		c= hex.substring(1).split('');
		if(c.length== 3){
			c= [c[0], c[0], c[1], c[1], c[2], c[2]];
		}
		c= '0x'+c.join('');
		return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.4)';
	}
	throw new Error('Bad Hex');
}

/**********************************/
//		Maps
/**********************************/

var showUplodeMap = false;
$(document).on("click", ".btn-show-upload-new-map", function(){
	if ( disableMapUp == false ) {
		if ( showUplodeMap == false ) {
			$(".upload-map-selection").slideDown();
			$(".btn-show-upload-new-map").text("Cancel")
			showUplodeMap = true;
		} else {
			$(".upload-map-selection").slideUp();
			$(".btn-show-upload-new-map").text("Add new map");
			showUplodeMap = false;
		}
	}	
});

var optionsMap =
{
	imageBox: '.imageBox',
	thumbBox: '.thumbBox',
	spinner: '.spinner',
}


var currentLocationsOnMap = {
	qr: [],
}

$("#inp-map-name").click(function(){
	if( $(this).hasClass("wrong-login") ){
		$("#inp-map-name").removeClass("wrong-login");
	}
});

// Set html element as Croppie container
var mapPreview = $('#map-preview').croppie({
	viewport: {
		width: 800,
		height: 500
	},
	boundary: {
		width: 900,
		height: 560
	},
	enableExif: true
});

if ( currentUserRole == "1" || currentUserRole == "2" ) {
	var cropper;
    // Colors for points
    redColor = "#ff2626";
    greenColor = "#2E8B57";
    dotColor = redColor;

    // Used to toggle between step 2 and 3
    coord1Set = false;
    coord1Confirmed = false;

    $(document).on("click", "#upload-map-file", function(){
    	mapName = $("#inp-map-name").val();
    	if ( mapName == "" ) {
    		event.preventDefault();
    		$("#inp-map-name").addClass("wrong-login");
    	}
    });
    $(document).on("change", "#upload-map-file", function(){
    	var reader = new FileReader();
    	$(".crop-img-admin").show();
    	reader.onload = function(e) {
            // Display image in Croppie
            mapPreview.croppie('bind', {
            	url: e.target.result
            });
        }
        reader.readAsDataURL(this.files[0]);
    });


    $(document).on("click", "#close-cropper", function(){
    	resetUpload();
    });

    // Toggle between bullet points
    $(document).on("click", "#btn-progress-previous", function(){
    	if($('#andet').attr("class") == "header-progress-item done"){

            // Change bullet color
            $('#andet').removeClass();
            $('#andet').addClass("header-progress-item todo");

            // Go back to setting first 
            $('#map-cropped-canvas-coord2').hide();
            $('#btn-progress-next').text("Next");
            $('#btn-progress-next').removeClass("button-disabled");

            coord1Confirmed = false;

            // Change color of floorplan dot
            dotColor = redColor;
            // Change marker of google map
            markerOptions["icon"] = './img/markers/red_MarkerA.png';

            $('#guide').html("Select a point on the floorplan. <br> Select the corresponding point on Google Maps.");

        }else if($('#første').attr("class") == "header-progress-item done"){

            // Change bullet color
            $('#første').removeClass();
            $('#første').addClass("header-progress-item todo");

            // Reopen cropper
            $('#map-preview').show();
            $('#map-cropped').hide();
            $('#map-cropped-canvas-coord1').hide();
            $('.button-container').hide();
            $('.google-map-container').hide();
            $('#map-cropped').attr("src","");

            // Toggle buttons
            $('#btn-progress-previous').hide();
            $('#btn-progress-next').removeClass("button-disabled");

            $('#guide').html("Drag and zoom on the floorplan for desired crop");
        }
    });

    // Toggle between bullet points
    $(document).on("click", "#btn-progress-next", function(){

    	if($('#første').attr("class") == "header-progress-item todo"){
            // Change bullet color
            $('#første').removeClass();
            $('#første').addClass("header-progress-item done");

            if ( mapName !== "" ) {
            	mapPreview.croppie('result', {
            		type: 'canvas',
            		size: 'viewport'
            	}).then(function(resp) {
            		$('#map-preview').hide();
            		$('#map-cropped').show();
            		$('#map-cropped-canvas-coord1').show();
            		$('.button-container').show();
            		createMap();
            		$('.google-map-container').show();
            		$('#map-cropped').attr("src",resp);
            	});

                // Toggle buttons
                $('#btn-progress-previous').show();
                if (!coord1Set) {
                	$('#btn-progress-next').addClass("button-disabled");
                }

                $('#guide').html("Select a point on the floorplan. <br> Select the corresponding point on Google Maps.");
            }
        }else if($('#andet').attr("class") == "header-progress-item todo" && coord1Set){
            // Change bullet color
            $('#andet').removeClass();
            $('#andet').addClass("header-progress-item done");

            // Show next canvas to mark second coord
            $('#map-cropped-canvas-coord2').show();
            // $('#btn-progress-next').hide();
            $('#btn-progress-next').text("Confirm");
            if (!marker2Set) {
            	$('#btn-progress-next').addClass("button-disabled");
            }

            coord1Confirmed = true;
            // Change color of floorplan dot
            dotColor = greenColor;
            // Change marker of google map
            markerOptions["icon"] = './img/markers/darkgreen_MarkerB.png';


            $('#guide').html("Select a second point on the floorplan, preferably far away from the first point. <br> Select the corresponding point on Google Maps.");

        }   else if($('#andet').attr("class") == "header-progress-item done" && marker2Set){

            // TODO: calculations
            calcDistance();
            calcRotation();
            calcOrigo();

            // TODO: Upload map, distance and rotation to database

            // Upload map, distance and rotation to database
            var img = $('#map-cropped').attr("src");
            dataURItoBlob(img);

            // Reset values
            resetUpload();


        }

    });



    // Make cropped image clickable
    // to get coordinates
    $(".map-cropped-canvas").on("click", function(event) {

    	var imgOffset = $("#map-cropped").offset();

        // Save coords temporarily
        // to calculate ratio later on
        x = parseInt(event.pageX - imgOffset.left);
        y = parseInt(event.pageY - imgOffset.top);

        if (!coord1Set) {
        	coord1Set = true;
        	$('#btn-progress-next').removeClass("button-disabled");
        }

        // Toggle between coordinates
        if (!coord1Confirmed) {
        	coord1Floorplan = {x:x, y:y};
        } else {
        	coord2Floorplan = {x:x, y:y};
        }

        var ctx = this.getContext("2d");

        // Clear canvas in case of multiple clicks
        ctx.clearRect(0, 0, this.width, this.height);

        ctx.fillStyle = dotColor;

        markerSize = 3;
        ctx.beginPath();
        ctx.arc(x, y, markerSize, 0, Math.PI * 2, true);
        ctx.fill();


    });

}

function resetUpload() {
	$("#inp-map-name").val("");
	$("#upload-map-file").val("");
	$(".crop-img-admin").hide();
	$(".upload-map-selection").hide();
	$(".btn-show-upload-new-map").text("Add new map")
	showUplodeMap = false;
	$('#btn-progress-next').text("Next");

	$('#første').removeClass();
	$('#første').addClass("header-progress-item todo");
	$('#andet').removeClass();
	$('#andet').addClass("header-progress-item todo");
	$('#btn-progress-previous').hide();

	if ($('#btn-progress-next').hasClass("button-disabled")) {
		$('#btn-progress-next').removeClass("button-disabled");
	}

    // Reset cropper
    $('#map-preview').show();
    $('#map-cropped').hide();

    // Clear canvases
    var c1 = $('#map-cropped-canvas-coord1')[0];
    var c2 = $('#map-cropped-canvas-coord2')[0];
    var ctx1 = c1.getContext("2d");
    var ctx2 = c2.getContext("2d");
    ctx1.clearRect(0, 0, c1.width, c1.height);
    ctx2.clearRect(0, 0, c2.width, c2.height);
    $('#map-cropped-canvas-coord1').hide();
    $('#map-cropped-canvas-coord2').hide();
    dotColor = redColor;


    $('.button-container').hide();
    $('.google-map-container').hide();

    $('#map-cropped').attr("src","");

    // Toggle previous button
    $('#btn-progress-previous').hide();

    $('#guide').html("Drag and zoom on the floorplan for desired crop");

}

function createMap() {
    // Default DTU address in case institution name is invalid
    var myCenter = new google.maps.LatLng(55.786250, 12.521510);
    var mapCanvas = document.getElementById("google-map");
    var mapOptions = {
    	center: myCenter, 
    	zoom: 18
    };
    map = new google.maps.Map(mapCanvas, mapOptions);
    markerOptions = {
    	map:map, 
    	position:myCenter, 
    	draggable:true, 
    	animation: 
    	google.maps.Animation.DROP,
    	icon: './img/markers/red_MarkerA.png'
    };
    marker1 = new google.maps.Marker(markerOptions);

    map.addListener('click', function(event) {
    	placeMarkerAndRecenter(event.latLng, map);
    });

    geocoder = new google.maps.Geocoder();


    // Center map at institution name
    geocodeAddress(geocoder, map, showSchool);

    $('#submit').on('click', function() {
    	geocodeAddress(geocoder, map, "");
    });



}

function geocodeAddress(geocoder, resultsMap, defaultAddress) {
	var address = "";

	if (defaultAddress != "") {
        // Center map to current institution
        address = defaultAddress;
    } else {
        // Center map to input address
        address = document.getElementById('address').value;
    }
    geocoder.geocode({'address': address}, function(results, status) {
    	if (status === 'OK') {
    		map.setCenter(results[0].geometry.location);
    		placeMarkerAndRecenter(results[0].geometry.location, map);
    	} else {
    		alert('Geocode was not successful for the following reason: ' + status);
    	}
    });
}

marker2Set = false;

function placeMarkerAndRecenter(latLng, map) {

	markerOptions["position"] = latLng;
    // If this is step 3:
    if (!coord1Confirmed) { 
    	marker1.setMap(null); marker1 = null;
    	marker1 = new google.maps.Marker(markerOptions);
    } else {
    	if (marker2Set) {
    		marker2.setMap(null); marker2 = null;
    	} else {
    		marker2Set = true;
    	}
    	marker2 = new google.maps.Marker(markerOptions);
    	$('#btn-progress-next').removeClass("button-disabled");
    }
    map.panTo(latLng);
}

function calcDistance() {
	if (!marker2Set) {
		markerPos = marker1.getPosition();
	} else {
		markerPos = marker2.getPosition();
	}
	var lat = markerPos.lat();
	var lng = markerPos.lng();


	coord1GoogleMaps = marker1.position;
	coord2GoogleMaps = marker2.position;



    // Do calculations
    gmDist = google.maps.geometry.spherical.computeDistanceBetween(coord1GoogleMaps, coord2GoogleMaps);


    var a = Math.abs(coord2Floorplan.x - coord1Floorplan.x);
    var b = Math.abs(coord2Floorplan.y - coord1Floorplan.y);
    var c = Math.sqrt(a*a + b*b);

    scale = c / gmDist;

}

function calcRotation() {
    // Compute rotation of google maps points
    rotGM = google.maps.geometry.spherical.computeHeading(coord1GoogleMaps,coord2GoogleMaps);

    if (rotGM < 0) {
    	rotGM += 360;
    }


    var rotFP = calcRotationFloorPlan(coord1Floorplan,coord2Floorplan);

    rotDifference = rotGM - rotFP;
    if (rotDifference < 0) {
    	rotDifference += 360;
    }

}

function calcRotationFloorPlan(point1, point2){
	var rotFP = 0;
    // Compute rotation of floorplan points (returns in radians)
    if (point1.x> point2.x) {
    	rotFP = Math.atan((point2.y-point1.y) / (point2.x - point1.x))-1/2*Math.PI;
    }

    else{
    	rotFP = Math.atan((point2.y-point1.y) / (point2.x - point1.x))-3/2*Math.PI;
    }

    if (rotFP < 0) {
    	rotFP += 2*Math.PI;
    }

    rotFP *= 180/Math.PI;

    return rotFP;

}
function calcOrigo(){
	var lat = coord1GoogleMaps.lat();
	var lng = coord1GoogleMaps.lng();

	bearing = calcRotationFloorPlan(coord1Floorplan, {x:0,y:0}) + rotDifference;
    //var bearing = 0;
    if (bearing < 0) {
    	bearing += 360;
    }
    else if (bearing > 360) {
    	bearing -= 360;
    }

    var distance = Math.sqrt(coord1Floorplan.x*coord1Floorplan.x+coord1Floorplan.y*coord1Floorplan.y)/scale;
    //var distance = 87.19;


    var R = 6371*1000; // Earth Radius in Km

    origoLat = Math.asin(Math.sin(Math.PI / 180 * lat) * Math.cos(distance / R) + Math.cos(Math.PI / 180 * lat) * Math.sin(distance / R) * Math.cos(Math.PI / 180 * bearing));
    origoLng = Math.PI / 180 * lng + Math.atan2(Math.sin( Math.PI / 180 * bearing) * Math.sin(distance / R) * Math.cos( Math.PI / 180 * lat ), Math.cos(distance / R) - Math.sin( Math.PI / 180 * lat) * Math.sin(origoLat));


}

function postOrigoData(mapID) {


	$.ajax({
		type: "POST",
		url: "api/api-post-origo-data.php",
		data: {
			fAY2YfpdKvR: sender,
            //type: type,
            mapID: mapID,
            lat: origoLat,
            lng: origoLng,
            scale: scale,
            rotDiff: rotDifference
        }, 
        success: function (data) {
        	var jData = JSON.parse(data);
        	if (jData.status == "ok") {

        		$("#inp-map-name").val("");
        		swal("", "Map is uploadet", "success");
        		loadMaps();
        	} else {

        		swal("", "Sadly something went wrong!", "error");
        	}
        }
    })
}

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
    	ia[i] = byteString.charCodeAt(i);
    }

    blob = new Blob([ab], {type: mimeString});
    uploadMapBlob(blob);
}

function uploadMapBlob(blob) {

	var url = (window.URL || window.webkitURL).createObjectURL(blob);
	var mapTitle = $("#inp-map-name").val();
	var APIurl = "api/api-upload-map.php?role="+currentUserRole+"&title="+mapTitle+"&school="+showSchool+"&fAY2YfpdKvR="+sender;

	var filename = "testnavn";
	var data = new FormData();
	data.append('file', blob);

	$.ajax({
		"type":"POST", 
		"url":APIurl,
		"data": data,
		"contentType":false,
		"processData":false,
		"cache":false,
		"dataType": "json",
		success: function(data) {
			if(data.status == "ok") {
                // Post origo data now that mapID is retrieved
                postOrigoData(data.mapID);

            }
            if(data.status == "error") {
            	swal("", "Oops, something went wrong!", "error");
            }
        },    
        error: function() {
        	swal("", "Oops, something went wrong!", "error");
        }
    });
}

// TODO:
function deleteMap(id){

	var sUrl = "api/api-delete-map.php?fAY2YfpdKvR="+sender+"&school="+showSchoolID+"&role="+currentUserRole+"&id="+id;
	$.get( sUrl , function( sData ){
		var jData = JSON.parse(sData);
		if( jData.status == "ok" ){

            /*
            swal({
                    title: "",//TODOMAP
                    text: 'Map '+id+' has been deleted successfully!',
                    type: "error"     
                });
                */

            } 
            if( jData.status == "error" ){
            }
        });
}


var mapAvailable = true;
function loadMaps(){
	if ( showSchool !== "") {

		if(typeof showSchoolID == 'undefined'){
			showSchoolID = showSchool;
		}
		var listWithSchools = document.getElementsByClassName("list-schools-other-users").length;


		var sUrl = "api/api-get-maps.php?fAY2YfpdKvR="+sender+"&school="+showSchoolID;
		$.get( sUrl , function( sData ){

            var jData = JSON.parse(sData);  //We have an array of json !
            $(".map-selection").empty();
            // Content in this variable is what gets append to div #userList
            var sTemp = '<option value="{{MapName}}" data-map-id="{{MapID}}" data-map-url="{{FileName}}" {{selected}}>{{MapName}}</option>';
            // Loop through users
            if ( jData.length !== 0) {

            	$(".map-info-no-map").hide();
            	$(".map-frame").show();
            	$(".btn-delete-selected-map").removeClass("button-disabled");
            	disableMapDel = false;
            	mapAvailable = true;
            	for( var i = 0 ; i < jData.length ; i++ ){
                    var sMapTemplate = sTemp; // Phase jData to variable by order
                    //	MapID = jData[i].MapID; Changed to actual map chosen and not just the first found
                    sMapTemplate = sMapTemplate.replace( "{{MapID}}" , jData[i].MapID );
                    sMapTemplate = sMapTemplate.replace( "{{FileName}}" , jData[i].FileName );
                    sMapTemplate = sMapTemplate.replace( "{{MapName}}" , jData[i].MapName );
                    sMapTemplate = sMapTemplate.replace( "{{MapName}}" , jData[i].MapName );
                    if ($.cookie("setting-default-map") == jData[i].MapID) {
                    	var map_id = $.cookie("setting-default-map");
                    	sMapTemplate = sMapTemplate.replace( "{{selected}}" , "selected" );
                    } else {
                    	sMapTemplate = sMapTemplate.replace( "{{selected}}" , "" );
                    }
                    $(".map-selection").append( sMapTemplate );
                }
            } else {
            	$(".map-info-no-map").show();
            	$(".map-frame").hide();
            	disableMapDel = true;
            	mapAvailable = false;
            	$(".btn-delete-selected-map").addClass("button-disabled");
            }

        }).done(function(){
            //showMap(); //changed showmap
            enableMapUpload();
        });
    } else {
    	noSchoolMap();
    	disableMapUpload();
    }	
}

function noSchoolMap(){
	$(".map-frame").hide();
	$(".map-frame").empty();
	$(".map-selection").empty();
	$(".map-info-no-school").show();
	$(".device-frame").empty();
}

function noUploadMap(){
	$(".map-frame").hide();
	$(".map-frame").empty();
	$(".map-info-no-map").show();
	disableMapDel = true;
}

disableMapUpload();
function disableMapUpload(){
	disableMapUp = true;
	$(".upload-map-selection").slideUp();
	$(".btn-show-upload-new-map").text("Add new map");
	showUplodeMap = false;
	$(".btn-show-upload-new-map, .btn-delete-selected-map").addClass("button-disabled");
}

function enableMapUpload(){
	disableMapUp = false;
	if ( disableMapDel == false ) {
		$(".btn-show-upload-new-map, .btn-delete-selected-map").removeClass("button-disabled");
	} else {
		$(".btn-show-upload-new-map").removeClass("button-disabled");
	}
}

$(document).on('change', '.map-selection', function() {
	showMapVal = $(this).val();
	$('.map-selection').val(showMapVal);
	var mam_id = $('.map-selection option:selected').attr("data-map-id");
	$.cookie("setting-default-map", mam_id);
	resetMapSelection();
	showMap(); 
	setTimeout(function(){
		getDataShowMap();
	}, 1000);
	if (mapShow.live == true) {
		$('.data-map-charts-content-live').remove();
        $("#gettingLiveDataMapDay").show();  //Map selection
    }
});

$(document).on('click', '.btn-delete-selected-map', function() {
	if ( disableMapUp == false && disableMapDel == false ) {
		deleteMap();
	}
});

function showMap(){
	$(".map-frame").empty();
	$(".map-info-no-school").hide();
	mapVal = $(".map-selection").val();
	mapUrl = $(".map-selection option:selected").attr("data-map-url");
	MapID = $(".map-selection option:selected").attr("data-map-id");
	$(".map-selection-head").text(mapVal)
	if ( mapAvailable == true ) {
		$(".map-frame").append( '<img class="bg-map-img" draggable="false" src="'+siteUrl+'map-upload/'+mapUrl+'">' );
	}
    //getAllDevicesFromSchool();
    getAllLocationsFromSchool();
    //placeDeviceOnMap();
    placeLocationOnMap();
    //updataFreeDeviceList();
    devicePositionStart = 0;
}

function deleteMap() {
	mapVal = $(".map-selection").val();
	MapID = $(".map-selection option:selected").attr("data-map-id");

	swal({
		title: "",
		text: 'Are you sure you want to delete this floor plan "'+mapVal+'"?',
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Yes, delete this floor plan",
		closeOnConfirm: true
	},
         // If warning accepted do...
         function (){
         	var sUrl = "api/api-delete-map.php?fAY2YfpdKvR="+sender+"&role="+currentUserRole+"&id="+MapID+"&school="+showSchoolID;
         	$.get( sUrl, function(sData){
         		var jData = JSON.parse(sData);

         		if( jData.status == "ok" ){

         			loadMaps();
         		} 		
         	});

         });
	$(".cancel").html("Cancel");
}

function placeDeviceOnMap() {
	$(".device-frame").empty();
	currentICMetersOnMap.qr = [];


    /*
	var sUrl = "api/api-get-ic-meters-position.php?fAY2YfpdKvR="+sender+"&school="+showSchool+"&mapid="+mapID;
	$.getJSON( sUrl , function( jData ){
		*/
		var sDevice = '<div data-ic-meter-qp="{{qr}}" data-ic-meter-name="{{name}}" class="ic-meter-ico ic-meter-status-0" style="left:{{leftVal}}%;top:{{topVal}}%;">\
		<div class="ic-meter-ico-meta {{metaClass}} {{metaClassEdit}}">\
		<div class="ic-meter-ico-meta-name-wrapper">\
		<p class="ic-meter-ico-meta-name">{{nameShow}}</p>\
		<i class="icon-delete-device-from-map link fa fa-arrow-right" aria-hidden="true"></i>\
		</div>\
		<div class="device-val-wrapper">\
		<p class="ic-meter-ico-meta-tem"><i class="fa fa-thermometer-full"></i> <span></span> ºC</p>\
		<p class="ic-meter-ico-meta-hyd"><i class="fa fa-tint"></i> <span></span> %</p>\
		<p class="ic-meter-ico-meta-co2"><i class="fa fa-cloud"></i> <span></span> ppm</p>\
		<p class="ic-meter-ico-meta-snd-a"><i class="fa fa-microphone"></i> <span></span> dB</p>\
		</div>\
		</div>\
		<div class="dev-radar">\
		<div class="dev-radar-pulse"></div>\
		<div class="dev-radar-pulse"></div>\
		<div class="dev-radar-pulse"></div>\
		<div class="dev-radar-pulse"></div>\
		</div>\
		</div>\
		';

		for (var i=0; i<sensorIDs.length; i++){
			boxQR=sensorIDs[i];
			xAxes=sensorXAxis[i];
			yAxes=sensorYAxis[i];


        var template = sDevice; // Phase jData to variable by order
        template = template.replace( "{{qr}}" , boxQR );
        template = template.replace( "{{leftVal}}" , xAxes );
        template = template.replace( "{{topVal}}" , yAxes );

        currentICMetersOnMap.qr.push(boxQR);

        var boxName = sensorAlias[i];
        var boxAlias = sensorAlias[i];
        var x = xAxes;
        var y = yAxes;

        if ( y < 75 && x < 90) {
        	template = template.replace( "{{metaClass}}" , 'ic-meta-place-ideal' );
        } 
        if ( y > 75 && x < 90 ) {
        	template = template.replace( "{{metaClass}}" , 'ic-meta-place-off-top' );
        }
        if ( y < 75 && x > 90 ) {
        	template = template.replace( "{{metaClass}}" , 'ic-meta-place-off-right' );
        }
        if ( y > 75 && x > 90 ) {
        	template = template.replace( "{{metaClass}}" , 'ic-meta-place-off-top-right' );
        }
        if ( y > 90 && x < 95) {
        	template = template.replace( "{{metaClassEdit}}" , 'ic-meta-place-off-top-edit' );
        }
        if ( y < 90 && x > 95) {
        	template = template.replace( "{{metaClassEdit}}" , 'ic-meta-place-off-right-edit' );
        }
        if ( y > 90 && x > 95) {
        	template = template.replace( "{{metaClassEdit}}" , 'ic-meta-place-off-top-right-edit' );
        }	

        if ( boxAlias == "" ) {
        	template = template.replace( "{{name}}" , boxName );
        	template = template.replace( "{{nameShow}}" , boxName );
        } else {
        	template = template.replace( "{{name}}" , boxAlias );
        	template = template.replace( "{{nameShow}}" , boxAlias );
        }
        $(".device-frame").append( template );

        //	}	//end if
    } // end loop

    //}).done(function(){
    	deviceHasBeenDragged = false;
    	$("#btn-save-devices-placement").addClass("button-disabled");
    	makeDeviceDraggable();
    	if (mapShow.live == true) {
    		getDataShowMap();
    	} else {
    		$(".map-settings-show-info-live-start, .map-settings-show-info-live").addClass("mapLiveInfo");
    		endGetLiveDataForMap();
    		mapShow.live = false;
    		enableMapMonitorSettings = true;
    		$("#btn-map-show-live-data").text("Start livestream")
    		$('.map-show-monitor').attr('disabled', false);
    		setUpDatePickerMap();
    	}
    //});
}


function placeLocationOnMap() {
	$(".device-frame").empty();
	currentLocationsOnMap.qr = [];


	var sDevice = '<div data-ic-meter-qp="{{qr}}" data-ic-meter-name="{{name}}" class="ic-meter-ico ic-meter-status-0" style="left:{{leftVal}}%;top:{{topVal}}%;">\
	<div class="ic-meter-ico-meta {{metaClass}} {{metaClassEdit}}">\
	<div class="ic-meter-ico-meta-name-wrapper">\
	<p class="ic-meter-ico-meta-name">{{nameShow}}</p>\
	<i class="icon-delete-device-from-map link fa fa-arrow-right" aria-hidden="true"></i>\
	</div>\
	<div class="device-val-wrapper">\
	<p class="ic-meter-ico-meta-tem"><i class="fa fa-thermometer-full"></i> <span></span> ºC</p>\
	<p class="ic-meter-ico-meta-hyd"><i class="fa fa-tint"></i> <span></span> %</p>\
	<p class="ic-meter-ico-meta-co2"><i class="fa fa-cloud"></i> <span></span> ppm</p>\
	<p class="ic-meter-ico-meta-snd-a"><i class="fa fa-microphone"></i> <span></span> dB</p>\
	</div>\
	</div>\
	<div class="dev-radar">\
	<div class="dev-radar-pulse"></div>\
	<div class="dev-radar-pulse"></div>\
	<div class="dev-radar-pulse"></div>\
	<div class="dev-radar-pulse"></div>\
	</div>\
	</div>\
	';

	for (var i=0; i<locationIDs.length; i++){
		boxQR=locationIDs[i];
		xAxes=locationXAxis[i];
		yAxes=locationYAxis[i];


        //What is dis:	//if ( jData[i].userName !== currentUserName ) {
        var template = sDevice; // Phase jData to variable by order
        template = template.replace( "{{qr}}" , boxQR );
        template = template.replace( "{{leftVal}}" , xAxes );
        template = template.replace( "{{topVal}}" , yAxes );

        currentLocationsOnMap.qr.push(boxQR);

        var boxName = locationName[i];
        var boxAlias = locationName[i];
        var x = xAxes;
        var y = yAxes;

        if ( y < 75 && x < 90) {
        	template = template.replace( "{{metaClass}}" , 'ic-meta-place-ideal' );
        } 
        if ( y > 75 && x < 90 ) {
        	template = template.replace( "{{metaClass}}" , 'ic-meta-place-off-top' );
        }
        if ( y < 75 && x > 90 ) {
        	template = template.replace( "{{metaClass}}" , 'ic-meta-place-off-right' );
        }
        if ( y > 75 && x > 90 ) {
        	template = template.replace( "{{metaClass}}" , 'ic-meta-place-off-top-right' );
        }
        if ( y > 90 && x < 95) {
        	template = template.replace( "{{metaClassEdit}}" , 'ic-meta-place-off-top-edit' );
        }
        if ( y < 90 && x > 95) {
        	template = template.replace( "{{metaClassEdit}}" , 'ic-meta-place-off-right-edit' );
        }
        if ( y > 90 && x > 95) {
        	template = template.replace( "{{metaClassEdit}}" , 'ic-meta-place-off-top-right-edit' );
        }	

        if ( boxAlias == "" ) {
        	template = template.replace( "{{name}}" , boxName );
        	template = template.replace( "{{nameShow}}" , boxName );
        } else {
        	template = template.replace( "{{name}}" , boxAlias );
        	template = template.replace( "{{nameShow}}" , boxAlias );
        }
        $(".device-frame").append( template );

        //	}	//end if
    } // end loop

    //}).done(function(){
    	deviceHasBeenDragged = false;
    	$("#btn-save-devices-placement").addClass("button-disabled");
    	makeDeviceDraggable();
    	if (mapShow.live == true) {
        // TODO
        getDataShowMap();
    } else {
    	$(".map-settings-show-info-live-start, .map-settings-show-info-live").addClass("mapLiveInfo");
    	endGetLiveDataForMap();
    	mapShow.live = false;
    	enableMapMonitorSettings = true;
    	$("#btn-map-show-live-data").text("Start livestream")
    	$('.map-show-monitor').attr('disabled', false);
    	setUpDatePickerMap();
    }
    //});
}

var mouseOverDeviceIco = false; 
$(document).on("mouseenter",".device-frame-show .ic-meter-ico", function() {
	$(this).css("overflow", "visible");
	$(this).find(".ic-meter-ico-meta").show();
	if ( mouseOverDeviceIco == false ) {
		mouseOverDeviceIco = true;
		if (highlightDeviceFromMap == false) {
			$(".device-frame-show .ic-meter-ico").not(this).fadeTo( 300, 0.33, function(){
				mouseOverDeviceIco = false;
			});
		}
	}
});
$(document).on("mouseleave",".device-frame-show .ic-meter-ico", function() {
	$(".device-frame-show .ic-meter-ico").css("overflow", "hidden");
	$(this).find(".ic-meter-ico-meta").hide();
	if (highlightDeviceFromMap == false) {
		$(".ic-meter-ico").fadeTo( 300, 1 );
	}
});
$(document).on("mouseenter",".device-frame-show", function() {
	$(".device-frame-show .ic-meter-ico").css("overflow", "hidden");
});
$(document).on("mouseleave",".device-frame-show", function() {
	$(".device-frame-show .ic-meter-ico").css("overflow", "visible");
});

$(document).on("click", ".device-frame-show .ic-meter-ico", function(){

	selectedDeviceFromMap = $(this).attr("data-ic-meter-qp");
	$.cookie("set-device", selectedDeviceFromMap);
	$(".chart-select-device-communication").val(selectedDeviceFromMap);
	$(".chart-select-device").val(selectedDeviceFromMap);
    //startCharset();

    if (mapShow.date == true) {
    	highlightDeviceFromMap = true;
    	var thisName = $(this).attr("data-ic-meter-name");
    	$(".device-frame-show .ic-meter-ico").fadeTo( 300, 1 );
    	$(".device-frame-show .ic-meter-ico").not(this).fadeTo( 300, 0.33, function(){
    	});
    	$(".selected-device-from-map p").text("Valgt måler: " + thisName);
    	$(".select-all-map-settings-graph").removeClass("button-disabled");
    	drawMapChart(selectedDeviceFromMap); 
    }
    if (mapShow.date == false) {
    	highlightDeviceFromMap = true;
    	var thisName = $(this).attr("data-ic-meter-name");
    	$(".device-frame-show .ic-meter-ico").fadeTo( 300, 1 );
    	$(".device-frame-show .ic-meter-ico").not(this).fadeTo( 300, 0.33, function(){
    	});
    	$(".selected-device-from-map p").text("Valgt måler: " + thisName);
    	$(".select-all-map-settings-graph-day").removeClass("button-disabled");
    	drawMapChartDay(selectedDeviceFromMap);
    }
});

function resetMapSelection(){
	highlightDeviceFromMap = false;
	$(".select-all-map-settings-graph, .select-all-map-settings-graph-day").addClass("button-disabled");
	$(".selected-device-from-map p").text("Chosen location: No location chosen");
	$(".ic-meter-ico").fadeTo( 300, 1 );
	selectedDeviceFromMap = "";
	$(".map-suggestions-text p").remove();
	$(".map-suggestions-text").append("<p>Choose a location on the map to see current status and possible suggestions for improvements of the indoor climate.</p>");
}

$(document).on("click", ".select-all-map-settings-graph", function(){
	resetMapSelection();
	drawMapChart(true);
});

$(document).on("click", ".select-all-map-settings-graph-day", function(){
	resetMapSelection();
	drawMapChartDay(true);
});

function makeDeviceDraggable(qr){
	$( ".device-frame-edit .ic-meter-ico" ).draggable({
		start: function() {		
			if ( deviceHasBeenDragged == false ) { 	 
				$("#btn-save-devices-placement").removeClass("button-disabled");
			}
			deviceHasBeenDragged = true;
		},
		stop: function() {

			$(this).each(function() {
				$.each(this.attributes, function() {
                    // this.attributes is not a plain object, but an array
                    // of attribute nodes, which contain both the name and value
                    if(this.specified) {

                    }
                });
			});
			var thisDevice = $(this);
            //var thisDevice = $(this).;
            var position = $(this).position();
            var percentTop = ((position.top)*.94/$(".device-frame-edit").height() *100).toFixed(0);
            var percentLeft = ((position.left)*.96/$(".device-frame-edit").width() * 100).toFixed(0);
            updateDevicePosition(thisDevice, percentTop, percentLeft)
        },
        drag: function(){
        },
        containment: "parent"
    });
}

$(document).on("click", "#btn-save-devices-placement", function(){
	if ( deviceHasBeenDragged == true ) { 
		showMap();
	}
});

function updateDevicePosition(device, top, left) {
    //TODO: Device x and y
    //TOP LEFT = X, Y ???



    var qr = $(device).attr("data-ic-meter-qp");
    MapID = $(".map-selection option:selected").attr("data-map-id");
    var sUrl = "api/api-update-nonICMeter-placement.php?SensorID=" + qr +  "&x=" + left + "&y=" + top;
    $.get( sUrl , function( sData ){

    });


    //var sDevice = '<div data-ic-meter-qp="{{qr}}" data-ic-meter-name="{{name}}" class="ic-meter-ico ic-meter-status-0" style="left:{{leftVal}}%;top:{{topVal}}%;">\



}

function updataFreeDeviceList() {

	$("#place-devices-list").empty();
    /*
	var sUrl = "api/api-get-not-placed-ic-meters.php?fAY2YfpdKvR="+sender+"&school="+showSchool;
	*/

    //$.getJSON( sUrl , function( jData ){

    	var sDevice = '<div class="device-on-place-list" data-ic-meter-qp="{{qr}}" data-ic-meter-name="{{name}}">\
    	<i class="icon-add-device-to-map fa fa-arrow-left" aria-hidden="true"></i>\
    	<div class="ic-meter-ico-meta-ico"></div>\
    	<p>{{nameShow}}</p>\
    	</div>\
    	';

    	for( var i = 0 ; i < sensorNullsID.length ; i++ ){

    		var template = sDevice;
    		template = template.replace( "{{qr}}" , sensorNullsID[i]);

    		var boxName = sensorNullsAlias[i];
    		var boxAlias = sensorNullsAlias[i];

    		if ( boxAlias == "" ) {
    			template = template.replace( "{{name}}" , sensorNullsAlias[i] );
    			template = template.replace( "{{nameShow}}" , sensorNullsAlias[i] );
    		} else {
    			template = template.replace( "{{name}}" , sensorNullsAlias[i] );
    			template = template.replace( "{{nameShow}}" , sensorNullsAlias[i] );
    		}
    		$("#place-devices-list").append( template );
    	}
    //	}).done(function(){

    //});				

}

$(document).on("click", ".icon-add-device-to-map", function(){
	if ( mapAvailable == true ) { 
		var qr = $(this).parent().attr("data-ic-meter-qp");
		var name = $(this).parent().attr("data-ic-meter-name");
		var showName = $(this).parent().attr("data-ic-meter-name");
		var sDevice = '<div id="{{id}}" data-ic-meter-qp="{{qr}}" data-ic-meter-name="{{name}}" class="ic-meter-ico ic-meter-status-0" style="left:{{startLeft}}%;top:{{startTop}}%;">\
		<div class="ic-meter-ico-meta">\
		<div class="ic-meter-ico-meta-name-wrapper">\
		<p class="ic-meter-ico-meta-name">{{nameShow}}</p>\
		<i class="icon-delete-device-from-map link fa fa-arrow-right" aria-hidden="true"></i>\
		</div>\
		</div>\
		<div class="dev-radar">\
		<div class="dev-radar-pulse"></div>\
		<div class="dev-radar-pulse"></div>\
		<div class="dev-radar-pulse"></div>\
		<div class="dev-radar-pulse"></div>\
		</div>\
		</div>\
		';

        var template = sDevice; // Phase jData to variable by order
        template = template.replace( "{{qr}}" , qr );
        template = template.replace( "{{name}}" , name );
        template = template.replace( "{{nameShow}}" , showName );
        template = template.replace( "{{startLeft}}" , devicePositionStart );
        template = template.replace( "{{startTop}}" , devicePositionStart );
        template = template.replace("{{id}}",qr);

        $(".device-frame").append( template );					
        makeDeviceDraggable(qr);

        $(this).parent().hide();
        updateDevicePosition($(this).parent(), devicePositionStart, devicePositionStart );
        devicePositionStart += 5;
        if ( devicePositionStart > 90 ) {
        	devicePositionStart = 2.5;
        }
        deviceHasBeenDragged = true;
        $("#btn-save-devices-placement").removeClass("button-disabled");
    }
});

$(document).on("click", ".icon-delete-device-from-map", function(){
	var qr = $(this).parent().parent().parent().attr("data-ic-meter-qp");

	var sUrl = "api/api-update-ic-meter-removement.php?fAY2YfpdKvR="+sender+"&role="+currentUserRole+"&boxqr="+qr;
	$.get( sUrl , function( sData ){
		var jData = JSON.parse(sData); 
		if( jData.status == "ok" ){
			showMap();
		} else {
			swal({
				title: "",
				text: 'Måler kan ikke fjernes',
				type: "error"     
			});
		}
	});
});

// Map show

$(".update-map-settings-graph").click(function(){
	resetMapSelection();
	drawMapChart(false);
});

$(".update-map-settings-graph-day").click(function(){
	resetMapSelection();
	drawMapChartDay(false);
});

var mapShow = {
	live: false,
	date: false,
	dateSelect: "",
	monitor: {
		temperature: false,
		humidity: false,
		co2: false,
		noiseAvg: false
	},
	liveTime: {
		startDate:false,
		startTime:false, 
		endDate:false,
		endTime: 23+hourDiff+":55:00"
	},
}

if ($.cookie("setting-default-map-temperature") == "true") {
	$("#check-map-data-temperature").prop('checked', true);
	mapShow.monitor.temperature = true;
} else {
	$("#check-map-data-temperature").prop('checked', false);
	mapShow.monitor.temperature = false;
}

if ($.cookie("setting-default-map-humidity") == "true") {
	$("#check-map-data-humidity").prop('checked', true);
	mapShow.monitor.humidity = true;
} else {
	$("#check-map-data-humidity").prop('checked', false);
	mapShow.monitor.humidity = false;
}

if ($.cookie("setting-default-map-co2") == "true") {
	$("#check-map-data-co2").prop('checked', true);
	mapShow.monitor.co2 = true;
} else {
	$("#check-map-data-co2").prop('checked', false);
	mapShow.monitor.co2 = false;
}

if ($.cookie("setting-default-map-noiseAvg") == "true") {
	$("#check-map-data-noiseAvg").prop('checked', true);
	mapShow.monitor.noiseAvg = true;
} else {
	$("#check-map-data-noiseAvg").prop('checked', false);
	mapShow.monitor.noiseAvg = false;
}

$('#check-map-data-temperature').change(function() {
	if ( enableMapMonitorSettings == true ) {
		clickSelectorLiveChart = false;
		if ($(this).is(":checked")) {
			mapShow.monitor.temperature = true;
			$(".device-frame-show .ic-meter-ico").removeClass("ic-meter-status-0 ic-meter-status-1 ic-meter-status-2 ic-meter-status-3");
			$(".map-settings-show-info-live").addClass("mapLiveInfo");
			if ( mapShow.live == true ) {
				getDataShowMap();
			} else {
				changeDateRangeSlider();
			}
			$.cookie("setting-default-map-temperature", true);
		} else {
			mapShow.monitor.temperature = false;
			$(".device-frame-show .ic-meter-ico").removeClass("ic-meter-status-0 ic-meter-status-1 ic-meter-status-2 ic-meter-status-3");
			$(".map-settings-show-info-live").addClass("mapLiveInfo");
			if ( mapShow.live == true ) {
				getDataShowMap();
			} else {
				changeDateRangeSlider();
			}
			$.cookie("setting-default-map-temperature", false);
		}
		if (mapShow.live == true) {
			$('.data-map-charts-content-live').remove();
			$("#gettingLiveDataMapDay").show();
		}
	}
	if (highlightDeviceFromMap == false) {
		drawMapChart(true);	
	} else {
		drawMapChart(selectedDeviceFromMap);
	}
});

$('#check-map-data-humidity').change(function() {
	if ( enableMapMonitorSettings == true ) {
		clickSelectorLiveChart = false;
		if ($(this).is(":checked")) {
			mapShow.monitor.humidity = true;
			$(".device-frame-show .ic-meter-ico").removeClass("ic-meter-status-0 ic-meter-status-1 ic-meter-status-2 ic-meter-status-3");
			$(".map-settings-show-info-live").addClass("mapLiveInfo");
			if ( mapShow.live == true ) {
				getDataShowMap();
			} else {
				changeDateRangeSlider();
			}
			$.cookie("setting-default-map-humidity", true)
		} else {
			mapShow.monitor.humidity = false;
			$(".device-frame-show .ic-meter-ico").removeClass("ic-meter-status-0 ic-meter-status-1 ic-meter-status-2 ic-meter-status-3");
			$(".map-settings-show-info-live").addClass("mapLiveInfo");
			if ( mapShow.live == true ) {
				getDataShowMap();
			} else {
				changeDateRangeSlider();
			}
			$.cookie("setting-default-map-humidity", false)
		}
		if (mapShow.live == true) {
			$('.data-map-charts-content-live').remove();
			$("#gettingLiveDataMapDay").show();
		}
	}
	if (highlightDeviceFromMap == false) {
		drawMapChart(true);	
	} else {
		drawMapChart(selectedDeviceFromMap);
	}
});

$('#check-map-data-co2').change(function() {
	if ( enableMapMonitorSettings == true ) {
		clickSelectorLiveChart = false;
		if ($(this).is(":checked")) {
			mapShow.monitor.co2 = true;
			$(".device-frame-show .ic-meter-ico").removeClass("ic-meter-status-0 ic-meter-status-1 ic-meter-status-2 ic-meter-status-3");
			$(".map-settings-show-info-live").addClass("mapLiveInfo");
			if ( mapShow.live == true ) {
				getDataShowMap();
			} else {
				changeDateRangeSlider();
			}
			$.cookie("setting-default-map-co2", true)
		} else {
			mapShow.monitor.co2 = false;
			$(".device-frame-show .ic-meter-ico").removeClass("ic-meter-status-0 ic-meter-status-1 ic-meter-status-2 ic-meter-status-3");
			$(".map-settings-show-info-live").addClass("mapLiveInfo");
			if ( mapShow.live == true ) {
				getDataShowMap();
			} else {
				changeDateRangeSlider();
			}
			$.cookie("setting-default-map-co2", false)
		}
		if (mapShow.live == true) {
			$('.data-map-charts-content-live').remove();
			$("#gettingLiveDataMapDay").show();
		}
	}	
	if (highlightDeviceFromMap == false) {
		drawMapChart(true);	
	} else {
		drawMapChart(selectedDeviceFromMap);
	}
});

$('#check-map-data-noiseAvg').change(function() {
	if ( enableMapMonitorSettings == true ) {
		clickSelectorLiveChart = false;
		if ($(this).is(":checked")) {
			mapShow.monitor.noiseAvg = true;
			$(".device-frame-show .ic-meter-ico").removeClass("ic-meter-status-0 ic-meter-status-1 ic-meter-status-2 ic-meter-status-3");
			$(".map-settings-show-info-live").addClass("mapLiveInfo");
			if ( mapShow.live == true ) {
				getDataShowMap();
			} else {
				changeDateRangeSlider();
			}
			$.cookie("setting-default-map-noiseAvg", true)
		} else {
			mapShow.monitor.noiseAvg = false;
			$(".device-frame-show .ic-meter-ico").removeClass("ic-meter-status-0 ic-meter-status-1 ic-meter-status-2 ic-meter-status-3");
			$(".map-settings-show-info-live").addClass("mapLiveInfo");
			if ( mapShow.live == true ) {
				getDataShowMap();
			} else {
				changeDateRangeSlider();
			}
			$.cookie("setting-default-map-noiseAvg", false)
		}
		if (mapShow.live == true) {
			$('.data-map-charts-content-live').remove();
			$("#gettingLiveDataMapDay").show();
		}
	}	
	if (highlightDeviceFromMap == false) {
		drawMapChart(true);	
	} else {
		drawMapChart(selectedDeviceFromMap);
	}
});

$(document).on("click", "#btn-map-show-live-data", function(){
	resetMapSelection();
	liveStreemOnOff();
});

function liveStreemOnOff() {

	$(".data-map-charts-wrapper").css("display", "none").removeClass("flex");
	$('.data-map-charts-content').remove();
	if ( showSchool !== "" ) {
		if ( mapShow.live == false ) {

			mapShow.live = true;
			$(".device-frame-show .ic-meter-ico").css("overflow", "visible");
			$(".map-settings-show-info-date").addClass("mapLiveInfo");
			$(".ic-meter-ico").removeClass("ic-meter-data-status-0 ic-meter-data-status-1 ic-meter-data-status-2 ic-meter-data-status-3 ic-meter-data-status-4");
			getDataShowMap();
            //Ovenstående gør så der kommer en animation på henter data
            enableMapMonitorSettings = false;
            $("#btn-map-show-live-data").text("Stop livestream")
            $('.map-show-monitor').attr('disabled', true);
            setUpDatePickerMap();
            //$(".data-map-charts-wrapper-live").css("display", "flex").addClass("flex");
            //Ovenstående gør så der bliver opdateret data til graferne - og viser faktisk komponenter fra graf viewet, selv i plantegningen

            $("#gettingLiveDataMapDay").show();
        } else {
        	mapShow.live = false;
        	$(".map-settings-show-info-live-start, .map-settings-show-info-live").addClass("mapLiveInfo");
        	endGetLiveDataForMap();
        	enableMapMonitorSettings = true;
        	$("#btn-map-show-live-data").text("Start livestream")
        	$('.map-show-monitor').attr('disabled', false);
        	$(".map-info-date-time").hide();
        	$(".data-map-charts-wrapper-live").hide();
        	$('.data-map-charts-content-live').remove();
        }
        mapShow.date = false;
        $("#map-set-timerange").prop('disabled', true);
        $(".ico-map-auto-play-start").addClass("graySlider");
        $("input[type=range]").addClass("hideRange");
    }

}

setUpDatePickerMap();
function setUpDatePickerMap() {
	$('#btn-map-select-date').daterangepicker({
		singleDatePicker: true,
		showDropdowns: true,
		minDate: new Date(2000, 1 - 1, 1),
		maxDate: moment(),
	}, 
	function(start) {
		$(".data-map-charts-wrapper-live").hide();
		resetMapSelection();
		endGetLiveDataForMap();
		mapShow.live = false;
		mapShow.date = true;
		$(".map-settings-show-info-live-start, .map-settings-show-info-live").addClass("mapLiveInfo");
		mapShow.dateSelect = start.format("YYYY-MM-DD");
		var showDate = start.format("DD MMMM YYYY");
		$(".map-show-date").empty();
		$(".map-show-date").append(showDate);
		$("#btn-map-show-live-data").text("Start livestream");
		$(".ico-map-auto-play-start").addClass("graySlider");
		$(".map-info-date-time").show();
		getDataShowMap();

	});
}

$("#map-set-timerange").prop('disabled', true);
$(".ico-map-auto-play-start").addClass("graySlider");
$("input[type=range]").addClass("hideRange");

$("#map-set-timerange").on("input change", function() { 
	clearInterval(mapPlayInterval);
	$(".ico-map-auto-play-stop").hide();
	$(".ico-map-auto-play-start").show();
	mapAutoPlay = true;
	changeDateRangeSlider();
});

$(document).on("click", ".ico-map-auto-play", function(){
	if ( mapShow.date == true ) {
		SetMapAutoPlay();
	} else {
		updateMapChartLine();
	}
});
SetMapAutoPlay();
var mapPlayInterval;
function SetMapAutoPlay() {
	if ( mapAutoPlay == false ) {
		clearInterval(mapPlayInterval);
		$(".ico-map-auto-play-stop").hide();
		$(".ico-map-auto-play-start").show();
		mapAutoPlay = true;
	} else {
		$(".ico-map-auto-play-start").hide();
		$(".ico-map-auto-play-stop").show();
		mapAutoPlay = false;
		mapSetAutoPlay();
		updateMapChartLine();
	}
}

function mapSetAutoPlay() {
	var rangeVal = $("#map-set-timerange").val();
	mapPlayInterval = setInterval(function(){
		if ( rangeVal >= mapShowData.dates.length ) {
			rangeVal = 0;
		} else {
			rangeVal++;
			$("#map-set-timerange").val(rangeVal);
		}
		changeDateRangeSlider();
	}, updateMapGraphLineTime);
}

function getDataShowMap() {
	if ( mapShow.live == true) {
		$(".map-settings-show-info-live-start").removeClass("mapLiveInfo");
		startGetLiveDataForMap();
	} else if (mapShow.date == true) {
		$(".map-settings-show-info-live-start").removeClass("mapLiveInfo");
		startGetDateDataForMap();
	}
}

function startGetLiveDataForMap() {

    //TODO - lav til influx - BRUG IKKE API MEN LISTE ALLEREDE LAVET

    clearInterval(mapPlayInterval);
    $(".ico-map-auto-play-stop").hide();
    $(".ico-map-auto-play-start").show();
    mapAutoPlay = false; 
    mapShow.liveTime.startDate = moment().format('YYYY-MM-DD');
    mapShow.liveTime.endDate = moment().format('YYYY-MM-DD');
    start(false);
    function start(redraw) {
    	$(".device-val-wrapper").hide();
    	$(".map-info-date-time").show();
    	$(".map-info-date-time").text(moment().format('HH:mm'));
    	var qr = currentLocationsOnMap.qr;
    	mapShow.liveTime.startTime = moment().subtract(10, "minutes").utc().format('HH:mm:ss');

    	if ( qr.length == 0 ) {
    		$(".map-settings-show-info-live-start, .map-settings-show-info-live").addClass("mapLiveInfo");
    		enableMapMonitorSettings = true;
    	} 
    	var runCounter = 0;

    	for (i = 0; i < locationIDs.length; i++) { 	


    		thisQr = locationIDs[i];


    		var phaseTemperature = temperature[i];
    		var phaseHumidity = humidity[i];
    		var phaseCo2 = co2[i];
    		var phaseNoise = noise[i];

    		drawDataMapLive(thisQr, phaseTemperature, phaseHumidity, phaseCo2, phaseNoise)

    		runCounter++;
    		if (runCounter == qr.length) {
    			mapShowDataFetchDone();
    			clearInterval(getLiveDataForMapDay);
    			if (clickSelectorLiveChart == true) {
                    //liveUpdateMapDay();
                } else {
                	drawMapChartDay(true)
                }
                clickSelectorLiveChart = true;
                getLiveDataForMapDay = setInterval(function(){
                	mapLiveDataFirstLoad = false;
                	resetMapSelection();
                    //liveUpdateMapDay();
                }, 300000);
                if (redraw) {
                	setTimeout(() => {
                		drawMapChartDay(selectedDeviceFromMap);
                	}, 1000);
                }
            }

        }
    }
    clearInterval(getLiveDataForMap);
    getLiveDataForMap = setInterval(function(){
    	$(".device-frame-show .ic-meter-ico").removeClass("ic-meter-status-0 ic-meter-status-1 ic-meter-status-2 ic-meter-status-3");
    	$(".map-settings-show-info-live").addClass("mapLiveInfo");
    	start(true);
    }, 300000);



}

function mapShowDataFetchDone() {
	$(".map-settings-show-info-live-start").addClass("mapLiveInfo");
	$(".map-settings-show-info-live").removeClass("mapLiveInfo");
	$('.map-show-monitor').attr('disabled', false);
	enableMapMonitorSettings = true;
}

function endGetLiveDataForMap(){
	clearInterval(getLiveDataForMapDay);
	clearInterval(getLiveDataForMap);
	$(".device-frame-show .ic-meter-ico").removeClass("ic-meter-status-0 ic-meter-status-1 ic-meter-status-2 ic-meter-status-3");
	$(".device-val-wrapper").hide();
}

function drawDataMapLive(qr, tem, hum, co2, noiA) {


	var colors = {
		white:"#ffffff",
		yellow:"#e8b72c",
		red:"#ff4242"
	};
	var thisDevice = $(".device-frame-show").find("[data-ic-meter-qp='" + qr + "']");
	thisDevice.removeClass("ic-meter-status-0 ic-meter-status-1 ic-meter-status-2 ic-meter-status-3");
	thisDevice.find(".device-val-wrapper p").css("color", "#ffffff");
	var warningLevel = 1;
	thisDevice.find(".device-val-wrapper").show();
	thisDevice.find(".device-val-wrapper span:eq(0)").text(tem);
	thisDevice.find(".device-val-wrapper span:eq(1)").text(hum);
	thisDevice.find(".device-val-wrapper span:eq(2)").text(co2);
	thisDevice.find(".device-val-wrapper span:eq(3)").text(noiA);
	if ( mapShow.monitor.temperature == true ) {
		if ( tem < 20 ) {
			thisDevice.find(".device-val-wrapper p:eq(0)").css("color", colors.red); 
			if ( warningLevel < 3 ) { warningLevel = 3; }; 
		} else if ( tem > 19 && tem < 21 ) {
			thisDevice.find(".device-val-wrapper p:eq(0)").css("color", colors.yellow); 
			if ( warningLevel < 2 ) { warningLevel = 2; }; 
		} else if ( tem > 21 && tem < 23 ) {
			thisDevice.find(".device-val-wrapper p:eq(0)").css("color", colors.white);
		} else if ( tem > 22 && tem < 25 ) {
			thisDevice.find(".device-val-wrapper p:eq(0)").css("color", colors.yellow); 
			if ( warningLevel < 2 ) { warningLevel = 2; }; 
		} else if ( tem > 24 ) {
			thisDevice.find(".device-val-wrapper p:eq(0)").css("color", colors.red); 
			if ( warningLevel < 3 ) { warningLevel = 3; }; 
		} else {
			thisDevice.find(".device-val-wrapper p:eq(0)").css("color", colors.white);
		}
	}
	if ( mapShow.monitor.humidity == true ) { 
		if ( hum < 20 ) {
			thisDevice.find(".device-val-wrapper p:eq(1)").css("color", colors.red); 
			if ( warningLevel < 3 ) { warningLevel = 3; }; 
		} else if ( hum > 19 && hum < 30 ) {
			thisDevice.find(".device-val-wrapper p:eq(1)").css("color", colors.yellow); 
			if ( warningLevel < 2 ) { warningLevel = 2; }; 
		} else if ( hum > 29 && hum < 61 ) {
			thisDevice.find(".device-val-wrapper p:eq(1)").css("color", colors.white);
		} else if ( hum > 60 && hum < 71 ) {
			thisDevice.find(".device-val-wrapper p:eq(1)").css("color", colors.yellow); 
			if ( warningLevel < 2 ) { warningLevel = 2; }; 
		} else if ( hum > 70 ) {
			thisDevice.find(".device-val-wrapper p:eq(1)").css("color", colors.red); 
			if ( warningLevel < 3 ) { warningLevel = 3; }; 
		} else {
			thisDevice.find(".device-val-wrapper p:eq(1)").css("color", colors.white);
		}
	}
	if ( mapShow.monitor.co2 == true ) {
		if ( co2 < 1000 ) {
			thisDevice.find(".device-val-wrapper p:eq(2)").css("color", colors.white);
		} else if ( co2 > 999 && co2 < 2000 ) {
			thisDevice.find(".device-val-wrapper p:eq(2)").css("color", colors.yellow); 
			if ( warningLevel < 2 ) { warningLevel = 2; }; 
		} else if ( co2 > 1999 ) {
			thisDevice.find(".device-val-wrapper p:eq(2)").css("color", colors.red); 
			if ( warningLevel < 3 ) { warningLevel = 3; }; 
		} else {
			thisDevice.find(".device-val-wrapper p:eq(2)").css("color", colors.white);
		}
	}
	if ( mapShow.monitor.noiseAvg == true ) {
		if ( noiA < 50 ) {
			thisDevice.find(".device-val-wrapper p:eq(3)").css("color", colors.white);
		} else if ( noiA > 49 && noiA < 70 ) {
			thisDevice.find(".device-val-wrapper p:eq(3)").css("color", colors.yellow);
			if ( warningLevel < 2 ) { warningLevel = 2; }; 
		} else if ( noiA > 69 ) {
			thisDevice.find(".device-val-wrapper p:eq(3)").css("color", colors.red); 
			if ( warningLevel < 3 ) { warningLevel = 3; }; 
		} else {
			thisDevice.find(".device-val-wrapper p:eq(3)").css("color", colors.white);
		}
	}
	thisDevice.addClass("ic-meter-status-"+warningLevel);
}

var mapShowData = {
	qr: [],
	name: [],
	color: [],
	dates: [],
	times: [],
	temperature: [],
	humidity: [],
	co2: [],
	noise: []
};

function clearMapShowData() {
	mapShowData = {
		qr: [],
		name: [],
		dates: [],
		color: [],
		times: [],
		qr: [],
		time: [],
		temperature: [],
		humidity: [],
		co2: [],
		noise: [],
	};
}

function startGetDateDataForMap() {
	clearMapShowData();
	clearInterval(mapPlayInterval);
	$("#map-set-timerange").prop('disabled', true);
	$("input[type=range]").addClass("hideRange");
	$(".ico-map-auto-play-stop").hide();
	$(".ico-map-auto-play-start").show();
	mapAutoPlay = false;

	$(".map-settings-show-info-date").addClass("mapLiveInfo");
	var qr = currentICMetersOnMap.qr;
	var date = mapShow.dateSelect
	var startTime = 00+hourDiff+":00:00";
	var endTime = 23+hourDiff+":55:00"; 
	var runCounter = 0;
	var dateDataLenght = 0;



}

function mapShowDataFetchDateDone() {
	$(".data-map-charts-wrapper").css("display", "flex").addClass("flex");
	$(".map-settings-show-info-live-start").addClass("mapLiveInfo");
	$(".map-settings-show-info-date").removeClass("mapLiveInfo");
	$("#map-set-timerange").prop('disabled', false);
	$(".ico-map-auto-play-start").removeClass("graySlider");
	$("input[type=range]").removeClass("hideRange");
	$(".ico-map-auto-play-stop").hide();
	$(".ico-map-auto-play-start").show();
	mapAutoPlay = true;
	changeDateRangeSlider();
	mapShowGetDeviceAlias();
}

function mapShowGetDeviceAlias() {
	var counter=0;
	for (i = 0; i < mapShowData.qr.length; i++) {
		counter++;
		if (counter == mapShowData.qr.length) {
			drawMapChart(false);
		}
	}
}

function changeDateRangeSlider() {
	var thisTime = mapShowData.dates[$("#map-set-timerange").val()];
	if ( thisTime ) {
		var thisTimeEdit = thisTime.slice(-5);
	}
	$(".map-show-time span, .map-info-date-time").text(thisTimeEdit);
	drawDataMapDate($("#map-set-timerange").val());
}

function drawDataMapDate(val) {
	$(".ic-meter-ico").removeClass("ic-meter-data-status-0 ic-meter-data-status-1 ic-meter-data-status-2 ic-meter-data-status-3 ic-meter-data-status-4");
	for (i = 0; i < mapShowData.qr.length; i++) { 	
		var thisDevice = $(".device-frame-show").find("[data-ic-meter-qp='" + mapShowData.qr[i] + "']");
		thisDevice.find(".device-val-wrapper p").css("color", "#ffffff");
		var tem = mapShowData.temperature[i][val];
		var hum =  mapShowData.humidity[i][val];
		var co2 =  mapShowData.co2[i][val];
		var noiA = mapShowData.noise[i][val];
		if (tem) {
			thisDevice.find(".device-val-wrapper").show();
		} else {
			thisDevice.find(".device-val-wrapper").hide();
		}
		var warningLevel = 1;
		thisDevice.find(".device-val-wrapper span:eq(0)").text(tem);
		thisDevice.find(".device-val-wrapper span:eq(1)").text(hum);
		thisDevice.find(".device-val-wrapper span:eq(2)").text(co2);
		thisDevice.find(".device-val-wrapper span:eq(3)").text(noiA);

		if (tem) {
			if ( mapShow.monitor.temperature == true ) { 
				if (tem < 20 ) {
					thisDevice.find(".device-val-wrapper p:eq(0)").css("color", "#ff4242"); 
					if ( warningLevel < 3 ) { warningLevel = 3; }; 
				} else if (tem > 19 && tem < 21 ) {
					thisDevice.find(".device-val-wrapper p:eq(0)").css("color", "#e8b72c"); 
					if ( warningLevel < 2 ) { warningLevel = 2; }; 
				} else if (tem > 21 && tem < 23 ) {
					thisDevice.find(".device-val-wrapper p:eq(0)").css("color", "#ffffff");
				} else if (tem > 22 && tem < 25 ) {
					thisDevice.find(".device-val-wrapper p:eq(0)").css("color", "#e8b72c"); 
					if ( warningLevel < 2 ) { warningLevel = 2; }; 
				} else if ( tem > 24 ) {
					thisDevice.find(".device-val-wrapper p:eq(0)").css("color", "#ff4242"); 
					if ( warningLevel < 3 ) { warningLevel = 3; }; 
				} else {
					thisDevice.find(".device-val-wrapper p:eq(0)").css("color", "#ffffff");
				}
			}
			if ( mapShow.monitor.humidity == true ) { 
				if ( hum < 20 ) {
					thisDevice.find(".device-val-wrapper p:eq(1)").css("color", "#ff4242"); 
					if ( warningLevel < 3 ) { warningLevel = 3; }; 
				} else if ( hum > 19 && hum < 30 ) {
					thisDevice.find(".device-val-wrapper p:eq(1)").css("color", "#e8b72c"); 
					if ( warningLevel < 2 ) { warningLevel = 2; }; 
				} else if ( hum > 29 && hum < 61 ) {
					thisDevice.find(".device-val-wrapper p:eq(1)").css("color", "#ffffff");
				} else if ( hum > 60 && hum < 71 ) {
					thisDevice.find(".device-val-wrapper p:eq(1)").css("color", "#e8b72c"); 
					if ( warningLevel < 2 ) { warningLevel = 2; }; 
				} else if ( hum > 70 ) {
					thisDevice.find(".device-val-wrapper p:eq(1)").css("color", "#ff4242"); 
					if ( warningLevel < 3 ) { warningLevel = 3; }; 
				} else {
					thisDevice.find(".device-val-wrapper p:eq(1)").css("color", "#ffffff");
				}
			}
			if ( mapShow.monitor.co2 == true ) {
				if ( co2 < 1000 ) {
					thisDevice.find(".device-val-wrapper p:eq(2)").css("color", "#ffffff");
				} else if ( co2 > 999 && co2 < 2000 ) {
					thisDevice.find(".device-val-wrapper p:eq(2)").css("color", "#e8b72c"); 
					if ( warningLevel < 2 ) { warningLevel = 2; }; 
				} else if ( co2 > 1999 ) {
					thisDevice.find(".device-val-wrapper p:eq(2)").css("color", "#ff4242"); 
					if ( warningLevel < 3 ) { warningLevel = 3; }; 
				} else {
					thisDevice.find(".device-val-wrapper p:eq(2)").css("color", "#ffffff");
				}
			}
			if ( mapShow.monitor.noiseAvg == true ) {
				if ( noiA < 50 ) {
					thisDevice.find(".device-val-wrapper p:eq(3)").css("color", "#ffffff");
				} else if ( noiA > 49 && noiA < 70 ) {
					thisDevice.find(".device-val-wrapper p:eq(3)").css("color", "#e8b72c");
					if ( warningLevel < 2 ) { warningLevel = 2; }; 
				} else if ( noiA > 69 ) {
					thisDevice.find(".device-val-wrapper p:eq(3)").css("color", "#ff4242"); 
					if ( warningLevel < 3 ) { warningLevel = 3; }; 
				} else {
					thisDevice.find(".device-val-wrapper p:eq(3)").css("color", "#ffffff");
				}
			}
			thisDevice.addClass("ic-meter-data-status-"+warningLevel);
		} else {
			thisDevice.addClass("ic-meter-data-status-0");
		}
	}
	setTimeout(function(){
		updateMapChartLine();
	},10);
}

// Show climate Advices
function printAdvice(qr) {
	var CurTemp;
	var CurHum;
	var CurCo2;
	var CurNoi;
	for (var i = 0; i < mapShowDataLive.qr.length; i++) {
		if (mapShowDataLive.qr[i] == qr) {
			CurTemp = mapShowDataLive.temperature[i][mapShowDataLive.temperature[i].length - 1];
			CurHum = mapShowDataLive.humidity[i][mapShowDataLive.humidity[i].length - 1];
			CurCo2 = mapShowDataLive.co2[i][mapShowDataLive.co2[i].length - 1];
			CurNoi = mapShowDataLive.noise[i][mapShowDataLive.noise[i].length - 1];
			selectAdvice();
		}
	}
	function selectAdvice(){
		$(".map-suggestions-text p").remove();
		var statusBad = false;
		if (CurTemp < 20) {
			$(".map-suggestions-text").append("<p>" + liveAdvices.tem1 + "</p>");
			statusBad = true;
		} else if (CurTemp > 19 && CurTemp < 21) {
			$(".map-suggestions-text").append("<p>" + liveAdvices.tem2 + "</p>");
			statusBad = true;
		} else if (CurTemp > 21 && CurTemp < 23) {
		} else if (CurTemp > 22 && CurTemp < 25) {
			$(".map-suggestions-text").append("<p>" + liveAdvices.tem3 + "</p>");
			statusBad = true;
		} else if (CurTemp > 24) {
			$(".map-suggestions-text").append("<p>" + liveAdvices.tem4 + "</p>");
			statusBad = true;
		} else {
		}

		if (CurHum < 20) {
			$(".map-suggestions-text").append("<p>" + liveAdvices.hum1 + "</p>");
			statusBad = true;
		} else if (CurHum > 19 && CurHum < 30) {
			$(".map-suggestions-text").append("<p>" + liveAdvices.hum2 + "</p>");
			statusBad = true;
		} else if (CurHum > 29 && CurHum < 61) {
		} else if (CurHum > 60 && CurHum < 71) {
			$(".map-suggestions-text").append("<p>" + liveAdvices.hum3 + "</p>");
			statusBad = true;
		} else if (CurHum > 70) {
			$(".map-suggestions-text").append("<p>" + liveAdvices.hum4 + "</p>");
			statusBad = true;
		} else {
		}

		if (CurCo2 < 1000) {
		} else if (CurCo2 > 999 && CurCo2 < 2000) {
			$(".map-suggestions-text").append("<p>" + liveAdvices.co21 + "</p>");
			statusBad = true;
		} else if (CurCo2 > 1999) {
			$(".map-suggestions-text").append("<p>" + liveAdvices.co22 + "</p>");
			statusBad = true;
		} else {
		}

		if (CurNoi < 50) {
		} else if (CurNoi > 49 && CurNoi < 70) {
			$(".map-suggestions-text").append("<p>" + liveAdvices.noi1 + "</p>");
			statusBad = true;
		} else if (CurNoi > 69) {
			$(".map-suggestions-text").append("<p>" + liveAdvices.noi2 + "</p>");
			statusBad = true;
		} else {
		}
		if (statusBad == false) {
			$(".map-suggestions-text").append("<p>No suggestions of improvement! The indoor climate is good.</p>");
		}
	}
}

// Auto update live data (24 hour)
var mapLiveDataFirstLoad = true;
var mapShowDataLiveColor = [];
var mapShowDataLive = {
	qr: [],
	name: [],
	temperature: [],
	humidity: [],
	co2: [],
	noise: [],
	times: ["00:05","00:10","00:15","00:20","00:25","00:30","00:35","00:40","00:45","00:50","00:55","01:00","01:05","01:10","01:15","01:20","01:25","01:30","01:35","01:40","01:45","01:50","01:55","02:00","02:05","02:10","02:15","02:20","02:25","02:30","02:35","02:40","02:45","02:50","02:55","03:00","03:05","03:10","03:15","03:20","03:25","03:30","03:35","03:40","03:45","03:50","03:55","04:00","04:05","04:10","04:15","04:20","04:25","04:30","04:35","04:40","04:45","04:50","04:55","05:00","05:05","05:10","05:15","05:20","05:25","05:30","05:35","05:40","05:45","05:50","05:55","06:00","06:05","06:10","06:15","06:20","06:25","06:30","06:35","06:40","06:45","06:50","06:55","07:00","07:05","07:10","07:15","07:20","07:25","07:30","07:35","07:40","07:45","07:50","07:55","08:00","08:05","08:10","08:15","08:20","08:25","08:30","08:35","08:40","08:45","08:50","08:55","09:00","09:05","09:10","09:15","09:20","09:25","09:30","09:35","09:40","09:45","09:50","09:55","10:00","10:05","10:10","10:15","10:20","10:25","10:30","10:35","10:40","10:45","10:50","10:55","11:00","11:05","11:10","11:15","11:20","11:25","11:30","11:35","11:40","11:45","11:50","11:55","12:00","12:05","12:10","12:15","12:20","12:25","12:30","12:35","12:40","12:45","12:50","12:55","13:00","13:05","13:10","13:15","13:20","13:25","13:30","13:35","13:40","13:45","13:50","13:55","14:00","14:05","14:10","14:15","14:20","14:25","14:30","14:35","14:40","14:45","14:50","14:55","15:00","15:05","15:10","15:15","15:20","15:25","15:30","15:35","15:40","15:45","15:50","15:55","16:00","16:05","16:10","16:15","16:20","16:25","16:30","16:35","16:40","16:45","16:50","16:55","17:00","17:05","17:10","17:15","17:20","17:25","17:30","17:35","17:40","17:45","17:50","17:55","18:00","18:05","18:10","18:15","18:20","18:25","18:30","18:35","18:40","18:45","18:50","18:55","19:00","19:05","19:10","19:15","19:20","19:25","19:30","19:35","19:40","19:45","19:50","19:55","20:00","20:05","20:10","20:15","20:20","20:25","20:30","20:35","20:40","20:45","20:50","20:55","21:00","21:05","21:10","21:15","21:20","21:25","21:30","21:35","21:40","21:45","21:50","21:55","22:00","22:05","22:10","22:15","22:20","22:25","22:30","22:35","22:40","22:45","22:50","22:55","23:00","23:05","23:10","23:15","23:20","23:25","23:30","23:35","23:40","23:45","23:50","23:55"]
}
var lineAtIndexLive = mapShowDataLive.qr.length;

function clearMapShowDataLive() {
	mapShowDataLive = {
		qr: [],
		name: [],
		temperature: [],
		humidity: [],
		co2: [],
		noise: [],
		times: ["00:05","00:10","00:15","00:20","00:25","00:30","00:35","00:40","00:45","00:50","00:55","01:00","01:05","01:10","01:15","01:20","01:25","01:30","01:35","01:40","01:45","01:50","01:55","02:00","02:05","02:10","02:15","02:20","02:25","02:30","02:35","02:40","02:45","02:50","02:55","03:00","03:05","03:10","03:15","03:20","03:25","03:30","03:35","03:40","03:45","03:50","03:55","04:00","04:05","04:10","04:15","04:20","04:25","04:30","04:35","04:40","04:45","04:50","04:55","05:00","05:05","05:10","05:15","05:20","05:25","05:30","05:35","05:40","05:45","05:50","05:55","06:00","06:05","06:10","06:15","06:20","06:25","06:30","06:35","06:40","06:45","06:50","06:55","07:00","07:05","07:10","07:15","07:20","07:25","07:30","07:35","07:40","07:45","07:50","07:55","08:00","08:05","08:10","08:15","08:20","08:25","08:30","08:35","08:40","08:45","08:50","08:55","09:00","09:05","09:10","09:15","09:20","09:25","09:30","09:35","09:40","09:45","09:50","09:55","10:00","10:05","10:10","10:15","10:20","10:25","10:30","10:35","10:40","10:45","10:50","10:55","11:00","11:05","11:10","11:15","11:20","11:25","11:30","11:35","11:40","11:45","11:50","11:55","12:00","12:05","12:10","12:15","12:20","12:25","12:30","12:35","12:40","12:45","12:50","12:55","13:00","13:05","13:10","13:15","13:20","13:25","13:30","13:35","13:40","13:45","13:50","13:55","14:00","14:05","14:10","14:15","14:20","14:25","14:30","14:35","14:40","14:45","14:50","14:55","15:00","15:05","15:10","15:15","15:20","15:25","15:30","15:35","15:40","15:45","15:50","15:55","16:00","16:05","16:10","16:15","16:20","16:25","16:30","16:35","16:40","16:45","16:50","16:55","17:00","17:05","17:10","17:15","17:20","17:25","17:30","17:35","17:40","17:45","17:50","17:55","18:00","18:05","18:10","18:15","18:20","18:25","18:30","18:35","18:40","18:45","18:50","18:55","19:00","19:05","19:10","19:15","19:20","19:25","19:30","19:35","19:40","19:45","19:50","19:55","20:00","20:05","20:10","20:15","20:20","20:25","20:30","20:35","20:40","20:45","20:50","20:55","21:00","21:05","21:10","21:15","21:20","21:25","21:30","21:35","21:40","21:45","21:50","21:55","22:00","22:05","22:10","22:15","22:20","22:25","22:30","22:35","22:40","22:45","22:50","22:55","23:00","23:05","23:10","23:15","23:20","23:25","23:30","23:35","23:40","23:45","23:50","23:55"]
	}
	lineAtIndexLive = mapShowDataLive.qr.length;
}

function liveUpdateMapDay(){
	clearMapShowDataLive();
	if ( mapLiveDataFirstLoad == true ) {
		mapShowDataLiveColor = [];
	}


	var qr = currentLocationsOnMap.qr;


	var startTime = 00+hourDiff+":00:00";
	var endTime = 23+hourDiff+":55:00"; 
	var runCounter = 0;
	for (i = 0; i < qr.length; i++) { 				
		var boxQR = qr[i];
		var sUrl = "https://app.ic-meter.com/icm/api/measurements/1.2/days/range/"+boxQR+"?fromDate="+mapShow.liveTime.startDate+"T"+startTime+"Z&toDate="+mapShow.liveTime.endDate+"T"+endTime+"Z&access_token="+icMeterSystemAccessToken;
		$.ajax({
			"type":"POST", 
			"url":sUrl,
			"contentType":false,
			"processData":false,
			"cache":false,
			crossDomain: true,
			dataType: 'jsonp',
			success:function(jData){
				var counter = 0;
				var temperature = [];
				var humidity = [];
				var co2 = [];
				var noise = [];
				var callUrl = this.url;
				var thisQr = callUrl.substring(callUrl.lastIndexOf("/range/")+7,callUrl.lastIndexOf("?fromDate="));
				$.each(jData.rows, function(){
					temperature.push(jData.rows[counter].c[1].v);
					humidity.push(jData.rows[counter].c[2].v);
					co2.push(jData.rows[counter].c[3].v);
					noise.push(jData.rows[counter].c[4].v);
					counter++;
				});
				mapShowDataLive.qr.push(thisQr);
				mapShowDataLive.temperature.push(temperature);
				mapShowDataLive.humidity.push(humidity);
				mapShowDataLive.co2.push(co2);
				mapShowDataLive.noise.push(noise);
				if ( mapLiveDataFirstLoad == true ) {
					var randomColor = getRandomColor();
					mapShowDataLiveColor.push(""+randomColor+"");
				}
				var sUrl = "api/api-get-ic-meters-alias.php?fAY2YfpdKvR="+sender+"&currentUserName="+currentUserName+"&qr="+thisQr;
				$.get( sUrl , function( sData ){
					var jData = JSON.parse(sData); 
					if( jData.status == "ok" ){
						mapShowDataLive.name.push(jData.boxName);
					}
				});
				runCounter++;
				if (runCounter == qr.length) { 
					mapLiveDataFirstLoad = true;
					drawMapChartDay(true);
				}
			},
			error: function(jData){
				runCounter++;
			},
		});
	}
}

// Communication 

$(document).on("click", ".btn-go-to-communnication", function() {
    //loadMessages();
    setTimeout(() => {
    	loadMessages();
    }, 200);

    showCommunicationTypeFild();
    $("html, body").animate({
    	scrollTop: 0
    }, 500);
    ga('set', 'page', '/Logbog/');
    ga('send', 'pageview');
});

// Show typefiled if visiable
function showCommunicationTypeFild() {
	if (writeMessageVisiable == false) {
		$(".add-communication-wrapper").css("display", "flex").addClass("flex");
		$("#btn-write-message-communication").html("Skjul skrivefelt");
		writeMessageVisiable = true;
	} 
}

var writeMessageVisiable = false;
$(document).on("click", "#btn-write-message-communication", function(){
	if ( writeMessageVisiable == false ) {
		$(".add-communication-wrapper").css("display", "flex").addClass("flex");
		$(this).html("Fortryd");
		writeMessageVisiable = true;
	} else {
		$(".add-communication-wrapper").slideUp();
		$(this).html("Skriv besked");
		$("#communication-subjects-news-manually, #communication-message-body, #communication-subjects-manually").val("");
		writeMessageVisiable = false;
	}
});



$(document).on('change', '.list-communication-type', function() {
	var messageType = $(".list-communication-type").val();
	var messageSub = $(".list-communication-subjects").val();
	if (messageType == "2") {
		$("#communication-message-body").attr("placeholder", "");
		$(".select-communication-sub").slideUp();
		$("#communication-subjects-manually-news-wraper").slideDown();
		$("#communication-subjects-manually-wraper").slideUp();
		$(".chart-select-map").hide();
		$(".chart-select-location").hide();
	} else {
		setSugentiosTextCom();
		if (messageSub == "other") { 
			$("#communication-subjects-manually-wraper").slideDown();
		}
		$("#communication-subjects-manually-news-wraper").slideUp();
		$(".select-communication-sub").slideDown();
		$(".chart-select-map").show();
		$(".chart-select-location").show();
	}



});

if (window.matchMedia('(max-width: 800px)').matches) {
	$(".list-communication-type option[value='2']").text("Nyheder (Vises ikke i mobilversion)");
}

$(document).on('change', '.list-communication-subjects', function() {	
	setSugentiosTextCom();
});

setSugentiosTextCom();
function setSugentiosTextCom(){
	var messageSub = $(".list-communication-subjects").val();
	if (messageSub == "other") {
		$("#communication-subjects-manually-wraper").slideDown();
	} else {
		$("#communication-subjects-manually-wraper").slideUp();
	}
	switch (messageSub) {
		case "Temperatur":
		$("#communication-message-body").attr("placeholder", subSugestions.tem);
		break;
		case "Luftkvalitet":
		$("#communication-message-body").attr("placeholder", subSugestions.air);
		break;
		case "Støj":
		$("#communication-message-body").attr("placeholder", subSugestions.noi);
		break;
		case "Skoleklima.dk":
		$("#communication-message-body").attr("placeholder", subSugestions.system);
		break;
		case "other":
		$("#communication-message-body").attr("placeholder", subSugestions.other);
		break;
		default:
		$("#communication-message-body").attr("placeholder", "");
		break;
	}
}

$(document).on("click", "#create-message-from-user", function(){
	$("#communication-subjects-news-manually, #communication-message-body, #communication-subjects-manually").removeClass("wrong-login");

	if ( showSchool !== "" ) {
		var body = $("#communication-message-body").val();
		if (currentUserRole == "1" || currentUserRole == "15" || currentUserRole == "2") {
			var type = $(".list-communication-type").val();
		} else {
			var type = 1;
		}

		var messageType = $(".list-communication-type").val();
		var messageSub = $(".list-communication-subjects").val();
		var qrVal = $(".chart-select-device-communication").val();
		var val = {
			body:false,
			type:false,
			sub:false
		};
		if (messageType == "2") {
			var title = $("#communication-subjects-news-manually").val();
			if ( title !== "" ) {
				val.type = true;
			} else {
				$("#communication-subjects-news-manually").addClass("wrong-login");
			}
			if ( body !== "" ) {
				val.body = true;
			} else {
				$("#communication-message-body").addClass("wrong-login");
			}
			val.sub = true;
		} else {
			if (messageSub == "other") { 
				var title = $("#communication-subjects-manually").val();
				var sub = $("#communication-subjects-manually").val();
				if ( sub !== "" ) {
					val.sub = true;
				} else {
					$("#communication-subjects-manually").addClass("wrong-login");
				}
			} else {
				title = $(".list-communication-subjects").val();
				val.sub = true;
			}
			if ( body !== "" ) {
				val.body = true;
			} else {
				$("#communication-message-body").addClass("wrong-login");
			}
			val.type = true;
		}

		if (val.body == true && val.type == true && val.sub == true) {


			LocationID = $("#comuSelect").find('option:selected').attr('id');
			LocationName = $("#comuSelect").find('option:selected').attr('value');

			var sUrl = "api/api-create-message.php";

			$.post(sUrl, {
				fAY2YfpdKvR: sender,
				type: type,
				userID: currentUserID,
				title: title,
				body: body,
				LocationID: LocationID,
				school: showSchoolID
			}, function (data) {
                // Check om modtaget data er ok
                var jData = JSON.parse(data);
                if (jData.status == 'ok') {
                	if (type == "1") {
                		var con = '<div class="communication-user-wrapper">\
                		<i style="color:#cccccc; float: right;" class="ico-delete-user-news-temp fa fa-trash-o" aria-hidden="true"></i>\
                		<p class="ico-delete-user-news-p">Beskeden behandles</p>\
                		<input type="hidden" class"message-from-user-athorId" name="" value="{{userID}}" disabled>\
                		<h4>{{title}}</h4>\
                		<p>{{body}}</p>\
                		<span><p>{{time}}</p></span>\
                		</div>\
                		<hr>\
                		';
                		if(title.includes("(undefined)")){

                		}
                		var conTemplate = con;
                		conTemplate = conTemplate.replace("{{userID}}", currentUserID);
                		conTemplate = conTemplate.replace("{{title}}", LocationName.bold() + " - " + title);
                		conTemplate = conTemplate.replace("{{body}}", body.replace(/\n/g, "<br>") );
                		conTemplate = conTemplate.replace("{{icMeter}}", $(".chart-select-device-communication option:selected").attr("data-box-name"));
                		conTemplate = conTemplate.replace("{{time}}", moment().format("DD-MM-YYYY"));
                		$(".user-communication-wrapper").prepend(conTemplate);
                	} else if (type == "2") {
                		var con = '<div class="communication-news-wrapper">\
                		<i style="color:#cccccc; float: right;" class="ico-delete-admin-news-temp fa fa-trash-o" aria-hidden="true"></i>\
                		<p class="ico-delete-admin-news-p">Beskeden behandles</p>\
                		<input type="hidden" class"message-from-user-athorId" name="" value="{{userID}}" disabled>\
                		<h4>{{title}}</h4>\
                		<p>{{body}}</p>\
                		</div>\
                		';
                		var conTemplate = con;
                		conTemplate = conTemplate.replace("{{userID}}", currentUserID);
                		conTemplate = conTemplate.replace("{{title}}", title);
                		conTemplate = conTemplate.replace("{{body}}", body.replace(/\n/g, "<br>") );
                		conTemplate = conTemplate.replace("{{icMeter}}", $(".chart-select-device-communication option:selected").attr("data-box-name"));
                		$(".oficial-communication-inner-wrapper").prepend(conTemplate);
                	}
                	$("#communication-subjects-news-manually, #communication-message-body, #communication-subjects-manually").removeClass("wrong-login");
                	$("#communication-subjects-news-manually, #communication-message-body, #communication-subjects-manually").val("");
                	swal({
                		title: "",
                		text: 'Beskeden er oprettet!',
                		type: "success"
                	});
                	$(".add-communication-wrapper").slideUp();
                	$("#btn-write-message-communication").html("Skriv besked");
                	$("#communication-subjects-news-manually, #communication-message-body, #communication-subjects-manually").val("");
                	writeMessageVisiable = false;
                	setTimeout(function () { loadMessages(); }, 10000);
                } else {
                	swal({
                		title: "",
                		text: 'Beskeden kunne ikke oprettes! Prøv igen.',
                		type: "error"
                	});
                }
            });

			function nl2br(str, is_xhtml) {
				var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
				return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
			}


		} 
	}
});

$(document).on("click", "#communication-message-body, #communication-subjects-manually, #communication-subjects-news-manually", function(){
	$("#communication-subjects-news-manually, #communication-message-body, #communication-subjects-manually").removeClass("wrong-login");
});

$(document).on("click", ".menu-link-communication", function(){
    //loadMessages();
});

function loadMessages() {
	startNumberMessageAdmin = 0;
	loadMessagesUser(startNumberMessageUser);
    loadMessagesAdmin("0");//TODOADMIN
}

function loadMessagesUser(start) {
	var type = "1";


	var sUrl = "api/api-get-messages.php?fAY2YfpdKvR="+sender+"&school="+showSchoolID+"&type="+type+"&start="+start;


	if ( start == 0 ) {
		$(".user-communication-wrapper").empty();
	}


	$.get( sUrl , function( sData ){
		var jData = JSON.parse(sData);



		var con = '<div class="communication-user-wrapper">\
		{{trash}}\
		<input type="hidden" class"message-from-user-messageID" name="" value="{{messageID}}"disabled>\
		<input type="hidden" class"message-from-user-athorId" name="" value="{{userID}}" disabled>\
		<h4>{{title}} {{icMeter}}</h4>\
		<p>{{body}}</p>\
		<span><p>{{time}}</p></span>\
		<hr>\
		</div>\
		';

		$("#devices-list-content-wrapper").empty();
		for( var i = 0 ; i < jData.length ; i++ ){
			var conTemplate = con;

			var ic_meter_name = "";
			if (jData[i].alias) {
				ic_meter_name = jData[i].alias;
			} else {
				ic_meter_name = jData[i].boxName;
			}
			if (jData[i].UserID == currentUserID || currentUserRole == "1" || currentUserRole == "15" || currentUserRole == "2") {
				conTemplate = conTemplate.replace( "{{trash}}" , '<i class="link ico-delete-user-news fa fa-trash-o" aria-hidden="true"></i>' );
			} else {
				conTemplate = conTemplate.replace( "{{trash}}" , '' );	
			}
			conTemplate = conTemplate.replace( "{{messageID}}" , jData[i].MsgID );
			conTemplate = conTemplate.replace( "{{userID}}" , jData[i].UserID );
			conTemplate = conTemplate.replace( "{{title}}" , (jData[i].LocationName).bold() + " - " + jData[i].MsgTitle);
			conTemplate = conTemplate.replace( "{{body}}" , jData[i].MsgData );


			if (jData[i].icMeter) {
				conTemplate = conTemplate.replace( "{{icMeter}}" , "("+jData[i].LocationID+")" );
			} else {
				conTemplate = conTemplate.replace( "{{icMeter}}" , "" );
			}


			conTemplate = conTemplate.replace( "{{time}}" , jData[i].MsgDate );
			$(".user-communication-wrapper").append(conTemplate);
		}	
	});
	startNumberMessageUser = startNumberMessageUser+3;
}

function loadMessagesAdmin(start) {
	var type = "2";
	var sUrl = "api/api-get-messages.php?fAY2YfpdKvR="+sender+"&school="+showSchoolID+"&type="+type+"&start="+start;
	if ( start == 0 ) {
		$(".oficial-communication-inner-wrapper").empty();
	}

	$.getJSON( sUrl , function( jData ){
		var con = '<div class="communication-news-wrapper">\
		{{trash}}\
		<input type="hidden" class"message-from-user-messageID" name="" value="{{messageID}}"disabled>\
		<input type="hidden" class"message-from-user-athorId" name="" value="{{userID}}" disabled>\
		<h4>{{title}}</h4>\
		<p>{{body}}</p>\
		</div>\
		';

		for( var i = 0 ; i < jData.length ; i++ ){
			var conTemplate = con;
			if (jData[i].author == currentUserID || currentUserRole == "1" || currentUserRole == "15" || currentUserRole == "2") {
				conTemplate = conTemplate.replace( "{{trash}}" , '<i class="link ico-delete-admin-news fa fa-trash-o" aria-hidden="true"></i>' );
			} else {
				conTemplate = conTemplate.replace( "{{trash}}" , '' );	
			}
			conTemplate = conTemplate.replace( "{{messageID}}" , jData[i].MsgID );
			conTemplate = conTemplate.replace( "{{userID}}" , jData[i].UserID );
			conTemplate = conTemplate.replace( "{{title}}" , jData[i].MsgTitle );
			conTemplate = conTemplate.replace( "{{body}}" , jData[i].MsgData );
			conTemplate = conTemplate.replace( "{{time}}" , jData[i].MsgDate );
			$(".oficial-communication-inner-wrapper").append(conTemplate);
		}	
	});
	startNumberMessageAdmin = startNumberMessageAdmin+3;
}

function clearMessages() {
	startNumberMessageUser=0;
	$(".user-communication-wrapper, .oficial-communication-inner-wrapper").empty();
}


$(document).on("click", ".load-more-message-user", function() {
	if ( showSchool !== "" ) {
		loadMessagesUser(startNumberMessageUser);
	}
});

$(document).on("click", ".load-more-message-admin", function() {
	if ( showSchool !== "" ) {
		loadMessagesAdmin(startNumberMessageAdmin);
	}
});

$(document).on("click", ".ico-delete-user-news, .ico-delete-admin-news", function() {
	var element = $(this).parent();
	var messageID = $(this).parent().find("input:first").val();
	swal({
		title: "",
		text: 'Are you sure you want to delete this message?',
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Yes, delete this message",
		closeOnConfirm: true
	},
         // If warning accepted do...
         function (){
         	deleteMessage(messageID, element);
         });
	$(".cancel").html("Cancel");

});

// Delete messages
function deleteMessage(messageID, element) {
	var sUrl = "api/api-delete-message.php?fAY2YfpdKvR="+sender+"&userId="+currentUserID+"&messageId="+messageID;
	$.getJSON( sUrl, function(jData){
		if( jData.status == "ok" ){
			element.slideUp();
		} else {
			swal({
				title: "Error",
				text: 'Something went wrong. Try again later.',
				type: "error"     
			});
		}		
	});
}

// System info

$(document).on("click", ".system-about-link", function(){
	var temp = '<div class="system-info-wrapper">\
	<p>'+ softwareName + ' is under development in the Smart City Accelerator (SCA) project, financed by EUs program interreg, who supports projects inbetween regions. In SCA swedish and danish municipalities has united with universities to find solutions for their problems. DTU Compute, and DTU Byg, works with Høje Taastrup municipality to improve the indoor climate and energyusage in the municipalitys buildings, which has led to ' + softwareName + ', which is now used on mulitple schools.</p>\
	<img src="img/logo/system-logoes.jpg" alt="'+ softwareName +' - firmalogoer">\
	</div>\
	';
	var options = {
		title: 'About ' + softwareName,
		text: temp,
		animation: false,
		html: true
	};
	swal(options);
	$(".confirm").html("Close");
});

// Infovidoe
if (currentUserRole == 3) {
	var systemFirstUse = "true";
	var systemFirstUse = $.cookie("first-use");
	if (!systemFirstUse || systemFirstUse == "false") {
		if (window.matchMedia('(min-width: 500px)').matches) {
			setTimeout(function () {
				showInfoVido();
			}, 6000);
		}
	}

	function showInfoVido() {
		var temp = '<div class="system-info-vidoe">\
		<p style="margin-bottom: 30px;">Watch a short video about how '+ softwareName +' works</p>\
		<iframe width="400" height="225" src="https://www.youtube.com/embed/mGLdnz_GmRE" frameborder="0" allowfullscreen></iframe>\
		<p style="margin-top: 20px;">You can choose if you want to see this video again under "Your profile"</p>\
		</div>\
		';
		var options = {
			title: 'Welcome!',
			text: temp,
			html: true,
		};
		swal(options);
		$(".confirm").html("Close");
	}
	if (!systemFirstUse ||  systemFirstUse == "false") {
		$(".check-intro-video").prop('checked', true);
	} else {
		$(".check-intro-video").prop('checked', false);
	}
	$('.check-intro-video').click(function () {
		if ($(this).is(':checked')) {
			$.cookie("first-use", false)
		} else {
			$.cookie("first-use", true)
		}
	});
}