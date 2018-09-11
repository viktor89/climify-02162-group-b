<?php

$encrypt = 'hemmelig streng'; 
$decrypt = 'ivae+n8A6EgISKuLuYQMZ24RV/I4vd0S/eyjtU93ux+b6F74=';

define("ENCRYPTION_KEY", "hXZg5!v%fj93@3DQ");

function encrypt($string, $key) {
	$iv = mcrypt_create_iv(
    mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC),
    MCRYPT_DEV_URANDOM
	);
	$encrypted = base64_encode(
	    $iv .
	    mcrypt_encrypt(
	        MCRYPT_RIJNDAEL_128,
	        hash('sha256', $key, true),
	        $string,
	        MCRYPT_MODE_CBC,
	        $iv
	    )
	);
	return $encrypted;
}


function decrypt($string, $key) {
	$data = base64_decode($string);
	$iv = substr($data, 0, mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC));
	$decrypted = rtrim(
	    mcrypt_decrypt(
	        MCRYPT_RIJNDAEL_128,
	        hash('sha256', $key, true),
	        substr($data, mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC)),
	        MCRYPT_MODE_CBC,
	        $iv
	    ),
	    "\0"
	);
	return $decrypted;
}

$encrypted = encrypt($encrypt, ENCRYPTION_KEY);
$decrypted = decrypt($decrypt, ENCRYPTION_KEY);

echo $encrypted;
echo "<br>";
echo $decrypted;

?>