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
        <div id="page-wrapper" style="margin-top:50px">
        
            <div class="row">
                <!-- Page Header -->
                <div class="col-lg-12">
                    <h1 class="page-header">Manage the devices on a school</h1>
                </div>
                <!--End Page Header -->
            </div>
        

   
    <!--============= Start to select school details=================-->
                <div class="col-lg-6">
                    <div class="panel panel-primary">
                        <div class="panel-heading">
                            <i class="fa fa-bar-chart-o fa-fw"></i>Select the school name to manage the device on a school---1
                        </div>
                <div class="panel-body">
                 <div class="form-group">
                    <label for="schoolName" class="col-sm-3 control-label">School Name Details</label>
                    <div class="col-sm-9">
                        <select id="country" class="form-control">
                            <option>Select school...</option>
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
                            <i class="fa fa-bar-chart-o fa-fw"></i>Select the raspberryPi for corresponding school---2
                        </div>
                <div class="panel-body">
                 <div class="form-group">
                    <label for="schoolName" class="col-sm-3 control-label">RaspberryPi Name</label>
                    <div class="col-sm-9">
                        <select id="country" class="form-control">
                            <option>Select raspberryPi...</option>
                        </select>
                    </div>
                 </div> <!-- /.form-group --> 
              </div>
                    </div>              
                </div> 
    <!--============= End to select raspberryPi details===================-->  
    
     
           
     <!--============= Start to Add new device on the oepnHAB to the corresponding raspberryPi=================-->
      <a href="addNewDevice" class="btn btn-primary" role="button"><i class="fa fa-plus-circle"></i> Add New Device & Items on the openHAB</a>
     <!--============= End to Add new device to the oepnHAB to the corresponding raspberryPi===================-->
    
    
    
    
        
     <!--============= Start to remove the existing device on the oepnHAB to the corresponding raspberryPi======-->
      <a href="removeDevice" class="btn btn-primary" role="button"><i class="fa fa-minus-circle"></i> Remove Existing Device & Items from the openHAB</a>
     <!--============= End to remove the existing device from the oepnHAB to the corresponding raspberryPi======-->


     <!-- end page-wrapper -->

    </div>
    </div>
    <!-- end wrapper -->

  <jsp:include page="footer.jsp"></jsp:include>


</body>
</html>
