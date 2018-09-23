<!-- Own user -->
<div class="single-view view-other-users">
	<div class="other-users-top">
		<span>
			<h3>Other profiles</h3>
			<p>Here you can create and edit other users</p>
		</span>
		<span>
			<span>
				<?php if ( $currentUserRole == 1 ) { ?>

				<select class="list-schools-other-users" name="option" id = "schoolOptions">
					<option value="" selected>Choose Institution</option>
					<!-- Content goes here -->
				</select>
				<?php } ?>
				<button class="link" id="btn-toggle-create-user">New user</button>
			</span>
			<span>
				<input type="text" id="inp-search-user" placeholder="Søg...">
				<button class="link" id="btn-search-user-user">Find user</button>
			</span>
		</span>
	</div>
	<hr>
	<div class="other-users-create">
		<i id="icn-close-create-other-user" class="link fa fa-times" aria-hidden="true"></i>
		<h4>Create user</h4>
		<div class="create-user-wrapper">
			<div class="create-user-wrapper-left">
				<p class="create-other-user-school-info"></p>
				<input type="hidden" class="readonly" id="inp-other-user-shcool" value="<?php echo $currentUserSchoolAllowed ?>" readonly>
				<span>
					<label for="inp-other-user-role">User role</label>
					<select id="inp-other-user-role" name="option">
							<option value="4" selected>Limited User</option>
							<option value="3">User</option>
							<option value="2">Building Manager</option>
					</select>
				</span>
				<span>
					<label for="inp-other-user-username">Username *</label>
					<input type="text" class="" id="inp-other-user-username" placeholder="4 til 8 tegn">
				</span>
				<span>
					<label for="inp-other-user-firstname">First name *</label>
					<input type="text" class="" id="inp-other-user-firstname">
				</span>
				<span>
					<label for="inp-other-user-lastname">Surname *</label>
					<input type="text" class="" id="inp-other-user-lastname">
				</span>
				<span>
					<label for="inp-other-user-email">Email</label>
					<input type="email" class="" id="inp-other-user-email">
				</span>
				<p>Fields with * needs to be filled</p>
				</div>
				<div class="create-user-wrapper-right">
					<p><strong>Building Manager</strong><br>
					Can administer school sensors, add and administer school users on their own school, see data from all the school sensors and edit their own profile.</p>
					<p><strong>User</strong><br>
					Can see data from all the schools sensors and edit their own profile.</p>
					<p><strong>Limited User</strong><br>
					Can see all data from all the schools sensors.</p>
				</div>
			</div>
		<div class="btn-create-other-user-wrapper">
			<button id="btn-create-other-user">Create User</button>
		</div>
	</div>	
	<div class="other-users-list">
		<h4 class="other-users-list-school-info"></h4>
		<p class="admin-pass-info">Passwords needs to consist of minimum 8 characters, at least one small letter, at least one large letter and at least one number.</p>
		<div class="other-users-list-wrapper" id="other-users-list-title-wrapper">
			<p>Username</p>
			<p>First name</p>
			<p>Last name</p>
			<p>Email</p>
			<p>Password</p>
			<p>User role</p>
			<p></p>
		</div>
		<div class="other-users-list-wrapper" id="other-users-list-content-wrapper">
			<!-- Content goes here -->	
		</div>
	</div>
	<div class="other-users-space">
	</div>
	<div class="unactivated-users-list">
		<h4 class="unactivated-users-list-school-info"></h4>
		<div class="unactivated-users-list-wrapper" id="unactivated-users-list-title-wrapper">
			<p>Username</p>
			<p>First name</p>
			<p>Last name</p>
			<p>Email</p>
			<p></p>
		</div>
		<div class="unactivated-users-list-wrapper" id="unactivated-users-list-content-wrapper">
			<!-- Content goes here -->	
		</div>
	</div>		
</div>