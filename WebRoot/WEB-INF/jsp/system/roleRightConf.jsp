<%@page language="java" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
	<head>
		<title>角色权限配置</title>
		<link rel="stylesheet" type="text/css" href="${resRoot}/css/iconStyle.css" />
		<link rel="stylesheet" type="text/css" href="${resRoot}/ext2/resources/css/ext-all.css" />
		<link id="theme" rel="stylesheet" type="text/css" href="" />
		
		<script type="text/javascript" src="${resRoot}/js/common.js"></script>
        <script type="text/javascript" src="${resRoot}/ext2/adapter/ext/ext-base.js"></script>
        <script type="text/javascript" src="${resRoot}/ext2/ext-all.js"></script>
		<script type="text/javascript" src="${resRoot}/ext2/source/locale/ext-lang-zh_CN.js"></script>
		<script type="text/javascript" src="${resRoot}/js/ext/Ext.tree.TreeCheckNodeUI.js"></script>
		<script type="text/javascript">
			//document.getElementById("theme").href = parent.document.getElementById("theme").href;
        	var OP_ROLE_ID = '${param.roleId}';
        </script>
	</head>
	<body>
		<script type="text/javascript" src="${resRoot}/js/system/roleRightConf.js"></script>
	</body>
</html>