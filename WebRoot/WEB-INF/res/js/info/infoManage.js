Ext.onReady(function(){
	var RES_PATH = parent.RES_PATH;
	var CTX_PATH = parent.CTX_PATH;
	
	Ext.BLANK_IMAGE_URL = RES_PATH+'/ext2/resources/images/default/s.gif';
	Ext.QuickTips.init();
	Ext.getDom("theme").href = parent.Ext.getDom("theme").href;

	var statusFomat = function(d){
		if(d == 0){
			return "<span style='color:red'>未审核</span>";
		}else if(d == 1){
			return "<span style='color:green'>已审核</span>";
		}
	};
	var isOrNotFomat = function(d){
		if(d == 0){
			return "<span style='color:red'>否</span>";
		}else if(d == 1){
			return "<span style='color:green'>是</span>";
		}
	};
	var hasFomat = function(d){
		if(d == 0){
			return "<span style='color:red'>无</span>";
		}else if(d == 1){
			return "<span style='color:green'>有</span>";
		}
	};
	//////////////////
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
		fieldLabel:'归属地区',
		emptyText : '请选择地区...',
		anchor : '95%',
		//name : 'info.areaName',
		//hiddenName : 'info.areaName',
		allowBlank:false,
		shadow:false,
		mode: 'local',
		triggerAction:'all',
		maxHeight: 200,
		tpl: '<tpl for="."><div style="height:200px"><div id="area_tree_div"></div></div></tpl>',
		selectedClass:'',
		onSelect:Ext.emptyFn
	});
	areaTree.on('click',function(node){
		infoForm.form.setValues([{
			id : 'area_code',
            value : node.id
		}]);
		comboxWithAreaTree.setValue(node.text);
		comboxWithAreaTree.collapse();
	});
	comboxWithAreaTree.on('expand',function(){
		areaTree.render('area_tree_div');
	});	
	///////
	var areaSearchTree = new Ext.tree.TreePanel({
		border:false,
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
	var comboxWithSearchAreaTree = new Ext.form.ComboBox({
		store:new Ext.data.SimpleStore({fields:[],data:[[]]}),
		editable:false,
		fieldLabel:'文章归属',
		emptyText : '请选择地区...',
		anchor : '95%',
		shadow:false,
		mode: 'local',
		triggerAction:'all',
		maxHeight: 200,
		tpl: '<tpl for="."><div style="height:200px"><div id="area_search_tree_div"></div></div></tpl>',
		selectedClass:'',
		onSelect:Ext.emptyFn
	});
	areaSearchTree.on('click',function(node){
		searchForm.form.setValues([{
			id : 'searchAreaCode',
            value : node.id
		}]);
		comboxWithSearchAreaTree.setValue(node.text);
		comboxWithSearchAreaTree.collapse();
	});
	comboxWithSearchAreaTree.on('expand',function(){
		areaSearchTree.render('area_search_tree_div');
	});	
	/////////////////////////////////////////////////////////////
	/*var infoTypeSearchTree = new Ext.tree.TreePanel({
		border:false,
		iconCls : '',
		autoScroll : true,
		animate : true,
		containerScroll : true,
		rootVisible : false,
		loader : new Ext.tree.TreeLoader({
			dataUrl : ctp + '/sys/newsTypeTree.do'
		}),
		root : new Ext.tree.AsyncTreeNode({
			text : '文章类别',
			iconCls : 'post-tree-icon',
			expanded : true,
			id : '121'
		})
	});
	
	var comboxWithInfoTypeSearchTree = new Ext.form.ComboBox({
		store:new Ext.data.SimpleStore({fields:[],data:[[]]}),
		editable:false,
		fieldLabel:'文章类别',
		emptyText : '请选择...',
		anchor : '90%',
		//name : 'infoTypeName',
		//allowBlank:false,
		shadow:false,
		mode: 'local',
		triggerAction:'all',
		maxHeight: 200,
		tpl: '<tpl for="."><div style="height:200px"><div id="info_type_s_div"></div></div></tpl>',
		selectedClass:'',
		onSelect:Ext.emptyFn
	});
	
	infoTypeSearchTree.on('click',function(node){
		searchForm.form.setValues([{
			id : 'searchInfoType',
            value : node.attributes.hrefTarget
		}]);
		comboxWithInfoTypeSearchTree.setValue(node.text);
		comboxWithInfoTypeSearchTree.collapse();
	});

	comboxWithInfoTypeSearchTree.on('expand',function(){
		infoTypeSearchTree.render('info_type_s_div');
		//var organId = staffForm.form.getValues()["info.infoType"];
		infoTypeSearchTree.getRootNode().reload();
	});*/
	////////////////////////////////////////////////////////////
	/*var infoTypeTree = new Ext.tree.TreePanel({
		border:false,
		iconCls : '',
		autoScroll : true,
		animate : true,
		containerScroll : true,
		rootVisible : false,
		loader : new Ext.tree.TreeLoader({
			dataUrl : ctp + '/sys/newsTypeTree.do'
		}),
		root : new Ext.tree.AsyncTreeNode({
			text : '文章类别',
			iconCls : 'post-tree-icon',
			expanded : true,
			id : '121'
		})
	});
	
	var comboxWithInfoTypeTree = new Ext.form.ComboBox({
		store:new Ext.data.SimpleStore({fields:[],data:[[]]}),
		editable:false,
		fieldLabel:'文章类别',
		emptyText : '请选择...',
		anchor : '90%',
		name : 'info.infoTypeName',
		allowBlank:false,
		shadow:false,
		mode: 'local',
		triggerAction:'all',
		maxHeight: 200,
		tpl: '<tpl for="."><div style="height:200px"><div id="info_type_div"></div></div></tpl>',
		selectedClass:'',
		onSelect:Ext.emptyFn
	});
	
	infoTypeTree.on('click',function(node){
		infoForm.form.setValues([{
			id : 'info.infoType',
            value : node.attributes.hrefTarget
		}]);
		comboxWithInfoTypeTree.setValue(node.text);
		comboxWithInfoTypeTree.collapse();
	});

	comboxWithInfoTypeTree.on('expand',function(){
		infoTypeTree.render('info_type_div');
		//var organId = staffForm.form.getValues()["info.infoType"];
		infoTypeTree.getRootNode().reload();
	});*/
	////////////////////////////////////////////////////////////
	var gridStore = new Ext.data.JsonStore({
		url : CTX_PATH + '/topic/list/infoList',
		totalProperty:'count',
		root:'rows',
		id : 'id',
		fields : [
			{name : 'id', type : 'int' },
   			{name : 'info_title', type : 'string' },
   			//{name : 'info_content', type : 'string' },
   			{name : 'create_staff_name', type : 'string' },
   			{name : 'create_organ_name', type : 'string' },
   			{name : 'area_name', type : 'string' },
   			{name : 'has_pic', type : 'string' },
   			{name : 'has_file', type : 'string' },
   			{name : 'info_type', type : 'string' },
   			{name : 'info_type_all_path', type : 'string' },
   			{name : 'info_type_name', type : 'string' },
   			{name : 'audit_staff_name', type : 'int' },
   			{name : 'status', type : 'string' },
   			{name : 'join_dynamic', type : 'string' },
   			{name : 'join_flash', type : 'string' },
   			{name : 'click_num', type : 'int' },
   			{name : 'at_top', type : 'int' },
   			{name : 'create_time', type : 'string'},
   			{name : 'audit_time', type : 'string'}
	    ],
		pruneModifiedRecords:true,
		sortInfo: {field: "id", direction: "DESC"}, 
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
	
	//alert(1);
    var infoContent = new Ext.form.HtmlEditor({
        fieldLabel: '文章内容',
        labelAlign: 'top',
        enableAlignments: true,
        enableColors: true,
        enableFont: true,
        enableFontSize: true,
        enableFormat: true,
        enableLinks: false,
        enableLists: false,
        enableSourceEdit: false,
        fontFamilies: ['宋体', '仿宋_GB2312', '黑体', '楷体_GB2312', '新宋体', '方正舒体','华文新魏','华文行楷','隶书'],
        name : 'info.infoContent',
        anchor : '99%',
        height : '600'
    });
    //
    var uploadForm = new Ext.FormPanel({
		border: false,
		enctype:'multipart/form-data',
		method:'post',
		url: CTX_PATH +'/topic/uploadFile.do',
		fileUpload: true,
		bodyStyle : 'padding:10px;',
		items: [{
			labelAlign: 'left',
			layout: 'fit',
			border:false,
			items: [{
				xtype:'textfield',
				border: false,
				//readOnly:true,
				fieldLabel: 'ϴ',
				inputType:'file',
				id: 'upload',
				name:'upload'
			},{
				xtype : 'hidden',
				name : 'filePath',
				id : 'filePath'
			}]
		}]
	});
	var uploadWin = new Ext.Window({
		title : '文件上传',
		width : 550,
		closable:true,
		height: 150,
		closeAction:'hide',
		iconCls : 'add',
		resizable:false, //可改变大小
		modal :true,
		layout:"fit",
		plain:true,//主题背景，true为透明
		buttonAlign : 'center',
		items : uploadForm,
		buttons : [{
			text : '上传',
			handler : function() {
				var upf=Ext.getDom('upload').value;
				if(upf == ""){
					Ext.MessageBox.alert('提示信息','上传地址为空，请选择！');
					return;
				}else{
					Ext.getDom("filePath").value = upf;
					uploadForm.getForm().submit({
						waitTitle: '请稍候',   
                        waitMsg: '正在上传文档文件 ...',
						success: function(win, o){
							//alert(o.result.fileId+"---"+o.result.fileTitle+"====");
							Ext.Msg.alert('提示信息', '上传成功！！！！！');
							var gStore = fileGrid.store;
							var rs = new Ext.data.Record();
							rs.id = o.result.fileId;
							rs.data = {};
							rs.data.fileId = o.result.fileId;
							rs.data.fileTitle = o.result.fileTitle;
							rs.data.fileType = o.result.fileType;
							rs.data.fileSize = o.result.fileSize;
							gStore.add(rs);
							//设置fileId隐藏字段
							var fileIds = Ext.getDom("fileIds");
							var fileIdsArr = [];
							//alert(fileIds);
							if(fileIds.value != ''){
								fileIdsArr = fileIds.value.split("|");
							}
							fileIdsArr.push(rs.id);
							//alert(fileIdsArr.length);
							fileIds.value = fileIdsArr.join("|");
							//alert(fileIds.value);
							//清空上传url
							//alert(Ext.getDom('upload').outerHTML);
							//Ext.getDom('upload').outerHTML  = Ext.getDom('upload').outerHTML;
							
							fileGrid.view.refresh();
							uploadWin.hide();
						},  
						failure: function(){
							Ext.Msg.alert('提示信息', '上传失败！！！！！'); 
						}
					});
				}
			}
		},{
			text : '重置',
			handler : function() {
				Ext.getDom('upload').outerHTML  = Ext.getDom('upload').outerHTML;
			}
		}]
	});
    //
    delFile = function(id){
    	var ds = fileGrid.store;
    	var co = ds.getCount();
    	var records = ds.getRange(0, co - 1);
    	var fileIds = Ext.getDom("fileIds");
		var fileIdsArr = fileIds.value.split("|");
		fileIdsArr.remove(id);
    	for(var i=0; i<co; i++){
    		////alert(records[i].id + "----"+ id);
    		if(records[i].id == id){
    			ds.remove(records[i]);
    			break;
    		}
    	}
		fileGrid.view.refresh();
		fileIds.value = fileIdsArr.join("|");
	};
	var delFileIcon = function(data){
		return "<div style='text-align:center;'><a href='javascript:void(0);' onclick='delFile("+data+")'><img src='"+RES_PATH+"/images/icon/16/cross.gif"+"'/></a><div>"
	};
	var tempStore = new Ext.data.Store();
    var fileGrid = new Ext.grid.GridPanel({
    	height:200,
    	border : true,
        store: tempStore,
        tbar : [{
	    	xtype:'button',
            text: '添加附件',
			iconCls:'add',
            handler : function(){
            	uploadWin.show();
            	uploadForm.form.reset();
			}
	    },'-'],
        columns: [
        	new Ext.grid.RowNumberer(),
	        {header:'附件标题', width: 260, dataIndex:'fileTitle'},
	        {header:'附件类型',dataIndex:'fileType'},
	        {header:'附件大小',dataIndex:'fileSize'},
	        {header: "删除", dataIndex:'fileId', width: 30, renderer: delFileIcon}
        ]
    });
    //
    var infoForm = new Ext.form.FormPanel({
    	reader : new Ext.data.JsonReader({
			root : 'root',
			successProperty : 'success'
		}, [{
			name : 'id', mapping : 'id'
		}, {
			name : 'info_title', mapping : 'info_title'
		}, {
			name : 'info_content', mapping : 'info_content'
		}, {
			name : 'info_type', mapping : 'info_type'
		}, {
			name : 'info_type_name', mapping : 'info_type_name'
		}, {
			name : 'sign_name', mapping : 'sign_name'
		}, {
			name : 'has_pic', mapping : 'has_pic'
		}, {
			name : 'has_file', mapping : 'has_file'
		}, {
			name : 'at_top', mapping : 'at_top'
		}, {
			name : 'status', mapping : 'status'
		}, {
			name : 'join_dynamic', mapping : 'join_dynamic'
		}, {
			name : 'join_flash', mapping : 'join_flash'
		}, {
			name : 'area_code', mapping : 'area_code'
		}, {
			name : 'area_name', mapping : 'area_name'
		//}, {
		//	name : 'info.fileJsonArr', mapping : 'fileJsonArr'
		//}, {
		//	name : 'info.fileIds', mapping : 'fileIds'
		}]),
		labelWidth: 60,
        frame:false,
        border:false,
        autoScroll :true,
        method: 'POST',
        //defaultType: 'textfield',
        bodyStyle:'padding:8',
		items : [{
            layout:'column',
            border:false,
            items:[{
            	columnWidth:.25,
               	layout: 'form',
               	border:false,
                items: 
                []//comboxWithInfoTypeTree
	        },{
            	columnWidth:.25,
               	layout: 'form',
               	border:false,
                items: 
                [comboxWithAreaTree]
	        },{
            	columnWidth:.15,
               	layout: 'form',
               	border:false,
                items: 
                [{
                	xtype : 'checkbox',hideLabel : true,boxLabel: '置顶', id : 'atTopCB'
                }]
	        },{
            	columnWidth:.15,
               	layout: 'form',
               	border:false,
                items: 
                [{
                	xtype : 'checkbox',hideLabel : true,boxLabel: '加入工作动态', id : 'joinDynamicCB'
                }]
	        },{
            	columnWidth:.15,
               	layout: 'form',
               	border:false,
                items: 
                [{
                	xtype : 'checkbox',hideLabel : true,boxLabel: '加入flash显示', id : 'joinFlashCB'
                }]
	        },{
            	columnWidth:.98,
               	layout: 'form',
               	border:false,
                items: 
	            [
	            	{
						xtype: 'hidden', name:'id'
					},{
						xtype: 'hidden', name:'info_type'
					},{
						xtype: 'hidden', name:'at_top', id:'atTop'
					},{
					//	xtype: 'hidden', name:'signName'
					//},{
						xtype: 'hidden', name:'has_pic'
					},{
						xtype: 'hidden', name:'has_file'
					},{
						xtype: 'hidden', name:'join_dynamic', id:'joinDynamic'
					},{
						xtype: 'hidden', name:'join_flash', id:'joinFlash'
					},{
						xtype: 'hidden', name:'area_code'
					//},{
					//	xtype: 'hidden', name:'info.fileIds', id : 'fileIds'
					//},{
					//	xtype: 'hidden', name:'info.fileJsonArr', id : 'fileJsonArr'
					}, {
						xtype : 'textfield',
						fieldLabel:'信息标题',
						name:'info_title',
						anchor : '95%',
						maxLength: 50,
						msgTarget: 'under',
						allowBlank:false
					},{
						xtype: "textarea",
						fieldLabel:'信息内容',
						maxLength: 200,
						msgTarget: 'under',
						id : 'info_content',
						name:'info_content',
						anchor : '95%',
						listeners: {
					        'render': function (f) {
					            setTimeout(function () {
					            	//alert(KindEditor);
					                if (KindEditor) {
					                    Nceditor = KindEditor.create('#info_content',{
											items : ['undo', 'redo', '|','quickformat', 'template',
										    'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
										    'indent', 'outdent',
										    'formatblock', 'fontname', 'fontsize', '/',
										    'forecolor', 'hilitecolor', 'bold',
										    'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'file',
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
					},
					//infoContent,
					fileGrid
				]
	        }]
	    }]
    });
	
	var infoWin = new Ext.Window({
		title : '信息管理',
		//width : '100%',
		//height:'100%',
		width : Ext.getBody().getWidth(),     
		height : Ext.getBody().getHeight(),
		closable:true, //右上关闭按钮
		collapsible:true, //窗口上下拉升
		autoHeight: false,
		closeAction:'hide',
		autoScroll:true,
		//autoDestroy:true, //自动销毁
		iconCls : 'add',
		resizable:false, //可改变大小
		modal :true,
		layout:"fit",
		plain:false,//主题背景，true为透明
		//bodyStyle : 'padding:1px;',
		buttonAlign : 'center',
		items : infoForm,
		buttons : [{
			text : '保存',
			id : 'btnSave',
			handler : function() {
				if (infoForm.form.isValid()) {
					var joinDynamicCB = Ext.getDom("joinDynamicCB");
					var joinFlashCB = Ext.getDom("joinFlashCB");
					var atTopCB = Ext.getDom("atTopCB");
					if(joinDynamicCB.checked){
						Ext.getDom("joinDynamic").value = '1';
					}else{
						Ext.getDom("joinDynamic").value = '0';
					}
					if(joinFlashCB.checked){
						Ext.getDom("joinFlash").value = '1';
					}else{
						Ext.getDom("joinFlash").value = '0';
					}
					if(atTopCB.checked){
						Ext.getDom("atTop").value = '1';
					}else{
						Ext.getDom("atTop").value = '0';
					}
					var url = "";
					if(isEmpty(infoForm.form.getValues()["id"])){
						url = CTX_PATH + '/topic/exec/infoAdd';
					}else{
						url = CTX_PATH + '/topic/exec/infoModify';
					}
					infoForm.form.doAction('submit', {
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
			text : '关闭', handler : function(){infoWin.hide();}
		}]		
	});
	////////////////////////////////////////
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
	       		header: "文章标题", dataIndex: 'info_title', sortable : true
	       	}, {
	       		header: "文章类别", dataIndex: 'info_type_all_path', sortable : false
	       	}, {
	       		header: "归属地区", dataIndex: 'area_name', sortable : false
	       	}, {
	       		header: "状态", dataIndex: 'status', sortable : true, renderer: statusFomat
	       	}, {
	       		header: "置顶", dataIndex: 'at_top', sortable : false, renderer: isOrNotFomat
	       	}, {
	       		header: "加入动态", dataIndex: 'join_dynamic', sortable : false, renderer: isOrNotFomat
	       	}, {
	       		header: "加入flash", dataIndex: 'join_flash', sortable : false, renderer: isOrNotFomat
	       	}, {
	       		header: "有否图片", dataIndex: 'has_pic', sortable : false, renderer: hasFomat
	       	}, {
	       		header: "有否附件", dataIndex: 'has_file', sortable : false, renderer: hasFomat
	       	}, {
	       		header: "创建人", dataIndex: 'create_staff_name', sortable : true
	       	}, {
	       		header : "创建时间", dataIndex : 'create_time', sortable : false
	       	}
        ],
        viewConfig: {
            forceFit:true
        },
        loadMask: true,
        tbar: [{
            text: '添加',
			iconCls:'add',
			//id : 'domainAddBtn',
			//disabled : true,
            handler : function(){
            	infoForm.form.reset();
            	infoWin.show();
            	fileGrid.store.removeAll();
   	        	fileGrid.view.refresh();
			}
	    },'-', {
            text: '修改',
			iconCls: 'edit',
			//id : 'domainModifyBtn',
			//disabled : true,
            handler : function(){
            	var record = infoGrid.getSelectionModel().getSelected();
                if(!record){
					Ext.Msg.alert("提示","请先选择要编辑的行!");
					return;
				}
				if(record) {
					infoWin.show();
					fileGrid.store.removeAll();
	            	fileGrid.view.refresh();
					infoForm.form.doAction('load',{
						url: CTX_PATH + '/topic/load/loadInfoJson',
						params:{'id' : record.id},
						method : 'post',
						waitTitle : '提示信息',
						waitMsg : '正在载入...',
						success : function() {
							if(Ext.getDom("atTop").value == '1'){
								Ext.getCmp("atTopCB").setValue(true);
							}else{
								Ext.getCmp("atTopCB").setValue(false);
							}
							if(Ext.getDom("joinDynamic").value == '1'){
								Ext.getCmp("joinDynamicCB").setValue(true);
							}else{
								Ext.getCmp("joinDynamicCB").setValue(false);
							}
							if(Ext.getDom("joinFlash").value == '1'){
								Ext.getCmp("joinFlashCB").setValue(true);
							}else{
								Ext.getCmp("joinFlashCB").setValue(false);
							}
							var fileArr = Ext.getDom("fileJsonArr");
							if(fileArr.value != ''){
								var fileArrJson = eval(fileArr.value);
								//alert(fileArrJson.length);
								for(var i = 0; i<fileArrJson.length; i++){
									var rs = new Ext.data.Record();
									var fileObj = fileArrJson[i];
									rs.id = fileObj.id;
									rs.data = {};
									rs.data.fileId = fileObj.id;
									rs.data.fileTitle = fileObj.fileTitle;
									rs.data.fileType = fileObj.fileType;
									rs.data.fileSize = fileObj.fileSize;
									fileGrid.store.add(rs);
								}
								fileGrid.view.refresh();
							}
						},
						failure : function() {
							Ext.Msg.alert('提示信息', '加载失败，请联系系统管理员！');
							infoWin.hide();
						}
					});
				}
			}
	    },'-',{
            text: '审核通过',
           // id:'infoAuditBtn',
			iconCls:'edit',
			//disabled : true,
			//hidden: true,
            handler : function(){
            	var record = infoGrid.getSelectionModel().getSelected();// 返回值为 Record 类型
                if(!record){
					Ext.Msg.alert("提示","请先选择要审核的行!");
					return;
				}
				if(record) {					
					Ext.MessageBox.confirm("审核确认", "您确定审核通过本记录吗？", function(flag) {
						if (flag == "yes") {
							viewport.getEl().mask("正在审核...", "x-mask-loading");
							Ext.Ajax.request({
								url : CTX_PATH + '/topic/exec/auditInfo',
								params : {
									'id' : record.id
								},
								method : 'post',
								success : function(result) {
									var responseObj = Ext.util.JSON.decode(result.responseText);
									viewport.getEl().unmask();
									if(responseObj.success == false){
										Ext.Msg.alert("错误提示", responseObj.info);
										return;
									}else{
										infoStore.reload();
										Ext.Msg.alert("成功提示", responseObj.info);
									}
								},
								failure : function() {
									viewport.getEl().unmask();
									Ext.Msg.alert("错误提示", "审核失败!");
								}
							});
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
								url : CTX_PATH + '/topic/exec/infoDel',
								params : {
									'id' : record.id
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
        },'-',{
            text: '预览',
            id:'infoViewBtn',
			iconCls:'view',
			//disabled : true,
			//hidden: true,
            handler : function(){
             	var record = infoGrid.getSelectionModel().getSelected();// 返回值为 Record 类型
                if(!record){
					Ext.Msg.alert("提示","请先选择一行!");
					return;
				}
				if(record) {
            		window.open(CONTEXT_PATH+"/topic/viewInfo?id="+record.id);
            	}
			}
	    }],
	    bbar: pagingToolbar
    });
	////////////////////////////////////////
	////////////////////////////////////////////////////////////
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
			//comboxWithInfoTypeSearchTree,
			comboxWithSearchAreaTree,
			{xtype:'hidden', name:'searchAreaCode'},
			{xtype:'hidden', name:'searchInfoType'},
			{
				fieldLabel : "文章标题",				
				xtype : "textfield",
				name : "searchInfoTitle",
				maxLength :20,
				regex: /^[^']*$/,
				regexText: '不能含有特殊字符',
				anchor : '98%'
			},{
				fieldLabel : "文章内容",				
				xtype : "textfield",
				name : "searchInfoContent",
				maxLength :20,
				regex: /^[^']*$/,
				regexText: '不能含有特殊字符',
				anchor : '98%'
			}]
		}]
	});
	var searchPanel = new Ext.Panel({
		region : 'west',
		title : "文章查询",
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
			id : 'btnSave',
			handler : function() {
				if (searchForm.form.isValid()) {
					var oFields = searchForm.form.getValues();
					var queryArr = [];
					var queryStr = "";
					if(oFields.searchInfoType.trim() != ""){
						queryArr.push("'infoType':'"+oFields.searchInfoType.trim()+"'");
					}
					if(oFields.searchAreaCode.trim() != ""){
						queryArr.push("'areaCode':'"+oFields.searchAreaCode.trim()+"'");
					}
					if(oFields.searchInfoTitle.trim() != ""){
						queryArr.push("'infoTitle':'${%}"+ oFields.searchInfoTitle.trim()+"'");
					}
					if(oFields.searchInfoContent.trim() != ""){
						queryArr.push("'infoContent':'${%}"+ oFields.searchInfoContent.trim()+"'");
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
    
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [searchPanel,grid]
	});
	viewport.doLayout();
	//parent.verifyUserBtn(Ext.getCmp);
});