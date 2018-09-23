<!-- Login -->
<div class="view view-login">
	<div class="img-con"></div>
	<div class="login-con">
		<div class="login-from">
			<h1>Log ind</h1>
			<span>
				<input id="inp-login-name" class="login-input" type="text" name="" placeholder="Brugernavn">
				<input id="inp-login-pass" class="login-input" type="password" name="" placeholder="Adgagnskode">
				<div>
					<p class="txt-wrong-login">Wrong login</p>
					<button id="btn-system-login">Log ind</button>
				</div>
			</span>
			<p>Login using your username and password.<br><br>
			<strong>If an error occur, contact <?php $company_Name ?><br>
			<a href="mailto:<?php echo $company_Email ?>" target="_top"><?php echo $company_Email ?></a>
			</strong></p><br>
			<p>Not a user yet? <a id="link-request-new-limited-profile" href="#/opret-bruger">Click here</a> to request for a free profile.</p>
			<p><a id="link-request-new-profile" href="#/opret-profil">Click here</a> to register your firm for free.
		</div>
		<div class="overner-info">
			<p>Copyright © <?php echo date("Y") . " - " . $company_Name; ?></p>
		<img src="img/logo/logo2.png">
		</div>
	</div>
	<div class="view-signup">
		<div class="view-signup-inner-wrapper">
			<div class="view-signup-header">
				<a href="#/"><i class="ico-close-signup link fa fa-times"></i></a>
				<h2>Welcome to skoleklima.dk!</h2>
				<p>Skoleklima.dk is under development in the Smart City Accelerator (SCA) project, financed by the EU Interreg program. <br>
				The system can, while it's in the development phase, be used by companies for free. Fill out the form below to send a request.</p>
			</div>
			<div class="view-signup-body">
				<div class="view-signup-body-element view-signup-body-left">
					<h4 class="signup-h4">Logon information</h4>
					<span>
					<label for="inp-signup-company-username">Username *</label>
						<input class="inp-signup" id="inp-signup-company-username" type="text" maxlength="7"><br>
					<label for="inp-signup-company-password">Password *</label>
						<input class="inp-login-signup" id="inp-signup-company-password" type="password">
					</span>
					<h4 class="signup-h4">General</h4>
					<span>
						<label for="inp-signup-company-companyname">Company name *</label>
						<input class="inp-signup" id="inp-signup-company-companyname" type="text"><br>
					</span>
					<span>
						<label for="inp-signup-company-country">Country *</label>
							<select id="inp-weather-countrys" type="text"></select><br>
						<label for="inp-signup-company-municipality">Municipality *</label>
							<input list="searchResults" class="inp-signup" id="search" type="text"><br>

						<datalist id="searchResults">
						</datalist>
					</span>
					<h4 class="signup-h4">Contact</h4>
					<span>
						<label for="inp-signup-company-contact-first-name">First name *</label>
						<input class="inp-signup" id="inp-signup-company-contact-first-name" type="text"><br>
					</span>
					<span>
						<label for="inp-signup-company-contact-last-name">Surname *</label>
						<input class="inp-signup" id="inp-signup-company-contact-last-name" type="text"><br>
					</span>
					<span>
						<label for="inp-signup-company-contact-email">Email *</label>
						<input class="inp-signup" id="inp-signup-company-contact-email" type="email"><br>
					</span>
					<span>
						<label for="inp-signup-company-contact-phone1">Phone *</label>
						<input class="inp-signup" id="inp-signup-company-contact-phone1" type="number"><br>
					</span>
					<span>
						<label for="inp-signup-company-contact-phone2">Phone 2</label>
						<input class="inp-signup" id="inp-signup-company-contact-phone2" type="number"><br>
					</span>
					
				</div>
				<div class="view-signup-body-element view-signup-body-right">
					<h4 class="signup-h4">Address</h4>
					<span>
						<label for="inp-signup-company-street1">Address 1 *</label>
						<input class="inp-signup" id="inp-signup-company-street1" type="text"><br>
					</span>
					<span>
						<label for="inp-signup-company-street2">Address 2</label>
						<input class="inp-signup" id="inp-signup-company-street2" type="text"><br>
					</span>
					<span>
						<label for="inp-signup-company-zipcode">Zip code *</label>
						<input class="inp-signup" id="inp-signup-company-zipcode" type="number" max="9999"><br>
					</span>
					<span>
						<label for="inp-signup-company-city">City *</label>
						<input class="inp-signup" id="inp-signup-company-city" type="text"><br>
					</span>
					<div class="recaptcha-wrapper">
						<div class="g-recaptcha" data-sitekey="6LcTlEQUAAAAAC7P3MWLDoW7pM0bZPId8ZO2KK6y"></div>
					</div>
				</div>
			</div>
			<div class="view-signup-bottom">
				<button id="btn-send-profile-request">Send request</button>
			</div>
		</div>
	</div>
	<div class="view-limited-signup">
		<div class="view-signup-inner-wrapper">
			<div class="view-signup-header">
				<a href="#/"><i class="ico-close-signup link fa fa-times"></i></a>
				<h2>Welcome to skoleklima.dk!</h2>
				<p>Here you can request to become a limited user on skoleklima.dk. Get a username from an administrator from your school. That user will be able to accept your user request.</p>
			</div>
			<div class="view-signup-body">
				<div class="view-signup-body-element view-signup-body-left">
					
					<h4 class="signup-h4">Contact</h4>
					<span>
						<label for="inp-signup-contact-first-name">Fornavn *</label>
						<input class="inp-signup" id="inp-signup-first-name" type="text"><br>
					</span>
					<span>
						<label for="inp-signup-contact-last-name">Efternavn *</label>
						<input class="inp-signup" id="inp-signup-last-name" type="text"><br>
					</span>
					<span>
						<label for="inp-signup-contact-email">E-mail *</label>
						<input class="inp-signup" id="inp-signup-email" type="email"><br>
					</span>
					<span>
						<label for="inp-signup-contact-user-name">Username *</label>
						<input class="inp-signup" id="inp-signup-user-name" type="text" maxlength="7"><br>
					</span>
					<span>
						<label for="inp-signup-contact-password">Password *</label>
						<input class="inp-signup" id="inp-signup-password" type="text"><br>
					</span>	

					
				</div>
				<div class="view-signup-body-element view-signup-body-right">
					
				
					<h4 class="signup-h4">Choose system administrator</h4>
					
					<span>
						<label for="inp-signup-administrator">Administrators username *</label>
						<input class="inp-signup" id="inp-signup-administrator" type="text" minlength = "4" maxlength="7"><br>
					</span>
				
				</div>
			</div>
			<div class="view-signup-bottom">
				<button id="btn-send-limited-profile-request">Send request</button>
			</div>
		</div>
	</div>
</div>