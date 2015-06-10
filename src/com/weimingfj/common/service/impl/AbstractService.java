package com.weimingfj.common.service.impl;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.weimingfj.common.dao.IJdbcDao;
import com.weimingfj.common.service.IService;
import com.weimingfj.common.sqlparse.ISqlParse;


/**
 * @author lansb
 *  
 */
public abstract class AbstractService implements IService {
	protected Log logger = LogFactory.getLog(this.getClass());
	@Autowired   
	protected ISqlParse sqlParse;
	@Autowired
	protected IJdbcDao jdbcDao;
	/**
	 * 数据验证，特殊验证请重写该方法；
	 * 
	 * @return
	 */
	protected boolean validate() {
		
		return true;
	}
}
