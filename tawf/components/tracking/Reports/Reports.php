<?php

require_once(TAWF_ROOT . "/lib/SSRSReport/SSRSReport.php");

class Reports extends TAWComponent {

    private $reports = array();
    private $dashReports = array();
    private $liveviewReports = array();
    private $allReports = array();
    private $dashFleetReports = array();

    public function __construct() {
        parent::__construct("tracking/Reports", true);
     //   $this->add_dependancy("landmarks");
        $this->add_dependancy("jquery");
    }

    public function load($tawf) {
        parent::load($tawf);

//        $this->reports[] = new ReportFleetNow();
        $this->reports[] = new ReportBeginEndDaySummary();
        $this->reports[] = new ReportCountyMileage();
	    $this->reports[] = new ReportStateMileage();
	    $this->reports[] = new ReportVehicleIdling();
        $this->reports[] = new ReportDailyActivity();
        $this->reports[] = new ReportDriverEvents();
        $this->reports[] = new ReportDriverHistory();
        $this->reports[] = new ReportExcessiveSpeed();
        $this->reports[] = new ReportLandmarks();
        $this->reports[] = new ReportLatestLocation();
        $this->reports[] = new ReportTPMSAlerts();
        $this->reports[] = new ReportTPMSCurrentStatus();
	    $this->reports[] = new ReportTPMSHistorySummary();
		$this->reports[] = new ReportTPMSHistoryDetail();
	    $this->reports[] = new ReportDistractedDriving();


        $this->dashReports[] = new ReportDashboardVehicle();
        $this->dashFleetReports[] = new ReportDashboardFleetAverageSpeed();
        $this->dashFleetReports[] = new ReportDashboardFleetDistanceTraveled();
        $this->dashFleetReports[] = new ReportDashboardFleetEngineIdle();
        $this->dashFleetReports[] = new ReportDashboardFleetEngineOnOff();
        $this->dashFleetReports[] = new ReportDashboardFleetExcessiveSpeed();
        $this->dashFleetReports[] = new ReportDashboardFleetStops();

        $this->liveviewReports[] = new ReportDDMStatus();

        $this->allReports = array_merge($this->reports, $this->dashReports, $this->dashFleetReports, $this->liveviewReports);
    }

    public function get_reports() {
        return $this->reports;
    }

    public function get_dashboard_fleet_reports() {
        return $this->dashFleetReports;
    }

    public function read_report_schedules() {
        // Get our needed singletons
        $user = TAWUser::singleton();
        $db = TAWDBI::singleton();

        $schedules = $db->sp("vision2020", "SSRSGetUserSchedules", array(
            "UserID"=> $user->get_id()
        ));

        // Convert the ReportParameters to JSON
        foreach ($schedules as &$schedule) {
            $xml  = "<?xml version='1.0'?>\n";
            $xml .= $schedule["ReportParameters"];
            $sxml = simplexml_load_string($xml);
            $params = array();
            foreach ($sxml->ParameterValue as $sxmlParam) {
                $params["".$sxmlParam->Name] = (string)$sxmlParam->Value;
            }            
            $schedule["Parameters"] = $params;
        }
        
        return $schedules;
    }

    public function get_report_schedules() {
        $schedules = $this->read_report_schedules();
        echo json_encode($schedules);
    }

    public function do_delete_report_schedule($scheduleID) {
        $db = TAWDBI::singleton();
        $response = $db->sp("vision2020", "SSRSDeleteSchedule", array("ScheduleID" => $scheduleID));
        return $response;
    }

    public function delete_report_schedules() {
        $schedules = $this->tawf->data["schedules"];
        foreach ($schedules as $scheduleID) {
            $this->do_delete_report_schedule($scheduleID);
        }
        echo json_encode(array("response"=>"ok"));
    }
    
    public function delete_report_schedule() {
        $response = $this->do_delete_report_schedule($this->tawf->data["ScheduleID"]);
        echo json_encode($response);
    }

    public function get_xml_parameter($paramName, $paramValue) {
        if ($paramValue)
            $retval = sprintf('<ParameterValue><Name>%s</Name><Value>%d</Value></ParameterValue>', $paramName, $paramValue);
        else
            $retval = sprintf('<ParameterValue><Name>%s</Name></ParameterValue>', $paramName);

        return $retval;

    }

