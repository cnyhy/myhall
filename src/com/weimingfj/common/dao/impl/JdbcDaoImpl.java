package com.weimingfj.common.dao.impl;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.JdbcUtils;
import org.springframework.stereotype.Repository;

import com.weimingfj.common.dao.IJdbcDao;

/**
 * @author lansb
 * 
 */
@Repository("jdbcDao")
public class JdbcDaoImpl implements IJdbcDao {

	private Log logger = LogFactory.getLog(JdbcDaoImpl.class);

	@Autowired
	private JdbcTemplate jdbcTemplate;

	public String queryForString(String sql, final Object[] objarr, String defaultVal) {
		logger.debug("sql=>" + sql);
		logger.debug("param=>" + Arrays.toString(objarr));
		String str = jdbcTemplate.queryForObject(sql, String.class, objarr);
		return str != null ? str : defaultVal;
	}
	public String queryForString(String sql, final Object[] objarr) {
		return queryForString(sql, objarr, "");
	}

	public Map<String,Object> queryForMap(String sql, final Object[] objarr) {
		logger.debug("sql=>" + sql);
		logger.debug("param=>" + Arrays.toString(objarr));
		List<Map<String,Object>> list = query(sql, objarr);
		if (list != null && list.size() > 0) {
			return list.get(0);
		} else {
			return new LinkedHashMap<String,Object>();
		}
	}

	public List<Map<String,Object>> queryForList(String sql, final Object[] objarr) {
		return query(sql, objarr);
	}

	private List<Map<String,Object>> query(String sql, final Object[] objarr) {
		logger.debug("sql=>" + sql);
		logger.debug("param=>" + Arrays.toString(objarr));
		return jdbcTemplate.query(sql, objarr, new RowMapper<Map<String,Object>>() {
			public Map<String,Object> mapRow(final ResultSet rs, final int rowNum) throws SQLException {
				// 实现如下:
				final ResultSetMetaData rsmd = rs.getMetaData();
				final int columnCount = rsmd.getColumnCount();
				final Map<String,Object> mapOfColValues = new LinkedHashMap<String,Object>(columnCount);
				for (int i = 1; i <= columnCount; i++) {
					final String key = JdbcUtils.lookupColumnName(rsmd, i);
					final Object obj = (JdbcUtils.getResultSetValue(rs, i) == null ? "" : JdbcUtils.getResultSetValue(rs, i));
					//mapOfColValues.put(key.toUpperCase(), obj);
					mapOfColValues.put(key, obj);
				}
				return mapOfColValues;
			}
		});
	}

	public int execute(String sql, final Object[] objarr) {
		logger.debug("sql=>" + sql);
		logger.debug("param=>" + Arrays.toString(objarr));
		return jdbcTemplate.update(sql, objarr);
	}

}
