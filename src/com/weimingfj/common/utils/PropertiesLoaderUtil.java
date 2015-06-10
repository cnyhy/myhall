/**
 * 
 */
package com.weimingfj.common.utils;

import java.io.IOException;
import java.util.Properties;

import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;


public class PropertiesLoaderUtil {

	/**
	 * 属性文件加载方法
	 * @param resourceName
	 * @return
	 * @throws IOException
	 */
	public static Properties loadAllProperties(String resourceName)
			throws IOException {
		//Resource res = ApplicationContextUtils.getApplicationContext()
		//		.getResource(resourceName);
		return null;//PropertiesLoaderUtils.loadProperties(res);
	}
	static Properties properties;

	public PropertiesLoaderUtil() {
		try {
			properties = loadAllProperties("classpath:config/conf.properties");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public static String getPropValue(String strKey) {
		if (null == properties) {
			try {
				properties = loadAllProperties("classpath:config/conf.properties");
			} catch (IOException e) {
				e.printStackTrace();
				return "";
			}
		}
		return properties.getProperty(strKey);
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		System.out.println(PropertiesLoaderUtil.getPropValue("db.name"));
	}
}
