<?php
require_once(TAWF_ROOT . "/lib/csv/parsecsv.lib.php");

class Landmarks extends TAWComponent {
	public function __construct() {
		parent::__construct("tracking/Landmarks", true);

		$this->add_dependancy("jquery");
		
		$this->add_js("/js/landmarks.js");
	}
	
	public function load($tawf) {
		
		parent::load($tawf);
	}
	
	public function get_company_landmarks() {
		
		$db = TAWDBI::singleton();
		
		$landmarks = $db->read_company_landmarks();
		
		echo json_encode(array("landmarks"=>$landmarks));
	}
	
	public function get_general_landmarks() {
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		
		$landmarks = $db->read_regular_company_landmarks($user->get_company_id());

		echo json_encode(array("landmarks"=>$landmarks));
	} 
	
	public function get_landmark_management_data() {
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		
		$landmarks = $db->read_regular_company_landmarks($user->get_company_id());
		$users = $db->read_company_users($user->get_company_id());
		$company = $db->read_company_data($user->get_company_id());
		
		echo json_encode(array("landmarks"=>$landmarks, "users"=>$users, "company"=>$company));
	}

        public function geocode_address($address) {
             // Try to find the location bases on the address
            $url = "http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=";
            $url .= urlencode($address);
            $data = @file_get_contents($url);
            $jsondata = json_decode($data,true);
            if(is_array($jsondata) && $jsondata['status']=="OK") {
                $lat = $jsondata ['results'][0]['geometry']['location']['lat'];
                $lng = $jsondata ['results'][0]['geometry']['location']['lng'];
                return array("lat"=>$lat, "lng"=>$lng);
            } else
                return NULL;
        }

        public function db_get_company_user_id_from_name($companyID, $name) {
            $db = TAWDBI::singleton();
            $user = TAWUser::singleton();

           // $result = $db->sp("vision2020", "GetCompanyUserIDFromName", array("CompanyID"=>$companyID, "Name" => $name));
            $result = $db->query(sprintf("select vision2020.dbo.GetCompanyUserIDfromName(%d, '%s') as UserID", $companyID, $name));

            if (empty($result))
                return null;

            return $result[0]["UserID"];
        }

        public function import_landmarks() {

            $errors = array();
            $imported = 0;
            $colors = array("red", "green", "blue");

            if (!isset($_FILES["file"])) 
                return;
            
            $db = TAWDBI::singleton();
            $user = TAWUser::singleton();
            
            if (isset($_FILES["file"])) {
                if (is_uploaded_file($_FILES['file']['tmp_name'])) {
                    $tmp = $_FILES['file']['tmp_name'];

                    $csv = new parseCSV();
                    $csv->heading = false;
                    $csv->auto($tmp);

                    $row = 0;
                    foreach ($csv->data as $data) {
                        $num = count($data);
                        $row++;
                        
                        $name = $data[0];
                        $lat = $data[5];
                        $lng = $data[6];
                        $radius = $data[7];
                        $color = $data[8];
                        $driver = $data[9];
                        $address = $data[1];

                        try {


                            if (strlen($name) == 0)
                                throw new Exception("Invalid name");

                            if (!is_numeric($radius))
                                throw new Exception("Invalid radius");

                            if (!in_array(strtolower($color), $colors))
                                throw new Exception("Invalid color");

                            $has_location = is_numeric($lat) && is_numeric($lng);
                            $has_address = strlen($address) > 5;
                            $userID = null;
                            if ($driver) {
                                $userID = $this->db_get_company_user_id_from_name($user->get_company_id(), $driver);
                            }

                            if (!$has_location && !$has_address)
                                throw new Exception("Invalid location or address");

                            if (!$has_location) {
                                $location = $this->geocode_address($address);
                                if (!$location)
                                    throw new Exception("Cannot geocode the address");

                                $lat = $location["lat"];
                                $lng = $location["lng"];

                            }

                            $params = array(
                                "CompanyID"=>$user->get_company_id(),
                                "Name"=>$name,
                                "Latitude"=>$lat,
                                "Longitude"=>$lng,
                                "Radius"=>$radius,
                                "UserColor"=>$color,
                                "Address"=>$address,
                                "AssignedUserID"=>$userID,
                                "IsGlobal"=>0
                            );

                            
                            if ($this->tawf->data["user_id"] == 0) {
                                $params["IsGlobal"] = 1;
                            }

                            
                            $landmark = $db->sp("vision2020", "ImportLandmark", $params);
                            $imported++;

                        } catch (Exception $e) {
                            // First row is probably the header
                            //print_r($e->getMessage());
                            if ($row != 1) {
                                $errors[] = $row;
                            }
                        }
                        
                    }
                    
                }
            }

            $this->tawf->data["landmarks_import_result"] = array("imported" => $imported, "errors" => $errors);


        }

