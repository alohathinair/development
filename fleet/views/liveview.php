<?php
$u = TAWUser::singleton();
$showCompanyLogo = false;
if (file_exists(APP_ABSOLUTE_PATH . "/images/uploaded/logos/" . $u->get_company_id() . ".jpg"))
    $showCompanyLogo = true;

$showCompanyLogo = false;

ini_set('display_errors',1);
error_reporting(E_ALL);

if ($u->accessLevel == ACCESS_LEVEL_ADMINISTRATOR) { 
    echo '<input type="hidden" value=1 id="all-divisions"/>';
}
?>
    
<div id="liveview-wrapper" style="height: 100%; width: 100%">


    <div id="liveview-map-wrapper">
        <div id="liveview-map">
            <div id="map"></div>
            <div id="street-view"></div>
        </div>
    </div>

    <div id="liveview-panel">
        <div id="liveview-header">
            <div style="margin: 5px 10px;">
                <?php
                if ($showCompanyLogo) {
                    echo "<center><img id='company-logo' src='/images/uploaded/logos/" . $u->get_company_id() . ".jpg'/></center><br/>";
                }
                ?>
                <div style="float:left; width: 150px;white-space: nowrap; text-overflow: ellipsis; overflow: hidden;"><b>User: </b><?php echo $u->name; ?></div>
                <div style="float:right; width: 120px;"><b>Timezone: </b><?php echo $u->get_timezone(); ?></div>
                <div class="clear"></div>
            </div>
            <div id="liveview-navbar">
                <ul>
                    <li><a id="tab-live-button" class="liveview-btn liveview-btn-first liveview-btn-selected" href="#">Live</a></li>
                    <li><a id="tab-history-button" class="liveview-btn liveview-btn-last" href="#">History</a></li>
                </ul>
            </div>

        </div>

        <div id="tabs">

            <div id="tab-live">

                <select name='group' class="liveview-select" id='groups'>
                </select>

                <div class="liveview-data">
                    <div id="vehicles-screen-wrapper">
                        <ul id="vehicles-screen">

                        </ul>
                    </div>

                </div>
                <!--
	                        <h3><a href="#">Notifications</a></h3>
	                        <div>
                <?php $this->render_component_partial("notifications", "global_notifications"); ?>
	                        </div>
	    -->

            </div>

            <div id="tab-history" style="display: none">

                <table id="history-table">

                <tbody>

                <tr><td>
                    <div id="history-date"></div>
                
                </td></tr>
                <tr><td>
                    <select name='groups-history' class="liveview-select" id='groups-history'></select>
                </td></tr>

                <tr><td>
                <select name='history-vehicles-select' class="liveview-select" id='history-vehicles-select'><option value='0'>All Vehicles</option></select><br/>
                </td></tr>
 
                <tr><td style="height:100%; vertical-align: text-top">

                <div class="liveview-data-history" id="liveview-data-history">

                    <ul id="history-vehicles-list"></ul>
                    <ul id="history-action-events-list"></ul>


                </div>

                </td></tr>
 <tr><td>

                <div id="minidash-wrapper">
                    <div id="minidash">
                        <div id="minidash-active-wrapper"><b>Active:</b> <span id="minidash-active">N/A</span></div>
                        <div id="minidash-distance-wrapper"><b>Distance:</b> <span id="minidash-distance">N/A</span></div>
                        <div id="minidash-engine-wrapper"><b>Engine:</b> <span id="minidash-engine">N/A</span></div>
                        <div style="clear: both"></div>
                        <div id="minidash-idle-wrapper"><b>Idle:</b> <span id="minidash-idle">N/A</span></div>
                        <div id="minidash-speeding-wrapper"><b>Speeding:</b> <span id="minidash-speeding">N/A</span></div>
                    </div>
                </div>
    </td></tr>

                </tbody>
                </table>

            </div>


        </div>

    <div  id="liveview-controls">
        <div id="liveview-search-route-wrapper">
            <ul class="liveview-list" id="liveview-search-route">
                <li><a class="liveview-btn liveview-btn-first" href="#" id="toggle-search">Search</a></li>
                <li><a class="liveview-btn liveview-btn-last" href="#" id="toggle-route">Route</a></li>
            </ul>
        </div>
        <div style="clear: both"></div>
        <div>
            <ul class="liveview-list" id="liveview-overlay-controls">
                <li><a class="liveview-btn liveview-btn-first" href="#" id="toggle-geofences">Landmarks</a></li>
                <li><a class="liveview-btn liveview-btn-middle" href="#" id="toggle-traffic">Traffic</a></li>
                <li><a class="liveview-btn liveview-btn-last" href="#" id="toggle-kml">Custom</a></li>
            </ul>
        </div>
        <div style="clear: both"></div>
        <div style="float: left">
            <ul class="liveview-list" style="float: left">
                <li><a class="liveview-btn liveview-btn-first liveview-btn-selected" href="#" id="map-mode-road">Road</a></li>
                <li><a class="liveview-btn liveview-btn-middle" href="#" id="map-mode-hybrid">Satellite</a></li>
                <li><a class="liveview-btn liveview-btn-last" href="#" id="map-mode-terrain">Terrain</a></li>
            </ul>
            <ul class="liveview-list" style="float: left; margin-left: 10px">
                <li><a class="liveview-btn liveview-btn-single" href="#" id="toggle-street-view">Street View</a></li>
            </ul>

        </div>

        <div style="clear: both"></div>
        <div id="liveview-version">Version 3.4</div>

    </div>
    </div>
