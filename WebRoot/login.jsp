<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="javax.servlet.http.Cookie"%>
<!DOCTYPE html>
<%
	//String path = request.getContextPath();
	//String login = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/login.jsp";
	//String logout = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/login.jsp?err=4";
	String err = request.getParameter("err");
	String usercode = "";
	String passwd = "";
	String save = "";
	Cookie[] cookies = request.getCookies();
	if(cookies != null && cookies.length > 0) {
		for(Cookie cookie : cookies) {
			if(cookie != null && cookie.getName() != null) {
				if("weiming-jydt-usercode".equals(cookie.getName())) {//自动登录
					if(cookie.getValue() != null) {
						usercode = new String(org.apache.commons.codec.binary.Base64.decodeBase64(java.net.URLDecoder.decode(cookie.getValue(), "UTF-8")),"UTF-8");
					}
					save = "checked";
				}
				if("weiming-jydt-passwd".equals(cookie.getName())) {//自动登录
					if(cookie.getValue() != null) 
						passwd = new String(org.apache.commons.codec.binary.Base64.decodeBase64(java.net.URLDecoder.decode(cookie.getValue(), "UTF-8")),"UTF-8");
				}
			}
		}
	}
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="data-spm" content="a2107">
<title>XXX</title>
<meta name="viewport"
	content="width=device-width, initial-scale=1, maximum-scale=1">
<link rel="stylesheet" type="text/css" href="${resRoot}/css/login_style.css">
<script type="text/javascript" src="${resRoot}/js/jquery-1.7.2.min.js"></script>
<script type="text/javascript">
		if(window.top != window) window.top.location.href=window.location.href;
		if("<%=err%>" == "1") {
			alert("登录失败，用户名、密码有误或者该用户已经失效，请重新输入！");
		} else if("<%=err%>" == "2") {
			alert("SESSION超时，请重新登陆！");
		} else if("<%=err%>" == "3") {
			alert("你无权限访问该页面！");
		} else if("<%=err%>" == "5") {
			alert("验证码输入错误！");
		}
		
		$(document).ready(function(){
			document.getElementById('autologin').addEventListener('click',function(event){
				var name=" weiming-jydt-usercode";
				var pwd=" weiming-jydt-passwd";
				if(this.checked)return;
				console.log('begin');
				var cookieArray=document.cookie.split(';');
				var date=new Date(); 
				date.setTime(date.getTime()-20000); 
				for(var i=0;i<cookieArray.length;i++){
					var d=cookieArray[i].split('=');
					if(d[0] == ' weiming-jydt-usercode'){
						document.cookie=name+"="+escape('')+";path=/;expires="+date.toGMTString(); 
					}
					if(d[0] == ' weiming-jydt-passwd'){
						document.cookie=pwd+"="+escape('')+";path=/;expires="+date.toGMTString(); 
					}
				} 
			},false);
		});
</script>
<script type="text/javascript">
	function submitForm() {
		if (!$('#usercode').val()) {
			//alert("用户名不能为空！");
			return false;
		} else if (!$('#passwd').val()) {
			//alert("密码不能为空！");
			return false;
		} else {
			$('#form1').submit();
		}
	}
</script>
</head>
<body style="position: relative; margin-top: 0px ! important;">
	<form name="form1" id="form1" action="${ctxPath}/topic/login" onsubmit="submitForm();" method="post">
									<input type="hidden" name="returnUrl" value="${param.returnUrl}"/>
		<table border="0" cellpadding="0" cellspacing="0" height="100%"
			width="100%"> 
			<tbody>
				<tr height="70">
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td>
						<div class="con">
							<div class="login">
								<div class="b_left"></div>
								<div class="input">
									<table border="0" cellpadding="0" cellspacing="1" width="100%">
										<tbody>
											<tr>
												<td height="60">&nbsp;</td>
											</tr>
										</tbody>
									</table>

									<table class="logTb" border="0" cellpadding="0" cellspacing="0"
										width="100%">
										<tbody>
											<tr>
												<th>用户名</th>
												<td><input type="text" 
													name="usercode" id="usercode" class="input-border"
													value="<%=usercode %>" maxlength="32" tabindex="1"/>
												</td>
												<td></td>
											</tr>
											<tr>
												<th>密&nbsp;&nbsp; 码</th>
												<td width="90"><input type="password"
											aria-labelledby="password-label" name="passwd" id="passwd" value="<%=passwd %>"
											class="input-border" maxlength="20" tabindex="2"/> 
												</td>
												<td>&nbsp;</td>
											</tr>
											<tr>
												<th></th>
												<td width="90"><input type="checkbox" <%=save %> 
											id="autologin" tabindex="4" name="autologin"><label
											for="J_SafeLoginCheck">记住用户名密码，下次免输入</label> 
												</td>
												<td>&nbsp;</td>
											</tr>
											<tr>
												<th>&nbsp;</th>
												<td
													style="PADDING-LEFT: 6px; PADDING-BOTTOM: 10px; LINE-HEIGHT: 22px; PADDING-TOP: 0px"
													colspan="2">
													<div class="Sel_Ver">
														<input name="BtnLogin" value="" id="BtnLogin" 
															class="login-b" onmousedown="this.className='login-b3'"
															onmouseover="this.className='login-b2'"
															onmouseout="this.className='login-b'" type="submit"></input>

													</div></td>
											</tr>
											<tr>
												<th>&nbsp;</th>
												<td colspan="2">
													<div class="reg"></div></td>
											</tr>
										</tbody>
									</table>
								</div>
								<div class="b_right"></div>
							</div>
						</div></td>
				</tr>


				<tr height="141">
					<td>
						<div style="CLEAR: both; WIDTH: 100%; HEIGHT: 141px">
							<div class="bottom">
								<div style="MARGIN: auto; WIDTH: 895px">
									<div class="show">
										<div class="show-word">
											<p class="show-title">&nbsp;</p>
										</div>
									</div>
									<div class="show">
										<div class="show-word">
											<p class="show-title">&nbsp;</p>
										</div>
									</div>
									<div class="show">
										<div class="show-word">
											<p class="show-title">&nbsp;</p>
										</div>
									</div>
									<div class="pronun">
										<ul>
											<li></li>
										</ul>
									</div>
								</div>
							</div>
						</div></td>
				</tr>
			</tbody>
		</table>
	</form>
</body>
</html>