package com.weimingfj.hall.cache;

import java.io.File;
import java.util.HashMap;

import org.springframework.stereotype.Service;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.weimingfj.common.cache.ICacheService;
import com.weimingfj.common.utils.XmlUtils;

@Service("urlExecSqlCache")
public class UrlExecSqlCache implements ICacheService{

	@Override
	public Object getCacheContext() {
		String path=this.getClass().getResource("/").getPath();
		String websiteUrl = path.replace("/classes","").replace("%20", " ")+"sysxml/execsql/";
		HashMap<String, Element> urlExecMap=new HashMap<String, Element>();
		try {
			File dir = new File(websiteUrl);
			File[] files = dir.listFiles();
			for(int i=0;i<files.length;i++){
				NodeList sqlNodes = XmlUtils.getNodeListByFileAndTag(files[i], "mapper");
				Element element = null;
				for (int j = 0; j < sqlNodes.getLength(); j++) {
					element = (Element) sqlNodes.item(j);
					urlExecMap.put(element.getAttribute("id"), element);
				}
			}
			System.out.println("存入缓存 execUrl map  length==="+urlExecMap.size());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return urlExecMap;
	}

	@Override
	public long getCacheLiveTime() {
		return 60*5;
	}

}
