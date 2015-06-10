package com.weimingfj.common.service.impl;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import javax.imageio.ImageIO;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.weimingfj.common.cache.GlobalCache;
import com.weimingfj.common.dao.IJdbcDao;
import com.weimingfj.common.service.IOtherService;
import com.weimingfj.common.utils.JsonUtils;
import com.weimingfj.common.utils.MapUtils;

@Service("otherService")
public class OtherServiceImpl implements IOtherService {
		private static final int BLACK = 0xFF000000;
	   private static final int WHITE = 0xFFFFFFFF;
	   private   static BASE64Encoder encoder = new sun.misc.BASE64Encoder();   //加码   
	   private   static BASE64Decoder decoder = new sun.misc.BASE64Decoder(); //解码
	   
	   private static final String URL="http://www.baidu.com?search=";

	@Autowired
	protected IJdbcDao jdbcDao;

	@Override
	public List<Map<String, Object>> createQrMapping(String url,List<Map<String, Object>> ids) throws Exception {
		List<Map<String, Object>> list=new ArrayList<Map<String,Object>>();
		//生成二维矩阵,编码时指定大小,不要生成了图片以后再进行缩放,这样会模糊导致识别失败  
			
			for(Map<String, Object> id:ids){
				String u=url+id.get("ID");
				//u=URLEncoder.encode(u,"utf-8");
				Map<String, Object> urlMap=new HashMap<String, Object>();
				 BitMatrix matrix = new MultiFormatWriter().encode(u,BarcodeFormat.QR_CODE, 400, 400);  
			        BufferedImage bi =toBufferedImage(matrix);
			        ByteArrayOutputStream baos = new ByteArrayOutputStream();
			        ImageIO.write(bi, "jpg", baos);  
			        byte[] bytes = baos.toByteArray();
			        String base64code= encoder.encodeBuffer(bytes).trim();
			       urlMap.put("base64code", base64code);
			       urlMap.put("deviceName", id.get("DEVICE_NAME"));
			       list.add(urlMap);
			}
	return list;
	}
	
	//生成二维码
	public static BufferedImage toBufferedImage(BitMatrix matrix) {
	     int width = matrix.getWidth();
	     int height = matrix.getHeight();
	     BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
	     for (int x = 0; x < width; x++) {
	       for (int y = 0; y < height; y++) {
	         image.setRGB(x, y, matrix.get(x, y) ? BLACK : WHITE);
	       }
	     }
	     return image;
	   }
	 public static void writeToFile(BitMatrix matrix, String format, File file)
		       throws IOException {
		     BufferedImage image = toBufferedImage(matrix);
		     if (!ImageIO.write(image, format, file)) {
		       throw new IOException("Could not write an image of format " + format + " to " + file);
		     }
		   }
	
	 public static void writeToStream(BitMatrix matrix, String format, OutputStream stream)
		       throws IOException {
		     BufferedImage image = toBufferedImage(matrix);
		     if (!ImageIO.write(image, format, stream)) {
		       throw new IOException("Could not write an image of format " + format);
		     }
		   }

