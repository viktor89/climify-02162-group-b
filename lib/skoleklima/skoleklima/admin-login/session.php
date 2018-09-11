<?php
    session_start();
     
    if(isset($_SESSION['admin-token']) && !empty($_SESSION['admin-token'])) {
    } else {
        $_SESSION['admin-token'] = uniqid();
    }
    $adminSessionToken = $_SESSION['admin-token'];
    $sessionTime = $_SESSION['session-time-admin'];
   
    if ($sessionTime != "") {
        if ( (time()-$sessionTime) > 3600 ) { // 1 hour = 3600 seckonds
            session_destroy();
        };
    }
?>