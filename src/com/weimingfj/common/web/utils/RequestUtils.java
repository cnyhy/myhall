package com.weimingfj.common.web.utils;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONObject;

import com.weimingfj.common.form.RequestDataForm;
import com.weimingfj.common.utils.Environment;
import com.weimingfj.common.utils.PubFun;
import com.weimingfj.common.web.httpobjects.HttpRequestObject;
import com.weimingfj.common.web.httpobjects.ServletInputStreamParse;


/**
 * @author lansb
 *
 */
public class RequestUtils {

	//private static Log logger = LogFactory.getLog(RequestUtils.class);
	/**
	 * 处理http请求
	 *@param request
	 *@return RequestDataForm
	 *@throws Exception
	 */
	public static RequestDataForm getRequestDataForm(HttpServletRequest request) throws Exception{
		RequestDataForm requestDataForm = new RequestDataForm();
		String type = RequestUtils.getExtractType(request);
		if (type == null 
				|| !type.toLowerCase().startsWith("multipart/form-data")) {
			RequestUtils.getHttpRequestInfo(request, requestDataForm);
		} else {//附件上传方式
			ServletInputStreamParse input = new ServletInputStreamParse(request);
			input.getHttpRequestInfo(requestDataForm);
		}
		return requestDataForm; 
	}

	/**
	 * get request enctype type
	 * 
	 * @param request
	 * @return
	 * @throws IOException
	 */
	public static String getExtractType(HttpServletRequest request)
			throws IOException {
		String type = null;
		String type1 = request.getHeader("Content-Type");
		String type2 = request.getContentType();
		if (type1 == null && type2 != null) {
			type = type2;
		} else if (type2 == null && type1 != null) {
			type = type1;
		} else if (type1 != null && type2 != null) {
			type = (type1.length() > type2.length() ? type1 : type2);
		}
		return type;
	}

	// ---------form enctype !=
	// multipart/form-data--------------------------------------------------
	/**
	 * get LinkedHashMap key=lsh ,value=HttpRequestObject form enctype !=
	 * multipart/form-dat
	 */
	public static void getHttpRequestInfo(HttpServletRequest request,
			RequestDataForm requestDataForm) throws Exception {
		Map<String, List<HttpRequestObject>> multipleRequestMap = new LinkedHashMap<String, List<HttpRequestObject>>();
		Map<String, String> simpleRequestMap = new HashMap<String, String>();
		@SuppressWarnings("rawtypes")
		Enumeration names = request.getParameterNames();
		while (names.hasMoreElements()) {
			String name = (String) names.nextElement();
			String[] values = request.getParameterValues(name);
			if("arg".equals(name)){
				String json = request.getParameter(name);
				if(!PubFun.isBlankOrNull(json)){
					JSONObject jObject = JSONObject.fromObject(json);
					simpleRequestMap.putAll((Map<String, String>) jObject);
				}
			}
			if (null == values) {
				HttpRequestObject hro = new HttpRequestObject();
				hro.setParamType("param");
				hro.setName(name);
				hro.setValue("".getBytes(Environment.ENCODING));
				simpleRequestMap.put(name, "");
			} else {
				for (String value : values) {
					HttpRequestObject hro = new HttpRequestObject();
					hro.setParamType("param");
					hro.setName(name);
					hro.setValue(null == value ? "".getBytes(Environment.ENCODING) : value
							.getBytes(Environment.ENCODING));
					simpleRequestMap.put(name, value);
					if(multipleRequestMap.containsKey(name)) {
						List<HttpRequestObject> list = multipleRequestMap.get(name);
						list.add(hro);
						multipleRequestMap.put(name, list);
					} else {
						List<HttpRequestObject> list = new LinkedList<HttpRequestObject>();
						list.add(hro);
						multipleRequestMap.put(name, list);
					}
				}
			}
		}
		requestDataForm.setMultipleRequestMap(multipleRequestMap);
		requestDataForm.setSimpleRequestMap(simpleRequestMap);
	}

	/**
	 * put request param to HashMap param must be single String form enctype !=
	 * multipart/form-dat
	 * 
	 * @param request
	 * @return HashMap key=value, name=StringValue
	 * @throws UnsupportedEncodingException 
	 */
	public static Map<String, String> getSimpleParameter(HttpServletRequest request) throws UnsupportedEncodingException {
		Map<String, String> map = new HashMap<String, String>();
		@SuppressWarnings("rawtypes")
		Enumeration names = request.getParameterNames();
		while (names.hasMoreElements()) {
			String key = (String) names.nextElement();
			String value = request.getParameter(key);
			value = value == null ? "" : value.trim(); 
			map.put(key, value);
		}
		return map;
	}

}
