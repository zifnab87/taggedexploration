$(function() {
	ajax_path = 'includes/ajax.php';
	xhr=null;
	timer = null;
	
	cellwidth = 40;
	cellheight = 40;
	viewportwidth = 800;
	viewportheight = 600;
	//var doneTypingInterval = 500;
	
	

	/*$(".displaynewobjform").click( 
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
	);*/




	function initialize(element){
		var parwidth = element.parents("#range").width();
		var parleft = element.parents("#range").height();
		var posx = parseInt(element.find(".posx").text());
		var posy = parseInt(element.find(".posy").text());
		var numofcellsx = parseInt(Math.ceil(viewportwidth/(cellwidth+1)));
		var numofcellsy = parseInt(Math.ceil(viewportheight/(cellheight+1)));
		viewportwidth = numofcellsx*(cellwidth+1)-1;
		viewportheight = numofcellsy*(cellheight+1)-1;
		//reset the viewport size after the margins
		$("#range").width(viewportwidth);
		$("#range").height(viewportheight);

		var curposx = posx;
		var curposy = posy;
		for (var i=0; i<numofcellsy; i++){
			for (var j=0; j<numofcellsx; j++){
				addcelltogrid(posx+i,posy+j,curposx,curposy,$("#grid"));
				curposx = (curposx + cellwidth+1) % viewportwidth;
				if (curposx<cellwidth){
					curposx = 0;
				}
			
			}
			curposy = (curposy + cellheight+1) % viewportheight;
			if (curposy<cellheight){
				curposy = 0;
			}
		}
		$("#grid").find(".maxcolumn").text(numofcellsx);
		$("#grid").find(".maxrow").text(numofcellsy);

		recalculate_size($("#grid"));

	}

	function recalculate_size(element){
		var maxrow = element.find(".maxrow").text();
		var maxcolumn = element.find(".maxcolumn").text();
		element.height(maxrow*40+(maxrow-1));
		element.width(maxcolumn*40+(maxcolumn-1));


	}

	function addcelltogrid(row,column,posx,posy,gridel){
		gridel.append("<div class='cell row-"+row+" col-"+column+"' style='left:"+posx+"px; top:"+posy+"px'></div>");
	}
	
	$(document).ready(function() {
			$("#viewport").draggable(
				{
					stop: function(){
							leftdist = $("#viewport").offset().left-$("#range").offset().left;
							
							topdist = $("#viewport").offset().top-$("#range").offset().top;
							rightdist= viewportwidth-leftdist - $("#viewport").width();
							bottomdist = viewportheight-topdist - $("#viewport").height();
							console.log(rightdist);
					}
				}
			);
			recalculate_size($("#grid"));
			console.log("ready");
			initialize($("#grid"));
			//autogrowupgrade();
			//document.execCommand("enableObjectResizing", false, false);

	});
	
});


