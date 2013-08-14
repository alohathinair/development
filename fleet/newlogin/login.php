<?php
$invalid = isset($_REQUEST["invalid"]) ? true : false;
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>

        <title>
           Fleet Managment System
        </title>

        <link rel="stylesheet" type="text/css" href="login.css"/>
        <script src='http://tawfdev.mythinairwireless.com/components/util/jQuery/js/jquery-current.min.js'></script>

    </head>
    <body>

        <form name="LoginForm" method="post" action="/login.php" onsubmit="javascript:return doLogin();" id="LoginForm">

            <script type="text/javascript">

                function doLogin() {

                    if ($("#email").val() == "") {
                        $("#vsErrors").html('You must enter an Email to continue.');
                        $("#vsErrors").show();
                        return false;
                    }

                    if ($("#password").val() == "") {
                        $("#vsErrors").html('You must enter a Password to continue.');
                        $("#vsErrors").show();
                        return false;
                    }

                    $("#vsErrors").hide();
                    return true;
                }
            </script>


            <div id="headerWrapper">
                <div id="contactus">
                    <a href="mailto:support@thinairwireless.com"><strong>Contact Us</strong></a>
                </div>
            </div>
            <div id="container">
                <div id="contentWrapper">
                    <div id="content">
                        <h1>
                            Equipping vehicle fleets with onboard camera systems since 1993.
                        </h1>
                        <br/>
                        <a href="http://www.safetyvision.com/"><img src="Images/SVLogo.png"/></a>
                    </div>
                </div>
                <div id="contentNavWrapper">
                    <div id="contentNav">
                        <div id="loginBox">
                            <h2>Login</h2>
                            <div id="vsErrors" style="color:Red">
                            <?php if ($invalid) { ?>
                            Invalid Username or Password
                            <?php } ?>
                            </div>
                            <input type="hidden" id="mobilecontrol" name="mobilecontrol" value="yes"/>
                            <br/>
                            Email address:<br/>
                            <input id="email" name="email" type="text" style="width:200px;"/>
                            <br/><br/>
			    Password:<br/>
                            <input id="password" type="password" name="password" style="width:200px;" />
                            <input type="submit" name="imgbtnSubmit" value="Login" id="imgbtnSubmit" class="login_Button" onclick="return doLogin();"/>
                            <br/>
                            <br/>

                        </div>
                    </div>
                    <div id="thinairlogo" onclick="location.href='http://www.thinairwireless.com/'"></div>
                    <div align="center" style="height: 30px;">
                        <a href="http://www.mozilla.com/en-US/firefox/">
                            <img border="0" src="compatible_firefox.gif" width="31" height="30" alt="Firefox" title="Firefox"/></a> <a href="http://www.microsoft.com/windows/internet-explorer/default.aspx">
                            <img border="0" src="compatible_chrome.gif" width="31" height="30" alt="Google Chrome" title="Google Chrome"/></a> <a href="http://www.apple.com/safari/">
                            <img border="0" src="compatible_safari.gif" width="28" height="30" alt="Safari" title="Safari"/></a>
                    </div>
                </div>
            </div>
            <div id="footerWrapper">
            </div>
            <div id="container">
                <div id="footer">
                    <p>
                        <strong>
                            <a href="http://www.thinairwireless.com/">ThinAir Wireless</a></strong><br/>
					Copyright
					. All rights reserved.</p>

                </div>
            </div>

        </form>


        <img style="display: none; position: absolute; top: 0px; left: 0px; " src="transp.gif"/>


    </body></html>
