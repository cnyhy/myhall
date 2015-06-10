package com.weimingfj.common.exposer;

import java.io.InputStreamReader;
import java.util.Map;
import java.util.Properties;

import javax.servlet.ServletContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.ServletContextAware;

import com.weimingfj.common.dao.IJdbcDao;
import com.weimingfj.common.utils.Environment;
import com.weimingfj.common.utils.MapUtils;

/**
 * @author lansb
 * 设置启动参数变量
 */
public class InitPathExposer implements ServletContextAware {
	@Autowired
	protected IJdbcDao jdbcDao;
	private ServletContext sc; 
	Properties propMap=new Properties();

	public String resRoot;
	/*public String parkLogoSrc1;
	public String parkLogoSrc2;
	
	public String parkLoginPageSrc1;
	public String parkLoginPageSrc2;*/
	
	public void setServletContext(ServletContext arg0) {
		// 实现如下:
		sc = arg0;
	}

	public void init() {
		/**
		 * 资源参数初始化
		 */
		String version = "" + System.currentTimeMillis();
		resRoot = "/r-" + version;
		sc.setAttribute("ctxPath", sc.getContextPath());
		sc.setAttribute("resRoot", sc.getContextPath() + resRoot);
		//sc.setAttribute("driverPath", Environment.DRIVER_PATH);
		sc.setAttribute("picPath", sc.getContextPath()+"/pic/");
//		/**
//		 * 配置文件读取
//		 */
//		try {
//			propMap.load(new InputStreamReader(
//					InitPathExposer.class.getClassLoader().getResourceAsStream("parkInfo.properties"), "UTF-8"));
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		
//		/**
//		 * 园区title、logo地址
//		 */
//		parkLogoSrc1 = propMap.get("parkLogoSrc1").toString();
//		parkLogoSrc2 = propMap.get("parkLogoSrc2").toString();
//		sc.setAttribute("parkLogo1", parkLogoSrc1);
//		sc.setAttribute("parkLogo2", parkLogoSrc2);
//		/**
//		 * 园区登录页图片地址
//		 */
//		parkLoginPageSrc1 = propMap.get("parkLoginPageSrc1").toString();
//		parkLoginPageSrc2 = propMap.get("parkLoginPageSrc2").toString();
//		sc.setAttribute(""parkLoginPageSrc1, parkLoginPageSrc1);
//		sc.setAttribute("parkLoginPageSrc2", parkLoginPageSrc2);
		
	}
}
