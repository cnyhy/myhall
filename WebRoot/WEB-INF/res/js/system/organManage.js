Ext.onReady(function(){
	var RES_PATH = parent.RES_PATH;
	var CTX_PATH = parent.CTX_PATH;
	
	Ext.BLANK_IMAGE_URL = RES_PATH+'/ext2/resources/images/default/s.gif';
	Ext.QuickTips.init();
	Ext.getDom("theme").href = parent.Ext.getDom("theme").href;
	
	var areaTree = new Ext.tree.TreePanel({
		border:false,
		iconCls : 'add',
		autoScroll : true,
		animate : true,
		containerScroll : true,
		rootVisible : true,
		loader : new Ext.tree.TreeLoader({
			dataUrl : CTX_PATH + '/topic/ajax/areaTree'
		}),
		root : new Ext.tree.AsyncTreeNode({
			text : parent.USER_AREA_NAME,
			iconCls : 'post-tree-icon',
			expanded : true,
			id : parent.USER_AREA_CODE
		})
	});
	
	var comboxWithAreaTree = new Ext.form.ComboBox({
		store:new Ext.data.SimpleStore({fields:[],data:[[]]}),
		editable:false,
		fieldLabel:'所在地区',
		emptyText : '请选择...',
		anchor : '90%',
		name : 'areaName',
		//allowBlank:false,
		shadow:false,
		mode: 'local',
		triggerAction:'all',
		maxHeight: 200,
		tpl: '<tpl for="."><div style="height:200px"><div id="area_tree_div"></div></div></tpl>',
		selectedClass:'',
		onSelect:Ext.emptyFn
	});
	
	areaTree.on('click',function(node){
		organForm.form.setValues([{
			id : 'areaCode',
            value : node.id
		}]);
		comboxWithAreaTree.setValue(node.text);
		comboxWithAreaTree.collapse();
	});

	comboxWithAreaTree.on('expand',function(){
		areaTree.render('area_tree_div');
		//var organId = staffForm.form.getValues()["staff.organId"];
		areaTree.getRootNode().reload();
	});
	/////////////////////////////////////////////////////////////
	var organTypeStore = parent.getDictStoreByMainCode("ORGAN_TYPE");
	organTypeStore.load();
	var orgTypeCbox = new Ext.form.ComboBox({
		store : organTypeStore,
		emptyText : '请选择节点类型...',
		valueField : 'code',
		displayField : 'text',
		mode : 'local',
		hiddenName : 'organType',
		name : 'organType',
		fieldLabel : '节点类型',
		editable : false,
		allowBlank : false,
		typeAhead : true,
		selectOnFocus : true,
		triggerAction : 'all',
		anchor : '90%'
	});
	
	var organTree = new Ext.tree.TreePanel({
		border:false,
		iconCls : 'add',
		autoScroll : true,
		animate : true,
		containerScroll : true,
		rootVisible : true,
		loader : new Ext.tree.TreeLoader({
			dataUrl : CTX_PATH + '/topic/ajax/organTree'
		}),
		root : new Ext.tree.AsyncTreeNode({
			text : '组织机构',
			iconCls : 'post-tree-icon',
			expanded : true,
			id : '1'
		})
	});
	
	var organDesc = new Ext.form.HtmlEditor({
        fieldLabel: '组织描述',
        labelAlign: 'top',
        enableAlignments: true,
        enableColors: true,
        enableFont: true,
        enableFontSize: true,
        enableFormat: true,
        enableLinks: false,
        enableLists: false,
        enableSourceEdit: false,
        fontFamilies: ['宋体', '黑体'],
        name : 'organDesc',
        anchor : '95%',
        height : '300px'
    });
	
	var organForm=new Ext.form.FormPanel({
    	reader : new Ext.data.JsonReader({
			root : 'root',
			successProperty : 'success'
		}, [{
			name : 'oid',
			mapping : 'oid'
		}, {
			name : 'organName',
			mapping : 'organName'
		}, {
			name : 'organType',
			mapping : 'organType'
		},{
			name : 'organDesc',
			mapping : 'organDesc'
		}, {
			name : 'organCode',
			mapping : 'organCode'
		},{
			name : 'parentId',
			mapping : 'parentId'
		},{
			name : 'areaCode',
			mapping : 'areaCode'
		},{
			name : 'areaName',
			mapping : 'areaName'
		},{
			name : 'organFullName',
			mapping : 'organFullName'
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
				columnWidth : .5,
				layout : 'form',
				defaultType: 'textfield',
				border : false,
				items : [{
					xtype: 'hidden',
					name:'oid'
				},{
					xtype: 'hidden',
					name:'parentId'
				},{
					xtype: 'hidden',
					name : 'areaCode'
				},{
					xtype: 'hidden',
					name : 'organFullName'
				},{
					fieldLabel:'组织名称',
					name:'organName',
					anchor : '90%',
					maxLength: 20,
					msgTarget: 'under',
					allowBlank:false
				},{
					fieldLabel:'组织编码',
					name:'organCode',
					anchor : '90%',
					maxLength: 20,
					msgTarget: 'under',
					allowBlank:false
				}]
			},{
				columnWidth : .5,
				layout : 'form',
				defaultType: 'textfield',
				border : false,
				items : [
					comboxWithAreaTree,
					orgTypeCbox
				]
			}
			/*,{
				columnWidth : .98,
				layout : 'form',
				border : false,
				items : [{
					xtype : "fckeditor", 
					labelAlign: 'top',
					name : "organDesc", 
					anchor : '90%', 
					height : 300, 
					id : "organDesc", 
					fieldLabel : "组织描述"
				}]
			} */
			,{
				columnWidth : .98,
				layout : 'form',
				border : false,
				items : [{
					xtype: "textarea",
					fieldLabel:'组织描述',
					maxLength: 200,
					msgTarget: 'under',
					id : 'organDesc',
					name:'organDesc',
					anchor : '95%',
					listeners: {
				        'render': function (f) {
				            setTimeout(function () {
				            	//alert(KindEditor);
				                if (KindEditor) {
				                    Nceditor = KindEditor.create('#organDesc',{
										items : ['undo', 'redo', '|','quickformat', 'template',
									    'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
									    'indent', 'outdent',
									    'formatblock', 'fontname', 'fontsize', '/',
									    'forecolor', 'hilitecolor', 'bold',
									    'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image',
									    'table', 'hr','|','fullscreen'],
										resizeType : 2,
										allowFileManager : true,
										uploadJson :  CTX_PATH + '/topic/uploadImg?type=II',
										afterBlur : function() {
											Nceditor.sync();
										},
										formatUploadUrl:false,
										allowImageRemote:false,
									});
				                }
				            }, 500);
				        }
				    }
				}]
			}
			]
		}]
    });
	
	var organWin = new Ext.Window({
		title : '组织管理',
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
		items : organForm,
		buttons : [{
			text : '保存',
			id : 'btnSave',
			handler : function() {
				if (organForm.form.isValid()) {
					/*var fId = organForm.form.getValues()["organ.oid"];
					if(fId != 0){
						if(fId == 150 || fId == 151 || fId == 152 || fId == 153 || fId == 154){
							Ext.Msg.alert('提示信息','系统固化的菜单节点, 不能编辑哦~');
							return;
						}
					}
					var leafFlagCB = Ext.getDom("leafFlagCB");
					//alert(leafFlagCB.checked);
					if(leafFlagCB.checked){
						Ext.getDom("leafFlag").value = '1';
					}else{
						Ext.getDom("leafFlag").value = '0';
					}*/
					organForm.form.doAction('submit', {
						url : CONTEXT_PATH + '/sys/organSave.do',
						method : 'post',
						waitTitle : '提示信息',
						waitMsg : '正在提交....',
						success : function(form, action) {
							var res = action.result;
							var formId = organForm.form.getValues()["organ.oid"];
							if(res.success){
								Ext.Msg.alert('提示信息',res.info);
								organWin.hide();
								var selNode = organTree.getSelectionModel().getSelectedNode();
								if(formId != 0){
									selNode = selNode.parentNode;
								}
								selNode.reload();
							}else{
								Ext.Msg.alert('提示信息',res.info);
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
			text : '关闭', handler : function(){organWin.hide();}
		}]		
	});
	
	organTree.on('contextmenu', function(node, e) {
		organTree.getSelectionModel().select(node);
		var treeMenu = new Ext.menu.Menu({
			id : 'TREEMENU',
			items : [{
				text : '添加子节点',
				iconCls : 'add',
				//disabled : true,
				id:'addOrganBtn',
				handler : function(){
					organForm.form.reset();
					organWin.show();
					organForm.form.setValues([{
						id : 'parentId',
						value : node.id
					}]);
				}
			}, {
				text : '修改节点',
				iconCls : 'table-edit',
				//disabled : true,
				id:'modifyOrganBtn',
				handler : function(){
					organForm.form.reset();
					organWin.show();
					organForm.form.doAction('load', {
						url : 'organObjJson.do',
						params : {
							'oid' : node.id
						},
						method : 'post',
						waitTitle : '提示信息',
						waitMsg : '正在载入...',
						failure : function() {
							organWin.hide();
							Ext.Msg.alert('提示信息', '操作失败，请联系系统管理员！');
						},
						success : function(){
							
						}
					});
				}
			}, {
				text : '删除节点',
				iconCls : 'remove',
				id:'delOrganBtn',
				//disabled : true,
				handler : function(){
					var confirmStr;
					if (node.firstChild != null) {
						Ext.Msg.alert("操作提示", "请先删除该组织机构的子机构!");
						return;
					} else {
						confirmStr = "您确定删除该组织机构吗？";
					}
					Ext.MessageBox.confirm("删除确认", confirmStr, function(flag) {
						if (flag == "yes") {
							viewport.getEl().mask("正在删除...", "x-mask-loading");
							Ext.Ajax.request({
								url : 'organDel.do',
								params : {
									'oid' : node.id
								},
								method : 'post',
								success : function(result) {
									var responseObj = Ext.util.JSON.decode(result.responseText);
									viewport.getEl().unmask();
									if(responseObj.success == false){
										Ext.Msg.alert("错误提示", responseObj.info);
										return;
									}else{
										var pNode = node.parentNode;
										pNode.reload();
										pNode.select();
										Ext.Msg.alert("成功提示", responseObj.info);
									}
								},
								failure : function() {
									viewport.getEl().unmask();
									Ext.Msg.alert("错误提示", "删除菜单失败!");
								}
							});
						}
					});
				}
			}]
		});
		//parent.verifyUserBtn(Ext.getCmp);
		
		//叶子节点不能新增
		if(node.leaf){
			Ext.getCmp("addOrganBtn").disabled = true;
		}
		//大目录节点不显示编辑和删除
		//if(node.id == 150 || node.id == 151 || node.id == 152 || node.id == 153 || node.id == 154){
		//	Ext.getCmp("modifyOrganBtn").disabled = true;
		//	Ext.getCmp("delOrganBtn").disabled = true;
		//}
		if(node.id == 1){
			Ext.getCmp("modifyOrganBtn").disabled = true;
			Ext.getCmp("delOrganBtn").disabled = true;
		}
		var coords = e.getXY();
		treeMenu.showAt([coords[0], coords[1]]);
	});
	
	/**
	 * 布局部分
	 */
	var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [organTree]
	});
	viewport.render();
});