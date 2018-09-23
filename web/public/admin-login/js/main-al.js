// ***********  Main-al js *********** //

// Variables
var reE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
MunIDs = [];
phoneNumbers = [];
phoneIDs = []; //ID is to check which number is the primary number and which is the secondary...
streets = []; 
streetIDs = [];

// Show company meta
$(document).ready(function () {
    updateCompanyList(false);
});

$(document).on("click", ".ico-show-meta", function(){
    // $('#mydiv').attr('style', 'width: 100px !important');
    $(this).parent().parent().parent().css('border-width', '0');

    if ($(this).parent().parent().attr("id")=="outerDiv"){
        $(this).parent().css("border","1px solid #000000");
        $(this).parent().width(950);
    }
    //$(this).parent().parent().
    else{
        $(this).parent().parent().width(950);
        $(this).parent().parent().css("border","1px solid #000000");
    }

    var companyID = $(this).parent().parent().attr("data-company-id");
    $(this).parent().find(".ico-show-meta").hide();
    $(this).parent().find(".ico-hide-meta").show();
    $(this).parent().parent().find(".user-list-single-meta").show();
    requestCompanyUserList(companyID);
    requestDBInfo($(this));
});

// Get database information
function requestDBInfo(id){
    var companyID = id.parent().parent().attr("data-company-id");
    var sUrl = "api/api-get-db-info.php";
    $.post(sUrl, {
        sessionToken: sessionToken,
        id: companyID
    }, function (data) {
        var jData = JSON.parse(data);
        if (jData.status == "ok") {
            id.parent().parent().find(".inp-system-db-meta-name").val(jData.dbName);
            id.parent().parent().find(".inp-system-db-meta-user").val(jData.dbUser);
            id.parent().parent().find(".inp-system-db-meta-pass").val(jData.dbPass);
        }
    });
}

$(document).on("click", ".ico-hide-meta", function () {
    $(this).parent().parent().parent().css('border-width', '0');

    if ($(this).parent().parent().attr("id")=="outerDiv"){
        $(this).parent().css("border","1px solid #000000");
 
        $(".DTUManager-list").css("width","500px");
    }


    //$(this).parent().parent().
    else{
        $(this).parent().parent().width(155);
        $(this).parent().parent().css("border","1px solid #000000");
    }

    $(this).parent().parent().find(".user-list-single-meta").hide();
    $(this).parent().find(".ico-show-meta").show();
    $(this).parent().find(".ico-hide-meta").hide();
});

// Update database information
$(document).on("click", ".btn-user-db-meta", function () {
    var companyID = $(this).parent().parent().parent().parent().parent().attr("data-company-id");
    var thisDBName = $(this).parent().parent().find(".inp-system-db-meta-name").val();
    var thisDBUser = $(this).parent().parent().find(".inp-system-db-meta-user").val();
    var thisDBNPass = $(this).parent().parent().find(".inp-system-db-meta-pass").val();

    if (thisDBName != "" && thisDBUser != "" && thisDBNPass != "") {
        var sUrl = "api/api-update-db-info.php";
        $.post(sUrl, {
            sessionToken: sessionToken,
            id: companyID,
            name: thisDBName,
            user: thisDBUser,
            pass: thisDBNPass
        }, function (data) {
            var jData = JSON.parse(data);
            if (jData.status == "ok") {
                swal({
                    title: "",
                    text: 'Database information is updated.',
                    type: "success"
                });
            } else {
                if (jData.message == "wrongInfo") {
                    swal({
                        title: "Wrong information",
                        text: 'Could not connect to database. <br> This is probably due to either a incorrect database name, username or password.',
                        type: "error",
                        html: true
                    });
                } else {
                    swal({
                        title: "",
                        text: 'Could not write to database. Try again later',
                        type: "error"
                    });
                }
            }
        });
    } else {
        if ($(this).parent().parent().find(".inp-system-db-meta-name").val() == "") {
            $(this).parent().parent().find(".inp-system-db-meta-name").addClass("wrong-input");
        } if ($(this).parent().parent().find(".inp-system-db-meta-user").val() == "") {
            $(this).parent().parent().find(".inp-system-db-meta-user").addClass("wrong-input");
        } if ($(this).parent().parent().find(".inp-system-db-meta-pass").val() == "") {
            $(this).parent().parent().find(".inp-system-db-meta-pass").addClass("wrong-input");
        }
        setTimeout(() => {
            $(this).parent().parent().find(".inp-system-db-meta-name, .inp-system-db-meta-user, .inp-system-db-meta-pass").removeClass("wrong-input");
        }, 2000);
    }
});

