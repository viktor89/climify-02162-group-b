// ***********  Main js *********** //

ga('set', 'page', '/Undervisning/Materiale-Oversigt/');
ga('send', 'pageview');

var sender = $("#7wpk6dQLcKKTPy4").val();
var currentUserID = $("#txt-current-user-ID").val();
var currentUserRole = $("#txt-current-user-role").val();
var currentUserLoginName = $.cookie("username");
var currentUserLoginPass = $.cookie("password");
var currentTags = [];
var currentSelectTags;
var selectTagID;
var btnDeleteContentActive = false;
var thisSearch;
var updateContent = false;
var clearDataOnLeave = false;

// Search options
var searchSelect = {
    level: 1,
    offset: 0,
    limit: 20
};

$(document).ready(function () {
    $(".view-overview").show();
    $("body").fadeIn(100);
    if ($.cookie("levelSelect")) {
        searchSelect.level = $.cookie("levelSelect");
        $("#select-search-level-" + searchSelect.level).prop('checked', true);
    } else {
        $.cookie("levelSelect", 1);
        $("#select-search-level-1").prop('checked', true);
        searchSelect.level = 1;
    }
    requestFrontpageContent(searchSelect.offset, searchSelect.limit, "", "");
    loadTags();
});

// Link back main site
$(".ico-back-main-site").click(function () {
    backMainSite();
});

function backMainSite() {
    var goTo = window.location.href.split('undervisning')[0];
    $(location).attr('href', goTo)
}

// Log Out
$("#btn-sign-out, .mobile-sign-out").click(function () {
    signOut();
});

function signOut() {
    var sUrl = "../api/api-clear-all-sessions.php";
    $.get(sUrl, function (sData) {
        var jData = JSON.parse(sData);
        if (jData.status == "signOut") {
            $.removeCookie("username");
            $.removeCookie("password");
            location.reload();
        }
    });
}

// Smooth scroll
$('.ico-go-to-top').click(function () {
    $("html, body").animate({
        scrollTop: 0
    }, 500);
    return false;
});

if (window.matchMedia('(max-width: 800px)').matches) {
    var viewAtTop = false;
    $(window).scroll(function () {
        var $this = $(this)
        var $element = $(".go-to-top");
        if ($this.scrollTop() > 200) {
            if (viewAtTop == false) {
                $element.css("bottom", "0px");
                viewAtTop = true;
            }
        } else {
            if (viewAtTop == true) {
                $element.css("bottom", "-50px");
                viewAtTop = false;
            }
        }
    });
}

// Go to content

$(document).on("click", ".btn-go-to-content", function(){
    $(".view-subject-load-data-wrapper").css("display", "flex").addClass("flex");
    $(".view-subject-content-wrapper").css("visibility", "hidden");
    var thisID = $(this).parent().parent().attr("data-contentID");
    var thisAuthor = $(this).parent().parent().attr("data-author");
    if (currentUserRole == 1 || currentUserID == thisAuthor) {
        $(".btn-edit-material").show();
    } else {
        $(".btn-edit-material").hide();
    }
    nav("subject-view");
    quillView.enable(false);
    requestViewContent(thisID);
    requestViewTags("view", thisID);
    ga('set', 'page', '/Undervisning/Materiale-Visning/');
    ga('send', 'pageview');
});

/**********************************/
//		Get content
/**********************************/

$("input[name='select-search-level']").change(function () {
    var levelSelech = $('input:checked', '.level-select-search').val();
    $.cookie("levelSelect", levelSelech);
    searchSelect.level = levelSelech;
    thisSearch = "";
    requestFrontpageContent(searchSelect.offset, searchSelect.limit, "", "");
});

