<!-- System map -->
<div class="single-view view-devices">
    <div class="view-devices-top">
        <span>
            <h3>Manage Building</h3>
            <p>Administer floor plans and sensors.</p>
        </span>
        <span>
            <span>
                <?php if ( $currentUserRole == 1 ) { ?>
                    <select class="list-schools-other-users" name="option">
                    <option value="" selected>Choose Institution</option>
                        <!-- Content goes here -->
                </select>
                <?php } ?>
                <button id="btn-show-all-decices" class="link"></button>	
            </span>
        </span>
    </div>
    <hr>
    <div class="list-all-devices-wrapper">
        <i id="icn-close-devices-wrapper" class="link fa fa-times" aria-hidden="true"></i>
        <h4 class="view-devices-list-device-info"></h4>
        <div class="view-devices-type-list-wrapper">
            <p>Location name</p>
        </div>
        <div class="view-devices-list-wrapper" id="devices-list-content-wrapper">
            <!-- Content goes here -->
        </div>
    </div> <!-- list-all-devices-wrapper -->
    <h4 class="map-selection-head map-selection-head-edit"><!-- Content goes here --></h4>
    <div class="map-wrapper map-wrapper-admin">
        <div class="map-location">
            <p class="canvasDataInfo map-info map-info-no-school">Choose a school to see a floor plan</p>
            <p class="canvasDataInfo map-info map-info-no-map">No floor plans available</p>
            <div class="map-frame-wrapper">
                <div class="map-frame map-frame-edit">
                    <!-- Content goes here -->
                </div>
                <div id="device-frame-edit" class="device-frame device-frame-edit">
                    <!-- Content goes here -->
                </div>
            </div>
        </div>
        <div class="map-settings">
            <div id="root">
                <!-- REACT Root -->
            </div>
        </div>
    </div>
    <div class="crop-img-admin">
        <div class= "progress-align">

            <div class="header-progress-container">
                <a href="#/" id="close-cropper" onclick="resetUpload()" ><i class="ico-close-signup link fa fa-times"></i></a>
                <ol class="header-progress-list">
                    <li id="beskær" class="header-progress-item done" >Crop</li>
                    <li id="første" class="header-progress-item todo">First coordinate</li>
                    <li id="andet" class="header-progress-item todo">Second coordinate</li>
                </ol>
            </div>

            <div class="button-progress-container">
                <button id="btn-progress-previous">Previous</button>
                <button id="btn-progress-next">Next</button>
            </div>
            <p id="guide">Drag and zoom on the map for desired crop</p>
        </div>

        <div class="imageBox">

            <div class="map-container">
                <div id="map-preview" src=""></div>
                <img id="map-cropped" src="">
                <canvas id='map-cropped-canvas-coord1' class='map-cropped-canvas' width="800" height="500"></canvas>
                <canvas id='map-cropped-canvas-coord2' class='map-cropped-canvas' width="800" height="500"></canvas>
            </div>

            <div class="google-map-container">
                <div id="floating-panel">
                    <input id="address" type="textbox" value="Search...">
                    <input id="submit" type="button" value="Find">
                </div>
                <div id="google-map"></div>
            </div>
        </div>
    </div>
</div>