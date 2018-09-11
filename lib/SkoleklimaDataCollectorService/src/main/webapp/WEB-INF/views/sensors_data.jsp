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
        
        <div id="page-wrapper">
<div class="row">
                <!-- Page Header -->
                <div class="col-lg-12">
                    <h1 class="page-header">Sensor Data</h1>
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
                            <i class="fa fa-bar-chart-o fa-fw"></i>Select school name 
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
                            <i class="fa fa-bar-chart-o fa-fw"></i>Select the raspberryPi 
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
    <!--============= End to select raspberryPi details===================--> 
           
    <!--============= Start to select the sensors table details===================-->
                <div id="listsensor" class="col-lg-12">
                    
                    
                     
                    </div>                
    <!--============= End to select raspberryPi details===================--> 
 
        </div>
        <!-- end page-wrapper -->

    </div>
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
	$.get( "/check/allsensordata", function( data ) {
		
		$('#listsensor').html();
		if(data){
		$.each( data, function( key, obj ) {
			var firstline = '<div class="col-lg-4" style="background: white;padding: 20px;border: solid 0.5px blue;margin: 0;"><div class="card-body"><h5 class="card-title"><a href="/metadata/'+obj.id+'">'+obj.uid+'</a></h5><hr /><div class="col-lg-12">Address : '+obj.address+'</div>';
			$.each( obj.sensorItemData, function( key, sen ) {  
				 var secondline = '<hr /><div class="col-lg-8">'+sen.label+'</div><div onclick="tstate(this)" data-test="testing"   data-read ="'+sen.readOnly+'" id="masdat" class="col-lg-4">'+sen.state+' '+sen.mesurement+'</div>'; 
				 firstline += secondline;
			});
			firstline +='</div></div>';
			$('#listsensor').append(firstline);
		});
		}
	  });
});


function tstate(el)
{
	alert(el);
	}
	connect();

</script>

  

</body>
</html>
