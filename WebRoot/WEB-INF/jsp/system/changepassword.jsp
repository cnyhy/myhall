<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title></title>
<script type="text/javascript">
    function submitCheck(obj){
    	if($("input[name='USER_PWD1']").val() != $("input[name='USER_PWD2']").val()) {
    		alertMsg.info("两次密码不一致！");
    		return false;
    	}
    	if($("input[name='USER_PWD1']").val().length>20||$("input[name='USER_PWD1']").val().length<6){
    		alertMsg.info("密码长度不能小于6位或者大于20位！");
    		return false;
    	}
		return validateCallback(obj,serviceValidateCallback)
	}
</script>

<body>
	<form class="pageForm required-validate" onsubmit="return submitCheck(this)" id="form" 
		action="${ctxPath}/topic/exec/passwordSave" method="post" novalidate="novalidate">
		<div class="pageFormContent" layoutH="58">
			<div class="unit">
				<label>账号:</label>
				<input name="USER_CODE1" type="text" id="USER_CODE1" disabled="disabled" value="${sessionScope.SESSION_USER_LOGIN_INFO.userCode}"  class="required" />
			</div>
			<div class="unit">
				<label>姓名:</label>
				<input disabled="disabled"
					name="USER_CODE1" type="text" id="USER_NAME" value="${sessionScope.SESSION_USER_LOGIN_INFO.userName}" class="required" />
			</div>
			<div class="unit">
				<label>原密码:</label>
				<input name="OLD_PASSWORD" type="password" id="OLD_PASSWORD" ltype="text" class="required"/>
			</div>
			<div class="unit">
				<label>新密码:</label>
				<input 
					name="USER_PWD1" type="password" id="USER_PWD1" ltype="text" class="required"/>
			</div>
			<div class="unit">
				<label>确认新密码:</label>
				<input 
					name="USER_PWD2" type="password" id="USER_PWD2" ltype="text" class="required"/>
			</div>
		</div>
		<div class="formBar">
			<ul style="float: left;">
				<li><div class="buttonActive"><div class="buttonContent"><button type="submit">提交</button></div></div></li>
				<li><div class="button"><div class="buttonContent"><button type="button" class="close">取消</button></div></div></li>
			</ul>
		</div>
	</form>
</body>
</html>