	public function save_landmark() {
		echo 'this is test';
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		
		
		if ($this->tawf->data["type"] == 1) {
			
	
			
			$params = array(
				"CompanyID"=>$user->get_company_id(),
				"FenceName"=>$this->tawf->data["name"],
				"FenceLatitude"=>$this->tawf->data["latitude"],
				"FenceLongitude"=>$this->tawf->data["longitude"],
				"FenceRadius"=>$this->tawf->data["radius"],
				"FenceColor"=>$this->tawf->data["color"],
				"Address"=>$this->tawf->data["address"],
				"AssignedUserID"=>$this->tawf->data["user_id"],
				"IsGlobal"=>0
			);
			
			if ($this->tawf->data["user_id"] == 0) {
				$params["IsGlobal"] = 1;
			}
			//var_dump($params);
			if ($this->tawf->data["id"]) {
				$params["GeoFenceID"] = $this->tawf->data["id"];
				unset($params["CompanyID"]);
				$landmark = $db->sp("vision2020", "UpdateLandmark", $params);
				
				if ($this->tawf->data["format"] == 2) {
					$db->query("EXEC [vision2020].[dbo].[UpdatePolygonGeofence] @GeoFenceID='" . $landmark[0]["GeoFenceID"] . "', @PolygonText='POLYGON(" . $this->tawf->data["polygon"] . ")'");
					$polygon = $db->query("EXEC [vision2020].[dbo].[GetPolygonGeofence] @GeoFenceID='" . $landmark[0]["GeoFenceID"] . "'");
					
					/*
					To parse the polygon string we need to go through a few steps
					First, find the position of the first (. Cut out any text before it.
					Second, cut out the (( in the start and )) at the end
					Third, explode the points into an array using the , separator.
					Fourth, loop through the points and trim the whitespace
					Lastly, break those points into longitude/latitude by exploding on the space character
					*/
					$landmark[0]["polygon"] = array();
					$polyString = substr($polygon[0]["Geog"], strpos($polygon[0]["Geog"], "("));
					$polyString = substr($polyString, 2, -2);
					$unseparatedPoints = explode(",", $polyString);
					
					foreach ($unseparatedPoints as $pid=>$point) {
						$trimmedPoint = trim($point);
						$separatedPoint = explode(" ", $trimmedPoint);
						$landmark[0]["polygon"][] = array("latitude"=>$separatedPoint[1], "longitude"=>$separatedPoint[0]);
					}
				}
				
			} else {
				$landmark = $db->sp("vision2020", "InsertLandmark", $params);
				
				if ($this->tawf->data["format"] == 2) {
					$db->query("EXEC [vision2020].[dbo].[UpdatePolygonGeofence] @GeoFenceID='" . $landmark[0]["GeoFenceID"] . "', @PolygonText='POLYGON(" . $this->tawf->data["polygon"] . ")'");
					$landmark[0]["query"] = "EXEC [vision2020].[dbo].[UpdatePolygonGeofence] @GeoFenceID='" . $landmark[0]["GeoFenceID"] . "', @PolygonText='POLYGON(" . $this->tawf->data["polygon"] . ")'";
					$polygon = $db->query("EXEC [vision2020].[dbo].[GetPolygonGeofence] @GeoFenceID='" . $landmark[0]["GeoFenceID"] . "'");
					
					/*
					To parse the polygon string we need to go through a few steps
					First, find the position of the first (. Cut out any text before it.
					Second, cut out the (( in the start and )) at the end
					Third, explode the points into an array using the , separator.
					Fourth, loop through the points and trim the whitespace
					Lastly, break those points into longitude/latitude by exploding on the space character
					*/
					$landmark[0]["polygon"] = array();
					$polyString = substr($polygon[0]["Geog"], strpos($polygon[0]["Geog"], "("));
					$polyString = substr($polyString, 2, -2);
					$unseparatedPoints = explode(",", $polyString);
					
					foreach ($unseparatedPoints as $pid=>$point) {
						$trimmedPoint = trim($point);
						$separatedPoint = explode(" ", $trimmedPoint);
						if (isset($separatedPoint[1]))
							$landmark[0]["polygon"][] = array("latitude"=>$separatedPoint[1], "longitude"=>$separatedPoint[0]);
					}
				}
			}
		}
		
		// Tags
		if (isset($this->tawf->data["Tags"])) {
			if (is_array($this->tawf->data["Tags"])) {
				$db->sp("vision2020", "DeleteGeofenceTags", array("GeoFenceID"=>$landmark[0]["GeoFenceID"]));
				
				foreach ($this->tawf->data["Tags"] as $tag) {
					$db->sp("vision2020", "InsertGeofenceTag", array("GeoFenceID"=>$landmark[0]["GeoFenceID"], "Tag"=>$tag));
				}
			}
			
			
		}
		
		//$user[0]["permissions"] = $this->read_company_user_permissions($user[0]["CompanyUserID"]);
		
		echo json_encode(array("landmark"=>$landmark[0], "response"=>array()));
	}
	
