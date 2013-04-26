$(function() {
	ajax_path = 'includes/ajax.php';
	xhr=null;
	timer = null;
	var doneTypingInterval = 500;
	
	

	$(".displaynewobjform").click( 
		function() {
			$.post(ajax_path, {'q':'ajax_display_new_obj_form'}, 
				function(data){ 
					//$('#formcontainer form.objectform').remove();
				//if ($("#formcontainer form").length==0) {
					$('#formcontainer').prepend(data);
				//}
				}
			);  
		}
	);

	
	$(document).ready(function() {
			console.log("ver29");
			//autogrowupgrade();
			//document.execCommand("enableObjectResizing", false, false);

	});
	
});


