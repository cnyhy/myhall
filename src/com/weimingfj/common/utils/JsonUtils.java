package com.weimingfj.common.utils;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONException;
import net.sf.json.JSONNull;
import net.sf.json.JSONObject;

import org.codehaus.jackson.map.ObjectMapper;


/**
 * @author lansb
 * jackson utils
 */
public class JsonUtils {
	private static ObjectMapper mapper;  

	/**
	 *@param createNew
	 *@return
	 */
	public static synchronized ObjectMapper getMapperInstance(boolean createNew) {  
		       if (createNew) {  
		         return new ObjectMapper();  
		        } else if (mapper == null) {  
		             mapper = new ObjectMapper();  
		    }  
		      return mapper;  
		    }  
	
	public static void outJsonObj(HttpServletResponse response, Object json) {
		try {
			response.setContentType("application/json;charset=UTF-8");
			response.setCharacterEncoding("utf-8");
			response.setHeader("Charset", "utf-8");
			PrintWriter out = response.getWriter();
			out.print(net.sf.json.JSONObject.fromObject(json).toString());
			out.flush();
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void outJsonArray(HttpServletResponse response, Object json) {
		try {
			response.setContentType("application/json;charset=UTF-8");
			response.setCharacterEncoding("utf-8");
			response.setHeader("Charset", "utf-8");
			PrintWriter out = response.getWriter();
			out.print(net.sf.json.JSONArray.fromObject(json).toString());
			out.flush();
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 将json 数组转换为Map 对象
	 * 
	 * @param jsonString
	 * @return
	 */
	public static Map<String, Object> getMap(String jsonString) {
		JSONObject jsonObject;
		try {
			jsonObject = JSONObject.fromObject(jsonString);
			@SuppressWarnings("unchecked")
			Iterator<String> keyIter = jsonObject.keys();
			String key;
			Object value;
			Map<String, Object> valueMap = new HashMap<String, Object>();
			while (keyIter.hasNext()) {
				key = (String) keyIter.next();
				value = jsonObject.get(key);
				if(value  instanceof JSONNull){
					value=null;
				}
				valueMap.put(key, value);
			}
			return valueMap;
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 把json 转换为ArrayList 形式
	 * 
	 * @return
	 */
	public static List<Map<String, Object>> getList(String jsonString) {
		List<Map<String, Object>> list = null;
		try {
			JSONArray jsonArray = JSONArray.fromObject(jsonString);
			JSONObject jsonObject;
			list = new ArrayList<Map<String, Object>>();
			for (int i = 0; i < jsonArray.size(); i++) {
				jsonObject = jsonArray.getJSONObject(i);
				list.add(getMap(jsonObject.toString()));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}
}
