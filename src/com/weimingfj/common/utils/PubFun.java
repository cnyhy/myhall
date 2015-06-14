package com.weimingfj.common.utils;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import org.apache.commons.lang.time.DateUtils;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import com.weimingfj.common.utils.DateUtil;
import com.weimingfj.common.utils.PropertiesLoaderUtil;
//import com.weimingfj.common.utils.mail.MailSenderInfo;
//import com.weimingfj.common.utils.SimpleMailSender;
import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGImageEncoder;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
/**
 * 公共方法类
 * @author yhy
 */
public class PubFun {
	
	
	public static String getFomatFileSize(long fsize){
		String sss = "";
		if(fsize < 1*1024*1024){
			double dbe = fsize/1024;
			DecimalFormat df=new DecimalFormat("#.00");
			sss = df.format(dbe) + " KB";
		}else{
			double db=fsize;
			double dbe = db/1024/1024;
			DecimalFormat df=new DecimalFormat("#.00");
			sss = df.format(dbe)+ " MB";
		}
		return sss;
	}
	/*public static String listToJson(List list){
		JsonConfig config = JSONLibUtil.configJson();
		JSONArray jsonArray = JSONArray.fromObject(list, config);
		String s =  jsonArray == null ? "[]" : jsonArray.toString();
		return s;
	}
	
	public static String objToJson(Object obj){
		JsonConfig conf = JSONLibUtil.configJson();
		JSONObject jsonObject = JSONObject.fromObject(obj,conf);
		return jsonObject.toString();
	}
	
	public static String objToFormJson(Object obj){
		JsonConfig conf = JSONLibUtil.configJson();
		JSONObject jsonObject = JSONObject.fromObject(obj,conf);
		return "{success:true,root:["+jsonObject.toString()+"]}";
	}*/
	
	public static boolean isBlankOrNull(String str){
		if(str==null || "".equals(str.trim()) || "null".equals(str.trim())){
			return true;
		}
		return false;
	}
	
	public static String getUUID(){
		return new UUID().generate().toString();
	}
	
	public static Timestamp getNowTime(){
		return new Timestamp(System.currentTimeMillis());
	}
	
	public static Timestamp strToTimestamp(String date){
		Date d = null;
		try{
			d = DateUtils.parseDate(date, new String[] { "yyyy-MM-dd" });
		}catch(Exception e){
			e.printStackTrace();
		}
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time = df.format(d);
		Timestamp ts = Timestamp.valueOf(time);
		return ts;
	}
	public static String timestampToStr(Timestamp date){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String ts = df.format(date);
		return ts;
	}
	public static String timestampToStr(Timestamp date, String fmt){
		SimpleDateFormat df = new SimpleDateFormat(fmt);
		String ts = df.format(date);
		return ts;
	}
	public static Element getXmlRoot(String xml) {
		try {
			return (
				DocumentHelper.parseText(xml)
			).getRootElement();
		} catch (Exception e) {
			return null;
		}
	}

	public static Element getXmlRoot(InputStream xmlStream){
		try {
			return (
				new SAXReader()
			).read(xmlStream).getRootElement();
		} catch (Exception e) {
			return null;
		}
	}
	
	public static String getXmlReportAttrVal(String xml, String code){
		Element element = getXmlRoot(xml);
		return element.attribute(code).getValue();
	}
	
	//图片的缩略图
	public static byte[] getSmallImage(byte[] data){
		try {
			float rate = 1;
			int new_wi = 0;
			int new_he = 0;
			int max_wi = 120;
			int max_he = 80;
			int wi = max_wi;
			int he = max_he;
			InputStream is = new ByteArrayInputStream(data);
			if(is == null){
				return null;
			}
			BufferedImage bufImg = ImageIO.read(is);
			
			wi = bufImg.getWidth();
			he = bufImg.getHeight();
			rate = (float) wi / (float) he;
			if (wi > max_wi && he <= max_he) {
				new_wi = max_wi;
				new_he = new Float((float) new_wi / rate).intValue();
			} else if ((he > max_he && wi <= max_wi)
					|| (he > max_he && wi > max_wi)) {
				new_he = max_he;
				new_wi = new Float(new_he * rate).intValue();
			} else if (he <= max_he && wi <= max_wi) {
				new_wi = wi;
				new_he = he;
			}
			BufferedImage bf = new BufferedImage(new_wi, new_he,
					BufferedImage.TYPE_INT_RGB);
			bf.getGraphics().drawImage(
					bufImg
							.getScaledInstance(new_wi, new_he,
									Image.SCALE_SMOOTH), 0, 0, new_wi, new_he,
					null);
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);
			encoder.encode(bf); // 近JPEG编码
			byte[] re = out.toByteArray();
			return re;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	//发送邮件
	/**public static boolean sendMail(String toEmail){
		//String mailFlag = StaticData.getParamNameMap().get(104) == null ? "" : StaticData.getParamNameMap().get(104);
		//Map<String, String> mailMap = ;
		//if(StaticData.getParamNameMapByParentId(104).containsKey(domainId)){
			MailSenderInfo mailInfo = new MailSenderInfo();    
		  mailInfo.setMailServerHost("smtp.163.com");    
		  mailInfo.setMailServerPort("25");    
		  mailInfo.setValidate(true);    
		  mailInfo.setUserName("eyantong@163.com");    
		  mailInfo.setPassword("fsti1234");//您的邮箱密码    
		  mailInfo.setFromAddress("eyantong@163.com");    
		  mailInfo.setToAddress(toEmail);
		  mailInfo.setSubject("您有新的任务,请登录工程翼眼通系统进行查办.");    
		  mailInfo.setContent("您有新的任务,请登录工程翼眼通系统进行查办.");    
		  //mailInfo.setSubject("工程助理系统地址");    
		  //mailInfo.setContent("系统地址为：http://61.154.10.49:9000/PQMS/，系统帐号为你们的手机号，初始密码1234，请登录系统修改用户信息和下载使用手册。");    
		  //这个类主要来发送邮件   
		  SimpleMailSender sms = new SimpleMailSender();   
		  sms.sendTextMail(mailInfo);//发送文体格式
		  sms.sendHtmlMail(mailInfo);//发送html格式
		//}
		  return true;
	}*/
	
	public static String getDBName(){
		return PropertiesLoaderUtil.getPropValue("db.name");
	}
	
}
