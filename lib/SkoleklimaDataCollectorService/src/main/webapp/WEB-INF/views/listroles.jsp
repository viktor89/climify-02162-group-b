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
                <!-- Page Header -->
                <div class="col-lg-12">
                    <h1 class="page-header">Role Details</h1>
                </div>
                <!--End Page Header -->
            </div>
               <div class="row">
                <div class="col-lg-12">
            <a class="btn btn-primary pull-right" style="margin-bottom: 10px;" href="addrole" role="button"><i class="fa fa-user-plus"></i>Add Role</a>
            </div></div>
 <!--====================== Start Roles table example ===============================-->
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
                                                    <th>Role Name</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            
											   <c:forEach var="r" items="${lroles}">   
											  	<tr>  
											   <td>${r.roleName}</td>  
											    <td>
                                                    <a class="fa bs-f-size-2r fa-pencil" title="Edit roles" href="editrole/${r.id}"></a>
                                                    <a class="fa fa-user" title="Show users" href="role_users/${r.id}"></a>      
                                					<a class="fa fa-trash" title="Delete role" href="deleterole/${r.id}"></a>
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
        <!-- end page-wrapper -->

    </div>
    <!-- end wrapper -->

  <jsp:include page="footer.jsp"></jsp:include>

</body>
</html>