// Activate save button
$(document).on("change", ".inp-system", function(){
    $(this).parent().parent().find(".btn-save-sel-company").removeClass("button-disabled");
});

// Create company user button
$(document).on("click", ".btn-create-user-company", function () {
    var companyID = $(this).parent().parent().parent().parent().parent().attr("data-company-id");

    var username = $(this).parent().find(".inp-system-create-user-username").val();
    var firstName = $(this).parent().find(".inp-system-create-user-firstname").val();
    var lastName = $(this).parent().find(".inp-system-create-user-lastname").val();
    var email = $(this).parent().find(".inp-system-create-user-email").val();
    if (username.length < 4 || username.length > 8) {
        $(this).parent().find(".inp-system-create-user-username").addClass("wrong-input");
        setTimeout(() => {
            $(this).parent().find(".inp-system-create-user-username").removeClass("wrong-input");
        }, 2000);
    } else {
        var thisInput = $(this).parent().find(".inp-system-create-user");
        requestCreateUser(thisInput, companyID, username, firstName, lastName, email)
    }
});


// Create manager button
$(document).on("click", "#btn-create-manager", function () {
    var username = $(this).parent().find(".inp-system-create-user-username").val();
    var password = $(this).parent().find(".inp-system-password").val();



    if (username.length < 4 || username.length > 8) {
        $(this).parent().find(".inp-system-create-user-username").addClass("wrong-input");
        setTimeout(() => {
            $(this).parent().find(".inp-system-create-user-username").removeClass("wrong-input");
        }, 2000);

        swal({
            title: '',
            text: 'Username should be between 4 and 8 characters',
            type: 'error'
        });
    } 

    else{

        var sUrl = "api/api-create-manager.php";

        $.post(sUrl, {
            sessionToken: sessionToken,
            username: username,
            password: password
        }, function (data) {
            var jData = JSON.parse(data);
            if (jData.status="ok") {
                swal({
                    title: "",
                    text: "The DTU Manager was created successfully and has admin rights!",
                    type: "success",
                    html: true
                });
            }
            else if (jData.status="error"){
                swal({
                    title: '',
                    text: 'Something went wrong. Try again later',
                    type: 'error'
                });
            }
        });
    }


});






// Update userlist
$(document).on("focus", ".inp-system", function () {
    $(this).removeClass("wrong-input");
});

$(document).on("click", "#btn-update-company-list", function () {
    updateCompanyList(false);
});

$(document).on("click", "#btn-search-company", function () {
    if ($("#imp-search-company").val() != "") {
        updateCompanyList(true);
    } else {
        $("#imp-search-company").addClass("wrong-input");
        setTimeout(() => {
            $("#imp-search-company").removeClass("wrong-input");
        }, 2000);
    }
});

$("#imp-search-company").keyup(function (event) {
    if (event.keyCode == 13) {
        $("#btn-search-company").click();
    }
});

