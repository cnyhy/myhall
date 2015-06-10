var _contextPath = comm._contextPath;
var zTree;
//总金额
var total_money=0;
//实际金额
var use_money=0;
function ajaxDataFilter(treeId, parentNode, json) {
    return json.rows;
}
var setting = {
		check: {
			enable: true,
			chkStyle: "radio",
			radioType: "all"
		},
		view: {
			dblClickExpand: false
		},
		async: {
			enable: true,
			url:_contextPath + '/topic/list/sys!orgListData',
			autoParam:[],
			dataFilter: ajaxDataFilter
		},
		data: {
			simpleData: {
				enable:true,
				idKey: "ORG_ID",
				pIdKey: "PID",
				rootPId: 0
			},
			key:{
				name:"ORG_NAME",
				title:"ORG_NAME"
			}
		},
		callback: {
			onClick: onClick,
			onCheck: onCheck
		}
	};
var steein={
		initInfo : function(){
			
			//$('#recordsList').datagrid({
			$('#recordsList').datagrid({
				url : _contextPath+"/topic/list/vmc!transactionRecordsData",
				singleSelect : true,
				rownumbers:true,
				striped:true,
				pageSize:30,
				queryParams: {},
				/* showGroup:true ,
					  groupField:'ORDER_NO',//根据交易编号分类
				 groupFormatter:function(value,rows){
					return "订单编号:"+value +"&nbsp;&nbsp;&nbsp;&nbsp;        ("+rows.length+")"; 
				 },*/
				 
				columns:[[  
					{title:'售货机编号',field:'VMC_NO',width:70},
					{title:'订单编号',field:'ORDER_NO',width:200},
					{title:'交易金额',field:'ACTUAL_TOTAL',width:70,
						formatter:function(value,row,index){ 
							use_money += row.ACTUAL_TOTAL;
						return $.FormatMoney(row.ACTUAL_TOTAL);
					}},
					{title:'支付方式',field:'PAYMENT_TYPE',width:100,
						formatter:function(value,row,index){
							if(value==0){
								return "现金";
							}else if(value==1){
								return "支付宝";
							}else if(value ==2){
								return "银联";
							}else if(value==3){
								return "二维码";
							}else if(value==4){
								return "微支付";
							}
					}},
					{title:'支付状态',field:'PAY_STATUS',width:100,
						formatter:function(value,row,index){
							//'支付状态:(0:未付款（未开始或现金方式未投币），1:正在付款，2：付款完成（或现金足额），3：付款失败，4付款取消，5支付过程事件--仅银联支付)',
							switch(row.PAY_STATUS){
							case 0:
								return "未付款（未开始或现金方式未投币）";
							case 1:
								return "正在付款";
							case 2:
								return "付款完成";
							case 3:
								return "付款失败";
							case 4:
								return "付款取消";
							case 5:
								return "支付过程操作";
							}
						}
					},
					{title:'订单状态',field:'ORDER_STATUS',width:70,
						formatter:function(value,row,index){
							switch(row.ORDER_STATUS){
							/*case 0:
								return "";*/
							case 1:return "<span style='color:red;'>未支付</span>";  
							case 2:return "<span style='color:green'>出货成功</span>";
							case 3:return "<span style='color:red;'>出货未完成</span>";
							}
					}},
					{title:'退款金额',field:'REFUND_AMOUNT',width:100,align:'center',
						formatter:function(value,row,index){ 
						return $.FormatMoney(row.REFUND_AMOUNT);
					}},
					{field:'PRODUCT_COUNT',align:'center',title:"商品数量"},
					{title:'交易时间',field:'TRANSACTION_DATE',width:150,
						formatter:function(value,row,index){ 
							if(row.TRANSACTION_DATE == null){
								return "";
							}
						return $.FormatDateTime(row.TRANSACTION_DATE,false,true);
					}},
					{title:'创建时间',field:'CREATION_TIME',width:150,
						formatter:function(value,row,index){ 
						var date=new Date(row.CREATION_TIME); 
						return $.FormatDateTime(row.CREATION_TIME,false,true);
						
					}},
					{title:'会员名称',field:'MEMBER_NAME',width:100,
						formatter:function(value,row,index){ 
						return row.MEMBER_NAME;
					}},
					{title:'支付说明',field:'PAY_EXPLAIN',width:250,
						formatter:function(value,row,index){ 
						return row.PAY_EXPLAIN;
					}},
					{title:'退款状态',field:'REFUND_STATUS',width:100,
						formatter:function(value,row,index){ 
							//0：未退款；1：正在退款；2：退款成功；3：退款失败',
							switch(row.REFUND_STATUS){
							case 0:
								return "未退款";
							break;
							case 1 :
								return "正在退款";
							break;
							case 2 :
								return "退款成功";
							break;
							case 3 : 
								return "退款失败";
							break;
							}
					}},
				 ]],
				 view: detailview,
					detailFormatter:function(index,row){
						return '<div style="padding:2px"><table id="ddv-' + index + '"></table></div>';
					},
					onExpandRow: function(index,row){
						$('#ddv-'+index).datagrid({
							url:_contextPath +'/topic/list/sys!productListData',
							fitColumns:true,
							singleSelect:true,
							rownumbers:true,
							queryParams:{'ORDERNO':row.ORDER_NO},
							height:'auto',
							columns:[[
								{field:'PRODUCTID',width:80,hidden:true,title:"主键"},
								{field:'PRODUCT_NO',width:60,align:'right',title:"商品编号"},
								{field:'PRODUCT_NAME',width:60,align:'right',title:"商品名称"},
								{field:'PRODUCT_PRICE',width:60,align:'right',title:"商品价格",
										formatter:function(value,row,index){ 
											return $.FormatMoney(row.PRODUCT_PRICE);
								}},
								{field:'PRODUCT_NUMBER',align:'right',title:"商品数量",hidden:true},
								{field:'QUANTITY',width:60,align:'right',title:"预计出货"},
								{field:'ACTUAL_QUANTITY',width:60,align:'right',title:"实际出货"},
								{field:'sdds',width:60,align:'right',title:"出货状态",
									formatter:function(value,row,index){ 
										if(row.QUANTITY == row.ACTUAL_QUANTITY){
											return "<span style='color:#22D003'>出货成功</span>";
										}else{
											return "<span style='color:#FB0613'>出货失败</span>";;
										}
									}
									}
							]],
							onResize:function(){
								$('#recordsList').datagrid('fixDetailRowHeight',index);
							},
							onLoadSuccess:function(){
								setTimeout(function(){
									$('#recordsList').datagrid('fixDetailRowHeight',index);
								},0);
							}
						});
						$('#recordsList').datagrid('fixDetailRowHeight',index);
					}

			});
		},
		//查询
		recordsInfoList : function(){
			var config = {
				"VMC_NO":$("input[name=VMC_NO]").val(),
				"ORDER_NO":$("#ORDER_NO").val(),
				"PRODUCT_NO":$("#PRODUCT_NO").val(),
				"PAYMENT_TYPE":$("#PAYMENT_TYPE").val(),
				"ORDER_STATUS":$("#ORDER_STATUS").val(),
				"starDate":$("#starDate").val(),
				"endDate":$("#endDate").val()
			};
			 total_money=0;
			//实际金额
			 use_money=0;
			$('#recordsList').datagrid({ queryParams: config }); 
		},
		queryClientList : function(ORG_ID){
			var org_id;
			if(ORG_ID){
				org_id=ORG_ID;
			}else{
				org_id="";
			}
			$("#VMC_NO").combogrid({
				panelWidth: 500,
				idField: 'VMC_NO',
				textField: 'VMC_CODE',
				url: _contextPath+"/topic/list/vmc!clientListData",
				queryParams: {"ORG_ID":org_id},
				method: 'get',
				columns: [[
							{title:'CLIENT_ID',checkbox:true,hidden:true,
								formatter:function(value,row,index){ return row.CLIENT_ID;} 
							},
							{title:'唯一标识',field:'VMC_CODE',width:160},
							{title:'设备编号',field:'VMC_NO',width:250},
							{title:'货道数量',field:'PATH_COUNT',width:70},
							{title:'是否一拖二',field:'IS_EXTRA_CABINET',width:70,
								formatter:function(value,row,index){ 
									if (row.IS_EXTRA_CABINET==1){
										return "是";
									} else if (row.IS_EXTRA_CABINET==0) {
										return "否";
									} else {
										return "";
									}
								}
							},
							{title:'是否有加热模块',field:'IS_HEATER',width:70,
								formatter:function(value,row,index){ 
								if (row.IS_HEATER==1){
									return "是";
								} else if (row.IS_HEATER==0) {
									return "否";
								} else {
									return "";
								}
							}
							},
							{title:'是否有制冷模块',field:'IS_COOLER',width:70,
								formatter:function(value,row,index){ 
								if (row.IS_COOLER==1){
									return "是";
								} else if (row.IS_COOLER==0) {
									return "否";
								} else {
									return "";
								}
							}},
							{title:'禁用状态',field:'IS_DISABLE',width:70,
								formatter:function(value,row,index){ 
								if (row.IS_DISABLE==1){
									return "禁用";
								} else if (row.IS_DISABLE==0) {
									return "启用";
								} else {
									return "未知";
								}
							}},
							{title:'所属机构',field:'ORG_NAME',width:120}
				]],
				fitColumns: true
			});
		},
		//金额统计
	 totalMoney:function (){
				$("#total-money").text($.FormatMoney(total_money));
				$("#use-money").text($.FormatMoney(use_money));
			$("#win").window({
				width:300,
				height:120
			});
		},
		//导出excel 
		importExcel:function(){
			//$.messager.alert("消息提示","商品即将导出，请在桌面查看","info");
			var config = {
					"VMC_NO":$("input[name=VMC_NO]").val(),
					"ORDER_NO":$("#ORDER_NO").val(),
					"PRODUCT_NO":$("#PRODUCT_NO").val(),
					"PAYMENT_TYPE":$("#PAYMENT_TYPE").val(),
					"ORDER_STATUS":$("#ORDER_STATUS").val(),
					"starDate":$("#starDate").val(),
					"endDate":$("#endDate").val()
				};
			$.ajax({
				url: _contextPath+"/topic/import/importExcel",
				type:"post",
				data:config,
				dataType:"json",
				success:function(data){
					if(data.code == 1){
						window.location.href=data.msg;
					}else{
						$.messager.alert("消息提示",data.msg,"info");
					}
					
					
				},
				error:function(e,i,s){
					alert("请求错误==="+s);
				}
			});
			
		}
		
};

function onClick(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}

function onCheck(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
	nodes = zTree.getCheckedNodes(true),
	v = "";
	var orgid="";
	for (var i=0, l=nodes.length; i<l; i++) {
		v += nodes[i].ORG_NAME + ",";
		orgid=nodes[i].ORG_ID
	}
	if (v.length > 0 ) v = v.substring(0, v.length-1);
	var cityObj = $("#ORG_NAME");
	cityObj.attr("value", v);
	$("#VMC_NO").combogrid("clear");
	steein.queryClientList(orgid);
}
function showMenu() {
	var cityObj = $("#ORG_NAME");
	var cityOffset = $("#ORG_NAME").offset();
	$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "ORG_NAME" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}
$(document).ready(function(){ 
	$("#ORG_NAME").val("");
	$.fn.zTree.init($("#treeDemo"), setting);
	steein.initInfo();
});