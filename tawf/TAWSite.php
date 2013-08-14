<?php

abstract class TAWSite {

    public function getLoginLogoURL() {
        return $this->getLogoURL();
    }

    public abstract function getLogoURL();
    public abstract function getLoginURL();
    public abstract function getSiteCSS();

    public abstract function getSiteDescription();
    public abstract function getSiteTitle();
    public abstract function getSiteURL();
    public abstract function getSiteName();
    public abstract function getSiteAddress();
    public abstract function getProductLogoURL();
}

class TAWSiteFleetTracker extends TAWSite {

    public function getLogoURL() { return "/images/v3-header.png"; }
    public function getLoginURL() { return "/login.php"; }
    public function getSiteCSS() { return "/css/master_fleet_tracker.css"; }
    public function getSiteTitle() { return "Fleet Management System";}
    public function getSiteDescription() { return "Beyond GPS Tracking"; }
    public function getSiteURL() { return "http://www.thinairwireless.com/"; }
    public function getSiteName() { return "ThinAir Wireless"; }
    public function getSiteAddress() { return "11111 Katy Freeway, Suite 910 | Houston, TX 77079, USA | Contact Support: 888-343-0003<br/>Copyright. All rights reserved."; }
    public function getProductLogoURL() { return "/images/login_image.jpg"; }
}

class TAWSiteFleetSafetyTrax extends TAWSite {
    public function getLoginLogoURL() { return "/images/SafetyTraxAVL_Large.png";  }
    public function getLogoURL() { return "/images/SafetyTraxAVL.png"; }
    public function getLoginURL() { return "/login.php?site=SafetyTrax"; }    
    public function getSiteCSS() { return "/css/master_safety_trax.css"; }
    public function getSiteTitle() { return "SafetyTrax"; }
    public function getSiteDescription() { return "Equipping vehicle fleets since 1993"; }
    public function getSiteURL() { return "http://www.safetyvision.com/"; }
    public function getSiteName() { return "Safety Vision"; }
    public function getSiteAddress() { return "Phone: 800.880.8855<br/>Copyright. All rights reserved."; }
    public function getProductLogoURL() { return "/images/SVLogo.png"; }
}

class TAWSitePTS extends TAWSiteFleetTracker {
    public function getLoginLogoURL() { return "/images/PrecisionTrackingLogo.png";  }
    public function getLogoURL() { return "/images/PrecisionTrackingLogo.png"; }
    public function getLoginURL() { return "/login.php?site=pts"; }
    public function getSiteCSS() { return "/css/master_pts.css"; }
    public function getSiteTitle() { return "Precision Tracking Solutions"; }
    public function getSiteDescription() { return "Solutions for the Real World"; }
    public function getSiteURL() { return "http://www.ptstracking.com/"; }
    public function getSiteName() { return "Precision Tracking Solutions, Inc."; }
    public function getSiteAddress() { return ""; }
   // public function getProductLogoURL() { return "/images/SVLogo.png"; }
}

class TAWSiteLSM extends TAWSiteFleetTracker {
    public function getLoginLogoURL() { return "/images/LSMLogoLarge.png";  }
    public function getLogoURL() { return "/images/LSMLogo.png"; }
    public function getLoginURL() { return "/login.php?site=lsm"; }
    public function getSiteCSS() { return "/css/master_lsm.css"; }
    public function getSiteTitle() { return "LSM Technologies"; }
    public function getSiteDescription() { return "On the Move!"; }
    public function getSiteURL() { return "http://www.lsmtechnologies.com.au/"; }
    public function getSiteName() { return "LSM Technologies PTY LTD"; }
    public function getSiteAddress() { return "1/ 29 Collinsvale Street Rocklea QLD 4106 AUSTRALIA  Ph: +61 (0)7 3277 6233"; }
   // public function getProductLogoURL() { return "/images/SVLogo.png"; }
}

class TAWSiteFactory {

    static protected $site = null;

    /**
     *  @return TAWSite the site
     */
    public static function getSite($siteName = null) {
        
        if (TAWSiteFactory::$site)
            return TAWSiteFactory::$site;

        if ($siteName == null) {
            if (isset($_SESSION["tawsite"])) {
                $siteName = $_SESSION["tawsite"];
            } else if (strpos($_SERVER["SERVER_NAME"], "ptstracking")) {
                $siteName = "pts";
            } else {
                $siteName = "FleetTracker";
            }
        }

        
        if ($siteName === "SafetyTrax") {
            TAWSiteFactory::$site = new TAWSiteFleetSafetyTrax();
        } else if ($siteName === "pts") {
            TAWSiteFactory::$site = new TAWSitePTS();
        } else if ($siteName === "lsm") {
            TAWSiteFactory::$site = new TAWSiteLSM();
        } else {
            TAWSiteFactory::$site = new TAWSiteFleetTracker();
        }


        return TAWSiteFactory::$site;

    }
}

?>
