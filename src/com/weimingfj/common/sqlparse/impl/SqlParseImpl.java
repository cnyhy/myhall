package com.weimingfj.common.sqlparse.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.weimingfj.common.exception.CustomException;
import com.weimingfj.common.sqlparse.ISqlParse;
import com.weimingfj.common.sqlparse.SqlResultForm;
import com.weimingfj.common.utils.Environment;
import com.weimingfj.common.utils.UserSessionBean;

/**
 * @author lansb sql parse
 */
@Component("sqlParse")
public class SqlParseImpl implements ISqlParse { 
	// private static Logger logger = Logger.getLogger("sqlparse");
	public SqlResultForm parseNode(Node element,
			Map<String, String> simpleRequestMap, UserSessionBean userSession)
			throws Exception {  
		StringBuffer sb = new StringBuffer("");
		parseDynamicTags(element, sb, simpleRequestMap); // 获得原始的sql并存入对象sb
		SqlResultForm srf = new SqlResultForm(); 
		String orisql = sb.toString().replaceAll("( +)", " ").trim();
		srf.setOriSql(orisql);
		String parsedSql = orisql;
		parsedSql = replaceUserInfo(parsedSql, simpleRequestMap, userSession);//替换登陆用户信息
		CharSequence cs = parsedSql;
		//替换${}，替换为原始字符串
		Pattern pattern = Pattern.compile("\\$\\{(.*?)\\}", Pattern.DOTALL);//
		Matcher matcher = pattern.matcher(cs);
		String content = "";
		while (matcher.find()) {
			content = matcher.group();
			String key = content.replace("${", "").replace("}", "");// 获取字段名称
			String value = simpleRequestMap.get(key);
			parsedSql = parsedSql.replace(content, value.replace("'", "''").replace(" ", ""));//替换sql特殊字符
		}
		//替换#{}
		cs = parsedSql;
		pattern = Pattern.compile("#\\{(.*?)\\}", Pattern.DOTALL);
		matcher = pattern.matcher(cs);
		List<String> keyList = new ArrayList<String>();// 待替换的变量
		List<Object> valueList = new ArrayList<Object>();// 存放执行的值
		while (matcher.find()) {
			content = matcher.group();
			parsedSql = parsedSql.replace(content, "?");
			content = content.replace("#{", "").replace("}", "");// 获取字段名称
			String[] contentarr = content.split(",");//格式为#{aaa, string}或者#{aaa}；后者默认为string格式
			String key = contentarr[0];
			if(!simpleRequestMap.containsKey(key)) {//参数不存在
				throw new CustomException("\r\n\t需要替换的参数:“" + key + "”不存在，请先确定页面存在该参数！");
			}
			if(contentarr.length == 1) {//只有一个为string 
				valueList.add(simpleRequestMap.get(key).replace(" ", ""));
			} else {
				if("string".endsWith(contentarr[1])) {
					valueList.add(simpleRequestMap.get(key).replace(" ", ""));
				} else if ("int".endsWith(contentarr[1])) {
					valueList.add(new Integer(simpleRequestMap.get(key).replace(" ", "")));
				} else if ("float".endsWith(contentarr[1])) {
					valueList.add(new Float(simpleRequestMap.get(key).replace(" ", "")));
				} else if ("double".endsWith(contentarr[1])) {
					valueList.add(new Double(simpleRequestMap.get(key).replace(" ", "")));
				} 
			}
			keyList.add(key);
		}
		srf.setKeyList(keyList);
		srf.setParsedSql(parsedSql);
		srf.setValueList(valueList);
		return srf;
	}
	public SqlResultForm parseString(String orisql, Map<String, String> simpleRequestMap, UserSessionBean userSession) throws Exception {
		//实现如下:
		SqlResultForm srf = new SqlResultForm(); 
		List<String> keyList = new ArrayList<String>();// 待替换的变量
		List<Object> valueList = new ArrayList<Object>();// 存放执行的值
		srf.setOriSql(orisql);
		String parsedSql = orisql; 
		parsedSql = replaceUserInfo(parsedSql, simpleRequestMap, userSession);//替换登陆用户信息
		CharSequence cs = parsedSql;
		// 替换${}，替换为原始字符串
		Pattern pattern = Pattern.compile("\\$\\{(.*?)\\}", Pattern.DOTALL);//
		Matcher matcher = pattern.matcher(cs);
		String content = "";
		while (matcher.find()) {
			content = matcher.group();
			String key = content.replace("${", "").replace("}", "");// 获取字段名称
			String value = simpleRequestMap.get(key);
			parsedSql = parsedSql.replace(content, value.replace("'", "''"));
		}
		// 替换#{}
		cs = parsedSql;
		pattern = Pattern.compile("#\\{(.*?)\\}", Pattern.DOTALL);
		matcher = pattern.matcher(cs);
		while (matcher.find()) {
			content = matcher.group();
			parsedSql = parsedSql.replace(content, "?");
			content = content.replace("#{", "").replace("}", "");// 获取字段名称
			String[] contentarr = content.split(",");
			String key = contentarr[0];
			if (contentarr.length == 1) {// 只有一个为varchar
				valueList.add(simpleRequestMap.get(key));
			} else {
				if ("string".endsWith(contentarr[1])) {
					valueList.add(simpleRequestMap.get(key));
				} else if ("int".endsWith(contentarr[1])) {
					valueList.add(new Integer(simpleRequestMap.get(key)));
				} else if ("float".endsWith(contentarr[1])) {
					valueList.add(new Float(simpleRequestMap.get(key)));
				} else if ("double".endsWith(contentarr[1])) {
					valueList.add(new Double(simpleRequestMap.get(key)));
				}
			}
			keyList.add(key);
		}
		srf.setKeyList(keyList);
		srf.setParsedSql(parsedSql);
		srf.setValueList(valueList);
		return srf;
	}
	/**
	 * 替换登陆用户信息
	 * @param sql
	 * @param parameter
	 * @return
	 * @throws CustomException
	 */
	private String replaceUserInfo(String sql,  Map<String, String> parameter, UserSessionBean userSession) throws CustomException {
		sql = sql.replace(Environment.UUID, UUID.randomUUID().toString());
		if(userSession != null && !"".equals(userSession.getUserCode()))
			return sql.replace(Environment.USER_CODE, userSession.getUserCode())
					.replace(Environment.USER_ID, userSession.getUserId())
					.replace(Environment.REAL_NAME, userSession.getUserName())
					.replace(Environment.DOMAIN_ID, String.valueOf(userSession.getDomainId()));
		else return sql;
	}
	/*
	private String replaceUserInfo(String sql,  Map<String, String> parameter, UserSessionBean userSession) throws CustomException {
		if(userSession != null && !"".equals(userSession.getUserCode()))
			return sql.replace(Environment.USER_CODE, userSession.getUserCode())
					.replace(Environment.USER_ID, userSession.getUserId())
					.replace(Environment.REAL_NAME, userSession.getUserName())
					.replace(Environment.UUID, UUID.randomUUID().toString());
		else return sql;
	}*/
	/**
	 * 组装sql
	 * @param node
	 * @param sbsql
	 * @param parameter
	 * @throws Exception
	 */
	private void parseDynamicTags(Node node, StringBuffer sbsql, Map<String, String> parameter)
			throws Exception {
		NodeList children = node.getChildNodes();
		for (int i = 0, len = children.getLength(); i < len; i++) {
			Node child = (Node) children.item(i);
			String nodeName = child.getNodeName();
			if (child.getNodeType() == Node.TEXT_NODE || child.getNodeType() == Node.CDATA_SECTION_NODE) {
				String data = child.getNodeValue();
				sbsql.append(" " + data.replaceAll("(\t|\n|\r|(\r\n))", "").trim());
				continue;
			} 
			if ("isNotEmpty".equalsIgnoreCase(nodeName))
				isNotEmptyNode((Element) child, sbsql, parameter);
			else if ("isEmpty".equalsIgnoreCase(nodeName))
				isEmptyNode((Element) child, sbsql, parameter);
			else if ("isEqual".equalsIgnoreCase(nodeName))
				isEqualNode((Element) child, sbsql, parameter);
			else if ("isNotEqual".equalsIgnoreCase(nodeName))
				isNotEqualNode((Element) child, sbsql, parameter);
			else 
				new CustomException("\t\n\r error node name : '" + nodeName + "'");
		}
	}

