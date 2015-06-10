package com.weimingfj.common.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.log4j.chainsaw.Main;
import org.springframework.stereotype.Service;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.weimingfj.common.cache.GlobalCache;
import com.weimingfj.common.exception.CustomException;
import com.weimingfj.common.form.PaginForm;
import com.weimingfj.common.form.RequestDataForm;
import com.weimingfj.common.form.ResponseDataForm;
import com.weimingfj.common.sqlparse.SqlResultForm;
import com.weimingfj.common.utils.Environment;
import com.weimingfj.common.utils.MapUtils;
import com.weimingfj.common.utils.PubFun;
import com.weimingfj.common.utils.XmlUtils;
import com.weimingfj.hall.cache.UrlExecSqlCache;

/**
 * @author lansb query Service分页sql
 */
@Service("queryService")
public class QueryService extends AbstractService {
	public ResponseDataForm service(RequestDataForm requestDataForm) throws Exception {
		// 实现如下:
		ResponseDataForm rdf = new ResponseDataForm();
		Map<String, Object> urlSqlMap = requestDataForm.getUrlSqlMap();
		Map<String, String> simpleRequestMap = requestDataForm.getSimpleRequestMap();
		//每页数量
		int numPerPage = Integer.parseInt(simpleRequestMap.get("limit") == null?"10":simpleRequestMap.get("limit"));
		String urlId = MapUtils.getString(urlSqlMap, "URL_ID");
		//Map<String, Element> execSqlMap = GlobalCache.getCache(UrlExecSqlCache.class, Map.class);
		String execSql = MapUtils.getString(urlSqlMap, "EXEC_SQL");
		
		//if(!execSqlMap.containsKey(urlId)){
		if (PubFun.isBlankOrNull(execSql)) {
			throw new CustomException("\r\n\t 未定义该条记录的查询sql");
		}
		//NodeList sqlNodes = execSqlMap.get(urlId).getChildNodes();//XmlUtils.getNoteListByString(execSql);
		NodeList sqlNodes = XmlUtils.getNoteListByString(execSql);
		Element element = null;
		for (int i = 0; i < sqlNodes.getLength(); i++) {
			Node child = sqlNodes.item(i);
			if (child.getNodeType() != Node.ELEMENT_NODE)
				continue;
			element = (Element) child;
			PaginForm paginForm = new PaginForm();
			SqlResultForm rsf = null;
			if("true".equals(element.getAttribute("dynamic"))) {//是否为动态分页
				simpleRequestMap.put(Environment.CTRL_QUERYCOUNT, "havet");//新增查询总数条件,值为随意
				rsf = sqlParse.parseNode(element, simpleRequestMap, requestDataForm.getUserSession());
				simpleRequestMap.remove(Environment.CTRL_QUERYCOUNT);//移除查询总数条件
				int count = Integer.parseInt(jdbcDao.queryForString(rsf.getParsedSql(), rsf.getValueList().toArray()));//获取总数
				paginForm.setTotalCount(count);
			} else {
				rsf = sqlParse.parseNode(element, simpleRequestMap, requestDataForm.getUserSession());
				String parsedSql = "select count(1) from (" + rsf.getParsedSql() + ") aa";
				logger.debug("\r\n\t原始sql：" + rsf.getParsedSql());
				int count = Integer.parseInt(jdbcDao.queryForString(parsedSql, rsf.getValueList().toArray()));//获取总数
				if("true".equals(element.getAttribute("allData"))){
					numPerPage = count;//全部数据、不限条数
				}
				paginForm.setTotalCount(count); 
			}
			//当前页数
			int pageNum = Integer.parseInt(simpleRequestMap.get("start") == null?"0":simpleRequestMap.get("start"));
			//int startNum = numPerPage*(pageNum);
//			int endNum = numPerPage*(pageNum-1) + numPerPage;
			int endNum = numPerPage;//针对MySQL
			simpleRequestMap.put(Environment.CTRL_PAGESTART, String.valueOf(pageNum));
			simpleRequestMap.put(Environment.CTRL_PAGEEND, String.valueOf(endNum));
			simpleRequestMap.put(Environment.CTRL_NUMPERPAGE, String.valueOf(numPerPage));
			//paginForm.setPageNum(pageNum);
			//paginForm.setNumPerPage(numPerPage);
			//paginForm.setStartNum(pageNum);
			
			//paginForm.setPageNumShown(paginForm.getTotalCount()%paginForm.getNumPerPage()==0?paginForm.getTotalCount()/paginForm.getNumPerPage():(paginForm.getTotalCount()/paginForm.getNumPerPage()+1));
			
//			paginForm.setPageNumShown(Integer.parseInt(simpleRequestMap.get(Environment.CTRL_PAGENUMSHOWN) == null || simpleRequestMap.get(Environment.CTRL_PAGENUMSHOWN).equals("") ? 
//					Environment.DEFAULT_PAGENUMSHOWN : simpleRequestMap.get(Environment.CTRL_PAGENUMSHOWN)));
			
			if(!"true".equals(element.getAttribute("dynamic"))) {//不为动态分页时，总数即为查询结果数量
				//非动态分页，取当前页面对应的数据集合只适合oracle
				//ORACLE
				//String parsedSql = "select * from (select a.*, rownum rownum__ from (" + rsf.getParsedSql()
				//				+ ") a) where rownum__>" + startNum + " and rownum__<=" + endNum;
				String parsedSql = rsf.getParsedSql() + " limit " + pageNum + "," + endNum;
				List<Map<String, Object>> rsList = jdbcDao.queryForList(parsedSql, rsf.getValueList().toArray());//获取总数
				paginForm.setDataList(rsList);
			} else {//动态sql直接生成相关查询
				rsf = sqlParse.parseNode(element, simpleRequestMap, requestDataForm.getUserSession());
				List<Map<String, Object>> rsList = jdbcDao.queryForList(rsf.getParsedSql(), rsf.getValueList().toArray());//获取总数
				paginForm.setDataList(rsList); 
			}
			rdf.setPaginForm(paginForm); 
		}
		rdf.setResult(ResponseDataForm.SESSFUL);
		rdf.setResultInfo(Environment.QUERY_SESSFUL);
		return rdf; 
		
	}
	
}
