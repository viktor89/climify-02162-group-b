<!-- System data map -->
<div class="single-view view-communication">
	<div class="view-data-top">
	<span>
		<h3>Logbook</h3>
		<p>Share daily information and read news</p>
	</span>
	<span>
		<span>
			<?php if ( $currentUserRole == 1 || $currentUserRole == 15 ) { ?>
				<select class="list-schools-other-users" name="option" id="commuSelect">
					<option value="" selected>Choose Institution</option>
					<!-- Content goes here -->
				</select>
			<?php } ?>
		</span>
		<span>
			<button id="btn-write-message-communication">Write a message</button>
		</span>
	</span>
	</div>
	<hr>
	<div class="data-communication-wrapper">
		<div class="communication-area-wrapper-1">
			<div class="flow-communication-wrapper">
				<div class="add-communication-wrapper">
					 <div class="select-communication-type-wrapper">
                           <?php if ( $currentUserRole == 1 || $currentUserRole == 15 || $currentUserRole == 2 ) { ?>
                                <div class="inner-wrapper select-communication-type">
                                    <p>Write a message in</p>
                                    <select class="list-communication-type" name="option">
                                        <option value="1" selected>the logbook</option>
                                        <option value="2">news</option>
                                    </select>
                                </div>
                           <?php } ?>
                        <div class="inner-wrapper select-floor-plan">
							<select class="chart-select-map" id="mapLogbook">
							<option value="stand" selected>Choose Floor plan</option>
								<!-- <option value="1">Ingen måler valgt</option>  -->
								<!-- Content goes here -->
						
   						
							</select>
						</div>
                    </div>
					<div class="select-communication-sub">
						<div class="inner-wrapper inner-wrapper-sub">
						<p>Choose subject   </p>
							<select class="list-communication-subjects" name="option">
								<option value="Temperatur" selected>Temperature</option>
								<option value="Luftkvalitet">Air quality</option>
								<option value="Støj">Noise</option>
								<option value="Skoleklima.dk">Skoleklima.dk</option>
								<option data-box-name="Andet" value="other">Other</option>
							</select>
						</div>
						<div class="inner-wrapper inner-wrapper-itm">
							<p>Choose Location</p>
							<select class="chart-select-location" id="comuSelect" style="margin-top:25px">
							<option value="locStand" selected>Choose Location</option>
								<!-- <option value="1">Ingen måler valgt</option>  -->
								<!-- Content goes here -->
						
   						
							</select>
						</div>
					</div>	
					<span id="communication-subjects-manually-wraper" class="communication-subjects-wrapper">
						<p>Subject</p>
						<input type="text" id="communication-subjects-manually" name="">
					</span>
					<span id="communication-subjects-manually-news-wraper" class="communication-subjects-wrapper">
						<p>Headline</p>
						<input type="text" id="communication-subjects-news-manually" name="">
					</span>
					<p>Message</p>
					<textarea id="communication-message-body" placeholder=""></textarea>
					<div class="button-communication-wrapper">
						<button id="create-message-from-user">Create message</button>
					</div>
				</div>
				<div class="user-communication-wrapper">
					<!-- Content goes here -->
				</div>
				<p class="load-more-message-user link"><i class="fa fa-arrow-down" aria-hidden="true"></i> Show more</p>
				<p class="load-more-message-info-no-school">Choose a school to see communication</p>
			</div>
			<div class="oficial-communication-wrapper">
				<div class="oficial-communication-inner-wrapper">
					<!-- Content goes here -->
				</div>				
				<p class="load-more-message-admin link"><i class="fa fa-arrow-down" aria-hidden="true"></i> Show more</p>
			</div>
		</div>
	</div>
</div>