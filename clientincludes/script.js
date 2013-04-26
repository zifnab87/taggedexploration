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
		denote_visible($("#grid"));

	}

	function recalculate_size(element){
		var maxrow = element.find(".maxrow").text();
		var maxcolumn = element.find(".maxcolumn").text();
		element.height(maxrow*40+(maxrow-1));
		element.width(maxcolumn*40+(maxcolumn-1));


	}

	function addcelltogrid(row,column,posx,posy,gridel){
		gridel.append("<div class='cell row-"+row+" col-"+column+"' style='left:"+posx+"px; top:"+posy+"px'><div style='display:none' class='col'>"+column+"</div><div style='display:none' class='row'>"+row+"</div></div>");
	}


	function centerpos(element){
		var offset = element.offset();
		var width = element.width();
		var height = element.height();
		var position = new Object();
		position.centerX = offset.left + width / 2;
		position.centerY = offset.top + height / 2;
		return position;
	}


	function denote_visible(elem){
		var top = $("#range").offset().top;
		var left = $("#range").offset().left;
		var bottom = top + $("#range").height();
		var right = left + $("#range").width();
		$(".visible").toggleClass("visible");
		elem.find(".cell").each(function(){
			var centerX = centerpos($(this)).centerX;
			var centerY = centerpos($(this)).centerY;
			if (centerY>=top && centerY <= bottom && centerX>=left && centerX<=right){
			//if it visually contains it
				$(this).toggleClass("visible");
			}
		});
	}
	//finds the visible boundaries of the viewport from the  visible cells and returns a tuple f min/max rows/columns
	function find_visible_boundaries(){

		var minrow = 100000000000;
		var maxrow = 0;
		var mincol = 100000000000;
		var maxcol = 0;
		$(".visible").each(function(){
			var row = parseInt($(this).find(".row").text());
			var col = parseInt($(this).find(".col").text());
			if (row<minrow) { minrow = row;}
			if (row>maxrow) { maxrow = row;}
			if (col<mincol) { mincol = col;}
			if (col>maxcol) { maxcol = col;}
		});
		var tuple = new Object();
		tuple.minrow = minrow;
		tuple.maxrow = maxrow;
		tuple.mincol = mincol;
		tuple.maxcol = maxcol;
		return tuple;
	}

	
	function expand(){
		var leftdist = $("#viewport").offset().left-$("#range").offset().left;					
		var topdist = $("#viewport").offset().top-$("#range").offset().top;
		var rightdist= viewportwidth-leftdist - $("#viewport").width();
		var bottomdist = viewportheight-topdist - $("#viewport").height();
		console.log(Math.ceil(rightdist/(cellwidth+1))+"cells from the right");
		console.log(Math.ceil(leftdist/(cellwidth+1))+"cells from the left");
		console.log(Math.ceil(bottomdist/(cellheight+1))+"cells from the bottom");
		console.log(Math.ceil(topdist/(cellheight+1))+"cells from the top");
		

	}

	$(document).ready(function() {
			$("#viewport").draggable(
				{
					stop: function(){
							
						expand();	
						denote_visible($("#grid"));	
						var positions = find_visible_boundaries();	
						console.log(positions);	
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


	