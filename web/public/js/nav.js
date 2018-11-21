/**********************************/
//		Navigation and Routing
/**********************************/

// Navigation
$(".menu-icon-show-hide").click(function () {

    showHideMenu();
});

$(".view-dashboard").click(function () {
    if (menuShown == true) {
        showHideMenu();
    }
});

// Link navigation
$(".menu-link").click(function () {
    var goToWindow = $(this).attr("data-go-to");
    ga('set', 'page', '/' + getHumanURL(goToWindow) + '/');
    ga('send', 'pageview');    
    if (goToWindow != "learning") {
        if (goToWindow != null || goToWindow != undefined) {
            hideSingleView();
            $(".view-" + goToWindow).show();
        }
        clearInterval(mapPlayInterval);
        $(".ico-map-auto-play-stop").hide();
        $(".ico-map-auto-play-start").show();
        $(".list-user-password").prop('type', 'password');
        mapAutoPlay = true;
        if (menuShown == true) {
            $(".menu-icon-show").show();
            $(".menu-icon-hide").hide();
            hideMenu();
        }
        if (window.matchMedia('(max-width: 800px)').matches) {
            changeHeaderName(goToWindow);
        }
    } else {
        $('html').fadeOut('fast', function () {
            var goTo = window.location.href.split('#')[0] + "undervisning";
            $(location).attr('href', goTo)
        });
    }
});

// Change view name in the header 
function getHumanURL(nav) {
    switch (nav) {
        case "manage-institution":
            nav = "Manage Institution";
            break;
        case "manage-sensors":
            nav = "Manage Sensors";
            break;
        case "data":
            nav = "Graphs";
            break;
        case "communication":
            nav = "Logbook";
            break;
      case "climate-control":
          nav = "Climate Control";
          break;
        case "other-users":
            nav = "Other Users";
            break;
        case "own-user":
            nav = "Your profile";
            break;
        case "system-settings":
            nav = "Settings";
            break;
        default:
            nav = "Climate Overview"
            break;
    }
    return nav;
}

//function pastLogin(){
if (siteOnline) {
    // Routing

    ; (function ($) {
        var app = $.sammy(function () {
            this.notFound = function () {
                hideSingleView();
                $(".view-" + userStartPage).show();
                window.location = "/#/" + getHumanURL(userStartPage).toLowerCase();
            }
            this.get('#/maalere', function () {
                hideSingleView();
                $(".view-manage-institution").show();
            });
            this.get('#/plantegning', function () {
                hideSingleView();
                $(".view-manage-sensors").show();
            });
            this.get('#/grafer', function () {
                hideSingleView();
                $(".view-data").show();
            });
            this.get('#/logbog', function () {
                loadMessages();
                hideSingleView();
                $(".view-communication").show();
            });
            this.get('#/climate-control', function () {
              hideSingleView();
              $(".view-climate-control").show();
            });
            this.get('#/andre-brugere', function () {
                hideSingleView();
                $(".view-other-users").show();
            });
            this.get('#/din-profil', function () {
                hideSingleView();
                $(".view-own-user").show();
            });
            this.get('#/indstillinger', function () {
                hideSingleView();
                $(".view-system-settings").show();
            });
        });
        $(function () {
            app.run()
        });
    })(jQuery);
}
//}

function hideSingleView() {
    $(".single-view").hide();
}