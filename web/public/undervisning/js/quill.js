// ***********  Quill js *********** //

var contentTemp = [];
var contentID = "";

var toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    ['link'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['image', 'video']
];

var quillEdit = new Quill('.quill-editor', {
    modules: {
        toolbar: toolbarOptions
    },
    theme: 'snow'
});

var quillView = new Quill('.quill-editor-view', {
    theme: 'snow'
});

/**********************************/
//		View content
/**********************************/

function requestViewContent(contentID) {
    var sUrl = "api/api-get-content.php";
    $.post(sUrl, {
        fAY2YfpdKvR: sender,
        username: currentUserLoginName,
        password: currentUserLoginPass,
        contentID: contentID
    }, function (data) {
        var jData = JSON.parse(data);
        $("#inp-subject-id-read").val(jData.contentID);
        $("#inp-subject-author-read").val(jData.author);
        $(".view-subject-meta-wrapper h4").text(jData.title);

        var viewLevel;
        switch (jData.teashLevel) {
            case 1:
                viewLevel = "Indskoling";
                break;
            case 2:
                viewLevel = "Mellemtrin";
                break;
            case 3:
                viewLevel = "Udskoling";
                break;
        }
        $(".view-subject-update-date-wrapper").text("Opdateret: " + jData.postDate);
        $(".view-subject-level-wrapper").text(viewLevel);
        var tempOjb = JSON.parse(jData.delta);
        quillView.setContents(tempOjb);
        $(".view-subject-load-data-wrapper").css("display", "none").removeClass("flex");
        $(".view-subject-content-wrapper").css("visibility", "visible");
    });
};


/**********************************/
//		Edit content
/**********************************/

function requestEditContent(contentID) {
    var sUrl = "api/api-get-content.php";
    $.post(sUrl, {
        fAY2YfpdKvR: sender,
        username: currentUserLoginName,
        password: currentUserLoginPass,
        contentID: contentID
    }, function (data) {
        var jData = JSON.parse(data);
        $("#inp-subject-id-create").val(jData.contentID);
        $("#inp-subject-create-title").val(jData.title);
        $("#inp-subject-create-decription").val(jData.decription);
        var tempOjb = JSON.parse(jData.delta);
        quillEdit.setContents(tempOjb);
        btnDeleteContentActive = true;
        $(".btn-delete-material").removeClass("button-disabled");
        $(".btn-save-material").text("Opdater");
        $.cookie("levelSelect", jData.teashLevel);
        searchSelect.level = jData.teashLevel;
        $("#select-create-level-" + jData.teashLevel).prop('checked', true);
        validateCreateInput.title = true;
        validateCreateInput.decription = true;
        validateCreateInput.level = true;
        validateCreateInput.delta = true;
        $(".subject-create-title-character").text($('#inp-subject-create-title').val().length);
        $(".subject-create-decription-character").text($('#inp-subject-create-decription').val().length);
    });
}

/**********************************/
//		Insert content
/**********************************/

$(document).on("click", ".btn-save-material", function () {
    if (validateCreateInput.title == true && validateCreateInput.decription == true && validateCreateInput.level == true && validateCreateInput.delta == true) {
        requistInsert();
    } else {
        if (validateCreateInput.title == false) {
            $("#inp-subject-create-title").addClass("validate-error");
            setTimeout(function() {
                $("#inp-subject-create-title").removeClass("validate-error");
            }, 2000);
        }
        if (validateCreateInput.decription == false) {
            $("#inp-subject-create-decription").addClass("validate-error");
            setTimeout(function () {
                $("#inp-subject-create-decription").removeClass("validate-error");
            }, 2000);
        }
        if (validateCreateInput.level == false) {
            $("#inp-select-create-level").addClass("validate-error");
            setTimeout(function () {
                $("#inp-select-create-level").removeClass("validate-error");
            }, 2000);
        }
        if (validateCreateInput.delta == false) {
            $(".quill-editor").addClass("validate-error");
            setTimeout(function () {
                $(".quill-editor").removeClass("validate-error");
            }, 2000);
        }
    }
});

