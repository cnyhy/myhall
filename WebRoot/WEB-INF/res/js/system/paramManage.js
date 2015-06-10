Ext.onReady(function(){
	var RES_PATH = parent.RES_PATH;
	var CTX_PATH = parent.CTX_PATH;
	
	Ext.BLANK_IMAGE_URL = RES_PATH+'/ext2/resources/images/default/s.gif';
	Ext.QuickTips.init();
	Ext.getDom("theme").href = parent.Ext.getDom("theme").href;
	
	
	var paramTree = new Ext.tree.TreePanel({
		border:false,
		iconCls : 'add',
		autoScroll : true,
		animate : true,
		containerScroll : true,
		rootVisible : true,
		loader : new Ext.tree.TreeLoader({
			dataUrl : CTX_PATH + '/topic/ajax/paramTree'
		}),
		root : new Ext.tree.AsyncTreeNode({
			text : '参数管理',
			iconCls : 'post-tree-icon',
			expanded : true,
			id : 'root'
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
			name : 'main_code',
			mapping : 'main_code'
		}, {
			name : 'main_name',
			mapping : 'main_name'
		},{
			name : 'code',
			mapping : 'code'
		}, {
			name : 'text',
			mapping : 'text'
		}, {
			name : 'seq',
			mapping : 'seq'
		}]),
		bodyStyle:'padding: 10',
		border : false,
		labelWidth:70, 
		defaultType: 'textfield',
		autoHeight: true,
		method: 'POST',
		items: [{
			xtype : 'panel',
			layout : 'column',
			border : false,
			labelSeparator : ':',
			items : [{
				columnWidth : .95,
				layout : 'form',
				defaultType: 'textfield',
				border : false,
				items : [{
					xtype: 'hidden',
					name:'id'
				},{
					xtype: 'hidden',
					name:'main_code'
				},{
					xtype: 'hidden',
					name : 'main_name'
				},{
					fieldLabel:'参数代码',
					name:'code',
					anchor : '90%',
					maxLength: 20,
					msgTarget: 'under',
					allowBlank:false
				},{
					fieldLabel:'参数名称',
					name:'text',
					anchor : '90%',
					maxLength: 20,
					msgTarget: 'under',
					allowBlank:false
				},{
					fieldLabel:'排序',
					name:'seq',
					anchor : '90%',
					maxLength: 20,
					msgTarget: 'under',
					allowBlank:false
				}]
			}]
		}]
    });
	
	var paramWin = new Ext.Window({
		title : '组织管理',
		width : 300,
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
	
	paramTree.on('contextmenu', function(node, e) {
		paramTree.getSelectionModel().select(node);
		var treeMenu = new Ext.menu.Menu({
			id : 'TREEMENU',
			items : [{
				text : '添加子节点',
				iconCls : 'add',
				//disabled : true,
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
				handler : function(){
					Ext.MessageBox.confirm("删除确认", "您确定删除该节点吗？", function(flag) {
						if (flag == "yes") {
							viewport.getEl().mask("正在删除...", "x-mask-loading");
							Ext.Ajax.request({
								url : CTX_PATH + '/topic/exec/paramDel',
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
									Ext.Msg.alert("错误提示", "删除失败!");
								}
							});
						}
					});
				}
			}]
		});
		//parent.verifyUserBtn(Ext.getCmp);
		if(node.id == "root"){
			Ext.getCmp("addParamBtn").disabled = true;
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
		items : [paramTree]
	});
	viewport.render();
});