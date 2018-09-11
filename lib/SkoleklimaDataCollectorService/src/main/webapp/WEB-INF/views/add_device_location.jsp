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
                <div class="col-lg-12">
                    <h1 class="page-header">Add Device Location Details</h1>
                </div>
            </div>
         <!-- =====================Start Example============== -->  
         
         <!--===============School Details=======================-->   
       <div class="container">
            <form class="form-horizontal" role="form"><br><br>

                <div class="form-group">
                    <label for="schoolDetails" class="col-sm-3 control-label">School Details</label>
                    <div class="col-sm-9">
                        <select id="schoolDetails" class="form-control">
                            <option>Select School Details...</option>
                            <option>IT German university</option>
                        </select>
                    </div>
                </div> 
        <!--===============RaspberryPi Details=======================-->
                <div class="form-group">
                    <label for="raspberryPiID" class="col-sm-3 control-label">RaspberryPi Details</label>
                    <div class="col-sm-9">
                        <select id="raspberryPiID" class="form-control">
                            <option>Select RaspberryPi Details...</option>
                            <option>RaspberryPi model B #1</option>
                            <option>RaspberryPi model B #2</option>>
                        </select>
                    </div>
                </div> 
                
<!--                 <div class="form-group">
                    <label for="raspberryPiLocation" class="col-sm-3 control-label">RaspberryPi Location Details</label>
                    <div class="col-sm-9">
                        <input type="email" id="raspberryPiLocation" placeholder="Email" class="form-control">
                    </div>
                </div> -->
            <!--===============Sensor Details=======================-->
               <div class="form-group">
                    <label for="sensorID" class="col-sm-3 control-label">Sensor ID</label>
                    <div class="col-sm-9">
                        <select id="sensorID" class="form-control">
                            <option>Select Sensor ID...</option>
                            <option>Netatmo#123</option>
                            <option>Netatmo#789</option>
                        </select>
                    </div>
                </div> 
               <div class="form-group">
                    <label for="sensorLocationDetails" class="col-sm-3 control-label">Sensor Lacation Details</label>
                    <div class="col-sm-9">
                        <input type="password" id="sensorLocationDetails" placeholder="sensor complete location details" class="form-control">
                        <span class="help-block">School name, Location details, eg.: Technical University, XYZ - 2860 copenhagen, room number</span>
                    </div>
                </div>  
                <!--===============Thermostat Details=======================-->
                                       <div class="form-group">
                    <label for="thermostatID" class="col-sm-3 control-label">Thermostat ID</label>
                    <div class="col-sm-9">
                        <select id="thermostatID" class="form-control">
                            <option>Select thermostat ID...</option>
                            <option>Danfoss#1</option>
                            <option>Danfoss#7</option>
                        </select>
                    </div>
                </div> 
               <div class="form-group">
                    <label for="thermostatLocation" class="col-sm-3 control-label">Thermostat Lacation Details</label>
                    <div class="col-sm-9">
                        <input type="password" id="thermostatLocation" placeholder="complete thermostat location details" class="form-control">
                        <span class="help-block">School name, Location details, eg.: Technical University, XYZ - 2860 copenhagenm, room, block</span>
                    </div>
                </div>              
                                        
            <!--===============Register=======================-->
                <div class="form-group">

                </div> <!-- /.form-group -->
                <div class="form-group">
                    <div class="col-sm-9 col-sm-offset-3">
                        <button type="submit" class="btn btn-primary btn-block">Add</button>
                    </div>
                </div>
            </form> 
        </div> 
        </div>
        </div>
        <!-- end wrapper -->

  <jsp:include page="footer.jsp"></jsp:include>

</body>
</html>
