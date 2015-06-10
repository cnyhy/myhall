package com.weimingfj.common.service.impl;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.stereotype.Service;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.weimingfj.common.cache.GlobalCache;
import com.weimingfj.common.exception.CustomException;
import com.weimingfj.common.form.RequestDataForm;
import com.weimingfj.common.form.ResponseDataForm;
import com.weimingfj.common.sqlparse.SqlResultForm;
import com.weimingfj.common.utils.MapUtils;
import com.weimingfj.common.utils.PubFun;
import com.weimingfj.common.utils.XmlUtils;
import com.weimingfj.hall.cache.UrlExecSqlCache;

/**
 * 非分页sql,一般直接只针对一条语句查询
 * @author lansb ajax Service
 */
@Service("ajaxService")
public class AjaxService extends AbstractService {
	public ResponseDataForm service(RequestDataForm requestDataForm) throws Exception {
		// 实现如下:
		ResponseDataForm rdf = new ResponseDataForm(); 
		rdf.setResult(ResponseDataForm.SESSFUL);
		Map<String, Object> urlSqlMap = requestDataForm.getUrlSqlMap();
		Map<String, String> simpleRequestMap = requestDataForm.getSimpleRequestMap();
		String urlId = MapUtils.getString(urlSqlMap, "URL_ID");
		//Map<String, Element> execSqlMap = GlobalCache.getCache(UrlExecSqlCache.class, Map.class);
		String execSql = MapUtils.getString(urlSqlMap, "EXEC_SQL");
		if (PubFun.isBlankOrNull(execSql)) {
		//if(!execSqlMap.containsKey(urlId)){
			throw new CustomException("sql is null");
		}
		//String execSql = MapUtils.getString(execSqlMap, urlId);
		//logger.debug("\n\r\t 待解析的xml：" + execSql);
		//NodeList sqlNodes = execSqlMap.get(urlId).getChildNodes();//
		NodeList sqlNodes = XmlUtils.getNoteListByString(execSql);
		Element element = null;
		for (int i = 0; i < sqlNodes.getLength(); i++) {
			Node child = sqlNodes.item(i);
			if (child.getNodeType() != Node.ELEMENT_NODE)
				continue;
			element = (Element) child;
			SqlResultForm srf = sqlParse.parseNode(element, simpleRequestMap, requestDataForm.getUserSession());
			Object ajaxObject = null;
			String resultType = element.getAttribute("resultType");
			if("string".equals(resultType)) {
				ajaxObject = jdbcDao.queryForString(srf.getParsedSql(), srf.getValueList().toArray());
			} else if("map".equals(resultType)) {
				logger.debug("sql============"+srf.getParsedSql());
				ajaxObject = jdbcDao.queryForMap(srf.getParsedSql(), srf.getValueList().toArray());
				logger.debug("obj============"+ajaxObject);
			} else {
				logger.debug("sql============"+srf.getParsedSql());
				ajaxObject = jdbcDao.queryForList(srf.getParsedSql(), srf.getValueList().toArray());
				logger.debug("obj============"+ajaxObject);
			}
			rdf.setAjaxObject(ajaxObject);
		}
		return rdf;
	}
}
