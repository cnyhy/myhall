package com.weimingfj.common.service.impl;

import java.io.BufferedOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.weimingfj.common.cache.GlobalCache;
import com.weimingfj.common.exception.CustomException;
import com.weimingfj.common.form.RequestDataForm;
import com.weimingfj.common.form.ResponseDataForm;
import com.weimingfj.common.service.callback.CallbackProxy;
import com.weimingfj.common.sqlparse.SqlResultForm;
import com.weimingfj.common.utils.Environment;
import com.weimingfj.common.utils.MapUtils;
import com.weimingfj.common.utils.PubFun;
import com.weimingfj.common.utils.RegexUtils;
import com.weimingfj.common.utils.XmlUtils;
import com.weimingfj.common.web.httpobjects.HttpRequestObject;
import com.weimingfj.hall.cache.UrlExecSqlCache;
import com.weimingfj.hall.cache.UrlValidationCache;

/**
 * @author lansb 业务处理service统一入口
 */
@Service("execService")
public class ExecService extends AbstractService {

	private final String SELECT = "select";// 查询语句,用于其他语句初始化值

	private final String INSERT_FILE = "insert_file";// 文件插入

	private final String DEL_FILE = "del_file";// 文件删除 

	private final String EXECUTE = "execute";// 普通执行语句 
	
	private final String CALLBACK = "callback";// 执行回调类
	@Autowired   
	protected CallbackProxy callbackProxy;

	@SuppressWarnings("unchecked")
	public ResponseDataForm service(RequestDataForm requestDataForm)
			throws Exception {
		ResponseDataForm rdf = new ResponseDataForm();// 存放返回结果
		Map<String, Object> urlSqlMap = requestDataForm.getUrlSqlMap();
		Map<String, String> simpleRequestMap = requestDataForm
				.getSimpleRequestMap();
		Map<String, List<HttpRequestObject>> multipleRequestMap = requestDataForm
				.getMultipleRequestMap();
		String urlId = MapUtils.getString(urlSqlMap, "URL_ID");
		// 数据验证
		//Map<String, Element> validationMap = GlobalCache.getCache(UrlValidationCache.class, Map.class);
		String validation = MapUtils.getString(urlSqlMap, "VALIDATION");
		if (!PubFun.isBlankOrNull(validation)) {
		//if(validationMap.containsKey(urlId)){
			//NodeList sqlNodes = validationMap.get(urlId).getChildNodes();//
			NodeList sqlNodes = XmlUtils.getNoteListByString(validation);
			Element element = null;
			boolean validate = true;
			for (int i = 0; i < sqlNodes.getLength(); i++) {
				Node child = sqlNodes.item(i);
				if (child.getNodeType() != Node.ELEMENT_NODE)
					continue;
				element = (Element) child;
				boolean subvalid = validator(element, multipleRequestMap, simpleRequestMap, rdf, requestDataForm);
				if(!subvalid) {//服务器验证失败
					rdf.setResult(ResponseDataForm.FAULAIE);
					rdf.setResultInfo(Environment.SAVE_FAULAIE);
					if(validate) validate = subvalid;
				}
			}
			if(!validate) return rdf;
		}
		// 执行业务sql
		//Map<String, Element> execSqlMap = GlobalCache.getCache(UrlExecSqlCache.class, Map.class);
		String execSql = MapUtils.getString(urlSqlMap, "EXEC_SQL");
		if (!PubFun.isBlankOrNull(execSql)) {
		//if(execSqlMap.containsKey(urlId)){
			//NodeList sqlNodes = execSqlMap.get(urlId).getChildNodes();//
			NodeList sqlNodes = XmlUtils.getNoteListByString(execSql);
			Element element = null;
			for (int i = 0; i < sqlNodes.getLength(); i++) {
				Node child = sqlNodes.item(i);
				if (child.getNodeType() != Node.ELEMENT_NODE)
					continue;
				element = (Element) child;
				processRecord(element, multipleRequestMap, simpleRequestMap, requestDataForm, rdf);
			}
		}else{
			throw new CustomException("exec sql is null ----"+urlId);
		}
		rdf.setResult(ResponseDataForm.SESSFUL);
		rdf.setResultInfo(Environment.SAVE_SESSFUL);
		return rdf;
	}

