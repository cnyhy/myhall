var _contextPath = comm._contextPath;
var SALES={
		//初始化促销列表
		initSales:function(){
			$('#SALESLIST').datagrid({
				url : _contextPath+"/topic/list/vmc!salesListData",
				singleSelect : false,
				rownumbers:true,
				striped:true,
				pageSize:30,
				queryParams: {},
				toolbar :[
				    { //添加页
					    text : '添加',
					    iconCls : 'icon-add',
					    handler : function(){ 
					    	parent.addTab('新增促销||icon-add||' +_contextPath + '/topic/vmc!salesEdit');
					    }
					},'-', 
					{
					    text : '修改',
					    iconCls : 'icon-edit',
					    handler : function(){
					    	var selections = $('#SALESLIST').datagrid('getSelections');
							if (selections!=null&&selections.length==1){
								parent.addTab('促销修改||icon-edit||' +  _contextPath + '/topic/vmc!salesEdit?id='+selections[0].ID);
								$('#SALESLIST').datagrid('clearSelections');
							} else {
								$.messager.alert("消息提示","请选择单条记录","error");
							}
					    }
					},'-',
					{
						text:"停用促销",
						iconCls : 'icon-remove',
						handler:function(){
							var selections = $('#SALESLIST').datagrid('getSelections');
							if(selections.length > 1){ 
								$.messager.alert("消息提示","请选择停用的促销活动","error");
								return;
							}
							if(selections[0].IS_DISABLED == 1){
								$.messager.alert("消息提示","该促销已经被停用","error");
								return;
							}
						$.messager.confirm("警告","确定要停用吗？",function(r){
							if(r){
								var ids = [];
								for(var i=0;i<selections.length;i++){
									ids.push(selections[i].ID);
								}
								var config = {
									"ID":ids.join(',')		    	
								};
								$.ajax({
									type : 'POST',
									url : _contextPath + '/topic/exec/vmc!salesDisabled',
									data : config,
									dataType : "json",
									success : function(json) {
										if(json.result =="1") {
											$.messager.alert("消息提示","停用成功","info",function(){
												$('#SALESLIST').datagrid('reload');
												$('#SALESLIST').datagrid('clearSelections');
											});
										} else {
											$.messager.alert("消息提示","停用失败","error");
										}						
									}
								});
							}
						});
							
						}
						
					},'-',
					{
					    text : '删除',
					    iconCls : 'icon-remove',
					    handler : function(){
					    	var selections = $('#SALESLIST').datagrid('getSelections');
							if (selections!=null&&selections.length!=0){
								$.messager.confirm('警告', '确定要删除吗?', function(r) {
									if (r) {
										var ids = [];
										for(var i=0;i<selections.length;i++){
											ids.push(selections[i].ID);
										}
										var config = {
											"ID":ids.join(',')		    	
										};
										$.ajax({
											type : 'POST',
											url : _contextPath + '/topic/exec/vmc!salesDelete',
											data : config,
											dataType : "json",
											success : function(json) {
												if(json.result =="1") {
													$.messager.alert("消息提示","删除成功","info",function(){
														$('#SALESLIST').datagrid('reload');
														$('#SALESLIST').datagrid('clearSelections');
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
					    checkbox:true,
					    formatter: function(value, rowData, rowIndex){
					        return '<input type="checkbox" name="selectRadio" id="selectCheck"' + rowIndex + '    value="' + rowData.oid + '" />';
					    }
					},
					{title:'ID',checkbox:true,hidden:true,
						formatter:function(value,row,index){ return row.ID;} 
					},	 
					{title:'促销名',field:'NAME',width:70},
					{title:'促销编号',field:'PROMOTION_CODE',width:70},
					{title:'促销方式',field:'SALES_MODE',width:120,formatter:function(value,row,index){ 
							if(row.SALES_MODE == null ) return "";
						switch(row.SALES_MODE){
						case 1:
							return "第二件商品加价购买";
						case 2:
							return "第二件商品折扣价购买";
						case 3:
							return "同一商品第二件加价购买";
						case 4:
							return "同一商品第二件折扣价购买";
						
						}
					}},
					{title:'促销价/折扣',field:'DISCOUNT',width:100,formatter:function(value,row,index){ 
						var price=$.FormatMoney(row.DISCOUNT);
						if(row.SALES_MODE == 1 || row.SALES_MODE == 3 ){
							price += "(元)";
						}else if(row.SALES_MODE == 2 || row.SALES_MODE == 4){
							price += "(折)";
						}
						return price;
						
					}},
					{title:'折扣商品名称',field:'SALES_PRODUCT_NAME',width:120},
					{title:'活动说明',field:'DESCRIPTION',width:200},
					{title:'开始时间',field:'START_AT',width:120,hidden:true,formatter:function(value,row,index){ 
						return  $.FormatDateTime(row.START_AT,false,true);
					}
					},
					{title:'结束时间',field:'END_AT',width:120,hidden:true,formatter:function(value,row,index){ 
						return  $.FormatDateTime(row.END_AT,false,true);
					}},
					{title:'是否停用',field:'IS_DISABLED',width:70,
						formatter:function(value,row,index){ 
							if(row.IS_DISABLED == null) return '暂无状态';
							if(row.IS_DISABLED == 0){
								return "<span style='color:green;'>进行中</span>";
							}else if(row.IS_DISABLED == 1){
								return "<span style='color:red;'>已停用</span>";
							}
						
					}},
					{title:'最后修改时间',field:'UPDATED_AT',width:120,
						formatter:function(value,row,index){ 
							return  $.FormatDateTime(row.UPDATED_AT,false,true);
						}
					},
					{title:'创建时间',field:'CREATED_AT',width:120,formatter:function(value,row,index){ 
						return  $.FormatDateTime(row.CREATED_AT,false,true);
					}},
					{title:'参与促销商品',field:'PRODUCT_NAME',width:120,formatter:function(value,row,index){ 
						var str="";
						if(! row.PRODUCT_NAME){
							return row.PRODUCT_NAME;
						}
						if(row.PRODUCT_COUNT == 1){
							str=row.PRODUCT_NAME;
						}else{
							str=row.PRODUCT_COUNT+"(个)商品"
						}
						var a="<a href='javascript:SALES.protionProduct()'>"+str+"</a>";
						return a;
					},
					}
				 ]],
				 onClickRow: function(rowIndex, rowData){
		             //让点击的行单选按钮选中
		             $("input[type='checkbox']")[rowIndex].checked = true;
				 }
			});
			
		},
		//查看促销商品
		protionProduct:function(){
			try{
			var selections = $('#SALESLIST').datagrid('getSelections');
			if(selections != null && selections.length > 1){
				$.messager.alert("消息提示","请选择单条记录","error");
				return;
			}
			if(selections[0].PRODUCTS_NO){
				parent.addTab('促销商品||icon-add||'+_contextPath+'/topic/vmc!productList?PRODUCTS_NO='+selections[0].PRODUCTS_NO); 
			}
			}catch(e){
				$.messager.alert("消息提示","请选择一条记录","info");
				return;
			}
			
		}
}

$(document).ready(function(){
	SALES.initSales();
});