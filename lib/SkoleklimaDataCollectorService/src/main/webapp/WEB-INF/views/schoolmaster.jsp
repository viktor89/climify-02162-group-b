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
                    <h1 class="page-header">School Master</h1>
                </div>
                <!--End Page Header -->
            </div>
                
       
       <!--======================Adding example ===========================-->
       <div class="container col-sm-9">
            <form:form method="POST" action="/saveschool" modelAttribute="ro">
        <form:hidden path="id"/>
        <br><br>
                <div class="form-group">
                    <label for="schoolName" class="col-sm-3 control-label">School Name</label>
                    <div class="col-sm-9">
                      <form:input path="schoolName" cssClass="form-control" />                 
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="firstName" class="col-sm-3 control-label">School Address</label>
                    <div class="col-sm-9">
                      <form:input path="address" cssClass="form-control" />                 
                    </div>
                </div>
                
                
                
                <div class="form-group">
                    <label for="country" class="col-sm-3 control-label">Rassbery Pai</label>
                    <div class="col-sm-9">
                       
                       <form:select path="rosberrypaidata" cssClass="form-control" >
                           <c:forEach var="rol" items="${rossItem}">
								<form:option value="${rol.id}">${rol.rosberryName}</form:option>
						   </c:forEach> 
                       </form:select>
                    </div>
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