function updateCompanyList(search) {
    var userBlock = $("#inp-serch-block").val();
    $(".header-text-wrapper h4").text("");
    $(".user-list").empty();
    $(".user-list").html("<p><i class='update-spinner fa fa-spinner fa-spin fa-1x fa-fw'></i> Fetching data...</p>");
    if (userBlock == 0) {
        $(".header-text-wrapper h4").text("Inactive users");
    } else if (userBlock == 1) {
        $(".header-text-wrapper h4").text("Active users");
    } else if (userBlock == 2) {
        $(".header-text-wrapper h4").text("All users");
    }
    if (search) {
        search = $("#imp-search-company").val();
        $("#imp-search-company").val("");
        $(".header-text-wrapper h4").text("Search results for: '" + search+ "'");
    } else {
        search = null;
    }

    /*<div class="user-list-single-header">\
<h4>{{companyName}}</h4>\
<p>{{firstName1}} {{lastName1}}</p>\
<i class="ico-show-meta fa fa-plus link"></i>\
<i class="ico-hide-meta fa fa-minus link"></i>\
</div>\*/

    var sUrl = "api/api-get-companyes.php";
    var temp =  '<div class="user-list-single-wrapper" data-company-id="{{companyId}}">\n\
<div class="user-list-single-header">\n\
<p>{{companyName}}</p>\n\
<i class="ico-show-meta fa fa-plus link"></i>\n\
<i class="ico-hide-meta fa fa-minus link"></i>\n\
</div>\n\
<div class="user-list-single-meta">\n\
<div class="user-meta-company">\n\
<div class="user-list-single-meta-left">\n\
<h4>Contact information</h4>\n\
<input class="inp-system inp-system-contact-firstname" type="text" value="{{firstName2}}" placeholder="Frist Name">\n\
<input class="inp-system inp-system-contact-lastname" type="text" value="{{lastName2}}" placeholder="Last Name">\n\
<input class="inp-system inp-system-contact-email" type="email" value="{{email}}" placeholder="E-mail">\n\
<input class="inp-system inp-system-contact-phone1" type="text" value="{{phone1}}" placeholder="Phone number 1">\n\
<input class="inp-system inp-system-contact-phone2" type="text" value="{{phone2}}" placeholder="Phone number 2">\n\
</div>\n\
<div class="user-list-single-meta-middle">\n\
<h4>Address</h4>\n\
<input class="inp-system inp-system-contact-address1" type="text" value="{{street1}}" placeholder="Address 1">\n\
<input class="inp-system inp-system-contact-address2" type="text" value="{{street2}}" placeholder="Address 2">\n\
<input class="inp-system inp-system-contact-zipcode" type="text" value="{{zipcode}}" placeholder="Zip code">\n\
<input class="inp-system inp-system-contact-city" type="text" value="{{city}}" placeholder="City">\n\
</div>\n\
<div class="user-list-single-meta-right">\n\
<span>\n\
<button class="btn-delete-sel-company">Delete permanently</button>\n\
<button class="btn-save-sel-company button-disabled">Save changes</button>\n\
</span>\n\
<h4>Account Status</h4>\n\
<p>Unique id: {{companyIdShow}}</p>\n\
<p>Created: {{createDate}}</p>\n\
<select class="inp-system inp-system-status-select">\n\
<option value="1" {{selected1}}>Active</option>\n\
<option value="0" {{selected0}}>Inactive</option>\n\
</select>\
</div >\
</div >\
<div class="user-meta-dbconnection">\
<h4>Connect user to database</h4>\
<div class="dbconnection-imp">\
<span>\
<input type="text" class="inp-system-db-meta inp-system-db-meta-name" placeholder="Database navn">\
<input type="text" class="inp-system-db-meta inp-system-db-meta-user" placeholder="Database bruger">\
<input type="text" class="inp-system-db-meta inp-system-db-meta-pass" placeholder="Database password">\
<p></p>\
<button class="btn-user-db-meta">Update</button>\
</span>\
</div>\
</div>\
<div class="user-meta-subusers">\
<h4>Associated Project Managers</h4>\
<div class="create-subuser-wrapper">\
<p>New users will automatically be assigned to the administrator role</p>\
<span>\
<input type="text" class="inp-system-create-user inp-system-create-user-username" placeholder="Username (4-8 character)">\
<input type="text" class="inp-system-create-user inp-system-create-user-firstname" placeholder="First Name">\
<input type="text" class="inp-system-create-user inp-system-create-user-lastname" placeholder="Last Name">\
<input type="email" class="inp-system-create-user inp-system-create-user-email" placeholder="E-mail">\
<button class="btn-create-user-company">Create user</button>\
</span>\
</div>\
<div class="user-meta-subusers-userlist">\
</div>\
</div>\
</div>\
</div >\
';

    /*
var manTemp =  '<div class="user-meta-man">\
<h4>DTU Managers</h4>\
<div class="create-man-wrapper">\
<p>New users will automatically be assigned to the administrator role</p>\
<span>\
<input type="text" class="inp-system-create-user inp-system-create-user-username" placeholder="Username (4-8 character)">\
<input type="text" class="inp-system-create-user inp-system-create-user-firstname" placeholder="First Name">\
<input type="text" class="inp-system-create-user inp-system-create-user-lastname" placeholder="Last Name">\
<input type="email" class="inp-system-create-user inp-system-create-user-email" placeholder="E-mail">\
<button class="btn-create-user-man">Create user</button>\
</span>\
</div>\
<div class="user-meta-subusers-userlist">\
</div>\
';*/

    $.post(sUrl, {
        sessionToken: sessionToken,
        status: userBlock,
        search: search
    }, function (data) {
        var jData = JSON.parse(data);
        $(".user-list").empty();
        if (jData.length > 0) {
            for (var i = 0; i < jData.length; i++) {
                var isIncludedMun = MunIDs.includes(jData[i].MunID);
                if (!isIncludedMun){
                    replaceTemp = temp;
                }

                /*
                if (jData[i].companyAddressStreet2 == null || jData[i].companyAddressStreet2 == "") {
                    replaceTemp = replaceTemp.replace("{{street2}}", "");

                } else {
                    replaceTemp = replaceTemp.replace("{{street2}}", jData[i].companyAddressStreet2);
                }
                if (jData[i].companyPhone2 == null ||  jData[i].companyPhone2 == "") {
                    replaceTemp = replaceTemp.replace("{{phone2}}", "");
                } else {
                    replaceTemp = replaceTemp.replace("{{phone2}}", jData[i].PhoneNumber);
                }

                */




                if (!isIncludedMun){
                    replaceTemp = replaceTemp.replace("{{companyId}}", jData[i].MunID);
                    replaceTemp = replaceTemp.replace("{{companyIdShow}}", jData[i].MunID);
                    replaceTemp = replaceTemp.replace("{{companyName}}", jData[i].MunName);
                    replaceTemp = replaceTemp.replace("{{firstName1}}", jData[i].FirstName);
                    replaceTemp = replaceTemp.replace("{{lastName1}}", jData[i].LastName);
                    replaceTemp = replaceTemp.replace("{{firstName2}}", jData[i].FirstName);
                    replaceTemp = replaceTemp.replace("{{lastName2}}", jData[i].LastName);
                    replaceTemp = replaceTemp.replace("{{email}}", jData[i].Email);
                    replaceTemp = replaceTemp.replace("{{phone1}}", jData[i].PhoneNumber);
                    replaceTemp = replaceTemp.replace("{{street1}}", jData[i].Street);
                    replaceTemp = replaceTemp.replace("{{zipcode}}", jData[i].ZipNo);
                    replaceTemp = replaceTemp.replace("{{city}}", jData[i].City);
                    replaceTemp = replaceTemp.replace("{{createDate}}", jData[i].DateOfCreation);
                    MunIDs.push(jData[i].MunID);
                    phoneNumbers.push(jData[i].PhoneNumber);
                    streets.push(jData[i].Street);
                    phoneIDs.push(jData[i].PhoneID);
                    streetIDs.push(jData[i].AddressID);
                }

          


                if (!phoneNumbers.includes(jData[i].PhoneNumber)) {
                    //replaceTemp = replaceTemp.replace("{{phone2}}", jData[i].PhoneNumber);
                    var toGetIndexOf = $(".inp-system-contact-phone1").val();
                    var index = phoneNumbers.indexOf(toGetIndexOf);
                    var currentPrimeID = phoneIDs[index];

                    //Making sure primary phone number is shown before secondary
                    if (jData[i].PhoneID<currentPrimeID){

                        $(".inp-system-contact-phone1").attr('value',jData[i].PhoneNumber);
                        $(".inp-system-contact-phone2").attr('value',toGetIndexOf);

                    }
                    else{

                        $(".inp-system-contact-phone2").attr('value',jData[i].PhoneNumber);
                    }

                    phoneNumbers.push(jData[i].PhoneNumber);
                }



                if (!streets.includes(jData[i].Street)){
                
                    var toGetIndexOf = $(".inp-system-contact-address1").val();
                    var index = streets.indexOf(toGetIndexOf);
                    var currentPrimeID = streetIDs[index];

                    if (jData[i].AddressID<currentPrimeID){

                        $(".inp-system-contact-address1").attr('value',jData[i].Street);
                        $(".inp-system-contact-address2").attr('value',toGetIndexOf);

                    }
                    else{

                        $(".inp-system-contact-address2").attr('value',jData[i].Street);
                    }

                    streets.push(jData[i].Street);
                }

                if (!isIncludedMun){
                    if (jData[i].userBlocked == 0) {
                        replaceTemp = replaceTemp.replace("{{selected0}}", "selected");
                        replaceTemp = replaceTemp.replace("{{selected1}}", "");
                    } else if (jData[i].userBlocked == 1) {
                        replaceTemp = replaceTemp.replace("{{selected0}}", "");
                        replaceTemp = replaceTemp.replace("{{selected1}}", "selected");
                    }





                    //Handling if phone2 and address2 were not present
               
                    
                    if (replaceTemp.includes("{{street2}}")){
           
                        // break the textblock into an array of lines
                        replaceTemp = replaceTemp.split('\n');
                        // remove one line, starting at the first position
                        replaceTemp.splice(19,1);
                        // join the array back into a single string
                        replaceTemp = replaceTemp.join('\n')

                  
                    }

                    if (replaceTemp.includes("{{phone2}}")){
                    
                         // break the textblock into an array of lines
                        replaceTemp = replaceTemp.split('\n');
                        // remove one line, starting at the first position
                        replaceTemp.splice(14,1);
                        // join the array back into a single string
                        replaceTemp = replaceTemp.join('\n')
                    }

                    $(".user-list").append(replaceTemp);
                    //$(document).append(manTemp);





                }
            }
        }else {
            if (userBlock == 0) {
                $(".header-text-wrapper h4").text("No result found among deactivated users");
            } else if (userBlock == 1) {
                $(".header-text-wrapper h4").text("No result found among active users");
            } else if (userBlock == 2) {
                $(".header-text-wrapper h4").text("No result found");
            }
        }




    });

 




    var div = document.createElement('div');
    div.id = 'outerDiv';
    //div.className = "user-list-single-wrapper";
    document.getElementsByTagName('body')[0].appendChild(div);


    $("#outerDiv").load("ink/managers.php");


}