function requestFrontpageContent(offset, limit, tag, search) {
    if (!updateContent) {
        $(".overview-main-content-wrapper").empty();
        searchSelect.offset = 0;
        offset = searchSelect.offset;
    } 
    updateContent = false;
    var sUrl = "api/api-search-content.php";
    var temp =  '<div class="overview-main-content-element border" data-contentID="{{contentID}}" data-author="{{author}}" >\
                    <h4>{{title}}</h4>\
                    <p>{{decription}}</p>\
                    <div>\
                        <button class="btn-go-to-content">Se materiale</button>\
                    </div>\
                </div >\
                ';
    $.post(sUrl, {
        fAY2YfpdKvR: sender,
        offset: offset,
        limit: limit,
        level: searchSelect.level,
        tag: tag,
        search: search
    }, function (data) {
        var jData = JSON.parse(data);
        if (jData.length > 0) {
            $(".load-more-content-wrapper i").show();
            $(".load-more-content-wrapper p").text("Vis flere");
            if (!search) {
                $(".overview-main-content-left-header").hide();
                $(".overview-main-content-left-header h4").text();
            }
            if (search) {
                $(".overview-main-content-element").highlight(thisSearch);
            }
            for (var i = 0; i < jData.length; i++) {
                var replaceTemp = temp; 
                replaceTemp = replaceTemp.replace("{{contentID}}", jData[i].contentID);
                replaceTemp = replaceTemp.replace("{{author}}", jData[i].author);
                replaceTemp = replaceTemp.replace("{{title}}", jData[i].title);
                replaceTemp = replaceTemp.replace("{{decription}}", jData[i].decription);
                $(".overview-main-content-wrapper").append(replaceTemp);
            }
        } else {
            $(".load-more-content-wrapper i").hide();
            $(".load-more-content-wrapper p").text("Ikke flere materialer fundet");
            if (jData.message == "noContent") {
                $(".overview-main-content-left-header h4").text("Materiale med dette emne er slettet");
            } else {
                $(".overview-main-content-left-header h4").text("Søgningen gav desværre ikke noget resultat");
            }
        }
        $(".load-more-content-wrapper").show();
        if (search) {
            $(".overview-main-content-element").highlight(thisSearch);
        }
        if (tag) {
            $(".load-more-content-wrapper").hide();
            $(".overview-main-content-left-header").show();
            $(".overview-main-content-left-header h4").text("Emne '" + currentSelectTags + "'");
        }
    });
}

// Search content

$(document).on("click", "#ico-search-content", function() {
    thisSearch = $("#inp-search-content").val();
    if (thisSearch) {
        $("#inp-search-content").val("");
        var searchLevel;
        switch (searchSelect.level) {
            case "1":
                searchLevel = "indskoling";
                break;
            case "2":
                searchLevel = "mellemtrin";
                break;
            case "3":
                searchLevel = "udskoling";
                break;
        }
        $(".overview-main-content-left-header").show();
        $(".overview-main-content-left-header h4").text("Søgeresultat for '" + thisSearch + "' i " + searchLevel);
        requestFrontpageContent(searchSelect.offset, searchSelect.limit, "", thisSearch);
    }
});

$("#inp-search-content").keyup(function (event) {
    if (event.keyCode == 13) {
        $("#ico-search-content").click();
    }
});

// Select content by tag

$(document).on("click", ".subject-list-single", function () {
    currentSelectTags = $(this).attr("data-tag-single"); 
    selectTagID = $(this).attr("data-tag-single-id");
    thisSearch = "";
    requestFrontpageContent(searchSelect.offset, searchSelect.limit, selectTagID, "");
});

$(document).on("click", ".view-subject-view .single-tag-wrapper", function () {
    var selectTag = $(this).attr("data-single-view-tag-id");
    currentSelectTags = $(this).attr("data-single-view-tag-name");
    thisSearch = "";
    requestFrontpageContent(searchSelect.offset, searchSelect.limit, selectTag, "");
    nav("overview");
});

