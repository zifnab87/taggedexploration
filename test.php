<?php
//require_once("inc.php");

$var = 3;
echo $var."<br/>";

echo "test".$var;

$dbobj = " adasdasds ";


$arr = array();
$arr[] = "a"; // input in array
$arr[] = "b";
var_dump($arr);
newline();
for ($i=0; $i<sizeof($arr); $i++){
	echo $arr[$i];
}
newline();

foreach ($arr as $element){
	echo $element;
}

newline();

echo sizeof($arr); //size of array
newline();

$assoc = array();
$assoc["first"] = 1;
$assoc["second"] = 2;

foreach ($assoc as $key => $value){
	echo $key . "=>". $value;
}
newline();

var_dump($assoc);


function newline() {
 echo "<br>	~~~~~~~~~~~~~~~~~~~<br/>";
}

// array_unique  ==> makes an array as a set / no dublicates
//ex. $set = array_unique($array);

function new_func(){
	global $dbobj;
	echo "~~~".$dbobj."~~";
}

new_func();

echo implode(",",$arr);  // array (a b) + glue (,) ====> a,b

$new_arr = explode(",","a,b,c,d"); // returns an array (a,b,c,d)

var_dump($new_arr);


?>