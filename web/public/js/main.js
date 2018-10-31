/**********************************
//		Main JS
**********************************/
siteOnline = false;
//Source for DATALIST - https://www.raymondcamden.com/2012/06/14/example-of-a-dynamic-html5-datalist-control/
//Source for municipality API - https://dawa.aws.dk/dok/api/kommune#s%C3%B8gning
$(document).ready(function() {
    $("#search").on("input", function() {
        var val = $(this).val();
        if(val === "") return;
        //You could use this to limit results
        //if(val.length < 3) return;
        $.get("https://dawa.aws.dk/kommuner/autocomplete?q=" + val,{term:val}, function(data) {
            var dataList = $("#searchResults");
            dataList.empty();
            if(data.length) {
                for(var i=0, len=data.length; i<len; i++) {
                    var opt = $("<option></option>").attr("value", data[i].kommune.navn);
                    dataList.append(opt);
                }
            }
        }, "json");
    });

    //START get Weather location from jsonfile 
    var weatherApiId = "229e3ade24a07a661eb7f3f802d21280";
    var countrys = [];
    var thisCityCode;
    var jContrylist = [];

    $.ajax({
        async: true,   // this will solve the problem
        type: "GET",
        url: "./json/countries.json",
        contentType: "application/json",
        success: function (data) {
            jContrylist = data;
        }
    });

    $.getJSON("./json/city.list.json", function (data) {
        $.each(data, function (key, val) {
            if ($.inArray(val.country, countrys) === -1 && val.country !== "") {
                countrys.push(val.country);
                var contryCode = val.country;
                for (var i = 0; i < jContrylist.length; i++) {
                    if (jContrylist[i].code === contryCode) {
                        contryCode = jContrylist[i].name;
                    }
                }
                if (val.country === "DK") {
                    $("#inp-weather-countrys").append('<option value=' + val.country + ' selected>' + contryCode + '</option>');
                } else {
                    $("#inp-weather-countrys").append('<option value=' + val.country + '>' + contryCode + '</option>');
                }
            }
        });
    });
    // END get Weather location from jsonfile 
});


// Variables
var reE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var startPage = "";
var systemAutoReload = "21600"; // Seconds - 21600 = 6 houres
var softwareName = $("#txt-software-name").val();
var currentUserID = $("#txt-current-user-ID").val();
var currentUserName = $("#txt-current-user-name").val();
var currentUserRole = $("#txt-current-user-role").val();
var currentUserFirstName = $("#txt-current-user-first-name").val();
var currentUserLastName = $("#txt-current-user-last-name").val();
var currentUserEmail = $("#txt-current-user-email").val();
var currentUserSchool = $("#txt-current-user-school").val();
var currentUserSchoolName = $("#txt-current-user-school-name").val();
var currentPermLogbook = $("#txt-current-perm-logbook").val();
var currentIcMeterQR = "";
var icMeterSystemAccessToken = "";
var icMeterSystemAccessTokenExperes = "";
var menuShown = false;
var activeSchools = [];
var sitePathName = window.location.pathname; // Returns path only
var siteUrl = window.location.href;
siteUrl = siteUrl.substring(0, siteUrl.indexOf('#'));
var browserIsIE = false;
if (siteOnline) {
    var loadDealy = 3000; // dev 500 - live 3000
} else {
    var loadDealy = 500; // dev 500 - live 3000
}

var sender = $("#7wpk6dQLcKKTPy4").val();

var sender_first = $("#8wpk6diLcKKdPyq").val();
if (siteOnline) {
    window.location = "/#/";
}
// Test if browser is Internet Explorer
msieversion();
function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    browserIsIE = msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);
    return false;
}

// Test if user is logind (cookie saved)
if ( currentUserID == "" ) {
    $.removeCookie("username");
    $.removeCookie("password");
    startPage = "login";
    loadLoginPage();
} else {
    startPage = "dashboard";
    requestAutoLoginSystem();
}

// Login
$(".login-input").click(function(){
    if ($(this).hasClass("wrong-login")) {
        $(".login-input").removeClass("wrong-login");
        $(".txt-wrong-login").css("visibility", "hidden");
    }
});

$("#btn-system-login").click(function(){
    if ( browserIsIE == true ) {
        unsupportedBrowser();
    } else {
        validateLoginType();
    }
});

// Tricker #createAdminButton on press enter when password-field is selected
$(".login-from :input").keyup(function(event){
    if(event.keyCode == 13){
        if ($(".login-input").hasClass("wrong-login")) {
            $(".login-input").removeClass("wrong-login");
            $(".txt-wrong-login").css("visibility", "hidden");
        } 
        $("#btn-system-login").click();  
    }
});

