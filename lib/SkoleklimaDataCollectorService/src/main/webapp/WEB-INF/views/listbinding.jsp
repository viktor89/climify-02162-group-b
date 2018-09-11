<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>    
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
 <jsp:include page="header.jsp"></jsp:include>
 </head>
<body>
    <!--  wrapper -->
    <div id="wrapper">

      <jsp:include page="uppernav.jsp"></jsp:include>
      <jsp:include page="leftnav.jsp"></jsp:include>
        
        <!--  page-wrapper -->
        <div id="page-wrapper">
<div class="row">
                <!-- Page Header -->
                <div class="col-lg-12">
                    <h1 class="page-header">Binding</h1>
                </div>
                <!--End Page Header -->
            </div>
              
         <!--      <button onclick="discovery()">search</button> -->
              <h1 id="bal"></h1>
                 <div class="row">
    
    <!--============= Start to select school details=================-->
                <div class="col-lg-6">
                    <div class="panel panel-primary">
                        <div class="panel-heading">
                            <i class="fa fa-bar-chart-o fa-fw"></i>Select school name to get Rassberry Pie.
                        </div>
                <div class="panel-body">
                 <div class="form-group">
                    <label for="schoolName" class="col-sm-3 control-label">School Name Details</label>
                    <div class="col-sm-9">
                       <select id="schoolid" >
                       <option value="">Select One</option>
                       <c:forEach var="ros" items="${school}">
								<option value="${ros.id}">${ros.schoolName}</option>
					   </c:forEach> 
                    </select>
                    </div>
                 </div> <!-- /.form-group --> 
              </div>
                    </div>              
                </div> 
    <!--============= End to select school details===================-->  
           
    <!--============= Start to select raspberryPi details============-->
                <div class="col-lg-6">
                    <div class="panel panel-primary">
                        <div class="panel-heading">
                            <i class="fa fa-bar-chart-o fa-fw"></i>Select the raspberryPi to get Installed Bindings.
                        </div>
                <div class="panel-body">
                 <div class="form-group">
                    <label for="schoolName" class="col-sm-3 control-label">RaspberryPi Name</label>
                    <div class="col-sm-9">
                        <select id="rassid" class="form-control">
                            <option>Select raspberryPi...</option>
                            
                        </select>
                    </div>
                 </div> <!-- /.form-group --> 
              </div>
                    </div>              
                </div> 
                <button id="su" class="btn btn-default" >Extension Sync</button>
    <!--============= End to select raspberryPi details===================-->   
           
    <!--============= Start to select thermostat details===================-->
                <div class="col-lg-12">
                    <div id="ibinding" class="panel panel-default">
                        <ul id="ulbinding" class="list-group">
                        </ul>
                </div>              
                </div> 
    <!--============= End to select raspberryPi details===================--> 
        
        </div>

 
        </div>
 

  <jsp:include page="footer.jsp"></jsp:include>
<script>

$('#schoolid').on('change', function() {
	$.get( "/check/school/rass/"+this.value, function( data ) {
		$('#rassid').empty();
		if(data){
			$('#rassid').append('<option value="">Select One</option>');
		$.each( data, function( key, obj ) {
		$('#rassid').append($('<option>', {value:obj.id, text:obj.rosberryName}));
		});
		}
	  });
});

$('#rassid').on('change', function() {
	$.get( "/check/extensionInstalledList", function( data ) {
		$('#ulbinding').html('');
		if(data){
			
		$.each( data, function( key, obj ) {
		$('#ulbinding').append('<li class="list-group-item">'+obj.label+' <button onClick="scanDevice(\''+obj.id+'\')" style="float:right" id="scanie">Scan</button> <button onClick="uninstallDevice(\''+obj.id+'\')" style="float:right" id="uie">Uninstall</button> </li>');
		});
		}
	  });
});

function uninstallDevice(deviceid)
{
	unInstallExtension(deviceid);	
}


function scanDevice(deviceid)
{
	scanExtension(deviceid);	
}

connect();

$('#su').on('click', function() {
	   discovery();	
	});

</script>
</body>
</html>
