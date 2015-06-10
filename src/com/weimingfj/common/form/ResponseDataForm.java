package com.weimingfj.common.form;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author lansb
 * 执行返回结果form
 */
public class ResponseDataForm {
	public final static int SESSFUL = 1;
	public final static int FAULAIE = 2;
	public final static int EXCEPTION = 3;
	public final static int RAND_FAULAIE = 5;
	//针对分页查询，返回查询结果集合
	private PaginForm paginForm;
	//执行结果，1：SESSFUL，2：FAULAIE，3：EXCEPTION
	private int result; 
	//执行结果显示信息
	private String resultInfo;
	//校验错误列表
	private List<String> errorList; 
	//ajaxservice查询返回结果，可能是list，map，string
	private Object ajaxObject;
	
	private Map<String, Object> resultMap;
	
	private String page;
	
	public String getPage() {
		return page;
	}

	public void setPage(String page) {
		this.page = page;
	}

	public ResponseDataForm() {
		errorList = new ArrayList<String>();
	}

	public PaginForm getPaginForm() {
		return paginForm;
	}

	public void setPaginForm(PaginForm paginForm) {
		this.paginForm = paginForm;
	}

	public List<String> getErrorList() {
		return errorList;
	}

	public void setErrorList(List<String> errorList) {
		this.errorList = errorList;
	}

	public Object getAjaxObject() {
		return ajaxObject;
	}

	public void setAjaxObject(Object ajaxObject) {
		this.ajaxObject = ajaxObject;
	}

	public int getResult() {
		return result;
	}

	public void setResult(int result) {
		this.result = result;
	}

	public String getResultInfo() {
		return resultInfo;
	}

	public void setResultInfo(String resultInfo) {
		this.resultInfo = resultInfo;
	}

	public Map<String, Object> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, Object> resultMap) {
		this.resultMap = resultMap;
	}
}
