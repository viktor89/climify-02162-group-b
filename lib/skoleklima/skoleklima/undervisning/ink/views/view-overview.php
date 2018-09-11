<!-- Overview -->
<div class="single-view view-overview">
    <div class="header-wrapper header-wrapper-overview">
        <div>
            <h3>Hej <?php echo $currentUserFirstName .' '. $currentUserLastName ?></h3>
            <p>Vælg undervisningsmateriale fra listen eller brug søgefunktionen</p>
        </div>
        <?php if ($currentUserRole == 1 || $currentUserRole == 2 || $currentUserRole == 3) { ?>
        <div class="create-material-wrapper">
            <button class="btn-goto-create-material">Opret materiale</button>
        </div>
        <?php } ?>
     </div>
    <hr>

    <div class="overview-content-wrapper">

        <div class="overview-main-content-left">
            <div class="overview-main-content-left-header"><h4></h4></div>
            <div class="overview-main-content-wrapper"><!-- Content goes here --></div>
        </div>
        
        <div class="overview-search-content border">
            <h4>Søg materiale</h4>
            <div class="search-input-wrapper">
                <input id="inp-search-content" type="text" placeholder="Søg materiale">
                <i id="ico-search-content" class="fa fa-search link" aria-hidden="true"></i>            
            </div>
            <h4>Niveau</h4>
            <form class="level-select-search">    
                <span><input type="radio" name="select-search-level" id="select-search-level-1" value="1"><label for="select-search-level-1">Indskoling</label></span>
                <span><input type="radio" name="select-search-level" id="select-search-level-2" value="2"><label for="select-search-level-2">Mellemtrin</label></span>
                <span><input type="radio" name="select-search-level" id="select-search-level-3" value="3"><label for="select-search-level-3">Udskoling</label></span>
            </form>
            <h4>Populære emner</h4>
            <div class="subject-list-wrapper"><!-- Content goes here --></div>
        </div>

    </div>
    <div class="load-more-content-wrapper">
        <i class="fa fa-arrow-down" aria-hidden="true"></i>
        <p>Vis flere</p>
    </div>
</div>