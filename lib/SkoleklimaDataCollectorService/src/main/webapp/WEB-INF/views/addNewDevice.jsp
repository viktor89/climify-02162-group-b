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
                    <h1 class="page-header">Add new device to the openHAB</h1>
                </div>
            </div>
          
<!--           %%%%%%%%%%%%%%%%%%%%%%%%%%%%% START TO ADD NEW DEVICE CONTENT %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->
		
                
		             
		<!-- ----------------------Install binding---------------------- -->
		            
		             <button id="su" class="btn btn-default" >Extension Sync</button>
		             <button id="lexten" class="btn btn-default" >Load Extension</button>
		                    
		             <select id="discovery" class="btn btn-default" >
		               <option>Select</option>
		            </select>
		            
            <button id="installDevice" class="btn btn-default" >Install</button>
		 <!-- ----------------------Search inbox-------------------------- -->           
		             
		            
		            <button id="inboxb" class="btn btn-default" >Inbox</button>
		                    
		             <select id="inboxsel" class="btn btn-default" >
		               <option>Select</option>
		            </select>
		            
		            <button id="approveInstall" class="btn btn-default" >Approve</button><br/>
		            
		             <!-- ----------------------List all the things-------------------------- --> 
		                          
		        <button id="listThing" class="btn btn-default">List All Things</button><br/>
		            
		            <div class="container">
                     <div class="panel-group" id="accordion">
		                
		            
		             </div>
		            </div>
		            
            
            
<!--           %%%%%%%%%%%%%%%%%%%%%%%%%%%%% END TO ADD NEW DEVICE CONTENT %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->

<!--           %%%%%%%%%%%%%%%%%%%%%%%%%%%%% START TO ADD NEW I CONTENT %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->
              <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
            <div class="row">
                 	<div class="col-lg-12">
                    <h1 class="page-header">Add device corresponding items on the openHAB</h1>
                	</div>
            </div>
            
              <select id="selectDeviceBindingName" class="btn btn-default">
               <option>Select device binding name to add corresponding item</option>
             </select>
            
              <select id="selectDeviceItem" class="btn btn-default">
               <option>Select corresponding device binding item</option>
             </select>
                
                <button type="button" id="addDeviceItem" class="btn btn-default">Add device corresponding item</button>
                
                
                

<!--           %%%%%%%%%%%%%%%%%%%%%%%%%%%%% END TO ADD NEW I CONTENT %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->

        </div>
        <!-- end page-wrapper -->

    </div>
    <!-- end wrapper -->

  <jsp:include page="footer.jsp"></jsp:include>
  
  <script>
       connect();
       
       $('#su').on('click', function() {
    	   discovery();	
    	});
       
       
       
       $('#lexten').on('click', function() {
    		$.get( "/check/extensionList", function( data ) {
    			$('#discovery').empty();
    			if(data){
    			$.each( data, function( key, obj ) {
    			$('#discovery').append($('<option>', {value:obj.id, text:obj.label}));
    			});
    			}
    		  });
    	});
       
       $('#installDevice').on('click', function() {
    	   installExtension($('#discovery').val());
    	});
       
       $('#inboxb').on('click', function() {
    	   callInbox();
    	});
       
       $('#listThing').on('click', function() {
    	   callThings();
    	});
       
       
       $('#approveInstall').on('click', function() {
    	   callApprove($('#inboxsel').val());
    	});
       
       $('#itemInstall').on('click', function(e) {
    	   e.preventDefault();
    	  
    	});
       
        
             
       $('#deviceUninstall').on('click', function(e) {
    	   e.preventDefault();
    	   
    	});
       
       function uninstallItem(item,uid){
    	   uninstallItems(item,uid);
       }
       
       function installItem(label, uid, itemtype){
    	   installItems(label, uid, itemtype);
       }
       
       
  </script>

</body>
</html>