	private boolean validator(Element data,
			Map<String, List<HttpRequestObject>> multipleRequestMap,
			Map<String, String> simpleRequestMap, ResponseDataForm rdf, RequestDataForm requestDataForm) throws Exception
			 {
		String field = data.getAttribute("field");// 验证的参数名称
		String method = "".equals("method") ? "reg" : data
				.getAttribute("method");// 验证方法，reg/database为空时候为reg
		String msg = data.getAttribute("msg");// 提示信息
		boolean required = "".equals("required") ? true
				: Boolean.parseBoolean(data.getAttribute("required"));// true/false是否必填,为空时候为true
		String reg = data.getAttribute("reg");// 正则表达式，可以为空，
		int maxlength = (data.getAttribute("maxlength") == null || "".equals( data.getAttribute("maxlength"))) ? -1 : Integer
				.parseInt(data.getAttribute("maxlength"));// 最大长度,数字，可以为空
		int minlength = (data.getAttribute("minlength") == null || "".equals( data.getAttribute("minlength")))? -1 : Integer
				.parseInt(data.getAttribute("minlength"));// 最小长度,数字，可以为空
		String orisql = data.getAttribute("sql");// 验证方式为database，判断的sql
		boolean validatorResult = true;
		List<String> errorList = rdf.getErrorList();
		if (errorList == null) {
			errorList = new ArrayList<String>();
			rdf.setErrorList(errorList);
		}
		if (method.equals("database")) {
			SqlResultForm srf = sqlParse.parseString(orisql, simpleRequestMap, requestDataForm.getUserSession());
			String result = jdbcDao.queryForString(srf.getParsedSql(), srf
					.getValueList().toArray());
			validatorResult = "0".equals(result);
		} else if (method.equals("reg")) {
			if(simpleRequestMap.get(field) == null) {
				throw new CustomException("\t\r\n需要验证的参数:" + field
						+ "不存在,请确定表单有存在该参数!");
			}
			String value = simpleRequestMap.get(field);
			if ("".equals(value) && !required)
				return validatorResult;
			validatorResult = RegexUtils.match(reg, value);
			if (minlength > 0 && value.length() < minlength) {
				validatorResult = false;
			}
			if (maxlength > 0 && value.length() > maxlength) {
				validatorResult = false;
			}
		} else if (method.equals("class")) {
			String clazz = data.getAttribute("class");
			validatorResult = callbackProxy.validatorCallbackProxy(clazz, requestDataForm);
		} else {
			throw new CustomException("\t\r\n验证方法:" + method
					+ "不存在，数据库验证请使用：database，正则表达式验证请使用：reg!");
		}
		if (!validatorResult) {
			errorList.add(msg);
		}
		return validatorResult;
	}

