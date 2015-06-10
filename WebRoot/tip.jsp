<%@ page language="java" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
%>
<html>
  <head>
    <title>welcome</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
  </head>
  
  <body>
  	<% 
  		String flag = request.getParameter("flag"); 
  	%>
    <% if("selRole".equals(flag)){%>
    	<p>请选择角色进行操作....</p>
    <% } %>
  </body>
</html>
