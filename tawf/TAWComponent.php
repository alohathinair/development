<?php
abstract class TAWComponent {
	private $css;
	private $js;
	private $depends; 
	private $provides;
	private $system; // Defines weather this is a system variable or not
	protected $componentDir;
	protected $tawf;
	
	protected function __construct($componentDir, $system = false) {
		$this->css = array();
		$this->js = array();
		$this->depends = array();
		$this->provides = array(strtolower(get_called_class()));
		$this->system = $system;
		$this->componentDir = $componentDir;
		
	}
	
	public function load($tawf) {
		// First we make sure all the dependancies are satisfied
		$provided = $tawf->get_provided();
		
		foreach ($this->depends as $dependancy) {
			if (!in_array($dependancy, $provided)) {
				throw new Exception("Required dependancy '$dependancy' has not been met");
			}
		}
		
		// Second we ensure that we are not trying to provide something already provided
		foreach ($this->provides as $provides) {
			if (in_array($provides, $provided)) {
				throw new Exception("Cannot provide already-provided component '$provides'");
			}
		}
		
		// Add methods to our framework that are provided by our component
		$methods = get_class_methods($this);
		$restrictedMethods = array_merge(get_class_methods("TAWFramework"), get_class_methods("TAWFrameworkRendered"), get_class_methods("TAWComponent"));
		$dbRestrictedMethods = array_merge(get_class_methods("TAWDBI"), get_class_methods("TAWComponent"));
		
		$db = TAWDBI::singleton();
		
		foreach ($methods as $method) {
			// Make sure it's not a restricted methods
			if (substr($method, 0, 3) != "db_") {
				if (!in_array($method, $restrictedMethods)) {
					$tawf->register_extension(array($this, $method), $method);
				}
			} else {
				if (!in_array($method, $dbRestrictedMethods)) {
					$db->register_extension(array($this, $method), substr($method, 3));
				}
			}
		}
		
		// Next we add the stylesheets and javascripts if its a rendered system
		if ($tawf instanceof TAWFrameworkRendered) {
			foreach ($this->css as $css) {
				$tawf->add_css($css);
			}
			
			foreach ($this->js as $js) {
				$tawf->add_js($js);
			}
		}
		
		foreach ($this->provides as $provided) {
			$tawf->add_provided($provided);
		}
		
		// Anddd load language definitions
		$langFile = TAWF_ROOT . "/components/" . $this->componentDir . "/lang.yml";
		if (is_file($langFile)) {
			$tawf->load_lang($langFile);
		}
		
		$this->tawf = $tawf;
	}
	
	protected function add_provides($name) {
		$this->provides[] = $name;
	}
	
	protected function add_dependancy($name) {
		$this->depends[] = $name;
	}
	
	protected function add_css($url) {
		$this->css[] = $this->parse_url($url);
	}
	
	protected function add_js($url) {
		$this->js[] = $this->parse_url($url);
	}
	
	private function parse_url($url) {
		if (substr($url, 0, 1) == "/") {
			if ($this->system) {
				return "http://" . TAWF_HOST . "/components/" . $this->componentDir . $url;
			} else {
				return "/components/" . $this->componentDir . $url;
			}
		} else {
			return $url;
		}
	}
	
}