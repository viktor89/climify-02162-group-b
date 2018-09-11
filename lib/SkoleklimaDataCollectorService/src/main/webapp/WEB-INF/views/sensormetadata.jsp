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
                    <h1 class="page-header">Sensor Medadata</h1>
                </div>
                <!--End Page Header -->
            </div>
                
       
       <!--======================Adding example ===========================-->
       <div class="container col-sm-9">
            <form:form method="POST" action="/updateSensorAddress" modelAttribute="sdata">
        <form:hidden path="id"/>
        <br><br>
                <div class="form-group">
                    <label for="uid" class="col-sm-3 control-label">UID</label>
                    <div class="col-sm-9">
                      <form:input path="uid" cssClass="form-control disabled" />                     
                    </div>
                </div>
                <div class="form-group">
                    <label for="thingTypeUID" class="col-sm-3 control-label">Things UID</label>
                    <div class="col-sm-9">
                       <form:input  path="thingTypeUID" cssClass="form-control disabled" />                       
                    </div>
                </div>
                <div class="form-group">
                    <label for="address" class="col-sm-3 control-label">Address</label>
                    <div class="col-sm-9">
                       <form:input  path="address" cssClass="form-control" />                        
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="col-sm-3 control-label">List of Linked Item</label>
                </div>
                
                 <div class="panel-body">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="table-responsive">
                                        <table class="table table-bordered table-hover table-striped">
                                            <thead>
                                                <tr>
                                                    
                                                    <th>Name</th>
                                                    <th>Label</th>
                                                    <th>Type</th>
                                                    <th>State</th>
                                                    <th>Measurement</th>
                                                    <th>Read only</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <c:forEach var="us" items="${sdata.sensorItemData}">   
											  	<tr>  
											      <td>${us.name}</td>
											      <td>${us.label}</td> 
											      <td>${us.type}</td> 
											      <td>${us.state}</td> 
											      <td>${us.mesurement}</td> 
											      <td> ${us.readOnly}</td>   
											   </tr>  
											   </c:forEach> 
                                                
                                            </tbody>
                                        </table>
                                    </div>

                                </div>

                            </div>
                            <!-- /.row -->
                        </div>
            

                <div class="form-group">

                </div> <!-- /.form-group -->
                <div class="form-group">
                    <div class="col-sm-9 col-sm-offset-3">
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </div>
            </form:form> <!-- /form -->
        </div> <!-- ./container -->
       <!--======================End Adding example ===========================-->
       
        </div>
        <!-- end page-wrapper -->
 
        </div>
        <!-- end page-wrapper -->

    </div>
    <!-- end wrapper -->

  <jsp:include page="footer.jsp"></jsp:include>

</body>
</html>
