var _contextPath = comm._contextPath;
var zTree;
var zNodes;
function ajaxDataFilter(treeId, parentNode, json) {
    if(json.rows.length>0){
    	zNodes=json.rows;
    	zNodes.push({ORG_ID:0,PID:"",ORG_NAME:"所有售货机"});
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
			url:_contextPath + '/topic/list/sys!orgListData',
			autoParam:[],
			dataFilter: ajaxDataFilter
		},
		data: {
			simpleData: {
				enable:true,
				idKey: "ORG_ID",
				pIdKey: "PID",
				rootPId: ""
			},
			key:{
				name:"ORG_NAME",
				title:"ORG_NAME"
			}
		},
		callback:{
			onClick:function(event, treeId,treeNode){
				$("#vmc_code").val("");
				if(treeNode.ORG_ID > 0){
					ClientInfo.queryClientInfoList(treeNode.ORG_ID);
				}else{
					ClientInfo.queryClientInfoList();
				}
			}
		}
};
var ClientInfo={
		initInfo : function(){
			$('#infoList').datagrid({
				url : _contextPath+"/topic/list/vmc!clientListData",
				singleSelect : true,
				rownumbers:true,
				striped:true,
				pageSize:20,
				queryParams: {},
				toolbar :[
				    { //添加页
					    text : '添加',
					    iconCls : 'icon-add',
					    handler : function(){ 
					    	parent.addTab('设备新增||icon-add||' +  _contextPath + '/topic/vmc!clientedit');
					    }
					},'-', 
					{
					    text : '修改',
					    iconCls : 'icon-edit',
					    handler : function(){
					    	var selections = $('#infoList').datagrid('getSelections');
							if (selections!=null&&selections.length==1){
								parent.addTab('设备修改||icon-edit||' +  _contextPath + '/topic/vmc!clientedit?id='+selections[0].CLIENT_ID);
								$('#urlInfoList').datagrid('clearSelections');
							} else {
								$.messager.alert("消息提示","请选择一条记录","error");
							}
					    }
					},'-',
					{
					    text : '删除',
					    iconCls : 'icon-remove',
					    handler : function(){
					    	var selections = $('#infoList').datagrid('getSelections');
							if (selections!=null&&selections.length!=0){
								$.messager.confirm('警告', '确定要删除吗?', function(r) {
									if (r) {
										var ids = [];
										for(var i=0;i<selections.length;i++){
											ids.push(selections[i].CLIENT_ID);
										}
										var config = {
											"ID":ids.join(',')		    	
										};
										$.ajax({
											type : 'POST',
											url : _contextPath + '/topic/exec/vmc!clientdelete',
											data : config,
											dataType : "json",
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
					},'-',
					{
					    text : '允许服务',
					    iconCls : 'icon-ok',
					    handler : function(){
					    	var selections = $('#infoList').datagrid('getSelections');
							if (selections!=null&&selections.length!=0){
								if(selections[0].CLIENT_STATUS_SERVICE=="0"){
						    		$.messager.alert("提示","该设备已允许服务！","info");
						    		return;
						    	}
								$.messager.confirm('警告', '确定要允许服务该设备吗?', function(r) {
									if (r) {
										var ids = [];
										for(var i=0;i<selections.length;i++){
											ids.push(selections[i].CLIENT_ID);
										}
										var config = {
											"ID":ids.join(',')
										};
										$.ajax({
											type : 'POST',
											url : _contextPath + '/topic/exec/vmc!clientenable',
											data : config,
											dataType : "json",
											success : function(json) {
												if(json.result =="1") {
													$.messager.alert("消息提示","设备允许服务成功！","info",function(){
														$('#infoList').datagrid('reload');
														$('#infoList').datagrid('clearSelections');
													});
												} else {
													$.messager.alert("消息提示","设备允许服务失败！","error");
												}						
											}
										});
									}
								});
							} else {
								$.messager.alert("消息提示","请选择记录","error");
							}
					    }
					},'-',
					{
					    text : '停止服务',
					    iconCls : 'icon-cancel',
					    handler : function(){
					    	var selections = $('#infoList').datagrid('getSelections');
							if (selections!=null&&selections.length!=0){
								if(selections[0].CLIENT_STATUS_SERVICE=="2"){
						    		$.messager.alert("提示","该设备已停止服务！","info");
						    		return;
						    	}
								$.messager.confirm('警告', '确定要停止服务该设备吗?', function(r) {
									if (r) {
										var ids = [];
										for(var i=0;i<selections.length;i++){
											ids.push(selections[i].CLIENT_ID);
										}
										var config = {
											"ID":ids.join(',')	
										};
										$.ajax({
											type : 'POST',
											url : _contextPath + '/topic/exec/vmc!clientPauseService',
											data : config,
											dataType : "json",
											success : function(json) {
												if(json.result =="1") {
													$.messager.alert("消息提示","设备停止服务成功！","info",function(){
														$('#infoList').datagrid('reload');
														$('#infoList').datagrid('clearSelections');
													});
												} else {
													$.messager.alert("消息提示","设备停止服务失败！","error");
												}						
											}
										});
									}
								});
							} else {
								$.messager.alert("消息提示","请选择记录","error");
							}
					    }
					},'-',
					{
					    text : '暂停服务',
					    iconCls : 'icon-cancel',
					    handler : function(){
					    	var selections = $('#infoList').datagrid('getSelections');
							if (selections!=null&&selections.length!=0){
								if(selections[0].CLIENT_STATUS_SERVICE=="1"){
						    		$.messager.alert("提示","该设备已暂停服务！","info");
						    		return;
						    	}
								$.messager.confirm('警告', '确定要暂停服务该设备吗?', function(r) {
									if (r) {
										var ids = [];
										for(var i=0;i<selections.length;i++){
											ids.push(selections[i].CLIENT_ID);
										}
										var config = {
											"ID":ids.join(',')	
										};
										$.ajax({
											type : 'POST',
											url : _contextPath + '/topic/exec/vmc!clientdisable',
											data : config,
											dataType : "json",
											success : function(json) {
												if(json.result =="1") {
													$.messager.alert("消息提示","设备暂停服务成功！","info",function(){
														$('#infoList').datagrid('reload');
														$('#infoList').datagrid('clearSelections');
													});
												} else {
													$.messager.alert("消息提示","设备暂停服务失败！","error");
												}						
											}
										});
									}
								});
							} else {
								$.messager.alert("消息提示","请选择记录","error");
							}
					    }
					},'-',
					{
					    text : '货道初始化',
					    iconCls : 'icon-save',
					    handler : function(){
					    	var selections = $('#infoList').datagrid('getSelections');
							if (selections!=null&&selections.length!=0){
								$.messager.confirm('警告', '该操作会清空该设备已有的货道配置信息,确定要初始化货道吗?', function(r) {
									if (r) {
										var CLIENT_NO = selections[0].VMC_NO;
										var PATH_COUNT= selections[0].PATH_COUNT;
										var PRODUCT_COUNT=selections[0].PATH_PRODUCT_COUNT;
										var PATH_REMAINING=0;
										var CABID=selections[0].DRAG_CABINET;
										$.ajax({
											type : 'POST',
											url : _contextPath + '/topic/exec/vmc!pathRealDelete',
											data : {"CLIENT_NO":CLIENT_NO},
											dataType : "json",
											async:false,
											success : function(json) {
											}
										});
										for(var j=0;j<=CABID;j++){
											for(var i=0; i< PATH_COUNT; i++){
												var pathno=i;
												if(pathno%10 !=9)
												{
													pathno=pathno+11;
												}else if(i%10==9)
												{
													pathno=pathno+1;
												}
												$.ajax({
													type : 'POST',
													url : _contextPath + '/topic/exec/vmc!pathinsert',
													data : {"CLIENT_NO":CLIENT_NO,"CABINET_NO":j,"PATH_NO":pathno,"PRODUCT_NO":'',"PATH_REMAINING":PATH_REMAINING,"PATH_COUNT":PRODUCT_COUNT},
													dataType : "json",
													async:false,
													success : function(json) {
													}
												});
											}
										}
										$.messager.alert("消息提示","初始化货道成功","info");
									}
								});
							} else {
								$.messager.alert("消息提示","请选择记录","error");
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
						formatter:function(value,row,index){ return row.CLIENT_ID;} 
					},	 
					{title:'设备编号',field:'VMC_NO',width:250},
					{title:'唯一标识',field:'VMC_CODE',width:70},
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
					{title:'是否有加热模块',field:'IS_HEATER',width:100,
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
					{title:'是否有制冷模块',field:'IS_COOLER',width:100,
						formatter:function(value,row,index){ 
						if (row.IS_COOLER==1){
							return "是";
						} else if (row.IS_COOLER==0) {
							return "否";
						} else {
							return "";
						}
					}},
					{title:'签到码',field:'VMC_AUTH_CODE',width:120},
					{title:'重启间隔天数',field:'RESTART_SKIP',width:70},
					{title:'维护模式密码',field:'MANAGER_PASSWORD',width:100},
					{title:'最后修改时间',field:'LAST_EDIT_TIME',width:150,
						formatter:function(value,row,index){ 
						return $.FormatDateTime(row.LAST_EDIT_TIME,false,true);
						
					}},
					{title:'设备状态',field:'CLIENT_STATUS_SERVICE',width:100,
						formatter:function(value,row,index){ 
						if (row.CLIENT_STATUS_SERVICE+'' == '1'){
							return "暂停服务";
						} else if (row.CLIENT_STATUS_SERVICE == 0) {
							return "允许服务";
						} else if (row.CLIENT_STATUS_SERVICE == 2){
							return "停止服务";
						}else{
							return "未知";
						}
					}},
					{title:'所属机构',field:'ORG_NAME',width:120},
					{title:'每层货道数',field:'LINE_PATH_COUNT',hidden:true},
					{title:'每个货道货物数',field:'PATH_PRODUCT_COUNT',hidden:true}
				 ]],
				 onClickRow: function(rowIndex, rowData){
		             //让点击的行单选按钮选中
		             $("input[type='radio']")[rowIndex].checked = true;
				 }
			});
        },
        allocationed : function(ORG_ID){
			$('#infoList3').datagrid({
				url : _contextPath+"/topic/list/vmc!clientListData",
				singleSelect : true,
				rownumbers:true,
				striped:true,
				selectOnCheck:false,
				pageSize:10,
				queryParams: {"ORG_ID":ORG_ID},
				columns:[[  
					{
					    field: 'CLIENT_ID',
					    checkbox: true,
					    width: 30,
					    formatter:function(value,row,index){ return row.CLIENT_ID;} 
					},
					{title:'唯一标识',field:'VMC_CODE',width:70},
					{title:'货道数量',field:'PATH_COUNT',width:70},
					{title:'设备状态',field:'CLIENT_STATUS_SERVICE',width:100,
						formatter:function(value,row,index){ 
							if(row.CLIENT_STATUS_SERVICE){
								return "";
							}
						if (row.CLIENT_STATUS_SERVICE==1){
							return "暂停服务";
						} else if (row.CLIENT_STATUS_SERVICE==0) {
							return "允许服务";
						} else if (row.CLIENT_STATUS_SERVICE==2){
							return "停止服务";
						}else{
							return "未知";
						}
					}}
				 ]]
			});
        },
        unAllocation : function(){
			$('#infoList2').datagrid({
				url : _contextPath+"/topic/list/vmc!clientUnAllocation",
				singleSelect : true,
				rownumbers:true,
				striped:true,
				selectOnCheck:false,
				pageSize:10,
				queryParams: {},
				columns:[[  
					{
					    field: 'CLIENT_ID',
					    checkbox: true,
					    width: 30,
					    formatter:function(value,row,index){ return row.CLIENT_ID;} 
					},
					{title:'唯一标识',field:'VMC_CODE',width:70},
					{title:'货道数量',field:'PATH_COUNT',width:70},
					{title:'设备状态',field:'CLIENT_STATUS_SERVICE',width:100,
						formatter:function(value,row,index){ 
							if(row.CLIENT_STATUS_SERVICE){
								return "";
							}
						if (row.CLIENT_STATUS_SERVICE==1){
							return "暂停服务";
						} else if (row.CLIENT_STATUS_SERVICE==0) {
							return "允许服务";
						} else if (row.CLIENT_STATUS_SERVICE==2){
							return "停止服务";
						}else{
							return "未知";
						}
					}}
				 ]]
			});
        },
		//查询
		queryClientInfoList : function(ORG_ID){
			var config = {
				//"vmc_code":$("#vmc_code").val()
					"vmc_code":$("input[name=vmc_code]").val()
			};
			if(ORG_ID){
				config = {
					"ORG_ID":ORG_ID
				};
			}
			$('#infoList').datagrid({ queryParams: config }); 
		},
		allocation:function(){
			var treeObj = $.fn.zTree.getZTreeObj("perinfoList");
			var nodes=treeObj.getSelectedNodes();
			if(nodes.length < 1){
				$.messager.alert("消息提示","请选择机构","error");
				return false;
			}else if(nodes[0].ORG_ID==0){
				$.messager.alert("消息提示","请选择下级机构","error");
				return false;
			}
			ClientInfo.unAllocation();
			ClientInfo.allocationed(nodes[0].ORG_ID);
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
						url : _contextPath + '/topic/exec/vmc!clientOrgInsert',
						data : {"ORG_ID":nodes[0].ORG_ID,"CLIENT_ID":checkeds[i].CLIENT_ID},
						dataType : "json",
						async:false,
						success : function(json) {
						}
					});
				}
			}else{
				var checkeds=$('#infoList3').datagrid("getChecked");
				var CLIENT_IDS=new Array();
				for(var i=0;i<checkeds.length; i++){
					CLIENT_IDS.push(checkeds[i].CLIENT_ID);
				}
				if(CLIENT_IDS.length>0){
					$.ajax({
						type : 'POST',
						url : _contextPath + '/topic/exec/vmc!clientOrgDelete',
						data : {"ORG_ID":nodes[0].ORG_ID,"CLIENT_IDS":CLIENT_IDS.join(",")},
						dataType : "json",
						async:false,
						success : function(json) {
						}
					});
				}
				
			}
			ClientInfo.unAllocation();
			ClientInfo.allocationed(nodes[0].ORG_ID);
			ClientInfo.queryClientInfoList(nodes[0].ORG_ID);
		},
		closeDialog:function(){
			//清空表单
			$("#allocationedit").dialog("close");
		},
		loadVmc_Code:function(){
			$("#vmc_code").combogrid({
				panelWidth: 500,
				idField: 'VMC_CODE',
				textField: 'VMC_CODE',
				url: _contextPath+"/topic/list/vmc!clientListData",
				queryParams: {},
				method: 'get',
				columns: [[
							{title:'CLIENT_ID',checkbox:true,hidden:true,
								formatter:function(value,row,index){ return row.CLIENT_ID;} 
							},
							{title:'唯一标识',field:'VMC_CODE',width:70},
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
							{title:'是否有加热模块',field:'IS_HEATER',width:100,
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
							{title:'是否有制冷模块',field:'IS_COOLER',width:100,
								formatter:function(value,row,index){ 
								if (row.IS_COOLER==1){
									return "是";
								} else if (row.IS_COOLER==0) {
									return "否";
								} else {
									return "";
								}
							}},
							{title:'禁用状态',field:'IS_DISABLE',width:100,
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
		}
};

$(document).ready(function(){ 
	var t = $("#perinfoList");
	$.fn.zTree.init(t, setting);
	ClientInfo.initInfo();
	ClientInfo.loadVmc_Code();
});