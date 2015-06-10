package com.weimingfj.common.service.callback.impl;

import com.weimingfj.common.form.RequestDataForm;
import com.weimingfj.common.form.ResponseDataForm;
import com.weimingfj.common.service.callback.IServiceCallback;
import com.weimingfj.common.service.callback.IValidatorCallback;

public class ConsumeCallbackImpl implements IServiceCallback , IValidatorCallback{

	@Override
	public void serviceCallback(RequestDataForm requestDataForm,
			ResponseDataForm responseDataForm) throws Exception {
		System.out.println("=============================service callback begin===========================");
		
	}

	@Override
	public boolean validatorCallback(RequestDataForm requestDataForm)
			throws Exception {
		System.out.println("=============================validator callback begin===========================");
		
		return true;
	}

}
