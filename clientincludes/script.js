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
		numofcellsx = parseInt(Math.ceil(viewportwidth/(cellwidth+1)));
		numofcellsy = parseInt(Math.ceil(viewportheight/(cellheight+1)));
		viewportwidth = numofcellsx*(cellwidth+1)-1;
		viewportheight = numofcellsy*(cellheight+1)-1;
		//reset the viewport size after the margins
		$("#range").width(viewportwidth);
		$("#range").height(viewportheight);
			//leftmost pixel
		leftmostpixelleft = $("#viewport").position().left;
		leftmostpixeltop= $("#viewport").position().top;

		viewportleft = $("#viewport").position().left;
		viewporttop = $("#viewport").position().top;
		viewportstartleft = viewportleft; //232
		viewportstarttop = viewporttop; //101

		var curposx = posx;
		var curposy = posy;
		for (var i=0; i<numofcellsy; i++){
			for (var j=0; j<numofcellsx; j++){

				addcelltogrid(i,j,curposx,curposy,$("#grid"));
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

	function addcelltogrid(row,column,left,top,gridel){
		gridel.append("<div class='cell row-"+row+" col-"+column+"' style='left:"+left+"px; top:"+top+"px'><div style='display:none' class='col'>"+column+"</div><div style='display:none' class='row'>"+row+"</div></div>");
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

	function lefttoppos(element){
		var position = new Object();
		var offset = element.offset();
		position.left = offset.left;
		position.top = offset.top;
		return position;
	}


	function denote_visible(elem){
		var top = $("#range").offset().top;
		var left = $("#range").offset().left;
		var bottom = top + $("#range").height();
		var right = left + $("#range").width();
		$(".visible").removeClass("visible");
		elem.find(".cell").each(function(){
			//var centerX = centerpos($(this)).centerX;
			//var centerY = centerpos($(this)).centerY;
			//if (centerY>=top && centerY <= bottom && centerX>=left && centerX<=right){
			var elemY = lefttoppos($(this)).top;
			var elemX = lefttoppos($(this)).left;
			if (elemY>=top && elemY <= bottom && elemX>=left && elemX<=right){
			//if it visually contains it
				$(this).addClass("visible");
			}
		});
		console.log("visible cells:"+$(".visible").length);
	}
	//finds the visible boundaries of the viewport from the  visible cells and returns a tuple f min/max rows/columns
	function find_visible_boundaries(){

		var minrow = 100000000000;
		var maxrow = 0;
		var mincol = 100000000000;
		var maxcol = 0;
		denote_visible($("#grid"));	
		$(".visible").each(function(){
			var row = parseInt($(this).find(".row").text());
			var col = parseInt($(this).find(".col").text());
			if (row<minrow) { minrow = row;}
			if (row>maxrow) { maxrow = row;}
			if (col<mincol) { mincol = col;}
			if (col>maxcol) { maxcol = col;}
		});
		//hack if
		if (minrow == 100000000000){
			minrow = 0;
		}
		if (mincol == 100000000000){
			mincol = 0;
		}
		var tuple = new Object();
		tuple.minrow = minrow;
		tuple.maxrow = maxrow;
		tuple.mincol = mincol;
		tuple.maxcol = maxcol;
		return tuple;
	}


	function pan(){
		var new_viewportleft = $("#viewport").position().left;
		var leftdist = new_viewportleft - viewportleft;
		viewportleft = new_viewportleft;

		var new_viewporttop = $("#viewport").position().top;
		var topdist = new_viewporttop - viewporttop;
		viewporttop = new_viewporttop;


		//console.log(leftmostpixelleft+","+leftmostpixeltop);
		leftmostpixelleft += leftdist;
		leftmostpixeltop += topdist;
		//console.log(leftmostpixelleft+","+leftmostpixeltop);
		//console.log("~~");
		viewportleftdif = viewportstartleft - leftmostpixelleft;
		viewporttopdif = viewportstarttop - leftmostpixeltop;
		//console.log(viewportleftdif+","+viewporttopdif);
		//console.log("~~");

		var mincol = Math.ceil(viewportleftdif / (cellwidth+1));
		var minrow = Math.ceil(viewporttopdif / (cellheight+1));
		var maxcol = mincol + numofcellsx;
		var maxrow = minrow + numofcellsy;
		//console.log(mincol+","+maxcol);
		//console.log(minrow+","+maxrow);

		//+ (viewportleftdif - ?)
		//var curleft =  viewportleftdif + (viewportleftdif % (cellwidth+1));
		//var curtop = viewporttopdif + (viewporttopdif % (cellheight+1));
		var curleft = mincol*(cellwidth+1);
		var curtop = minrow*(cellheight+1);
		//var startleft =(cellwidth+1) - ( (viewportstartleft - viewportleftdif ) % (cellwidth+1))
		//var starttop = (cellwidth+1) - ((viewportstartleft - viewporttopdif) % (cellheight+1));
		
		//var curleft = startleft;
		//var curtop = starttop;
		//console.log($(".cell.row-"+toString(minrow)+".col-"+toString(mincol)).css("left"));
		//console.log(mincol+","+maxcol);
		//console.log(minrow+","+maxcol);
		$(".cell.row-"+minrow+".col-"+mincol).addClass("redd").css("background-color","red");
		//console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"+$(".redd").length);
		



		//var curleft = parseInt($(".cell.row-"+minrow+".col-"+mincol).css("left"),10);
		//var curtop = parseInt($(".cell.row-"+minrow+".col-"+mincol).css("top"),10);
		//console.log($(".cell.row-"+minrow+".col-"+mincol));
		var startleft = curleft;
		//console.log("left"+curleft+",top"+curtop);
		//console.log("count of cells"+ $(".cell").length)
		var countadded=0;
		for (var i=minrow; i<maxrow; i++){
			for (var j=mincol; j<maxcol; j++){
				//check if doesn't exist:
				if($(".cell.row-"+i+".col-"+j).length!=1){
					//console.log("i"+i+",j"+j);
					//console.log("left"+curleft+",top"+curtop);
					if (i<0 || j<0)
						$(".cell.row-"+minrow+".col-"+mincol).css("background-color","green");
					addcelltogrid(i,j,curleft,curtop,$("#grid"));
					countadded++;
					
				}
				curleft = (curleft + cellwidth+1);

				/*if (curleft <= cellwidth){
						curleft = 0;
					}
				if (curleft <= startleft){
					curleft = startleft;
				}*/
			}
			curleft = startleft;
			curtop = (curtop + cellheight+1);
			/*if (curtop <= cellheight){
				curtop = 0;
			}*/
		}
		//console.log("count of cells"+ $(".cell").length)
		//console.log("just added"+ countadded);
	}

	
	/*function expand(){
		var new_viewportpositionleft = $("#viewport").position().left;
		var leftdist = new_viewportpositionleft - viewportpositionleft;
		viewportpositionleft = new_viewportpositionleft;

		var new_viewportpositiontop = $("#viewport").position().top;
		var topdist = new_viewportpositiontop - viewportpositiontop;
		viewportpositiontop = new_viewportpositiontop;
		

		//var rightdist = -leftdist;
		console.log("topdist "+topdist);
		console.log("leftdist "+leftdist);
		//var bottomdist = -topdist;
		var beforeexpansion = find_visible_boundaries();	
		console.log(beforeexpansion);	
		//cells from the right"
		
		
		//xafterexpansion.min = positions.mincol;
		
		//yafterexpansion.min = positions.
		var cellcountneededleft = Math.floor(leftdist/(cellwidth+1));
		var cellcountneededright = -cellcountneededleft;
		var cellcountneededtop = Math.floor(topdist/(cellheight+1));
		var cellcountneededbottom = -cellcountneededtop;
		var afterexpansion = new Object();
		if (cellcountneededleft<=0) {//pan right
			afterexpansion.mincol = beforeexpansion.mincol;
			afterexpansion.maxcol = beforeexpansion.maxcol + cellcountneededright;
			afterexpansion.minrow = beforeexpansion.minrow;
			afterexpansion.maxrow = beforeexpansion.maxrow;
		}
		if (afterexpansion.mincol<0){
			afterexpansion.mincol=0;
		}
		if (afterexpansion.minrow<0){
			afterexpansion.minrow=0;
		}
		
		*/
		/*if (cellcountneededright>0 && cellcountneededleft<0){
			xrange.min = positions.mincol;
			if (cellcountneededright>0) {
				xrange.max = positions.maxcol + cellcountneededright;
			}
		}
		if (cellcountneededbottom>0 && cellcountneededtop<0){
			yrange.min = positions.minrow;
			if (cellcountneededbottom>0){
				yrange.max = positions.maxrow + cellcountneededbottom;
			}
		}
		//if (cellcountneededright>0 && cellcountneededbottom>0){
		//	xrange.min = positions.mincol;
	//		yrange.min = positions.minrow;
	//		xrange.max = positions.maxcol + cellcountneededright;
	//		yrange.max = positions.maxrow + cellcountneededbottom;
	//	}
		if (cellcountneededleft>0 && cellcountneededright<0){
			xrange.max = positions.maxcol;
			if (cellcountneededleft>0){
				xrange.min = positions.mincol - cellcountneededleft;
				if (xrange.min<0){
					xrange.min=0;
				}
			}
		}
		if (cellcountneededtop>0 && cellcountneededbottom<0){
			yrange.max = positions.maxrow;
			if (cellcountneededtop>0){
				yrange.min = positions.minrow - cellcountneededtop;
				if (yrange.min<0){
					yrange.min=0;
				}
			}
		}*/
		//get previous position and add cellwidth + 1
		/*console.log(afterexpansion);
		if (afterexpansion.colmax+1>parseInt($("#grid").find(".maxcolumn").text())){
			$("#grid").find(".maxcolumn").text(afterexpansion.colmax);
		}
		if (afterexpansion.rowmax+1>parseInt($("#grid").find(".maxrow").text())){
			$("#grid").find(".maxrow").text(afterexpansion.rowmax);	
		}
		//recalculate_size($("#grid"));	
		var startycoord = afterexpansion.minrow<0 ? 0 : afterexpansion.minrow;
		var startxcoord = afterexpansion.mincol<0 ? 0 : afterexpansion.mincol;
		var startleft = parseInt($(".cell.row-"+startycoord+".col-"+startxcoord).css("left"),10);
		var starttop = parseInt($(".cell.row-"+startycoord+".col-"+startxcoord).css("top"),10);
		console.log(startleft);
		console.log(starttop);
		var curleft = startleft;
		var curtop = starttop;
		for (var i=afterexpansion.minrow; i<=afterexpansion.maxrow; i++){
			for (var j=afterexpansion.mincol; j<=afterexpansion.maxcol; j++){
				//check if doesn't exist:
				//console.log($(".cell.row-"+i+".col-"+j).length);
				if($(".cell.row-"+i+".col-"+j).length!=1){
					//console.log("i"+i+",j"+j);
					//console.log("left"+curleft+",curtop"+curtop);

					addcelltogrid(i,j,curleft,curtop,$("#grid"));
					
				}
				curleft = (curleft + cellwidth+1) % (viewportwidth+startleft);
				if (curleft <= cellwidth){
						curleft = 0;
					}
				if (curleft <= startleft){
					curleft = startleft;
				}
			}
			curtop = (curtop + cellheight+1) % (viewportheight + starttop);
			if (curtop <= cellheight){
				curtop = 0;
			}
		}





		console.log(cellcountneededright+"cells from the right");
		console.log(cellcountneededleft+"cells from the left");
		console.log(cellcountneededbottom+"cells from the bottom");
		console.log(cellcountneededtop+"cells from the top");
		denote_visible($("#grid"));	
		

	}*/

	$(document).ready(function() {
			$("#viewport").draggable(
				{
					drag: function() {
						//recalculate_size($("#grid"));
					},
					stop: function(){
							
						//expand();	
						pan();
						

					}
				}
			);
			
			console.log("ready");

			initialize($("#grid"));
			//autogrowupgrade();
			//document.execCommand("enableObjectResizing", false, false);

	});
	
});


	