// Log Out
$("#btn-sign-out, .mobile-sign-out").click(function(){
    signOut();
});

// Auto Log out 
function setAutoLogout() {
    if ( icMeterSystemAccessTokenExperes < systemAutoReload ) {
        systemAutoReload = icMeterSystemAccessTokenExperes;
    }
    var timeToReload = systemAutoReload + "999"; // MS
    setTimeout(function(){
        location.reload();
    }, timeToReload);
}

/**********************************
//		Functions
**********************************/
// Load loginpage
function loadLoginPage() {
    $('<img/>').attr('src', 'img/load/loading-animation.gif').on('load', function() {
        $("#loadCower").fadeIn("slow").css("display", "flex").addClass("flex"); 
        setTimeout(function(){
            $('<img/>').attr('src', 'img/login/login_bg.jpg').on('load', function() {
                $("#loadCower").fadeOut();
                showView(startPage);
                if (window.matchMedia('(min-width: 800px)').matches) {
                    $(".img-con").animate({ left: '-35vw' }, 1000, "swing");
                    $(".login-con").animate({right: '0px'}, 1000, "swing");
                }
            });
            if ( currentUserID !== "") {
                dealyDone();
            }
        }, loadDealy);
    });
}

// Auto-login 
function loadAutoLogin (){
    $("#loadCower").fadeIn("slow").css("display", "flex").addClass("flex");
    setTimeout(function(){
        $("#loadCower").fadeOut("slow", function(){
            showView(startPage);
        });  
        if ( currentUserID !== "") {
            dealyDone();
        }
    }, loadDealy);
}

// Hide / Show Views
function showView(view) {
    loadPage = ".view-"+view;
    $(".view").css("display", "none").removeClass("flex");
    $(".element").css("display", "none").removeClass("flex");
    $(loadPage).css("display", "flex").addClass("flex");
    $("#top-header, #side-navigation").css("display", "flex").addClass("flex");
}

function hideView(view) {
    loadPage = ".view-"+view;
    $(loadPage).css("display", "none").removeClass("flex");
}

// Login
function validateLoginType () {
    if ( $("#inp-login-name").val() !== "" && $("#inp-login-pass").val() !== "" ) {
        requestLoginSystem();
    } else {
        wrongLogin();
    }
}

function requestLoginSystem() {
    var typedUserName = $("#inp-login-name").val();
    var typedPassword = $("#inp-login-pass").val();
    // Store link to api and phase userinput
    var sUrl = "api/api-encrypt.php?fAY2YfpdKvR="+sender_first+"&encrypt="+typedPassword;

    $.get( sUrl , function( sData ){
        var jData = JSON.parse(sData);
        if( jData.status == "ok" ){
            var passEncrypt = jData.encrypt;
            // Store link to api and phase userinput
            var sUrl = "api/api-user-login.php?fAY2YfpdKvR="+sender_first+"&username="+typedUserName+"&password="+typedPassword;
            // Do AJAX and pahse
            $.get( sUrl , function( sData ){
              var jData = JSON.parse(sData);
              if( jData.status == "approve" ){
                    $.cookie("username", typedUserName, { expires : 10 });
                    $.cookie("password", typedPassword, { expires : 10 });
                    correctLogin();
                } else {
                    wrongLogin();
                }
            });
        } else {
            wrongLogin();
        }
    });
}

function correctLogin(){
    $(".login-input").val("");
    if (window.matchMedia('(min-width: 800px)').matches) {
        $(".img-con").animate({left: '-100vw'}, 1000, "swing");
        $(".login-con").animate({right: '-40vw'}, 1000, "swing", function(){
            location.reload();
        });
    } else {
        location.reload();
    }
}

function wrongLogin(){
    $(".login-input").addClass("wrong-login");
    $(".txt-wrong-login").css("visibility", "visible");
    $(".login-input").val("");
}

function unsupportedBrowser() {
    swal("Browser kan ikke benyttes", "Denne version af Internet Explorer understøtter desværre ikke alle funktioner på denne side. Benyt i stedet en af følgende browsere: Google Chrome, Mozilla Firefox, Microsoft Edge, Apple Safari eller Opera", "info");
}

// Log out
function signOut(){
    // Store link to api in variable
    var sUrl = "api/api-clear-all-sessions.php";
    // Do AJAX and phase link to api
    $.get( sUrl , function( sData ){
        var jData = JSON.parse(sData); 
        if( jData.status == "signOut" ){
            $.removeCookie("username");
            $.removeCookie("password");
            location.reload();	
        }
    });	
}

