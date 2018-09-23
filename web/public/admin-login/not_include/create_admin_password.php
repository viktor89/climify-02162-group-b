<?php 

	require_once "../admin-meta.php";

	$pass = "hej";

	$pepper = HASH_PEPPER;
	
	$hash = password_hash($pass.$pepper, PASSWORD_DEFAULT, ["cost"=>10]);
	$vali = password_verify ( $pass.$pepper , $hash );

	echo $pass; ?> <br> <?php
	echo $hash; ?> <br> <?php
	echo $vali; ?> <br> <?php

?>