	@Override
	public String sendSMS(String mobile, String contents) throws Exception {
		String returlInfo="";
		String url = "http://userinterface.vcomcn.com/Opration.aspx";
		StringBuilder stringBuilder = new StringBuilder();
		//账号密码
		stringBuilder.append("<Group Login_Name=\"wlfjcn\" Login_Pwd=\"21218CCA77804D2BA1922C33E0151105\" OpKind=\"0\" InterFaceID=\"\" SerType=\"111\"> ").append("<E_Time></E_Time> ").append("<Item> ").append(" <Task> ").append("<Recive_Phone_Number>%1$s</Recive_Phone_Number> ")
				.append("<Content>%2$s</Content> ").append("<Search_ID></Search_ID> ").append(" </Task> ").append("</Item> ").append("</Group> ");
		String content = String.format(stringBuilder.toString(), mobile, contents);
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			HttpPost httpPost = new HttpPost(url);
			httpPost.setEntity(new StringEntity(content, "GBK"));
			CloseableHttpResponse response2 = httpclient.execute(httpPost);
			try {
				HttpEntity entity2 = response2.getEntity();
				returlInfo  = EntityUtils.toString(entity2);
				EntityUtils.consume(entity2);
			}catch(Exception e){
				e.printStackTrace();
				returlInfo="发送失败=========="+e.getMessage();
			} finally {
				response2.close();
			}
		} finally {
			httpclient.close();
		}
		return returlInfo;
	}

	@Override
	public Map<String, Object> getYBTruckInfomation(
			Map<String, String> param) throws Exception {
		@SuppressWarnings("deprecation")
		HttpClient client=new DefaultHttpClient();
		Map<String,String> cfgMap=null;//GlobalCache.getCache(SysConfigCache.class,Map.class);
		String url = MapUtils.getString(cfgMap, "TRUCKINFOMATION");
		String pwd=MapUtils.getString(cfgMap, "ENCR_KEY");
		Map<String, Object> map=new HashMap<String, Object>();
		try {//source
			url =url+"?app="+param.get("app")+"&time="+param.get("time")+
					"&pNum="+param.get("pNum")+"&pageNum="+param.get("pageNum")+"&ybUserId="+param.get("ybUserId")+
					"&sign="+OtherServiceImpl.getSignByMD5(param, pwd);
			List<NameValuePair> params=new ArrayList<NameValuePair>();
			for(Map.Entry<String, String> m:param.entrySet()){
					if(m.getKey().equals("dest")){
						params.add(new BasicNameValuePair(m.getKey(), String.valueOf(m.getValue())));
					}
					if(m.getKey().equals("truckType")){
						params.add(new BasicNameValuePair(m.getKey(), String.valueOf(m.getValue())));
					}
					if(m.getKey().equals("truckTon_ge")){
						params.add(new BasicNameValuePair(m.getKey(), String.valueOf(m.getValue())));
					}
					if(m.getKey().equals("truckTon_le")){
						params.add(new BasicNameValuePair(m.getKey(), String.valueOf(m.getValue())));
					}
					if(m.getKey().equals("truckPlate")){
						params.add(new BasicNameValuePair(m.getKey(), String.valueOf(m.getValue())));
					}
					if(m.getKey().equals("truckLength_ge") ){
						params.add(new BasicNameValuePair(m.getKey(), String.valueOf(m.getValue())));
					}
					if(m.getKey().equals("truckLength_le") ){
						params.add(new BasicNameValuePair(m.getKey(), String.valueOf(m.getValue())));
					}				
			}
			HttpPost post=new HttpPost(url);
			post.setEntity(new UrlEncodedFormEntity(params,"UTF-8"));
			HttpResponse response=client.execute(post);
			if(response.getStatusLine().getStatusCode() == HttpStatus.SC_OK){
				//请求成功
				String entity=EntityUtils.toString(response.getEntity());
				map=JsonUtils.getMap(entity);
				map.put("rows", new ArrayList());
				if(!"2".equals(String.valueOf(map.get("result")))){
					String json=decrypt(String.valueOf(map.get("rsObj")),pwd);
					System.out.println(json);
					Map<String, Object> result =JsonUtils.getMap(json);
					List<Map<String, Object>> list =(List<Map<String, Object>>)result.get("data");
					map.put("rows", list);
					map.put("total", result.get("total"));
					map.remove("rsObj");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			map.put("rows", new ArrayList());
			map.put("result", -1);
			map.put("info", e.getMessage());
		}
		return map;
	}
	private String ComputeSignature(String requestString, String key)
			throws NoSuchAlgorithmException, UnsupportedEncodingException {
		java.security.MessageDigest md5 = java.security.MessageDigest
				.getInstance("MD5");
		char[] hex = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a',
				'b', 'c', 'd', 'e', 'f' };

		byte[] source = (requestString + key).toLowerCase().getBytes("UTF-8");
		md5.update(source);
		byte[] data = md5.digest();

		char[] result = new char[data.length * 2];
		for (int i = 0, j = 0; i < data.length; i++, j += 2) {
			result[j] = hex[data[i] >> 4 & 0x0f];
			result[j + 1] = hex[data[i] & 0x0f];
		}

		return new String(result);
	}
	/**
	 * 将参数连接后取得MD5的签名
	 * @param param
	 * @return
	 */
	public static String getSignByMD5(Map<String,String> param,String securityKey){
		List<String> keyList=new ArrayList<String>();
		keyList.addAll(param.keySet());
		Collections.sort(keyList, new Comparator<String>(){
			@Override
			public int compare(String o1, String o2) {
				return o1.compareToIgnoreCase(o2);
			}
		});
		StringBuffer str=new StringBuffer();
		for(String key:keyList){
			str.append(param.get(key));
		}
		str.append(securityKey);
		return DigestUtils.md5Hex(str.toString()).toLowerCase();
	}
	/**
	 * 解密
	 * @param content
	 * @param password
	 * @return
	 */
	public static String decrypt(String content, String password) {
		try {
			if (content.length() < 1)
				return null;
			byte[] result = new byte[content.length() / 2];
			for (int i = 0; i < content.length() / 2; i++) {
				int high = Integer.parseInt(content.substring(i * 2, i * 2 + 1), 16);
				int low = Integer.parseInt(content.substring(i * 2 + 1, i * 2 + 2), 16);
				result[i] = (byte) (high * 16 + low);
			}
			KeyGenerator kgen = KeyGenerator.getInstance("AES");
			SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG");
			secureRandom.setSeed(password.getBytes()); 
			kgen.init(128, secureRandom);
			SecretKey secretKey = kgen.generateKey();
			byte[] enCodeFormat = secretKey.getEncoded();
			SecretKeySpec key = new SecretKeySpec(enCodeFormat, "AES");
			Cipher cipher = Cipher.getInstance("AES");// 创建密码器
			cipher.init(Cipher.DECRYPT_MODE, key);// 初始化
			return new String(cipher.doFinal(result),"utf-8");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public Map<String, Object> getYBCargoInfomation(Map<String, String> param)
			throws Exception {
		HttpClient client=new DefaultHttpClient();
		Map<String,String> cfgMap=null;//GlobalCache.getCache(SysConfigCache.class,Map.class);
		String url = MapUtils.getString(cfgMap, "CARGOINFOMATION");
		String pwd=MapUtils.getString(cfgMap, "ENCR_KEY");
		Map<String, Object> map=new HashMap<String, Object>();
		try {
			url =url+"?app="+param.get("app")+"&time="+param.get("time")+"&pNum="+param.get("pNum")+
					"&pageNum="+param.get("pageNum")+"&ybUserId="+param.get("ybUserId")+
					"&sign="+OtherServiceImpl.getSignByMD5(param, pwd);
			List<NameValuePair> params=new ArrayList<NameValuePair>();
			for(Map.Entry<String, String> m:param.entrySet()){
					if(m.getKey().equals("dest")){
						params.add(new BasicNameValuePair(m.getKey(), String.valueOf(m.getValue())));
					}
					if(m.getKey().equals("source")){
						params.add(new BasicNameValuePair(m.getKey(), String.valueOf(m.getValue())));
					}
			}
			HttpPost post=new HttpPost(url);
			post.setEntity(new UrlEncodedFormEntity(params,"UTF-8"));
			HttpResponse response=client.execute(post);
			if(response.getStatusLine().getStatusCode() == HttpStatus.SC_OK){
				//请求成功
				String entity=EntityUtils.toString(response.getEntity());
				map=JsonUtils.getMap(entity);
				map.put("rows", new ArrayList());
				if(!"2".equals(String.valueOf(map.get("result")))){
					String json=decrypt(String.valueOf(map.get("rsObj")),pwd);
					Map<String, Object> result =JsonUtils.getMap(json);
					List<Map<String, Object>> list =(List<Map<String, Object>>)result.get("data");
					map.put("rows", list);
					map.put("total", result.get("total"));
					map.remove("rsObj");
				}
			}	
		} catch (Exception e) {
			e.printStackTrace();
			map.put("rows", new ArrayList());
			map.put("result", -1);
			map.put("info", e.getMessage());
		}
		return map;
	}

	@Override
	public Integer getDictionares(String type) throws Exception {
		String money=jdbcDao.queryForString("select a.DIC_VALUE from sys_dic_tab a where 1=1 and a.DIC_NAME='MONEY' and a.DIC_TEXT=?", new Object[]{type});
		if("".equals(money)){
			return -1;
		}
		return Integer.parseInt(money);
	}

	@Override
	public void addLogMessage(int typeCode, Integer point, String obj,
			boolean isSuccess, String userId,String resultObj) throws Exception {
		// 添加消费记录
					jdbcDao.execute(
							"insert into sys_consume(consume_type,consume_point,consume_time,consume_user,consume_sucess,consume_obj,original_data)values(?,?,NOW(),?,?,?,?)",
							new Object[] { typeCode,
									point,userId,
									isSuccess ? "Y" : "N",
											obj, resultObj });
		
	}

	@Override
	public Map<String, Object> bandYbId(Map<String, String> param)
			throws Exception {
		HttpClient client=new DefaultHttpClient();
		Map<String,String> cfgMap=null;//GlobalCache.getCache(SysConfigCache.class,Map.class);
		String url = MapUtils.getString(cfgMap, "YB_LOGIN_VERIFY");
		String pwd=MapUtils.getString(cfgMap, "ENCR_KEY");
		Map<String, Object> map=new HashMap<String, Object>();
		String hereUserId = param.get("userId");
		param.remove("userId");
		try {
			System.out.println("sing================="+OtherServiceImpl.getSignByMD5(param, pwd));
			url =url+"?app="+param.get("app")+"&time="+param.get("time")+
					"&sign="+OtherServiceImpl.getSignByMD5(param, pwd);
			List<NameValuePair> params=new ArrayList<NameValuePair>();
			for(Map.Entry<String, String> m:param.entrySet()){
				if(m.getKey().equals("user_code")){
					params.add(new BasicNameValuePair(m.getKey(), String.valueOf(m.getValue())));
				}
				if(m.getKey().equals("user_pwd")){
					params.add(new BasicNameValuePair(m.getKey(), String.valueOf(m.getValue())));
				}
			}
			HttpPost post=new HttpPost(url);
			post.setEntity(new UrlEncodedFormEntity(params,"UTF-8"));
			HttpResponse response=client.execute(post);
			if(response.getStatusLine().getStatusCode() == HttpStatus.SC_OK){
				//请求成功
				String entity=EntityUtils.toString(response.getEntity());
				map=JsonUtils.getMap(entity);
				//map.put("rows", new ArrayList());
				System.out.println("result================="+map.get("result"));
				if("1".equals(String.valueOf(map.get("result")))){
					String json=decrypt(String.valueOf(map.get("rsObj")),pwd);
					Map<String, Object> result =JsonUtils.getMap(json);
					//map.put("obj", MapUtils.getString(data, "user_id"));
					String ybId = MapUtils.getString(result, "USER_ID");
					if(ybId != null && !"".equals(ybId)){
						String sql = "update sys_user_tab set ybid=? where user_id=?";
						int i = jdbcDao.execute(sql, new Object[]{ybId, hereUserId});
						map.put("info", "绑定用户成功!");
						map.put("ybId", ybId);
					}
					//map.put("total", result.get("total"));
					//map.remove("rsObj");
				}
			}	
		} catch (Exception e) {
			e.printStackTrace();
			//map.put("rows", new ArrayList());
			map.put("result", 3);
			map.put("info", e.getMessage());
		}
		return map;
	}
}
