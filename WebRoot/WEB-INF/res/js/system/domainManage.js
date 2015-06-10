Ext.onReady(function(){
	var RES_PATH = parent.RES_PATH;
	var CTX_PATH = parent.CTX_PATH;
	
	Ext.BLANK_IMAGE_URL = RES_PATH+'/ext2/resources/images/default/s.gif';
	Ext.QuickTips.init();
	Ext.getDom("theme").href = parent.Ext.getDom("theme").href;
	
	var gridStore = new Ext.data.JsonStore({
		url : CTX_PATH + '/topic/list/domainList',
		totalProperty:'count',
		root:'rows',
		id : 'domain_id',
		fields : [
	    			{name : 'domain_id', type : 'int' },
	    			{name : 'domain_name', type : 'string' },
	    			{name : 'domain_code', type : 'string' },
	    			{name : 'remark', type : 'string' },
	    			{name : 'CREATE_DATE_TEXT', type : 'string' }
	    		],
		pruneModifiedRecords:true,
		sortInfo: {field: "domain_id", direction: "DESC"}, 
		remoteSort : true
	});
	
	var pageSizeStore = parent.getDictStoreByMainCode("PAGE_SIZE");
	pageSizeStore.load();
	
	var pageSizeCombo = new Ext.form.ComboBox({
        store: pageSizeStore,
	 	width:50,
        readOnly:true,
        mode: 'local',
        triggerAction: 'all',
        valueField: 'code',
        displayField: 'text'
    });
    pageSizeCombo.setValue(parent.PAGE_SIZE);
    pageSizeCombo.on("select",function(comboBox){       
		pagingToolbar.pageSize = parseInt(comboBox.getValue());
		gridStore.reload({params:{start:0,limit:pagingToolbar.pageSize}});
	});
	var pagingToolbar = new Ext.PagingToolbar({
		pageSize : parent.PAGE_SIZE,
		store : gridStore,
		displayInfo : true,
		displayMsg : '显示第 {0} 到第 {1} 条  共{2}条记录',
		emptyMsg : "没有找到记录",
		items:['-',
			'每页显示:',
			pageSizeCombo,'条记录'
		]
	});
	
	gridStore.load({
		params:{start:0, limit: parent.PAGE_SIZE}
	});
	gridStore.on('beforeload', function() {
		Ext.apply(this.baseParams, {
			arg : ['']
		});
	});
	
	var grid = new Ext.grid.GridPanel({
    	store: gridStore,
    	region : 'center',
        border:false,
        loadMask: true,
        split : true,
        columns : [
        	new Ext.grid.RowNumberer(),
	       	new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
	        {
	         	header: "域名称", 
	         	width: 120, 
	         	dataIndex: 'domain_name', 
	         	sortable : true
	        },{
	         	header: "域code", 
	         	width: 120, 
	         	dataIndex: 'domain_code', 
	         	sortable : true
	        },{
	         	header: "说明", 
	         	dataIndex: 'remark'
	        },{
	         	header: "操作日期", 
	         	width: 100, 
	         	dataIndex: 'CREATE_DATE_TEXT',
	         	sortable : true
	  		}
        ],
        viewConfig: {
            forceFit:true
        },
        loadMask: true,
        tbar: [{
            text: '添加',
			iconCls:'add',
			id : 'domainAddBtn',
			//disabled : true,
            handler : function(){
            	domainForm.form.reset();
            	domainWin.show();
			}
	    },'-', {
            text: '修改',
			iconCls: 'edit',
			id : 'domainModifyBtn',
			//disabled : true,
            handler : function(){
            	var record = grid.getSelectionModel().getSelected();
                if(!record){
					Ext.Msg.alert("提示","请先选择要编辑的行!");
					return;
				} else{
					domainWin.show();
					domainForm.form.doAction('load',{
						url: CTX_PATH + '/topic/load/getDomainJsonObj',
						params:{'domainId' : record.id},
						method : 'post',
						waitTitle : '提示信息',
						waitMsg : '正在载入...',
						success : function() {
							
						},
						failure : function() {
							Ext.Msg.alert('提示信息', '加载失败，请联系系统管理员！');
						}
					});
				}
			}
	    },'-',{
            text: '删除',
			iconCls: 'remove',
			//disabled : true,
			//id : 'roleDelBtn',
            handler : function(){
                var record = grid.getSelectionModel().getSelected();// 返回值为 Record 类型
                if(!record){
					Ext.Msg.alert("提示","请先选择要删除的行!");
					return;
				}else {					
					Ext.MessageBox.confirm("删除确认", "您确定删除本记录吗？", function(flag) {
						if (flag == "yes") {
							viewport.getEl().mask("正在删除...", "x-mask-loading");
							Ext.Ajax.request({
								url : CTX_PATH + '/topic/exec/domainDel',
								params : {
									'domainId' : record.id
								},
								method : 'post',
								success : function(result) {
									var responseObj = Ext.util.JSON.decode(result.responseText);
									//{"statusCode":"200","message":"操作成功","result":1,"resultInfo":"操作成功"}
									viewport.getEl().unmask();
									if (responseObj.result == 1) {
										gridStore.reload();
				                    }
									Ext.Msg.alert("提示", responseObj.resultInfo);
								},
								failure : function() {
									viewport.getEl().unmask();
									Ext.Msg.alert("错误提示", "删除记录失败!");
								}
							});
						}
					});
				}				
        	}
        }],
	    bbar: pagingToolbar
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////
    var domainForm=new Ext.form.FormPanel({
    	reader : new Ext.data.JsonReader({
			root : 'root',
			successProperty : 'success'
		}, [{
			name : 'domain_name',
			mapping : 'domain_name'
		}, {
			name : 'remark',
			mapping : 'remark'
		}, {
			name : 'domain_id',
			mapping : 'domain_id'
		}, {
			name : 'domain_code',
			mapping : 'domain_code'
		}]
		),
		bodyStyle:'padding: 10',
		border : false,
		labelWidth:60, 
		defaultType: 'textfield',
		autoHeight: true,
		method: 'POST',
		items: [
			{
				xtype: 'hidden',
				name:'domain_id'
			},{
				fieldLabel:'域名称',
				name:'domain_name',
				anchor : '95%',
				maxLength: 20,
				allowBlank:false
			},{
				fieldLabel:'域简称',
				name:'domain_code',
				anchor : '95%',
				maxLength: 20,
				allowBlank:false
			}, {
				xtype: "textarea",
				fieldLabel:'描述',
				maxLength: 100,
				name:'remark',
				anchor : '95%'
			}
		]
    });
	
	var domainWin = new Ext.Window({
		title : '域用户管理',
		width : 550,
		closable:true, //右上关闭按钮
		collapsible:true, //窗口上下拉升
		autoHeight: true,
		closeAction:'hide',
		//autoDestroy:true, //自动销毁
		iconCls : 'add',
		resizable:false, //可改变大小
		modal :true,
		layout:"fit",
		plain:false,//主题背景，true为透明
		//bodyStyle : 'padding:1px;',
		buttonAlign : 'center',
		items : domainForm,
		buttons : [{
			text : '保存',
			id : 'btnSave',
			handler : function() {
				if (domainForm.form.isValid()) {
					var url = "";
					if(isEmpty(domainForm.form.getValues()["domain_id"])){
						url = CTX_PATH + '/topic/exec/domainAdd';
					}else{
						url = CTX_PATH + '/topic/exec/domainModify';
					}
					domainForm.form.doAction('submit', {
						url : url,
						method : 'post',
						waitTitle : '提示信息',
						waitMsg : '正在提交....',
						success : function(form, action) {
							if(action.result.result == 1){
								Ext.Msg.alert('提示信息',action.result.resultInfo);
								domainWin.hide();
								gridStore.reload();
							}else if(action.result.result == 2){
								Ext.Msg.alert('提示信息', action.result.resultInfo + "[" +action.result.validate.join(",")+"]");
							}else{
								Ext.Msg.alert('提示信息', action.result.result+"----"+action.result.resultInfo);
							}							
						}, failure : function() {
							Ext.Msg.alert('提示信息', '操作失败，请联系系统管理员！');
						}
					});
				}else{
					Ext.Msg.alert('提示信息', '您必须按规定填写后才可以继续操作！');
				}
			}
		}, {
			text : '关闭', 
			handler : function(){
				domainWin.hide();
			}
		}]		
	});
	//////////////////////////////////////////////////
    var searchForm = new Ext.form.FormPanel({
		bodyStyle:'padding: 10',
		border:false,
		plain:true,
		method: 'POST',
		items : [{
			layout : 'form',
			border : false,
			labelAlign: 'top',
			labelSeparator : ':',
			items : [
			{
				fieldLabel : "域名",				
				xtype : "textfield",
				name : "s_domain_name",
				maxLength :20,
				regex: /^[^']*$/,
				regexText: '不能含有特殊字符',
				anchor : '98%'
			},{
				fieldLabel : "code",				
				xtype : "textfield",
				name : "s_domain_code",
				maxLength :20,
				regex: /^[^']*$/,
				regexText: '不能含有特殊字符',
				anchor : '98%'
			}]
		}]
	});
	var searchPanel = new Ext.Panel({
		region : 'west',
		title : "查询",
		iconCls : 'add',
		split : true,
		border:false,
		width : 200,
		minSize : 200,
		maxSize : 200,
		collapsible : false,
		layout : 'fit',
		items : searchForm,
		buttonAlign : 'center',
		buttons : [{
			text : '查询',
			handler : function() {
				if (searchForm.form.isValid()) {
					var oFields = searchForm.form.getValues();
					var queryArr = [];
					var queryStr = "";
					if(oFields.s_domain_name.trim() != ""){
						queryArr.push("'s_domain_name':'"+oFields.s_domain_name.trim()+"'");
					}
					if(oFields.s_domain_code.trim() != ""){
						queryArr.push("'s_domain_code':'"+oFields.s_domain_code.trim()+"'");
					}
					if (queryArr.length > 0)
						queryStr = "{" + queryArr.join(",") + "}";
					
					gridStore.on('beforeload', function() {
						Ext.apply(this.baseParams, {
							arg : [queryStr]
						});
					});
					gridStore.load({
						params:{start:0, limit: pagingToolbar.pageSize}
					});
				}
			}
		},{
			text : '重置',
			handler : function() {
				searchForm.form.reset();
			}
		}]	
	});
    /**
	 * 布局部分
	 */
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [searchPanel, grid]
	});
	viewport.render();
	//parent.verifyUserBtn(Ext.getCmp);
});