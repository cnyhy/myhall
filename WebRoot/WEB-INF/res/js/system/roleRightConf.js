Ext.onReady(function() {
	var RES_PATH = parent.parent.RES_PATH;
	var CTX_PATH = parent.parent.CTX_PATH;
	
	Ext.BLANK_IMAGE_URL = RES_PATH+'/ext2/resources/images/default/s.gif';
	Ext.QuickTips.init();
	Ext.getDom("theme").href = parent.parent.Ext.getDom("theme").href;
	
	var privTree = new Ext.tree.TreePanel({
		//title:'角色权限编辑',
		border:false,
		iconCls : 'add',
		autoScroll : true,
		animate : false,
		containerScroll : true,
		rootVisible : false,
		checkModel: 'multiple', //对树的级联多选,single为单选，默认多选multiple//cascade为级联
		onlyLeafCheckable: false,//对树所有结点都可选
		loadMask: true,
		loader : new Ext.tree.TreeLoader({
			dataUrl : CTX_PATH + '/topic/ajax/privTreeData',
			baseParams : {roleId : OP_ROLE_ID},
			baseAttrs:{uiProvider:Ext.tree.TreeCheckNodeUI}
		}),
		root : new Ext.tree.AsyncTreeNode({
			text : '权限树',
			id : '0'
		}),
		tbar : [{
				text : '刷新树',
				handler: function(){
					privTree.getRootNode().reload();
					privTree.expandAll();
				}
			},{
				xtype : 'checkbox',
				boxLabel: '级联选择',
				handler : function(){
					if(privTree.checkModel == 'multiple'){
						privTree.checkModel = 'cascade';
					}else{
						privTree.checkModel = 'multiple';
					}
				}
			}]
	});
	privTree.expandAll();
	
	//new Ext.tree.TreeSorter(privTree, {folderSort:true});
		
	var layout = new Ext.Viewport({
		layout : 'border',
		items : [{
			region : 'center',
			split : true,
			title : '权限树',
			border:false,
			//collapsible : true,
			layout : 'fit',
			items : [privTree]
		},{
			region:'south',
			baseCls : 'x-plain',
			height: 30,
			border : false,
			bodyStyle : 'padding:5 0 0 10;',
			items:[{
				xtype:'button',
				width: 200,
				text: '保&nbsp;&nbsp;&nbsp;&nbsp;存',
				iconCls : 'save',
				//id : 'roleRightSaveBtn',
				//disabled : true,
				handler : function(){
					layout.getEl().mask("正在保存...", "x-mask-loading");
					window.setTimeout(function(){
						var ids = [];
						for(var i=0; i<privTree.getChecked().length; i++){
							var obj = privTree.getChecked()[i];
							ids.push(obj.id);
						}
						if(OP_ROLE_ID == ""){
							Ext.Msg.alert("提示信息","对应的角色未选择，请重新选择角色后进行操作！");
						}else{
							//alert(ids.join(","));
							Ext.Ajax.request({
								url : CTX_PATH + '/topic/exec/saveRoleRight',
								params : {
									roleId : OP_ROLE_ID, ids: ids.join(",")
								},
								method : 'post',
								success : function(result) {
									var responseObj = Ext.util.JSON.decode(result.responseText);
									//{"statusCode":"200","message":"操作成功","result":1,"resultInfo":"操作成功"}
									layout.getEl().unmask();
									Ext.Msg.alert("提示", responseObj.resultInfo);
								},
								failure : function() {
									layout.getEl().unmask();
									Ext.Msg.alert("错误提示", "删除记录失败!");
								}
							});
						}
					}, 500);
				}
			}]
		}]
	});
	layout.render();
	//parent.parent.verifyUserBtn(Ext.getCmp);
});