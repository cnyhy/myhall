Array.prototype.indexOf = function(o){
	for (var i = 0, len = this.length; i < len; i++){
		if(this[i] == o) return i;
	}
	return -1;
};
//对Date的扩展，将 Date 转化为指定格式的String   
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
//例子：   
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.format = function(fmt) {//author: meizz   
	var o = {   
	 "M+" : this.getMonth()+1,                 //月份   
	 "d+" : this.getDate(),                    //日   
	 "h+" : this.getHours(),                   //小时   
	 "m+" : this.getMinutes(),                 //分   
	 "s+" : this.getSeconds(),                 //秒   
	 "q+" : Math.floor((this.getMonth()+3)/3), //季度   
	 "S"  : this.getMilliseconds()             //毫秒   
	};
	if(/(y+)/.test(fmt))
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("("+ k +")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	return fmt;   
};
/**
 * 把yyyyMMdd 转化为yyyy-MM-dd
 * @param strDate
 * @returns
 */
var simpleDateFormat = function(strDate) {
	if(strDate.length == 8){
		var y = strDate.substring(0,4);
		var m = strDate.substring(4,6);
		var d = strDate.substring(6,8);
		return y + "-" + m +"-"+d;
	}else{
		return strDate;
	}
};
//判断空对象
function isEmptyObject(obj){
    for(var n in obj){return false} 
    return true; 
}

function readObject(obj){
	var arr = [];
	for(var n in obj){
		arr.push(n + ":" + obj[n]);
	} 
	return arr.join(",");
}
//过滤数组,提出空字符串
function filterNullArray(arr){
	var newArr = [];
	for(var i = 0; i< arr.length; i++){
		if(!isEmpty(arr[i]) && arr[i] != 'null'){
			newArr.push(arr[i]);
		}
	}
	return newArr;
}
//去除数组中重复值
function uniqueArray(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}
function isEmpty(str){
	if(str == '' || str == null || str.length == 0 || str == undefined){
		return true;
	}
	return false;
}
/**
 * 获取digit位数随机数
 * @param digit
 */
function getMathRand(digit) { 
	var Num=""; 
	for(var i=0;i<parseInt(digit);i++) { 
		Num+=Math.floor(Math.random()*10); 
	} 
	return Num;
}
/**
 * alert(leftPad("123",6,'0'));
 * @param s
 * @param mL
 * @param seq
 * @returns
 */
function leftPad(s,mL,seq){
	return Array(mL+1).join(seq).replace(eval('/'+(seq?seq:',')+'/g'), function(m,i){ with(s){return mL-length>i?m:split('')[i-(mL-length)];}});
}

