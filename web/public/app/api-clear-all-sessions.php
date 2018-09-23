<?php 

//************************************************
//	Removes all sessions 
//************************************************

session_start(); // Access all saved sessions
session_destroy(); // Clear all sessions

echo '{"status": "signOut"}';

?>