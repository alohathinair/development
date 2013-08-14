<?php

define("ACCESS_LEVEL_OPERATOR", 1);
define("ACCESS_LEVEL_DISPATCHER", 2);
define("ACCESS_LEVEL_MANAGER", 5);
define("ACCESS_LEVEL_ADMINISTRATOR", 10);

class TAWUser {

    private static $instance;
    private $db;
    private $companyID;
    public $accessLevel;
    private $offsetFromCST;
    private $manageGroupID;

    private function __construct() {
        
    }

    /**
     *  @return TAWUser the user
     */
    public static function singleton() {
        if (!isset(self::$instance)) {
            if (isset($_SESSION["tawuser"])) {
                self::$instance = $_SESSION["tawuser"];
            } else {
                $c = __CLASS__;
                self::$instance = new $c;
            }
        }

        return self::$instance;
    }

    public function __clone() {
        // trigger_error('Clone is not allowed.', E_USER_ERROR);
    }

    public function login($email = null, $password = null, $remember_me = false, $site = null) {

        
        // Check if we have a user in our session already. If so we don't need to process a login.
        if (isset($_SESSION["tawuser"])) {
            return true;
        } else {

            // Nope. Need to do a login. In order to do this we need to make sure they provided creds or cookies
            if ((!is_null($email) && !is_null($password)) || (isset($_COOKIE["email"]) && isset($_COOKIE["password"]))) {
                // Here we decide if we want to use cookies or input data.
                if (is_null($email)) {
                    // Since our postdata is empty we want to use cookies. If it wasn't, we wouldn't.
                    $email = $_COOKIE["email"];
                    $password = $_COOKIE["password"];
                }


                // We need to check with the DB now to see if this is valid.
                $db = TAWDBI::singleton();

                $company_data = $db->sp("vision2020", "CheckCompanyLogin", array(
                            "CompanyUserEmail" => $email,
                            "CompanyUserPassword" => $password
                        ));

                if (isset($company_data[0]["CompanyUserID"])) {

                    $this->id = $company_data[0]["CompanyUserID"];

                    $user_data = $db->sp("vision2020", "GetCompanyUser", array(
                                "CompanyUserID" => $this->id
                            ));

                    $this->load_user_data($user_data[0]);

                    if ($this->accessLevel == ACCESS_LEVEL_OPERATOR)
                        return false;

                    $_SESSION["tawuser"] = $this;
                    if ($site) {
                        $_SESSION["tawsite"] = $site;
                    }
                    
                    // Set cookies
                    if ($remember_me) {
                        setcookie("email", $email, time() + (86400 * 14));
                        setcookie("password", $password, time() + (86400 * 14));
                    }
                    return true;
                }
            }
        }

        return false;
    }

    public function load_user_data($d) {
        $this->companyID = $d["CompanyID"];
        $this->interfaceTypeID = $d["CompanyInterfaceTypeID"];
        $this->name = $d["CompanyUserName"];
        $this->email = $d["CompanyUserEmail"];
        $this->password = $d["CompanyUserPassword"];
        $this->accessLevel = $d["CompanyUserAccessLevel"];
        $this->manageGroupID = $d["CompanyManageGroupID"];
        //$this->offsetFromCST = $d["CompanyUserTimezone"] + 6;
		$this->offsetFromCST = $d["TimezoneID"] + 6;

        /* $lt = localtime();

          if ($lt[8] == 0)
          $this->offsetFromCST--;
         */
    }
    
    public function getUserCurrentTime(){
    	$db = TAWDBI::singleton();
    	
    	$date= $db->query("SELECT vision2020.dbo.GetUserCurrentTime($this->id) date");
    	
    	return strtotime($date ['0']['date']);
    }

	public function getUserCurrentDate(){
    	$db = TAWDBI::singleton();
    	
    	$date= $db->query("SELECT vision2020.dbo.GetUserCurrentTime($this->id) date");
    	
    	return date('m/d/Y',strtotime($date ['0']['date']));
    }
    

    // Returns all the users the person has access to view
    public function get_allowed_view_list() {
        $db = TAWDBI::singleton();

        // Grab all users within the CompanyManageGroupID
        $users_result = $db->query("SELECT [CompanyUserID] FROM vision2020.dbo.CompanyUser WHERE [CompanyGroupID]='" . $this->manageGroupID . "'");
        $users = array();

        foreach ($users_result as $u) {
            $users[] = $u["CompanyUserID"];
        }

        //die("q: " . "SELECT [CompanyUserID] FROM vision2020.dbo.CompanyUser WHERE [CompanyGroupID]='" . $this->manageGroupID . "';" . print_r($users,true));
        return $users;
    }

    // This method determines if the account can only view certain devices
    public function is_limited() {
        if ($this->accessLevel == 10)
            return false;

        if ($this->manageGroupID < 1)
            return false;

        return true;
    }

    public function is_authenticated() {
        if (isset($_SESSION["tawuser"])) {
            return true;
        } else {
            return false;
        }
    }

    public function is_dispatcher() {
        return ($this->accessLevel == 2) ? true : false;
    }

    public function is_not_administrator() {
        return ($this->accessLevel != 10) ? true : false;
    }

    public function get_company_id() {
        return $this->companyID;
    }

    function get_id() {
        return $this->id;
    }

    public function get_time_adjustment() {
        return $this->offsetFromCST;
    }

    public function get_data() {
        var_dump($this);
    }

    public function get_timezone() {
		$db = TAWDBI::singleton();
		
       $abbr = $db->query("SELECT vision2020.dbo.GetUserTimezoneAbbreviation($this->id) abbreviation");
       //print_r($myresult);       
       echo $abbr ['0']['abbreviation'];
       /*
        if ($this->offsetFromCST == 1) {
            return "EST";
        } else if ($this->offsetFromCST == -1) {
            return "MST";
        } else if ($this->offsetFromCST == -2) {
            return "PST";
        } else {
            return "CST";
        }*/
    }

      public function get_current_time() {
        $db = TAWDBI::singleton();
        $current_time= $db->sp("vision2020", "GetUserCurrentTime", array("UserID" => $this->id));
        return $current_time;


      }
}

?>