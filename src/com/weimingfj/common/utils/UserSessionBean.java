package com.weimingfj.common.utils;

import java.util.Map;

public class UserSessionBean {
	private String userCode;
	private String userId;
	private String userName;
	private int organId;
	private int domainId;
	private String userType;
	private String areaName;
	private String areaCode;
	private String areaType;
	/**
	 * 用户其他信息
	 */
	private String[] userPrivIds;
	private String systemTitle;
	private String systemBottom;

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public String getUserCode() {
		return userCode;
	}

	public int getOrganId() {
		return organId;
	}

	public void setOrganId(int organId) {
		this.organId = organId;
	}

	public int getDomainId() {
		return domainId;
	}

	public void setDomainId(int domainId) {
		this.domainId = domainId;
	}

	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String[] getUserPrivIds() {
		return userPrivIds;
	}

	public void setUserPrivIds(String[] userPrivIds) {
		this.userPrivIds = userPrivIds;
	}

	public String getAreaCode() {
		return areaCode;
	}

	public void setAreaCode(String areaCode) {
		this.areaCode = areaCode;
	}

	public String getAreaType() {
		return areaType;
	}

	public void setAreaType(String areaType) {
		this.areaType = areaType;
	}

	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	public String getSystemTitle() {
		return systemTitle;
	}

	public void setSystemTitle(String systemTitle) {
		this.systemTitle = systemTitle;
	}

	public String getSystemBottom() {
		return systemBottom;
	}

	public void setSystemBottom(String systemBottom) {
		this.systemBottom = systemBottom;
	}

}
