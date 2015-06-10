var _contextPath = comm._contextPath;
//查询参数
var queryParam;
var ProductInfo={
		initInfo : function(){
			$('#infoList').datagrid({
				url : _contextPath+"/topic/list/vmc!productListData",
				singleSelect : true,
				rownumbers:true,
				striped:true,
				pageSize:30,
				queryParams: {"PRODUCTS_NO":$("#PRODUCTS_NO").val()},
				toolbar :[
				    { //添加页
					    text : '添加',
					    iconCls : 'icon-add',
					    handler : function(){ 
					    	parent.addTab('商品新增||icon-add||' +  _contextPath + '/topic/vmc!productEdit');
					    }
					},'-', 
					{
					    text : '修改',
					    iconCls : 'icon-edit',
					    handler : function(){
					    	var selections = $('#infoList').datagrid('getSelections');
							if (selections!=null&&selections.length==1){
								parent.addTab('商品修改||icon-edit||' +  _contextPath + '/topic/vmc!productEdit?id='+selections[0].PRODUCT_ID+"&queryParam="+JSON.stringify(queryParam));
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
											ids.push(selections[i].PRODUCT_ID);
										}
										var config = {
											"ID":ids.join(',')		    	
										};
										$.ajax({
											type : 'POST',
											url : _contextPath + '/topic/exec/vmc!productDelete',
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
					{title:'会员价',field:'CUSTOMER_PRICE',width:70,
						formatter:function(value,row,index){ 
						return $.FormatMoney(row.CUSTOMER_PRICE);
					}},
					{title:'首购价',field:'FIRST_PURCHASE_PRICE',width:70,
						formatter:function(value,row,index){ 
						return $.FormatMoney(row.FIRST_PURCHASE_PRICE);
					}},
					{title:'奖励积分',field:'REWARD_INTEGRE',width:70},
					{title:'服务端剩余库存数量',field:'REMAINING',width:120},
					{title:'最后修改时间',field:'LAST_EDIT_TIME',width:120,
						formatter:function(value,row,index){ 
						var date=new Date(row.LAST_EDIT_TIME); 
						return $.FormatDateTime(row.LAST_EDIT_TIME,false,true);
					}},
					{title:'排序',field:'ORDERS',width:70},
					{title:'促销',field:'NAME',width:70,formatter:function(value,row,index){ 
						if(! row.NAME){
							return row.NAME;
						}
						var a="<a href='javascript:ProductInfo.gotoPromotion()'>"+row.NAME+"</a>";
						return a;
					}}
				 ]],
				 onClickRow: function(rowIndex, rowData){
		             //让点击的行单选按钮选中
		             $("input[type='radio']")[rowIndex].checked = true;
				 }
			});
        },
		//查询
		queryProductInfoList : function(){
			queryParam = {
				"PRODUCT_NO":$("#PRODUCT_NO").val(),
				"PRODUCT_NAME":$("#PRODUCT_NAME").val()
			};
			$('#infoList').datagrid({ queryParams: queryParam }); 
		},
		//跳转到促销页
		gotoPromotion:function(){
			var unit="(元)";
			var msg="";
			var selections = $('#infoList').datagrid('getSelections');
			$("#promotionDetail").window({
					width:600,
					height:400,   
					modal:true  
			});
			
			switch(selections[0].SALES_MODE){
			case 1:
				msg= "第二件商品加价购买";
				break;
			case 2:
				unit="(折)";
				msg=  "第二件商品折扣价购买";
				break;
			case 3:
				msg=  "同一商品第二件加价购买";
				break;
			case 4:
				unit="(折)";
				msg=  "同一商品第二件折扣价购买";
				break;
			
			}
			$("#PROMOTION_CODE").text(selections[0].PROMOTION_CODE);
			$("#NAME").text(selections[0].NAME);
			$("#SALES_PRODUCT_NAME").text(selections[0].SALES_PRODUCT_NAME);
			$("#SALES_MODE").text(msg);
			$("#DISCOUNT").text($.FormatMoney(selections[0].DISCOUNT)+" "+unit);
			$("#START_AT").text($.FormatDateTime(selections[0].START_AT,false,true));
			$("#END_AT").text($.FormatDateTime(selections[0].END_AT,false,true));
			
			
		}
		
		
		
};

$(document).ready(function(){
	ProductInfo.initInfo();
});