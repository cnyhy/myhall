package com.weimingfj.common.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.StringReader;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

/**
 * @author lansb xml操作
 */
public class XmlUtils {
	protected static Log logger = LogFactory.getLog(XmlUtils.class);

	/**
	 * 根据xml字符串获得NodeList列表
	 * 
	 * @param xml
	 * @return
	 * @throws Exception
	 */
	public static NodeList getNoteListByString(String xml) throws Exception {
		logger.debug("\n\r\t=======================================");
		logger.debug("\n\r\t 待解析的xml：\n\r\t" + xml);
		logger.debug("=======================================\n\r\t");
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder docb = factory.newDocumentBuilder();
		Document doc = docb.parse(new ByteArrayInputStream(xml
				.getBytes(Environment.ENCODING)));
		//logger.debug("\n\r\t 格式化的xml：\n\r\t" + getDocString(xml));
		Element root = doc.getDocumentElement();
		NodeList sqlNodes = root.getChildNodes();
		return sqlNodes;
	}
	
	public static NodeList getNodeListByFileAndTag(File xml, String tagName) throws Exception {
		logger.debug("\n\r\t=======================================");
		//logger.debug("\n\r\t 待解析的xml：\n\r\t" + xml);
		logger.debug("=======================================\n\r\t");
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder docb = factory.newDocumentBuilder();
		Document doc = docb.parse(xml);
		//logger.debug("\n\r\t 格式化的xml：\n\r\t" + getDocString(xml));
		//Element root = doc.getDocumentElement();
		//NodeList sqlNodes = root.getChildNodes();
		return doc.getElementsByTagName(tagName);
	}
	
	public static String formatXmlString(String xmlMsg) throws Exception {
		SAXReader reader = new SAXReader();
		org.dom4j.Document _document = reader.read(new StringReader(xmlMsg));
		OutputFormat format = OutputFormat.createPrettyPrint();
		format.setEncoding("utf-8");
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		XMLWriter writer = new XMLWriter(out, format);
		writer.write(_document);
		writer.flush();
		writer.close();
		return out.toString(format.getEncoding());
	}
}
