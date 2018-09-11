var ws;
function setConnected(connected) {
	$("#connect").prop("disabled", connected);
	$("#disconnect").prop("disabled", !connected);
	if (connected) {
		$("#conversation").show();
	} else {
		$("#conversation").hide();
	}
	$("#greetings").html("");
}

function connect() {
	//connect to stomp where stomp endpoint is exposed
	var socket = new WebSocket("ws://localhost:8085/greeting");
	ws = Stomp.over(socket);

	ws.connect({}, function(frame) {
		ws.subscribe("/queue/errors", function(message) {
			alert("Error " + message.body);
		});

		ws.subscribe("/queue/reply", function(message) {
			//alert(message);
			processMessage(message.body);
		});
		
		ws.subscribe("/queue/inbox", function(message) {
			processInbox(message.body);			
		});
		
		ws.subscribe("/queue/items", function(message) {
			//alert('testing for items');
			processItems(message.body);			
		});
		
	}, function(error) {
		alert("STOMP error " + error);
	});
}

function disconnect() {
	if (ws != null) {
		ws.close();
	}
	setConnected(false);
	console.log("Disconnected");
}

//--------------------------------------------------------------
	//Sending command to control the thermostat set point. 
//--------------------------------------------------------------
$('#tsend').on('click', function() {
	
	var data = JSON.stringify({
		'name' :  "tstate~"+$("#thrmostatid").val()+"~"+$("#tvalue").val()
	})
	ws.send("/app/message", {}, data);
	alert("Data has been successfully forwarded to openhab and changed!");
	  
});


function sendName() {
	var data = JSON.stringify({
		'name' :  "tstate~"+$("#setThermosata").val()+"~"+$("#name").val()
	})
	alert(data);
	ws.send("/app/message", {}, data);
	alert("Data has been successfully forwarded to openhab and changed!");
}

//----------------------------------------------------------------------------------------------------
	//Discovery the items in the inbox after installing the binding in order to add it to the 'things'.
//----------------------------------------------------------------------------------------------------
function discovery() {
	var data = JSON.stringify({
		'name' :  'discovery'
	})
	ws.send("/app/message", {}, data);
}
//----------------------------------------
	//Installing the bindings. 
//----------------------------------------
function installExtension(extensionId) {
	var data = JSON.stringify({
		'name' :  'install~'+extensionId
	})
	ws.send("/app/message", {}, data);
}

//----------------------------------------
// Uninstall the bindings. 
//----------------------------------------
function unInstallExtension(extensionId) {
	var data = JSON.stringify({
		'name' :  'extuninstall~'+extensionId
	})
	ws.send("/app/message", {}, data);
}

function scanExtension(extensionId) {
	var data = JSON.stringify({
		'name' :  'extscan~'+extensionId
	})
	ws.send("/app/message", {}, data);
}

//--------------------------------------------
//Approve items from 'inbox' into 'things'
//--------------------------------------------
function callApprove(thingsUid) {
	var data = JSON.stringify({
		'name' :  'approve~'+thingsUid
	})
	ws.send("/app/message", {}, data);
}

//----------------------------------------
// Listing all the 'items' from 'inbox'
//----------------------------------------
function callThings() {
	var data = JSON.stringify({
		'name' :  'listItems'
	})
	ws.send("/app/message", {}, data);
}

function callInbox() {
	var data = JSON.stringify({
		'name' :  'inbox'
	})
	ws.send("/app/message", {}, data);
}

//----------------------------------------
	//Remove items 
//----------------------------------------
function uninstallItems(val,uid) {
	var data = JSON.stringify({
		'name' :  'uninstallitem~'+val+'~'+uid
	})
	ws.send("/app/message", {}, data);
}
//----------------------------------------
	//Add items 
//----------------------------------------
function installItems(label, uid, itemtype) {
	var data = JSON.stringify({
		'name' :  'ainstallitem~'+label+'~'+uid+'~'+itemtype
	})
	ws.send("/app/message", {}, data);
}

function processItems(msg){
	var sp = JSON.parse(msg);
	$('#accordion').html('');
	$.each( sp, function( key, obj ) {
		var eleid = obj.label+''+Math.floor((Math.random() * 100000) + 1);
		var vall = '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#'+eleid+'">'+obj.label+'</a></h4><a style="float:right" id="deviceUninstall"></a></div><div id="'+eleid+'" class="panel-collapse collapse in"><ul class="list-group">';
         var data = '';
		$.each( obj.channels, function( key, item ) {
			if(item.linkedItems.length<1)
	        data += '<li class="list-group-item">'+item.id+' <button onClick="installItem(\''+item.id+'\',\''+item.uid+'\',\''+item.itemType+'\')" style="float:right" id="itemInstall">Add To Item</button> </li>';
			else{
				data += '<li class="list-group-item" style="height:106px;">'+item.id+'  <h5 style="margin-left:20px"> - Linked Items : '+item.linkedItems+'</h5> <button style="float:right" data-itemlink="'+item.linkedItems+'" onClick="uninstallItem(\''+item.linkedItems+'\',\''+item.uid+'\')" id="itemUninstall">Remove From Item</button></li>';	
				
			}
		});
		
		var val2 = ' </ul></div></div>';
          $('#accordion').append(vall+data+val2);
		
	});
	
	
}

function processInbox(msg){
	var sp = JSON.parse(msg);
	//var s = sp[1].split(',');
	$('#inboxsel').empty();
	$('#inboxsel').append($('<option>', {value:'', text:'Select One'}));
	$.each( sp, function( key, obj ) {
		$('#inboxsel').append($('<option>', {value:obj.thingUID, text:obj.label}));
	});
}

function processMessage(message) {
	
	if(message.indexOf('rd~')==0)
		 processDiscovery(message);
}


function processDiscovery(msg){

	var sp = JSON.parse(msg);
	//var s = sp[1].split(',');
	$('#discovery').empty();
	$('#discovery').append($('<option>', {value:'', text:'Select One'}));
	$.each( sp, function( key, obj ) {
		$('#discovery').append($('<option>', {value:obj, text:obj}));
	});
}

function searcInbox(msg){
	alert(msg);
}


$(function() {
	$("form").on('submit', function(e) {
		e.preventDefault();
	});
	$("#connect").click(function() {
		connect();
	});
	$("#disconnect").click(function() {
		disconnect();
	});
	$("#send").click(function() {
		sendName();
	});
});
