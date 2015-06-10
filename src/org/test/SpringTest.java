package org.test;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.weimingfj.common.dao.IJdbcDao;

/**
 * 
 * SpringTest
 * 
 * lanzier lanzier 2012-4-14 上午09:30:14
 * 
 * @version 1.0.0
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"file:WebRoot/WEB-INF/conf/spring-junit.xml"})
public class SpringTest {
	
	//@Test
//	public void testurl() {
//		RestTemplate restTemplate = new RestTemplate();
//		MultiValueMap<String, String> form = new LinkedMultiValueMap<String, String>();
//		form.add("user", "tom:123456:tomson");
//		String html = restTemplate.postForObject(
//				"http://localhost:9080/user/handle81.html", form, String.class);
//		Assert.assertNotNull(html);
//		Assert.assertTrue(html.indexOf("tom") > -1);
//	}
	@Autowired
	private IJdbcDao jdbcDao;
	@Test
    public void testQuery() {
		System.out.println(jdbcDao);
		System.out.println(jdbcDao.queryForString("select 1", null));
    }
}
