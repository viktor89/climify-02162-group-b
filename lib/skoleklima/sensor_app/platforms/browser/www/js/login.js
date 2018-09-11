/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.



 */
// Toggle between admin-only login and all login
var adminOnlyLogin = false;

// TODO: change to Linux server IP
//serverIP = "http://193.200.45.37/var/www/html/mobileapp/"
serverIP = "http://10.16.174.45:8888/app/";
//serverIP = "http://10.16.167.239:8888/app/";

if (adminOnlyLogin) {
    getSessionToken();
}

function getSessionToken() {
    //alert("getSessionToken");
    $.ajax({
        type: "POST",
        url: serverIP  +"session.php",
        data: {
            fileName: "login"
        },
        error: function (request,error) {
            alert('Network error, please try again. Error:' + error);
        },
        success: function (data) {
        var jData = JSON.parse(data);
        //alert('Login successful, adminST = '+jData.adminSessionToken);
        sessionToken = jData.adminSessionToken;
    }
           });
}

// For admin-login only
function tryLogin() {
    alert("session token: "+ sessionToken);
    var username = $("#inp-login-username").val();
    var password = $("#inp-login-password").val();
    if (username != "" && password != "") {
        //alert("trying ajax");
        $.ajax({
            type: "POST",
            // Change between admin or user login
            url: serverIP + "api-admin-login.php",
            data: {
                sessionToken: sessionToken,
                username: username,
                password: password
            },
            success: function (data) {
                //alert('tryLogin successful, data = '+data);
                var jData = JSON.parse(data);
                //alert('Login successful, jData = '+jData);
                //alert('Login successful, jData.status = '+jData.status);
                if (jData.status == "ok") {
                    window.location="map.html";
                } else {
                    wrongLogin();
                }

            }
        });
    }
}


// For all login
function getSenderFirst() {
    //alert("getSenderFirst");
    $.ajax({
        type: "POST",
        url: serverIP + "meta.php",
        //url: "https://193.200.45.37/mobileapp/meta.php",
        data: {
            fileName: "login"
        },
        error: function (request,error) {
            alert('Network error, please try again. Error:' + error);
        },
        success: function (data) {
            alert("Success");
            alert("data: "+ data)
            var jData = JSON.parse(data);
            sender_first = jData.senderFirst;
            requestLoginSystem();
        }
    })   
}

// For all login
function requestLoginSystem(){
    alert("requestLoginSystem");
    var typedUserName = $("#inp-login-username").val();
    var typedPassword = $("#inp-login-password").val();	
    // Store link to api and parse userinput
    var sUrl = serverIP + "api-encrypt.php?fAY2YfpdKvR="+sender_first+"&encrypt="+typedPassword;
    $.get( sUrl , function( sData ){
        //alert(sData);
        var jData = JSON.parse(sData); 
        if( jData.status == "ok" ){
            var passEncrypt = jData.encrypt;
            //alert("passEncrypt: "+ passEncrypt);
            // Store link to api and phase userinput
            var sUrl = serverIP + "api-user-login.php";
            //?fAY2YfpdKvR="+sender_first+"&username="+typedUserName+"&password="+passEncrypt;
            // Do AJAX and pahse

            $.ajax({
                type: "POST",
                url: sUrl,
                data: {
                    fAY2YfpdKvR: sender_first,
                    username: typedUserName,
                    password: passEncrypt
                    // Quick fix...
                    //password: typedPassword
                },
                error: function (request,error) {
                    alert('Network error, please try again. Error:' + error);
                },
                success: function (data) {
                //alert(data);
                var jData = JSON.parse(data);
                //alert("jData.school: "+ jData.school);

                if( jData.status == "ok" ){
                //siteOnline = true;
                //correctLogin();	
                // alert("correct login")
                window.location="map.html";
            } else{
                   //alert("wrong login")
                   wrongLogin();
        }
    }
          })
} else{
    wrongLogin();
}
});	
};

// For all login and admin-only login
function validateLoginNonEmpty () {
    //alert("validate login nonempty");
    if ( $("#inp-login-username").val() !== "" && $("#inp-login-password").val() !== "" ) {
        if (adminOnlyLogin) {
            tryLogin();
        } else {
            getSenderFirst();
            //requestLoginSystem();
        }
    } else {
        wrongLogin();
    }
}

// For all login + admin-only login
function wrongLogin(){
    $("#inp-login-username").val("");
    $("#inp-login-password").val("");
    $("#inp-login-username").addClass("wrong-login");
    $("#inp-login-password").addClass("wrong-login");
    setTimeout(() => {
        $("#inp-login-username").removeClass("wrong-login");
        $("#inp-login-password").removeClass("wrong-login"); 
    }, 2000);
}

