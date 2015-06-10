package org.test;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ParameterMetaData;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import net.sf.json.JSONObject;

import org.codehaus.jackson.map.JsonSerializer;
import org.mvel2.MVEL;

import com.weimingfj.common.utils.Environment;

public class Test {
	public static void main(String[] args) {
		try {
			// String aaa = "$_CRU_TENANT_ID_$   $_CRU_TENANT_ID_$";
			// aaa = aaa.replace("$_CRU_TENANT_ID_$", "kkk");
			// System.out.println(aaa);
			// handlesql();
			// testMysqlDatabase();
		//String aa = "select '$_UUID_$' owner_seq_id from dual";
		//System.out.println(aa.replace(Environment.UUID, "bbb"));
		//	testEasyUITreeJson();

			String url = "地方sdfds";
			String aurl = java.net.URLEncoder.encode(url, Environment.ENCODING);
			System.out.println(aurl);
			String burl = java.net.URLDecoder.decode(aurl, Environment.ENCODING);
			System.out.println(burl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	//easyui-jsonData
	private static List<Map<String, Object>> itemsList = new ArrayList<Map<String, Object>>(); 
	private static List<Map<String, Object>> itemsListChild; 
	public static void testEasyUITreeJson() throws Exception {
		Class.forName("oracle.jdbc.driver.OracleDriver");
		Connection conn = DriverManager.getConnection(
				"jdbc:oracle:thin:@172.30.0.66:1521:assets", "assets", "assets");
		String sql = "select m.p_menu_id, m.menu_id,m.menu_name from sys_menu_tab m where m.p_menu_id=1";
		//String sqlChild = "select m.p_menu_id, m.menu_id,m.menu_name from sys_menu_tab m where m.p_menu_id=?";
		Statement state = conn.createStatement();
		ResultSet rs = state.executeQuery(sql);
		//ResultSet rsChild = state.executeQuery(sqlChild);
		while(rs.next()){
			Map<String, Object> item = new HashMap<String, Object>();
			item.put("id", rs.getString("menu_id"));
            item.put("text", rs.getString("menu_name"));
            if(rs.getString("menu_id").equals("2")){
            	item.put("state", "opened");
            } else {
            	item.put("state", "closed");
            }
        //  item.put("children", itemsListChild);
            JSONObject json = JSONObject.fromObject(item);
            itemsList.add(JSONObject.fromObject(item));
            System.out.println("=============");
		}
		rs.close();
		state.close();
		conn.close();
	}

	public static void handlesql() {
		String sql = "SELeCT a.* frOm (select b.* from sys_url_tab b where 1=1 order by b.url_id) a order by a.url_id";
		String baksql = sql;
		baksql = baksql.replaceFirst("(?i)select  ", "select r");
		System.out.println(baksql);
		String baksql2 = sql.replaceFirst("(?i)select ", "select rownum rn, ");
		System.out.println(baksql2);
		// baksql2.

	}

	public static void testListTest() {
		List<Integer> list = new ArrayList<Integer>();
		for (int i = 0; i < 101; i++) {
			list.add(i);
		}
		System.out.println(list);
		List<Integer> list2 = new ArrayList<Integer>();
		for (int i = 0; i < 10; i++) {
			list2.add(list.get(i));
		}
		System.out.println(list2);
	}

	public static void testDatabase() throws Exception {
		Class.forName("oracle.jdbc.OracleDriver");
		Connection conn = DriverManager.getConnection(
				"jdbc:oracle:thin:@191.168.10.10:1521:fsti", "eoms", "eoms");
		String sql = "insert into sys_menu_tab"
				+ " (menu_id, parent_menu_id, menu_name, menu_code, url, menu_type, order_by, remark, menu_level, is_sys_menu, priv_id, fixation, is_front)"
				+ " values" + " (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		PreparedStatement ps = conn.prepareStatement(sql);
		ParameterMetaData pmd = ps.getParameterMetaData();
		int count = pmd.getParameterCount();
		System.out.println("长度11：" + count);
		for (int i = 1; i <= count; i++) {
			// System.out.println(pmd.getParameterClassName(i));
			// System.out.println(pmd.getParameterMode(i));
			// System.out.println(pmd.getParameterTypeName(i));
			System.out.println(pmd.getParameterClassName(i));
		}
	}

	public static void testOracleDatebase() throws Exception {
		Class.forName("oracle.jdbc.driver.OracleDriver");
		Connection conn = DriverManager.getConnection(
				"jdbc:oracle:thin:@172.30.0.92:1521:ORCL", "assets", "assets");
		Connection conn2 = DriverManager.getConnection(
				"jdbc:oracle:thin:@172.30.0.66:1521:assets", "assets", "assets");
		String sql = "select url_id,exec_sql ,VALIDATION from sys_url_tab t";
		String sql2 = "update sys_url_tab set exec_sql = ?, VALIDATION=? where url_id = ?";
		PreparedStatement statement = conn.prepareStatement(sql);
		ResultSet rs = statement.executeQuery(sql);
		PreparedStatement statement2 = null;
		while(rs.next()){
			statement2= conn2.prepareStatement(sql2);
			System.out.println(rs.getString(2));
//			System.out.println(rs.getClob(2));
			statement2.setString(1, rs.getString(2));
			statement2.setString(2, rs.getString(3));
			statement2.setInt(3, rs.getInt(1));
			int a=statement2.executeUpdate();
			//System.out.println(a);
			statement2.close();
		}
		rs.close();
		System.out.println("执行完毕---");
		conn2.commit();
		System.out.println("提交完毕---");
//		PreparedStatement ps = conn.prepareStatement(sql);
//		ParameterMetaData pmd = ps.getParameterMetaData();
//		int count = pmd.getParameterCount();
//		System.out.println("长度00：" + count);
//		for (int i = 1; i <= count; i++) {
//			System.out.println(pmd);
//			System.out.println(pmd.getParameterType(i));
//			// System.out.println(pmd.getParameterClassName(i));
//			System.out.println(pmd.getParameterMode(i));
//			// System.out.println(pmd.getParameterTypeName(i));
//			System.out.println(pmd.getParameterTypeName(i));
//		}
	}

	public static void testMysqlDatabase() throws Exception {
		Class.forName("com.mysql.jdbc.Driver");
		Connection conn = DriverManager
				.getConnection(
						"jdbc:mysql://localhost:3306/lance?useUnicode=true&amp;characterEncoding=utf-8&amp;useOldAliasMetadataBehavior=true&amp;generateSimpleParameterMetadata=true",
						"root", "root");
		String sql = "insert into sys_url_tab" + "(url_id,priv_id)" + " values"
				+ " (?, ?)";
		PreparedStatement ps = conn.prepareStatement(sql);
		ParameterMetaData pmd = ps.getParameterMetaData();
		int count = pmd.getParameterCount();
		System.out.println("长度：" + count);
		for (int i = 1; i <= count; i++) {
			System.out.println(pmd.getParameterClassName(i));
			// System.out.println(pmd.getParameterMode(i));
			// System.out.println(pmd.getParameterTypeName(i));
			// System.out.println(pmd.getParameterClassName(i));
		}
	}

	public static void testReg() {
		String reg = "\\d+";
		Pattern pattern = Pattern.compile(reg, Pattern.DOTALL);
		String str = "qw";
		Matcher matcher = pattern.matcher(str);
		System.out.println(matcher.find());
	}

	public static void testMVEL() {
		String kkk = "kkk";
		System.out.println(kkk.split(",").length);
		Map<String, String> m = new HashMap<String, String>();
		m.put("aaa", "");
		String test = " isdef aaa  and aaa==''";
		System.out.println(((Boolean) MVEL.eval(test, m)).booleanValue());
	}
}
