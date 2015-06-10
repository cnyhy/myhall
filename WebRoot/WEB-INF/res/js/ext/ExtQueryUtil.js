function ExtQueryUtil() {
	var QUERY_SYMBOL_LIKE = "${%}";
	var QUERY_SYMBOL_OR = "${,}";
	var QUERY_SYMBOL_BETWEEN = "${-}";
	var QUERY_SYMBOL_AND = "${&}";
	var QUERY_SYMBOL_GREAT = "${>}";
	var QUERY_SYMBOL_GREATEQUAL = "${>=}";
	var QUERY_SYMBOL_LESS = "${<}";
	var QUERY_SYMBOL_LESSEQUAL = "${<=}";
	var DEFAULT_DATE_FORMAT = "yyyy-mm-dd";
	var LOGIC_LIKE = "like";
	var LOGIC_EQUAL = "=";
	var LOGIC_GT = ">";
	var LOGIC_GE = ">=";
	var LOGIC_LT = "<";
	var LOGIC_LE = "<=";
		
	this.getQueryStr = function(fieldName, fieldValue, logic) {
		var queryStr ="";
		switch(logic){
			case LOGIC_LIKE:
				queryStr = "'" + fieldName + "':'" + QUERY_SYMBOL_LIKE + fieldValue + "'";
				break;
			case LOGIC_EQUAL:
				queryStr = "'" + fieldName + "':'" + fieldValue + "'";
				break;
			case LOGIC_GT:
				queryStr = "'" + fieldName + "':'" + QUERY_SYMBOL_GREAT + fieldValue + "'";
				break;
			case LOGIC_GE:
				queryStr = "'" + fieldName + "':'" + QUERY_SYMBOL_GREATEQUAL + fieldValue + "'";
				break;
			case LOGIC_LT:
				queryStr = "'" + fieldName + "':'" + QUERY_SYMBOL_LESS + fieldValue + "'";
				break;
			case LOGIC_LE:
				queryStr = "'" + fieldName + "':'" + QUERY_SYMBOL_LESSEQUAL + fieldValue + "'";
				break;				
			default:
				break;			
		};
		return queryStr;
	};
	
	this.getDateQueryStr = function(fieldName, fieldValue, logic, formatStr) {
		var queryStr ="";
		if(formatStr == undefined)
		{
			formatStr = DEFAULT_DATE_FORMAT;
		}
		switch(logic){			
			case LOGIC_EQUAL:
				queryStr = "\"" + fieldName + "\":\"to_date('" + fieldValue+"','"+ formatStr + "')\"";
				break;
			case LOGIC_GT:
				queryStr = "\"" + fieldName + "\":\"" + QUERY_SYMBOL_GREAT + "to_date('" + fieldValue+"','"+ formatStr + "')\"";
				break;
			case LOGIC_GE:
				queryStr = "\"" + fieldName + "\":\"" + QUERY_SYMBOL_GREATEQUAL + "to_date('" + fieldValue+"','"+ formatStr + "')\"";
				break;
			case LOGIC_LT:
				queryStr = "\"" + fieldName + "\":\"" + QUERY_SYMBOL_LESS + "to_date('" + fieldValue+"','"+ formatStr + "')\"";
				break;
			case LOGIC_LE:
				queryStr = "\"" + fieldName + "\":\"" + QUERY_SYMBOL_LESSEQUAL + "to_date('" + fieldValue+"','"+ formatStr + "')\"";
				break;				
			default:
				break;			
		};
		return queryStr;
	};
	
	this.getBetweenStr = function(fieldName, begin, end) {
		return "'" + fieldName + "':'" + QUERY_SYMBOL_BETWEEN + begin + QUERY_SYMBOL_AND + end + "'";
	}
	
	this.getDateBetweenStr = function(fieldName, begin, end, formatStr) {
		if(formatStr == undefined)
		{
			formatStr = DEFAULT_DATE_FORMAT;
		}	
		return "\"" + fieldName +"\":\"" + QUERY_SYMBOL_BETWEEN + "to_date('" + begin + "','" + formatStr + ")'" + QUERY_SYMBOL_AND + "to_date('" +end + "','" + formatStr + "')\"";
	}
	

//	this.getLikeStr = function(fieldName, fieldValue) {
//		return "'" + fieldName + "':'" + QUERY_SYMBOL_LIKE + fieldValue + "'";
//	};
//	this.getEqualStr = function(fieldName, fieldValue) {
//		return "'" + fieldName + "':'" + fieldValue + "'";
//	};
//	this.getGtStr = function(fieldName, fieldValue) {
//		return "'" + fieldName + "':'" + QUERY_SYMBOL_GREAT + fieldValue + "'";
//	};
//	this.getGeStr = function(fieldName, fieldValue) {
//		return "'" + fieldName + "':'" + QUERY_SYMBOL_GREATEQUAL + fieldValue
//				+ "'";
//	};
//	this.getLtStr = function(fieldName, fieldValue) {
//		return "'" + fieldName + "':'" + QUERY_SYMBOL_LESS + fieldValue + "'";
//	};
//	this.getLeStr = function(fieldName, fieldValue) {
//		return "'" + fieldName + "':'" + QUERY_SYMBOL_LESSEQUAL + fieldValue
//				+ "'";
//	};
//	
//	};
//	this.getDateBetweenStr = function(fieldName, begin, end, format) {
//		//判断format是否为空，如为空用缺省的format
//		return;
//	}
}