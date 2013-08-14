<?php
require_once(TAWF_ROOT . "/TAWExtendable.php");
require_once(TAWF_ROOT . "/lib/spyc.php");
require_once(TAWF_ROOT . "/TAWDBI.php");
require_once(TAWF_ROOT . "/TAWUser.php");
require_once(TAWF_ROOT . "/TAWComponent.php");

session_start();

class TAWFramework extends TAWExtendable {
	protected $config; // Configuration variables, such as database
	public $data; // $_REQUEST data
	protected $components; // The list of components available along with their class location
	protected $componentWebDirectories; // List of web directories for components
	protected $using; // The list of components being used
	protected $provided; // Real-time list of what components / features are currently provided to the framework
	protected $component_options;
	protected $lang;
	
	public function __construct() {
		parent::__construct();
		$this->provided = array();
		$this->component_options = array();
		$this->lang = array();
		
		//try {
			// Define our host
			define("WWW_HOST", $_SERVER["SERVER_NAME"]);
			
			// Load the applications configuration file
			$this->load_config();
		
			// Connect to the database. If this fails load the server error layout.
			$this->dbconnect();
			
			// Load the components that the framework can use
			$this->load_components_config();
		//} catch (Exception $e) {
			
		//}
		
		$this->load_data();
	
	}
	
	// Loads the configuration into the framework.
	private function load_config() {
		// Ensure our app_root exists so we can load the configuration file.
		if (!defined("APP_ROOT")) {
			throw new Exception("The APP_ROOT is not defined.");
		}
		
		// Load the yaml
		$this->config = Spyc::YAMLLoad(APP_ROOT . "/config.yml");
		
		if (!count($this->config)) {
			throw new Exception("The configuration file has errors.");
		}
		
		
		define("TAWF_HOST", $this->config["tawf_host"]);
		
		if (isset($this->config["default_lang"])) {
			define("CURRENT_LANG", $this->config["default_lang"]);
		} else {
			define("CURRENT_LANG", "en_US");
		}
		
	}
	
	private function load_components_config() {
		$this->components = array();
		// First load the components provided by the framework
		$componentData = Spyc::YAMLLoad(TAWF_ROOT . "/components.yml");
		
		$this->componentWebDirectories = array();
		
		foreach ($componentData["components"] as $component_name=>$component_location) {
			$this->components[$component_name] = TAWF_ROOT . "/components/" . $component_location;
			$this->componentWebDirectories[$component_name] = "http://" . TAWF_HOST . "/components/" . $component_location;
		}
		
		// Then load the components provided by the individual application. It's allowed to overwrite component locations provided
		// by the framework
		if (isset($this->config["components"])) {
			foreach ($this->config["components"] as $component_name=>$component_location) {
				$this->components[$component_name] = APP_ROOT . "/components/" . $component_location;
				$this->componentWebDirectories[$component_name] = "http://" . TAWF_HOST . "/components/" . $component_location;
			}
		}
		
		// Load the individual applications component configuration
		if (isset($this->config["component_options"])) {
			foreach ($this->config["component_options"] as $component_name=>$option_hash) {
				foreach ($option_hash as $option=>$value) {
					$this->component_option($component_name, $option, $value);
				}
			}
		}

	}
	
	private function dbconnect() {
		$db = TAWDBI::singleton();
		$port = "1433";
		if (isset($this->config["db"]["port"])) {
			$port = $this->config["db"]["port"];
		}
		
		$db->connect($this->config["db"]["host"] . ":" . $port, $this->config["db"]["username"], $this->config["db"]["password"], $this->config["db"]["persistant"]);
	}
	
	
	private function load_data() {
		$this->data = $_REQUEST;
	}
	
	public function load_lang($file) {
		$newLangData = Spyc::YAMLLoad($file);
		if (count($newLangData)) {
			foreach ($newLangData as $lang=>$data) {
				foreach ($data as $id=>$text) {
					$this->lang[$lang][$id] = $text;
				}
			}
		} else {
			throw new Exception("No language data found");
		}
		
	}
	
	public function get_text($id) {
		return $this->lang[CURRENT_LANG][$id];
	}
	
	public function redirect($url) {
		if (substr($url, 0, 1) == "/") {
			header("Location: http://" . WWW_HOST . "$url");
		} else {
			header("Location: $url");
		}
		exit;
	}
	
	public function display_not_authorized() {
    	header('HTTP/1.0 401 Unauthorized');
    	echo 'Not authorized';
    	exit;		
	}

	public function load_component($component_name) {
		// Ensure we have access to this component
		if (!array_key_exists($component_name, $this->components)) {
			throw new Exception("Component is not provided by or to the framework");
		}
		
		// Require it
		$base = basename($this->components[$component_name]);
		require_once($this->components[$component_name] . "/$base.php");
		
		// Load it on in; class name is always $base
		//echo $base;
		$c = new $base();
		
		$c->load($this);
	}
	
	public function component_option($component_name, $option, $value) {
		if (!isset($this->component_options[$component_name])) {
			$this->component_options[$component_name] = array();
		}
		
		$this->component_options[$component_name][$option] = $value;
	}
	
	public function get_component_options($component_name) {
		if (isset($this->component_options[$component_name])) {
			return $this->component_options[$component_name];
		} else {
			return array();
		}
	}
	
	public function get_provided() {
		return $this->provided;
	}
	
	public function is_provided($question) {
		return (in_array($question, $this->provided)) ? true : false;
	}
	
	public function add_provided($name) {
		$this->provided[] = $name;
	}
	
	public function is_authenticated() {
		$user = TAWUser::singleton();
		
		return $user->is_authenticated();	
	}
	
	public function has_postdata() {
		if (count($_POST)) {
			return true;
		}
		
		return false;
	}
	
	public function login($email = null, $pass = null, $remember_me = false, $site = null) {
		$user = TAWUser::singleton();
		
		return $user->login($email, $pass, $remember_me, $site);
	}

        public function contact_us() {
            
            $text = "Name: " . $this->data["name"] . "\n";
            $text.= "Email: " . $this->data["email"]. "\n";
            $text.= "Company: " . $this->data["company"]. "\n";
            $text.= "Phone: " . $this->data["phone"]. "\n";
            $text.= "Message: " . $this->data["message"]. "\n";

            $db = TAWDBI::singleton();

            // Send the mail
            $result = $db->sp("msdb", "sp_send_dbmail", array(
                "profile_name"=>"Support",
                "recipients"=>"support@thinairwireless.com",
                "subject"=>"Contact Request",
                "body"=>$text
            ));

            echo json_encode(array("success"=> $result));

        }
	
	// Forward master requests to the API
	public function taw_api_call() {
		$postdata = array(
			"email"=>"root@thinairwireless.com",
			"password"=>"78747874"
		);
		
		$postdata = array_merge($postdata, $_POST);
		
		// Configure cURL, which handles our web communication
		$ch = curl_init("http://www.mythinairwireless.com/api/");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);
		
		// Execute our API call
		$xml = curl_exec($ch);
		// Convert our request to a simplexml object for easy reading
		$response = simplexml_load_string($xml);
		
		if ($response->Success) {
			echo json_encode(array("success"=>true, "debug"=>$xml));
		} else {
			echo json_encode(array("success"=>false, "message"=>$response->Message, "debug"=>$xml));
		}
	}
}
?>