    public function save_report_schedule() {
	$user = TAWUser::singleton();
        $db = TAWDBI::singleton();

        $isEdit = isset($this->tawf->data["ScheduleID"]);

        $report = $this->get_report_by_id($this->tawf->data["ReportId"]);

        $paramValues  = '<ParameterValues>';
        $paramValues .= $this->get_xml_parameter("UserID", $user->get_id()); //sprintf('<ParameterValue><Name>UserID</Name><Value>%d</Value></ParameterValue>', $user->get_id());
        $paramValues .= $this->get_xml_parameter("DriverID", $this->tawf->data["Parameters"]["DriverID"]); //sprintf('<ParameterValue><Name>DriverID</Name><Value>%d</Value></ParameterValue>', $this->tawf->data["Parameters"]["DriverID"]);
        $paramValues .= $this->get_xml_parameter("DeviceID", $this->tawf->data["Parameters"]["DeviceID"]); //sprintf('<ParameterValue><Name>DeviceID</Name><Value>%d</Value></ParameterValue>', $this->tawf->data["Parameters"]["DeviceID"]);
		$paramValues .= $this->get_xml_parameter("DivisionID", $this->tawf->data["Parameters"]["DivisionID"]); //sprintf('<ParameterValue><Name>DivisionID</Name><Value>%d</Value></ParameterValue>', $this->tawf->data["Parameters"]["DivisionID"]);
        $paramValues .= $this->get_xml_parameter("GroupID", $this->tawf->data["Parameters"]["GroupID"]); //sprintf('<ParameterValue><Name>GroupID</Name><Value>%d</Value></ParameterValue>', $this->tawf->data["Parameters"]["GroupID"]);
        $paramValues .= '</ParameterValues>';
        
        $params = array();

        if ($isEdit)
            $params["ReportPath"] = $this->tawf->data["ReportPath"];
        else
            $params["ReportPath"] = $report->get_report_path();

        $params["ReportParameters"] = $paramValues;
        $params["EmailRecipients"] = $this->tawf->data["EmailRecipients"];
        $params["RenderFormat"] = $this->tawf->data["RenderFormat"];
        $params["ScheduleHour"] = $this->tawf->data["ScheduleHour"];
        $params["ScheduleMinute"] = $this->tawf->data["ScheduleMinute"];
        $params["ScheduleAMPM"] = $this->tawf->data["ScheduleAMPM"];
        $params["SchedMonday"] = $this->tawf->data["SchedMonday"];
        $params["SchedTuesday"] = $this->tawf->data["SchedTuesday"];
        $params["SchedWednesday"] = $this->tawf->data["SchedWednesday"];
        $params["SchedThursday"] = $this->tawf->data["SchedThursday"];
        $params["SchedFriday"] = $this->tawf->data["SchedFriday"];
        $params["SchedSaturday"] = $this->tawf->data["SchedSaturday"];
        $params["SchedSunday"] = $this->tawf->data["SchedSunday"];
        
        // Delete the previous schedule
        if ($isEdit) {
            $scheduleID = $this->tawf->data["ScheduleID"];
            $this->do_delete_report_schedule($scheduleID);
        }

        // Create a new one
        $response = $db->sp("vision2020", "SSRSCreateSchedule", $params);
        
        echo json_encode(array("response"=>array($response)));
    }

    public function get_report_by_id($reportId) {
        foreach($this->allReports as $report) {
            if (strcasecmp($report->get_id(), $reportId) == 0)
                    return $report;
        }
        return null;
    }

    public function create_report($reportType) {
        $report = $this->get_report_by_id($reportType);
        return $report;
    }

    public function render_report($reportType) {
        // Some reports can take a long time to run
        set_time_limit(600);
        ini_set('default_socket_timeout', 600);

        $report = $this->create_report($reportType);
        $report->set_tawf($this->tawf);
        $report->set_rs($this->create_ssrs_instance());
        try {
            return $report->render();

        } catch (SSRSReportException $e) {
            //print_r($e);
            print($e->GetErrorMessage());
            throw  $e;
        }

    }

    /*
      This method handles identifying which screens should be shown to the user. We use the $_GET["report"] to identify the report
      and from there set the paths to the report criteria and results tables
     */

    public function configure_report_direction() {
        if (isset($this->tawf->data["report"]))
            $this->tawf->report_type = strtolower($this->tawf->data["report"]);
        else
            $this->tawf->report_type = "placeholder";
    }

