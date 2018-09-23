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
            <select class="map-selection map-selection-edit" name="option">
                <!-- Content goes here -->
            </select>
            <div class="add-remove-map-wrapper">
                <button class="btn-show-upload-new-map">Add new floor plan</button>
                <button class="btn-delete-selected-map">Delete chosen map</button>
            </div>
            <div class="upload-map-selection">
                <p>For the best result, use a picture of at least 800px x 500px.<br>You can use pictures in the format jpg, png og gif.</p>
                <form id="frm-map-upload" method="post" enctype="multipart/form-data">
                    <input type="hidden" name="inp-map-user-role" id="inp-map-user-role" value="<?php echo $currentUserRole ?>">
                    <input type="hidden" name="inp-map-school" id="inp-map-school" value="<?php  ?>">
                    <input type="text" name="inp-map-name" id="inp-map-name" placeholder="Navngiv kort">
                    <div class="upload-map-label-wrapper">
                        <label for="upload-map-file" class="upload-map-label">Choose floor plan from drive
                            <input type="file" name="upload-map-file" id="upload-map-file" accept="image/x-png,image/gif,image/jpeg" >
                        </label>
                    </div>
                </form>
            </div>
            <h4>Available sensors:</h4>
            <div id="place-devices-list"> 
                <!-- content goes here -->
            </div>
            <button id="btn-save-devices-placement">Save changes</button>
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