<!-- System data map -->
<div class="single-view view-data-map">
	<div class="view-data-top">
	<span>
		<h3>Sensors</h3>
		<p>An overview of installed sensors.</p>
	</span>
	<span>
		<span>
			<?php if ( $currentUserRole == 1 || $currentUserRole == 15 ) { ?>
				<select class="list-schools-other-users" name="option" id="dataViewSelect">
					<option value="" selected>Choose Institution</option>
					<!-- Content goes here -->
				</select>
			<?php } ?>
		</span>
		<span>
			<button class="btn-show-view-map-info">Show info</button>
		</span>
	</span>
	</div>
	<hr>
	<div class="data-map-info-wrapper">
		<i id="icn-close-data-map-info" class="link fa fa-times" aria-hidden="true"></i>
		<h4>Sensor information</h4>
		<div class="info-map-wrapper">
			<div class="left-info-wrapper info-wrapper">
				<p><strong>Sensor status</strong></p>
				<span>
					<div class="ic-meter-ico ic-meter-ico-info ic-meter-status-1">
					</div>
					<p>Good</p>
				</span>
				<span>
					<div class="ic-meter-ico ic-meter-ico-info ic-meter-status-2">
					</div>
					<p>Mediocre</p>
				</span>
				<span>
					<div class="ic-meter-ico ic-meter-ico-info ic-meter-status-3">
					</div>
					<p>Bad</p>
				</span>
				<span>
					<div class="ic-meter-ico ic-meter-ico-info ic-meter-status-0">
					</div>
					<p>No signal from sensor</p>
				</span>
				<span>
					<div class="ic-meter-ico ic-meter-ico-info ic-meter-status-1">
					    <div class="dev-radar">
					      <div class="dev-radar-pulse"></div>
					      <div class="dev-radar-pulse"></div>
					      <div class="dev-radar-pulse"></div>
					      <div class="dev-radar-pulse"></div>
					    </div>
					</div>
					<p>Receiving live data <br>(Color can vary)</p>
				</span>
			</div>
			<div class="middel-info-wrapper info-wrapper">
				<p><strong>Values for a good indoor climate</strong></p>
				<p>
					<i class="fa fa-thermometer-full" aria-hidden="true"></i> Temperature<br>
						<p style="color: #2c9601;">21-23 °C</p>
						<p style="color: #e8b72c;">20-21 and 23-24 °C</p>
						<p style="color: #ff4242;">Under 20 and above 24 °C</p>
					<i class="fa fa-tint" aria-hidden="true"></i> Humidity<br>
						<p style="color: #2c9601;">30-60 %</p>
						<p style="color: #e8b72c;">20-30 and 60-70 %</p>
						<p style="color: #ff4242;">Under 20 and above 70 %</p>
					<i class="fa fa-cloud" aria-hidden="true"></i> CO2-level<br>
						<p style="color: #2c9601;">Under 1.000 ppm</p>
						<p style="color: #e8b72c;">1.000-2.000 ppm</p>
						<p style="color: #ff4242;">Above 2.000 ppm</p>
					<i class="fa fa-microphone" aria-hidden="true"></i> Sound level <br>
						<p style="color: #2c9601;">Under 50 dB</p>
						<p style="color: #e8b72c;">50-70 dB</p>
						<p style="color: #ff4242;">Above 70 dB</p>
				</p>
			</div>
			<div class="right-info-wrapper info-wrapper">
				<p><i class="fa fa-thermometer-full" aria-hidden="true"></i> <strong>Temperature -</strong> It is important for our wellbeing, that the room that we reside in has the right temperature. We should neither freeze not be too hot. Studies have shown, that performance is enhanced at lower temperatures - which also means that less energy is used on creating heat.</p><br>
				<p><i class="fa fa-tint" aria-hidden="true"></i> <strong>Humidity -</strong> High humidity increases the chances for damages caused by moisture, i.e. mold. Similarly, very dry air can be unpleasent for humans. </p><br>
				<p><i class="fa fa-cloud" aria-hidden="true"></i> <strong>CO2-levels -</strong> Our performance and wellbeing is directly affected by CO2-levels in the air we reside in. At high levels, our ability to make decisions and learn is affected negatively.</p><br>
				<p><i class="fa fa-microphone" aria-hidden="true"></i> <strong>Sound levels -</strong> The sound level is a very important indicator for how nice it is to be in a room. Too much noise can make it hard to work and can result in headaches, stress and in the long run it can affect our hearing.</p><br>
			</div>
		</div>
		<form method="get" action="material/skoleklima_info.pdf" target="_blank">
			<button type="submit">Download information folder</button>
		</form>
	</div>
	<div class="data-map">
		<h4 class="map-selection-head map-selection-head-show"><!-- Content goes here --></h4>
		<div class="map-wrapper">
			<div class="map-location">
				<h2 class="map-info map-info-date-time"></h2>
				<p class="canvasDataInfo map-info map-info-no-school">Choose a school to show a map</p>
				<p class="canvasDataInfo map-info map-info-no-map">No maps available</p>
    			<div class="map-frame-wrapper">
					<div class="map-frame map-frame-show">
						<!-- Content goes here -->
		    		</div>
		    		<div class="device-frame device-frame-show">
						<!-- Content goes here -->
		    		</div>
	    		</div>
			</div>
			<div class="map-settings map-settings-show">
				<select class="map-selection map-selection-show" name="option">
					<!-- Content goes here -->
				</select>
				<h4>Choose display</h4>
				<div class="map-selection-btn-wrapper">		
					<button id="btn-map-select-date">Choose date</button>
					<button id="btn-map-show-live-data">Start livestream</button>
				</div>
				<div class="map-settings-show-info">
					<div class="map-settings-show-info-live mapLiveInfo">
						<div class="live-indicator live-indicator-on">
						  	<div class="double-bounce1"></div>
						  	<div class="double-bounce2"></div>
						</div>
						<p>Live sensor status</p>
					</div>

					<div class="map-settings-show-info-live-start mapLiveInfo">
						<p id="gettingLiveDataMap"><i class="fa fa-spinner fa-spin fa-1x fa-fw"></i> Loading data...</p>
					</div>

					<div class="map-settings-show-info-date mapLiveInfo">
						<p class="map-show-date"></p>
						<p class="map-show-time">At <span></span></p>
					</div>
				</div>
				<h4>Choose time of day</h4>
				<div class="map-settings-set-date-time-wrapper">
					<input id="map-set-timerange" type="range" min="0" max="2" value="1" />
					<span>
						<i class="ico-map-auto-play ico-map-auto-play-start fa fa-play" aria-hidden="true"></i>
						<i class="ico-map-auto-play ico-map-auto-play-stop fa fa-pause" aria-hidden="true"></i>
					</span>
				</div>
				<h4>Monitor the following:</h4>
				<span class="canvas-settings-check canvas-map-settings-checkbox inline-checkbox">
					<input id="check-map-data-temperature" class="map-show-monitor canvas-settings regular-checkbox" type="checkbox" value="false" checked="false">
					<label for="check-map-data-temperature"></label>
					<p>Temperature</p>
				</span>
				<span class="canvas-settings-check canvas-map-settings-checkbox inline-checkbox">
					<input id="check-map-data-humidity" class="map-show-monitor canvas-settings regular-checkbox" type="checkbox" value="false">
					<label for="check-map-data-humidity"></label>
					<p>Humidity</p>
				</span>
				<span class="canvas-settings-check canvas-map-settings-checkbox inline-checkbox">
					<input id="check-map-data-co2" class="map-show-monitor canvas-settings regular-checkbox" type="checkbox" value="false">
					<label for="check-map-data-co2"></label>
					<p>CO2 levels</p>
				</span> 
				<span class="canvas-settings-check canvas-map-settings-checkbox inline-checkbox">
					<input id="check-map-data-noiseAvg" class="map-show-monitor canvas-settings regular-checkbox" type="checkbox" value="false">
					<label for="check-map-data-noiseAvg"></label>
					<p>Sound</p>
				</span>
			</div>
		</div>
		<div class="data-map-charts-wrapper">
			<div class="data-map-charts">
				<div class="data-map-charts-content">
					<!-- Content goes here -->
				</div>
			</div>
			<div class="map-settings">
				<h4>Graph settings</h4>
				<p>Choose size</p>
				<select class="update-map-settings-graph-size">
					<option value="1" selected>Small</option>
					<option value="2">Medium</option>
					<option value="3">Large</option>
				</select>
				<span class="selected-device-from-map">
					<p>Chosen sensor: No sensor chosen</p>
				</span>
				<span>
					<button class="select-all-map-settings-graph button-disabled">Reset chosen ones</button>
					<button class="update-map-settings-graph">Update graph</button>
				</span>	
			</div>
		</div> 
			
		<div class="data-map-charts-wrapper-live">
			<div class="data-map-charts-live">
				<p id="gettingLiveDataMapDay"><i class="fa fa-spinner fa-spin fa-1x fa-fw"></i> Loading data...</p>
				<div class="data-map-charts-content-live">
					<!-- Content goes here -->
				</div>
			</div>
			<div class="map-settings-wrapper">
				<div class="map-setting-live">
					<h4>Graph settings</h4>
					<p>Choose size</p>
					<select class="update-map-settings-graph-size-day">
						<option value="1" selected>Small</option>
						<option value="2">Medium</option>
						<option value="3">Large</option>
					</select>
					<span class="selected-device-from-map">
						<p>Chosen sensor: No sensor chosen</p>
					</span>
					<span>
						<button class="select-all-map-settings-graph-day button-disabled">Reset chosen</button>
						<button class="update-map-settings-graph-day">Update graph</button>
					</span>	
				</div>
				<div class="map-suggestions">
					<h4>Suggestions for improvements</h4>
					<div class="map-suggestions-text">
						<p>Choose a sensor on the map to see its status and potential suggestions of improvements of the indoor climate.</p>
					</div>
					<span>
						<button class="btn-show-view-map-info">Show info</button>
						<a href="#/logbog">
							<button class="btn-go-to-communnication menu-link" data-go-to="communication">Go to the logbook</button>
						</a>
					</span>
				</div>
			</div>
		</div>
	</div>
</div>