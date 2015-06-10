Ext.onReady(function(){
	var RES_PATH = parent.RES_PATH;
	var CTX_PATH = parent.CTX_PATH;
	
	Ext.BLANK_IMAGE_URL = RES_PATH+'/ext2/resources/images/default/s.gif';
	Ext.QuickTips.init();
	Ext.getDom("theme").href = parent.Ext.getDom("theme").href;
	///
	var yesOrNoStore = parent.getDictStoreByMainCode("YES_OR_NO");
	yesOrNoStore.load();
	
	var indexDisplayCbox = new Ext.form.ComboBox({
		store : yesOrNoStore,
		emptyText : '请选择...',
		valueField : 'code',
		displayField : 'text',
		hiddenName : 'index_flag',
		name : 'index_flag',
		fieldLabel : '首页显示',
		mode : 'local',
		editable : false,
		allowBlank : false,
		typeAhead : true,
		selectOnFocus : true,
		triggerAction : 'all',
		anchor : '90%'
	});
	var menuDisplayCbox = new Ext.form.ComboBox({
		store : yesOrNoStore,
		emptyText : '请选择...',
		valueField : 'code',
		displayField : 'text',
		hiddenName : 'menu_flag',
		name : 'menu_flag',
		fieldLabel : '加入导航菜单',
		mode : 'local',
		editable : false,
		allowBlank : false,
		typeAhead : true,
		selectOnFocus : true,
		triggerAction : 'all',
		anchor : '90%'
	});
	var isSelectCbox = new Ext.form.ComboBox({
		store : yesOrNoStore,
		emptyText : '请选择...',
		valueField : 'code',
		displayField : 'text',
		hiddenName : 'select_flag',
		name : 'select_flag',
		fieldLabel : '加入可选择',
		mode : 'local',
		editable : false,
		allowBlank : false,
		typeAhead : true,
		selectOnFocus : true,
		triggerAction : 'all',
		anchor : '90%'
	});
	/*var newsLevelStore = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : CTX_PATH+ '/sys/getParamItemJsonByMainId.do?mid=152',
			method : 'post'
		}),
		reader : new Ext.data.JsonReader({
			fields : [
				{name : 'oid', type : 'int' },
    			{name : 'paramName', type : 'string' },
    			{name : 'paramCode', type : 'string' }
			]
		})
	});
	newsLevelStore.load();
	var newsLevelCbox = new Ext.form.ComboBox({
		store : newsLevelStore,
		emptyText : '请选择级别...',
		valueField : 'paramCode',
		displayField : 'paramName',
		hiddenName : 'paramItem.paramLevel',
		name : 'paramItem.paramLevel',
		fieldLabel : '信息级别',
		mode : 'local',
		editable : false,
		allowBlank : false,
		typeAhead : true,
		selectOnFocus : true,
		triggerAction : 'all',
		anchor : '90%'
	});*/
	
	var nodeTypeStore = parent.getDictStoreByMainCode("NODE_TYPE");
	nodeTypeStore.load();
	
	var nodeTypeCbox = new Ext.form.ComboBox({
		store : nodeTypeStore,
		emptyText : '请选择节点类型...',
		valueField : 'code',
		displayField : 'text',
		hiddenName : 'node_type',
		name : 'node_type',
		fieldLabel : '节点类型',
		mode : 'local',
		editable : false,
		allowBlank : false,
		typeAhead : true,
		selectOnFocus : true,
		triggerAction : 'all',
		anchor : '90%'
	});
	/////////////////////////////////////////////////////////////
	var infoTypeTree = new Ext.tree.TreePanel({
		border:false,
		iconCls : 'add',
		autoScroll : true,
		animate : true,
		containerScroll : true,
		rootVisible : true,
		loader : new Ext.tree.TreeLoader({
			dataUrl : CTX_PATH + '/topic/ajax/infoTypeTreeData'
		}),
		root : new Ext.tree.AsyncTreeNode({
			text : '信息类别',
			iconCls : 'organ-tree-icon',
			//iconCls : 'post-tree-icon',
			expanded : true,
			id : 'iroot'
		})
	});
		
	var paramForm=new Ext.form.FormPanel({
    	reader : new Ext.data.JsonReader({
			root : 'root',
			successProperty : 'success'
		}, [{
			name : 'id',
			mapping : 'id'
		}, {
			name : 'text',
			mapping : 'text'
		}, {
			name : 'code',
			mapping : 'code'
		}, {
			name : 'parent_code',
			mapping : 'parent_code'
		}, {
			name : 'seq',
			mapping : 'seq'
		}, {
			name : 'main_code',
			mapping : 'main_code'
		}, {
			name : 'main_name',
			mapping : 'main_name'
		}, {
			name : 'select_flag',
			mapping : 'select_flag'
		}, {
			name : 'menu_flag',
			mapping : 'menu_flag'
		}, {
			name : 'index_flag',
			mapping : 'index_flag'
		}, {
			name : 'node_type',
			mapping : 'node_type'
		}]),
		bodyStyle:'padding: 10',
		border : false,
		labelWidth:90, 
		defaultType: 'textfield',
		autoHeight: true,
		method: 'POST',
		items: [
			{
				xtype: 'hidden',
				name:'id'
			},{
				xtype: 'hidden',
				name:'parent_code'
			},{
				xtype: 'hidden',
				name:'seq'
			},{
				fieldLabel:'类型名称',
				name:'text',
				anchor : '95%',
				maxLength: 20,
				msgTarget: 'under',
				allowBlank:false
			},{
				fieldLabel:'类型编码',
				name:'code',
				anchor : '95%',
				maxLength: 20
			},nodeTypeCbox,
			indexDisplayCbox,
			menuDisplayCbox,
			isSelectCbox
		]
    });
	
	var paramWin = new Ext.Window({
		title : '新闻类别管理',
		width : 450,
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
		items : paramForm,
		buttons : [{
			text : '保存',
			id : 'btnSave',
			handler : function() {
				if (paramForm.form.isValid()) {
					var url = "";
					if(isEmpty(paramForm.form.getValues()["id"])){
						url = CTX_PATH + '/topic/exec/paramAdd';
					}else{
						url = CTX_PATH + '/topic/exec/paramModify';
					}
					paramForm.form.doAction('submit', {
						url : url,
						method : 'post',
						waitTitle : '提示信息',
						waitMsg : '正在提交....',
						success : function(form, action) {
							var formId = paramForm.form.getValues()["id"];
							if(action.result.result == 1){
								Ext.Msg.alert('提示信息',action.result.resultInfo);
								paramWin.hide();
								var selNode = paramTree.getSelectionModel().getSelectedNode();
								if(formId != 0){
									selNode = selNode.parentNode;
								}
								selNode.reload();
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
			text : '关闭', handler : function(){paramWin.hide();}
		}]		
	});
	
	infoTypeTree.on('contextmenu', function(node, e) {
		infoTypeTree.getSelectionModel().select(node);
		var treeMenu = new Ext.menu.Menu({
			items : [{
				text : '添加子节点',
				iconCls : 'add',
				//disabled : true,
				//hidden : true,
				id:'addParamBtn',
				handler : function(){
					paramForm.form.reset();
					paramWin.show();
					paramForm.form.setValues([{
						id : 'main_code',
						value : node.id
					},{
						id : 'main_name',
						value : node.text
					}]);
				}
			}, {
				text : '修改节点',
				iconCls : 'table-edit',
				//disabled : true,
				//hidden : true,
				id:'modifyParamBtn',
				handler : function(){
					paramForm.form.reset();
					paramWin.show();
					paramForm.form.doAction('load', {
						url : CTX_PATH + '/topic/load/getParamJsonObj',
						params : {
							'id' : node.id
						},
						method : 'post',
						waitTitle : '提示信息',
						waitMsg : '正在载入...',
						failure : function() {
							paramWin.hide();
							Ext.Msg.alert('提示信息', '操作失败，请联系系统管理员！');
						},success : function(){
							
						}
					});
				}
			}, {
				text : '删除节点',
				iconCls : 'remove',
				id:'delParamBtn',
				//disabled : true,
				//hidden : true,
				handler : function(){
					var confirmStr;
					if (node.firstChild != null) {
						Ext.Msg.alert("操作提示", "请先删除该节点下的子节点!");
						return;
					} else {
						confirmStr = "您确定删除该节点吗？";
					}
					Ext.MessageBox.confirm("删除确认", confirmStr, function(flag) {
						if (flag == "yes") {
							viewport.getEl().mask("正在删除...", "x-mask-loading");
							Ext.Ajax.request({
								url : CTX_PATH+'/topic/exec/paramDel',
								params : {
									'id' : node.id
								},
								method : 'post',
								success : function(result) {
									var responseObj = Ext.util.JSON.decode(result.responseText);
									viewport.getEl().unmask();
									if (responseObj.result == 1) {
										var pNode = node.parentNode;
										pNode.reload();
										pNode.select();
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
			}]
		});
		//parent.verifyUserBtn(Ext.getCmp);
		
		if(node.id == "iroot"){
			Ext.getCmp("addParamBtn").disabled = false;
			Ext.getCmp("modifyParamBtn").disabled = true;
			Ext.getCmp("delParamBtn").disabled = true;
		}else if(!node.leaf){
			Ext.getCmp("modifyParamBtn").disabled = true;
			Ext.getCmp("delParamBtn").disabled = true;
		}else if(node.leaf){
			Ext.getCmp("addParamBtn").disabled = true;
		}
		var coords = e.getXY();
		treeMenu.showAt([coords[0], coords[1]]);
	});
	
	/**
	 * 布局部分
	 */
	var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [infoTypeTree]
	});
	viewport.render();
});