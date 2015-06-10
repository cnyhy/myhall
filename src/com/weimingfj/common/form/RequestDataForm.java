package com.weimingfj.common.form;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.weimingfj.common.utils.UserSessionBean;
import com.weimingfj.common.web.httpobjects.HttpRequestObject;

/**
 * @author lansb
 *请求信息form
 */
public class RequestDataForm {
	
	/**
	 * 域 <code>MultipleRequestMap</code>
	 * map,请参看HttpRequestObject类定义
	 */
	private Map<String, List<HttpRequestObject>> multipleRequestMap;
	/**
	 * 域 <code>simpleRequestMap</code> 
	 * 针对简单查询的参数集合，格式：Map{name:testname...}
	 */
	private Map<String, String> simpleRequestMap;
	/**
	 * 域 <code>urlSqlMap</code>
	 */
	private Map<String, Object> urlSqlMap;
	
	private UserSessionBean userSession;
	private HttpServletRequest request;
	private HttpServletResponse response;
	/**
	 * 域 <code>uriId</code>
	 * url的唯一ID
	 */
	private String uriId;
	
	private boolean ajaxRequest;//是否是ajax请求
	public String getUriId() {
		return uriId;
	}
	public void setUriId(String uriId) {
		this.uriId = uriId;
	}
	public Map<String, String> getSimpleRequestMap() {
		return simpleRequestMap;
	}
	public void setSimpleRequestMap(Map<String, String> simpleRequestMap) {
		this.simpleRequestMap = simpleRequestMap;
	}
	public Map<String, Object> getUrlSqlMap() {
		return urlSqlMap;
	}
	public void setUrlSqlMap(Map<String, Object> urlSqlMap) {
		this.urlSqlMap = urlSqlMap;
	}
	public Map<String, List<HttpRequestObject>> getMultipleRequestMap() {
		return multipleRequestMap;
	}
	public void setMultipleRequestMap(
			Map<String, List<HttpRequestObject>> multipleRequestMap) {
		this.multipleRequestMap = multipleRequestMap;
	}
	public boolean isAjaxRequest() {
		return ajaxRequest;
	}
	public void setAjaxRequest(boolean ajaxRequest) {
		this.ajaxRequest = ajaxRequest;
	}
	public UserSessionBean getUserSession() {
		return userSession;
	}
	public void setUserSession(UserSessionBean userSession) {
		this.userSession = userSession;
	}
	public HttpServletRequest getRequest() {
		return request;
	}
	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}
	public HttpServletResponse getResponse() {
		return response;
	}
	public void setResponse(HttpServletResponse response) {
		this.response = response;
	}

	
}