function requistInsert() {
    var sUrl = "api/api-insert-content.php";
    var contentID = $("#inp-subject-id-create").val();
    var contentTitle = $("#inp-subject-create-title").val();
    var contentDecription = $("#inp-subject-create-decription").val();
    var level = $('input:checked', '#inp-select-create-level').val();
    searchSelect.level = level;
    $("#select-search-level-" + level).prop("checked", true);
    $.cookie("levelSelect", level);
    contentTemp = quillEdit.getContents();
    var jContentTemp = JSON.stringify(contentTemp);
    $.post(sUrl, {
        fAY2YfpdKvR: sender,
        username: currentUserLoginName,
        password: currentUserLoginPass,
        contentID: contentID,
        title: contentTitle,
        decription: contentDecription,
        delta: jContentTemp,
        tags: currentTags,
        level: level
    }, function (data) {
        var jData = JSON.parse(data);
        if (jData.status == 'ok') {
            if (jData.message == 'insert') {
                $("#inp-subject-id-create").val(jData.contentID);
                $(".btn-save-material").text("Opdater")
                clearDataOnLeave = true;
                swal({
                    title: "",
                    text: 'Materialet er nu udgivet!',
                    type: "success"
                });
            } else if ( jData.message == 'update' ) {
                clearDataOnLeave = true;
                swal({
                    title: "",
                    text: 'Materialet er opdateret!',
                    type: "success"
                });
            }
            btnDeleteContentActive = true;
            $(".btn-delete-material").removeClass("button-disabled");
        } else {
            swal({
                title: "",
                text: 'Noget gik galt! Prøv igen.',
                type: "error"
            });
        }
        
    });
}

/**********************************/
//		Delete content
/**********************************/

$(document).on("click", ".btn-delete-material", function () {
    if (btnDeleteContentActive) {
        swal({
            title: "",
            text: "Er du sikker på at du vil slette dette materiale permanent?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Ja, slet det!",
            closeOnConfirm: false
        },
            function () {
                requistDelete();
            });
        $(".cancel").html("Fortryd");   
    }
});

function requistDelete() {
    var sUrl = "api/api-delete-content.php";
    var contentID = $("#inp-subject-id-create").val();
    $.post(sUrl, {
        fAY2YfpdKvR: sender,
        username: currentUserLoginName,
        password: currentUserLoginPass,
        contentID: contentID
    }, function (data) {
        var jData = JSON.parse(data);
        if (jData.status == 'ok') {
            clearCreateForm();
            swal({
                title: "",
                text: 'Materialet er nu slettet!',
                type: "success"
            });
        } else {
            swal({
                title: "",
                text: 'Noget gik galt! Prøv igen.',
                type: "error"
            });
        }
    });
}

function clearCreateForm() {
    btnDeleteContentActive = false;
    validateCreateInput = {
        title: false,
        decription: false,
        level: false,
        delta: false
    };
    currentTags = [];
    contentID;
    $(".btn-delete-material").addClass("button-disabled");
    $(".btn-save-material").text("Udgiv");
    $("#inp-subject-id-create").val("");
    $("#inp-subject-create-title").val("");
    $("#inp-subject-create-decription").val("");
    $("input[name='select-create-level']").prop('checked', false);
    $(".inp-add-tag").val("");
    $(".leves-create-tags-list-wrapper").empty();
    quillEdit.setContents("");
    $(".subject-create-title-character").text("0");
    $(".subject-create-decription-character").text("0");
    $(".subject-create-title-character").css("color", "#c1c1c1");
    $(".subject-create-decription-character").css("color", "#c1c1c1");
}

quillEdit.on('text-change', function (delta, oldDelta, source) {
    if (quillEdit.getText().trim().length === 0) {
        validateCreateInput.delta = false;
    } else {
        validateCreateInput.delta = true;
    }
});