    public function get_report_parameters($reportPath) {
        $rs = $this->create_ssrs_instance();

        $u = TAWUser::singleton();

        $parameters = array();
        $parameters[0] = new ParameterValue();
        $parameters[0]->Name = "UserID";
        $parameters[0]->Value = $u->get_id();
        try {
            $reportParameters = $rs->GetReportParameters($reportPath, null, true, $parameters, null);
        } catch (SSRSReportException $e) {
            print($e->GetErrorMessage());
            throw  $e;
        }
        return $reportParameters;
    }

    public function get_report_list() {
        $rs = $this->create_ssrs_instance();
        $catalogItems = $rs->ListChildren("/", true);
        $reports = array();
        foreach ($catalogItems as $catalogItem) {
            if ($catalogItem->Type == ItemTypeEnum::$Report) {
                $reports[] = array(
                    "Name" => $catalogItem->Name,
                    "Path" => $catalogItem->Path
                );
            }
        }
        return $reports;
    }

    // Report AJAX calls; format is: generate_[report_name]_report
    public function generate_fleet_now_report() {
        return $this->render_report("fleet_now");
    }

    public function generate_driver_events_report() {
        return $this->render_report("driver_events");
    }

    public function generate_driver_history_report() {
        return $this->render_report("driver_history");
    }

    public function generate_state_mileage_report() {
        return $this->render_report("state_mileage");
    }

    public function generate_excessive_speed_report() {
        return $this->render_report("excessive_speed");
    }

    public function generate_begin_end_day_summary_report() {
        return $this->render_report("begin_end_day_summary");
    }

    public function generate_daily_activity_report() {
        return $this->render_report("daily_activity");
    }

    public function generate_landmarks_report() {
        return $this->render_report("landmarks");
    }

    public function generate_vehicle_idling_report() {
        return $this->render_report("vehicle_idling");
    }

    public function generate_dashboard_vehicle_report() {
        return $this->render_report("dashboard_vehicle");
    }

    public function generate_report() {
        return $this->render_report($this->tawf->data["report"]);
    }

    public function generate_tpms_alerts_report() {
        return $this->render_report("tpms_alerts");
    }

    public function generate_tpms_current_status_report() {
        return $this->render_report("tpms_current_status");
    }

    public function generate_county_mileage_report() {
        return $this->render_report("county_mileage");
    }

    public function generate_latest_location_report() {
        return $this->render_report("latest_location");
    }

 	public function generate_distracted_driving_report() {
        return $this->render_report("distracted_driving");
    }

	public function generate_tpms_history_summary_report() {
        return $this->render_report("tpms_history_summary");
    }

	public function generate_tpms_history_detail_report() {
        return $this->render_report("tpms_history_detail");
    }

    private function create_ssrs_instance() {
        try {
            //return new SSRSReport(new Credentials("DB1-186687\jrichard", "j83751oh"), "http://72.3.253.228/ReportServer/");
            return new SSRSReport(new Credentials("DB1-186687\ReportingServices", "Vision1914$"), "http://72.3.253.228/ReportServer/");
        } catch (SSRSReportException $e) {
            return $e->GetErrorMessage();
        }
    }

    // TODO - this method should not be here
    public function get_landmarks($company_id) {
        // Get our needed singletons
        $user = TAWUser::singleton();
        $db = TAWDBI::singleton();

        $landmarks = $db->sp("vision2020", "GetGeofenceByCompanyID", array(
                "CompanyID"=>$company_id
        ));


        foreach ($landmarks as $landmark_id=>$landmark) {
                // If this user is only a dispatcher then we must limit the results to only the users they have access to.
                if ($user->is_dispatcher() && !in_array($landmark["UserID"], $user->get_allowed_view_list())) {
                        unset($landmarks[$landmark_id]);
                        continue;
                }

                // Get the tags

        }

        return $landmarks;
    }

	public function get_eventtypes($company_id) {
            // Get our needed singletons
            $user = TAWUser::singleton();
            $db = TAWDBI::singleton();

            $eventTypes = $db->sp("gps1", "GetActionEventTypeAlerts", array("CompanyID"=>$company_id));
            return $eventTypes;

    }
    // Fills our tawf data object with divisions, groups, devices, and users for the purpose of filtering search criteria

