	function serialize (mixed_value) {
  // http://kevin.vanzonneveld.net
  // +   original by: Arpad Ray (mailto:arpad@php.net)
  // +   improved by: Dino
  // +   bugfixed by: Andrej Pavlovic
  // +   bugfixed by: Garagoth
  // +      input by: DtTvB (http://dt.in.th/2008-09-16.string-length-in-bytes.html)
  // +   bugfixed by: Russell Walker (http://www.nbill.co.uk/)
  // +   bugfixed by: Jamie Beck (http://www.terabit.ca/)
  // +      input by: Martin (http://www.erlenwiese.de/)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net/)
  // +   improved by: Le Torbi (http://www.letorbi.de/)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net/)
  // +   bugfixed by: Ben (http://benblume.co.uk/)
  // %          note: We feel the main purpose of this function should be to ease the transport of data between php & js
  // %          note: Aiming for PHP-compatibility, we have to translate objects to arrays
  // *     example 1: serialize(['Kevin', 'van', 'Zonneveld']);
  // *     returns 1: 'a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}'
  // *     example 2: serialize({firstName: 'Kevin', midName: 'van', surName: 'Zonneveld'});
  // *     returns 2: 'a:3:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";s:7:"surName";s:9:"Zonneveld";}'
  var val, key, okey,
    ktype = '', vals = '', count = 0,
    _utf8Size = function (str) {
      var size = 0,
        i = 0,
        l = str.length,
        code = '';
      for (i = 0; i < l; i++) {
        code = str.charCodeAt(i);
        if (code < 0x0080) {
          size += 1;
        }
        else if (code < 0x0800) {
          size += 2;
        }
        else {
          size += 3;
        }
      }
      return size;
    },
    _getType = function (inp) {
      var match, key, cons, types, type = typeof inp;

      if (type === 'object' && !inp) {
        return 'null';
      }
      if (type === 'object') {
        if (!inp.constructor) {
          return 'object';
        }
        cons = inp.constructor.toString();
        match = cons.match(/(\w+)\(/);
        if (match) {
          cons = match[1].toLowerCase();
        }
        types = ['boolean', 'number', 'string', 'array'];
        for (key in types) {
          if (cons == types[key]) {
            type = types[key];
            break;
          }
        }
      }
      return type;
    },
    type = _getType(mixed_value)
  ;

  switch (type) {
    case 'function':
      val = '';
      break;
    case 'boolean':
      val = 'b:' + (mixed_value ? '1' : '0');
      break;
    case 'number':
      val = (Math.round(mixed_value) == mixed_value ? 'i' : 'd') + ':' + mixed_value;
      break;
    case 'string':
      val = 's:' + _utf8Size(mixed_value) + ':"' + mixed_value + '"';
      break;
    case 'array': case 'object':
      val = 'a';
  /*
        if (type === 'object') {
          var objname = mixed_value.constructor.toString().match(/(\w+)\(\)/);
          if (objname == undefined) {
            return;
          }
          objname[1] = this.serialize(objname[1]);
          val = 'O' + objname[1].substring(1, objname[1].length - 1);
        }
        */

      for (key in mixed_value) {
        if (mixed_value.hasOwnProperty(key)) {
          ktype = _getType(mixed_value[key]);
          if (ktype === 'function') {
            continue;
          }

          okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key);
          vals += this.serialize(okey) + this.serialize(mixed_value[key]);
          count++;
        }
      }
      val += ':' + count + ':{' + vals + '}';
      break;
    case 'undefined':
      // Fall-through
    default:
      // if the JS object has a property which contains a null value, the string cannot be unserialized by PHP
      val = 'N';
      break;
  }
  if (type !== 'object' && type !== 'array') {
    val += ';';
  }
  return val;
}



