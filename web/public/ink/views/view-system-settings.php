<!-- System settings -->
<div class="single-view view-system-settings">
	<div class="system-admin-top">
		<span>
			<h3>System settings</h3>
			<p>Overall system administration</p>
		</span>
		<span>
			<button class="link" id="btn-toggle-create-admin">Create system users</button>
			<button class="link" id="btn-toggle-list-admin">Show system users</button>
		</span>
	</div>
	<hr>
	<div class="other-admin-edit">
		<i id="icn-close-create-admin-user" class="link fa fa-times" aria-hidden="true"></i>
		<h4>Opret administrator</h4>
		<div class="create-user-wrapper">
			<div class="create-user-wrapper-left">
				<span>
					<label for="inp-other-admin-user-role">User role</label>
					<select id="inp-other-admin-user-role" name="option">
							<option value="15" selected>System observer</option>
							<option value="1">System administrator</option>
					</select>
				</span>
				<span>
					<label for="inp-other-admin-username">Username *</label>
					<input type="text" class="" id="inp-other-admin-username" placeholder="4 to 8 characters" maxlength="7">
				</span>
				<span>
					<label for="inp-other-admin-firstname">First name *</label>
					<input type="text" class="" id="inp-other-admin-firstname">
				</span>
				<span>
					<label for="inp-other-admin-lastname">Last name *</label>
					<input type="text" class="" id="inp-other-admin-lastname">
				</span>
				<span>
					<label for="inp-other-admin-email">Email</label>
					<input type="email" class="" id="inp-other-admin-email">
				</span>
				<p>Fields with * needs to be filled</p>
			</div>
			<div class="create-user-wrapper-right">
				<p><strong>System administrator</strong><br>
				Can administer sensors on all schools, create and administer system users and local users on all schoold, view data from all sensors on all schools and edit their own profile.</p>
				<p><strong>System observer</strong><br>
				Can see data from all sensors on every institution and edit their own profile.</p>
			</div>
		</div>
		<div class="btn-create-other-admin-wrapper">
			<button id="btn-create-other-admin">Opret administrator</button>
		</div>
	</div>
	<div class="list-other-admin-users-create">
		<i id="icn-close-list-other-admin-users-create" class="link fa fa-times" aria-hidden="true"></i>
		<h4>Overview of super users</h4>
		<p>Notice, that when a system user has been created, he or she cannot be altered, only deleted. The person will be able to change their own password afterwards.</p>
		<div class="other-admin-list-wrapper" id="other-admin-list-content-wrapper">
			<!-- Content goes here -->
		</div>
	</div>


	<hr>

	<div class="settings-user-company-info-wrapper">
		<h4>Owner information</h4>
		<p>!!! Here should be a text about general system licence !!!</p>
		<div class="company-contant-info-wrapper">
			<!-- Content geos here -->
		</div>
		<p>To update your information pleace contact <a href="mailto:<?php echo $company_Email ?>?Subject=Update%20company%20information%20-%20company%20id-number:%20<?php echo $currentUserCompanyID ?>" target="_top"><?php echo $company_Email ?></a></p>
	</div>
	<div class="settings-user-profil-info-wrapper">
		<h4>Database status</h4>
		<p>The system provides you with a database for storing device measurements. <br>
		In case that the system not connected to a database automatically, you should contact <a href="mailto:<?php echo $company_Email ?>?Subject=Influx%20connection%20error%20-%20company%20id-number:%20<?php echo $currentUserCompanyID ?>" target="_top"><?php echo $company_Email ?></a></p>
		<div class="db-status status-ok">
			<span>
				<div class="live-indicator live-indicator-on">
					<div class="double-bounce1"></div>
					<div class="double-bounce2"></div>
				</div>
				<p>Connected successfully to database!</p>
			</span>
		</div>
		<div class="db-status status-error">
			<p><i class="ico-error-red fa fa-times" aria-hidden="true"></i> Connection error!</p>
		</div>
	</div>
	<div class="building-list-header">
		<h4>Building list</h4>
		<button id="btn-create-new-building-show">Manage Institutions</button>
	</div>
	<div class="building-list-body">
		<div id="building-list-wapper"><!-- Date goes here --></div>
		<div class="building-detail-wapper" data-selected-building-id="">
			<div class="building-detail-innerwapper">
				<div class="building-detail-wapper-left">
					<h4 class="building-detail-h4"></h4>
					<label for="inp-building-name">Institution Name</label>
						<input list="buildingResults" id="inp-building-name">
						<datalist id="buildingResults">
						</datalist>
					<label for="inp-building-decription">Institution Description</label>
					<textarea id="inp-building-decription" ></textarea>
				</div>
				
			</div>
			
			
			<div class="building-button-wrapper">
				<button id="btn-delete-building" class="delte-button">Delete</button>
				<button id="btn-save-building"></button>
				<button id="btn-update-building">Update</button>
			</div>	
		</div>
	</div>
</div>