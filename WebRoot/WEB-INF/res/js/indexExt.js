Ext.onReady(function() {
	Ext.QuickTips.init();
	Ext.BLANK_IMAGE_URL= RES_PATH+'/ext2/resources/images/default/s.gif';
	var tabIdArr = [];
	
	var sysMenuTree = new Ext.tree.TreePanel({
		autoScroll : true,
		animate : true,
		border : false,
		rootVisible : false,
		containerScroll : true,
		//text:'TEXT',
		//id:'NODE_ID',
		loader : new Ext.tree.TreeLoader({
			dataUrl : CTX_PATH + '/topic/ajax/menuTree'
		}),
		root : new Ext.tree.AsyncTreeNode({
			text : '系统菜单',
			cls : 'api-node',
			id : '0'
		})
	});

	new Ext.tree.TreeSorter(sysMenuTree, {
		folderSort : false//,
		//property : 'seq'
	});
		
    sysMenuTree.on('click', function(node, e) {
		e.stopEvent();
		if(!node.attributes.leaf){
			return;
		}
		if (tabs.findById("tab" + node.id)) {
			Ext.getDom('frame'+ node.id).src = CTX_PATH + node.attributes.href;
			tabs.activate("tab" + node.id);
			/*Ext.MessageBox.confirm("提示信息", "该页面已经打开，是否重新加载?", function(flag) {
				if (flag == "yes") {
					Ext.getDom('frame'+ node.id).src = node.attributes.href;
				}
			});*/
		} else {
			tabIdArr.push('frame' + node.id);
			addTab(node.id, node.text, CTX_PATH + node.attributes.href);
		}
	});
    tabs = new Ext.TabPanel({
		id : 'mainTabs',
		enableTabScroll : true,
		border : true,
		plugins : new Ext.ux.TabCloseMenu()
	});
	
	var themeMenu = new Ext.menu.Menu({
        items: [
			new Ext.menu.CheckItem({id: 'window',text: '蓝色天空',group:'tm',handler: function(){changeTheme(this.id);}}),
            new Ext.menu.CheckItem({id: 'slate',text: '暗夜精灵',group: 'tm',handler: function(){changeTheme(this.id);}}),
            new Ext.menu.CheckItem({id: 'gray',text: '温馨灰色',group: 'tm',handler: function(){changeTheme(this.id);}}),
            new Ext.menu.CheckItem({id: 'olive',text: '绿野仙踪',group: 'tm',handler: function(){changeTheme(this.id);}}),
            new Ext.menu.CheckItem({id: 'purple',text: '紫色狂想',group: 'tm' ,handler: function(){changeTheme(this.id);}}),
            new Ext.menu.CheckItem({id: '2brave',text: '深蓝忧郁',group: 'tm' ,handler: function(){changeTheme(this.id);}})
        ]
    });

	function changeTheme(tmId){
		var themeCssUrl = '';
		if (tmId == 'window') {
			themeCssUrl = RES_PATH+"/ext2/resources/css/window.css";
		}else{
			themeCssUrl = RES_PATH+"/ext2/resources/css/xtheme-"+tmId+".css";
		}
		Ext.getDom("theme").href = themeCssUrl;
		var frames = window.frames;
		for(var i = 0; i< frames.length; i++){
			if(frames[i].document.getElementById("theme"))
				frames[i].document.getElementById("theme").href = themeCssUrl;
		}
	}
	/**
	 * 左边菜单
	 */
	var wPanel = new Ext.Panel({
		region : 'west',
		title : "系统菜单",
		iconCls : 'nav', 
		split : true,
		width : 200,
		minSize : 175,
		maxSize : 400,
		collapsible : true,
		margins : '1 0 1 1',
		layout : 'fit',
		items : [sysMenuTree],
		bbar : [{
			text : '系统主题',
			handler : function(mm, e) {
				coords = e.getXY();
				themeMenu.showAt([coords[0], coords[1]]);
			}
		}]
	});
	/////////////////////
	document.title = SYS_TITLE;
	layout = new Ext.Viewport({
		layout : 'border',
		items : [{
			region : "north",
			height : 67,
			layout : "fit",
			contentEl : 'north',
			border : false,
			margins : '0 0 1 0'
		}, wPanel, {
			region : 'center',
			border : false,
			//split : true,
			margins : '1 1 1 0',
			layout : 'fit',
			items : [tabs]
		},{
			region:'south',
			baseCls : 'x-plain',
			height : 23,
			border : false,
			html : '<p style="text-align: center; line-height: 23px; color: #222; font-size: 14px;">' + SYS_BOTTOM + '</p>'
		}]
	});
	
	var welPanel = new Ext.Panel({
		title : '欢迎',
		id:'welcomePanel',
		html : '<IFRAME id="welFrame" src="'+RES_PATH+'/welcome.html" frameborder="0" scrolling="no" width="100%" height="100%"/>',
		border : false,
		closable : false
	});
	tabs.add(welPanel);
	tabs.items.get(0).show();
   
	layout.doLayout();
	layout.render();
});