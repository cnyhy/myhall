package com.weimingfj.common.service;

import org.springframework.transaction.annotation.Transactional;

import com.weimingfj.common.form.RequestDataForm;
import com.weimingfj.common.form.ResponseDataForm;

/**
 * @author lansb
 * Service统一入口
 * Transactional 注释事务
 */
public interface IService {
	@Transactional 
	public ResponseDataForm service(RequestDataForm requestDataForm) throws Exception;
}
