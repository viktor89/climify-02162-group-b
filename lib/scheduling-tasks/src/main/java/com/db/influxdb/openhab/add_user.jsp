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
                    <h1 class="page-header">Create New User With Roles</h1>
                </div>
                <!--End Page Header -->
            </div>
                
       
       <!--======================Adding example ===========================-->
       <div class="container col-sm-9">
            <form:form method="POST" action="/saveuser" modelAttribute="newuser">
        <form:hidden path="id"/>
        <br><br>
                <div class="form-group">
                    <label for="firstName" class="col-sm-3 control-label">Full Name</label>
                    <div class="col-sm-9">
                      <form:input path="name" cssClass="form-control" />
                        <span class="help-block">Last Name, First Name, eg.: Smith, Harry</span>
                    </div>
                </div>
                <div class="form-group">
                    <label for="email" class="col-sm-3 control-label">Email</label>
                    <div class="col-sm-9">
                       <form:input  path="email" cssClass="form-control" />                       
                    </div>
                </div>
                <div class="form-group">
                    <label for="password" class="col-sm-3 control-label">Password</label>
                    <div class="col-sm-9">
                       <form:password  path="password" cssClass="form-control" />                        
                    </div>
                </div>
                <div class="form-group">
                    <label for="birthDate" class="col-sm-3 control-label">Date of Birth</label>
                    <div class="col-sm-9">
                       <form:input path="dob" type="date" cssClass="form-control" />
                    </div>
                </div>
                
                
                
                <div class="form-group">
                    <label for="country" class="col-sm-3 control-label">Role Name</label>
                    <div class="col-sm-9">
                       
                       <form:select path="role" cssClass="form-control" >
                           <c:forEach var="rol" items="${rolesItem}">
								<form:option value="${rol.id}">${rol.roleName}</form:option>
						   </c:forEach> 
                       </form:select>
                    </div>
                </div> <!-- /.form-group -->
                
               <div class="form-group">
                    <label for="country" class="col-sm-3 control-label">School Name</label>
                    <div class="col-sm-9">
                    
                    <form:select path="schoolData"  multiple="true" >
                       <c:forEach var="ros" items="${rossItem}">
								<form:option value="${ros.id}">${ros.schoolName}</form:option>
					   </c:forEach> 
                    </form:select>
                    
                    </div>
                </div> <!-- /.form-group --> 
                               
                <div class="form-group">
                    <label class="control-label col-sm-3">Gender</label>
                    <div class="col-sm-6">
                        <div class="row">
                            <div class="col-sm-4">
                                <label class="radio-inline">
                                   <form:radiobutton path="gender" value="Male"/> Male 
                                </label>
                            </div>
                            <div class="col-sm-4">
                                <label class="radio-inline">
                                    <form:radiobutton path="gender" value="Female"/>Female
                                </label>
                            </div>
                        </div>
                    </div>
                </div> <!-- /.form-group -->

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

    <!-- end wrapper -->

  <jsp:include page="footer.jsp"></jsp:include>

</body>
</html>
