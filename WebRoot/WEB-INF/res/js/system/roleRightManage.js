Ext.onReady(function() {
	var RES_PATH = parent.RES_PATH;
	var CTX_PATH = parent.CTX_PATH;
	
	Ext.BLANK_IMAGE_URL = RES_PATH+'/ext2/resources/images/default/s.gif';
	Ext.QuickTips.init();
	Ext.getDom("theme").href = parent.Ext.getDom("theme").href;
	
	var gridStore = new Ext.data.JsonStore({
		url : CTX_PATH + '/topic/list/roleList',
		totalProperty:'count',
		root:'rows',
		id : 'role_id',
		fields : [
	    			{name : 'role_id', type : 'int' },
	    			{name : 'role_name', type : 'string' },
	    			{name : 'role_type', type : 'int' }
	    		],
		pruneModifiedRecords:true,
		sortInfo: {field: "role_id", direction: "DESC"}, 
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
		store : gridStore
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
    	region : 'west',
        border:false,
        loadMask: true,
        split : true,
        columns : [
        	new Ext.grid.RowNumberer(),
	       	//new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
	        {
	         	header: "角色名称", 
	         	width: 120, 
	         	dataIndex: 'role_name', 
	         	sortable : true
	        },{
	         	header: "角色类型", 
	         	width: 120, 
	         	dataIndex: 'role_type', 
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
			//id : 'domainAddBtn',
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
        },'-',{
            text: '分配权限',
			iconCls:'add',
			//id : 'domainAddBtn',
			//disabled : true,
            handler : function(){
            	var record = grid.getSelectionModel().getSelected();
                if(!record){
					Ext.Msg.alert("提示","请先选择要操作的角色!");
					return;
				} else{
            		document.getElementById("roleRightFrame").src = CTX_PATH +"/topic/toRoleRightConf?roleId="+record.id;
            	}
			}
	    }],
	    bbar: pagingToolbar
    });
	
	var ly = new Ext.Viewport({
		layout : 'border',
		items : [grid, 
		{
			region : 'center',
			border : false,
			split : true,
			layout : 'fit',
			html:'<iframe id="roleRightFrame" name="roleRightFrame" frameborder="0" src="'+CTX_PATH+'/tip.jsp?flag=selRole" width="100%" height="100%" scrolling="auto"></iframe>'
		}]
	});
	ly.render();	
});