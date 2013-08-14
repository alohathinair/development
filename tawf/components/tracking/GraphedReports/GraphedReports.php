<?php
require_once("/home/mythinair/production/lib/statistics.php");

class GraphedReports extends TAWComponent {
	public function __construct() {
		parent::__construct("tracking/GraphedReports", true);

		$this->add_dependancy("jquery");
		
		//$this->add_js("/js/search.js");
	}
	
	public function load($tawf) {
		
		parent::load($tawf);
	}
	
	public function get_graphed_report() {
		$user = TAWUser::singleton();
		$db = TAWDBI::singleton();
		
		switch ($this->tawf->data["report_type"]) {
			case 1:
			default:
				$start = strtotime(date("m/d/Y 12:00:00", strtotime($this->tawf->data["date"])) . " AM");
				$end = strtotime(date("m/d/Y 11:59:59", strtotime($this->tawf->data["date"])) . " PM");						
				
				$drivers = $this->tawf->data["drivers"];

				$events = array_reverse($db->read_user_events($this->tawf->data["device_filter"], $start, $end));
				$on_time = Statistics::engine_on_time_for_day($events);
				//echo json_encode(array("ontime"=>$on_time, "start"=>$start, "end"=>$end, "user_id"=>$this->tawf->data["device_filter"], "event_count"=>count($events)));
				$xml =  "<chart>
<chart_type>bar</chart_type>
<chart_data>
      <row>
         <null/>";
         
         $xml .= "
         <string>Josh</string>
         <string>Sample 1</string>
         <string>Sample 2</string>
      </row>
      <row>
         <string>" . date("m/d", strtotime($this->tawf->data["date"])) . "</string>
         <number>" . ($on_time/60) . "</number>
		 <number>30</number>
		 <number>240</number>
      </row>
   </chart_data>
<draw>

		<text shadow='high' color='000022' alpha='50' rotation='-90' size='40' x='-60' y='360' width='300' height='100' h_align='left' v_align='bottom'>Driver</text>
		<text shadow='high' color='000022' alpha='50' size='30' x='260' y='555' width='430' height='100'>Minutes Engine is On</text>
	</draw>
	<chart_label prefix='' 
                suffix='min' 
                decimals='0' 
                decimal_char='.'
                separator=''
                position='left'
                hide_zero='false' 
                font='arial' 
                bold='true' 
                size='10' 
                color='000000' 
                alpha='90'
                />
	 <chart_rect x='150'
               y='70'
				width='700'
				height='450'
               />
     <axis_category size='16' />
      <axis_value size='16' />
</chart>
";
				break;
		}
		
	}
	
	// Fills our tawf data object with divisions, groups, devices, and users for the purpose of filtering search criteria
	public function obtain_graphed_report_request_information() {
		
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		
		$devices = $db->read_company_devices($user->get_company_id());
		$users = $db->read_company_users($user->get_company_id());
		
		$this->tawf->filter_data = array("devices"=>$devices, "users"=>$users);
		$this->tawf->company_data = $db->read_company_data($user->get_company_id());
		
	}
	
}
?>