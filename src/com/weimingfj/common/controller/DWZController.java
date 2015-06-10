package com.weimingfj.common.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.weimingfj.common.dao.IJdbcDao;
import com.weimingfj.common.service.IOtherService;

@Controller
@RequestMapping(value="/topic")
public class DWZController extends BaseController{

	@Autowired
	private IJdbcDao jdbcDao;
	@Autowired
	private IOtherService otherService;
	
	
	
	@RequestMapping(value="/qrcode/qrcodeMapping")
	public 
	@ResponseBody Object getFixedQR(HttpServletRequest request,HttpServletResponse response,ModelMap map,String IDS){
		Map<String,Object> qr =new HashMap<String, Object>();
		if("".equals(IDS) || null==IDS) {
			//return dwzReturnMsg(false, "参数有误", false);
		}
		String path = request.getContextPath();
		String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/topic/sys-fixedAssetsDetailByQr?ID=";
		List<Map<String, Object>> list=new ArrayList<Map<String,Object>>();
		if("ALL".equals(IDS)){
			 list=jdbcDao.queryForList("select id,device_name from sys_fixed ",new Object[]{});
		}else{
			list=jdbcDao.queryForList("select id,device_name from sys_fixed where id in(?)",new Object[]{IDS});
		
		}
		try {
			List<Map<String, Object>> urlMap=	otherService.createQrMapping(basePath,list);
			qr.put("qrImg", urlMap);
		} catch (Exception e) {
			e.printStackTrace();
			//dwzReturnMsg(false, e.getMessage(), false);
		}
		//qr.putAll(dwzReturnMsg(true, "", false));
		return qr;
		
	}
	
	
}
