package com.weimingfj.common.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.weimingfj.common.dao.IJdbcDao;
import com.weimingfj.common.exception.CustomException;
import com.weimingfj.common.form.RequestDataForm;
import com.weimingfj.common.utils.Environment;
import com.weimingfj.common.utils.UserSessionBean;
import com.weimingfj.common.web.utils.RequestUtils;

/**
 * 封装通用方法
 * @author Administrator
 *
 */
public class BaseController {
	protected static Logger logger = Logger.getLogger(BaseController.class);

	@Autowired
	public IJdbcDao jdbcDao;

	public RequestDataForm getRequestDataForm(String id,
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
}
