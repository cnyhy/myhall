/***$(function() {
	//启动摄像头
	startCamera();
	//个人照
	$("#personTakePhoto").click(function(){
		scamera("personCanvas","base64Jpg");
	});
	//驾驶证
	$("#driverTakePhoto").click(function(){
		scamera("driverCanvas","licenseBase64Png");
	});
	//经营许可证
	$("#businessLicenseTakePhoto").click(function(){
		scamera("businessLicenseCanvas","organizationCodeBase64Jpg");
	});
	//税务登记证
	$("#taxRegLicenseTakePhoto").click(function(){
		scamera("taxRegLicenseCanvas","taxRegLicenseBase64Jpg");
	});
	
});**/
/******启动摄像头*****/
function startCamera(videoArr){
	for(var i = 0; i < videoArr.length; i++){
		initCamera(videoArr[i]);
	}
}
/******初始化摄像头***/
function initCamera(id){
	//判断元素是否存在
	if(existsElement(id))
	{
		var video = document.getElementById(id);
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
		if (navigator.getUserMedia) {
			if (navigator.webkitURL) {
				navigator.getUserMedia("video", function(stream) {
					video.src = window.webkitURL.createObjectURL(stream);
				}, function(error) {
					alert("摄像头初始化失败,未找到摄像头硬件");
				});
			} else {
				var gumOptions = {
					video : true,
					toString : function() {
						return 'video';
					}
				};
				navigator
						.getUserMedia(
								gumOptions,
								function successCallback(stream) {
									if (navigator.getUserMedia == navigator.mozGetUserMedia) {
										video.src = stream;
									} else {
										video.src = window.URL
												.createObjectURL(stream)
												|| stream;
									}
									video.play();
								}, function(error) {
									alert("摄像头初始化失败,未找到摄像头硬件");
									video.play();
								});
			}
		} else {
			alert("navigator.getUserMedia  Error null");
			video.play();
		}
	}
	
}

/*****元素是否存在******/
function existsElement(id){
	if($("#"+id).length > 0 && $("#"+id).length == 1)
	{
		return true;
	}
	return  false;
}


/********画图*********/
function drawImage(id,src){
	var canvas = document.getElementById(id);
	var cxt = canvas.getContext ("2d");
	
	var img=new Image();
	img.src = src;
	img.onload=function(){
		cxt.drawImage(img, 0,0,320,240);    
	};	
	cxt.drawImage(img,0,0,320,240);	
}