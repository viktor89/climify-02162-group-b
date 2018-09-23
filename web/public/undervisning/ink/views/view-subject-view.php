<!-- Subject view -->
<div class="single-view view-subject-view">
     <div class="btn-edit-back-publich-wrapper">
        <span>
            <button class="btn-goto-overview">Tilbage</button>
        </span>
        <span>
            <button class="btn-edit-material">Rediger</button>
        </span>
    </div>
    <div class="view-subject-load-data-wrapper">
        <i class="fa fa-spinner fa-spin fa-1x fa-fw"></i>
        <p>Henter materiale...</p>
    </div>
    <div class="view-subject-content-wrapper">
        <div class="single-content-wrapper">
            <div class="view-subject-meta-wrapper">
                <input id="inp-subject-id-read" type="hidden" value="" readonly>
                <input id="inp-subject-author-read" type="hidden" value="" readonly> 
                <h4></h4>
                <div>
                    <p class="view-subject-update-date-wrapper"></p>
                    <p class="view-subject-level-wrapper"></p>
                </div>  
            </div>  
            
                <div class="quill-editor-view"></div>
            
            <h4>Emner for dette materiale</h4>
            <div class="leves-view-tags-list-wrapper"> 
                <!-- Content goes here -->
            </div>
        </div> <!-- .single-content-wrapper -->
    </div>
</div>