    public function get_report_request_information() {
        
        header('Content-type: application/json');

        $db = TAWDBI::singleton();
        $user = TAWUser::singleton();
        error_reporting(E_ERROR);
        //$devices = $db->read_company_devices($user->get_company_id());
        $devices = $db->read_user_division_group_devices($user->get_id());        
        $users = $db->read_company_users($user->get_company_id());
	    $landmarks = $this->get_landmarks($user->get_company_id());
	    $eventtypes = $this->get_eventtypes($user->get_company_id());
        $divisions = $db->read_user_division_group($user->get_id());
        $schedules = $this->read_report_schedules();
        $divisionDrivers = $db->sp2("vision2020", "GetUserDivisionGroupDriverList", array("UserID" => $user->get_id(), "GroupID" => null, "DivisionID" => null));
        echo json_encode(array("drivers" => $divisionDrivers, "devices" => $devices, "users" => $users, "divisions" => $divisions, "landmarks" => $landmarks, "schedules" => $schedules, "eventtypes" => $eventtypes));
    }

    public function obtain_report_request_information() {

        $db = TAWDBI::singleton();
        $user = TAWUser::singleton();

        $devices = $db->read_company_devices($user->get_company_id());
        $users = $db->read_company_users($user->get_company_id());
        //$vehicles = $db->read_company_vehicles($user->get_company_id());
        //$landmarks = $db->read_regular_company_landmarks($user->get_company_id());
        $landmarks = $this->get_landmarks($user->get_company_id());
	    $eventtypes = $this->get_eventtypes($user->get_company_id());
        $divisions = $db->read_company_organization($user->get_company_id());

        $this->tawf->filter_data = array("devices" => $devices, "users" => $users, "divisions" => $divisions, "landmarks" => $landmarks, "eventtypes" => $eventtypes);
        $this->tawf->company_data = $db->read_company_data($user->get_company_id());
    }

    public function db_read_driver_names($drivers) {
        $db = TAWDBI::singleton();

        $sql = "SELECT CompanyUserID, CompanyUserName FROM [vision2020].[dbo].[CompanyUser] WHERE CompanyUserID IN ('" . implode("','", $drivers) . "')";

        $rows = $db->query($sql);

        return $rows;
    }

}

abstract class BaseReport {

    protected $tawf;
    protected $rs;

    abstract public function get_name();

    abstract public function get_id();

    public function set_tawf($tawf) {
        $this->tawf = $tawf;
    }

    public function set_rs($rs) {
        $this->rs = $rs;
    }

    public function get_report_includes() {
        return "";
    }

    public function get_report_path() {

    }

    public function get_report_parameters() {
        return array();
    }

    public function render() {
        global $Action, $Extension, $MimeType, $Encoding, $Warnings, $StreamIds;

        $executionInfo = $this->rs->LoadReport2($this->get_report_path(), NULL);
        $parameters = $this->get_report_parameters();
        $this->rs->SetExecutionParameters2($parameters);

        // Execute the Report
        $result = $this->generate_output($this->rs);

        echo $result;
    }

    public function render_report_as_pdf($rs) {
        global $Action, $Extension, $MimeType, $Encoding, $Warnings, $StreamIds;

        $renderAsPDF = new RenderAsPDF();
     
        // Execute the Report
        $result = $rs->Render2($renderAsPDF,
                        PageCountModeEnum::$Actual,
                        $Extension,
                        $MimeType,
                        $Encoding,
                        $Warnings,
                        $StreamIds);
        ob_clean();
        header("Cache-Control: public");
        header("Content-Description: File Transfer");
        header("Content-Disposition: attachment; filename=" . $this->get_report_file_name("pdf"));
        header("Content-Type: application/pdf");

        return $result;
    }

    public function get_report_file_name($extention) {
        return $this->tawf->data["ufd-"] . "." . $extention;
    }

    public function render_report_as_word($rs) {
        global $Action, $Extension, $MimeType, $Encoding, $Warnings, $StreamIds;

        $render = new RenderAsWORD();

        // Execute the Report
        $result = $rs->Render2($render,
                        PageCountModeEnum::$Actual,
                        $Extension,
                        $MimeType,
                        $Encoding,
                        $Warnings,
                        $StreamIds);

        ob_clean();
        header("Cache-Control: public");
        header("Content-Description: File Transfer");
        header("Content-Disposition: attachment; filename=" . $this->get_report_file_name("doc"));
        header("Content-Type: application/msword");

        return $result;
    }

