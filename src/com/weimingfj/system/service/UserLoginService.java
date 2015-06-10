package com.weimingfj.system.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;

import org.apache.commons.codec.binary.Base64;
import org.springframework.stereotype.Service;

import com.weimingfj.common.cache.GlobalCache;
import com.weimingfj.common.form.RequestDataForm;
import com.weimingfj.common.form.ResponseDataForm;
import com.weimingfj.common.service.impl.AbstractService;
import com.weimingfj.common.utils.Environment;
import com.weimingfj.common.utils.MapUtils;
import com.weimingfj.common.utils.UserSessionBean;
import com.weimingfj.hall.cache.UserPrivCache;

/**
 * @author lansb
 * 用户登录service
 */
@Service("userLoginService")  
public class UserLoginService extends AbstractService { 
	public ResponseDataForm service(RequestDataForm requestDataForm) throws Exception {
		//实现如下:
		String usercode = requestDataForm.getSimpleRequestMap().get("usercode");
		String passwd = requestDataForm.getSimpleRequestMap().get("passwd");
        
//		String randimg = requestDataForm.getRequest().getParameter("randimg");
//		String rand = requestDataForm.getRequest().getSession().getAttribute("rand").toString();
		ResponseDataForm rdf = new ResponseDataForm();
//		if(!rand.equalsIgnoreCase(randimg)) {
//			rdf.setResult(ResponseDataForm.RAND_FAULAIE);//验证码输入错误！
//			return rdf;
//		}
		String loginsql = 
			"select a.user_id, a.user_code, a.user_name, a.organ_id, a.domain_id, " +
			"b.domain_name, b.system_title, b.system_bottom, og.area_code, aa.area_type, aa.area_name" +
				" from sys_user_tab a" +
				" left join sys_domain_tab b on a.domain_id = b.domain_id" +
				" left join sys_organ_tab og on og.OID = a.organ_id"+
				" left join sys_area_tab aa on aa.area_code = og.AREA_CODE"+
				" where lower(a.USER_CODE)=lower(?) and a.USER_PWD=MD5(?) and a.is_del='N'";
		Map<String, Object> map = jdbcDao.queryForMap(loginsql, new Object[]{usercode, passwd}); 
		if(map == null || map.size() == 0) {//login faiule
			rdf.setResult(ResponseDataForm.FAULAIE);//登录失败，用户名或密码有误，请重新输入！
		} else {
			//request.getSession().setAttribute(Environment.LOGIN_INFO, map);
			UserSessionBean usb = new UserSessionBean();
			usb.setUserCode(map.get("user_code").toString());
			usb.setUserId(map.get("user_id").toString());
			usb.setUserName(map.get("user_name").toString());
			//System.out.println(map.get("domain_id").toString());
			usb.setDomainId(Integer.parseInt(map.get("domain_id").toString()));
			usb.setOrganId(Integer.parseInt(map.get("organ_id").toString()));
			usb.setAreaCode(map.get("area_code").toString());
			usb.setAreaType(map.get("area_type").toString());
			usb.setAreaName(map.get("area_name").toString());
			usb.setSystemTitle(map.get("system_title").toString());
			usb.setSystemBottom(map.get("system_bottom").toString());
			//获取用户所有权限ID数组
//			String sql ="SELECT PRIV_ID from v_user_priv where USER_ID=?";
//			List<Map<String, Object>> userPermission=jdbcDao.queryForList(sql, new Object[]{usb.getUserId()});
			Map<String,List<String>> userPrivMap = GlobalCache.getCache(UserPrivCache.class,Map.class);
			List<String> privList = userPrivMap.get(MapUtils.getString(map, "USER_ID"));
			String[] userPrimissionIds=new String[]{};
			if(privList!=null){
				userPrimissionIds=privList.toArray(userPrimissionIds);
			}
//			for(int i=0; i<userPrimissionIds.length; i++){
//				userPrimissionIds[i]=userPermission.get(i).get("PRIV_ID").toString();
//			}
			usb.setUserPrivIds(userPrimissionIds);
			//设置登录信息
			requestDataForm.getRequest().getSession().setAttribute(Environment.SESSION_USER_LOGIN_INFO, usb);
			rdf.setResult(ResponseDataForm.SESSFUL); 
			//记录登录日志
			String logSql = "insert into sys_op_log_tab( LOGIN_IP, USER_CODE, OP_TIME) select ?,?,now()";
			jdbcDao.execute(logSql, new Object[]{requestDataForm.getRequest().getRemoteAddr(), usercode});
			//更新最后登录时间
			updateLastLoginTime(usercode);
			if(requestDataForm.getRequest().getParameter("autologin") != null) {//自动登录实现
				String userCode64 = Base64.encodeBase64String(usb.getUserCode().getBytes("UTF-8"));
				userCode64 = userCode64.replace("\r\n", "");              
				userCode64 = userCode64.replace("\n", "");
				String userEncoder = java.net.URLEncoder.encode(userCode64, Environment.ENCODING);
				Cookie usercookie = new Cookie("yhy-usercode", userEncoder); 
				
				String passwd64 = Base64.encodeBase64String(passwd.getBytes("UTF-8"));
				passwd64 = passwd64.replace("\r\n", "");              
				passwd64 = passwd64.replace("\n", "");
				String pwdEncoder = java.net.URLEncoder.encode(passwd64, Environment.ENCODING);
				Cookie passwdcookie = new Cookie("yhy-passwd",pwdEncoder); 
				
				usercookie.setPath("/");
				passwdcookie.setPath("/");
				usercookie.setMaxAge(60 * 60 * 24 * 360);//一年以内
				passwdcookie.setMaxAge(60 * 60 * 24 * 360);//一年以内
				requestDataForm.getResponse().addCookie(usercookie);
				requestDataForm.getResponse().addCookie(passwdcookie);
			}
		}
		return rdf;
	}
	
	//更新当前用户最后登录时间
	public void updateLastLoginTime(String userCode){
		String updateStr = "update sys_user_tab set last_login_time=now() where user_code=?";
		jdbcDao.execute(updateStr, new Object[]{userCode});
	}

}
