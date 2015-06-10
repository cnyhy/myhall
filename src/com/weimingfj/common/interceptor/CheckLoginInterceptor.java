package com.weimingfj.common.interceptor;

import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.weimingfj.common.dao.IJdbcDao;
import com.weimingfj.common.exception.CustomException;
import com.weimingfj.common.utils.Environment;
import com.weimingfj.common.utils.MapUtils;
import com.weimingfj.common.utils.UserSessionBean;


/**
 * @author lansb
 * 登录拦截器
 */
public class CheckLoginInterceptor implements HandlerInterceptor {
	@Autowired
	protected IJdbcDao jdbcDao;
	//private static Logger logger = Logger.getLogger("interceptor");
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object arg2, Exception arg3)
			throws Exception {
		//实现如下:
		//System.out.println("ControllerInterceptor.afterCompletion()");
	}

	public void postHandle(HttpServletRequest request, HttpServletResponse response,
			Object arg2, ModelAndView arg3) throws Exception {
		//实现如下:
		//System.out.println("ControllerInterceptor.postHandle()");
	}

	public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
			Object arg2) throws Exception {
		//实现如下:
		System.out.println("ControllerInterceptor.preHandle()");
		String reqUrl = request.getServletPath();  
		//System.out.println(reqUrl);
		if("/topic/login".equals(reqUrl)) return true;//登录页面不进行过滤
		/*if(reqUrl.startsWith("/topic/led")) return true;//LED页面不进行过滤
		if(reqUrl.startsWith("/topic/ajax/led")) return true;//LED页面不进行过滤
		if(reqUrl.startsWith("/topic/getFile/")) return true;//获取LED简介上的图片时不进行过滤
		if(reqUrl.startsWith("/topic/ajax/loadSginFixed")) return true;//获取LED简介上的图片时不进行过滤
		if(reqUrl.startsWith("/topic/genUrlFile")) return true;//生成urlxml文件
		if(reqUrl.startsWith("/topic/card")) return true;//闸机刷卡
*/		
		HttpSession session = request.getSession();
		String path = request.getContextPath();
		String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/login.jsp?err=2";
		String returnUrl="";
		/*if(reqUrl.startsWith("/topic/sys-fixedAssetsDetailByQr")){
			returnUrl="&returnUrl="+request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+request.getRequestURI()+"?"+request.getQueryString();
			basePath += returnUrl;
		}*/
		UserSessionBean usb = (UserSessionBean) session.getAttribute(Environment.SESSION_USER_LOGIN_INFO);
		if(usb == null) {
			//判断是否有存cookie
			boolean hascookie = false;
			Cookie[] cookies = request.getCookies();
			if(cookies==null){
				response.sendRedirect(basePath);
				return false;
			}
			for(Cookie cookie : cookies) {
				if("yhy-usercode".equals(cookie.getName())) {//自动登录
					String usercode = cookie.getValue();
					usercode = new String(org.apache.commons.codec.binary.Base64.decodeBase64(java.net.URLDecoder.decode(usercode, "UTF-8")),"UTF-8");
					String loginsql = "select * from sys_user_tab a where lower(a.USER_CODE)=lower(?)";
					Map<String, Object> map = jdbcDao.queryForMap(loginsql, new Object[]{usercode}); 
					if(map == null || map.size() == 0) {//login faiule
						response.sendRedirect(basePath);return false;//登录失败，用户名或密码有误，请重新输入！
					} else {
						//request.getSession().setAttribute(Environment.LOGIN_INFO, map);
						usb = new UserSessionBean();
						usb.setUserCode(map.get("user_code").toString());
						usb.setUserId(map.get("user_id").toString());
						usb.setUserName(map.get("user_name").toString());
						usb.setDomainId(Integer.parseInt(map.get("domain_id").toString()));
						usb.setOrganId(Integer.parseInt(map.get("organ_id").toString()));
						//设置登录信息
						request.getSession().setAttribute(Environment.SESSION_USER_LOGIN_INFO, usb);
						//记录登录日志
						String logSql = "insert into sys_op_log_tab( LOGIN_IP, USER_CODE, OP_TIME) select ?,?,now()";
						jdbcDao.execute(logSql, new Object[]{request.getRemoteAddr(), usercode});
					}
					hascookie = true; 
					return true;
				}
			}  
			if(!hascookie) response.sendRedirect(basePath);return false;
		}else{
			//自定义方法过滤权限  begin
			//if(reqUrl.startsWith("/topic/qrcode/qrcodeMapping")) return true;
			//end
			String noPrivPath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/login.jsp?err=3";
			String urlId = reqUrl.substring(reqUrl.lastIndexOf("/")+1, reqUrl.length());
			String[] userPrivIds = usb.getUserPrivIds();
			if(!Environment.ADMIN_USER_CODE.equals(usb.getUserCode())) {
				Map<String, Object> urlSqlMap = jdbcDao.queryForMap(
						"select * from sys_url_tab t where t.url_id=?",
						new Object[] { urlId });
				if (urlSqlMap == null || urlSqlMap.size() == 0) {
					throw new CustomException(
							"error! no url defined!Please insert a record into the table sys_url_tab.");
				}
				String privId = urlSqlMap.get("PRIV_ID").toString();
				if(privId.equals(Environment.LOGIN_NO_PRIV)){//权限为登陆后可操作
					return true;
				} else if(privId.equals(Environment.ADMIN_PRIV) ) {//admin专属
					response.sendRedirect(noPrivPath);
					return false;
				} else if(privId.equals(Environment.INNER_USER_PRIV)){//内部员工专属
					return Environment.INNER_USER_TYPE.equals(usb.getUserType());
				} else {
					if(!this.hasPriv(userPrivIds, privId)){
						response.sendRedirect(noPrivPath);
						return false;
					}
				}
			}			
		}
		return true;
	}
	
	public boolean hasPriv(String[] privIds, String privId){
		if(privIds==null){
			return false;
		}
		for(String s: privIds){
			if(privId.equals(s)){
				return true;
			}
		}
		return false;
	}
}
