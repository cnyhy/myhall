/**
 * 徐海涛根据ext2.0.2改写
 * 
 * 提供Ext.data.DWRProxy和Ext.data.DWRJsonReader二个类，与Ext.data.Store进行缝联接。
 * 提供是否分页的选项和自定义参数传递功能:
 * （1）选择false（new Ext.data.DWRProxy(RoleManage.getDwrList,false)），后台服务接口应是XXX(自定义传参,自定义传参,...)
 * （2）如果true（new Ext.data.DWRProxy(RoleManage.getDwrList,false)），后台服务接口应是XXX(自定义传参,自定义传参,...,int start,int limit,String orderBy,String dir)
 * （3）自定义传参用下面方法指定：
 * 　　　　　　　　store.on('beforeload', function() {
 *                Ext.apply(this.baseParams, {
 *	              	arg:[自定义参数传入值，自定义参数传入值，...] 
 *				  });
 *              });
 * 在服务端：使用DWR2，因为dwr2的bean转换只能一层，所以使用json-lib前返回的对象改转化为JOSN格式的String返回
 */

Ext.data.DWRProxy = function(dwrCall, pagingAndSort) {
	Ext.data.DWRProxy.superclass.constructor.call(this);
	this.dwrCall = dwrCall;	
	this.pagingAndSort = (pagingAndSort != undefined ? pagingAndSort : true);
};

Ext.extend(Ext.data.DWRProxy, Ext.data.DataProxy, {
	load : function(params, reader, callback, scope, arg) {
		if (this.fireEvent("beforeload", this, params) !== false) {
			var sort;
			if (params.sort)
				sort = params.sort;
			else
				sort = '';			
			if (params.dir)
				dir = params.dir;
			else
				dir = '';
			var delegate = this.loadResponse.createDelegate(this, [reader,
					callback, scope, arg], 1);
			var callParams = new Array();

			if (params.arg) {				
				callParams = params.arg.slice();	
			}

			if (this.pagingAndSort) {
				callParams.push(params.start);
				callParams.push(params.limit);
				callParams.push(sort);
				callParams.push(dir);
			}
			callParams.push(delegate);
			this.dwrCall.apply(this, callParams);
		} else {
			callback.call(scope || this, null, arg, false);
		}
	},

	loadResponse : function(dwrResult, reader, callback, scope, arg) {

		var result;
		try {
			result = reader.read(dwrResult);
		} catch (e) {
			this.fireEvent("loadexception", this, null, dwrResult, e);
			callback.call(scope, null, arg, false);
			return;
		}
		callback.call(scope, result, arg, true);
	},

	update : function(dataSet) {
		
	},

	updateResponse : function(dataSet) {
	}
});

Ext.data.DWRJsonReader = function(meta, recordType) {
	meta = meta || {};
	Ext.data.DWRJsonReader.superclass.constructor.call(this, meta, recordType
			|| meta.fields);
};
Ext.extend(Ext.data.DWRJsonReader, Ext.data.DataReader, {
	read : function(response) {
		var o = eval("(" + response + ")");
		if (!o) {			
			return;
//			throw {
//				message : "DWRJsonReader.read: 没有找到JSON对象"
//			};
		}
		if (o.metaData) {
			delete this.ef;
			this.meta = o.metaData;
			this.recordType = Ext.data.Record.create(o.metaData.fields);
			this.onMetaChange(this.meta, this.recordType, o);
		}
		return this.readRecords(o);
	},

	onMetaChange : function(meta, recordType, o) {

	},

	simpleAccess : function(obj, subsc) {
		return obj[subsc];
	},

	getJsonAccessor : function() {
		var re = /[\[\.]/;
		return function(expr) {
			try {
				return (re.test(expr)) ? new Function("obj", "return obj."
						+ expr) : function(obj) {
					return obj[expr];
				};
			} catch (e) {
			}
			return Ext.emptyFn;
		};
	}(),

	readRecords : function(o) {
		this.jsonData = o;
		var s = this.meta, Record = this.recordType, f = Record.prototype.fields, fi = f.items, fl = f.length;

		if (!this.ef) {
			if (s.totalProperty) {
				this.getTotal = this.getJsonAccessor(s.totalProperty);
			}
			if (s.successProperty) {
				this.getSuccess = this.getJsonAccessor(s.successProperty);
			}
			this.getRoot = s.root ? this.getJsonAccessor(s.root) : function(p) {
				return p;
			};
			if (s.id) {
				var g = this.getJsonAccessor(s.id);
				this.getId = function(rec) {
					var r = g(rec);
					return (r === undefined || r === "") ? null : r;
				};
			} else {
				this.getId = function() {
					return null;
				};
			}
			this.ef = [];
			for (var i = 0; i < fl; i++) {
				f = fi[i];
				var map = (f.mapping !== undefined && f.mapping !== null)
						? f.mapping
						: f.name;
				this.ef[i] = this.getJsonAccessor(map);
			}
		}

		var root = this.getRoot(o), c = root.length, totalRecords = c, success = true;
		if (s.totalProperty) {
			var v = parseInt(this.getTotal(o), 10);
			if (!isNaN(v)) {
				totalRecords = v;
			}
		}
		if (s.successProperty) {
			var v = this.getSuccess(o);
			if (v === false || v === 'false') {
				success = false;
			}
		}
		var records = [];
		for (var i = 0; i < c; i++) {
			var n = root[i];
			var values = {};
			var id = this.getId(n);
			for (var j = 0; j < fl; j++) {
				f = fi[j];
				var v = this.ef[j](n);
				values[f.name] = f.convert((v !== undefined)
						? v
						: f.defaultValue, n);
			}
			var record = new Record(values, id);
			record.json = n;
			records[i] = record;
		}
		return {
			success : success,
			records : records,
			totalRecords : totalRecords
		};
	}
});