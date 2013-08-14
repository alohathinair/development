<?php

//require_once("cloudfiles/cloudfiles.php");
require_once(TAWF_ROOT . "/lib/cloudfiles/cloudfiles.php");

class Company extends TAWComponent {
	public function __construct() {
		parent::__construct("management/Company", true);
	}
	
	public function obtain_company_data() {
		$user = TAWUser::singleton();
		$db = TAWDBI::singleton();
		
		$company_data = $db->read_company_data($user->get_company_id());
		
		$this->tawf->data["CompanyInfo"] = $company_data;
		
	}
	
	// takes the post data and updates the company data through a stored procedure
	public function update_company_data() {
		if ($this->tawf->has_postdata()) {
			$db = TAWDBI::singleton();
			$user = TAWUser::singleton();
			
			$db->sp("vision2020", "UpdateCompanyInformation2", array(
				"CompanyID"=>$user->get_company_id(),
				"CompanyAfterHoursEnd"=>$this->tawf->data["business-hours-start"],
				"CompanyAfterHoursStart"=>$this->tawf->data["business-hours-end"],
				"CompanySpeedLimit"=>$this->tawf->data["business-speed-limit"],
				"CompanyDefaultMapLatitude"=>$this->tawf->data["map-latitude"],
				"CompanyDefaultMapLongitude"=>$this->tawf->data["map-longitude"],
				"CompanyDefaultMapZoom"=>$this->tawf->data["map-zoom"],
				"CompanyName"=>$this->tawf->data["company_name"],
				"CompanyEmail"=>$this->tawf->data["company_email"],
				"CompanyPhone"=>$this->tawf->data["company_phone"],
				"CompanyAddress"=>$this->tawf->data["company_address"],
				"CompanyCity"=>$this->tawf->data["company_city"],
				"CompanyState"=>$this->tawf->data["company_state"],
				"CompanyZipCode"=>$this->tawf->data["company_zip"]

			));

                        $hoursOfOperationDays = $this->tawf->data["hh"];
                                 
                        $db->sp("vision2020", "UpdateGlobalCompanySettings", array(
				"CompanyID"=>$user->get_company_id(),
				"CompanyAfterHoursEnd"=>$this->tawf->data["business-hours-start"],
				"CompanyAfterHoursStart"=>$this->tawf->data["business-hours-end"],
				"CompanySpeedLimit"=>$this->tawf->data["business-speed-limit"],
				"CompanyDefaultMapLatitude"=>$this->tawf->data["map-latitude"],
				"CompanyDefaultMapLongitude"=>$this->tawf->data["map-longitude"],
				"CompanyDefaultMapZoom"=>$this->tawf->data["map-zoom"],
                                "HHMonday"=>in_array("mon", $hoursOfOperationDays),
                                "HHTuesday"=>in_array("tue", $hoursOfOperationDays),
                                "HHWednesday"=>in_array("wed", $hoursOfOperationDays),
                                "HHThursday"=>in_array("thu", $hoursOfOperationDays),
                                "HHFriday"=>in_array("fri", $hoursOfOperationDays),
                                "HHSaturday"=>in_array("sat", $hoursOfOperationDays),
                                "HHSunday"=>in_array("sun", $hoursOfOperationDays),
                                "OverPostedSpeedLimit"=> $this->tawf->data["over-posted-speed-limit"],
                                "UseAverageSpeed"=>$this->tawf->data["use-average-speed"]

			));
			
			// Do file upload
			//die(var_dump($_FILES));
			if (isset($_FILES["logo"])) {
			//die("Have an upload");
				$allowedExtensions = array("jpg","jpeg","png","gif");
				$fname = $user->get_company_id();
				$ext = end(explode(".", strtolower($_FILES["logo"]['name'])));
				$fullname = APP_ABSOLUTE_PATH . "/images/uploaded/logos/$fname.jpg";
				if (in_array($ext, $allowedExtensions)) {				
					if ($ext == "jpg" || $ext == "jpeg") {
						$image = imagecreatefromjpeg($_FILES["logo"]["tmp_name"]);
					} elseif ($ext == "gif") {
						$image = imagecreatefromgif($_FILES["logo"]["tmp_name"]);
					} else {
						$image = imagecreatefrompng($_FILES["logo"]["tmp_name"]);
					}
					
					
					
					// Set a maximum height and width
					$width = 280;
					$height = 80;
					
					
					// Get new dimensions
					list($width_orig, $height_orig) = getimagesize($_FILES["logo"]["tmp_name"]);
					
					$ratio_orig = $width_orig/$height_orig;
					
					if ($width/$height > $ratio_orig) {
					   $width = $height*$ratio_orig;
					} else {
					   $height = $width/$ratio_orig;
					}


					// Resample
					$image_p = imagecreatetruecolor($width, $height);
					imagecopyresampled($image_p, $image, 0, 0, 0, 0, $width, $height, $width_orig, $height_orig);
					
					// Output
					imagejpeg($image_p, $fullname, 100);				
					
				}
			}

                        if (isset($_FILES["overlay"])) {
				$allowedExtensions = array("kml","kmz");
				$fname = $user->get_company_id() . "-overlay";
				$ext = end(explode(".", strtolower($_FILES["overlay"]['name'])));

				if (in_array($ext, $allowedExtensions)) {
					$auth = new CF_Authentication("thinair1", "244d3dafb4df13e8dced2b930fc3bf15");
					$auth->authenticate();
					$conn = new CF_Connection($auth);
					$container = $conn->get_container("Overlays");


					try { 
                                            $container->delete_object($fname);
                                        } catch (Exception $e) {

                                        }

					$overlay = $container->create_object($fname);
					$fp = fopen($_FILES["overlay"]["tmp_name"], "r");
                                        $overlay->write($fp);
                                        $overlay->purge_from_cdn();
					fclose($fp);
				}
                        }

            }
	}
	
	public function db_read_company_data($company_id) {
		$db = TAWDBI::singleton();
		
		$info = $db->sp("vision2020", "GetCompany", array(
			"CompanyID"=>$company_id
		));
		
		return $info[0];
	}

}
?>