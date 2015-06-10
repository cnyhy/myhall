package com.weimingfj.common.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;

/**
 * @author lansb
 * 入口过滤
 */
public class BaseFilter extends HttpServlet implements Filter {

	/**
	 * 域 <code>serialVersionUID</code>
	 */
	private static final long serialVersionUID = 1L;

	public void doFilter(ServletRequest arg0, ServletResponse arg1, FilterChain arg2) throws IOException, ServletException {
		//实现如下:
		
	}

	public void init(FilterConfig arg0) throws ServletException {
		//实现如下:
		
	}

}