</div>

<div class="clear"></div>
<div style="display:none;">
    <div id="vehicle-information-container">
        <div id="vehicle-being-viewed"></div>
        <div id="last-report" class="vehicle-last-report">
                <span id="vehicle-state"></span><!-- -- <span id="time-since-last-update"></span>--><br/>
            <span id="vehicle-last-update"></span><br/>
        </div>
        <div id="vehicle-heading-wrapper"></div>
        <div id="vehicle-address"></div>
        <div id="vehicle-geographical-location"></div>
        <button id="tpms-show" class="styled-button-small">TPMS</button>
        <button id="ddm-show" class="styled-button-small">DDM</button>
        <button id="ping-device" class="styled-button-small">Ping</button>
        <br/>
<!--        <button id="device-starter-control" class="styled-button-small">Enable Starter</button>
        <div id="device-starter-message"></div> -->
        <br/>
    </div>
</div>

<div style="display:none;">
    <div id="event-information-container">
        <div id="event-vehicle-driver"></div>
        <div id="event-vehicle-status"></div>
        <div id="event-time"></div>
        <div id="event-duration"></div>
        <div id="event-address"></div>
        <br/>
    </div>
</div>

<div style="display:none;">
    <div id="trail-information-container">
        <div id="trail-vehicle-driver"></div>
        <div id="trail-time"></div>
        <div id="trail-heading"></div>
        <div id="trail-address"></div>
        <br/>
    </div>
</div>

<div style="display:none;">
    <img src='/images/ajax-loader.gif' alt='Loading...'/>
</div>

<div id="search-query" class="map-overlay" style="display:none;">
    <form action="#" id="search-query-form">
        <input type="text" class="styled-text" id="search-text"><button id="search-button" class="styled-button" type="submit">Search</button><button id="search-reset-button" class="styled-button" type="button">Reset</button>
    </form>
</div>

<div id="search-result" class="map-overlay" style="display:none;">
    <h4><div id="search-result-title"></div></h4>
    <div id="search-result-data"></div>
</div>

<div id="route-query" class="map-overlay" style="display:none;">
    Click on Map to Add Point or Enter Address
    <div><input type="text" class="styled-text" id="route-address"><button id="route-add-button" class="styled-button">Add</button><button id="route-button" class="styled-button">Route</button><button class="styled-button" id="route-reset-button">Reset</button></div>
    <div id="route-options">
        <input type="checkbox" id="route-optimize" name="optimize" checked="checked" />&nbsp;Optimize
        <input type="checkbox" id="route-highways" name="highways" />&nbsp;Avoid Highway
        <input type="checkbox" id="route-tolls" name="tolls" />&nbsp;Avoid Toll
    </div>
</div>

<div id="ddm-dialog" class="form-dialog">
    <div id="ddm-container">
    </div>
</div>

<?php $this->render_component_partial("liveview", "tpms_dialog"); ?>