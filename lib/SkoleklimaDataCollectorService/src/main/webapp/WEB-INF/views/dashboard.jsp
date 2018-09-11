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
                    <h1 class="page-header">Dashboard</h1>
                </div>
                <!--End Page Header -->
            </div>

           
            <div class="row">
                <!-- Start welcome  message to the user on the dashboard-->
                <div class="col-lg-12">
                    <div class="alert alert-info">
                        <i class="fa fa-folder-open"></i><b>&nbsp;Hello ! </b>Welcome Back <b>Kumar</b>
                         <i class="fa  fa-pencil"></i>
                    </div>
                </div>
                     <!-- End welcome  message to the user on the dashboard-->
            </div>

            <div class="row">
                <div class="col-lg-8">

                    <!-- Start Area chart example -->
                    <div class="panel panel-primary">
                        <div class="panel-heading">
                            <i class="fa fa-bar-chart-o fa-fw"></i>Connected Device Chart
                            <div class="pull-right">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                                        Filter
                                        <span class="caret"></span>
                                    </button>
                                    <ul class="dropdown-menu pull-right" role="menu">
                                        <li><a href="#">RaspberryPi</a>
                                        </li>
                                        <li><a href="#">Another action</a>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="panel-body">
                            <div id="morris-area-chart"></div>
                        </div>

                    </div>
                    <!--End area chart example -->
                    
                </div>
                <div class="col-lg-4">
                    <div class="panel panel-primary text-center no-boder">
                        <div class="panel-body yellow">
                            <i class="fa fa-bar-chart-o fa-3x"></i>
                            <h3>7 </h3>
                        </div>
                        <div class="panel-footer">
                            <span class="panel-eyecandy-title">Daily User Visits
                            </span>
                        </div>
                    </div>
                    <div class="panel panel-primary text-center no-boder">
                        <div class="panel-body green">
                            <i class="fa fa fa-floppy-o fa-3x"></i>
                            <h3>3</h3>
                        </div>
                        <div class="panel-footer">
                            <span class="panel-eyecandy-title">Connected RaspberryPi
                            </span>
                        </div>
                    </div>
                    <div class="panel panel-primary text-center no-boder">
                        <div class="panel-body red">
                            <i class="fa fa-thumbs-up fa-3x"></i>
                            <h3>5 </h3>
                        </div>
                        <div class="panel-footer">
                            <span class="panel-eyecandy-title">Number Of User Registered
                            </span>
                        </div>
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
