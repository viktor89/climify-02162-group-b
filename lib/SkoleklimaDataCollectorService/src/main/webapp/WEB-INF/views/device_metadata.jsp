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
                    <h1 class="page-header">Manage Device MetaData Details</h1>
                </div>
                <!--End Page Header -->
            </div>
  
       <!--============= Start to select school details=================-->
               <div class="row">
                <div class="col-lg-6">
                    <div class="panel panel-primary">
                        <div class="panel-heading">
                            <i class="fa fa-bar-chart-o fa-fw"></i>Select school name to see the corresponding raspberryPi details
                        </div>
                <div class="panel-body">
                 <div class="form-group">
                    <label for="schoolName" class="col-sm-3 control-label">School Name Details</label>
                    <div class="col-sm-9">
                        <select id="country" class="form-control">
                            <option>Select school...</option>
                            <option>Bagsværd Kostskole og Gymnasium</option>
                            <option>Copenhagen International School</option>
                            <option>Frederiksberg Gymnasium</option>
                            <option>Testrup Højskole</option>
                        </select>
                </div></div></div></div></div>
                    
    <!--============= End to select school details===================-->  
           
    <!--============= Start to select raspberryPi details============-->
                <div class="row">
                   <div class="col-lg-6">
                    <div class="panel panel-primary">
                        <div class="panel-heading">
                            <i class="fa fa-bar-chart-o fa-fw"></i>Select the raspberryPi to see the connected sensors and thermostat details.
                        </div>
                <div class="panel-body">
                 <div class="form-group">
                    <label for="schoolName" class="col-sm-3 control-label">RaspberryPi Name</label>
                    <div class="col-sm-9">
                        <select id="country" class="form-control">
                            <option>Select raspberryPi...</option>
                            <option>RaspberryPi#1</option>
                            <option>RaspberryPi#2</option>
                            <option>RaspberryPi#3</option>
                            <option>RaspberryPi#4</option>
                        </select>
                    </div></div></div></div></div></div>                  
                 
      <!--============= End to select raspberryPi details===================-->
        
      <!--=================Table to display the device metadata details=====-->
      <a class="btn btn-primary pull-right" title="Add device location!" style="margin-bottom: 10px;" href="add_device_location" role="button"><i class="fa fa-plus-circle"></i> Add Device Location Details</a>
       <div class="panel panel-primary">
                        <div class="panel-heading">
                            <i class="fa fa-bar-chart-o fa-fw"></i>Device MetaData Details
                        </div>
                        <div class="panel-body">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="table-responsive">
                                        <table class="table table-bordered table-hover table-striped">
                                            <thead>
                                                <tr>
                                                    <th>S.N</th>
                                                    <th>School Details</th>
                                                    <th>RaspberryPi ID</th>
                                                    <th>RaspberryPi Loation</th>
                                                    <th>Sensors ID</th>
                                                    <th>Sensors Loation</th>
                                                    <th>Thermostat ID</th>
                                                    <th>Thermostat Loation</th>
                                                    <th>Action</th>
                
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>Technical University, XYZ - 2868, Denmark </td>
                                                    <td>RaspberryPi 3B #1 <a class="fa fa-info-circle" title="See Details!" href="#"></a></td>
                                                    <td>Technical University, XYZ - 2868, Denmark, Computer science department, 3rd florr, Room-1 </td>
                                                    <td>netatmo#12wfdj#1 <a class="fa fa-info-circle" title="See Details!" href="#"></a></td>
                                                    <td>Computer science department, 3rd florr, Room-3</td>
                                                    <td>Danfoss#132#y1 <a class="fa fa-info-circle" title="See Details!" href="#"></a></td>
                                                    <td>Computer science department, 3rd florr, Room-2</td>
                                                    
                                                    <td>
                                                    <a class="fa bs-f-size-2r fa-pencil" title="Edit device location details!" href="editrole?roleid=1"></a>
                                                    <a class="fa fa-plus-circle" title="Add device location!" href="add_device_location"></a>
                                                    <a class="fa fa-trash" title="Delete device details!" href="#"></a>
                                                    </td>
                                                </tr>
                                                
                                            </tbody>
                                        </table>
                                    </div>

                                </div>

                            </div>
                            <!-- /.row -->
                        </div>
                        <!-- /.panel-body -->
                    </div>
        </div>
 
        </div>
        </div>
        <!-- end page-wrapper -->

    </div>
    <!-- end wrapper -->

  <jsp:include page="footer.jsp"></jsp:include>

</body>
</html>
