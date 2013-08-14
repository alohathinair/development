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

        <script type="text/javascript">
            $(document).ready(function(){

                $("#contactus").click(function(){
                    if ($("#contactForm").is(":hidden")){
                        $("#contactForm").slideDown("slow");
                    }
                    else{
                        $("#contactForm").slideUp("slow");
                    }
                });

            });

            function closeForm(){

                $("#messageSent").html("Sending Message...");
                $("#messageSent").show();

                $.post("/ajax.php", $('#contact-form').serialize(),
                function(data) {
                    if (data.success) {
                        $("#messageSent").html("Your message has been sent successfully!");
                        setTimeout('$("#messageSent").hide();$("#contactForm").slideUp("slow")', 3000);
                    }
                    else {
                        alert("There was a problem with the request.");
                        $("#messageSent").hide();

                    }
                }, "json");
            }

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

            <div id="fleet-tracker-logo">
                <img style="float:left; margin-left: 10px" src="/images/v3-header.png" alt="Fleet Tracker" height="45"/>
            </div>

            <div id="contactus">
                <a href="#"><strong>Contact Us</strong></a>
            </div>

        </div>

        <div id="contactFormContainer">
            <div id="contactForm-wrapper">
                <form id="contact-form" name="contact-form">
                    <input type="hidden" name="action" value="contact_us"/>
                    <div id="contactForm">
                        <br/>
                        <h2>Contact Us</h2>
                        <fieldset>
                            <label for="Name">Name *</label>
                            <input id="name" name="name" type="text" />
                            <label for="Email">Email address *</label>
                            <input id="Email" name="email" type="text" />
                            <label for="Company">Company *</label>
                            <input id="Company" name="company" type="text" />
                            <label for="Phone">Phone</label>
                            <input id="Phone" name="phone" type="text" />
                            <label for="Message">Your message *</label>
                            <textarea id="Message" name="message" rows="3" cols="20"></textarea>
                        </fieldset>
                        <input id="sendMail" type="button" value="SUBMIT" name="sendMail" onclick="closeForm()" />
                        <br/>
                        <div id="messageSent"></div>

                    </div>
                </form>

            </div>
        </div>

        <form name="LoginForm" method="post" action="/login.php" onsubmit="javascript:return doLogin();" id="LoginForm">

            <div id="container">
                <div id="contentWrapper">
                    <div id="content">
                        <h1>
                            Beyond GPS Tracking
                        </h1>
                        <br/>
                        <a href="http://www.thinairwireless.com/"><img src="login_image.jpg"/></a>
                    </div>
                </div>
                <div id="contentNavWrapper">
                    <div id="contentNav">
                        <div id="loginBox">
                            <h2>Login</h2>
                            <div id="vsErrors" style="color:Red">
                                <?php if ($invalid) {
                                ?> 
                                    Invalid Username or Password
                                <?php } ?>
                            </div>
                            <input type="hidden" id="newlogin" name="newlogin" value="yes"/>
                            <br/>
                            Email address:<br/>
                            <input id="email" name="email" type="text" style="width:200px;"/>
                            <br/><br/>
			    Password:<br/>
                            <input id="password" type="password" name="password" style="width:200px;" />
                            <br/><br/>
                            Remember me:<br/>
                            <input id="remember_me" type="checkbox" name="remember_me" value="1" checked />
                            <br/>

                            <input type="submit" name="imgbtnSubmit" value="Login" id="imgbtnSubmit" class="login_Button" onclick="return doLogin();"/>
                            <br/>

                            <div id="password-recovery">If you do not have your username and/or password, please call 832.300.3440</div>

                        </div>
                    </div>
                    <div id="thinairlogo" onclick="location.href='http://www.thinairwireless.com/'"></div>
                    <div align="center" style="height: 30px;">
                        <a href="http://www.mozilla.com/en-US/firefox/"><img border="0" src="/images/compatible_firefox.gif" width="31" height="30" alt="Firefox" title="Firefox"/></a> 
                        <a href="http://www.microsoft.com/windows/internet-explorer/default.aspx"><img border="0" src="/images/compatible_chrome.gif" width="31" height="30" alt="Google Chrome" title="Google Chrome"/></a>
                        <a href="http://www.apple.com/safari/"><img border="0" src="/images/compatible_safari.gif" width="28" height="30" alt="Safari" title="Safari"/></a>
                    </div>
                </div>
            </div>
            <div id="footerWrapper">
            </div>
            <div id="container">
                <div id="footer">
                    <p>
                        <strong><a href="http://www.thinairwireless.com/">ThinAir Wireless</a></strong><br/>
                        5821 W. Sam Houston Pkwy - Suite 500 - Houston, Texas 77041<br/>
                        Phone: 1-877-222-1380<br/>
			Copyright. All rights reserved.
                    </p>
                </div>
            </div>

        </form>


        <img style="display: none; position: absolute; top: 0px; left: 0px;" src="transp.gif"/>


    </body>
</html>
