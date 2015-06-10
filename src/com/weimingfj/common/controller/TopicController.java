package com.weimingfj.common.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.CycleDetectionStrategy;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.hmit.rest.client.cpm.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.weimingfj.common.cache.GlobalCache;
import com.weimingfj.common.dao.IJdbcDao;
import com.weimingfj.common.exception.CustomException;
import com.weimingfj.common.form.RequestDataForm;
import com.weimingfj.common.form.ResponseDataForm;
import com.weimingfj.common.service.IService;
import com.weimingfj.common.utils.Environment;
import com.weimingfj.common.utils.MapUtils;
import com.weimingfj.common.utils.PubFun;
import com.weimingfj.common.utils.UserSessionBean;
import com.weimingfj.common.web.utils.CommonUtils;
import com.weimingfj.common.web.utils.RequestUtils;
import com.weimingfj.hall.cache.UrlExecSqlCache;
import com.weimingfj.hall.cache.UrlValidationCache;
import com.weimingfj.hall.cache.UserPrivCache;

/**
 * @author lansb 用户URL统一入口
 */
@Controller
@RequestMapping("/topic")
public class TopicController extends BaseController{
	protected static Logger logger = Logger.getLogger(TopicController.class);

	@Autowired
	private IJdbcDao jdbcDao;

