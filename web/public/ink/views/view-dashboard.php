<!-- Dashboard -->
<div class="view view-dashboard">
	<?php
    if($authorizer->userHasPermisson($currentUserID, "Manage Institution")) {
        require_once "view-manage-institution.php";
    }
    if($authorizer->userHasPermisson($currentUserID, "Manage Devices")) {
        require_once "view-manage-sensors.php";
    }
    if($authorizer->userHasPermisson($currentUserID, "Graphs")) {
        require_once "view-data.php";
    }
    if($authorizer->userHasPermisson($currentUserID, "Users & Roles")) {
        require_once "view-other-users.php";
    }
    if($authorizer->userHasPermisson($currentUserID, "Climate Control")) {
        require_once "view-climate-control.php";
    }
    require_once "view-communication.php";
    require_once "view-own-user.php";
    require_once "view-system-settings.php"; ?>
	<div class="go-to-top">
		<a href="<?php echo $company_Website ?>#top-header" target="_self"><i class="ico-go-to-top fa fa-arrow-up link" aria-hidden="true"></i></a>
	</div>
	<div class="cookie-info-outer-wrapper">
		<div class="cookie-info-wrapper">
			<div>
				<img src="img/logo/cook_ico.png" alt="Cookie">
				<p>This site uses cookies to remember your settings.</br>
				By continuing on the site, you accept the use of cookies. 
				</p>
		</div>
			<button id="btn-accept-cookie">OK</button>
		</div>
	</div>
</div>