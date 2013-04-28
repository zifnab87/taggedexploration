<?php 
//require_once("config.php");
 $DATABASEUSER = 'root';
 $DATABASEPASSWORD = 'venusaur`3050112'; 
 $DATABASELOCATION = 'localhost';
 $DATABASENAME = 'taggex';
 $SHOWMYSQLERRORS = 1;
 $LOGMYSQLERRORS = 0;
 $SERVERPATH = "\\"; 
 $LOGPATH = "logs"; 


 
class db
{
	private $dbuser;
	private $dbpassword;
   	private $dblocation;
	private $dbname;
	private static $singleton;
	private function __construct($dblocation,$dbuser,$dbpassword,$dbname)
	{
			$this->dbuser=$dbuser;
			$this->dbpassword=$dbpassword;
			$this->dblocation=$dblocation;
			$this->dbname=$dbname;
			$this->connect();
   	}
	
	public static function getsingleton($dblocation,$dbuser,$dbpassword,$dbname)
    {
        if (!self::$singleton)
        {
            self::$singleton = new db($dblocation,$dbuser,$dbpassword,$dbname);
        }

        return self::$singleton;
    } 
	

   	function connect()
   	{
   		if (!mysql_connect($this->dblocation,$this->dbuser,$this->dbpassword))
   		{
			$this->writeSQLError("Could not connect to database." . mysql_error() );
			die();
   		}

   		if(!mysql_select_db($this->dbname))
   		{
   			$this->writeSQLError("Could not select database." . mysql_error() );
   			die();
   		}
   		mysql_query('set character set UTF8');
		mysql_query("SET NAMES 'utf8'");
   	}

   	function writeSQLError($error)
   	{
   		global $SHOWMYSQLERRORS,$LOGMYSQLERRORS,$SERVERPATH,$LOGPATH;
   		if ($SHOWMYSQLERRORS)
	   	{
	   		print($error);
	   	}
	   	else
	   	{
	   		print("Database error .Contact the administrator.");
	   	}
	   	if($LOGMYSQLERRORS)
	   	{
			//$file = fopen($SERVERPATH . $LOGPATH,"a");
			fwrite($file,$error . " \n \n ");
			fclose($file);
   		}
   	}
   	function sqlEsc($query)
   	{
   		return mysql_real_escape_string($query);
   	}

   	function query($query,$istransaction)
   	{
               
                if(!$istransaction){
			$res = @mysql_query($query);
		}
		else {
			begintransaction();
			$res = @mysql_query($query);
			endtransaction();
		}
   	 	if(!$res)
   	 	{
   	 		$this->writeSQLError("Could not query database.Query:" . $query . " Error:" . mysql_error() );
                        die();
                }
   	 	return $res;
   	}
	
	function begintransaction(){
		@mysql_query("START TRANSACTION;");
	}
	
	function endtransaction(){
		@mysql_query("COMMIT;");
	}

	function setforeignchecks($int){ //0 no //1 yes
		@mysql_query("SET foreign_key_checks=".$int);
	}
	
	function getone($q) {
		$res=$this->query($q,0);
		$row=mysql_fetch_array($res);
	return $row;
	}

	function getmany($q) {
		$res=$this->query($q,0);
		while($row=mysql_fetch_array($res)){
				$results[]=$res;
			}
		return $results;
	}
}


function createmysql() {
		global $DATABASEUSER, $DATABASEPASSWORD, $DATABASELOCATION, $DATABASENAME;
		$db = db::getsingleton( $DATABASELOCATION, $DATABASEUSER, $DATABASEPASSWORD,  $DATABASENAME);
		return $db;
}




?>