	@RequestMapping(value = "/{id}")
	public String topic(@PathVariable String id, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		RequestDataForm requestDataForm = getRequestDataForm(id, request, response);
		Map<String, Object> urlSqlMap = requestDataForm.getUrlSqlMap();
		String service = MapUtils.getString(urlSqlMap, "SERVICE_NAME");
		String title = MapUtils.getString(urlSqlMap, "TITLE");
		//保存操作日志
		//addOperateLog(request, id, title);
		
		if (PubFun.isBlankOrNull(service)) {// service为空，直接跳转到页面
			return MapUtils.getString(urlSqlMap, "PAGE");
		} else {
			request.setAttribute(Environment.URL_SQL_MAP, urlSqlMap);// add
			WebApplicationContext ctx = WebApplicationContextUtils
					.getWebApplicationContext(request.getSession()
							.getServletContext());
			ResponseDataForm responseDataForm = ((IService) ctx
					.getBean(service)).service(requestDataForm);
			request.setAttribute("responseDataForm", responseDataForm);
			String page = responseDataForm.getPage();
			if(PubFun.isBlankOrNull(page)) {
				page = MapUtils.getString(urlSqlMap, "PAGE");
			}
			return page;
		}
	}
	@RequestMapping(value = "/login")
	public void login(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		RequestDataForm requestDataForm = RequestUtils.getRequestDataForm(request);
		requestDataForm.setRequest(request);
		requestDataForm.setResponse(response);
		WebApplicationContext ctx = WebApplicationContextUtils
				.getWebApplicationContext(request.getSession()
						.getServletContext());
		ResponseDataForm responseDataForm = ((IService) ctx
				.getBean("userLoginService")).service(requestDataForm);
		if(responseDataForm.getResult() == ResponseDataForm.FAULAIE || responseDataForm.getResult() == ResponseDataForm.RAND_FAULAIE) {
			//登录失败
			String path = request.getContextPath(); 
			String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/login.jsp?err=" 
			+ (responseDataForm.getResult() == ResponseDataForm.FAULAIE ? "1" : "5");
			response.sendRedirect(basePath);
		} else { 
			//登录成功，跳转到新的页面
			String path = request.getContextPath(); 
			String basePath = "";
			String returnUrl=request.getParameter("returnUrl");
			if(StringUtils.isEmpty(returnUrl)){
				UserSessionBean usb = (UserSessionBean)request.getSession().getAttribute(Environment.SESSION_USER_LOGIN_INFO);
				//if("2".equals(usb.getUserInfo().get("USER_TYPE").toString())){
					basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/topic/admin";
				/*}
				else{
					basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path + "/index.jsp";
				}*/
				response.sendRedirect(basePath);
			}else{
				response.sendRedirect(returnUrl);
			}
	}
	}
	@RequestMapping(value = "/uploadImg/{id}")
	public @ResponseBody Object uploadImg(@PathVariable String id, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		RequestDataForm requestDataForm = getRequestDataForm(id, request, response);
		Map<String, Object> urlSqlMap = requestDataForm.getUrlSqlMap();
		String service = MapUtils.getString(urlSqlMap, "SERVICE_NAME");
		if (null == service || "".equals(service)) {// service为空，直接跳转到页面
			return MapUtils.getString(urlSqlMap, "PAGE");
		} else {
			request.setAttribute(Environment.URL_SQL_MAP, urlSqlMap);// add
			WebApplicationContext ctx = WebApplicationContextUtils
					.getWebApplicationContext(request.getSession()
							.getServletContext());
			ResponseDataForm responseDataForm = ((IService) ctx
					.getBean(service)).service(requestDataForm);
			
			request.setAttribute("responseDataForm", responseDataForm);
			String fileid =  jdbcDao.queryForString("select max(att_id) lastId from sys_attachment_tab", null);
			Map<String, Object> m = new HashMap<String, Object>();
			m.put("error", 0);
			m.put("message", "上传成功");
			m.put("url", request.getContextPath() + "/topic/getFile/" + fileid);
			return m;
		}
	}	
	/**
	 * 返回json格式数据,返回类型可以是string，map，list，请将xmlresultType设置成正确的格式
	 * 
	 * @param id
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/ajax/{id}")
	public @ResponseBody
	Object ajax(@PathVariable String id, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		RequestDataForm requestDataForm = getRequestDataForm(id, request, response);
		Map<String, Object> urlSqlMap = requestDataForm.getUrlSqlMap();
		String service = MapUtils.getString(urlSqlMap, "SERVICE_NAME");
		requestDataForm.setUrlSqlMap(urlSqlMap);
		if (null == service || "".equals(service)) {
			service = "ajaxService";
		}
		try {
			WebApplicationContext ctx = WebApplicationContextUtils
					.getWebApplicationContext(request.getSession()
							.getServletContext());
			return ((IService) ctx.getBean(service)).service(requestDataForm)
					.getAjaxObject();
		} catch (Exception e) {
			e.printStackTrace();
			final String message = e.getMessage();
			return new HashMap<String, Object>() {
				private static final long serialVersionUID = 1L;
				{
					put("success", false);
					put("result", "3");
					put("resultInfo", message);
				}
			};
		}
	}

	@RequestMapping(value = "/exec/{id}")
	public @ResponseBody
	Object exec(@PathVariable String id, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		RequestDataForm requestDataForm = getRequestDataForm(id, request, response);
		Map<String, Object> urlSqlMap = requestDataForm.getUrlSqlMap();
		String service = MapUtils.getString(urlSqlMap, "SERVICE_NAME");
		if (null == service || "".equals(service)) {
			service = "execService";
		}
		Map<String, Object> returnMap = new HashMap<String, Object>();
		
		try {
			WebApplicationContext ctx = WebApplicationContextUtils
					.getWebApplicationContext(request.getSession()
							.getServletContext());
			ResponseDataForm responseDataForm = ((IService) ctx
					.getBean(service)).service(requestDataForm);
			returnMap.put("success", true);
			returnMap.put("result", responseDataForm.getResult());
			returnMap.put("resultInfo", responseDataForm.getResultInfo());
			if (ResponseDataForm.FAULAIE == responseDataForm.getResult()) {// 异常信息
				returnMap.put("validate", responseDataForm.getErrorList());
			}
			return returnMap;
		} catch (Exception e) {
			e.printStackTrace();
			final String message = e.getMessage();
			return new HashMap<String, Object>() {
				private static final long serialVersionUID = 1L;
				{
					put("success", false);
					put("result", "3");
					put("resultInfo", message);
				}
			};
		}
	}

	/**
	 * 按照jquery-ui格式获取列表,,请将xml的resultType设置成list
	 * 
	 * @param id
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/list/{id}")
	public @ResponseBody
	Object list(@PathVariable String id, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		//System.out.println("-------------"+request.getParameter("page"));
		//System.out.println("-------------"+request.getParameter("rows"));
		RequestDataForm requestDataForm = getRequestDataForm(id, request, response);
		Map<String, Object> urlSqlMap = requestDataForm.getUrlSqlMap();
		String service = MapUtils.getString(urlSqlMap, "SERVICE_NAME");
		if (null == service || "".equals(service)) {
			service = "queryService";
		}
		
		try {
			WebApplicationContext ctx = WebApplicationContextUtils
					.getWebApplicationContext(request.getSession()
							.getServletContext());
			ResponseDataForm responseDataForm = ((IService) ctx
					.getBean(service)).service(requestDataForm);
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("count", responseDataForm.getPaginForm().getTotalCount());
			map.put("rows", responseDataForm.getPaginForm().getDataList());
			
			return map;
		} catch (Exception e) {
			e.printStackTrace();
			final String message = e.getMessage();
			return new HashMap<String, Object>() {
				private static final long serialVersionUID = 1L;
				{
					put("success", false);
					put("result", "3");
					put("resultInfo", message);
				}
			};
		}
	}

	/**
	 * 加载单条数据，返回json字符串,请使用ajaxservice,请将xml的resultType设置成map
	 * 
	 * @param id
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/load/{id}")
	public @ResponseBody
	Object load(@PathVariable String id, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		RequestDataForm requestDataForm = getRequestDataForm(id, request, response);
		Map<String, Object> urlSqlMap = requestDataForm.getUrlSqlMap();
		String service = MapUtils.getString(urlSqlMap, "SERVICE_NAME");
		logger.debug("-service_name-="+service);
		if (null == service || "".equals(service)) {
			service = "ajaxService";
		}
		try {
			WebApplicationContext ctx = WebApplicationContextUtils
					.getWebApplicationContext(request.getSession()
							.getServletContext());
			ResponseDataForm responseDataForm = ((IService) ctx
					.getBean(service)).service(requestDataForm);
			
			Map<String,Object> mapObj = new LinkedHashMap<String, Object>();
			mapObj.put("success", true);//List<Map<String, Object>>
			//mapObj.put("root", new ArrayList<Map<String, Object>>().add((Map<String, Object>)responseDataForm.getAjaxObject()));
			mapObj.put("root", JSONArray.fromObject(JSONObject.fromObject(responseDataForm.getAjaxObject())));
			//String s= JSONObject.fromObject(mapObj).toString();
			//logger.debug("--------------"+mapObj);
			return JSONObject.fromObject(mapObj);
		} catch (Exception e) {
			e.printStackTrace();
			final String message = e.getMessage();
			return new HashMap<String, Object>() {
				private static final long serialVersionUID = 1L;
				{
					put("success", false);
					put("resultInfo", message);
				}
			};
		}
	}
	@RequestMapping(value = "/getFile/{id}")
	public  Object getFile(@PathVariable String id,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		Map<String, Object> urlSqlMap = jdbcDao.queryForMap(
				"select * from sys_attachment_tab a where a.att_id=?",
				new Object[] { id });
		if (urlSqlMap == null || urlSqlMap.size() == 0) {
			throw new CustomException(
					"附件不存在!.");
		}
		String path = urlSqlMap.get("SAVE_FILE_NAME").toString();
		String filename = urlSqlMap.get("UP_FILE_NAME").toString();
		File file = new File(path);
        // 取得文件名。
        // 取得文件的后缀名。

        // 以流的形式下载文件。
        InputStream fis = new BufferedInputStream(new FileInputStream(path));
        byte[] buffer = new byte[fis.available()];
        fis.read(buffer);
        fis.close();
        // 清空response
        response.reset();
        // 设置response的Header
        response.setContentType("appliation/octet-stream"); 
        if (request.getHeader("User-Agent").toUpperCase().indexOf("MSIE") > 0) {  
            filename = URLEncoder.encode(filename, "UTF-8");  //针对IE
        } else {  
            filename = new String(filename.getBytes("UTF-8"), "ISO8859-1");  //针对IE之外的浏览器
        }
//     response.setHeader("Content-disposition", "attachment; filename=" + new String(filename.getBytes(Environment.ENCODING), "ISO-8859-1"));
        response.setHeader("Content-disposition", "attachment; filename=" + filename);
        response.addHeader("Content-Length", "" + file.length());
        OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
        toClient.write(buffer);
        toClient.flush();
        toClient.close();
        return null;
	}
	
	
	private RequestDataForm getRequestDataForm(String id,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("***************************");
		logger.debug("enter topic");
		logger.debug("***************************");
		// 权限
		// 查找对应的URL处理参数
		Map<String, Object> urlSqlMap = jdbcDao.queryForMap(
				"select * from sys_url_tab t where t.url_id=?",
				new Object[] { id });
		if (urlSqlMap == null || urlSqlMap.size() == 0) {
			throw new CustomException(
					"error! no url defined!Please insert a record into the table sys_url_tab.");
		}
		
		RequestDataForm requestDataForm = RequestUtils
				.getRequestDataForm(request);
		requestDataForm.setUriId(id);
		requestDataForm.setUrlSqlMap(urlSqlMap); 
		requestDataForm.setUserSession((UserSessionBean) request.getSession()
				.getAttribute(Environment.SESSION_USER_LOGIN_INFO)); 
		requestDataForm.setRequest(request);
		requestDataForm.setResponse(response);
		return requestDataForm;
	}
	
	/**
	 * 添加操作日志(在sys_log_tab中添加操作记录)
	 */
	/**
	 * {USER_ID=1, USER_CODE=admin, USER_PWD=36680a906090850d18c1d47d6db2662c, 
	 * USER_TYPE=2, USER_NAME=超级管理员, SEX=1, ID_CARD_NO=, MOBILE=, TOUCH_PHONE=, 
	 * EMAIL=, JOIN_DATE=2013-01-17, STALL_NO=, COMPANY=高速物流园, BUSINESS=, IS_DISABLED=Y, 
	 * REMARK=, CREATE_TIME=2014-09-18 10:39:44.0, DEPT_ID=2, DEPT_NAME=企划部}
	 */
	public void addOperateLog(HttpServletRequest request, String id, String title){
		
		String ip = request.getRemoteAddr();//获取远程请求ip
		int port = request.getRemotePort();//获取远程请求端口
//		HttpSession session = request.getSession();
//		UserSessionBean userSession = (UserSessionBean) session.getAttribute("userSession");
		UserSessionBean userSession = (UserSessionBean)request.getSession().getAttribute(Environment.SESSION_USER_LOGIN_INFO);
		String user_id = "";
		String user_name = "";
		String real_name = "";
		if(userSession==null){
			logger.error("userSession is null--===========================");
			/*String username = Util.getCasUserName(request);
			UserDTO user = Util.getUser(username);
			user_id = String.valueOf(user.getUserId());
			user_name = user.getUsername();
			real_name = user.getRealName();*/
		} else {
			user_id = userSession.getUserId();
			user_name = userSession.getUserCode();
			real_name = userSession.getUserName();
		}
		try {
			String insertSql = "insert into sys_log_tab (USER_ID, USER_NAME, REAL_NAME, OPERATE_TIME, OPERATE_ID, OPERATE_TITLE, OPERATE_IP, OPERATE_PORT) " +
					"values('" + user_id + "', '" + user_name + "', '" + real_name + "', now(), '" +  id + "', '" + title + "', '" + ip + "', " + port +")";
			jdbcDao.execute(insertSql, null);
			System.out.println(insertSql);
		} catch (Exception e) {
			e.printStackTrace();
		} 
	}
	@RequestMapping(value="/genUrlFile")
	public void genUrlFile(HttpServletRequest request,HttpServletResponse response,String privId, String urlFileName){
		System.out.println("priv_id ===="+privId+",,urlFileName=========="+urlFileName);
		String xmlHead = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
		List<Map<String, Object>> urlSqlList = jdbcDao.queryForList(
				//"select url_id, title, validation, exec_sql, create_man from sys_url_tab where module_id = ? and service_name != ''",
				"select url_id, title, validation, exec_sql, add_user from sys_url_tab where add_user = 'yhy' and service_name != ''",
				new Object[] { });
		StringBuffer validSb = new StringBuffer("");
		StringBuffer execSqlSb = new StringBuffer("");
		for(Map<String, Object> urlMap : urlSqlList){ 
			String urlId = urlMap.get("URL_ID").toString();
			String validation = urlMap.get("VALIDATION")==null?"":urlMap.get("VALIDATION").toString();
			String execSql = urlMap.get("EXEC_SQL")==null?"":urlMap.get("EXEC_SQL").toString();
			String createMan = urlMap.get("ADD_USER")==null?"":urlMap.get("ADD_USER").toString();
			if(!StringUtils.isEmpty(validation)){
				//System.out.println("-------------------------"+validation);
				if(validation.startsWith(xmlHead)){
					validation = validation.substring(validation.indexOf(">")+1);
				}
				if(validation.indexOf(">") > -1){
					validation = "<validation id=\""+urlId+"\" author=\""+createMan+"\">"+validation.substring(validation.indexOf(">")+1);
					validSb.append(validation);
					validSb.append("\n");
				}
			}
			if(!StringUtils.isEmpty(execSql)){
				if(execSql.startsWith(xmlHead)){
					execSql = execSql.substring(execSql.indexOf(">")+1);
				}
				if(execSql.indexOf(">") > -1){
					execSql = "<mapper id=\""+urlId+"\" author=\""+createMan+"\">"+execSql.substring(execSql.indexOf(">")+1);
					execSqlSb.append(execSql);
					execSqlSb.append("\n");
				}
			}
			//System.out.println("urlId ===="+urlId+",,validation=========="+validation+",,execSql=========="+execSql);
		}
		if(validSb.length() > 0){
			validSb.insert(0, xmlHead + "\n<validations xmlns=\"http://www.weimingfj.com\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://itest.56913.com:20080/xsd/validations.xsd\">\n");
			validSb.append("\n</validations>\n");
		}
		if(execSqlSb.length() > 0){
			execSqlSb.insert(0, xmlHead + "\n<mappers xmlns=\"http://www.weimingfj.com\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://itest.56913.com:20080/xsd/mappers.xsd\">\n");
			execSqlSb.append("\n</mappers>\n");
		}
		if(!StringUtils.isEmpty(urlFileName)){
			///String path=this.getClass().getResource("/").getPath();
			//String websiteUrl = path.replace("/classes","").replace("%20", " ")+"sysxml/validation/";
			String validationPath = "E:/sysxml/validation/";
			String execSqlPath = "E:/sysxml/execsql/";
			//System.out.println("websiteUrl=========="+websiteUrl);
			try{
				//判断路径
				File vPath = new File(validationPath);
				if(!vPath.isDirectory()){
					vPath.mkdirs();
				}
				File ePath = new File(execSqlPath);
				if(!ePath.isDirectory()){
					ePath.mkdirs();
				}
				//----------------------------------------------
				if(validSb.length() > 0){
					File validFile=new File(new File(validationPath), urlFileName);
					//判断文件是否存在
					if(!validFile.exists()){
						validFile.createNewFile(); 
					}
					OutputStreamWriter validWrite = new OutputStreamWriter(new FileOutputStream(validFile),"UTF-8");
					BufferedWriter validWriter = new BufferedWriter(validWrite);
					validWriter.write(validSb.toString());
					validWriter.close();
				}
				if(execSqlSb.length() > 0){
					File execSqlFile=new File(new File(execSqlPath), urlFileName);
					if(!execSqlFile.exists()){
						execSqlFile.createNewFile(); 
					}
					OutputStreamWriter execSqlWrite = new OutputStreamWriter(new FileOutputStream(execSqlFile),"UTF-8");				
					BufferedWriter execWriter = new BufferedWriter(execSqlWrite);
					execWriter.write(execSqlSb.toString());				
					execWriter.close();
				}
			}catch(Exception ex){
				ex.printStackTrace();
			}
		}
	}
	@RequestMapping(value="/refreshCache")
	public void refreshCache(HttpServletRequest request,HttpServletResponse response,String cacheType){
		if("all".equals(cacheType)){
			GlobalCache.refreshCache(UrlValidationCache.class);
			GlobalCache.refreshCache(UrlExecSqlCache.class);
			GlobalCache.refreshCache(UserPrivCache.class);			
		}else{
			if(cacheType != null && !"".equals(cacheType)){
				String[] cacheArr = cacheType.split("\\,");
				for(String ca : cacheArr){
					if("v".equals(ca)){
						GlobalCache.refreshCache(UrlValidationCache.class);
					}else if("e".equals(ca)){
						GlobalCache.refreshCache(UrlExecSqlCache.class);
					}else if("p".equals(ca)){
						
					}else if("s".equals(ca)){
						
					}else if("u".equals(ca)){
						GlobalCache.refreshCache(UserPrivCache.class);
					}
				}
			}
		}
	}
	/**
	 * 编辑器文件上传
	 * 
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/uploadImg", method = RequestMethod.POST)
	public void EditFileUpload(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		// 验证用户是否登录
		OutputStream fos = null;
		InputStream ins = null;
		PrintWriter out = response.getWriter();
		try {
			response.setCharacterEncoding("UTF-8");
			MultipartResolver resolver = new CommonsMultipartResolver(request
					.getSession().getServletContext());
			MultipartHttpServletRequest multipartRequest = resolver
					.resolveMultipart(request);
			MultipartFile imgFile = multipartRequest.getFile("imgFile");
			boolean flag = true;
			String imgName = request.getParameter("imageName");
			if(null==imgName||"".equals(imgName)){
				imgName=CommonUtils.getFormatDate(new Date(), "yyyyMMddhhmmss");
			}
			String dicLog = request.getParameter("type");
			String message = "";
			if (imgFile != null) {
				if (imgFile.getSize() > 2097152) {
					message = "上传文件内容太大，请上传2M以内的图片";
					flag = false;
				} else {
					String suffix = imgFile.getOriginalFilename().substring(
							imgFile.getOriginalFilename().lastIndexOf(".")); // 获取文件后缀名
					imgName += suffix; // 生成文件名
					if (!suffix.equalsIgnoreCase(".jpg")
							&& !suffix.equalsIgnoreCase(".png")) {
						message = "上传图片格式不正确，请上传 .jpg 或者 .png 图片";
						flag = false;
					} else {
						String savepath = request.getSession()
								.getServletContext()
								.getRealPath("/pic/" + File.separator + dicLog);
						File createFile = new File(savepath);
						if (!createFile.exists()) {
							createFile.mkdirs();
						}
						fos = new FileOutputStream(savepath + "/" + imgName);
						ins = imgFile.getInputStream();
						byte[] buffer = new byte[2 * 1024 * 1024];
						int length = 0;
						while (-1 != (length = ins.read(buffer))) {
							fos.write(buffer, 0, length);
						}
						try {
							fos.close();
							ins.close();
						} catch (IOException e) {
							e.printStackTrace();
						}
					}

				}
			} else {
				flag = false;
				message = "请选择图片";
			}
			if (flag) {
				map.put("error", 0);
				map.put("url", request.getContextPath()+"/pic/"+dicLog + "/" + imgName);
			} else {
				map.put("error", 1);
				map.put("message", message);
			}
			out.print(JSONObject.fromObject(map).toString());
			out.flush();
			out.close();
		} catch (Exception e1) {
			e1.printStackTrace();
			map.put("error", 1);
			map.put("message", e1.getMessage());
			out.print(JSONObject.fromObject(map).toString());
			out.flush();
			out.close();
		}
	}
}
