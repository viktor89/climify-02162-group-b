<!-- Navigation -->
<div class="element" id="side-navigation">
	<?php
        require_once $_SERVER['DOCUMENT_ROOT'].'/api/v2/Authorizer.php';
        $authorizer = new Authorizer();
		if(	$currentUserRole == 1 ) {
			$currentUserRights = "System administrator";
		} else if(	$currentUserRole == 15 ) {
			$currentUserRights = "System observer";
		}
		 else {
			$currentUserRights = $currentUserSchoolAllowed;
		}
	?>
	<h4 class="user-info-nav"><?php echo $currentUserFirstName. " " .$currentUserLastName ?></h4>
	<p class="user-info-nav"><?php echo $currentUserRights; ?></p>
	<hr class="user-info-nav">
	<nav>
		<ul>
			<?php if ($authorizer->userHasPermisson($currentUserID, "Manage Institution")) { ?>
				<li class="menu-link menu-link-manage-institution" data-go-to="manage-institution">
					<a href="#/manage-institution">
						<i class="menu-link-ico nav-icon fa fa-building" aria-hidden="true"></i>
						<p class="menu-link-text">Manage Institution</p>
					</a>
				</li>
            <?php } ?>
            <?php if ($authorizer->userHasPermisson($currentUserID,"Manage Devices")) { ?>
				<li class="menu-link menu-link-manage-sensors" data-go-to="manage-sensors">
					<a href="#/manage-sensors">
						<i class="menu-link-ico nav-icon fa fa-rss" aria-hidden="true"></i>
						<p class="menu-link-text">Manage Devices</p>
					</a>
				</li>
            <?php } ?>
            <?php if ($authorizer->userHasPermisson($currentUserID,"Graphs")) { ?>
				<li class="menu-link menu-link-data" data-go-to="data">
					<a href="#/graphs">
						<i class="menu-link-ico nav-icon fa fa-area-chart" aria-hidden="true"></i>
						<p class="menu-link-text">Graphs</p>
					</a>
				</li>
            <?php } ?>
            <?php if ($authorizer->userHasPermisson($currentUserID,"Users & Roles")) { ?>
                <li class="menu-link menu-link-other-users" data-go-to="other-users">
                    <a href="#/other-users">
                        <i class="menu-link-ico nav-icon fa fa-users" aria-hidden="true"></i>
                        <p class="menu-link-text" id="menu-link-text-other-users">Users & Roles</p>
                    </a>
                </li>
            <?php } ?>
            <?php if ($authorizer->userHasPermisson($currentUserID,"Climate Control")) { ?>
                <li class="menu-link menu-link-climate-control" data-go-to="climate-control">
                    <a href="#/climate-control">
                        <i class="menu-link-ico nav-icon fa fa-thermometer-half" aria-hidden="true"></i>
                        <p class="menu-link-text" id="menu-link-text-climate-control">Climate Control</p>
                    </a>
                </li>
            <?php } ?>
            <li class="menu-link menu-link-communication" data-go-to="communication"></i>
                <a href="#/logbook">
                    <i class="menu-link-ico nav-icon fa fa-comments" aria-hidden="true"></i>
                    <p class="menu-link-text">Logbook</p>
                </a>
            </li>
            <li class="menu-link menu-link-own-user" data-go-to="own-user">
                <a href="#/your-profile">
                    <i class="menu-link-ico nav-icon fa fa-user" aria-hidden="true"></i>
                    <p class="menu-link-text">Your profile</p>
                </a>
            </li>
            <li class="menu-link menu-link-system-settings" data-go-to="system-settings"></i>
                <a href="#/settings">
                    <i class="menu-link-ico nav-icon fa fa-cog" aria-hidden="true"></i>
                    <p class="menu-link-text">Settings</p>
                </a>
            </li>
            <hr>
            <li class="menu-link menu-link-learning" data-go-to="learning"></i>
                <a>
                    <i class="menu-link-ico nav-icon fa fa-book" aria-hidden="true"></i>
                    <p class="menu-link-text">Education</p>
                </a>
            </li>

			<span class="mobile-sign-out">
				<hr>
				<li class="menu-link menu-link-sign-out">
					<a href="#/">
						<i class="menu-link-ico nav-icon fa fa-sign-out" aria-hidden="true"></i>
						<p class="menu-link-text">Log out</p>
					</a>
				</li>
			</span>

		</ul>
	</nav>
	<div class="system-about-link"><i class="fa fa-info-circle" aria-hidden="true"></i>
</div>
	<div class="system-version-number"><p>v. <?php echo $system_version ?></p></div>
	<img src="img/nav/nav_bg.png">
</div>