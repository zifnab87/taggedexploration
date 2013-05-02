$(function() {
	ajax_path = 'includes/ajax.php';
	xhr=null;
	timer = null;
	
	cellwidth = 40;
	cellheight = 40;
	viewportwidth = 800;
	viewportheight = 600;
	db_offsetx = 100;
	db_offsety = 100;
	max_num_of_classes = 7;
	training_set_size = 40;
	markov_model_order = 2;
	classes = new Array(1,2,3,4,5,6,7);

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
		fetch(0,numofcellsx,0,numofcellsy,db_offsetx,db_offsety);

		$("#grid").find(".maxcolumn").text(numofcellsx);
		$("#grid").find(".maxrow").text(numofcellsy);

		recalculate_size($("#grid"));
		//denote_visible($("#grid"));

	}

	function recalculate_size(element){
		var maxrow = element.find(".maxrow").text();
		var maxcolumn = element.find(".maxcolumn").text();
		element.height(maxrow*40+(maxrow-1));
		element.width(maxcolumn*40+(maxcolumn-1));


	}

	function addcelltogrid(row,column,left,top,gridel,results){
		var colorclass = "";
		if (results && results[row] && results[row][column]){
			colorclass = "color-"+results[row][column].label;
		}
		gridel.append("<div class='"+colorclass+" cell row-"+row+" col-"+column+"' style='left:"+left+"px; top:"+top+"px'><div style='display:none' class='col'>"+column+"</div><div style='display:none' class='row'>"+row+"</div></div>");
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
		//denote_visible($("#grid"));	
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
		leftmostpixelleft += leftdist;
		leftmostpixeltop += topdist;
		viewportleftdif = viewportstartleft - leftmostpixelleft;
		viewporttopdif = viewportstarttop - leftmostpixeltop;
		var mincol = Math.ceil(viewportleftdif / (cellwidth+1));
		var minrow = Math.ceil(viewporttopdif / (cellheight+1));
		var maxcol = mincol + numofcellsx;
		var maxrow = minrow + numofcellsy;
		fetch(mincol,maxcol,minrow,maxrow,db_offsetx,db_offsety);
	}

	function find_tag_of_interest(){
		var visibleElems = $(".visible");
		//count the majority of tag type in the visible area
		var array = new Array();
		var maxcount = 0;
		var maxtag = null;
		for (var i=1; i<=max_num_of_classes; i++){
			var count = $("#grid").find(".visible.color-"+i).length;
			array[i] = count;
			if (count>maxcount) {
				maxcount = count;
				maxtag = i;
			}
		}
		return maxtag;
	}

	function update_tag_of_interest_vis(tag){
		for (var i=0; i<max_num_of_classes; i++){
			$(".tag-interest").removeClass("color-"+i);
		}
		$(".tag-interest").addClass("color-"+tag);
		$(".interest-window").prepend("<div class='interest color-"+tag+"'><div class='hidden color'>"+tag+"</div></div>");
		if ($(".interest-window").children().length>training_set_size){
			$(".interest-window").children().last().remove();
		}
	}

	function predict(){
		var sequence = new Array();
		var count = 0;
		$(".interest-window .color.hidden").each(function(){
			sequence.push($(this).text());
		});
		console.log(sequence);
		$.ajax({
		  type: 'POST',
		  url: 'ajax.php',
		  data: {
			   'q':'predict',
			   'markov_model_order':markov_model_order, 
			   'classes': classes,
			   'sequence': sequence
			   },
		  success: function(data){

		  }
		});
	}

	function fetch(mincol,maxcol,minrow,maxrow,db_offsetx,db_offsety){

		var results  = null;
		var curleft = mincol*(cellwidth+1);
		var curtop = minrow*(cellheight+1);
		var startleft = curleft;
		minrow += db_offsety;
		maxrow += db_offsety;
		mincol += db_offsetx;
		maxcol += db_offsetx;
		$.ajax({
		  type: 'POST',
		  url: 'ajax.php',
		  data: {
			   'q':'points_fetch',
			   'xmin':mincol, 
			   'xmax':maxcol, 
			   'ymin':minrow, 
			   "ymax": maxrow
			   },
		  success: function(data){
		  			//remove the class visible from any cell and add to the new ones
		  			$(".visible").removeClass("visible");
			   		var results = $.parseJSON(data);
			   		for (var i=minrow; i<maxrow; i++){
						for (var j=mincol; j<maxcol; j++){
							//check if doesn't exist:
							if($(".cell.row-"+i+".col-"+j).length!=1){
								addcelltogrid(i,j,curleft,curtop,$("#grid"),results);
								//countadded++;
							}
							//denote as visible
							$(".cell.row-"+i+".col-"+j).addClass("visible");
							curleft = (curleft + cellwidth+1);
						}
						curleft = startleft;
						curtop = (curtop + cellheight+1);

					}

					tag_of_interest = find_tag_of_interest();
					update_tag_of_interest_vis(tag_of_interest);
					predict();
			   },
		});
	}	


	

	$(document).ready(function() {
			$("#viewport").draggable(
				{
					drag: function() {
						//recalculate_size($("#grid"));
					},
					stop: function(){
							
						//expand();	
						pan();
						//console.log("async after pan"+tag_of_interest);

					}
				}
			);
			
			console.log("ready");

			initialize($("#grid"));
			//autogrowupgrade();
			//document.execCommand("enableObjectResizing", false, false);

	});
	
});


	