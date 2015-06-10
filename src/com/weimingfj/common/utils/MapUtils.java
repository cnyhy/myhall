package com.weimingfj.common.utils;

import java.util.Map;

import org.apache.commons.collections.map.CaseInsensitiveMap;

/**
 * @author lansb
 * Map utils
 */
public class MapUtils { 
	public static String getString(Map<String, ?> map, String key) {
		return getString(map, key, "");
	}
	public static String getString(Map<String, ?> map, String key, String def) {
		CaseInsensitiveMap mCaseInsensitiveMap=new CaseInsensitiveMap(map);
		return mCaseInsensitiveMap.get(key) == null ? def : mCaseInsensitiveMap.get(key).toString();
	}
	public static int getInt(Map<String, ?> map, String key, int def) {
		int value=def;
		try{
			value=Double.valueOf(getString(map,key)).intValue();
		}catch(Exception e){
			e.printStackTrace();
		}
		return value;
	}
	public static int getInt(Map<String, ?> map, String key) {
		return getInt(map, key, 0);
	}
	public static float getFloat(Map<String, Object> map, String key, int def) {
		return map.get(key) == null ? def : Float.parseFloat(map.get(key).toString());
	}
	public static float getFloat(Map<String, Object> map, String key) { 
		return getFloat(map, key, 0);
	}
	public static double getDouble(Map<String, Object> map, String key, int def) {
		return map.get(key) == null ? def : Double.parseDouble(map.get(key).toString());
	}
	public static double getDouble(Map<String, Object> map, String key) {
		return getDouble(map, key, 0);
	}
}