function tokeErrorLogOutUsers() {
    if ( currentUserRole !== "1") {
        signOut();
    }
}

function placeAccessToken() {
    if ( currentUserRole == "1") {
        $(".current-access-token p").append(icMeterSystemAccessToken);
        var e = icMeterSystemAccessTokenExperes;
        setInterval(function(){
            e --;
            $("#token-expiry-time").text(e);
        }, 1000);
    }
}

// Request Auto-login

function requestAutoLoginSystem(){	
    var cookieUserName = $.cookie("username");
    var cookiePassword = $.cookie("password");		

    // Store link to api and phase userinput
    var sUrl = "api/api-user-login.php?fAY2YfpdKvR="+sender_first+"&username="+cookieUserName+"&password="+cookiePassword;

    $.get( sUrl , function( sData ){
        var jData = JSON.parse(sData);
        if( jData.status === "approve" ){
            showSchool = jData.school;
            loadAutoLogin();
        }
        else{
            signOut();
        }
    });
}

// Request new user signup
$("#link-request-new-profile").click(function() {
    $(".img-con").animate({ left: '0' }, 500, "swing");
    $(".img-con").addClass("blur");
    setTimeout(() => {
        $(".view-signup").css("display", "flex").hide().fadeIn();
    }, 1000);
    ga('set', 'page', '/Ny-bruger-admodning/');
    ga('send', 'pageview');
});

$(".ico-close-signup").click(function () {
    closeSetupProfile();
    ga('set', 'page', '/Login/');
    ga('send', 'pageview');
});

function closeSetupProfile() {
    $(".view-signup").fadeOut();
    $(".img-con").addClass("none-blur");
    setTimeout(() => {
        $(".img-con").animate({ left: '-35vw' }, 500, "swing");
    }, 1000);
    setTimeout(() => {
        $(".img-con").removeClass("blur");
        $(".img-con").removeClass("none-blur");
    }, 2000);
}

$(document).on("focus", ".inp-signup", function () {
    $(this).removeClass("wrong-login");
});

$("#btn-send-profile-request").click(function(){
    //Check if the muncipality is on the list of valid ones:
    var mun = $("#search").val();
    $.get("https://dawa.aws.dk/kommuner/autocomplete?q=" + mun,{term:mun}, function(data) {
        if(data.length == 0){
            alert("Vælg venligst en kommune fra listen.");
        }
    }, "json");

    var profileRequestVal = {
        userName: false,
        password: false,
        mun: false,
        compName: false,
        nameFirst: false,
        nameLast: false,
        email: false,
        phone: false,
        street: false,
        zip: false,
        city: false,
        recaptcha: false 
    };

    var inpUserName = $("#inp-signup-company-username");
    var inpPassword = $("#inp-signup-company-password");
    var inpMun = $("#search");
    var inpCompName = $("#inp-signup-company-companyname");
    var inpNameFirst = $("#inp-signup-company-contact-first-name");
    var inpNameLast = $("#inp-signup-company-contact-last-name");
    var inpEmail = $("#inp-signup-company-contact-email");
    var inpPhone = $("#inp-signup-company-contact-phone1");
    var inpStreet = $("#inp-signup-company-street1");
    var inpZip = $("#inp-signup-company-zipcode");
    var inpCity = $("#inp-signup-company-city");

    if (inpUserName.val().length < 2) {
        inpUserName.addClass("wrong-login");
        profileRequestVal.userName = false;
    } else {
        inpUserName.removeClass('wrong-login');
        profileRequestVal.userName = true;
    }
    if (inpPassword.val().length < 2) {
        inpPassword.addClass("wrong-login");
        profileRequestVal.password = false;
    } else {
        inpPassword.removeClass('wrong-login');
        profileRequestVal.password = true;
    }
    if (inpCompName.val().length < 2) {
        inpCompName.addClass("wrong-login");
        profileRequestVal.compName = false;
    } else {
        inpCompName.removeClass('wrong-login');
        profileRequestVal.compName = true;
    }
    if (inpMun.val().length < 2) {
        inpMun.addClass("wrong-login");
        profileRequestVal.mun = false;
    } else {
        inpMun.removeClass('wrong-login');
        profileRequestVal.mun = true;
    }

    if (inpNameFirst.val().length < 2) {
        inpNameFirst.addClass("wrong-login");
        profileRequestVal.nameFirst = false;
    } else {
        inpNameFirst.removeClass('wrong-login');
        profileRequestVal.nameFirst = true;
    }
    if (inpNameLast.val().length < 2) {
        inpNameLast.addClass("wrong-login");
        profileRequestVal.nameLast = false;
    } else {
        inpNameLast.removeClass('wrong-login');
        profileRequestVal.nameLast = true;
    }
    if (!reE.test(inpEmail.val()) || inpEmail.val().length < 2) {
        inpEmail.addClass("wrong-login");
        profileRequestVal.email = false;
    } else {
        inpEmail.removeClass('wrong-login');
        profileRequestVal.email = true;
    }
    if (inpPhone.val().length < 8) {
        inpPhone.addClass("wrong-login");
        profileRequestVal.phone = false;
    } else {
        inpPhone.removeClass('wrong-login');
        profileRequestVal.phone = true;
    }
    if (inpStreet.val().length < 2) {
        inpStreet.addClass("wrong-login");
        profileRequestVal.street = false;
    } else {
        inpStreet.removeClass('wrong-login');
        profileRequestVal.street = true;
    }
    if (inpZip.val().length < 4) {
        inpZip.addClass("wrong-login");
        profileRequestVal.zip = false;
    } else {
        inpZip.removeClass('wrong-login');
        profileRequestVal.zip = true;
    }
    if (inpCity.val().length < 2) {
        inpCity.addClass("wrong-login");
        profileRequestVal.city = false;
    } else {
        inpCity.removeClass('wrong-login');
        profileRequestVal.city = true;
    }
    if (grecaptcha.getResponse() == "") {
        $(".g-recaptcha").css("outline", "solid 1px #ff4242");
        setTimeout(() => {
            $(".g-recaptcha").css("outline", "none");
        }, 2000);
        profileRequestVal.recaptcha = false;
    } else {
        $(".g-recaptcha").css("outline", "none");
        profileRequestVal.recaptcha = true;
    }
    if (profileRequestVal.compName && 
        profileRequestVal.nameFirst && 
        profileRequestVal.nameLast && 
        profileRequestVal.email && 
        profileRequestVal.phone && 
        profileRequestVal.street && 
        profileRequestVal.zip && 
        profileRequestVal.city && 
        profileRequestVal.recaptcha ) {
        requestNewCompanySetup();
    }
});

