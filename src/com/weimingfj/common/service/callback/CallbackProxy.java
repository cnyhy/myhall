package com.weimingfj.common.service.callback;

import java.lang.reflect.Method;

import org.springframework.stereotype.Service;

import com.weimingfj.common.form.RequestDataForm;
import com.weimingfj.common.form.ResponseDataForm;

/**
 * @author lansb 回调代理
 */
@Service("callbackProxy")
public class CallbackProxy {
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public void serviceCallbackProxy(String clazz,
			RequestDataForm requestDataForm, ResponseDataForm responseDataForm) throws Exception {
		Class cls = Class.forName(clazz);
		Method method = cls.getMethod("serviceCallback",
				new Class[] { RequestDataForm.class, ResponseDataForm.class });
		if (null == method) {
			throw new java.lang.RuntimeException(cls.getClass().getName()
					+ "not implement IServiceCallback Interface!");
		}
		method.invoke(cls.newInstance(),
				new Object[] { requestDataForm, responseDataForm});
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public boolean validatorCallbackProxy(String clazz,
			RequestDataForm requestDataForm) throws Exception {
		Class cls = Class.forName(clazz);
		Method method = cls.getMethod("validatorCallback",
				new Class[] { RequestDataForm.class });
		if (null == method) {
			throw new java.lang.RuntimeException(cls.getClass().getName()
					+ "not implement IValidatorCallback Interface!");
		}
		return (Boolean) method.invoke(cls.newInstance(),
				new Object[] { requestDataForm });
	}
}