    public function render_report_as_excel($rs) {
        global $Action, $Extension, $MimeType, $Encoding, $Warnings, $StreamIds;

        $render = new RenderAsEXCEL();

        // Execute the Report
        $result = $rs->Render2($render,
                        PageCountModeEnum::$Actual,
                        $Extension,
                        $MimeType,
                        $Encoding,
                        $Warnings,
                        $StreamIds);
        ob_clean();
        header("Cache-Control: public");
        header("Content-Description: File Transfer");
        header("Content-Disposition: attachment; filename=" . $this->get_report_file_name("xls"));
        header("Content-Type: application/vnd.ms-excel");
        return $result;
    }

    public function render_report_as_html($rs) {
        global $Action, $Extension, $MimeType, $Encoding, $Warnings, $StreamIds;

        //print_r($this->tawf->data);
        $rand = "S" . rand(1, 10000000000);

        $printerFriendly = isset($this->tawf->data["printer-friendly"]) ? $this->tawf->data["printer-friendly"]: false;
        $pageNumber = isset($this->tawf->data["page-number"]) ? $this->tawf->data["page-number"] : -1;

        $renderAsHTML = new RenderAsHTML();
        $renderAsHTML->ReplacementRoot = "/";
        $renderAsHTML->HTMLFragment = "true";

        //$renderAsHTML->ExpandContent

        $renderAsHTML->StreamRoot = "./tmp/".$rand;
        if (!$printerFriendly && $pageNumber != -1)
            $renderAsHTML->Section = $pageNumber;

        //$renderAsHTML->Toolbar = "True";
        // Execute the Report
        $result_html = $rs->Render2($renderAsHTML,
                        PageCountModeEnum::$Actual,
                        $Extension,
                        $MimeType,
                        $Encoding,
                        $Warnings,
                        $StreamIds);

        $execInfo = $rs->GetExecutionInfo2();

        foreach ($StreamIds as $StreamId) {
            $renderAsHTML->StreamRoot = null;
            $result_png = $rs->RenderStream($renderAsHTML,
                            $StreamId,
                            $Encoding,
                            $MimeType);

            if (!$handle = fopen("./tmp/".$rand . $StreamId, 'wb')) {
                echo "Cannot open file for writing output";
                exit;
            }

            if (fwrite($handle, $result_png) === FALSE) {
                echo "Cannot write to file";
                exit;
            }
            fclose($handle);
        }

        if ($printerFriendly)
            $result_html .= "<script>window.print()</script>";

        // TODO - this is not so good, but a good solution for the moment
        // ideally, i would like to return a json with the report parameter + report result
        $result_html .= "<form><input type='hidden' id='reports-page-count' value=" . $execInfo->NumPages . "></form>";

        //$result = array("NumPages"=>$execInfo->NumPages, "html"=>$result_html);
        //return json_encode($result);

        return $result_html;
    }

    public function generate_output($rs) {

        $reportRender = isset($this->tawf->data["report-render"]) ? $this->tawf->data["report-render"]: "html";

        if ($reportRender == "pdf")
            return $this->render_report_as_pdf($rs);

        if ($reportRender == "word")
            return $this->render_report_as_word($rs);

        if ($reportRender == "excel")
            return $this->render_report_as_excel($rs);

        return $this->render_report_as_html($rs);
    }

}

class ReportFleetNow extends BaseReport {

    public function get_name() {
        return "Fleet Now";
    }
    
    public function get_id() {
        return "fleet_now";
    }

    public function get_report_parameters() {

        $u = TAWUser::singleton();

        $parameters = array();
        $parameters[0] = new ParameterValue();
        $parameters[0]->Name = "CompanyID";
        $parameters[0]->Value = $u->get_company_id();

        return $parameters;
    }

    public function get_report_path() {
        return "/WS/FleetNow";
    }

}

abstract class ReportEvents extends BaseReport {

    public function get_report_includes() {
        return "event";
    }

