<html>
<head>
	<script type="text/javascript" src="clientincludes/jquery-1.7.1.min.js"></script>
	<script type="text/javascript" src="clientincludes/jquery-ui-1.8.10.custom.min.js"></script>
	<script type="text/javascript" src="clientincludes/script.js"></script>
		<link type="text/css" rel="stylesheet" href="clientincludes/style.css"/>
</head>
<body>
<div style="float:right; min-height: 400px; width: 165px">
	Current Interest: <div class="tag-interest"></div>
    Predict Interest: <div class="prediction"></div>
    On-line Training set:<div class="interest-window"></div>
  

</div>


<button class="kill-session">Kill Session!</button>
<div id="range">
      <div class="arrow-container">
        <div class="arrow-0"></div>
        <div class="arrow-1"></div>
        <div class="arrow-2"></div>
        <div class="arrow-3"></div>
        <!--<div class="arrow-4"></div>
        <div class="arrow-5"></div>
        <div class="arrow-6"></div>
        <div class="arrow-7"></div>-->
    </div>
    <!--<img src="map.gif" id="map" />-->
    <div id="viewport">

    	<div id="grid">
    		<div style="display:none" class="posx">0</div>
    		<div style="display:none" class="posy">0</div>
    	   	<div style="display:none" class="maxcolumn">0</div>
        	<div style="display:none" class="maxrow">0</div>
    	</div>
    <!--<table>
    	<tr class="row-1"><td>10</td><td>20</td></tr>
    	<tr class="row-2"><td width="40">10</td><td>20</td></tr>
    	
    </table>-->

    </div>
</div>

</body>
</html>