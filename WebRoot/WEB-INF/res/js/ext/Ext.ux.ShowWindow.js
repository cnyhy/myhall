/**注册命名空间**/
Ext.ns("Ext.ux.showWin");
/*写一个实例化的方法*/
Ext.ux.showWin.Window = function(param){
	return new Ext.Window({
               myparam:param,
               buttons:[{
      				text:'ok',
      				xtype:'button',
      				handler: function(){
        				this.myparam.id
      				}
    		   }]
	});
};
Ext.reg('showWin', Ext.ux.showWin.Window); 
