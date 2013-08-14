<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $this->get_text("login"); ?></title>
<link href="http://<?php echo WWW_HOST; ?>/css/login.css" rel="stylesheet" type="text/css" />
</head>
<body>
<br /><br />
<br /><br />



<div id="wrapper-login">
  <div class="inner">
  <form method="post">
    <table width="100%" border="0" cellspacing="0" cellpadding="2">
      <tr>
        <td><?php echo $this->get_text("email_address"); ?></td>
      </tr>
      <tr>
        <td><input name="email" type="text" class="txtfield" id="textfield" /></td>
      </tr>
      <tr>
        <td><?php echo $this->get_text("password"); ?></td>
      </tr>
      <tr>
        <td><input name="password" type="password" class="txtfield" id="textfield2" /></td>
      </tr>
      <tr>
        <td align="left"><input name="button" type="submit" class="btn" id="button" value="<?php echo $this->get_text("login"); ?>" /></td>
      </tr>
    </table>
    </form>
  </div>


  <div class="lostpw">
    <!--<p>Lost Your Username or Password? <a href="#">Click Here</a></p>-->
</div>
</div>
</body>
</html>