function requestNewCompanySetup() {
    var inpUserName = $("#inp-signup-company-username").val();
    var inpPassword = $("#inp-signup-company-password").val();
    var inpCompName = $("#inp-signup-company-companyname").val();
    var inpMunName = $("#search").val();
    var inpNameFirst = $("#inp-signup-company-contact-first-name").val();
    var inpNameLast = $("#inp-signup-company-contact-last-name").val();
    var inpEmail = $("#inp-signup-company-contact-email").val();
    var inpPhone1 = $("#inp-signup-company-contact-phone1").val();
    var inpPhone2 = $("#inp-signup-company-contact-phone2").val();
    var inpStreet1 = $("#inp-signup-company-street1").val();
    var inpStreet2 = $("#inp-signup-company-street2").val();
    var inpZip = $("#inp-signup-company-zipcode").val();
    var inpCity = $("#inp-signup-company-city").val();
    var Country = $("#inp-weather-countrys").find('option:selected').attr('value');

    $.ajax({
        type: "POST",
        url: "api/api-request-company-user.php",
        data: {
            userName: inpUserName,
            userPass: inpPassword,
            compName: inpCompName,
            munName: inpMunName,
            nameFirst: inpNameFirst,
            nameLast: inpNameLast,
            email: inpEmail,
            phone1: inpPhone1,
            phone2: inpPhone2,
            street1: inpStreet1,
            street2: inpStreet2,
            zip: inpZip,
            city: inpCity,
            Country: Country,
            captcha: grecaptcha.getResponse()
        },
        success: function (data) {
            var jData = JSON.parse(data);
            if (jData.status == "ok") {
                $(".inp-signup").val("");
                grecaptcha.reset();
                closeSetupProfile();
                swal({
                    title: "Tak for din interesse",
                    text: "Din anmodning vil nu blive behandlet og du vil blive kontaktet hurtigst.",
                    type: "success",
                    showCancelButton: false
                });
            } else {
                swal("Noget gik galt!", "Anmodningen blev ikke sendt. Prøv venligt igen.", "error");
                $(".inp-signup").val("");
                grecaptcha.reset();
            }
        }
    });
}

// Request new limited user signup
$("#link-request-new-limited-profile").click(function() {
    $(".img-con").animate({ left: '0' }, 500, "swing");
    $(".img-con").addClass("blur");
    setTimeout(() => {
        $(".view-limited-signup").css("display", "flex").hide().fadeIn();
    }, 1000);


    ga('set', 'page', '/Ny-begrænset-bruger-admodning/');
    ga('send', 'pageview');
});

