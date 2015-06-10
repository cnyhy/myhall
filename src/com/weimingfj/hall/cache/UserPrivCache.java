package com.weimingfj.hall.cache;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.weimingfj.common.cache.ICacheService;
import com.weimingfj.common.dao.IJdbcDao;
import com.weimingfj.common.utils.MapUtils;

@Service("userPrivCache")
public class UserPrivCache implements ICacheService{

	@Autowired
	private IJdbcDao jdbcDao;
	
	@Override
	public Object getCacheContext() {
		List<Map<String, Object>> userPrivList = jdbcDao.queryForList("select user_id,priv_id from v_user_priv", null);
		HashMap<String, List<String>> userPrivMap=new HashMap<String, List<String>>();
		for(Map<String, Object> map:userPrivList){
			String userId=MapUtils.getString(map, "user_id");
			String privId=MapUtils.getString(map, "priv_id");
			if(userPrivMap.containsKey(userId)){
				List<String> list = userPrivMap.get(userId);
				list.add(privId);
			}else{
				List<String> list = new ArrayList<String>();
				list.add(privId);
				userPrivMap.put(userId,list);
			}
		}
		return userPrivMap;
	}

	@Override
	public long getCacheLiveTime() {
		return 60*5;//5分钟刷新一次
	}

}
