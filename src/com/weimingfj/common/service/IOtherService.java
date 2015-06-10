package com.weimingfj.common.service;

import java.util.List;
import java.util.Map;

/**
 * 
 * @author Administrator
 *
 */
public interface IOtherService {
	/**
	 * 创建二维码视图
	 * @param url
	 * @param list 
	 * @return
	 * @throws Exception
	 */
	List<Map<String,Object>> createQrMapping(String url, List<Map<String, Object>> list) throws Exception;
	/**
	 * 发送短信
	 * @param mobile
	 * @param content
	 * @return
	 * @throws Exception
	 */
	String sendSMS(String mobile,String content)throws Exception;
	/**
	 * 获取运吧车辆信息
	 * @param param
	 * @return
	 * @throws Exception
	 */
	Map<String,Object> getYBTruckInfomation(Map<String,String> param) throws Exception;
	/**
	 * 获取运吧货源信息
	 * @param map
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> getYBCargoInfomation(Map<String, String> map)throws Exception;
	/**
	 * 获取增值服务所用到的钱
	 */
	Integer getDictionares(String type) throws Exception;
	/**
	 * 添加日志
	 * @param type 日志类型
	 * @param point  消费点数
	 * @param obj   消费对象
	 * @param userId 用户id
	 * @param isSuccess 是否成功
	 * @throws Exception
	 */
	void addLogMessage(int typeCode,Integer point,String obj,boolean isSuccess,String userId,String resultObj)throws Exception;
	/**
	 * 绑定运吧id
	 * @param map
	 * @return
	 * @throws Exception
	 */
	Map<String, Object> bandYbId(Map<String, String> map)throws Exception;
	
}
