function trim(str){ //删除左右两端的空格
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
function isEmpty(str){
	if(str == '' || str == null || str.length == 0 || str == undefined){
		return true;
	}
	return false;
}
/******长度校验********/
function lengthVerify(val,maxLength) {
	if(val.length > maxLength) {
		 return false;
	}
	return true;
}
/*******数字验证**********/
function numberVerify(val) {
	if(!/^\d+$/.test(val)){
		return false;
	}
	//if(isNaN(val)) {
	//	return false;
	//}
	return true;
}
function positiveNumVerify(val){
	if(!/^\d+(\.\d+)?$/.test(val)){
		//$.ligerDialog.alert("请输入数字且不能为负数!");
		return false;
	}
	return true;
}
function truckPlateVerify(str) {
    return /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/.test(str);
}
/********身份证验证**********/
function idCardVerify(val) {
	if(!/^\d{17}[\dXx]$/.test(val)){
		//$.ligerDialog.alert("请输入正确的身份证号码!");
		return false;
	}
	return true;
}
/*********手机号码验证*************/
function phoneVerify(val) {
	if(!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(val))){
		//$.ligerDialog.alert("请输入正确的手机号码!");
		return false;
	}
	return true;
}
function telVerify(val){
	if(!(/^(\d{3,4}[-]{0,1})?\d{7,8}$/.test(val))){
		//$.ligerDialog.alert("请输入正确的电话号码!");
		return false;
	}
	return true;
}

function emailVerify(val) {
	if(!/^([a-z0-9])(([\-.]|[_]+)?([a-z0-9]+))*(@)([a-z0-9])((([-]+)?([a-z0-9]+))?)*((.[a-z]{2,3})?(.[a-z]{2,6}))$/.test(val)) {
		return false;
	}
	return true;
}
//验证日期 yyyy/mm/dd  或  yyyy.mm.dd  或  yyyy-mm-dd
//用法：
//<input id="txtdata" /> <input type="button" onclick="dateCheck()" value="test"/>
function dateCheck(str) {
  var re = new RegExp("^([0-9]{4})[./-]{1}([0-9]{1,2})[./-]{1}([0-9]{1,2})$");
  var ar;
  var res = true;
  if ((ar = re.exec(str)) != null){
      var i;
      i = parseFloat(ar[3]);
      if (i <= 0 || i > 31){
          res = false;
      }
      i = parseFloat(ar[2]);
      if (i <= 0 || i > 12){
          res = false;
      }
  }else{
      res = false;
  }
  return res;
}
