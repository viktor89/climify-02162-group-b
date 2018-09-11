<!-- Dashboard -->
<div class="view view-dashboard">
		<?php 
			require_once "view-overview.php";
			require_once "view-subject-view.php";
			if ($currentUserRole == 1 || $currentUserRole == 2 || $currentUserRole == 3) {
				require_once "view-subject-create.php";
			}
		?>
		<div class="go-to-top">
			<a href="<?php echo $company_Website ?>#top-header" target="_self"><i class="ico-go-to-top fa fa-arrow-up link" aria-hidden="true"></i></a>
		</div>
</div>