	/**
	 * 一张表入n条记录，n根据参数中传送的iterfield字段（配置文件中配置）的个数 if(n=1) then singlerecord
	 * 
	 * @param element
	 * @param sourceMap
	 * @throws Exception
	 */
	private void processRecord(Element element,
			Map<String, List<HttpRequestObject>> multipleRequestMap,
			Map<String, String> simpleRequestMap, RequestDataForm requestDataForm,  ResponseDataForm rdf) throws Exception {
		String operator = element.getAttribute("operator");// 操作类型，如果类型为
		if(null == operator || "".equals(operator)) operator = this.EXECUTE;
		String iterFields = element.getAttribute("iterfields");// 多个变量用,号隔开，循环迭代标志，页面迭代的参数，多个用,号隔开；可以是页面直接提交多个数值或一个数值配合iterfieldsplit参数进行分解,如果为多个，必须保证页面提交参数的数值个数必须相同
		String fileWname = element.getAttribute("filewname");//保存文件，表单附件控件名称
		fileWname = "".equals(fileWname) ? Environment.FILE_FILE_INPUTNAME : fileWname;
		if("".equals(iterFields) && (this.INSERT_FILE.equals(operator) || this.DEL_FILE.equals(operator))) {//操作文件时候，自动处理索引
			String fileindex = element.getAttribute("fileindex");
			System.out.println("operator="+operator+";");
			if(this.INSERT_FILE.equals(operator))
				iterFields = fileWname + fileindex;
			if(this.DEL_FILE.equals(operator))
				iterFields =  Environment.FILE_ATT_ID + fileindex + "," + Environment.FILE_ATT_IS_DEL + fileindex;
		}
		String iterFieldSplit = element.getAttribute("iterfieldsplit");// 可以为空，为空，则按页面提交参数的个数（参考iterfields中的第一个）进行迭代，如果此参数不为空，将iterfield按此参数进行分解并迭代。如iterfields=rights,iterFieldSplit=“,”，页面提交的rights参数值为101,102，迭代的次数为2
		int iterSize = 1;
		String[] iterFieldArr = null;
		if (!"".equals(iterFields)) {
			iterFieldArr = iterFields.split(",");
			if(multipleRequestMap.get(iterFieldArr[0]) == null || multipleRequestMap.get(iterFieldArr[0]).size() == 0) {
				logger.info("\t\n\r未上传具体的附件，保存附件操作略过！");return;
			}
			if ("".equals(iterFieldSplit)) {// 按照提交的数值个数进行循环
				iterSize = multipleRequestMap.get(iterFieldArr[0]).size();
			} else {
				iterSize = new String(multipleRequestMap.get(iterFieldArr[0])
						.get(0).getValue(), Environment.ENCODING)
						.split(iterFieldSplit).length;
			}
		}
		for (int i = 0; i < iterSize; i++) {// 循环的次数
			// 如果有迭代，准备迭代的数据，初始化simpleRequestMap值
			if (iterFieldArr != null) {
				for (String piterfield : iterFieldArr) {
					if ("".equals(iterFieldSplit)) {// 按照提交的数值个数进行循环
						simpleRequestMap.put(piterfield, new String(
								multipleRequestMap.get(piterfield).get(i)
										.getValue(), Environment.ENCODING));
					} else {// 取自分解后的值
						simpleRequestMap.put(piterfield, new String(
								multipleRequestMap.get(piterfield).get(0)
										.getValue(), Environment.ENCODING)
								.split(iterFieldSplit)[i]);
					}
				}
			}
			if(this.INSERT_FILE.equalsIgnoreCase(operator)) {
				//附件表新增操作,判断客户端是否有传入该附件，没有则跳过该保存
				if(multipleRequestMap.get(fileWname) == null || multipleRequestMap.get(fileWname).size() == 0) {
					logger.info("\t\n\r未上传具体的附件，保存附件操作略过！");continue;
				}
			}
			SqlResultForm srf = sqlParse.parseNode(element, simpleRequestMap, requestDataForm.getUserSession());
			Object[] pramArr = srf.getValueList().toArray();
			String parsedSql = srf.getParsedSql();
			if (this.SELECT.equalsIgnoreCase(operator)) {// 执行类型为查询，并且需要把查询结果注入multipleRequestMap和simpleRequestMap
				List<Map<String, Object>> rsList = jdbcDao.queryForList(
						parsedSql, pramArr);
				putRecordListToMap(rsList, multipleRequestMap,
						simpleRequestMap);
			} else if (this.EXECUTE.equalsIgnoreCase(operator)) {
				jdbcDao.execute(parsedSql, pramArr);
			} else if (this.INSERT_FILE.equalsIgnoreCase(operator)) {
				if("".equals(parsedSql)) {//插入语句为空
					/*
					 * 附件插入
					 * fileindex:可以为空！附件在页面的索引，默认为空，和fileupload.jsp的参数fileindex
					 * batchid：附件的批次名称
					 * module：所属模块ID,输入整数值，如1
					 * <sql operator="insert_file" fileindex="" batchid="" module="1"/>
					 */
					String fileindex = element.getAttribute("fileindex");
					String batchid = element.getAttribute("batchid");
					if(batchid == null || "".equals(batchid)) {
						throw new CustomException("\t\r\n附件批次参数名不能为空");
					}
					String module = element.getAttribute("module");
					if(module == null || "".equals(module)) {
						throw new CustomException("\t\r\n附件所属模块不能为空");
					}
					String fileName = multipleRequestMap.get(fileWname).get(i).getFilename();
					//fileName = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
					parsedSql = "insert into sys_attachment_tab"
								+ " (att_batch_id, up_time, up_file_name, save_file_name, module_id, is_del) values"
								+ " (?, now(), ?, 'c:/tmp/" + UUID.randomUUID() + "_" 
								+ fileName.replace("'", "''") + "', ?, 1)";    
					//oracle
//					parsedSql = "insert into sys_attachment_tab"
//							+ " (att_id, att_batch_id, up_time, up_file_name, save_file_name, module_id, is_del) values"
//							+ " (sys_att_id_seq.nextval, ?, sysdate, ?, 'c:/tmp/'||sys_att_id_seq.currval||'_" 
//							+ simpleRequestMap.get(Environment.FILE_FILENAME + fileindex).replace("'", "''") + "', ?, 1)";  
//					pramArr = new Object[]{new Integer(simpleRequestMap.get(batchid)), fileName, 
//							 new Integer(module)};
					pramArr = new Object[]{simpleRequestMap.get(batchid), fileName, 
							 new Integer(module)};
					fileWname += fileindex;
				}
				jdbcDao.execute(parsedSql, pramArr);
				// 插入附件
				saveFile(i, multipleRequestMap, fileWname);

			} else if (this.DEL_FILE.equalsIgnoreCase(operator)) {//查询处理删除
				if("".equals(parsedSql)) {//插入语句为空
					/*
					 * 附件删除
					 * deltype:附件删除类型,默认为4
					 *         1：只更新数据库is_del
					 *         2：更新数据库is_del并删除附件
					 *         3：只删除数据库记录
					 *         4:删除数据库记录并删除附件
					 * fileindex：可以为空！附件在页面的索引，默认为空，和fileupload.jsp的参数fileindex
					 * <sql  operator="del_file" fileindex="" deltype="4"/>
					 */
					String fileindex = element.getAttribute("fileindex");
					if(simpleRequestMap.get(Environment.FILE_ATT_IS_DEL + fileindex).equals("1")) {
						//修改时候未删除附件
						continue;
					}
					String deltype = element.getAttribute("deltype");
					deltype =  "".equals(deltype) ? "4" : deltype; 
					pramArr = new Object[]{new Integer(simpleRequestMap.get(Environment.FILE_ATT_ID + fileindex))};
					if("1".equals(deltype)) {
						parsedSql = "update sys_attachment_tab a set a.is_del=0 where a.att_id=?";
						jdbcDao.execute(parsedSql, pramArr); 
					} else if("2".equals(deltype)) {
						//删除硬盘上的附件
						parsedSql = "select save_file_name from sys_attachment_tab a where a.ATT_ID=?";
						delFile(jdbcDao.queryForList(parsedSql, pramArr));
						parsedSql = "update sys_attachment_tab a set a.is_del=0 where a.att_id=?";
						jdbcDao.execute(parsedSql, pramArr);
					} else if("3".equals(deltype)) {
						parsedSql = "delete from sys_attachment_tab where ATT_ID=?";
						jdbcDao.execute(parsedSql, pramArr);
					} else if("4".equals(deltype)){ 
						//删除硬盘上的附件
						parsedSql = "select save_file_name from sys_attachment_tab where ATT_ID=?";
						delFile(jdbcDao.queryForList(parsedSql, pramArr));
						parsedSql = "delete from sys_attachment_tab where ATT_ID=?";
						jdbcDao.execute(parsedSql, pramArr);
					} else {
						throw new CustomException("\t\r\n传入的附件删除的操作类型有误，值必须是1、2、3、4其中的一个！");
					}
				}
			} else if (this.CALLBACK.equalsIgnoreCase(operator)) {
				String clazz = element.getAttribute("class");//回调类名
				callbackProxy.serviceCallbackProxy(clazz, requestDataForm, rdf);
			}
		} 

	}

