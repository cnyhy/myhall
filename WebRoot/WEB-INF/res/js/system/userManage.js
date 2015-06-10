Ext.onReady(function(){
	var RES_PATH = parent.RES_PATH;
	var CTX_PATH = parent.CTX_PATH;
	
	Ext.BLANK_IMAGE_URL = RES_PATH+'/ext2/resources/images/default/s.gif';
	Ext.QuickTips.init();
	Ext.getDom("theme").href = parent.Ext.getDom("theme").href;
	
	//store 定义//////////////////////////////////////
	var jobTitleStore = parent.getDictStoreByMainCode("JOB_TITLE");
	jobTitleStore.load();
	var postStore = parent.getDictStoreByMainCode("POST");
	postStore.load();
	var sexStore = new Ext.data.SimpleStore({
		fields : ["retrunValue", "displayText"],
		data : [['M', '男'],['F', '女']]
	});
	var roleStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: CTX_PATH + '/topic/ajax/userRoleList',
			method: 'POST'
		}),
        reader: new Ext.data.JsonReader({
		    		id: 'role_id',
		    		fields : [
		    			{name : 'role_id', type : 'int' },
		    			{name : 'role_name', type : 'string' },
		    			{name : 'role_type', type : 'string' }
		    		]
		    	})
    });
	/*var sm = new Ext.grid.CheckboxSelectionModel();
	sm.on('beforerowselect',function(m,i,k,record){
		return true;
	});	
	sm.on('rowdeselect',function(m,i,record){
		//m.selectRow(i);
	});	*/
	roleStore.on('load',function(ds){
		var staffRoles = userForm.form.getValues()["user_roles"];
		if(staffRoles!=""){//alert(ds.find('oid', 2));alert(ds.find('oid', 20));
			var roles = staffRoles.split(",");
			for(i=0;i<roles.length;i++){
				var n = ds.find('role_id', roles[i]);
				if(n!=-1){
					roleGrid.getSelectionModel().selectRow(n,true);
				}
			}
		}else{
			roleGrid.getSelectionModel().clearSelections();
		}
	});
	/*//如果需要， 传入当前人的id，如要调用当前人的id调出该人已有的角色，这里暂时不用
	roleStore.on('beforeload',function(ds){
		var userId = userForm.form.getValues()["user_id"];
		Ext.apply(this.baseParams, {
			userId : userId
		});
	});*/
	/*roleStore.on('rowclick',function(){
		return;
	});*/
	var gridStore = new Ext.data.JsonStore({
		url : CTX_PATH + '/topic/list/userList',
		totalProperty:'count',
		root:'rows',
		id : 'user_id',
		fields : [
					{name : 'user_id', type : 'string' },
	    			{name : 'user_name', type : 'string' },
	    			{name : 'sex', type : 'string' },
	    			{name : 'user_code', type : 'string' },
	    			{name : 'tel', type : 'string' },
	    			{name : 'post_name', type : 'string' },
	    			{name : 'organ_name', type : 'string' },
	    			{name : 'job_title_name', type : 'string' },
	    			{name : 'id_no', type : 'string' }
	    		],
		pruneModifiedRecords:true,
		sortInfo: {field: "user_id", direction: "DESC"}, 
		remoteSort : true
	});
	gridStore.load({
		params:{start:0, limit: parent.PAGE_SIZE}
	});
	gridStore.on('beforeload', function() {
		Ext.apply(this.baseParams, {
			arg : ['']
		});
	});
	var pageSizeStore = parent.getDictStoreByMainCode("PAGE_SIZE");
	pageSizeStore.load();
	///////////////////////////////////////////
	var organTree = new Ext.tree.TreePanel({
		border:false,
		iconCls : 'add',
		autoScroll : true,
		animate : true,
		containerScroll : true,
		rootVisible : false,
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
	
	var comboxWithOrganTree = new Ext.form.ComboBox({
		store:new Ext.data.SimpleStore({fields:[],data:[[]]}),
		editable:false,
		fieldLabel:'所在组织',
		emptyText : '请选择...',
		anchor : '90%',
		name : 'organ_name',
		allowBlank:false,
		shadow:false,
		mode: 'local',
		triggerAction:'all',
		maxHeight: 200,
		tpl: '<tpl for="."><div style="height:200px"><div id="org_tree_div"></div></div></tpl>',
		selectedClass:'',
		onSelect:Ext.emptyFn
	});
	
	organTree.on('click',function(node){
		userForm.form.setValues([{
			id : 'organ_id',
            value : node.id
		}]);
		comboxWithOrganTree.setValue(node.text);
		comboxWithOrganTree.collapse();
	});

	comboxWithOrganTree.on('expand',function(){
		organTree.render('org_tree_div');
		//var organId = userForm.form.getValues()["organ_id"];
		organTree.getRootNode().reload();
	});
	//////////////////////////////////////////////////
	var sexCombo = new Ext.form.ComboBox({
		store : sexStore,
		emptyText : '请选择...',
		valueField : "retrunValue",
		displayField : "displayText",
		mode : 'local',
		forceSelection : true,
		hiddenName : 'sex',
		editable : false,
		triggerAction : 'all',
		allowBlank : false,
		fieldLabel : '性别',
		selectOnFocus : true,
		name : 'sex',
		anchor : '60%'
	});
	//////////////////////////////////////
	var roleGrid = new Ext.grid.GridPanel({
		border : false,
		store : roleStore,
		viewConfig: {
            forceFit:true
        },
        loadMask: true,
		cm : new Ext.grid.ColumnModel([
			new Ext.grid.CheckboxSelectionModel(),
			{
				header : '角色名称',
				width : 200,
				dataIndex : 'role_name'
			},{
				header : '角色类型',
				width : 200,
				dataIndex : 'role_type'
			}]),
		sm : new Ext.grid.CheckboxSelectionModel()
	});
	
	var jobTitleCbox = new Ext.form.ComboBox({
		store : jobTitleStore,
		emptyText : '请选择职称...',
		valueField : 'code',
		displayField : 'text',
		hiddenName : 'job_title',
		name : 'job_title',
		fieldLabel : '职称',
		mode : 'local',
		editable : false,
		allowBlank : false,
		selectOnFocus : true,
		triggerAction : 'all',
		anchor : '80%'
	});
	var postCbox = new Ext.form.ComboBox({
		store : postStore,
		emptyText : '请选择职务...',
		valueField : 'code',
		displayField : 'text',
		hiddenName : 'post',
		name : 'post',
		fieldLabel : '职务',
		mode : 'local',
		editable : false,
		allowBlank : false,
		//typeAhead : true,
		selectOnFocus : true,
		triggerAction : 'all',
		anchor : '80%'
	});
	
	////////////////////////////////////////////////////////////
    var userForm=new Ext.form.FormPanel({
    	reader : new Ext.data.JsonReader({
			root : 'root',
			successProperty : 'success'
		}, 
		[{
			name : 'user_id', mapping : 'user_id'
		}, {
			name : 'user_name', mapping : 'user_name'
		}, {
			name : 'sex', mapping : 'sex'
		}, {
			name : 'user_code', mapping : 'user_code'
		},{
			name : 'organ_id', mapping : 'organ_id'
		},{
			name : 'organ_name', mapping : 'organ_name'
		},{
			name : 'tel', mapping : 'tel'
		},{
			name : 'post', mapping : 'post'
		},{
			name : 'user_roles', mapping : 'user_roles'
		},{
			name : 'job_title', mapping : 'job_title'
		},{
			name : 'id_no', mapping : 'id_no'
		},{
			name : 'email', mapping : 'email'
		}]),
		bodyStyle:'padding: 10',
		labelWidth:60,
		autoHeight: true,
		border:false,
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
					xtype: 'hidden', name : 'user_roles'
				},{
					xtype: 'hidden', name : 'user_id'
				},{
					xtype: 'hidden', name : 'organ_id'
				},{
					fieldLabel:'用户名',
					name:'user_name',
					anchor : '90%',
					allowBlank:false
				},{
					fieldLabel:'登录账号',
					minLength : 3,
					name:'user_code',
					anchor : '90%',
					allowBlank:false
				},{
					fieldLabel:'身份证号',
					name:'id_no',
					anchor : '90%'
				},{
					fieldLabel:'联系电话',
					name:'tel',
					anchor : '90%'
				}]
			},{
				columnWidth : .5,
				layout : 'form',
				defaultType: 'textfield',
				border : false,
				items : [
					sexCombo,
					postCbox,
					comboxWithOrganTree,
					jobTitleCbox,
					{
						vtype:'email',
						fieldLabel:'电子邮箱',
						name:'email',
						anchor : '90%'
					}
				]
			},{
				columnWidth : .98,
				layout : 'form',
				border : false,
				items : [{
					xtype:'tabpanel',
			        plain:true,
					border: true,
			        activeTab: 0,
			        height:207,
			        items:[{
			            title:'角色配置',
			            layout:'fit',
			            items: [roleGrid]
			        }]
				}]
				
			}]
		}]
    });
    
    var userWin = new Ext.Window({
		title: '人员管理',
		width : 600,
		//autoHeight: true,
		closable:true, //右上关闭按钮
		collapsible:true, //窗口上下拉升
		closeAction:'hide',
		iconCls : 'add',
		resizable:false,
		modal :true,
		layout:"fit",
		loadMask: true,
		plain:false,
		buttonAlign : 'center',
		items : userForm,
		buttons : [{
			text : '保存',
			id : 'btnSave',
			handler : function() {
				if (userForm.form.isValid()) {
					var records = roleGrid.getSelectionModel().getSelections();
					if(records.length > 0){
						var arr = [];
						for(i=0;i<records.length;i++){
							arr.push(records[i].id);
						}
						userForm.form.setValues([{
							id : 'user_roles',
	                        value : arr.join(",")
						}]);
					}else{
						userForm.form.setValues([{
							id : 'user_roles',
	                        value : ''
						}]);
					}
					var url = "";
					if(isEmpty(userForm.form.getValues()["user_id"])){
						url = CTX_PATH + '/topic/exec/userCreate';
					}else{
						url = CTX_PATH + '/topic/exec/userModify';
					}
					userForm.form.doAction('submit', {
						url : url,
						method : 'post',
						waitTitle : '提示信息',
						waitMsg : '正在提交....',
						success : function(form, action) {
							if(action.result.result == 1){
								Ext.Msg.alert('提示信息',action.result.resultInfo);
								userWin.hide();
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
			text : '关闭', handler : function(){userWin.hide();}
		}]		
	});
	////////////////////////////////////////
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
				header : '姓名',
				width : 100,
				dataIndex : 'user_name'
			},{
				header : '性别',
				dataIndex : 'sex',
				width : 60,
				renderer : function(d){
					if(d == "M"){
						return "男";
					}else{
						return "女";
					}
				}
			},{
				header : '登录账户',
				width : 100,
				dataIndex : 'user_code'
			},{
				header : '岗位名称',
				width : 100,
				dataIndex : 'post_name'
			},{
				header : '职称',
				width : 100,
				dataIndex : 'job_title_name'
			},{
				header : '联系电话',
				width : 100,
				dataIndex : 'tel'
			},{
				header : '所在单位',
				dataIndex : 'organ_name'
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
            	userForm.form.reset();
            	if(roleGrid.getStore().getTotalCount()){
					roleGrid.getSelectionModel().clearSelections();
				}
            	userWin.show();
            	//Ext.getDom("stfName").readOnly = false;
				//Ext.getDom("stfLoginName").readOnly = false;
            	roleStore.load();
			}
	    },'-', {
            text: '修改',
			iconCls: 'table-edit',
			id : 'domainModifyBtn',
			//disabled : true,
            handler : function(){
            	var record = grid.getSelectionModel().getSelected();
                if(!record){
					Ext.Msg.alert("提示","请先选择要编辑的行!");
					return;
				}
				if(record) {
					userWin.show();
					roleGrid.getSelectionModel().clearSelections();
					userForm.form.doAction('load',{
						url: CTX_PATH +'/topic/load/getUserJsonObj',
						params:{'userId' : record.id},
						method : 'post',
						waitTitle : '提示信息',
						waitMsg : '正在载入...',
						success : function() {
							roleStore.load();
							//Ext.getDom("stfName").readOnly = true;
							//Ext.getDom("stfLoginName").readOnly = true;
						},
						failure : function() {
							Ext.Msg.alert('提示信息', '加载失败，请联系系统管理员！');
						}
					});
				}
			}
	    },'-',{
            text: '密码初始化',
			iconCls: 'refresh-small',
			//id:'passwordInitBtn',
			//disabled : true,
            handler : function(){
            	var record = grid.getSelectionModel().getSelected();
                if(!record){
					Ext.Msg.alert("提示","请先选择要初始化的用户!");
					return;
				}
				if(record) {
					Ext.MessageBox.confirm("确认", "您确定要初始化该用户密码吗？", function(flag) {
						if (flag == "yes") {
							viewport.getEl().mask("正在初始化...", "x-mask-loading");
							Ext.Ajax.request({
								url : CTX_PATH +'/topic/exec/passwordInit',
								params : {
									'userId' : record.id
								},
								method : 'post',
								success : function(result) {
									var responseObj = Ext.util.JSON.decode(result.responseText);
									viewport.getEl().unmask();
									if(responseObj.result == 1){
										gridStore.reload();
										Ext.Msg.alert("成功提示", responseObj.resultInfo);
									}else{
										Ext.Msg.alert("错误提示", responseObj.resultInfo);
									}
								},
								failure : function() {
									viewport.getEl().unmask();
									Ext.Msg.alert("错误提示", "初始化密码失败!");
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
				}
				if(record) {					
					Ext.MessageBox.confirm("删除确认", "您确定删除本记录吗？", function(flag) {
						if (flag == "yes") {
							viewport.getEl().mask("正在删除...", "x-mask-loading");
							Ext.Ajax.request({
								url : CTX_PATH +'/topic/exec/userDel',
								params : {
									'userId' : record.id
								},
								method : 'post',
								success : function(result) {
									var responseObj = Ext.util.JSON.decode(result.responseText);
									viewport.getEl().unmask();
									if(responseObj.result == 1){
										gridStore.reload();
										Ext.Msg.alert("成功提示", responseObj.resultInfo);
									}else{
										Ext.Msg.alert("错误提示", responseObj.resultInfo);
									}
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
        	text: '二维码',
			iconCls: 'qrcode',
			id:'qrcodeBtn',
			//disabled : true,
            handler : function(){
            	var record = grid.getSelectionModel().getSelected();
                if(!record){
					Ext.Msg.alert("提示","请先选择要查看的人!");
					return;
				}
				var url = window.location.href;
				url = url.substring(0, url.length - 14);
				//alert(url);
				if(record) {
					var qrWin = new Ext.Window({
				        width:110,
				        height:130,
				        resizable:false,
				        modal : true,
				        closable: true,
				        html: "<img src='../viewQRCode.do?m=2&s="+url+"s.do?id="+record.id+"'/>"
				    });
				    qrWin.show();
				}
			}
        }],
	    bbar: pagingToolbar
    });
	//查询//////////////////////////////////////////////////////////
	var areaTree4Search = new Ext.tree.TreePanel({
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
			id : parent.USER_AREA_CODE,
			text : parent.USER_AREA_NAME,
			iconCls : 'post-tree-icon',
			expanded : true
		})
	});
	var comboxWithAreaTree4Search = new Ext.form.ComboBox({
		store:new Ext.data.SimpleStore({fields:[],data:[[]]}),
		editable:false,
		fieldLabel:'所在地区',
		emptyText : '请选择地区...',
		anchor : '95%',
		name : 'inAreaName4Search',
		hiddenName : 'inAreaName4Search',
		shadow:false,
		mode: 'local',
		triggerAction:'all',
		maxHeight: 200,
		tpl: '<tpl for="."><div style="height:200px"><div id="area_tree_div_search"></div></div></tpl>',
		selectedClass:'',
		onSelect:Ext.emptyFn
	});
	areaTree4Search.on('click',function(node){
		searchForm.form.setValues([{
			id : 'areaCode4Search',
            value : node.id
		}]);
		comboxWithAreaTree4Search.setValue(node.text);
		comboxWithAreaTree4Search.collapse();
	});
	comboxWithAreaTree4Search.on('expand',function(){
		areaTree4Search.render('area_tree_div_search');
		areaTree4Search.getRootNode().reload();
	});	
	var searchOrganTree = new Ext.tree.TreePanel({
		border:false,
		iconCls : 'add',
		autoScroll : true,
		animate : true,
		containerScroll : true,
		rootVisible : false,
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
	var comboxWithSearchOrganTree = new Ext.form.ComboBox({
		store:new Ext.data.SimpleStore({fields:[],data:[[]]}),
		editable:false,
		fieldLabel:'所在组织',
		emptyText : '请选择...',
		anchor : '98%',
		name : 'searchOrganName',
		allowBlank:true,
		mode: 'local',
		triggerAction:'all',
		maxHeight: 200,
		tpl: '<tpl for="."><div style="height:200px"><div id="search_org_tree_div"></div></div></tpl>',
		selectedClass:'',
		onSelect:Ext.emptyFn
	});
	searchOrganTree.on('click',function(node){
		searchForm.form.setValues([{
			id : 'searchOrganId',
            value : node.id
		}]);
		comboxWithSearchOrganTree.setValue(node.text);
		comboxWithSearchOrganTree.collapse();
	});
	comboxWithSearchOrganTree.on('expand',function(){
		searchOrganTree.render('search_org_tree_div');
		//var organId = searchForm.form.getValues()["searchOrganId"];
		searchOrganTree.getRootNode().reload();
	});
	var searchPostCbox = new Ext.form.ComboBox({
		store : postStore,
		emptyText : '请选择职务...',
		valueField : 'code',
		displayField : 'text',
		hiddenName : 'searchPostId',
		name : 'searchPostId',
		fieldLabel : '职务',
		mode : 'local',
		editable : false,
		//allowBlank : false,
		//typeAhead : true,
		selectOnFocus : true,
		triggerAction : 'all',
		anchor : '80%'
	});	
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
			items : [{
				xtype : 'hidden',
				name : 'searchOrganId'
			},{
				xtype : 'hidden',
				name : 'areaCode4Search'
			},comboxWithAreaTree4Search,
			comboxWithSearchOrganTree,
			searchPostCbox,
			{
				fieldLabel : "姓名",				
				xtype : "textfield",
				name : "searchUserName",
				maxLength :20,
				regex: /^[^']*$/,
				regexText: '不能含有特殊字符',
				anchor : '98%'
			},{
				fieldLabel : "登录名",				
				xtype : "textfield",
				name : "searchUserCode",
				maxLength :20,
				regex: /^[^']*$/,
				regexText: '不能含有特殊字符',
				anchor : '98%'
			},{
				fieldLabel : "联系电话",				
				xtype : "textfield",
				name : "searchTel",
				maxLength :20,
				regex: /^[^']*$/,
				regexText: '不能含有特殊字符',
				anchor : '98%'
			}]
		}]
	});
	var searchPanel = new Ext.Panel({
		region : 'west',
		title : "人员查询",
		iconCls : 'add',
		//style : "text-align:center",
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
					if(oFields.areaCode4Search.trim() != ""){
						queryArr.push("'areaCode':'"+oFields.areaCode4Search.trim()+"'");
					}
					if(oFields.searchOrganId.trim() != ""){
						queryArr.push("'organId':'"+oFields.searchOrganId.trim()+"'");
					}
					if(oFields.searchUserName.trim() != ""){
						queryArr.push("'userName':'"+ oFields.searchUserName.trim()+"'");
					}
					if(oFields.searchUserCode.trim() != ""){
						queryArr.push("'userCode':'"+ oFields.searchUserCode.trim()+"'");
					}
					if(oFields.searchTel.trim() != ""){
						queryArr.push("'tel':'"+ oFields.searchTel.trim() +"'");
					}
					if(oFields.searchPostId.trim() != ""){
						queryArr.push("'postId':'"+ oFields.searchPostId.trim() +"'");
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