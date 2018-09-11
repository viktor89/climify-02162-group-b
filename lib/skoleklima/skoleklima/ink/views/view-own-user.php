<!-- Own user -->
<div class="single-view view-own-user">
	<h3>Your profile</h3>
	<p class="text-own-profile-top-decription">Here you can edit your own profile</p>
	<hr>
	<div class="user-info-input">
		<span>
			<label for="inp-onw-user-username">Username</label>
			<input type="text" class="readonly" id="inp-onw-user-username" name="" value="<?php echo $currentUserName; ?>" readonly="readonly">
		</span>
		<?php if ( $currentUserRole == 2 ) { ?>
		<span>
			<label for="inp-onw-user-school">School</label>	
			<input type="text" class="readonly" id="inp-onw-user-school" name="" value="<?php echo $currentUserSchoolAllowed; ?>" readonly="readonly">
		</span>	
		<?php } ?>
		<span>
			<label for="inp-onw-user-first-name">First name * </label>
			<input type="text" id="inp-onw-user-first-name" name="" value="<?php echo $currentUserFirstName; ?>" >
		</span>
		<span>
			<label for="inp-onw-user-last-name">Last name * </label>
			<input type="text" id="inp-onw-user-last-name" name="" value="<?php echo $currentUserLastName; ?>" >
		</span>
		<span>
			<label for="inp-onw-user-email">Email:</label>
			<input type="email" id="inp-onw-user-email" name="" value="<?php echo $currentUserEmail; ?>" >
		</span>
		<p class="change-own-pass-click link"><i class="fa fa-lock" aria-hidden="true"></i>
change password</p>
		<div class="change-own-pass">
			<span>
				<label for="inp-onw-user-new-pass">New password</label>
				<input type="password" id="inp-onw-user-new-pass" name="" value="">
				<i class="ico-hide-show-own-user-pass ico-hide-own-user-pass fa fa-eye-slash link" aria-hidden="true"></i>
				<i class="ico-hide-show-own-user-pass ico-show-own-user-pass fa fa-eye link" aria-hidden="true"></i>

			</span>
			<span>
				<label for="inp-onw-user-new-pass-repeat">Repeat new password</label>
				<input type="password" id="inp-onw-user-new-pass-repeat" name="" value="">
			</span>
			<p>The password needs to consist of: </p>
			<p>- at leart 8 characters</p>
			<p>- at least 1 small letter</p>
			<p>- at least 1 capital letter</p>
			<p>- at least 1 number</p><br>
			<?php if ($currentUserRole == 3 || $currentUserRole == 15) { ?>
			<p class="pass-user-info">Notice that an administrator will be able to see your password</p>
			<?php } ?>
		</div>
		<span>
			<label for="inp-onw-user-current-pass">Current password * </label>
			<input type="password" id="inp-onw-user-current-pass" name="" value="" >
		</span>
		<p class="msg-own-user-type-current-pass">Write your current password to update your profile</p>
		<div class="btn-update-own-user-wrapper">
			<button id="btn-update-own-user">Save</button>
		</div>
		<p>Fields with * needs to be filled</p><br>
		<p>Last login: <?php echo $currentUserLastLogin ?></p>
		
	</div>
	<?php if ($currentUserRole == 3) { ?>
		<input class="check-intro-video" type="checkbox" val>Show intro video at login
	<?php } ?>
</div>