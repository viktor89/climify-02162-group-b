<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
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
                    <h1 class="page-header">User Details</h1>
                </div>
            </div>

       <!--======================Adding user===========================-->
        <div class="row">
                <div class="col-lg-12">
                    <a class="btn btn-primary pull-right" style="margin-bottom: 10px;" href="add_user" role="button"><i class="fa fa-user-plus"></i>Add User</a>
            </div></div>          
      <!--======================Display existing user in table============-->               
                <div class="panel panel-primary">
                        <div class="panel-heading">
                            <i class="fa fa-bar-chart-o fa-fw"></i>Roles Management
                        </div>

                        <div class="panel-body">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="table-responsive">
                                        <table class="table table-bordered table-hover table-striped">
                                            <thead>
                                                <tr>
                                                    
                                                    <th>Full Name</th>
                                                    <th>Email</th>
                                                    <th>Date Of Birth</th>
                                                    <th>Gender</th>
                                                    <th>Role Name</th>
                                                    <th>School Name</th>
                                                    
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <c:forEach var="us" items="${usersList}">   
											  	<tr>  
											      <td>${us.name}</td>
											      <td>${us.email}</td> 
											      <td>${us.dob}</td> 
											      <td>${us.gender}</td> 
											      <td>${us.role.roleName}</td> 
											        <td>
											         <ol>
											         <c:forEach var="ros" items="${us.schoolData}">
											             <li>${ros.schoolName}</li>
											         </c:forEach> 
                                                      </ol>
                                                    </td>   
											    <td>
                                                    <a class="fa bs-f-size-2r fa-pencil" title="Edit user" href="edituser/${us.id}"></a>
                                					<a class="fa fa-trash" title="Delete user" href="deleteuser/${us.id}"></a>
                                                    </td>  
											   </tr>  
											   </c:forEach> 
                                                
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
        <!-- end page-wrapper -->
    </div>
    <!-- end wrapper -->

  <jsp:include page="footer.jsp"></jsp:include>

</body>
</html>
