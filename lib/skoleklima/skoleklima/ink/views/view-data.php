<!-- System data -->
<div class="single-view view-data">
	<div class="view-data-top">
	<span>
		<h3>Graphs</h3>
		<p>See statistics from one or more of the chosen locations.</p>
	</span>
	<span>
		<span>
			<?php if ( $currentUserRole == 1 || $currentUserRole == 15 ) { ?>
				<select class="list-schools-other-users" name="option" id="graphMainSelect">
					<option value="" selected>Choose Institution</option>
					<!-- Content goes here -->
				</select>
			<?php } ?>
			
			<select class="chart-select-map" >
				<!-- Content goes here -->
				<option value="stand" selected>Choose Floor plan</option>
			</select>
			
			<button id="btn-toggle-chart-info" class="link"></button>	
		</span>
		<span>
			<select class="chart-select-location" id="selectLocation">
			<option value="locStand" selected>Choose Location</option>
				<!-- Content goes here -->
			</select>
			
			
		
		</span>
	</span>
	</div>
	<hr>
	<div class="view-data-info-box">
		<i id="icn-close-view-data-info" class="link fa fa-times" aria-hidden="true"></i>
		<h4>Information</h4>
		<p>On this page you have the opportunity to see detailed data from each location, as well as comparing data from multiple locations.</p>
	</div>
	<div class="view-data-control">
		<span class="currentDeciveText">
			<h4><!-- Content goes here--></h4>
		</span>
		<span class="view-live-data-wrapper display-none-element">
			<i class="data-icones fa fa-thermometer-full" aria-hidden="true"></i>
			<p class="current-device-live" id="current-device-live-temperature"></p>
			<i class="data-icones fa fa-tint" aria-hidden="true"></i>
			<p class="current-device-live" id="current-device-live-humidity"></p>
			<i class="data-icones fa fa-cloud" aria-hidden="true"></i>
			<p class="current-device-live" id="current-device-live-co2"></p>
			<i class="data-icones fa fa-microphone" aria-hidden="true"></i>
			<p class="current-device-live" id="current-device-live-noise"></p>
			<div class="liveUpdateExplain">
				<h4>Live data</h4>
				<p>Here the current data from the chosen location is shown. The values is automatically updated every five minutes.<br><br>
				<strong>Values for a good indoor climate:<br></strong>
				<i class="fa fa-thermometer-full" aria-hidden="true"></i>
				Temperature 21ºC to 23ºC <br>
				<i class="fa fa-tint" aria-hidden="true"></i>
				Humidity 30% to 60%<br>
				<i class="fa fa-cloud" aria-hidden="true"></i>
				CO2-level below 2.000 ppm <br>
				<i class="fa fa-microphone" aria-hidden="true"></i>
				Sound-level below 70 dB<br>
				</p>
			</div>
		</span>
	</div>
	<div class="graph-area-wrapper-1">
		<div class="canvas canvas1">
			<!-- canvas1 goes here -->
			<p class="canvasDataInfo" id="gettingDataWait"><i class="fa fa-spinner fa-spin fa-1x fa-fw"></i> Loading data...</p>
			<p class="canvasDataInfo" id="retrunNoICMeterData">No data available</p>
			<p class="canvasDataInfo2" id="retrunNoSchoolData"></p>
		</div>
		<div class="canvas-1-settings">
			<div id="reportrange1" class="reportrange pull-right">
    			<i class="glyphicon glyphicon-calendar fa fa-calendar"></i>&nbsp;
    			<span></span> <b class="caret"></b>
			</div>
			<h4>Show data</h4>
			<div class="canvas-1-option-select-wrapper">
				<span class="canvas-settings-check inline-checkbox">
					<input id="check-chart-data-temperature" class="canvas-settings regular-checkbox" type="checkbox" value="false">
					<label for="check-chart-data-temperature"></label>
					<p>Temperature</p>
				</span>
				<span class="canvas-settings-check inline-checkbox">
					<input id="check-chart-data-humidity" class="canvas-settings regular-checkbox" type="checkbox" value="false">
					<label for="check-chart-data-humidity"></label>
					<p>Humidity</p>
				</span>
				<span class="canvas-settings-check inline-checkbox">
					<input id="check-chart-data-co2" class="canvas-settings regular-checkbox" type="checkbox" value="false">
					<label for="check-chart-data-co2"></label>
					<p>CO2 level</p>
				</span>
				<span class="canvas-settings-check inline-checkbox">
					<input id="check-chart-data-noiseAvg" class="canvas-settings regular-checkbox" type="checkbox" value="false">
					<label for="check-chart-data-noiseAvg"></label>
					<p>Sound average</p>
				</span>
				<span class="canvas-settings-check inline-checkbox">
					<input id="check-chart-data-noisePeak" class="canvas-settings regular-checkbox" type="checkbox" value="false">
					<label for="check-chart-data-noisePeak"></label>
					<p>Sound max</p>
				</span>
			</div>
			<h4>Display form</h4>
			<div class="canvas-settings-look">
				<span>
					<select id="chart-select-type" class="chart-select" name="">
						<option value="line" selected>Line graph</option>
						<option value="bar">Bar graph</option>
					</select>
				</span>
			</div>
			<div class="canvas-settings-download">
				<div class="canvas-settings-download-head">
					<h4>Download data to excel</h4>
					<i class="fa fa-question-circle-o link download-data-icon" aria-hidden="true"></i>
					<div class="download-info-box-wrapper">
						<p>When the download button is hit, the data from the chosen location and timeperiod is downloaded. </br>The data is downloaded in the xls-format that can be opened directly in Microsoft Excel or the likes.</p>
					</div>
				</div>
				<span>
					<button class="button-disabled" id="btn-download-graph-data">Download</button>
				</span>
				<div id='exportDataHolder'></div>
    			<a href="#" id="testExportDataAnchor"></a>
			</div>
		</div>
	</div> <!-- .graph-area-wrapper-1 -->
	<h4>Compare Locations</h4>
	<div class="graph-area-wrapper-2">
		<div class="canvas-wrapper canvas-wrapper-2">
			<p class="canvasDataInfo" id="retrunNoDeviceGraph2">Choose one or more locations to see their data.</p>
			<p class="canvasDataInfo2" id="retrunNoSchoolGraph2"></p> <!-- HER -->
            <p class="canvasDataInfo2" id="retrunNoSchoolGraph2Part2"></p>
			<p class="canvasDataInfo" id="gettingCompareDataWait"><i class="fa fa-spinner fa-spin fa-1x fa-fw"></i> Loading data...</p>
			<!-- canvas2 goes here -->			
			<!-- canvas3 goes here -->		
			<!-- canvas4 goes here -->
			<!-- canvas5 goes here -->
            
    
		</div> 
		<div class="canvas-2-settings" id="canvas-2-settings">
			<div id="reportrange2" class="reportrange pull-right">
    			<i class="glyphicon glyphicon-calendar fa fa-calendar"></i>&nbsp;
    			<span></span> <b class="caret"></b>
			</div>
			<h4>Choose locations <span> (max <span class="maxSelectedDevices"></span>)</span></h4>
			<p class="txt-max-compare-device-selected">No more sensors can be chosen</p>
			<div id="compare-devices-list"> 
				<!-- content goes here -->
			</div>
			    <button id="btn-get-compare-data">Download data</button>

		</div>
	</div> <!-- .graph-area-wrapper-2 -->
</div>