	/**
	 * 保存附件
	 * 
	 * @param index
	 * @param multipleRequestMap
	 * @param filewname
	 * @throws Exception
	 */
	private void saveFile(int index,
			Map<String, List<HttpRequestObject>> multipleRequestMap,
			String filewname) throws Exception {
		String sysAttId = jdbcDao.queryForString("select LAST_INSERT_ID()", null);
		String filename = jdbcDao
				.queryForString(
						"select save_file_name from sys_attachment_tab t where t.ATT_ID=" + sysAttId,
						null);
		String path = filename.substring(0, filename.lastIndexOf("/"));
		HttpRequestObject hro = multipleRequestMap.get(filewname).get(index);
		byte[] bytes = hro.getValue();
		path = filename.substring(0, filename.lastIndexOf("/"));
		File file = new File(path);
		file.mkdirs();
		DataOutputStream dos = new DataOutputStream(new BufferedOutputStream(
				new FileOutputStream(filename)));
		dos.write(bytes, 0, bytes.length);
		dos.flush();
	}
//	private void saveFileOracle(int index,
//			Map<String, List<HttpRequestObject>> multipleRequestMap,
//			String filewname) throws Exception {
//		String sysAttId = jdbcDao.queryForString("select sys_att_id_seq.Currval from dual", null);
//		String filename = jdbcDao
//				.queryForString(
//						"select save_file_name from sys_attachment_tab t where t.ATT_ID=" + sysAttId,
//						null);
//		String path = filename.substring(0, filename.lastIndexOf("/"));
//		HttpRequestObject hro = multipleRequestMap.get(filewname).get(index);
//		byte[] bytes = hro.getValue();
//		path = filename.substring(0, filename.lastIndexOf("/"));
//		File file = new File(path);
//		file.mkdirs();
//		DataOutputStream dos = new DataOutputStream(new BufferedOutputStream(
//				new FileOutputStream(filename)));
//		dos.write(bytes, 0, bytes.length);
//		dos.flush();
//	}