    public function get_report_parameters() {

        $u = TAWUser::singleton();

        $parameters = array();

        $parameters[0] = new ParameterValue();
        $parameters[0]->Name = "UserID";
        $parameters[0]->Value = $u->get_id();

        $parameters[1] = new ParameterValue();
        $parameters[1]->Name = "GroupID";
        $parameters[1]->Value = ($this->tawf->data["group"] == 0) ? NULL : $this->tawf->data["group"];

        $parameters[2] = new ParameterValue();
        $parameters[2]->Name = "DeviceID";
        $parameters[2]->Value = ($this->tawf->data["device"] == 0) ? NULL : $this->tawf->data["device"];

        $parameters[3] = new ParameterValue();
        $parameters[3]->Name = "DriverID";
        $parameters[3]->Value = ($this->tawf->data["driver"] == 0) ? NULL : $this->tawf->data["driver"];

        $parameters[4] = new ParameterValue();
        $parameters[4]->Name = "DivisionID";
        $parameters[4]->Value = empty($this->tawf->data["division"]) ? NULL : $this->tawf->data["division"];

        $start_date = strtotime($this->tawf->data["start-date"]);
        $end_date = strtotime($this->tawf->data["start-date"]);

        $sStarDate = str_replace("-", "/", $this->tawf->data["start-date"]); //date("m/d/y g:i:s A", $start_date);
        $sEndDate =  str_replace("-", "/", $this->tawf->data["end-date"]); //$sEndDate = date("m/d/y g:i:s A", $end_date);
        
        $parameters[5] = new ParameterValue();
        $parameters[5]->Name = "FromDateTime";
        $parameters[5]->Value = $sStarDate;

        $parameters[6] = new ParameterValue();
        $parameters[6]->Name = "ToDateTime";
        $parameters[6]->Value = $sEndDate;

        //print_r($parameters);
        
        return $parameters;
    }

}

class ReportDriverEvents extends ReportEvents {

    public function get_name() {
        return "Detailed Driver Events";
    }

    public function get_id() {
        return "driver_events";
    }

    public function get_report_includes() {
        return "driver_events";
    }
    
	public function get_report_parameters() {
        $parameters = parent::get_report_parameters();
        $param = new ParameterValue();
        $param->Name = "ActionEventTypeID";
        $param->Value = ($this->tawf->data["eventtype"] == 0) ? NULL : $this->tawf->data["eventtype"];
        $parameters[] = $param;
        return $parameters;
    }
	
	public function get_report_path() {
        return "/Detailed Driver Events";
    }       
}

class ReportDriverHistory extends ReportEvents {
    
    public function get_name() {
        return "Detailed Driver History";
    }

    public function get_id() {
        return "driver_history";
    }

    public function get_report_path() {
        return "/Detailed Driver History";
    }

}

class ReportStateMileage extends ReportEvents {

    public function get_name() {
        return "State Mileage";
    }

    public function get_id() {
        return "state_mileage";
    }

    public function get_report_path() {
        return "/State Mileage";
    }

}


class ReportDailyActivity extends ReportEvents {

    public function get_name() {
        return "Daily Activity";
    }

    public function get_id() {
        return "daily_activity";
    }

    public function get_report_path() {
        return "/Daily Activity";
    }

}


class ReportVehicleIdling extends ReportEvents {

    public function get_name() {
        return "Vehicle Idling";
    }

    public function get_id() {
        return "vehicle_idling";
    }

    public function get_report_includes() {
        return "vehicle_idling";
    }

    public function get_report_parameters() {
        $parameters = parent::get_report_parameters();
        $param = new ParameterValue();
        $param->Name = "MinIdleMinutes";
        $param->Value = ($this->tawf->data["min-idle-minutes"] == 0) ? NULL : $this->tawf->data["min-idle-minutes"];
        $parameters[] = $param;
        return $parameters;
    }
    
    public function get_report_path() {
        return "/Vehicle Idling";
    }

}

class ReportBeginEndDaySummary extends ReportEvents {

    public function get_name() {
        return "Begin/End Day Summary";
    }

    public function get_id() {
        return "begin_end_day_summary";
    }

    public function get_report_path() {
        return "/Begin End Day Summary";
    }

}

class ReportExcessiveSpeed extends ReportEvents {

    public function get_name() {
        return "Excessive Speed";
    }

    public function get_id() {
        return "excessive_speed";
    }

    public function get_report_path() {
        return "/Excessive Speed";
    }

}

class ReportLandmarks extends ReportEvents {

    public function get_name() {
        return "Landmark Activity";
    }

    public function get_report_includes() {
        return "landmarks";
    }

    public function get_report_parameters() {
        $parameters = parent::get_report_parameters();
        $param = new ParameterValue();
        $param->Name = "GeoFenceID";
        $param->Value = ($this->tawf->data["landmark"] == 0) ? NULL : $this->tawf->data["landmark"];
        $parameters[] = $param;
        return $parameters;
    }