function loadTags() {
    $(".subject-list-wrapper").empty();
    var sUrl = "api/api-get-popular-tags.php";
    var temp =  '<div class="subject-list-single" data-tag-single="{{tagTitle}}" data-tag-single-id="{{tagID}}">\
                    <p>{{tagTitleP}}</p>\
                </div>\
                ';
    $.post(sUrl, {
        fAY2YfpdKvR: sender
    }, function (data) {
        var jData = JSON.parse(data);
        if (jData.length > 0) {
            for (var i = 0; i < jData.length; i++) {
                var replaceTemp = temp;
                replaceTemp = replaceTemp.replace("{{tagID}}", jData[i].tagID);
                replaceTemp = replaceTemp.replace("{{tagTitle}}", jData[i].tagTitle);
                replaceTemp = replaceTemp.replace("{{tagTitleP}}", jData[i].tagTitle);
                $(".subject-list-wrapper").append(replaceTemp);
            }
        }
    });
}

$(".inp-add-tag").keyup(function (event) {
    if (event.keyCode == 13) {
        $(".btn-add-tag").click();
    }
});

// Load more content

$(document).on("click", ".load-more-content-wrapper", function () {
    searchSelect.offset = searchSelect.offset + searchSelect.limit;
    updateContent = true;
    if (thisSearch) {
        requestFrontpageContent(searchSelect.offset, searchSelect.limit, "", thisSearch);
    } else {
        requestFrontpageContent(searchSelect.offset, searchSelect.limit, "", "");
    }
});

/**********************************/
//		View content
/**********************************/

$(document).on("click", ".btn-edit-material", function () {
    var selectID = $("#inp-subject-id-read").val();
    clearCreateForm();
    requestEditContent(selectID);
    requestViewTags("edit", selectID);
    $(".single-view").hide();
    $(".view-subject-create").show();
    clearDataOnLeave = true;
    ga('set', 'page', '/Undervisning/Opret-Materiale/');
    ga('send', 'pageview');
});

function requestViewTags(type, selectID) {
    var temp;
    if (type == "view") {
        $(".leves-view-tags-list-wrapper").empty();
        temp =  '<div class="single-tag-wrapper" data-single-view-tag-id="{{tagID}}" data-single-view-tag-name="{{tagDataTitle}}">\
                    <p>{{tagTitle}}</p>\
                </div >\
                ';
    }
    if (type == "edit") {
        currentTags = [];
        $(".leves-create-tags-list-wrapper").empty();
        temp =  '<div class="single-tag-wrapper" data-tagname="{{tagTitleBack}}">\
                    <p>{{tagTitle}}</p>\
                        <i class="fa fa-minus-circle btn-remove-tag link" aria-hidden="true"></i>\
                </div >\
                ';
    }
    
    var sUrl = "api/api-get-tags-by-content.php";
    $.post(sUrl, {
        fAY2YfpdKvR: sender,
        contentID: selectID
    }, function (data) {
        var jData = JSON.parse(data);
        if (jData.length > 0) {
            for (var i = 0; i < jData.length; i++) {
                var replaceTemp = temp;
                              
                if (type == "view") {
                    replaceTemp = replaceTemp.replace("{{tagID}}", jData[i].tagID);
                    replaceTemp = replaceTemp.replace("{{tagTitle}}", jData[i].tagTitle);  
                    replaceTemp = replaceTemp.replace("{{tagDataTitle}}", jData[i].tagTitle);
                    $(".leves-view-tags-list-wrapper").append(replaceTemp);
                }
                if (type == "edit") {
                    replaceTemp = replaceTemp.replace("{{tagTitleBack}}", jData[i].tagTitle);
                    replaceTemp = replaceTemp.replace("{{tagTitle}}", jData[i].tagTitle);  
                    currentTags.push(jData[i].tagTitle);
                    $(".leves-create-tags-list-wrapper").append(replaceTemp);
                }
            }
        }
    });
}

/**********************************/
//		Create content
/**********************************/

var validateCreateInput = {
    title: false,
    decription: false,
    level: false,
    delta: false
};