	private void isNotEmptyNode(Element node, StringBuffer sbsql, Map<String, String> parameter)
			throws Exception {
		String property = node.getAttribute("property");
		if("".equals(property)) {
			throw new CustomException("\t\n\r未定义property！");
		}
		if (parameter.get(property) != null && !"".equals(parameter.get(property)))
			parseDynamicTags(node, sbsql, parameter);
	}
	
	private void isEmptyNode(Element node, StringBuffer sbsql, Map<String, String> parameter)
		throws Exception {
		String property = node.getAttribute("property");
		if("".equals(property)) {
			throw new CustomException("\t\n\r未定义property！");
		}
		if (parameter.get(property) == null || "".equals(parameter.get(property)))
			parseDynamicTags(node, sbsql, parameter);
	}
	private void isEqualNode(Element node, StringBuffer sbsql, Map<String, String> parameter)
		throws Exception {
		String property = node.getAttribute("property");
		if("".equals(property)) {
			throw new CustomException("\t\n\r未定义property！");
		}
		String compareProperty = node.getAttribute("compareProperty");
		String compareValue = node.getAttribute("compareValue");
		if("".equals(compareProperty) && "".equals(compareValue)) {
			throw new CustomException("\t\n\r未定义compareProperty或compareValue！");
		}
		if (compareProperty != null && parameter.get(property).equals(parameter.get(compareProperty))) {
			parseDynamicTags(node, sbsql, parameter);
		}
		else if(parameter.get(property).equals(compareValue)) {
			parseDynamicTags(node, sbsql, parameter);
		}
	}
	private void isNotEqualNode(Element node, StringBuffer sbsql, Map<String, String> parameter)throws Exception {
		String property = node.getAttribute("property");
		if("".equals(property)) {
			throw new CustomException("\t\n\r未定义property！");
		}
		String compareProperty = node.getAttribute("compareProperty");
		String compareValue = node.getAttribute("compareValue");
		if("".equals(compareProperty) && "".equals(compareValue)) {
			throw new CustomException("\t\n\r未定义compareProperty或compareValue！");
		}
		if(!compareValue.equals(parameter.get(property))){
			parseDynamicTags(node, sbsql, parameter);
		}else if (!"".equals(compareProperty) && !parameter.get(property).equals(parameter.get(compareProperty))) {
			parseDynamicTags(node, sbsql, parameter);
		}
		/*if (!"".equals(compareProperty) && parameter.get(property).equals(parameter.get(compareProperty))) {
			parseDynamicTags(node, sbsql, parameter);
		}
		else if(parameter.get(property).equals(compareValue)){
			parseDynamicTags(node, sbsql, parameter);
		}*/
	}
	
}
