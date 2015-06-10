package com.weimingfj.common.web.dwz;


/**
 * dwz返回解析类
 * @author Administrator
 *
 */
public class ResponseUtils {

	/**
	 * DWZ ajax 返回值
	 * 
	 * {
	      "statusCode":"200", 
	      "message":"操作成功", 
	      "navTabId":"", 
	      "rel":"", 
	      "callbackType":"closeCurrent",
	      "forwardUrl":""
		}
	 * navTabAjaxDone是DWZ框架中预定义的表单提交回调函数．
	 * 服务器转回navTabId可以把那个navTab标记为reloadFlag=1, 下次切换到那个navTab时会重新载入内容. 
	 * callbackType如果是closeCurrent就会关闭当前tab
	 * 只有callbackType="forward"时需要forwardUrl值
	 * navTabAjaxDone这个回调函数基本可以通用了，如果还有特殊需要也可以自定义回调函数.
	 * 如果表单提交只提示操作是否成功, 就可以不指定回调函数. 框架会默认调用DWZ.ajaxDone()
	 * <form action="/user.do?method=save" onsubmit="return validateCallback(this, navTabAjaxDone)">
	 * 
	 * form提交后返回json数据结构statusCode=DWZ.statusCode.ok表示操作成功, 做页面跳转等操作. statusCode=DWZ.statusCode.error表示操作失败, 提示错误原因. 
	 * statusCode=DWZ.statusCode.timeout表示session超时，下次点击时跳转到DWZ.loginUrl
	 * {"statusCode":"200", "message":"操作成功", "navTabId":"navNewsLi", "forwardUrl":"", "callbackType":"closeCurrent"}
	 * {"statusCode":"300", "message":"操作失败"}
	 * {"statusCode":"301", "message":"会话超时"}
	 * 
	 */
	
	
	
}
