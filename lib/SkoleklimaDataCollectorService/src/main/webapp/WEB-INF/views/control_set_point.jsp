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
                    <h1 class="page-header">Send command to the actuators to set the heat point</h1>
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
                            <i class="fa fa-bar-chart-o fa-fw"></i>Select the school name to set the corresponding actuators heat point---1
                        </div>
                <div class="panel-body">
                 <div class="form-group">
                    <label for="schoolName" class="col-sm-3 control-label">School name details</label>
                    <div class="col-sm-9">
                       <select id="schoolid" class="form-control" >
                       <option value=''>Select a school details...</option>
                       <c:forEach var="ros" items="${school}">
								<option value="${ros.id}">${ros.schoolName}</option>
					   </c:forEach> 
                    </select>
                    </div>
                 </div> 
              </div>
                    </div>              
                </div> 
    <!--============= End to select school details===================-->  
           
    <!--============= Start to select raspberryPi details============-->
                <div class="col-lg-6">
                    <div class="panel panel-primary">
                        <div class="panel-heading">
                            <i class="fa fa-bar-chart-o fa-fw"></i>Select the location details for corresponding raspberryPi---2
                        </div>
                <div class="panel-body">
                 <div class="form-group">
                    <label for="schoolName" class="col-sm-3 control-label">Location details</label>
                    <div class="col-sm-9">
                        <select id="rassid" class="form-control">
                            <option>Select location details within a school...</option>
                            
                        </select>
                    </div>
                 </div> 
              </div>
                    </div>              
                </div> 
    <!--============= End to select raspberryPi details===================-->   
           
    <!--============= Start to select thermostat details===================-->
                <div class="col-lg-6">
                    <div class="panel panel-primary">
                        <div class="panel-heading">
                            <i class="fa fa-bar-chart-o fa-fw"></i>Select the actuators to set the heat point---3
                        </div>
                <div class="panel-body">
                 <div class="form-group">
                    <label for="schoolName" class="col-sm-3 control-label">Actuators location details</label>
                    <div class="col-sm-9">
 				   <select id="thrmostatid" class="form-control">
                            <option>Select actuators with classroom details ...</option>        
                  </select>    
                    </div>
                 </div>
              </div>
                </div>              
                </div> 
    <!--============= End to select raspberryPi details===================--> 
        
    <!--============= Start to display current thermostat value===========-->    
                <div class="col-lg-4">
                    <div class="panel panel-primary text-center no-boder">
                        <div class="panel-body green">
                            <i class="fa fa-bar-chart-o fa-3x"></i>
                            <h3>23</h3>
                        </div>
                        <div class="panel-footer">
                            <span class="panel-eyecandy-title">Current thermostat value
                            </span>
                        </div>
                    </div>
                </div> 
                        
   <!--============= End to display current thermostat value==============--> 
       
   <!--============= Start to input the thermostat value===================--> 
       
                <div class="col-lg-6">
                    <div class="panel panel-primary">
  
                <div class="panel-body">
                 <div class="form-group">
        
                    <div class="col-sm-12">
						<label for="name">Enter value to set the thermostat heat
							point? - 4
				        </label>
							<input type="text" id="tvalue" class="form-control"
							placeholder="Enter value to set...">
					</div><br><br><br><br>
					<button id="tsend" class="btn btn-default center-block" type="button">Send</button>
                    </div>
                 </div> <!-- /.form-group --> 
              </div>
                </div>                                                 
                </div>
  <!--============= End to input the thermostat value===================-->
      
        </div>
        <!-- end page-wrapper -->
 
        </div>
        <!-- end page-wrapper -->

    <!-- end wrapper -->

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
	$.get( "/check/item/rass/"+this.value, function( data ) {
		$('#thrmostatid').empty();
		if(data){
			$('#thrmostatid').append('<option value="">Select One</option>');
		$.each( data, function( key, obj ) {
		$('#thrmostatid').append($('<option>', {value:obj.name, text:obj.name}));
		});
		}
	  });
});

	connect();

</script>
</body>
</html>