$('#inp-subject-create-title').on('input', function () {
    var inputTitle = $('#inp-subject-create-title').val().length;
    $(".subject-create-title-character").text(inputTitle);
    if ( inputTitle < 10 ) {
        validateCreateInput.title = false;
        $(".subject-create-title-character").css("color", "#c1c1c1");
    } else if (inputTitle >= 10 && inputTitle <= 30) {
        validateCreateInput.title = true;
        $(".subject-create-title-character").css("color", "#c1c1c1");
    } else if (inputTitle >= 30 && inputTitle <= 70) {
        validateCreateInput.title = true;
        $(".subject-create-title-character").css("color", "#2c9601");
    } else if (inputTitle >= 70 && inputTitle <= 100) {
        validateCreateInput.title = true;
        $(".subject-create-title-character").css("color", "#c1c1c1");
    } else if (inputTitle >= 100) {
        validateCreateInput.title = false;
        $(".subject-create-title-character").css("color", "#c1c1c1");
    }
});

$('#inp-subject-create-decription').on('input', function () {
    var inputDecription = $('#inp-subject-create-decription').val().length;
    $(".subject-create-decription-character").text(inputDecription);
    if (inputDecription < 50) {
        validateCreateInput.decription = false;
        $(".subject-create-decription-character").css("color", "#c1c1c1");
    } else if (inputDecription >= 50 && inputDecription <= 150) {
        validateCreateInput.decription = true;
        $(".subject-create-decription-character").css("color", "#c1c1c1");
    } else if (inputDecription >= 150 && inputDecription <= 250) {
        validateCreateInput.decription = true;
        $(".subject-create-decription-character").css("color", "#2c9601");
    } else if (inputDecription >= 250 && inputDecription <= 300) {
        validateCreateInput.decription = true;
        $(".subject-create-decription-character").css("color", "#c1c1c1");
    } else if (inputDecription >= 300) {
        validateCreateInput.decription = false;
        $(".subject-create-decription-character").css("color", "#c1c1c1");
    }
});

$("input[name='select-create-level']").change(function () {
    validateCreateInput.level = true;
});

// Info hover

$(".ico-create-title").hover(function () {
    $(".info-create-title").show();
}, function () {
    $(".info-create-title").hide();
});

$(".ico-create-decription").hover(function () {
    $(".info-create-decription").show();
}, function () {
    $(".info-create-decription").hide();
});

// Tags

$(document).on("click", ".btn-add-tag", function(){
    var tagInpVal = $(".inp-add-tag").val();
    if (tagInpVal) {
        if (jQuery.inArray(tagInpVal, currentTags) == -1) {
            var inputTagVal = $(".inp-add-tag").val().toLowerCase();
            currentTags.push(inputTagVal);
            var temp = '<div class="single-tag-wrapper" data-tagname="' + inputTagVal +'">\
                        <p>'+ inputTagVal +'</p>\
                            <i class="fa fa-minus-circle btn-remove-tag link" aria-hidden="true"></i>\
                        </div >\
                        ';
            $(".leves-create-tags-list-wrapper").append(temp);
            $(".inp-add-tag").val("");
        } else {
            $(".inp-add-tag").addClass("validate-error");
            setTimeout(function () {
                $(".inp-add-tag").removeClass("validate-error");
            }, 2000);
        }
    } else {
        $(".inp-add-tag").addClass("validate-error");
        setTimeout(function () {
            $(".inp-add-tag").removeClass("validate-error");
        }, 2000);
    }
});

$(document).on("click", ".btn-remove-tag", function () {
    var thisTag = $(this).parent().attr("data-tagname");
    currentTags = jQuery.grep(currentTags, function (value) {
        return value != thisTag;
    });
    $(this).parent().hide();
});

/**********************************/
//		Highlight
/**********************************/

jQuery.extend({
    highlight: function (node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'highlight';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
            !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
            !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});

jQuery.fn.unhighlight = function (options) {
    var settings = { className: 'highlight', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function (words, options) {
    var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
    jQuery.extend(settings, options);

    if (words.constructor === String) {
        words = [words];
    }
    words = jQuery.grep(words, function (word, i) {
        return word != '';
    });
    words = jQuery.map(words, function (word, i) {
        return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });
    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";
    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }
    var re = new RegExp(pattern, flag);

    return this.each(function () {
        jQuery.highlight(this, re, settings.element, settings.className);
    });
};