// Update company

$(document).on("click", ".btn-save-sel-company", function () {
    var selCompany = $(this);
    if (!selCompany.hasClass("button-disabled")) {
        selCompany.addClass(("button-disabled"));
        requestUpdateCompany(selCompany);
    } 
});

function requestUpdateCompany(selCompany) {
    var thisID = selCompany.parent().parent().parent().parent().parent().attr("data-company-id");
    var thisCompanyContantFirstName = selCompany.parent().parent().parent().find(".inp-system-contact-firstname").val();
    var thisCompanyContantLastName = selCompany.parent().parent().parent().find(".inp-system-contact-lastname").val();
    var thisCompanyContantEmail = selCompany.parent().parent().parent().find(".inp-system-contact-email").val();
    var thisCompanyContantPhone1 = selCompany.parent().parent().parent().find(".inp-system-contact-phone1").val();
    var thisCompanyContantPhone2 = selCompany.parent().parent().parent().find(".inp-system-contact-phone2").val();
    var thisCompanyContantAddress1 = selCompany.parent().parent().parent().find(".inp-system-contact-address1").val();
    var thisCompanyContantAddress2 = selCompany.parent().parent().parent().find(".inp-system-contact-address2").val();
    var thisCompanyContantZipcode = selCompany.parent().parent().parent().find(".inp-system-contact-zipcode").val();
    var thisCompanyContantCity = selCompany.parent().parent().parent().find(".inp-system-contact-city").val();
    var thisCompanyBlockStatus = selCompany.parent().parent().parent().find(".inp-system-status-select").val();

    if (!thisCompanyContantFirstName) {
        selCompany.parent().parent().parent().find(".inp-system-contact-firstname").addClass("wrong-input");
    } 
    if (!thisCompanyContantLastName) {
        selCompany.parent().parent().parent().find(".inp-system-contact-lastname").addClass("wrong-input");
    }
    if (!reE.test(thisCompanyContantEmail) || thisCompanyContantEmail == "") {
        selCompany.parent().parent().parent().find(".inp-system-contact-email").addClass("wrong-input");
    }
    if (!thisCompanyContantPhone1) {
        selCompany.parent().parent().parent().find(".inp-system-contact-phone1").addClass("wrong-input");
    } 
    if (!thisCompanyContantAddress1) {
        selCompany.parent().parent().parent().find(".inp-system-contact-address1").addClass("wrong-input");
    } 
    if (!thisCompanyContantZipcode) {
        selCompany.parent().parent().parent().find(".inp-system-contact-zipcode").addClass("wrong-input");
    } 
    if (!thisCompanyContantCity) {
        selCompany.parent().parent().parent().find(".inp-system-contact-city").addClass("wrong-input");
    } 

    var sUrl = "api/api-update-companyes.php";
    $.post(sUrl, {
        sessionToken: sessionToken,
        companyid: thisID,
        firstname: thisCompanyContantFirstName,
        lastname: thisCompanyContantLastName,
        email: thisCompanyContantEmail,
        phone1: thisCompanyContantPhone1,
        phone2: thisCompanyContantPhone2,
        street1: thisCompanyContantAddress1,
        street2: thisCompanyContantAddress2,
        zipcode: thisCompanyContantZipcode,
        city: thisCompanyContantCity,
        blocked: thisCompanyBlockStatus
    }, function (data) {
        var jData = JSON.parse(data);
        if (jData.status == "ok") {
            $(".btn-save-sel-company").addClass("button-disabled");
            $(".inp-system").removeClass("wrong-input");

        } else {
            location.reload();
        }
    });
};

