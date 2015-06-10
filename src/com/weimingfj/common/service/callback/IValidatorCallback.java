package com.weimingfj.common.service.callback;

import com.weimingfj.common.form.RequestDataForm;

/**
 * @author lansb
 *验证器回调接口
 */
public interface IValidatorCallback {
	/**
	 * 验证回调实现函数
	 * @param requestDataForm
	 * @return true验证成功，false验证失败
	 * @throws Exception
	 */
	public boolean validatorCallback(RequestDataForm requestDataForm) throws Exception;
}
