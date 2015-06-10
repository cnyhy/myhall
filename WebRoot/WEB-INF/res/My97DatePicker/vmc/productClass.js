var _contextPath = comm._contextPath;
var zTree;
var zNodes;
function ajaxDataFilter(treeId, parentNode, json) {
    if(json.rows.length>0){
    	zNodes=json.rows;
    	zNodes.push({CLASS_CODE:"0",PID:"",CLASS_NAME:"所有分类"});
	}
    return zNodes;
}

var setting = {
		view: {
			dblClickExpand: true,
			showLine: true,
			selectedMulti: false,
			showTitle: true
		},
		async: {
			enable: true,
			url:_contextPath + '/topic/list/vmc!classListData',
			autoParam:[],
			dataFilter: ajaxDataFilter
		},
		data: {
			simpleData: {
				enable:true,
				idKey: "CLASS_CODE",
				pIdKey: "P_CODE",
				rootPId: "0"
			},
			key:{
				name:"CLASS_NAME",
				title:"CLASS_NAME"
			}
		},
		callback:{
			onClick:function(event, treeId,treeNode){
				if(treeNode.CLASS_CODE > 0){
					ProductClassInfo.initInfo(treeNode.CLASS_CODE);
				}
			}
		}
};
var ProductClassInfo={
		initInfo : function(class_code){
			var config = {
				"CLASS_CODE":class_code
			};
			$('#infoList').datagrid({
				url : _contextPath+"/topic/list/vmc!classProductListData",
				singleSelect : true,
				rownumbers:true,
				striped:true,
				pageSize:30,
				queryParams: config,
				toolbar :[
						    { 
							    text : '删除',
							    iconCls : 'icon-remove',
							    handler : function(){ 
							    	var treeObj = $.fn.zTree.getZTreeObj("perinfoList");
									var nodes=treeObj.getSelectedNodes();
									var selections = $('#infoList').datagrid('getSelections');
									if (selections!=null&&selections.length!=0){
										$.messager.confirm('警告', '确定要删除吗?', function(r) {
											if (r) {
										    	$.ajax({
													type : 'POST',
													url : _contextPath + '/topic/exec/vmc!classProductDelete',
													data : {"CLASS_CODE":nodes[0].CLASS_CODE,"PRODUCT_NOS":selections[0].PRODUCT_NO},
													dataType : "json",
													async:false,
													success : function(json) {
														if(json.result =="1") {
															$.messager.alert("消息提示","删除成功","info",function(){
																$('#infoList').datagrid('reload');
																$('#infoList').datagrid('clearSelections');
															});
														} else {
															$.messager.alert("消息提示","删除失败","error");
														}
													}
												});
											}
										});
									} else {
										$.messager.alert("消息提示","请选择一条记录","error");
									}
							    }
							}], 
				columns:[[  
					{
					    field: 'oid',
					    title: '',
					    width: 30,
					    formatter: function(value, rowData, rowIndex){
					        return '<input type="radio" name="selectRadio" id="selectRadio"' + rowIndex + '    value="' + rowData.oid + '" />';
					    }
					},
					{title:'test',checkbox:true,hidden:true,
						formatter:function(value,row,index){ return row.PRODUCT_ID;} 
					},	 
					{title:'商品编号',field:'PRODUCT_NO',width:70},
					{title:'品牌名称',field:'BRAND_NAME',width:70},
					{title:'商品名称',field:'PRODUCT_NAME',width:70},
					{title:'商品规格',field:'SPECIFICATIONS',width:100},
					{title:'厂家名称',field:'MANUFACTURER',width:120},
					{title:'商品市场价',field:'MARKET_PRICE',width:100,
						formatter:function(value,row,index){ 
						return $.FormatMoney(row.MARKET_PRICE);
						
					}},
					{title:'销售价',field:'SALES_PRICE',width:70,
						formatter:function(value,row,index){ 
						return $.FormatMoney(row.SALES_PRICE);
						
					}},
					{title:'奖励积分',field:'REWARD_INTEGRE',width:70},
					{title:'服务端剩余库存数量',field:'REMAINING',width:120},
					{title:'最后修改时间',field:'LAST_EDIT_TIME',width:120,
						formatter:function(value,row,index){ 
						var date=new Date(row.LAST_EDIT_TIME); 
						return $.FormatDateTime(row.LAST_EDIT_TIME,false,true);
						
					}},
					{title:'排序',field:'ORDERS',width:70}
				 ]],
				 onClickRow: function(rowIndex, rowData){
		             //让点击的行单选按钮选中
		             $("input[type='radio']")[rowIndex].checked = true;
				 }
			});
        },
        allocationed : function(class_code){
			$('#infoList3').datagrid({
				url : _contextPath+"/topic/list/vmc!classProductListData",
				singleSelect : true,
				rownumbers:true,
				striped:true,
				selectOnCheck:false,
				pageSize:10,
				queryParams: {"CLASS_CODE":class_code},
				columns:[[  
							{
							    field: 'PRODUCT_NO',
							    checkbox: true,
							    width: 30,
							    formatter:function(value,row,index){ return row.PRODUCT_NO;} 
							},
							{title:'商品编号',field:'PRODUCT_NO1',width:70,formatter:function(value,row,index){ return row.PRODUCT_NO;}},
							{title:'商品名称',field:'PRODUCT_NAME',width:170}
						 ]]
			});
        },
        unAllocation : function(class_code){
			$('#infoList2').datagrid({
				url : _contextPath+"/topic/list/vmc!productUnAllocation",
				singleSelect : true,
				rownumbers:true,
				striped:true,
				selectOnCheck:false,
				pageSize:10,
				queryParams: {"CLASS_CODE":class_code},
				columns:[[  
					{
					    field: 'PRODUCT_NO',
					    checkbox: true,
					    width: 30,
					    formatter:function(value,row,index){ return row.PRODUCT_NO;} 
					},
					{title:'商品编号',field:'PRODUCT_NO1',width:70,formatter:function(value,row,index){ return row.PRODUCT_NO;}},
					{title:'商品名称',field:'PRODUCT_NAME',width:170}
				 ]]
			});
        },
		allocation:function(){
			var treeObj = $.fn.zTree.getZTreeObj("perinfoList");
			var nodes=treeObj.getSelectedNodes();
			if(nodes.length < 1){
				$.messager.alert("消息提示","请选择分类","error");
				return false;
			}else if(nodes[0].CLASS_CODE==0){
				$.messager.alert("消息提示","请选择下级分类","error");
				return false;
			}
			ProductClassInfo.unAllocation(nodes[0].CLASS_CODE);
			ProductClassInfo.allocationed(nodes[0].CLASS_CODE);
			$("#allocationedit").dialog("open");
		},
		saveAllocation:function(flag){
			var treeObj = $.fn.zTree.getZTreeObj("perinfoList");
			var nodes=treeObj.getSelectedNodes();
			if(flag=="add"){
				var checkeds=$('#infoList2').datagrid("getChecked");
				for(var i=0;i<checkeds.length; i++){
					$.ajax({
						type : 'POST',
						url : _contextPath + '/topic/exec/vmc!classProductInsert',
						data : {"CLASS_CODE":nodes[0].CLASS_CODE,"PRODUCT_NO":checkeds[i].PRODUCT_NO},
						dataType : "json",
						async:false,
						success : function(json) {
						}
					});
				}
			}else{
				var checkeds=$('#infoList3').datagrid("getChecked");
				var PRODUCT_NOS=new Array();
				for(var i=0;i<checkeds.length; i++){
					PRODUCT_NOS.push(checkeds[i].PRODUCT_NO);
				}
				if(PRODUCT_NOS.length>0){
					$.ajax({
						type : 'POST',
						url : _contextPath + '/topic/exec/vmc!classProductDelete',
						data : {"CLASS_CODE":nodes[0].CLASS_CODE,"PRODUCT_NOS":PRODUCT_NOS.join(",")},
						dataType : "json",
						async:false,
						success : function(json) {
						}
					});
				}
				
			}
			ProductClassInfo.unAllocation(nodes[0].CLASS_CODE);
			ProductClassInfo.allocationed(nodes[0].CLASS_CODE);
			ProductClassInfo.initInfo(nodes[0].CLASS_CODE);
		},
		closeDialog:function(){
			//清空表单
			$("#allocationedit").dialog("close");
		}
};

$(document).ready(function(){ 
	var t = $("#perinfoList");
	$.fn.zTree.init(t, setting);
});