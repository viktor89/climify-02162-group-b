<!-- Dashboard -->
<div class="view view-dashboard">
	<?php
		if ($currentUserRole == 1) {
			require_once "view-devices.php";
			require_once "view-data.php";
			require_once "view-data-map.php";
			require_once "view-other-users.php";
			require_once "view-own-user.php";
			require_once "view-system-settings.php";
		} elseif ($currentUserRole == 15) {
			require_once "view-data.php";
			require_once "view-data-map.php";
			require_once "view-own-user.php";
		} elseif ($currentUserRole == 2) {
			require_once "view-devices.php";
			require_once "view-data.php";
			require_once "view-data-map.php";
			require_once "view-other-users.php";
			require_once "view-own-user.php";
			require_once "view-permissions.php";
		} elseif ($currentUserRole == 3) {
			require_once "view-data.php";
			require_once "view-data-map.php";
			require_once "view-other-users.php";
			require_once "view-own-user.php";
		} elseif ($currentUserRole == 4) {
			require_once "view-data.php";
			require_once "view-data-map.php";
		}
		if($currentPermLogbook == 1 ){
			require_once "view-communication.php";
		}
	?>
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