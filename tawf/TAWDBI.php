<?php

class TAWDBI extends TAWExtendable {
	private static $instance;
	private $link;
	
	protected function __construct() {
		parent::__construct();
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
    	
    	// Run query to configure view stuff
    	$this->query("SET ANSI_NULLS ON
                    SET ANSI_PADDING ON
                    SET ANSI_WARNINGS ON
                    SET ARITHABORT ON
                    SET CONCAT_NULL_YIELDS_NULL ON
                    SET QUOTED_IDENTIFIER ON
                    SET NUMERIC_ROUNDABORT OFF");
    }
    
	public function sp($db, $procedure, $vars = array()) {
		$query = "EXEC [$db].[dbo].[$procedure] ";
		
		foreach ($vars as $var=>$val) {
			$query .= "@$var='" . str_replace("'", "''", stripslashes($val)) . "',";
		}

		$query = substr($query, 0, -1);
		
		return $this->query($query);
	}

	public function sp2($db, $procedure, $vars = array()) {
		$query = "EXEC [$db].[dbo].[$procedure] ";

		foreach ($vars as $var=>$val) {
                        if (is_null($val)) {
                            $query .= "@$var=NULL,";
                        } else if (is_string($val)) {
                            $query .= "@$var='" . str_replace("'", "''", stripslashes($val)) . "',";
                        } else {
                            $query .= "@$var=" . str_replace("'", "''", stripslashes($val)) . ",";
                        }
		}
              //  die($query);
                
		$query = substr($query, 0, -1);

		return $this->query($query);
	}

        public function sanitizeInt($value) {
            if ($value == 'null')
                return null;
            return $value;
        }

        public function sanitizeFloat($value) {
            if ($value == 'null')
                return null;
            return $value;
        }

	public function query($sql) {
		$result = mssql_query($sql);
		
		if ($result == false) {
			throw new Exception("Database query error :( attempted query: \"$sql\"");
		}
		
		if ($result !== TRUE && $result !== FALSE) {
			$rvals = array();
			while (($row = mssql_fetch_assoc($result)) != false) {
				$rvals[] = $row;
			}
			mssql_free_result($result);
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