    public function get_id() {
        return "landmarks";
    }

    public function get_report_path() {
        return "/Landmarks";
    }

}

class ReportTPMSAlerts extends ReportEvents {

    public function get_name() {
        return "TPMS Alerts";
    }

    public function get_id() {
        return "tpms_alerts";
    }

    public function get_report_path() {
        return "/TPMS Alerts";
    }

}


class ReportTPMSCurrentStatus extends ReportEvents {

    public function get_name() {
        return "TPMS Current Status";
    }

    public function get_id() {
        return "tpms_current_status";
    }

    public function get_report_path() {
        return "/TPMS Current Status";
    }

}


class ReportCountyMileage extends ReportEvents {

    public function get_name() {
        return "County Mileage";
    }

    public function get_id() {
        return "county_mileage";
    }

    public function get_report_path() {
        return "/County Mileage";
    }

}

class ReportLatestLocation extends ReportEvents {

    public function get_name() {
        return "Latest Location";
    }

    public function get_id() {
        return "latest_location";
    }

    public function get_report_path() {
        return "/Latest Location";
    }

}

class ReportDistractedDriving extends ReportEvents {

    public function get_name() {
        return "Distracted Driving";
    }

    public function get_id() {
        return "distracted_driving";
    }

    public function get_report_path() {
        return "/Distracted Driving";
    }

}

class ReportTPMSHistorySummary extends ReportEvents {

    public function get_name() {
        return "TPMS History Summary";
    }

    public function get_id() {
        return "tpms_history_summary";
    }

    public function get_report_path() {
        return "/TPMS History Summary";
    }

}

class ReportTPMSHistoryDetail extends ReportEvents {

    public function get_name() {
        return "TPMS History Detail";
    }

    public function get_id() {
        return "tpms_history_detail";
    }

    public function get_report_path() {
        return "/TPMS History Detail";
    }

}

abstract class ReportDash extends ReportEvents {

    public function get_report_parameters() {

        $u = TAWUser::singleton();

        $parameters = array();

        $parameters[0] = new ParameterValue();
        $parameters[0]->Name = "UserID";
        $parameters[0]->Value = $u->get_id();

        $parameters[1] = new ParameterValue();
        $parameters[1]->Name = "GroupID";
        $parameters[1]->Value = ($this->tawf->data["group"] == 0) ? NULL : $this->tawf->data["group"];;

        $parameters[2] = new ParameterValue();
        $parameters[2]->Name = "DeviceID";
        $parameters[2]->Value = ($this->tawf->data["device"] == 0) ? NULL : $this->tawf->data["device"];

        $parameters[3] = new ParameterValue();
        $parameters[3]->Name = "DivisionID";
        $parameters[3]->Value = empty($this->tawf->data["division"]) ? NULL : $this->tawf->data["division"];

        $start_date = strtotime($this->tawf->data["start-date"]);
        $end_date = strtotime($this->tawf->data["end-date"]);

        $sStarDate = str_replace("-", "/", $this->tawf->data["start-date"]) . " 0:00:00";
        $sEndDate =  str_replace("-", "/", $this->tawf->data["end-date"]) . " 23:59:00";

        $parameters[4] = new ParameterValue();
        $parameters[4]->Name = "StartDateTime";
        $parameters[4]->Value = $sStarDate;

        $parameters[5] = new ParameterValue();
        $parameters[5]->Name = "EndDateTime";
        $parameters[5]->Value = $sEndDate;

        //print_r($parameters);

        return $parameters;
    }
}


abstract class ReportDashFleet extends ReportEvents {

