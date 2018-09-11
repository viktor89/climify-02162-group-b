<?php 
    require_once "session.php";
	require_once "admin-meta.php";
?>
<!DOCTYPE html>
<html>
<head>
	<title><?php echo $software_Name ?></title>
	<meta charset="UTF-8">
	<meta name="author" content="Magnus Bachalarz">
	<meta name="description" content="Se aktuel status på indendørsklima på folkeskoler i Danmark – Copyright © <?php echo date("Y") . " " . $company_Name; ?>">
  	<meta name="viewport" content="width=device-width, initial-scale=1.0">
  	<link rel="shortcut icon" type="image/png" href="../img/logo/favicon.png?v=<?php echo $system_version ?>"/>
	<link rel="stylesheet" type="text/css" href="css/styles.css?v=<?php echo $system_version ?>">
	<link href="https://fonts.googleapis.com/css?family=Arimo:400,400i,700|Poppins:500|Raleway:500i" rel="stylesheet">
	<link rel="stylesheet" href="../lib/font-awesome/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="../lib/sweetalert/dist/sweetalert.css">
</head>
<body>

    <div class="user-info">
        <input id="session-token" type="hidden" value="<?php echo $adminSessionToken ?>">
    </div>

    <?php 
        if (!$systemAccess) {
            require_once "ink/view-login.php";
        } else {
            require_once "ink/dashboard.php";
        }
    ?>

    <script src='https://www.google.com/recaptcha/api.js'></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<script src="../lib/sweetalert/dist/sweetalert.min.js"></script>
	<script src="js/main.js?v=<?php echo $system_version ?>"></script>

    <script>
        [
            'js/main-al.js?v=<?php echo $system_version ?>'
        ].forEach(function(src) {
            var script = document.createElement('script');
            script.src = src;
            script.async = false;
            document.head.appendChild(script);
        });
    </script>
			
	<?php include_once("../analyticstracking.php") ?>

</body>
</html>