	public function delete_landmark() {
		$db = TAWDBI::singleton();
		
		$db->sp("vision2020", "DeleteLandmark", array("GeoFenceID"=>$this->tawf->data["id"]));
	}
	
	public function db_read_company_landmarks($company_id) {
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
			$tags = $db->sp("vision2020", "GetGeofenceTags", array("GeoFenceID"=>$landmark["GeoFenceID"]));
			 
			$landmarks[$landmark_id]["tags"] = array();
			
			foreach ($tags as $tag) {
				$landmarks[$landmark_id]["tags"][] = $tag["Tag"];
			}
			
			// Before returning events we must adjust their times from database time to user time
			//$events[$event_id]["EventTimestamp"] = date($db->get_time_format(), strtotime($event["EventTimestamp"])+(3600*$user->get_time_adjustment()));
		}
		
		return $landmarks;
	}
	
	public function db_read_regular_company_landmarks($company_id) {
		// Get our needed singletons
		$user = TAWUser::singleton();
		$db = TAWDBI::singleton();
		
		$landmarks = $db->sp("vision2020", "GetRegularGeofenceByCompanyID", array(
			"CompanyID"=>$company_id
		));
		
		
		foreach ($landmarks as $landmark_id=>$landmark) {
			// If this user is only a dispatcher then we must limit the results to only the users they have access to.
			if ($user->is_dispatcher() && !in_array($landmark["UserID"], $user->get_allowed_view_list())) {
				unset($landmarks[$landmark_id]);
				continue;
			}
			
			// Get the tags
			$tags = $db->sp("vision2020", "GetGeofenceTags", array("GeoFenceID"=>$landmark["GeoFenceID"]));
			 
			$landmarks[$landmark_id]["tags"] = array();
			
			foreach ($tags as $tag) {
				$landmarks[$landmark_id]["tags"][] = $tag["Tag"];
			}
			
			// Change the "Geog" field to be js-ready
			if ($landmark["Geog"] != null) {
				/*
				To parse the polygon string we need to go through a few steps
				First, find the position of the first (. Cut out any text before it.
				Second, cut out the (( in the start and )) at the end
				Third, explode the points into an array using the , separator.
				Fourth, loop through the points and trim the whitespace
				Lastly, break those points into longitude/latitude by exploding on the space character
				*/
				$landmarks[$landmark_id]["polygon"] = array();
				$polyString = substr($landmark["Geog"], strpos($landmark["Geog"], "("));
				$polyString = substr($polyString, 2, -2);
				$unseparatedPoints = explode(",", $polyString);
				
				foreach ($unseparatedPoints as $pid=>$point) {
					$trimmedPoint = trim($point);
					$separatedPoint = explode(" ", $trimmedPoint);
					$landmarks[$landmark_id]["polygon"][] = array("latitude"=>$separatedPoint[1], "longitude"=>$separatedPoint[0]);
				}
				
				
				
			} else {
				$landmarks[$landmark_id]["polygon"] = array();
			}
			
			// Before returning events we must adjust their times from database time to user time
			//$events[$event_id]["EventTimestamp"] = date($db->get_time_format(), strtotime($event["EventTimestamp"])+(3600*$user->get_time_adjustment()));
		}
		
		return $landmarks;
	}
}

?>