$(".ico-close-signup").click(function () {
    closeSetupLimitedProfile();
    ga('set', 'page', '/Login/');
    ga('send', 'pageview');
});

function closeSetupLimitedProfile() {
    $(".view-limited-signup").fadeOut();
    $(".img-con").addClass("none-blur");
    setTimeout(() => {
        $(".img-con").animate({ left: '-35vw' }, 500, "swing");
    }, 1000);
    setTimeout(() => {
        $(".img-con").removeClass("blur");
        $(".img-con").removeClass("none-blur");
    }, 2000);
}

$(document).on("focus", ".inp-signup", function () {
    $(this).removeClass("wrong-login");
});

$("#btn-send-limited-profile-request").click(function(){
    var profileRequestVal = {
        nameFirst: false,
        nameLast: false,
        email: false,
        uname: false,
        pword: false,
        admin: false,
    };

    var inpNameFirst = $("#inp-signup-first-name");
    var inpNameLast = $("#inp-signup-last-name");
    var inpEmail = $("#inp-signup-email");
    var inpUname = $("#inp-signup-user-name");
    var inpAdmin = $("#inp-signup-administrator");
    var inpPword = $("#inp-signup-password");

    if (inpNameFirst.val().length < 2) {
        inpNameFirst.addClass("wrong-login");
        profileRequestVal.nameFirst = false;
    } else {
        inpNameFirst.removeClass('wrong-login');
        profileRequestVal.nameFirst = true;
    }
    if (inpNameLast.val().length < 2) {
        inpNameLast.addClass("wrong-login");
        profileRequestVal.nameLast = false;
    } else {
        inpNameLast.removeClass('wrong-login');
        profileRequestVal.nameLast = true;
    }
    if (!reE.test(inpEmail.val()) || inpEmail.val().length < 2) {
        inpEmail.addClass("wrong-login");
        profileRequestVal.email = false;
    } else {
        inpEmail.removeClass('wrong-login');
        profileRequestVal.email = true;
    }
    if (inpUname.val().length < 2) { //CHECK IF USERNAME EXIST (Good if it doesn't)
        inpUname.addClass("wrong-login");
        profileRequestVal.uname = false;
    } else {
        inpUname.removeClass('wrong-login');
        profileRequestVal.uname = true;
    }
    if (inpPword.val().length < 2) { //CHECK IF USERNAME EXIST (Good if it doesn't)
        inpPword.addClass("wrong-login");
        profileRequestVal.pword = false;
    } else {
        inpPword.removeClass('wrong-login');
        profileRequestVal.pword = true;
    }
    if (inpAdmin.val().length < 2) { //CHECK IF USERNAME EXIST (good if it does)
        inpAdmin.addClass("wrong-login");
        profileRequestVal.admin = false;
    } else {
        inpAdmin.removeClass('wrong-login');
        profileRequestVal.admin = true;
    }

    if (profileRequestVal.nameFirst && 
        profileRequestVal.nameLast && 
        profileRequestVal.email && 
        profileRequestVal.uname && 
        profileRequestVal.pword &&
        profileRequestVal.admin) {
        requestNewUserSetup();
    }
});

function requestNewUserSetup() {
    var inpNameFirst = $("#inp-signup-first-name").val();
    var inpNameLast = $("#inp-signup-last-name").val();
    var inpEmail = $("#inp-signup-email").val();
    var inpUname = $("#inp-signup-user-name").val();
    var inpPword = $("#inp-signup-password").val();
    var inpAdmin = $("#inp-signup-administrator").val();
    var inpRole = 4;
    $.ajax({
        type: "POST",
        url: "api/api-request-limited-user.php",
        data: {
            nameFirst: inpNameFirst,
            nameLast: inpNameLast,
            email: inpEmail,
            uName: inpUname,
            pWord: inpPword,
            admin: inpAdmin,
            role: inpRole,
        },
        success: function (data) {
            var jData = JSON.parse(data);
            if (jData.status == "ok") {
                $(".inp-signup").val("");
                grecaptcha.reset();
                closeSetupLimitedProfile();
                swal({
                    title: "Tak for din interesse",
                    text: "Din anmodning vil nu blive behandlet og du vil blive kontaktet hurtigst.",
                    type: "success",
                    showCancelButton: false
                });
            } else {
                swal("Noget gik galt!", "Anmodningen blev ikke sendt. Prøv venligt igen.", "error");
                $(".inp-signup").val("");
                grecaptcha.reset();
            }
        }
    });
}