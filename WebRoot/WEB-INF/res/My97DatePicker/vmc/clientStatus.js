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
					{title:'禁用状态',field:'IS_DISABLE',width:100,
						formatter:function(value,row,index){ 
						if (row.IS_DISABLE==1){
							return "禁用";
						} else if (row.IS_DISABLE==0) {
							return "启用";
						} else {
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
					{title:'禁用状态',field:'IS_DISABLE',width:100,
						formatter:function(value,row,index){ 
						if (row.IS_DISABLE==1){
							return "禁用";
						} else if (row.IS_DISABLE==0) {
							return "启用";
						} else {
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
			$.ajax({
				type : 'POST',
				url : _contextPath + '/topic/list/vmc!clientStatusListData',
				data : config,
				dataType : "json",
				async:false,
				success : function(json) {
					if(json.rows.length>0){
						$("#clientCount").text(json.rows.length);
						$("#imgList").html("");
						var html="";
						for(var i=0;i<json.rows.length; i++){
							html ="<li title='"+"状态:未知"+"' onclick='ClientInfo.showClientStatus(\""+json.rows[i].VMC_NO+"\");'>";
							html +="<div class='bg_cancel'><img src='"+comm._resRoot+"/imgs/archmodels.jpg'/></div>";
							html +="<div class='bg_cancel'>"+json.rows[i].VMC_CODE+"</div></li>";
							if(json.rows[i].CLIENT_STATUS==0 && json.rows[i].IS_STATUS == 0){
								html ="<li title='"+"状态:正常"+"' onclick='ClientInfo.showClientStatus(\""+json.rows[i].VMC_NO+"\");'>";
								html +="<div class='bg_green'><img src='"+comm._resRoot+"/imgs/archmodels.jpg'/></div>";
								html +="<div class='bg_green'>"+json.rows[i].VMC_CODE+"</div></li>";
							}else if(json.rows[i].CLIENT_STATUS==1){
								html ="<li title='"+"状态:禁用"+"' onclick='ClientInfo.showClientStatus(\""+json.rows[i].VMC_NO+"\");'>";
								html +="<div class='bg_cancel'><img src='"+comm._resRoot+"/imgs/archmodels.jpg'/></div>";
								html +="<div class='bg_cancel'>"+json.rows[i].VMC_CODE+"</div></li>";
							}else if(json.rows[i].CLIENT_STATUS==2 || json.rows[i].IS_STATUS== 1){
								html ="<li title='"+"状态:异常/暂停服务"+"' onclick='ClientInfo.showClientStatus(\""+json.rows[i].VMC_NO+"\");'>";
								html +="<div class='bg_red'><img src='"+comm._resRoot+"/imgs/archmodels.jpg'/></div>";
								html +="<div class='bg_red'>"+json.rows[i].VMC_CODE+"</div></li>";
							}
							$("#imgList").append(html);
						}
					}else{
						$("#clientCount").text(0);
						$("#imgList").html("<p>暂无数据</p>");
					}
				}
			});
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
		showClientStatus:function(vmc_no){
			$.ajax({
				type : 'POST',
				url : _contextPath + '/topic/list/vmc!clientStatusListData',
				data : {"vmc_no":vmc_no},
				dataType : "json",
				success : function(json) {
					$("#VMC_CODE_TXT").text(json.rows[0].VMC_CODE);
					$("#VMC_NO_TXT").text(json.rows[0].VMC_NO);
					$("#ORG_NAME_TXT").text(json.rows[0].ORG_NAME);
					$("#LAST_EDIT_TIME_TXT").text($.FormatDateTime(json.rows[0].LAST_UPLOAD_TIME,false,true));
					$("#CLIENT_STATUS_TXT").text("未知");
					$("#CLIENT_STATUS_TXT").parent("td").addClass("bg_cancel")
					if(json.rows[0].CLIENT_STATUS==0){
						$("#CLIENT_STATUS_TXT").parent("td").removeAttr("class");
						$("#CLIENT_STATUS_TXT").text("正常");
						$("#CLIENT_STATUS_TXT").parent("td").addClass("bg_green")
					}else if(json.rows[0].CLIENT_STATUS==1){
						$("#CLIENT_STATUS_TXT").parent("td").removeAttr("class");
						$("#CLIENT_STATUS_TXT").text("禁用");
						$("#CLIENT_STATUS_TXT").parent("td").addClass("bg_cancel")
					}else if(json.rows[0].CLIENT_STATUS==2){
						$("#CLIENT_STATUS_TXT").parent("td").removeAttr("class");
						$("#CLIENT_STATUS_TXT").text("异常/暂停服务");
						$("#CLIENT_STATUS_TXT").parent("td").addClass("bg_red")
					}
					$("#COINS_STATUS_TXT").text("未知");
					$("#COINS_STATUS_TXT").parent("td").addClass("bg_cancel")
					if(json.rows[0].COINS_STATUS==0){
						$("#COINS_STATUS_TXT").parent("td").removeAttr("class");
						$("#COINS_STATUS_TXT").text("正常");
						$("#COINS_STATUS_TXT").parent("td").addClass("bg_green")
					}else if(json.rows[0].COINS_STATUS==1){
						$("#COINS_STATUS_TXT").parent("td").removeAttr("class");
						$("#COINS_STATUS_TXT").text("禁用");
						$("#COINS_STATUS_TXT").parent("td").addClass("bg_cancel")
					}else if(json.rows[0].COINS_STATUS==2){
						$("#COINS_STATUS_TXT").parent("td").removeAttr("class");
						$("#COINS_STATUS_TXT").text("异常");
						$("#COINS_STATUS_TXT").parent("td").addClass("bg_red")
					}
					$("#NOTE_STATUS_TXT").text("未知");
					$("#NOTE_STATUS_TXT").parent("td").addClass("bg_cancel")
					if(json.rows[0].NOTE_STATUS==0){
						$("#NOTE_STATUS_TXT").parent("td").removeAttr("class");
						$("#NOTE_STATUS_TXT").text("正常");
						$("#NOTE_STATUS_TXT").parent("td").addClass("bg_green")
					}else if(json.rows[0].NOTE_STATUS==1){
						$("#NOTE_STATUS_TXT").parent("td").removeAttr("class");
						$("#NOTE_STATUS_TXT").text("禁用");
						$("#NOTE_STATUS_TXT").parent("td").addClass("bg_cancel")
					}else if(json.rows[0].NOTE_STATUS==2){
						$("#NOTE_STATUS_TXT").parent("td").removeAttr("class");
						$("#NOTE_STATUS_TXT").text("异常");
						$("#NOTE_STATUS_TXT").parent("td").addClass("bg_red")
					}
					$("#PRINT_STATUS_TXT").text("未知");
					$("#PRINT_STATUS_TXT").parent("td").addClass("bg_cancel")
					if(json.rows[0].PRINT_STATUS==0){
						$("#PRINT_STATUS_TXT").parent("td").removeAttr("class");
						$("#PRINT_STATUS_TXT").text("正常");
						$("#PRINT_STATUS_TXT").parent("td").addClass("bg_red")
					}else if(json.rows[0].PRINT_STATUS==1){
						$("#PRINT_STATUS_TXT").parent("td").removeAttr("class");
						$("#PRINT_STATUS_TXT").text("纸快用完了");
						$("#PRINT_STATUS_TXT").parent("td").addClass("bg_green")
					}else if(json.rows[0].PRINT_STATUS==2){
						$("#PRINT_STATUS_TXT").parent("td").removeAttr("class");
						$("#PRINT_STATUS_TXT").text("纸用完了");
						$("#PRINT_STATUS_TXT").parent("td").addClass("bg_green")
					}else if(json.rows[0].PRINT_STATUS==4){
						$("#PRINT_STATUS_TXT").parent("td").removeAttr("class");
						$("#PRINT_STATUS_TXT").text("切纸出错");
						$("#PRINT_STATUS_TXT").parent("td").addClass("bg_green")
					}else if(json.rows[0].PRINT_STATUS ==8){
						$("#PRINT_STATUS_TXT").parent("td").removeAttr("class");
						$("#PRINT_STATUS_TXT").text("打印头过热");
						$("#PRINT_STATUS_TXT").parent("td").addClass("bg_green")
					}else if(json.rows[0].PRINT_STATUS==16){
						$("#PRINT_STATUS_TXT").parent("td").removeAttr("class");
						$("#PRINT_STATUS_TXT").text("打印机盖开启");
						$("#PRINT_STATUS_TXT").parent("td").addClass("bg_green")
					}
					$("#PATH_STATUS").html("<a  href='javascript:void(0);' onclick='ClientInfo.showpathStatusDialog();'>查看货道</a>");
					$("#clientStatus").dialog("open");
				}
			});
		},
		closeStatusDialog:function(){
			//清空表单
			$(".perp").text("");
			$("#clientStatus").dialog("close");
		},
		showpathStatusDialog:function(){
			var VMC_NO=$("#VMC_NO_TXT").text();
			var vmc_client;
			$.ajax({
				type : 'POST',
				url : _contextPath + '/topic/ajax/vmc!clientload',
				data : {"VMC_NO":VMC_NO},
				dataType : "json",
				async:false,
				success : function(json) {
					vmc_client=json;
				}
			});
			$.ajax({
				type : 'POST',
				url : _contextPath + '/topic/list/vmc!pathStatusListData',
				data : {"VMC_NO":VMC_NO},
				dataType : "json",
				async:false,
				success : function(json) {
					var total=json.total;
					var line=Math.ceil(total/vmc_client.LINE_PATH_COUNT);
					var istr=false;
					var tr="";
					for(var l=0;l<json.rows.length;l++){
						if(l%vmc_client.LINE_PATH_COUNT==0){
							if(istr){
								tr+="</tr>";
								istr=false;
							}
							istr=true;
							tr+="<tr>";
						}
						if(json.rows[l].PATH_STATUS==0){
							tr+="<td title='状态:正常' class='bg_green'>货道编号:["+json.rows[l].PATH_NO+"] <br/>剩余货量:"+json.rows[l].PATH_REMAINING+"</td>";
						}else if(json.rows[l].PATH_STATUS==1){
							tr+="<td title='状态:禁用' class='bg_cancel'>货道编号:["+json.rows[l].PATH_NO+"] <br/>剩余货量:"+json.rows[l].PATH_REMAINING+"</td>";
						}else if(json.rows[l].PATH_STATUS==2){
							tr+="<td title='状态:异常' class='bg_red'>货道编号:["+json.rows[l].PATH_NO+"] <br/>剩余货量:"+json.rows[l].PATH_REMAINING+"</td>";
						}else{
							tr+="<td title='状态:未知' class='bg_cancel'>货道编号:["+json.rows[l].PATH_NO+"] <br/>剩余货量:"+json.rows[l].PATH_REMAINING+"</td>";
						}
					}
					if(istr){
						tr+="</tr>";
						istr=false;
					}
					$("#pathStatus").html(tr);
					$("#pathStatusDialog").dialog("open");
				}
			});
		},
		closePathStatusDialog:function(){
			$("#pathStatusDialog").dialog("close");
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
	ClientInfo.loadVmc_Code();
});