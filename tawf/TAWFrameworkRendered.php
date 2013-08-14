<?php
class TAWFrameworkRendered extends TAWFramework {
	private $layout;
	private $layouts_root;
	private $view;
	private $views_root;
	private $layout_javascripts;
	private $layout_stylesheets;
	private $embedded_js;
	private $title;
	
	public function __construct($layouts_root = "views/layouts", $views_root = "views") {
		parent::__construct();
		$this->layouts_root = $layouts_root;
		$this->views_root = $views_root;
		
		$this->layout_javascripts = array();
		$this->layout_stylesheets = array();
		$this->embedded_js = array();
		$this->layout = "public";
	}
	
	// Layout Methods
	public function set_title($title) {
		$this->title = $title;
	}
	
	public function get_title() {
		return $this->title;
	}
	
	public function set_layout($layout) {
		$this->layout = $layout;
	}
	
	public function set_view($view) {
		$this->view = $view;
	}
	
	public function get_layout() {
		return $this->layout;
	}
	
	public function get_view() {
		return $this->view;
	}
	
	public function render() {
		include(APP_ROOT . "/" . $this->layouts_root . "/" . $this->layout . ".php");
	}
	
	protected function render_partial($partial) {
		include(APP_ROOT . "/" . $this->views_root . "/$partial.php");
	}
	
	protected function render_view() {
		$this->render_partial($this->view);
	}
	
	protected function render_component_partial($component, $partial) {
		include($this->components[$component] . "/views/" . $partial . ".php");
	}
	
	public function add_js($js) {
		$this->layout_javascripts[] = $js;
	}
	
	public function add_css($css) {
		$this->layout_stylesheets[] = $css;
	}
	
	public function add_embedded_file($js) {
		$this->embedded_js[] = $js;
	}
	
	public function add_component_js($component, $js) {
		$this->layout_javascripts[] = $this->componentWebDirectories[$component] . "/js/" . $js . ".js";
	}
	
	public function add_component_css($component, $css) {
		$this->layout_stylesheets[] = $this->componentWebDirectories[$component] . "/css/" . $css . ".css";
	}
	
	public function add_embedded_component_js($component, $js) {
		$this->embedded_js[] = $this->components[$component] . $js;
	}
	
	protected function get_extensions() {
		$html = "<script>var WWW_ROOT = '" . WWW_ROOT . "';\nvar WWW_HOST = '" . WWW_HOST . "';\nvar TAWF_HOST = '" . TAWF_HOST . "';\n";
		
		// Include embedded files
		foreach ($this->embedded_js as $file) {
			include($file);
		}

		$html .= "</script>\n";
		
		// Load stylesheets
		foreach ($this->layout_stylesheets as $sheet) {
			if ($sheet[0] == '/') {
				$sheet = WWW_ROOT . $sheet;
			}
			$html .= "<link href='$sheet' type='text/css' rel='stylesheet'>\n";
		}
		
		// Load javascripts
		foreach ($this->layout_javascripts as $js) {
			if ($js[0] == '/') {
				$js = WWW_ROOT . $js;
			}
			$html .= "<script src='$js'></script>\n";
		}
		
		
		
		return $html;
	}
	
	
}