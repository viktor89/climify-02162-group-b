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
                    <h1 class="page-header">Remove existing device from the the openHAB</h1>
                </div>
            </div>
            
            
<!--           %%%%%%%%%%%%%%%%%%%%%%%%%%%%% START TO REMOVE EXISTING DEVICE CONTENT %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->


             <select id="selectBindingToRemove" class="btn btn-default">
               <option>Select device binding name to remove</option>
            </select>
            
             <button type="button" id="uninstallBinding" class="btn btn-default">Remove Device Binding</button>
            
  
            
            
            
<!--           %%%%%%%%%%%%%%%%%%%%%%%%%%%%% END TO REMOVE EXISTING DEVICE CONTENT %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->



<!--           %%%%%%%%%%%%%%%%%%%%%%%%%%%%% START TO REMOVE EXISTING ITEM %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->

             <div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header">Remove corresponding items from the openHAB</h1>
                </div>
                
              </div>
                
             <select id="selectDeviceBinding" class="btn btn-default">
               <option>Select device binding name</option>
            </select>
            
             <select id="selectDeviceItemToRemove" class="btn btn-default">
               <option>Select device Item name</option>
            </select>
            
                
                <button type="button" id="removeItem" class="btn btn-default">Remove device corresponding item</button>
            

<!--           %%%%%%%%%%%%%%%%%%%%%%%%%%%%% END TO REMOVE EXISTING ITEM %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->

 	</div>
        </div>
        <!-- end page-wrapper -->

  
    <!-- end wrapper -->

  <jsp:include page="footer.jsp"></jsp:include>

</body>
</html>