// Update company userlist

function requestCompanyUserList(companyID){

    $(".user-list").find("[data-company-id='" + companyID + "']").find(".user-meta-subusers-userlist").empty();

    var sUrl = "api/api-get-company-users.php";
    var temp = '<div style="color:black" id={{userID1}} class="single-company-user" data-company-user-id="{{userID2}}">\
<p>{{userName}} {{role}} </p>\
<p>{{firstName}} {{lastName}}</p>\
<p>{{email}}</p>\
<p>{{lastLogin}}</p>\
<select class="inp-system-user-status-select">\
<option value="1" {{selected1}}>Active</option>\
<option value="0" {{selected0}}>Blocked</option>\
</select>\
<span>\
<i class="ico-reset-pass-user-company link fa fa-key" aria-hidden="true"></i>\
<i class="ico-delete-user-company link fa fa-trash" aria-hidden="true"></i>\
</span>\
</div >\
';
    $.post(sUrl, {
        sessionToken: sessionToken,
        companyid: companyID
    }, function (data) {
        var jData = JSON.parse(data);
        if (jData.length > 0) {
            for (var i = 0; i < jData.length; i++) {
        
                var replaceTemp = temp;




                replaceTemp = replaceTemp.replace("{{userID1}}", jData[i].UserID);
                replaceTemp = replaceTemp.replace("{{userID2}}", jData[i].UserID);
                replaceTemp = replaceTemp.replace("{{userName}}", jData[i].UserName);
                replaceTemp = replaceTemp.replace("{{lastName}}", jData[i].LastName);
                replaceTemp = replaceTemp.replace("{{firstName}}", jData[i].FirstName);
                if (jData[i].LastLogin == null || jData[i].LastLogin == "") {
                    replaceTemp = replaceTemp.replace("{{lastLogin}}", "");
                } else {
                    replaceTemp = replaceTemp.replace("{{lastLogin}}", jData[i].LastLogin);
                }
                if (jData[i].Email == null ||  jData[i].Email == "") {
                    replaceTemp = replaceTemp.replace("{{email}}", "");
                } else {
                    replaceTemp = replaceTemp.replace("{{email}}", jData[i].Email);
                }
                if (jData[i].RoleName == "1") {
                    replaceTemp = replaceTemp.replace("{{role}}", ""); //TODO Maybe delete this
                } else {
                    replaceTemp = replaceTemp.replace("{{role}}", "");
                }
                if (jData[i].Blocked == "0") {
                    replaceTemp = replaceTemp.replace("{{selected0}}", "selected");
                    replaceTemp = replaceTemp.replace("{{selected1}}", "");
                    replaceTemp = replaceTemp.replace("black","red");
                } else if (jData[i].Blocked == "1") {
                    replaceTemp = replaceTemp.replace("{{selected1}}", "selected");
                    replaceTemp = replaceTemp.replace("{{selected0}}", "");
                }


                $(".user-list").find("[data-company-id='" + companyID + "']").find(".user-meta-subusers-userlist").append(replaceTemp);


            }



        } else {
            $(".user-list").find("[data-company-id='" + companyID + "']").find(".user-meta-subusers-userlist").append("<p class='user-list-info-p'>No users created yet</p>")
        }
    });



};


