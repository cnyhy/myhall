<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.weimingfj.common.utils.UserSessionBean" %> 
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%
	String err = request.getParameter("err");
	UserSessionBean usb = (UserSessionBean) request.getSession().getAttribute("SESSION_USER_LOGIN_INFO");
	String path = request.getContextPath();
	String logoutPath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/?err=4";
	String loginPage = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/login.jsp";
	System.out.println(err);
	if("4".equals(err)) {//正常退出，注销
		System.out.println(err);
		request.getSession().removeAttribute("SESSION_USER_LOGIN_INFO");
		response.sendRedirect(loginPage); 
	}
%>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		
		<title>welcome</title>
		
		<link rel="stylesheet" type="text/css" href="${resRoot}/ext2/resources/css/ext-all.css" />
		<link rel="stylesheet" type="text/css" href="${resRoot}/css/index.css" />
		<link id="theme" rel="stylesheet" type="text/css" href="" />
		
		<script type="text/javascript" src="${resRoot}/js/common.js"></script>
		<script type="text/javascript" src="${resRoot}/ext2/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="${resRoot}/ext2/ext-all.js"></script>
		<script type="text/javascript" src="${resRoot}/ext2/source/locale/ext-lang-zh_CN.js"></script>
		
		<script type="text/javascript" src="${resRoot}/js/ext/TabCloseMenu.js"></script>
		<script type="text/javascript" src="${resRoot}/js/indexExt.js"></script>
		<script type="text/javascript" src="${resRoot}/js/ext/Ext.ux.util.js"></script>
		<script type="text/javascript" src="${resRoot}/js/ext/Ext.tree.TreeCheckNodeUI.js"></script>
		<script type="text/javascript" src="${resRoot}/js/ext/Ext.ux.form.LovCombo.js"></script>
		
		<script type="text/javascript">
	  		var PAGE_SIZE = 10;
	  		var CTX_PATH = '${ctxPath}';
	  		var RES_PATH = '${resRoot}';
	  		var USER_ID = '<%=usb.getUserId()%>';
	  		var USER_AREA_CODE = '<%=usb.getAreaCode()%>';
	  		var USER_AREA_TYPE = '<%=usb.getAreaType()%>';
	  		var USER_AREA_NAME = '<%=usb.getAreaName()%>';
	  		var SYS_TITLE = "<%=usb.getSystemTitle()%>";
	  		var SYS_BOTTOM = "<%=usb.getSystemBottom()%>";
	  		
	  		var USER_BTN = [];
	  		//LoginDwrService.getUserBtn(function(data){
	  		//	USER_BTN = eval(data);
	  		//});
			var verifyUserBtn = function(extCmp){
				var ub = USER_BTN;
				if(ub){
					for(var i= 0; i< ub.length; i++){
						var btn = extCmp(ub[i]);
						if(btn){
							btn.setDisabled(false);
							btn.show();
						}
					}
				}
			}
			function logout() {
				Ext.MessageBox.confirm("提示信息", "确定要注销?", function(flag) {
					if (flag == "yes") {
						window.location.href = "<%=logoutPath%>";
					}
				});
			}
			function addTab(id, title, url){
				if (tabs.findById('tab'+id)) {
					tabs.activate('tab'+id);
					Ext.MessageBox.confirm("提示信息", "该页面已经打开，是否重新加载?", function(flag) {
						if (flag == "yes") {
							Ext.getDom('frame'+ id).src = url;
						}
					});
				}else{
					var htmlStr = '<IFRAME id="frame'+ id +'" src="' + url
						+ '" frameborder="0" scrolling="no" width="100%" height="100%"/>';
					tabs.add(new Ext.Panel({
						id : 'tab' + id,
						title : title,
						border : false,
						html : htmlStr,
						closable : true
					})).show();
				}
			}
			
			var getDictStoreByMainCode = function(mainCode){
				return new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
						url : CTX_PATH + '/topic/ajax/getDictList',
						method : 'post'
					}),
					baseParams : {'mainCode': mainCode},
					reader : new Ext.data.JsonReader({
						fields : [
			    			{name : 'code', type : 'string' },
			    			{name : 'text', type : 'string' }
						]
					})
				});
			};
		</script>
	</head>
	
	<body>
		<table id="north" width="100%" border="0" cellpadding="0" cellspacing="0">
		  <tr>
		    <td valign="top" style="background:url(${resRoot}/images/sys_title_yyt_left.png) no-repeat top left; width:237px; height:67px;">
		    	<!-- <div style="background:url(${resRoot}/images/sys_logo_yyt11.png) no-repeat top left; height:67px; background-position:20px 13px;">&nbsp;</div> -->
		    </td>
		    <td style="background:url(${resRoot}/images/sys_title_yyt_right.png) no-repeat top right;">
		    	<div id="topMenu" style="text-align:left; padding:2 20 0 20;">&nbsp;</div>
		    </td>
		    <td style="width:60;background:url(${resRoot}/images/sys_title_yyt_right_right.gif) repeat-x top;">
		    	<a href="javascript: logout();" title="退出系统"><img src="${resRoot}/images/exit.png" /></a>
		    </td>
		  </tr>
		</table>
		<div style="width:100%; height:100%;" id="container"></div>
	</body>
</html>