	/**
	 * 根据查询结果集合删除附件,物理删除文件
	 * @param rsList
	 */
	private void delFile(List<Map<String, Object>> rsList) {
		for (Map<String, Object> rsMap : rsList) {
			for (Entry<String, Object> entity : rsMap.entrySet()) {
				String saveFileName = entity.getValue() == null ? "" : entity
						.getValue().toString();
				if (!"".equals(saveFileName)) {
					File file = new File(saveFileName);
					if (file.exists())
						file.delete();
				}
				break;
			}
		}

	}

	/**
	 * 将查询的结果集推送到系统的map中
	 *@param rsList
	 *@param multipleRequestMap
	 *@param simpleRequestMap
	 *@throws Exception
	 */
	private void putRecordListToMap(List<Map<String, Object>> rsList,
			Map<String, List<HttpRequestObject>> multipleRequestMap,
			Map<String, String> simpleRequestMap) throws Exception {
		if (rsList != null && rsList.size() > 0) {
			for (Map<String, Object> rsMap : rsList) {
				for (Entry<String, Object> entity : rsMap.entrySet()) {
					String key = entity.getKey();// key值默认为
					String value = entity.getValue() == null ? "" : entity
							.getValue().toString();
					HttpRequestObject hro = new HttpRequestObject();
					hro.setName(key);
					hro.setValue(value.getBytes(Environment.ENCODING));
					if (multipleRequestMap.containsKey(key)) {
						List<HttpRequestObject> hroList = multipleRequestMap
								.get(key);
						hroList.add(hro);
					} else {
						List<HttpRequestObject> hroList = new LinkedList<HttpRequestObject>();
						hroList.add(hro);
						multipleRequestMap.put(key, hroList);
					}
					simpleRequestMap.put(key, value);
				}
			}
		}
	}
}