function requestCompanyDTUManager(){

    var sUrl = "api/api-get-DTUManagers.php";
    var temp = '<div style="color:black" id={{userID1}} class="single-company-user" data-company-user-id="{{userID2}}">\
<p>{{userName}} {{role}} </p>\
<p>{{firstName}} {{lastName}}</p>\
<p>{{email}}</p>\
<p>{{lastLogin}}</p>\
<select class="inp-system-user-status-select">\
<option value="1" {{selected1}}>Active</option>\
<option value="0" {{selected0}}>Blocked</option>\
</select>\
<span>\
<i class="ico-reset-pass-user-company link fa fa-key" aria-hidden="true"></i>\
<i class="ico-delete-user-company link fa fa-trash" aria-hidden="true"></i>\
</span>\
</div >\
';
    $.post(sUrl, {
        sessionToken: sessionToken,
        companyid: companyID
    }, function (data) {
        var jData = JSON.parse(data);
        if (jData.length > 0) {
            for (var i = 0; i < jData.length; i++) {
                var replaceTemp = temp;




                replaceTemp = replaceTemp.replace("{{userID1}}", jData[i].UserID);
                replaceTemp = replaceTemp.replace("{{userID2}}", jData[i].UserID);

                if (jData[i].LastLogin == null || jData[i].LastLogin == "") {
                    replaceTemp = replaceTemp.replace("{{lastLogin}}", "");
                } else {
                    replaceTemp = replaceTemp.replace("{{lastLogin}}", jData[i].LastLogin);
                }



                $(".user-list").find("[data-company-id='" + companyID + "']").find(".user-meta-subusers-userlist").append(replaceTemp);


            }



        } else {
            $(".user-list").find("[data-company-id='" + companyID + "']").find(".user-meta-subusers-userlist").append("<p class='user-list-info-p'>No users created yet</p>")
        }
    });



};