    public function get_report_parameters() {

        $u = TAWUser::singleton();

        $parameters = array();

        $parameters[0] = new ParameterValue();
        $parameters[0]->Name = "UserID";
        $parameters[0]->Value = $u->get_id();

        $parameters[1] = new ParameterValue();
        $parameters[1]->Name = "GroupID";
        $parameters[1]->Value = ($this->tawf->data["group"] == 0) ? NULL : $this->tawf->data["group"];;

        $parameters[2] = new ParameterValue();
        $parameters[2]->Name = "DeviceID";
        $parameters[2]->Value = NULL;

        $parameters[3] = new ParameterValue();
        $parameters[3]->Name = "DivisionID";
        $parameters[3]->Value = empty($this->tawf->data["division"]) ? NULL : $this->tawf->data["division"];

        $start_date = strtotime($this->tawf->data["start-date"]);
        $end_date = strtotime($this->tawf->data["end-date"]);

        $sStarDate = str_replace("-", "/", $this->tawf->data["start-date"]) . " 0:00:00";
        $sEndDate =  str_replace("-", "/", $this->tawf->data["end-date"]) . " 23:59:00";

        $parameters[4] = new ParameterValue();
        $parameters[4]->Name = "StartDateTime";
        $parameters[4]->Value = $sStarDate;

        $parameters[5] = new ParameterValue();
        $parameters[5]->Name = "EndDateTime";
        $parameters[5]->Value = $sEndDate;

        //print_r($parameters);

        return $parameters;
    }
}

class ReportDashboardVehicle extends ReportDash {

    public function get_name() {
        return "Dashboard ";
    }

    public function get_id() {
        return "dashboard_vehicle";
    }

    public function get_report_path() {
        return "/DashVehicle";
    }

}

class ReportDashboardFleetAverageSpeed extends ReportDashFleet {

    public function get_name() {
        return "Average Speed";
    }

    public function get_id() {
        return "dashboard_fleet_average_speed";
    }

    public function get_report_path() {
        return "/DashFleetAverageSpeed";
    }

}

class ReportDashboardFleetDistanceTraveled extends ReportDashFleet {

    public function get_name() {
        return "Distance Traveled";
    }

    public function get_id() {
        return "dashboard_fleet_distance_traveled";
    }

    public function get_report_path() {
        return "/DashFleetDistanceTraveled";
    }

}

class ReportDashboardFleetEngineIdle extends ReportDashFleet {

    public function get_name() {
        return "Engine Idle";
    }

    public function get_id() {
        return "dashboard_fleet_engine_idle";
    }

    public function get_report_path() {
        return "/DashFleetEngineIdle";
    }

}

class ReportDashboardFleetEngineOnOff extends ReportDashFleet {

    public function get_name() {
        return "Engine On/Off";
    }

    public function get_id() {
        return "dashboard_fleet_engine_on_off";
    }

    public function get_report_path() {
        return "/DashFleetEngineOnOff";
    }

}

class ReportDashboardFleetExcessiveSpeed extends ReportDashFleet {

    public function get_name() {
        return "Excessive Speed";
    }

    public function get_id() {
        return "dashboard_fleet_excessive_speed";
    }

    public function get_report_path() {
        return "/DashFleetExcessiveSpeed";
    }

}

class ReportDashboardFleetStops extends ReportDashFleet {

    public function get_name() {
        return "Stops ";
    }

    public function get_id() {
        return "dashboard_fleet_stops";
    }

    public function get_report_path() {
        return "/DashFleetStops";
    }

}

class ReportDDMStatus extends BaseReport {

    public function get_name() {
        return "DDM Status";
    }
    
    public function get_id() {
        return "ddm_status";
    }

    public function get_report_parameters() {

        $u = TAWUser::singleton();

        $parameters = array();
        $parameters[0] = new ParameterValue();
        $parameters[0]->Name = "UserID";
        $parameters[0]->Value = $u->get_id();

        $parameters[1] = new ParameterValue();
        $parameters[1]->Name = "DeviceID";
        $parameters[1]->Value = ($this->tawf->data["device"] == 0) ? NULL : $this->tawf->data["device"];
        
        return $parameters;
    }

    public function get_report_path() {
        return "/DDM Status";
    }

}
function dates_between($start_date, $end_date) {


    $start_date = is_int($start_date) ? $start_date : strtotime($start_date);
    $end_date = is_int($end_date) ? $end_date : strtotime($end_date);

    $end_date -= ( 60 * 60 * 24);

    $test_date = $start_date;
    $day_incrementer = 0;

    $dates = array();
    $dates[] = date("m/d/Y", $test_date);

    while ($test_date < $end_date && ++$day_incrementer) {
        $test_date = $start_date + ($day_incrementer * 60 * 60 * 24);
        $dates[] = date("m/d/Y", $test_date);
    }



    return $dates;
}

function events_in_date($events, $date) {
    $datedEvents = array();

    foreach ($events as $event) {
        if (strpos($event["EventTimestamp"], $date) !== false)
            $datedEvents[] = $event;
    }

    return $datedEvents;
}

?>