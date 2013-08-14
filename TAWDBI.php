<?php

class TAWDBI {
	private static $instance;
	private $link;
	
	protected function __construct() {
	}
	
	public static function singleton() {
        if (!isset(self::$instance)) {
            $c = __CLASS__;
            self::$instance = new $c;
        }

        return self::$instance;
    }
    
    public function __clone() {
        trigger_error('Clone is not allowed.', E_USER_ERROR);
    }
    
    public function connect($host, $user, $pass, $persistant = true) {
    	if ($persistant) {
    		$this->link = mssql_pconnect($host, $user, $pass);
    	} else {
    		$this->link = mssql_connect($host, $user, $pass);
    	}
    	
    	if (!$this->link) {
    		throw new Exception("Couldn't connect to database");
    	}
    }
    
	public function sp($db, $procedure, $vars = array()) {
		$query = "EXEC [$db].[dbo].[$procedure] ";
		
		foreach ($vars as $var=>$val) {
			$query .= "@$var='" . str_replace("'", "''", stripslashes($val)) . "',";
		}

		$query = substr($query, 0, -1);
		
		return $this->query($query);
	}
	
	public function query($sql) {
		$result = mssql_query($sql);
		
		if ($result == false) {
			throw new Exception("Database query error :( attempted query: \"$sql\"");
		}
		
		if ($result !== TRUE && $result !== FALSE) {
			$rvals = array();
			while (($row = mssql_fetch_assoc($result)) != false)
				$rvals[] = $row;

			return $rvals;
		} else {
			return $result;
		}
	}
	
	public function get_time_format() {
		return "m/d/Y h:i:s A";
	}
}

?>