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
                    <h1 class="page-header">Add Role</h1>
                </div>
                <!--End Page Header -->
            </div>
                
       
       <!--======================Adding example ===========================-->
       <div class="container">
        <form:form method="POST" action="/saveroles" modelAttribute="ro">
        <form:hidden path="id"/>
        <div class="form-group">
              <label for="usr">Role Name:</label>
              <form:input path="roleName"/>
        </div>
            
       <div class="form-check">
          <label class="form-check-label">
          <form:checkbox cssClass="form-check-input" path="createNewUser"/> Create a New User
          </label>
       </div>

       <div class="form-check">
          <label class="form-check-label">
          <form:checkbox cssClass="form-check-input" path="activateDeactivate"/> Activate / Deactivate a user account
          </label>
       </div>
       
       <div class="form-check">
          <label class="form-check-label">
          <form:checkbox cssClass="form-check-input" path="createRole"/> Create a new role
          </label>
       </div>
       
	<!-- %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%start New added --///////////////////////////////// -->
	   <div class="form-check">
          <label class="form-check-label">
          <form:checkbox cssClass="form-check-input" path="assignRole"/> Assign a role to a user
          </label>
       </div>
	
	<!--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%-end New added --////////////////////////////////////--> 
       
       <div class="form-check">
          <label class="form-check-label">
          <form:checkbox cssClass="form-check-input" path="changePermission"/> Change a role permission
          </label>
       </div>
       
       <div class="form-check">
          <label class="form-check-label">
          <form:checkbox cssClass="form-check-input" path="provideAccessPrivilage"/> Provides access privilege to a user based on their roles
          </label>
       </div>
       
        <div class="form-check">
          <label class="form-check-label">
          <form:checkbox cssClass="form-check-input" path="addLocationToDevice"/> Add location details to the device(i.e Sensors, Actuators, RaspberryPi)
          </label>
       </div>
       
        <div class="form-check">
          <label class="form-check-label">
          <form:checkbox cssClass="form-check-input" path="viewDeviceDetails"/> View existing device details(i.e location, device id, device name etc.)
          </label>
       </div>
       
        <div class="form-check">
          <label class="form-check-label">
          <form:checkbox cssClass="form-check-input" path="updateDeviceLocation"/> Update location details to a existing device
          </label>
       </div> 
       
       <div class="form-check">
          <label class="form-check-label"> 
          <form:checkbox cssClass="form-check-input" path="viewDeviceValue"/> View current Sensors / Actuators value
          </label>
       </div>    
                                      
      <div class="form-check">
          <label class="form-check-label">
          <form:checkbox cssClass="form-check-input" path="controlThermostat"/> Manage Actuators heat point
          </label>
     </div>  
    
    <div class="form-check">
          <label class="form-check-label">
          <form:checkbox cssClass="form-check-input" path="viewDataHistory"/> View past device data history
          </label>
     </div>   
     
       <div class="form-check">
          <label class="form-check-label">
          <form:checkbox cssClass="form-check-input" path="addNewDevice"/> Add new Sensors / Actuators on the openHAB
          </label>
       </div>
        
     
 	<!-- %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%start New added --///////////////////////////////// -->
	   <div class="form-check">
          <label class="form-check-label">
          <form:checkbox cssClass="form-check-input" path="removeSensorsActuators"/> Remove existing Sensors / Actuators from the openHAB
          </label>
       </div>
       
       <div class="form-check">
          <label class="form-check-label">
          <form:checkbox cssClass="form-check-input" path="addNewItems"/> Add new items on the openHAB
          </label>
       </div>
       
       <div class="form-check">
          <label class="form-check-label">
          <form:checkbox cssClass="form-check-input" path="removeExistingItems"/> Remove the existing item from the openHAB
          </label>
       </div>
       
       	<div class="form-check">
          <label class="form-check-label">
          <form:checkbox cssClass="form-check-input" path="visualizeDeviceData"/> Visualize the device data in a graph
          </label>
       </div>
	
	<!--%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%-end New added --////////////////////////////////////--> 

        <button type="submit" class="btn btn-primary">Submit</button>
          </form:form>
        </div>
       <!--======================End Adding example ===========================-->
       
        </div>
 
        </div>
        <!-- end page-wrapper -->

    <!-- end wrapper -->

  <jsp:include page="footer.jsp"></jsp:include>

</body>
</html>