// Create company user

function requestCreateUser(thisInput, companyID, username, firstName, lastName, email) {
    var sUrl = "api/api-create-company-user.php";
    var temp = '<div class="single-company-user" data-company-user-id="{{userID}}">\
<p>'+ username.toLowerCase() +'</p>\
<p>'+ firstName + ' ' + lastName +'</p>\
<p>'+ email + '</p>\
<p></p>\
<select class="inp-system-user-status-select">\
<option value="1" selected>Aktiv</option>\
<option value="0">Blokeret</option>\
</select>\
<span>\
<i class="ico-reset-pass-user-company link fa fa-key" aria-hidden="true"></i>\
<i class="ico-delete-user-company link fa fa-trash" aria-hidden="true"></i>\
</span>\
</div >\
';
    $.post(sUrl, {
        sessionToken: sessionToken,
        companyid: companyID,
        username: username,
        firstname: firstName,
        lastname: lastName,
        email: email,
    }, function (data) {
        var jData = JSON.parse(data);
        if (jData.status == "ok") {
            var pass = jData.pass;
            var replaceTemp = temp;
            replaceTemp = replaceTemp.replace("{{userID}}", jData.userID);
            $(".user-list").find("[data-company-id='" + companyID + "']").find(".user-meta-subusers-userlist .user-list-info-p").remove();
            $(".user-list").find("[data-company-id='" + companyID + "']").find(".user-meta-subusers-userlist").prepend(replaceTemp);
            swal({
                title: "",
                text: "The user is created with the following password:  <strong>" + pass + "</strong><br><br>When you click OK for this info box, the password will no longer be visible.",
                type: "success",
                html: true
            });
            thisInput.val("");
        } else {
            if (jData.message = "userOcupied") {
                swal({
                    title: "",
                    text: 'Username is occupied',
                    type: "error"
                });
            } else {
                swal({
                    title: '',
                    text: 'Something went wrong. Try again later',
                    type: 'error'
                });
                thisInput.val("");
            }
        }
    });
};

