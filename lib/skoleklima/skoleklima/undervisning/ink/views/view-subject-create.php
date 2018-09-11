<!-- Subject create -->
<div class="single-view view-subject-create">
    <div class="btn-create-back-publich-wrapper">
        <span>
            <button class="btn-goto-overview">Tilbage</button>
        </span>
        <span>
            <button class="btn-delete-material button-disabled">Slet</button>
            <button class="btn-save-material">Udgiv</button>
        </span>
    </div>
    <input id="inp-subject-id-create" type="hidden" value="" readonly>
    <div class="single-content-wrapper">
        <div class="subject-create-info-wrapper">
            <span>
                <h4>Titel</h4>
                <span>
                    <p class="subject-create-title-character">0</p>
                    <i class="fa fa-question-circle ico-create-title link" aria-hidden="true"></i>
                    <div class="obj-info info-create-title"><p>Titlen bør være præcis og beskrivende for materialet. </br>Titlen bør bestå af 30 - 70 tegn og minimum 10 tegn og maximum 100 tegn.</p></div>
                </span>
            </span>
            <input id="inp-subject-create-title" type="text" value="" maxlength="100">
            <span>
                <h4>Beskrivelse</h4>
                <span>
                    <p class="subject-create-decription-character">0</p>
                    <i class="fa fa-question-circle ico-create-decription link" aria-hidden="true"></i>
                    <div class="obj-info info-create-decription"><p>Beskrivelse skal give andre brugere et overblik over materialet indhold.</br>Titlen bør bestå af 150 - 250 tegn og minimum 50 tegn og maximum 300 tegn.</p></div>
                </span>
            </span>
            <textarea id="inp-subject-create-decription" maxlength="300"></textarea>
        </div>
        
        <div class="leves-create-selector-wrapper">
            <h4>Niveau</h4>
            <form id="inp-select-create-level">
                <span><input type="radio" name="select-create-level" value="1" id="select-create-level-1"><label for="select-create-level-1">Indskoling</label></span>
                <span><input type="radio" name="select-create-level" value="2" id="select-create-level-2"><label for="select-create-level-2">Mellemtrin</label></span>
                <span><input type="radio" name="select-create-level" value="3" id="select-create-level-3"><label for="select-create-level-3">Udskoling</label></span>
            </form>
        </div>

        <div class="quill-toolbar"></div>
        <div class="quill-editor"></div>

        <div class="leves-create-tags-wrapper">
            <h4>Tilføj emner</h4>
            <span>
                <input class="inp-add-tag" type="text">
                <i class="fa fa-plus-circle btn-add-tag link" aria-hidden="true"></i>
            </span>
        </div>
        <div class="leves-create-tags-list-wrapper"> 
            <!-- Content goes here -->
        </div>
    </div><!-- .single-content-wrapper -->
</div>
