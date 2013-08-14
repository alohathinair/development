<?php

    require_once(TAWF_ROOT . "/TAWSite.php");
    $invalid = isset($_REQUEST["invalid"]) ? true : false;

    $siteName = isset($_REQUEST["site"]) ? $_REQUEST["site"] : null;
    $site = TAWSiteFactory::getSite($siteName);

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>
            <?php echo $site->getSiteTitle(); ?>
            
        </title>

        <link rel="stylesheet" type="text/css" href="/css/login.css"/>
        <link rel="stylesheet" type="text/css" href="<?php echo $site->getSiteCSS(); ?> "/>
        <!--script src='http://tawfdev.mythinairwireless.com/components/util/jQuery/js/jquery-current.min.js'></script-->
        <script src='http://code.jquery.com/jquery-1.9.1.js'></script>

    </head>
    <body>

        <script type="text/javascript">
            $(document).ready(function(){

                $("#contactus").click(function(){
                    if ($("#contactForm").is(":hidden")){
                        var offset = $("#contentNav").offset();
                        $("#contactFormContainer").css({
                            'position': 'absolute',
                            'top': offset.top,
                            'left': offset.left
                        });

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

                $.post("/contact.php", $('#contact-form').serialize(),
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


        <div id="headerWrapper" class="header">

            <div id="fleet-tracker-logo">
                <img style="float:left; margin-left: 10px" id="login-logo" src="<? echo $site->getLoginLogoURL(); ?>" alt="Fleet Tracker"/>
            </div>

            <div id="contactus">
                <span id="contactus-link"><a href="#"><strong>Contact Us</strong></a></span>
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
                            <i><?php echo $site->getSiteDescription(); php?></i>
                        </h1>
                        <br/>
                        <a href="<?php echo $site->getSiteURL(); ?>"><img src="<?php echo $site->getProductLogoURL(); ?>"/></a>
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

                            <div style="float: left">
                                <input id="remember_me" type="checkbox" name="remember_me" value="1" checked />
                            </div>

                            <div style="margin-left: 20px; float: left">
                                Keep me signed in<br/>
                                (Uncheck if on a shared computer)
                            </div>

                            <br/>

                            <input type="submit" name="imgbtnSubmit" value="Login" id="imgbtnSubmit" class="login_Button" onclick="return doLogin();"/>
                            <br/>

                            <input type="hidden" name="site" value="<?php echo $siteName; ?>"/>

                        </div>
                    </div>
                    <?php 
                    if (is_null($siteName)) {                    
                    ?>
	                    <div id="thinairlogo" onclick="location.href='http://www.thinairwireless.com/'"></div>
                    <?php } else { ?>
                    <br/>
                    <?php } ?>
                    <div align="center" style="height: 30px;">
                        <a href="http://www.mozilla.com/en-US/firefox/"><img border="0" src="/images/compatible_firefox.gif" width="31" height="30" alt="Firefox" title="Firefox"/></a>
                        <a href="http://google.com/chrome"><img border="0" src="/images/compatible_chrome.gif" width="31" height="30" alt="Google Chrome" title="Google Chrome"/></a>
                        <a href="http://www.apple.com/safari/"><img border="0" src="/images/compatible_safari.gif" width="28" height="30" alt="Safari" title="Safari"/></a>
                        <a href="http://windows.microsoft.com/en-US/internet-explorer/downloads/ie"><img border="0" src="/images/compatible_ie.gif" width="28" height="30" alt="IE" title="IE"/></a>
                    </div>
                </div>
            </div>
            <div id="footerWrapper">
            </div>
            <div id="container">
                <div id="footer">
                    <p>
                        <strong><a href="<?php echo $site->getSiteURL(); ?>"><?php echo $site->getSiteName(); ?></a></strong><br/>
                        <?php echo $site->getSiteAddress(); ?>
                    </p>
                </div>
            </div>

        </form>


        <img style="display: none; position: absolute; top: 0px; left: 0px;" src="transp.gif"/>


    </body>
</html>
