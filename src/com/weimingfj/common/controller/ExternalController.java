package com.weimingfj.common.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.weimingfj.common.dao.IJdbcDao;
import com.weimingfj.common.exception.CustomException;
import com.weimingfj.common.form.RequestDataForm;
import com.weimingfj.common.form.ResponseDataForm;
import com.weimingfj.common.service.IService;
import com.weimingfj.common.utils.Environment;
import com.weimingfj.common.utils.MapUtils;
import com.weimingfj.common.utils.UserSessionBean;
import com.weimingfj.common.web.utils.RequestUtils;
/**
 * 对外开放接口
 * @author whj
 */
@Controller
@RequestMapping(value="/parkInfo")
public class ExternalController extends BaseController {

	@Autowired
	private IJdbcDao jdbcDao;
	/**
	 * 获取在园车辆信息
	 */
	@RequestMapping(value="getTruckInList")
	public @ResponseBody Object getTruckInList(HttpServletRequest request,HttpServletResponse response) throws Exception{
		RequestDataForm requestDataForm = getRequestDataForm("park_getTruckInList", request, response);
		Map<String, Object> resultMap=this.execute(requestDataForm);
		return resultMap;
	}
	
	/**
	 * 获取园区基础参数配置
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="getBaseParkConfigInfo")
	public @ResponseBody Object getBaseParkConfigInfo(HttpServletRequest request,HttpServletResponse response) throws Exception{
		RequestDataForm requestDataForm = getRequestDataForm("park_getParkConfigInfo", request, response);
		Map<String, Object> resultMap=this.execute(requestDataForm);
		return resultMap;
	}
	
	/**
	 * 获取最新货源数据
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="getNewCargoList")
	public @ResponseBody Object getNewCargoList(HttpServletRequest request,HttpServletResponse response) throws Exception{
		RequestDataForm requestDataForm = getRequestDataForm("park_getNewCargoList", request, response);
		Map<String, String> simpleRequestMap = requestDataForm.getSimpleRequestMap();
		String pubTime = simpleRequestMap.get("PUB_TIME");//时间
		if(!StringUtils.isEmpty(pubTime)){
			simpleRequestMap.put("PUB_TIME", pubTime);
		}
		Map<String, Object> resultMap=this.execute(requestDataForm);
		return resultMap;
	}
	
	/**
	 * 获取商户信息
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="getCompanyInfoList")
	public @ResponseBody Object getCompanyInfoList(HttpServletRequest request,HttpServletResponse response) throws Exception{
		RequestDataForm requestDataForm = getRequestDataForm("park_getCompanyInfoList", request, response);
		Map<String, String> simpleRequestMap = requestDataForm.getSimpleRequestMap();
		String editTime = simpleRequestMap.get("EDIT_TIME");//时间
		if(!StringUtils.isEmpty(editTime)){
			simpleRequestMap.put("EDIT_TIME", editTime);
		}
		Map<String, Object> resultMap=this.execute(requestDataForm);
		return resultMap;
	}
	
	/**
	 * 获取全部招租信息
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="getLeaseInfoList")
	public @ResponseBody Object getLeaseInfoList(HttpServletRequest request,HttpServletResponse response) throws Exception{
		RequestDataForm requestDataForm = getRequestDataForm("park_getLeaseInfoList", request, response);
		Map<String, Object> resultMap=this.execute(requestDataForm);
		return resultMap;
	}
	
	private Map<String, Object> execute(RequestDataForm requestDataForm) throws Exception{
		Map<String, Object> urlSqlMap = requestDataForm.getUrlSqlMap();
		String service = MapUtils.getString(urlSqlMap, "SERVICE_NAME");
		HashMap<String, Object> resultMap=new HashMap<String, Object>();
		if (null == service || "".equals(service)) {// service为空，直接跳转到页面
			resultMap.put("result", ResponseDataForm.FAULAIE);
			resultMap.put("info", "配置出错，请检查接口配置");
		} else {
			WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(requestDataForm.getRequest().getSession().getServletContext());
			ResponseDataForm responseDataForm = ((IService) ctx.getBean(service)).service(requestDataForm);
			if(ResponseDataForm.SESSFUL==responseDataForm.getResult()){
				resultMap.put("result", ResponseDataForm.SESSFUL);
				resultMap.put("info", "执行成功");
				if(!"execService".equals(service)){
					resultMap.put("rsObj", responseDataForm.getAjaxObject()==null?responseDataForm.getPaginForm().getDataList():responseDataForm.getAjaxObject());
				}
			}else{
				resultMap.put("result", ResponseDataForm.FAULAIE);
				resultMap.put("info", "执行失败");
			}
		}
		return resultMap;
	}
	
	private RequestDataForm getRequestDataForm(String id,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		// 权限
		// 查找对应的URL处理参数
		Map<String, Object> urlSqlMap = jdbcDao.queryForMap(
				"select * from sys_url_tab t where t.url_id=?",
				new Object[] { id });
		if (urlSqlMap == null || urlSqlMap.size() == 0) {
			throw new CustomException(
					"error! no url defined!Please insert a record into the table sys_url_tab.");
		}
		if(urlSqlMap.get("PRIV_ID").toString().equals("2")) {//权限判断
			if(((UserSessionBean) request.getSession()
			.getAttribute(Environment.SESSION_USER_LOGIN_INFO)).getUserType().equals("1")) {
				String path = request.getContextPath(); 
				String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/?err=3";
				response.sendRedirect(basePath);
			}
		}
		RequestDataForm requestDataForm = RequestUtils.getRequestDataForm(request);
		requestDataForm.setUriId(id);
		requestDataForm.setUrlSqlMap(urlSqlMap); 
		requestDataForm.setRequest(request);
		requestDataForm.setResponse(response);
		return requestDataForm;
	}
}