// Delete company

$(document).on("click", ".btn-delete-sel-company", function () {
    var selCompanyId = $(this).parent().parent().parent().parent().parent().attr("data-company-id");
    swal({
        title: "",
        text: 'Are you sure you want to delete this user, as well as any affiliates, permanently?',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete this user",
        closeOnConfirm: true
    },
         // If warning accepted do...
         function () {
        requestDeleteCompany(selCompanyId);
    });
    $(".cancel").html("Regret");
});

function requestDeleteCompany(id) {
    var sUrl = "api/api-delete-companyes.php";
    $.post(sUrl, {
        sessionToken: sessionToken,
        companyid: id
    }, function (data) {
        var jData = JSON.parse(data);
        if (jData.status == "ok") {
            updateCompanyList(false);
        } else {
            swal({
                title: "Error",
                text: 'Something went wrong. Try again later',
                type: "error"
            });
        }
    });
}

// Delete company user

$(document).on("click", ".ico-delete-user-company", function () {
    var thisID = $(this).parent().parent().attr("data-company-user-id");;
    swal({
        title: "",
        text: 'Are you sure you want to delete this user permanently?',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete this user",
        closeOnConfirm: true
    },
         // If warning accepted do...
         function () {
        requestDeleteUser(thisID);
    });
    $(".cancel").html("Regret");
});

function requestDeleteUser(id) {
    var sUrl = "api/api-delete-company-user.php";
    $.post(sUrl, {
        sessionToken: sessionToken,
        userid: id
    }, function (data) {
        var jData = JSON.parse(data);
        if (jData.status == "ok") {
            $(".user-meta-subusers-userlist").find("[data-company-user-id='" + id + "']").empty();
        } else {
            swal({
                title: "Error",
                text: 'Something went wrong. Try again later',
                type: "error"
            });
        }
    });
}

// Update company user block/unblock

$(document).on("change", ".inp-system-user-status-select", function(){


    var thisID = $(this).parent().attr("data-company-user-id");
    var thisVal = $(this).val();

    var sUrl = "api/api-change-user-block-status.php";
    $.post(sUrl, {
        sessionToken: sessionToken,
        userid: thisID,
        block: thisVal
    }, function (data) {
        var jData = JSON.parse(data);

        if (jData.status=="active"){
            swal("", "Project manager is now active", "success");
            $("#"+thisID).css("color","black");
        }

        else if (jData.status=="blocked"){
            swal("", "Project manager is now blocked", "success");
            $("#"+thisID).css("color","red");
        } 

        else{
            swal({
                title: "Error",
                text: 'Something went wrong. Try again later',
                type: "error"
            });
        }

    });



});

// Reset company user password

$(document).on("click", ".ico-reset-pass-user-company", function () {
    var thisID = $(this).parent().parent().attr("data-company-user-id");
    swal({
        title: "",
        text: "You are about to reset this user's password. Are you sure you want to continue?",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, reset password",
        closeOnConfirm: true
    },
         // If warning accepted do...
         function () {
        requestResetUserPass(thisID);
    });
    $(".cancel").html("Regret");
});

function requestResetUserPass(id) {
    var sUrl = "api/api-update-company-user-pass.php";
    $.post(sUrl, {
        sessionToken: sessionToken,
        userid: id
    }, function (data) {
        var jData = JSON.parse(data);
        if (jData.status == "ok") {
            setTimeout(() => {
                swal({
                    title: "",
                    text: "Password has now been changed to  <strong>" + jData.pass + "</strong><br><br>When you click OK for this info box, the password will no longer be visible.",
                    type: "success",
                    html: true
                }); 
            }, 1000);
        } else {
            swal({
                title: "Error",
                text: 'Something went wrong. Try again later',
                type: "error"
            });
        }
    });
}