$(function() {
	ajax_path = 'includes/ajax.php';
	xhr=null;
	timer = null;
	

	viewportwidth = 1300;
	viewportheight = 650;
	db_offsetx = 100;
	db_offsety = 100;
	max_num_of_classes = 7;
	training_set_size = 40;
	markov_model_order = 1;
	classes = new Array(1,2,3,4,5,6,7);
	zoom_level = 1;
	cellwidth = 40*zoom_level;
	cellheight = 40*zoom_level;




	function initialize(element){
		var parwidth = element.parents("#range").width();
		var parleft = element.parents("#range").height();
		var posx = parseInt(element.find(".posx").text());
		var posy = parseInt(element.find(".posy").text());
		numofcellsx = parseInt(Math.floor(viewportwidth/(cellwidth+1)));
		numofcellsy = parseInt(Math.floor(viewportheight/(cellheight+1)));
		viewportwidth = (numofcellsx*(cellwidth+1)-1);
		viewportheight = (numofcellsy*(cellheight+1)-1);
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
		fetch(0,numofcellsx,0,numofcellsy);

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

	function addcelltogrid(row,column,left,top,gridel,result,prefetched){
		var colorclass = "color-0";
		if (result){
			colorclass = "color-"+result.label;
		}
		if (prefetched){
			gridel.append("<div class='prefetched "+colorclass+" cell row-"+row+" col-"+column+"' style='left:"+left+"px; height:"+cellheight+"px; width:"+cellwidth+"px; top:"+top+"px'><div style='display:none' class='col'>"+column+"</div><div style='display:none' class='row'>"+row+"</div><div style='display:none' class='color'>"+colorclass+"</div></div>");
		}
		else {
			gridel.append("<div class='"+colorclass+" cell row-"+row+" col-"+column+"' style='left:"+left+"px; height:"+cellheight+"px; width:"+cellwidth+"px; top:"+top+"px'><div style='display:none' class='col'>"+column+"</div><div style='display:none' class='row'>"+row+"</div><div style='display:none' class='color'>"+colorclass+"</div></div>");
		}
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
		//console.log("visible cells:"+$(".visible").length);
	}
	//finds the visible boundaries of the viewport from the  visible cells and returns a tuple f min/max rows/columns
	/*function find_visible_boundaries(){

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
	}*/



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
		fetch(mincol,maxcol,minrow,maxrow);


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

	function find_prediction(){
		for (var i=0; i<max_num_of_classes; i++){
			if($(".prediction").hasClass("color-"+i)){
				return i;
			}
		}
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
	function update_predict_vis(prediction){
		for (var i=0; i<max_num_of_classes; i++){
		    $(".prediction").removeClass("color-"+i);
		}
		if (prediction){
			$(".prediction").addClass("color-"+prediction);
		}
		else {
			$(".prediction").addClass("color-0");
		}
	}


	function predict(mincol,maxcol,minrow,maxrow){
		var sequence = new Array();
		var count = 0;
		var change = $(".interest-window .color.hidden").first().text();

		$.ajax({
		  type: 'POST',
		  url: 'ajax.php',
		  data: {
			   'q':'predict',
			   'training_set_size': training_set_size, 
			   'classes': classes,
			   'change': change,
			   'markov_model_order': markov_model_order
			   },
		  success: function(data){
		  			update_predict_vis($.trim(data));
		  			prediction = find_prediction();
		  			var curleft = mincol*(cellwidth+1);
					var curtop = minrow*(cellheight+1);
					var startleft = curleft;
					var newminrow = 3*minrow - 2*maxrow;
					var newmaxrow = 3*maxrow - 2*minrow;
					var newmincol = 3*mincol - 2*maxcol;
					var newmaxcol = 3*maxcol - 2*mincol;
					minrow = newminrow;
					maxrow = newmaxrow;
					mincol = newmincol;
					maxcol = newmaxcol;
					if (prediction!=0){
	
		  				prefetch(mincol,maxcol,minrow,maxrow,prediction);
		  			}
		  			else {
		  				console.log("don't predict");
		  			}
		  }
		});
	}

	function prefetch(mincol,maxcol,minrow,maxrow,prediction){
		var results  = null;


		$.ajax({
		  		type: 'POST',
		  		url: 'ajax.php',
		  		data: {
					'q':'points_prefetch',
					'xmin':mincol, 
				    'xmax':maxcol, 
				    'ymin':minrow, 
				    "ymax": maxrow,
				    "prediction": prediction,
			    },
		  		success: function(data){
		  			//remove the class visible from any cell and add to the new ones
		  			//$(".visible").removeClass("visible");
		  			var countadded=0;
			   		var results = $.parseJSON(data);
			   		//for (var i=minrow; i<maxrow; i++){
					//	for (var j=mincol; j<maxcol; j++){
							//check if doesn't exist:
					$.each(results,function(){
						var result = $(this);
						
						var col = result[0]["x"];
						var row = result[0]["y"];
						curleft = parseInt(result[0]["x"]-db_offsety)*(cellwidth+1);
						curtop = parseInt(result[0]["y"]-db_offsetx)*(cellheight+1);
						//console.log(result[0]["y"]+","+result[0]["x"]);
						if($(".cell.row-"+result[0]["y"]+".col-"+result[0]["x"]).length!=1){
							addcelltogrid(row,col,curleft,curtop,$("#grid"),result[0],true);
							//console.log("did add");
							//$(".cell.row-"+result[0]["y"]+".col-"+result[0]["x"]).addClass("visible");
							//countadded++;
						}


						//curleft = (curleft + cellwidth+1);
						//}
						//curleft = startleft+;
						//curtop = (curtop + cellheight+1);
					});
					suggest(mincol,maxcol,minrow,maxrow,prediction);
							//denote as visible
							
							
					//}
					//console.log(countadded);
					//tag_of_interest = find_tag_of_interest();
					//update_tag_of_interest_vis(tag_of_interest);
					//predict();
					//prefetch(mincol,maxcol,minrow,maxrow,tag_of_interest);
			}
		}); 
	}

	function suggest(mincol,maxcol,minrow,maxrow,prediction){
		//take all the prefetched with the color of prediction
		if (prediction!=0){
			console.log(prediction);
			var nodes = $(".prefetched.color-"+prediction).not(".visited");
			console.log(nodes.length);
			var x_array = new Array();
			var y_array = new Array();
			nodes.each(function(){
				x_array.push($(this).find(".col").text());
				y_array.push($(this).find(".row").text());
			});
			$.ajax({
		  		type: 'POST',
		  		url: 'ajax.php',
		  		data: {
			   		'q':'suggest',
			   		'x':serialize(x_array),
			   		'y':serialize(y_array),
			   		'k': "8"
			    },
		    	success: function(data){
		    		var centroids = $.parseJSON(data);
		    		var centroid = $(this)[0];
		    		var curleft = mincol*(cellwidth+1);
					var curtop = minrow*(cellheight+1);
					var startleft = curleft;
					$(".centroid").removeClass("centroid");
					$.each(centroids,function(){
						var centroid = $(this)[0];
						
						var col = centroid["x"];
						var row = centroid["y"];
						curleft = parseInt(centroid["x"]-db_offsety)*(cellwidth+1);
						curtop = parseInt(centroid["y"]-db_offsetx)*(cellheight+1);
						//console.log(result[0]["y"]+","+result[0]["x"]);
						//if($(".cell.row-"+centroid["y"]+".col-"+centroid["x"]).length!=1){

						visualize_centroid(row,col,curleft,curtop,$("#grid"));

							//console.log("did add");
							//$(".cell.row-"+result[0]["y"]+".col-"+result[0]["x"]).addClass("visible");
							//countadded++;
						//}
		    		});
		    	}
		    });
		}
	}

	function visualize_centroid(row,column,left,top,gridel){
		var colorclass = "color-0";

		//if (result){
		//	colorclass = "color-"+result.label;
		//}
		//gridel.append("<div class='centroid row-"+row+" col-"+column+"' style='left:"+left+"px; height:"+cellheight+"px; width:"+cellwidth+"px; top:"+top+"px'><div style='display:none' class='col'>"+column+"</div><div style='display:none' class='row'>"+row+"</div><div style='display:none' class='color'>"+colorclass+"</div></div>");
		if ($(".col-"+column+".row-"+row).length==0){
			gridel.append("<div class='cell color-0 row-"+row+" col-"+column+"' style='left:"+left+"px; height:"+cellheight+"px; width:"+cellwidth+"px; top:"+top+"px'><div style='display:none' class='col'>"+column+"</div><div style='display:none' class='row'>"+row+"</div></div>");
		}
		$(".col-"+column+".row-"+row).not(".visited,.visible").addClass("centroid");
		console.log($(".col-"+column+".row-"+row).length+"brika"+column+","+row);
	}

	function fetch(mincol,maxcol,minrow,maxrow){

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
								addcelltogrid(i,j,curleft,curtop,$("#grid"),results[i][j],false);
								//countadded++;
							}
							//denote as visible
							$(".cell.row-"+i+".col-"+j).addClass("visible");
							//denote as visited
							$(".cell.row-"+i+".col-"+j).addClass("visited");
							curleft = (curleft + cellwidth+1);
						}
						curleft = startleft;
						curtop = (curtop + cellheight+1);

					}

					tag_of_interest = find_tag_of_interest();
					//console.log(1);
					update_tag_of_interest_vis(tag_of_interest);
										//console.log(2);
					predict(mincol,maxcol,minrow,maxrow);
										//console.log(3);
					
					//console.log("prediction"+prediction);
					//prefetch(mincol,maxcol,minrow,maxrow,prediction);
					//predict();
					//prediction = find_prediction();
					//console.log(prediction);
					//prefetch(mincol,maxcol,minrow,maxrow,prediction);
			   
				}
		});
	}	

	$(".kill-session").click(function(){
		$.ajax({
		  type: 'POST',
		  url: 'ajax.php',
		  data: {
			   'q':'kill_session',
			   },
		  success: function(data){
		  	$(".interest").remove();
		  	for (var i=0; i<max_num_of_classes; i++){
				$(".prediction").removeClass("color-"+i);
			}	
			$(".prediction").addClass("color-0");

		  }
		});
	});

	

	$(document).ready(function() {
			$("#viewport").draggable(
				{
					drag: function() {
						//recalculate_size($("#grid"));
					},
					stop: function(){
							
						//expand();	
						pan();
						//console.log(tag_of_interest);
						
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


	