// ***********  Nav js *********** //

function nav(view) {
    $(".single-view").hide();
    $(".view-" + view).show();
}

$(document).on("click", ".btn-goto-create-material", function() {
    $(".single-view").hide();
    $(".view-subject-create").show();
    ga('set', 'page', '/Undervisning/Opret-Materiale/');
    ga('send', 'pageview');
});

$(document).on("click", ".view-subject-view .btn-goto-overview", function () {
    navBackFrontpage();
    $("#inp-subject-id-create").val("");
    ga('set', 'page', '/Undervisning/Materiale-Oversigt/');
    ga('send', 'pageview');
});

$(document).on("click", ".view-subject-create .btn-goto-overview", function () {
    if (quillEdit.getText().trim().length != 0 || currentTags.length != 0 || $("#inp-subject-create-title").val() != "" || $("#inp-subject-create-decription").val() != "" ) {
        swal({
            title: "",
            text: 'Er du sikker på at du til forlade denne side uden at udgive eller opdatere materialet?',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Ja, forlad side",
            closeOnConfirm: true
        },
            function () {
                navBackFrontpage();
                if (clearDataOnLeave) {
                    clearDataOnLeave = false;
                    clearCreateForm();
                }
            });
        $(".cancel").html("Nej, bliv på side");
    } else {
        navBackFrontpage();
        clearCreateForm();
    }
});

function navBackFrontpage() {
    requestFrontpageContent(searchSelect.offset, searchSelect.limit, "", "");
    loadTags();
    $(".single-view").hide();
    $(".view-overview").show();
    ga('set', 'page', '/Undervisning/Materiale-Oversigt/');
    ga('send', 'pageview');
}