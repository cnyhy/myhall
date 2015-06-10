var _contextPath = comm._contextPath;
var zTree;
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
		//查询
		queryPathInfoList : function(){
			var VMC_NO=$("input[name=client_no]").val();
			if(VMC_NO.length < 1){
				$.messager.alert("消息提示","请选择售货机设备！","error");
				return false;
			}
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
							tr+="<td title='状态:正常' class='bg_green'>["+json.rows[l].PATH_NO+"] 剩余货量:"+json.rows[l].PATH_REMAINING+"</td>";
						}else if(json.rows[l].PATH_STATUS==1){
							tr+="<td title='状态:故障' class='bg_red'>["+json.rows[l].PATH_NO+"] 剩余货量:"+json.rows[l].PATH_REMAINING+"</td>";
						}else if(json.rows[l].PATH_STATUS==2){
							tr+="<td title='状态:禁用' class='bg_cancel'>["+json.rows[l].PATH_NO+"] 剩余货量:"+json.rows[l].PATH_REMAINING+"</td>";
						}else{
							tr+="<td title='状态:未知' class='bg_cancel'>["+json.rows[l].PATH_NO+"] 剩余货量:"+json.rows[l].PATH_REMAINING+"</td>";
						}
					}
					if(istr){
						tr+="</tr>";
						istr=false;
					}
					$("#infoList").html(tr);
				}
			});
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
								} else if(row.IS_DISABLE==2){
									return "禁用";
								}else{
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
	$.fn.zTree.init($("#treeDemo"), setting);
});