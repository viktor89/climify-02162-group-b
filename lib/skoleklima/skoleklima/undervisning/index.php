<?php 
    require_once "../meta.php";
    if(!$currentUserID){
        header('Location: ../');
    }
?>
<!DOCTYPE html>
<html>
<head>
    <title>Undervisningsplatform</title>
	<meta charset="UTF-8">
	<meta name="author" content="Magnus Bachalarz">
	<meta name="description" content="Se aktuel status på indendørsklima på folkeskoler i Danmark – Copyright © <?php echo date("Y") . " " . $company_Name; ?>">
  	<meta name="viewport" content="width=device-width, initial-scale=1.0">
  	<link rel="shortcut icon" type="image/png" href="img/logo/favicon.png?v=<?php echo $system_version ?>"/>
	<link rel="stylesheet" type="text/css" href="css/styles.css?v=<?php echo $system_version ?>">
	<link href="https://fonts.googleapis.com/css?family=Arimo:400,400i,700|Poppins:500|Raleway:500i" rel="stylesheet">
	<link rel="stylesheet" href="../lib/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="../lib/sweetalert/dist/sweetalert.css">
    
    <!-- Include stylesheet -->
    <link href="lib/quill.1.3.4/css/snow.css" rel="stylesheet">

</head>
<body>

	<div id="current-user-info">
		<input type="hidden" id="txt-software-name" value="<?php echo $software_Name ?>" readonly>
		<input type="hidden" id="txt-current-user-ID" value="<?php echo $currentUserID ?>" readonly>
		<input type="hidden" id="txt-current-user-name" value="<?php echo $currentUserName ?>" readonly>
		<input type="hidden" id="txt-current-user-role" value="<?php echo $currentUserRole ?>" readonly>
		<input type="hidden" id="txt-current-user-first-name" value="<?php echo $currentUserFirstName ?>" readonly>
		<input type="hidden" id="txt-current-user-last-name" value="<?php echo $currentUserLastName ?>" readonly>
		<input type="hidden" id="txt-current-user-email" value="<?php echo $currentUserEmail ?>" readonly>
		<input type="hidden" id="txt-current-user-school" value="<?php echo $currentUserSchoolAllowed ?>" readonly>
		<input type="hidden" id="7wpk6dQLcKKTPy4" value="<?php echo $api_key ?>" readonly>
	</div>

    <?php if ( $currentUserID ) { ?>
		<div class="viewport"> 
			<div class="dashboard"> <?php
			require_once "ink/header.php";
			require_once "ink/views/view-dashboard.php";
		?> 	</div> 
		</div> <?php
	} ?>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>
<script src="lib/quill.1.3.4/js/quill.js"></script>
<script src="../lib/sweetalert/dist/sweetalert.min.js"></script>

    <?php
		if ( $currentUserID ) { ?>

			<script>
				[
					'js/main.js?v=<?php echo $system_version ?>',
                    'js/nav.js?v=<?php echo $system_version ?>',
                    'js/quill.js?v=<?php echo $system_version ?>'
	            ].forEach(function(src) {
	                var script = document.createElement('script');
	                script.src = src;
	                script.async = false;
	                document.head.appendChild(script);
	            });
        	</script>
			
		<?php }
	?>

	<?php include_once("../analyticstracking.php") ?>

</body>
</html>