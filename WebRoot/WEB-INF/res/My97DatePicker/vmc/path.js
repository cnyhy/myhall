var _contextPath = comm._contextPath;
var zTree;
var queryParam;
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
var PathInfo={
		initInfo : function(){
			$('#infoList').datagrid({
				url : _contextPath+"/topic/list/vmc!pathListData",
				singleSelect : true,
				rownumbers:true,
				striped:true,
				pageSize:30,
				queryParams: {},
				toolbar :[
				    { //添加页
					    text : '添加',
					    iconCls : 'icon-add',
					    handler : function(){ 
					    	parent.addTab('货道新增||icon-add||' +  _contextPath + '/topic/vmc!pathedit');
					    }
					},'-', 
					{
					    text : '修改',
					    iconCls : 'icon-edit',
					    handler : function(){
					    	var selections = $('#infoList').datagrid('getSelections');
							if (selections!=null&&selections.length==1){
								parent.addTab('货道修改||icon-edit||' +  _contextPath + '/topic/vmc!pathedit?id='+selections[0].PATH_ID+"&queryParam="+JSON.stringify(queryParam));
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
											ids.push(selections[i].PATH_ID);
										}
										var config = {
											"ID":ids.join(',')		    	
										};
										$.ajax({
											type : 'POST',
											url : _contextPath + '/topic/exec/vmc!pathdelete',
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
					    text : '启用',
					    iconCls : 'icon-ok',
					    handler : function(){
					    	var selections = $('#infoList').datagrid('getSelections');
							if (selections!=null&&selections.length!=0){
								if(selections[0].IS_DISABLE=="0"){
						    		$.messager.alert("提示","该货道已启用！","info");
						    		return;
						    	}
								$.messager.confirm('警告', '确定要启用该货道吗?', function(r) {
									if (r) {
										var ids = [];
										for(var i=0;i<selections.length;i++){
											ids.push(selections[i].PATH_ID);
										}
										var config = {
											"ID":ids.join(',')
										};
										$.ajax({
											type : 'POST',
											url : _contextPath + '/topic/exec/vmc!pathenable',
											data : config,
											dataType : "json",
											success : function(json) {
												if(json.result =="1") {
													$.messager.alert("消息提示","货道启用成功！","info",function(){
														$('#infoList').datagrid('reload');
														$('#infoList').datagrid('clearSelections');
													});
												} else {
													$.messager.alert("消息提示","货道启用失败！","error");
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
					    text : '禁用',
					    iconCls : 'icon-cancel',
					    handler : function(){
					    	var selections = $('#infoList').datagrid('getSelections');
							if (selections!=null&&selections.length!=0){
								if(selections[0].IS_DISABLE=="1"){
						    		$.messager.alert("提示","该货道已禁用！","info");
						    		return;
						    	}
								$.messager.confirm('警告', '确定要禁用该货道吗?', function(r) {
									if (r) {
										var ids = [];
										for(var i=0;i<selections.length;i++){
											ids.push(selections[i].PATH_ID);
										}
										var config = {
											"ID":ids.join(',')	
										};
										$.ajax({
											type : 'POST',
											url : _contextPath + '/topic/exec/vmc!pathdisable',
											data : config,
											dataType : "json",
											success : function(json) {
												if(json.result =="1") {
													$.messager.alert("消息提示","货道禁用成功！","info",function(){
														$('#infoList').datagrid('reload');
														$('#infoList').datagrid('clearSelections');
													});
												} else {
													$.messager.alert("消息提示","货道禁用失败！","error");
												}						
											}
										});
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
						formatter:function(value,row,index){ return row.PATH_ID;} 
					},	 
					{title:'设备编号',field:'CLIENT_NO',width:270},
					{title:'柜号',field:'CABINET_NO',width:70},
					{title:'货道编号',field:'PATH_NO',width:70},
					{title:'商品编号',field:'PRODUCT_NO',width:70},
					{title:'商品名称',field:'PRODUCT_NAME',width:100},
					{title:'货道容量',field:'PATH_COUNT',width:70},
					{title:'剩余货量',field:'PATH_REMAINING',width:100,sortable:true},
					{title:'最后修改时间',field:'LAST_EDIT_TIME',width:120,sortable:true,
						formatter:function(value,row,index){ 
						var date=new Date(row.LAST_EDIT_TIME); 
						return $.FormatDateTime(row.LAST_EDIT_TIME,false,true);
						
					}},
					{title:'上报时间',field:'UPLOAD_TIME',width:120,
						formatter:function(value,row,index){ 
							if(row.UPLOAD_TIME == '' || row.UPLOAD_TIME == null){
								return "";
							}
						var date=new Date(row.LAST_EDIT_TIME); 
						return $.FormatDateTime(row.UPLOAD_TIME,false,true);
						
					}},
					{title:'禁用状态',field:'IS_DISABLE',width:100,
						formatter:function(value,row,index){ 
						if (row.IS_DISABLE==1){
							return "故障";
						} else if (row.IS_DISABLE==0) {
							return "启用";
						}else if(row.IS_DISABLE==2) {
							return "禁用";
						}else {
							return "未知";
						}
					}},
					{title:'商品状态',field:'IS_SAME',width:100,
						formatter:function(value,row,index){ 
						if (row.IS_SAME==1){
							return "<span style='color:#FFB802;'>不同商品</span>";
						} else if (row.IS_SAME==0) {
							return "<span style='color:#3CE300;'>相同商品</span>";
						}else{
							return "暂未上报";
						}
					}}
				 ]],
				 onClickRow: function(rowIndex, rowData){
		             //让点击的行单选按钮选中
		             $("input[type='radio']")[rowIndex].checked = true;
				 }
			});
        },
		//查询
		queryPathInfoList : function(){
			queryParam = {
				"client_no":$("input[name=client_no]").val(),
				"path_no":$("#path_no").val(),
				"ORG_NAME":$("#ORG_NAME").val()
			};
			$('#infoList').datagrid({ queryParams: queryParam }); 
		},
		//查询
		queryPathInfoListByOther : function(obj,data){
			$(obj).datagrid({ url:_contextPath+"/topic/list/vmc!pathListData",queryParams: data }); 
		},
		queryClientList : function(ORG_ID){
			var org_id;
			if(ORG_ID){
				org_id=ORG_ID;
			}else{
				org_id="";
			}
			$("#client_no").combogrid({
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
									return "故障";
								} else if (row.IS_DISABLE==0) {
									return "启用";
								} else if (row.IS_DISABLE==2){
									return "禁用";
								}else {
									return "未知";
								}
							}},
							{title:'所属机构',field:'ORG_NAME',width:120}
				]],
				fitColumns: true
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
	$("#client_no").combogrid("clear");
	PathInfo.queryClientList(orgid);
	
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
		PathInfo.initInfo();
	$.fn.zTree.init($("#treeDemo"), setting);
	
});