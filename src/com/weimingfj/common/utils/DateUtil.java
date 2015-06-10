/**
 * DateUtil.java   1.00    2004/01/14
 *
 * Sinyee Framework.
 * Copyright 2004-2006 SINYEE I.T. Co., Ltd. All rights reserved.
 * @author SINYEE I.T. Co., Ltd.
 *
 * History:
 * 2004/01/14   Ura         New
 * 2004/01/14   Ura         Comment modify
 */
package com.weimingfj.common.utils;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * Date utility
 * @author Siny
 */

public class DateUtil {

	/**
	 * Date format: "YYYY.MM.DD"
	 */
	public static final String DYYYYMMDD = "DYYYYMMDD";
	/**
	 * Date format: "YYYY.MM"
	 */
	public static final String DYYYYMM = "DYYYYMM";
	/**
	 * Date format: "YY"
	 */
	public static final String YY = "yy";

	/**
	 * Date format: "YYYY"
	 */
	public static final String YYYY = "yyyy";

	/**
	 * Date format: "MM"
	 */
	public static final String MM = "MM";

	/**
	 * Date format: "DD"
	 */
	public static final String DD = "dd";

	/**
	 * Date format: "MM/DD"
	 */
	public static final String MM_DD = "MM/dd";

	/**
	 * Date format: "YYYYMM"
	 */
	public static final String YYYYMM = "yyyyMM";

	public static final String YYYYMMDD = "yyyyMMdd";

	/**
	 * Date format: "YYYY/MM"
	 */
	public static final String YYYY_MM = "yyyy/MM";

	/**
	 * Date format: "YY/MM/DD"
	 */
	public static final String YY_MM_DD = "yy/MM/dd";

	/**
	 * Date format: "YYYY/MM/DD"
	 */
	public static final String YYYY_MM_DD = "yyyy/MM/dd";

	/**
	 * Date format: "YYYY-MM-DD"
	 */
	public static final String OYYYY_MM_DD = "yyyy-MM-dd";

	/**
	 * Date format: "YYYY-MM-DD HH:MI" Add By YEHOOHAHA
	 */
	public static final String OYYYY_MM_DD_HH_MI = "yyyy-MM-dd hh:mm";
	
	/**
	 * Date format: "YYYY-MM-DD HH:MI:SS" Add By fyb
	 */
	public static final String OYYYY_MM_DD_HH_MI_SS = "yyyy-MM-dd HH:mm:ss";

	/**
	 * Date format: "HH:MI"
	 */
	public static final String HH_MI = "HH:mm";

	/**
	 * Date format: "HHMI"
	 */
	public static final String HHMI = "HHmm";

	/**
	 * Date format: "YY/MM/DD HH:MI"
	 */
	public static final String YY_MM_DD_HH_MI = "yy/MM/dd HH:mm";

	/**
	 * Date format: "YYYY/MM/DD HH:MI"
	 */
	public static final String YYYY_MM_DD_HH_MI = "yyyy/MM/dd HH:mm";

	/**
	 * Date format: "YYYY/MM/DD HH:MI:SS"
	 */
	public static final String YYYY_MM_DD_HH_MI_SS = "yyyy/MM/dd HH:mm:ss";

	/**
	 * Date format: "HH:MI:SS"
	 */
	public static final String HH_MI_SS = "HH:mm:ss";

	/**
	 * Date format: "YYYYMMDDHHMISS"
	 */
	public static final String YYYYMMDDHHMI = "yyyyMMddHHmm";

	/**
	 * Date format: "YYYYMMDDHHMISS"
	 */
	public static final String YYYYMMDDHHMISS = "yyyyMMddHHmmss";

	/**
	 * Date format: "YYYYMMDD_HHMISS"
	 */
	public static final String YYYYMMDD_HHMISS = "yyyyMMdd-HHmmss";

	/**
	 * Date format YYYY年MM月DD日
	 */
	public static final String YYYY$MM$DD$ = "yyyy年MM月dd日";

	/**
	 * Date format YYYY年MM月
	 */
	public static final String YYYY$MM$ = "yyyy年MM月";

	/**
	 * Date format MM月DD日
	 */
	public static final String MM$DD$ = "MM月dd日";

	/**
	 * Date format DD日
	 */
	public static final String DD$ = "dd日";

	// modified 2004/06/10 詳細情報修正
	/**
	 * Date format: "ERAYYMMDD"
	 */
	public static final String ERAYYMMDD = "ERAYYMMDD";

	/**
	 * Date format: "ERAYYMM"
	 */
	public static final String ERAYYMM = "ERAYYMM";

	/**
	 * Date format: "HH"
	 */
	public static final String HH = "HH";

	/**
	 * Date format: "MI"
	 */
	public static final String MI = "mm";

	/**
	 * Field value: Year
	 */
	public static final int YEAR = 1;

	/**
	 * Field value: Month
	 */
	public static final int MONTH = 2;

	/**
	 * Field value: Day
	 */
	public static final int DAY = 3;
	/**
	 * Field value: Week 周
	 */
	public static final int WEEK = 4;

	/**
	 * Field value: Hour
	 */
	public final static int HOUR = 10;

	/**
	 * Field value: Hour of Day
	 */
	public final static int HOUR_OF_DAY = 11;

	/**
	 * Field value: Minute
	 */
	public final static int MINUTE = 12;

	/**
	 * Field value: Second
	 */
	public final static int SECOND = 13;
	/**
	 * 获得本年第一天日期
	 */
    public static Date getCurrentYearFirst(){   
    	String month = getFormatDate(DateUtil.YYYY, new Date()) + "0101";
		Date firstday = null;

		firstday = getDate(DateUtil.YYYYMMDD, month);

		return firstday;  
    }  
    /**
	 * 获得年第一天日期
	 */
    public static Date getCurrentYearFirst(Date date){   
    	String month = getFormatDate(DateUtil.YYYY, date) + "0101";
		Date firstday = null;

		firstday = getDate(DateUtil.YYYYMMDD, month);

		return firstday;  
    } 


	/**
	 * 获取当前时间
	 * 
	 * @return current date
	 */
	public static Date getCurrent() {
		Date currentDate = new Date();
		return currentDate;
	}

	/**
	 * 获取当前时间
	 * 
	 * @return current date
	 */
	public static Date getCurrentdate() {
		String currentDate = DateUtil.getFormatDate(DateUtil.YYYYMMDD,new Date());
		Date date = DateUtil.getDate(DateUtil.YYYYMMDDHHMISS, currentDate
				+ "000000");
		return date;
	}

	/**
	 * Function : 获取当天的最后时间
	 * 
	 * @return current date end
	 */
	public static Date getCurrentdateEnd() {
		String currentDate = DateUtil.getFormatDate(DateUtil.YYYYMMDD,
				new Date());
		Date date = DateUtil.getDate(DateUtil.YYYYMMDDHHMISS, currentDate
				+ "235959");
		return date;
	}

	/**
	 * function:得到一个月有几周
	 * 
	 * @param date
	 * @return
	 * 
	 * @Author: siny
	 * 
	 * DateTime:Sep 7, 2009 11:25:25 AM
	 */
	public static int getMonthWeekCount(Date date) {
		Date monthenddate = getMonthEndDay(date);
		Calendar cal = Calendar.getInstance();
		cal.setTime(monthenddate);
		return cal.get(Calendar.WEEK_OF_MONTH);
	}

	/**
	 * 获取当前月份的第一天
	 * 
	 * @return current month's first day
	 * 
	 */
	public static Date getCurrentMonth() {
		return getMonthFirstDay(new Date());
	}

	/**
	 * 获取指定日期月份的第一天
	 * 
	 * @param date
	 * @return
	 */
	public static Date getMonthFirstDay(Date date) {
		String month = getFormatDate(DateUtil.YYYYMM, date) + "01";
		Date firstday = null;

		firstday = getDate(DateUtil.YYYYMMDD, month);

		return firstday;
	}

	/**
	 * 
	 * Function: 得到当前日期的本周的第一天
	 * 
	 * Produce describe:
	 * 
	 * @param date
	 * @return
	 * 
	 * @author semwar 2008-4-18 下午01:42:46
	 */
	@SuppressWarnings("deprecation")
	public static Date getFirstDayOfWeek(Date date) {
		Calendar c = new GregorianCalendar();
		c.setFirstDayOfWeek(Calendar.MONDAY);
		c.setTime(date);
		c.set(Calendar.DAY_OF_WEEK, c.getFirstDayOfWeek()); // Monday
		return c.getTime();
	}

	/**
	 * 
	 * Function: 得到当前日期的本周的第一天 字符串形式
	 * 
	 * Produce describe:
	 * 
	 * @param date
	 * @return
	 * 
	 * @author semwar 2008-4-18 下午01:42:46
	 */
	@SuppressWarnings("deprecation")
	public static String getWeekFirstDayStr(Date date) {
		String str = DateUtil.getFormatDate(DateUtil.YYYY_MM_DD, getFirstDayOfWeek(date));
		String strArr = str.replace("/", "-");
		return strArr+" 00:00:00";
	}

	/**
	 * 取得当前日期所在周的最后一天
	 * 
	 * @param date
	 * @return
	 */
	public static Date getLastDayOfWeek(Date date) {
		Calendar c = new GregorianCalendar();
		c.setFirstDayOfWeek(Calendar.MONDAY);
		c.setTime(date);
		c.set(Calendar.DAY_OF_WEEK, c.getFirstDayOfWeek() + 6); // Sunday
		return c.getTime();
	}

	/**
	 * 取得当前日期所在周的最后一天 字符串形式
	 * 
	 * @param date
	 * @return
	 */
	@SuppressWarnings("deprecation")
	public static String getWeekEndDayStr(Date date) {
		String str = DateUtil.getFormatDate(DateUtil.YYYY_MM_DD, getFirstDayOfWeek(date));
		String strArr = str.replace("/", "-");
		return strArr+" 23:59:59";
	}
	/**
	 * 时间转字符串.
	 * 
	 * @param date
	 *            Date value.
	 * @return formatted date as string value.
	 * 
	 * @see #FORMAT_DATE_DEFAULT
	 */
	public final static String format(Date date) {
		if (date == null) {
			return "";
		}
		return format(date, OYYYY_MM_DD);
	}
	/**
	 * 时间转字符串.
	 * 
	 * @param date
	 *            Date value.
	 * @param formatPattern
	 *            format pattern.
	 * @return formatted date as string value.
	 * 
	 * @see #FORMAT_DATE_DEFAULT
	 * @see #FORMAT_DATE_YYYY_MM_DD
	 * @see #FORMAT_DATE_YYYY_MM_DD_HH_MM
	 * @see #FORMAT_DATE_YYYY_MM_DD_HH_MM_SS
	 * @see #FORMAT_DATE_YYYY_MM_DD_HHMMSS
	 */
	public final static String format(Date date, String formatPattern) {
		if (date == null) {
			return "";
		}
		return new SimpleDateFormat(formatPattern).format(date);
	}

	/**
	 * 得到月底一天的日期
	 * 
	 * @param date
	 * @return
	 */
	public static Date getMonthEndDay(Date date) {
		Date endday = DateUtil.dateAdd(DateUtil.DAY, -1, DateUtil.dateAdd(
				DateUtil.MONTH, 1, getMonthFirstDay(date)));
		return endday;
	}

	/**
	 * Get 2999/12/31
	 * 
	 * @return
	 */
	public static Date getEndDate() {

		return getDate(DateUtil.YYYYMMDD, "29991231");

	}

	/**
	 * Get 9999/12/31
	 * 
	 * @return
	 */
	public static Date getServiceEndDate() {

		return getDate(DateUtil.YYYYMMDD, "99991231");

	}

	/**
	 * Get 1990/01/01
	 * 
	 * @return
	 */
	public static Date getStartDate() {

		return getDate(DateUtil.YYYYMMDD, "19900101");

	}

	/**
	 *  获得查询月份第第一天日期
	 * @param month 月份
	 * @return
	 */
	public static Date getSelectMonth(String month) {
		SimpleDateFormat sdf;
		Date time = new Date();
		sdf = new SimpleDateFormat("yyyy");
		String date = sdf.format(time);
		date = date + "-" + month + "-01 00:00:00.0";
		sdf.applyPattern("yyyy-MM");
		Date curDate = null;
		try {
			curDate = sdf.parse(date);
		} catch (ParseException e) {
		}

		return curDate;
	}

	/**
	 * 
	 * @param birthday
	 * @return
	 */
	public static String getAge(String birthday) {
		if (birthday == null || "".equals(birthday))
			return "0";
		Date timenow = new Date();
		Date birth = null;

		birth = getDate(DateUtil.YYYYMMDD, birthday);
		int byear = Integer.parseInt(getFormatDate(DateUtil.YYYY, birth));
		int nyear = Integer.parseInt(getFormatDate(DateUtil.YYYY, timenow));
		int bmonth = Integer.parseInt(getFormatDate(DateUtil.MM, birth));
		int nmonth = Integer.parseInt(getFormatDate(DateUtil.MM, timenow));
		int age = nyear - byear;
		if (age < 0)
			return "0";
		if (nmonth < bmonth)
			age--;
		return String.valueOf(age);

	}

	/**
	 * 
	 * @param birthday
	 * @return
	 */
	public static String getAge(Date birthday) {

		if (birthday == null)
			return "0";
		Date timenow = new Date();
		int byear = Integer.parseInt(getFormatDate(DateUtil.YYYY, birthday));
		int nyear = Integer.parseInt(getFormatDate(DateUtil.YYYY, timenow));
		int bmonth = Integer.parseInt(getFormatDate(DateUtil.MM, birthday));
		int nmonth = Integer.parseInt(getFormatDate(DateUtil.MM, timenow));
		int age = nyear - byear;
		if (age < 0)
			return "0";
		if (nmonth < bmonth)
			age--;
		return String.valueOf(age);

	}
	
	/**
	 * 
	 * @param birthday
	 * @return
	 */
	public static String getBirthday(String age) {

		if (age == null)
			return null;
		
		String nowyear = DateUtil.getFormatDate(DateUtil.YYYY,new Date());
		
		String birthday = Long.parseLong(nowyear)-Long.parseLong(age)+"";

		return birthday;

	}
	
	/**
	 * 
	 * @param birthday
	 * @return
	 */
	public static String getAge(Date birthday, Date curDate) {

		if (birthday == null)
			return "0";
		Date timenow = curDate;
		int byear = Integer.parseInt(getFormatDate(DateUtil.YYYY, birthday));
		int nyear = Integer.parseInt(getFormatDate(DateUtil.YYYY, timenow));
		int bmonth = Integer.parseInt(getFormatDate(DateUtil.MM, birthday));
		int nmonth = Integer.parseInt(getFormatDate(DateUtil.MM, timenow));
		int age = nyear - byear;
		if (age < 0)
			return "0";
		if (nmonth < bmonth)
			age--;
		return String.valueOf(age);

	}

	/**
	 * Get formatted date through custom format
	 * 
	 * @param sFormat
	 *            Format
	 * @param date
	 *            Date which need to be formatted
	 * @return Formatted date
	 */
	public static String getFormatDate(String sFormat, Date date) {
		if (date == null) {
			return null;
		}
		if (sFormat == DateUtil.YY || sFormat == DateUtil.YYYY
				|| sFormat == DateUtil.MM || sFormat == DateUtil.DD
				|| sFormat == DateUtil.MM_DD || sFormat == DateUtil.YYYYMM
				|| sFormat == DateUtil.YYYYMMDD || sFormat == DateUtil.YYYY_MM
				|| sFormat == DateUtil.YY_MM_DD
				|| sFormat == DateUtil.YYYY_MM_DD
				|| sFormat == DateUtil.OYYYY_MM_DD
				|| sFormat == DateUtil.OYYYY_MM_DD_HH_MI || DateUtil.OYYYY_MM_DD_HH_MI_SS.equals(sFormat)
				|| sFormat == DateUtil.HH_MI || sFormat == DateUtil.HHMI
				|| sFormat == DateUtil.YY_MM_DD_HH_MI
				|| sFormat == DateUtil.YYYY_MM_DD_HH_MI_SS
				|| sFormat == DateUtil.YYYYMMDDHHMISS
				|| sFormat == DateUtil.YYYY$MM$DD$
				|| sFormat == DateUtil.YYYY$MM$ || sFormat == DateUtil.MM$DD$
				|| sFormat == DateUtil.DD$ || sFormat == DateUtil.HH
				|| sFormat == DateUtil.MI || sFormat == DateUtil.HH_MI_SS
				|| sFormat == DateUtil.YYYY_MM_DD_HH_MI) {
			SimpleDateFormat formatter = new SimpleDateFormat(sFormat);
			return formatter.format(date);
		} else {
			return null;
		}
	}

	public static Date getDate(String sFormat, String date) {
		if (date == null || "".equals(date)) {
			return null;
		}
		if (DateUtil.YY.equals(sFormat) || DateUtil.YYYY.equals(sFormat)
				|| DateUtil.MM.equals(sFormat)|| DateUtil.DD.equals(sFormat)
				||  DateUtil.MM_DD.equals(sFormat) ||  DateUtil.YYYYMM.equals(sFormat)
				||  DateUtil.YYYYMMDD.equals(sFormat) ||  DateUtil.YYYY_MM.equals(sFormat)
				||  DateUtil.YY_MM_DD.equals(sFormat)
				||  DateUtil.YYYY_MM_DD.equals(sFormat)
				||  DateUtil.OYYYY_MM_DD.equals(sFormat) || DateUtil.OYYYY_MM_DD_HH_MI_SS.equals(sFormat) ||  DateUtil.HH_MI.equals(sFormat)
				||  DateUtil.YY_MM_DD_HH_MI.equals(sFormat)
				||  DateUtil.YYYY_MM_DD_HH_MI_SS.equals(sFormat)
				||  DateUtil.YYYYMMDDHHMI.equals(sFormat)
				||  DateUtil.YYYYMMDDHHMISS.equals(sFormat)
				||  DateUtil.YYYYMMDD_HHMISS.equals(sFormat)
				||  DateUtil.YYYY$MM$DD$.equals(sFormat)
				||  DateUtil.YYYY$MM$.equals(sFormat) ||  DateUtil.MM$DD$.equals(sFormat)
				||  DateUtil.DD$.equals(sFormat) ||  DateUtil.HH.equals(sFormat)
				||  DateUtil.MI.equals(sFormat)) {
			SimpleDateFormat formatter = new SimpleDateFormat(sFormat);
			try {
				return formatter.parse(date);
			} catch (ParseException e) {

				e.printStackTrace();
			}
		}
		return null;
	}

	/**
	 * 月末日取得
	 * 
	 * @return
	 */
	public static Date getLastDay(Date date) {
		if (date == null) {
			return null;
		} else {
			return dateAdd(DateUtil.DAY, -1, dateAdd(DateUtil.MONTH, 1, date));
		}
	}

	/**
	 * Get current formatted date through custom format
	 * 
	 * @param sFormat
	 *            Format
	 * @return Formatted date
	 */
	public static String getFormatDate(String sFormat) {
		return getFormatDate(sFormat, getCurrent());
	}

	/**
	 * Add value on special field of date
	 * 
	 * @param iField
	 *            Field which need add value
	 * @param iValue
	 *            Value which will be added
	 * @param date
	 *            Basic date
	 * @return New date
	 */
	public static Date dateAdd(int iField, int iValue, Date date) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		switch (iField) {
		case DateUtil.YEAR:
			cal.add(Calendar.YEAR, iValue);
			break;
		case DateUtil.MONTH:
			cal.add(Calendar.MONTH, iValue);
			break;
		case DateUtil.DAY:
			cal.add(Calendar.DATE, iValue);
			break;
		case DateUtil.HOUR:
			cal.add(Calendar.HOUR, iValue);
			break;
		case DateUtil.HOUR_OF_DAY:
			cal.add(Calendar.HOUR_OF_DAY, iValue);
			break;
		case DateUtil.MINUTE:
			cal.add(Calendar.MINUTE, iValue);
			break;
		case DateUtil.SECOND:
			cal.add(Calendar.SECOND, iValue);
			break;
		case DateUtil.WEEK:
			cal.add(Calendar.DATE, iValue*7);
			break;
		default:
			break;
		}
		return cal.getTime();
	}

	/**
	 * Date diff
	 * 
	 * @param iField
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	public static long dateDiff(int iField, Date startDate, Date endDate) {
		Calendar start = Calendar.getInstance();
		Calendar end = Calendar.getInstance();
		int startYear = Integer.parseInt(getFormatDate(YYYY, startDate));
		int endYear = Integer.parseInt(getFormatDate(YYYY, endDate));
		int startMonth = Integer.parseInt(getFormatDate(MM, startDate)) - 1;
		int endMonth = Integer.parseInt(getFormatDate(MM, endDate)) - 1;
		int startDay = Integer.parseInt(getFormatDate(DD, startDate));
		int endDay = Integer.parseInt(getFormatDate(DD, endDate));
		int startHour = Integer.parseInt(getFormatDate(HH, startDate));
		int endHour = Integer.parseInt(getFormatDate(HH, endDate));
		int startMinute = Integer.parseInt(getFormatDate(MI, startDate));
		int endMinute = Integer.parseInt(getFormatDate(MI, endDate));

		switch (iField) {
		case DateUtil.YEAR:
			return endYear - startYear;
		case DateUtil.MONTH:
			long yearDiff = endYear - startYear;
			long monthDiff = endMonth - startMonth;
			return yearDiff * 12 + monthDiff;
		case DateUtil.DAY:
			start.set(startYear, startMonth, startDay, 0, 0, 0);
			end.set(endYear, endMonth, endDay, 0, 0, 0);
			return (end.getTimeInMillis() - start.getTimeInMillis())
					/ (1000 * 60 * 60 * 24);
		case DateUtil.HOUR:
			start.set(startYear, startMonth, startDay, startHour, 0, 0);
			end.set(endYear, endMonth, endDay, endHour, 0, 0);
			return (end.getTimeInMillis() - start.getTimeInMillis())
					/ (1000 * 60 * 60);
		case DateUtil.HOUR_OF_DAY:
			start.set(startYear, startMonth, startDay, startHour, 0, 0);
			end.set(endYear, endMonth, endDay, endHour, 0, 0);
			return (end.getTimeInMillis() - start.getTimeInMillis())
					/ (1000 * 60 * 60);
		case DateUtil.MINUTE:
			start.set(startYear, startMonth, startDay, startHour, startMinute,
					0);
			end.set(endYear, endMonth, endDay, endHour, endMinute, 0);
			return (end.getTimeInMillis() - start.getTimeInMillis())
					/ (1000 * 60);
		default:
			break;
		}
		return end.getTimeInMillis() - start.getTimeInMillis();
	}

	/**
	 * Add value on special field of current date
	 * 
	 * @param iField
	 *            iField Field which need add value
	 * @param iValue
	 *            Value which will be added
	 * @return New date
	 */
	public static Date dateAdd(int iField, int iValue) {
		return dateAdd(iField, iValue, getCurrent());
	}

	/**
	 * Trunc the date
	 * 
	 * @param date
	 * @return
	 */
	public static Date dateTrunc(Date date) {

		return DateUtil.getDate(DateUtil.YYYYMMDD, DateUtil.getFormatDate(
				DateUtil.YYYYMMDD, date));

	}

	/**
	 * Get the day count of the month
	 * 
	 * @param date
	 * @return
	 */
	public static long getMonthDayCount(Date date) {
		Date start = getMonthFirstDay(date);
		Date end = getMonthEndDay(date);
		return DateUtil.dateDiff(DateUtil.DAY, start, end) + 1;
	}

	/**
	 * 
	 * Function: 返回第几周
	 * 
	 * Produce describe:
	 * 
	 * @param type
	 *            DateUtil.YEAR ： 一年中第几周 DateUtil.MONTH ： 一月中第几周
	 * @param date
	 * @return
	 */
	public static int getWeekNum(int type, Date date) {

		Date monthenddate = getMonthEndDay(date);
		Calendar cal = Calendar.getInstance();
		cal.setTime(monthenddate);

		if (type == DateUtil.YEAR) {

			return cal.get(Calendar.WEEK_OF_YEAR);

		} else if (type == DateUtil.MONTH) {

			return cal.get(Calendar.WEEK_OF_MONTH);

		}

		return 0;
	}

	/**
	 * Function: return date by specified year,month,day,hour,minute,second<br>
	 * 
	 * @param hour
	 * @param minute
	 * @param second
	 * @param month
	 * @param day
	 * @param year
	 * @return - Date
	 */
	public static Date mktime(int hour, int minute, int second, int month,
			int day, int year) {

		Calendar cal = Calendar.getInstance();
		cal.set(year, month - 1, day, hour, minute, second);
		return cal.getTime();

	}

	/**
	 * Get timestamp
	 * 
	 * @param date
	 * @return
	 */
	public static Timestamp getTimestamp(Date date) {
		return new Timestamp(date.getTime());
	}

	/**
	 * 获取系统当前Timestamp格式的时间
	 * 
	 */
	public static Timestamp getCurrentDateTimestamp() {
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Timestamp createDttm = Timestamp.valueOf(df
				.format(new java.util.Date()));
		return createDttm;
	}

	/**
	 * Private Constructor
	 */
	private DateUtil() {
	}

	/**
	 * Function: 取得两个时间之间的距离
	 * 
	 * Produce describe:
	 * 
	 * @param startDate
	 * @param endDate
	 * @return 时间距离列表(天,小时,秒)
	 * 
	 */
	public static long[] dateDiffEx(Date startDate, Date endDate) {

		long[] diffTime = new long[3];

		long minuteDiff = 0;
		long hourDiff = 0;
		long dayDiff = 0;

		long diff = dateDiff(MINUTE, startDate, endDate);

		if (diff > 0) {
			// 分钟
			minuteDiff = diff % 60;
			diff = diff / 60;
		}

		if (diff > 0) {
			// 小时
			hourDiff = diff % 24;
			diff = diff / 24;
		}

		if (diff > 0) {
			// 天
			dayDiff = diff;
		}

		diffTime[0] = dayDiff;
		diffTime[1] = hourDiff;
		diffTime[2] = minuteDiff;

		return diffTime;
	}

	/**
	 * 
	 * Function:取得两个时间的相差值,精确到秒</br>
	 * 
	 * Produce Describe: 返回 int[6]数组,int[0]为年份差值,int[1]为月份差值......</br>
	 * 
	 * @param startTime
	 *            开始时间
	 * @param endTime
	 *            结束时间
	 * @return
	 * @author: siny 2008-4-10
	 */
	public static int[] getTimeDiff(Date startTime, Date endTime) {
		int[] ret = new int[6];
		if (startTime == null || endTime == null)
			return null;
		int syear = 0;
		if (DateUtil.getFormatDate(DateUtil.YYYY, startTime) != null)
			syear = Integer.parseInt(DateUtil.getFormatDate(DateUtil.YYYY,
					startTime));
		int eyear = 0;
		if (DateUtil.getFormatDate(DateUtil.YYYY, endTime) != null)
			eyear = Integer.parseInt(DateUtil.getFormatDate(DateUtil.YYYY,
					endTime));

		int smonth = 0;
		if (DateUtil.getFormatDate(DateUtil.MM, startTime) != null)
			smonth = Integer.parseInt(DateUtil.getFormatDate(DateUtil.MM,
					startTime));
		int emonth = 0;
		if (DateUtil.getFormatDate(DateUtil.MM, endTime) != null)
			emonth = Integer.parseInt(DateUtil.getFormatDate(DateUtil.MM,
					endTime));
		int sday = 0;
		if (DateUtil.getFormatDate(DateUtil.DD, startTime) != null)
			sday = Integer.parseInt(DateUtil.getFormatDate(DateUtil.DD,
					startTime));
		int eday = 0;
		if (DateUtil.getFormatDate(DateUtil.DD, endTime) != null)
			eday = Integer.parseInt(DateUtil
					.getFormatDate(DateUtil.DD, endTime));
		int shour = 0;
		if (DateUtil.getFormatDate(DateUtil.HH, startTime) != null)
			shour = Integer.parseInt(DateUtil.getFormatDate(DateUtil.HH,
					startTime));
		int ehour = 0;
		if (DateUtil.getFormatDate(DateUtil.HH, endTime) != null)
			ehour = Integer.parseInt(DateUtil.getFormatDate(DateUtil.HH,
					endTime));
		int sminute = 0;
		if (DateUtil.getFormatDate("mm", startTime) != null)
			sminute = Integer.parseInt(DateUtil.getFormatDate("mm", startTime));
		int eminute = 0;
		if (DateUtil.getFormatDate("mm", endTime) != null)
			eminute = Integer.parseInt(DateUtil.getFormatDate("mm", endTime));

		int ssecond = 0;
		if (DateUtil.getFormatDate("ss", endTime) != null)
			ssecond = Integer.parseInt(DateUtil.getFormatDate("ss", startTime));
		int esecond = 0;
		if (DateUtil.getFormatDate("ss", endTime) != null)
			esecond = Integer.parseInt(DateUtil.getFormatDate("ss", endTime));

		int secondDif = esecond - ssecond;

		int minuteDif = eminute - sminute;

		int hourDif = ehour - shour;

		int dayDif = eday - sday;

		int monthDif = emonth - smonth;

		int yearDif = eyear - syear;

		if (secondDif < 0) {
			secondDif += 60;
			minuteDif--;
		}
		if (minuteDif < 0) {
			minuteDif += 60;
			hourDif--;
		}
		if (hourDif < 0) {
			hourDif += 24;
			dayDif--;
		}

		// 月份天数
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(endTime);
		int days = calendar.getMaximum(Calendar.DATE);

		if (dayDif < 0) {
			dayDif += days;
			monthDif--;
		}
		if (monthDif < 0) {
			monthDif += 12;
			yearDif--;
		}

		ret[0] = yearDif;
		ret[1] = monthDif;
		ret[2] = dayDif;
		ret[3] = hourDif;
		ret[4] = minuteDif;
		ret[5] = secondDif;

		return ret;

	}

	/**
	 * function: 获取星期几
	 * 
	 * @return
	 */
	public static String getWeekday(String sFormat, String date) {

		Date datetime = getDate(DateUtil.YYYY_MM_DD, date);

		return getWeekday(datetime);

	}

	/**
	 * function: 获取星期几
	 * 
	 * @param date
	 * @return
	 * 
	 * @author siny Nov 28, 2008 9:46:11 AM
	 */
	public static String getWeekday(Date date) {

		String week = "";

		if (date != null) {
			int day = date.getDay();
			switch (day) {
			case 1:
				week = "星期一";
				break;
			case 2:
				week = "星期二";
				break;
			case 3:
				week = "星期三";
				break;
			case 4:
				week = "星期四";
				break;
			case 5:
				week = "星期五";
				break;
			case 6:
				week = "星期六";
				break;
			case 0:
				week = "星期日";
				break;
			default:
				break;
			}
		}
		return week;
	}

	/**
	 * function: 得到1980.1.1格式的日期
	 * 
	 * @param date
	 * @return
	 * 
	 * @author siny Nov 28, 2008 9:47:13 AM
	 */
	public static String getStringDate(String sFormat, Date date) {
		if (date == null || "".equals(date)) {
			return null;
		}
		// 年
		String year = DateUtil.getFormatDate(DateUtil.YYYY, date);
		// 月
		String month = DateUtil.getFormatDate(DateUtil.MM, date);
		// 日
		String day = DateUtil.getFormatDate(DateUtil.DD, date);

		if (DateUtil.DYYYYMMDD.equals(sFormat)) {
			return year + "." + month + "." + day;
		}
		if (DateUtil.DYYYYMM.equals(sFormat)) {
			return year + "." + month;
		}
		return "";
	}
	
	/**
	 * function:
	 * 
	 * @param format
	 * @param date
	 * @param year
	 * @param month
	 * @param day
	 * @return
	 * 
	 * @Author: siny
	 * 
	 * DateTime:Sep 7, 2009 11:23:12 AM
	 */
	public static String getSysDate(String format,Date date, int year, int month, int day) {
		Calendar cal = Calendar.getInstance();
		SimpleDateFormat sFmt = new SimpleDateFormat(format);
		cal.setTime(date);
		if (day != 0) {
			cal.add(Calendar.YEAR, year);
		}
		if (month != 0) {
			cal.add(Calendar.MONTH, month);
		}
		if (year != 0) {
			cal.add(Calendar.YEAR, year);

		}
		return sFmt.format(cal.getTime());
	}   

	/**
	 * function:获得两个日历 的天数差
	 * 
	 * @param d1
	 *            开始的日历
	 * 
	 * @param d2
	 *            结束的日历
	 * 
	 * @return int
	 * 
	 * Jul 28, 2009
	 */
	public static int getDaysBetween(Calendar d1, Calendar d2) {
		if (d1.after(d2)) {
			Calendar swap = d1;
			d1 = d2;
			d2 = swap;
		}
		int days = d2.get(Calendar.DAY_OF_YEAR) - d1.get(Calendar.DAY_OF_YEAR);
		int y2 = d2.get(Calendar.YEAR);
		if (d1.get(Calendar.YEAR) != y2) {
			d1 = (Calendar) d1.clone();
			do {
				days += d1.getActualMaximum(Calendar.DAY_OF_YEAR);
				d1.add(Calendar.YEAR, 1);
			} while (d1.get(Calendar.YEAR) != y2);
		}
		return days;
	}

	/**
	 * function:得到下一个星期一
	 * 
	 * @param date
	 * 
	 * @return Calendar
	 * 
	 * Jul 28, 2009
	 */
	public static Calendar getNextMonday(Calendar date) {
		Calendar result = null;
		result = date;
		do {
			result = (Calendar) result.clone();
			result.add(Calendar.DATE, 1);
		} while (result.get(Calendar.DAY_OF_WEEK) != 2);
		return result;
	}

	/**
	 * function:得到工作时间的 天数差 及星期一到星期五
	 * 
	 * @param d1
	 *            开始的日历时间
	 * 
	 * @param d2
	 *            结束的日历时间
	 * 
	 * @return int
	 * 
	 * Jul 28, 2009
	 */
	public static int getWorkingDay(Calendar d1, Calendar d2) {
		int result = -1;
		if (d1.after(d2)) {
			Calendar swap = d1;
			d1 = d2;
			d2 = swap;
		}
		int betweendays = getDaysBetween(d1, d2);

		int charge_date = 0;
		int charge_start_date = 0;// 开始日期的日期偏移量
		int charge_end_date = 0;// 结束日期的日期偏移量

		// /////////////// 日期不在同一个月份内//////////////////////////
		int stmp;
		int etmp;
		stmp = 7 - d1.get(Calendar.DAY_OF_WEEK);
		etmp = 7 - d2.get(Calendar.DAY_OF_WEEK);
		if (stmp != 0 && stmp != 6) {// 开始日期为星期六和星期日时偏移量为0
			charge_start_date = stmp - 1;
		}
		if (etmp != 0 && etmp != 6) {// 结束日期为星期六和星期日时偏移量为0
			charge_end_date = etmp - 1;
		}

		result = (getDaysBetween(getNextMonday(d1), getNextMonday(d2)) / 7) * 5 + charge_start_date - charge_end_date;
		return result;
	}

	/**
	 * function: 工作的天数差
	 * 
	 * @param cDate
	 *            开始的时间
	 * 
	 * @param eDate
	 *            结束的时间
	 * 
	 * @return int
	 * 
	 * Jul 28, 2009
	 */
	public static int getWorkingDay(Date cDate, Date eDate) {

		Calendar cal_start = Calendar.getInstance();

		Calendar cal_end = Calendar.getInstance();

		cal_start.setTime(cDate);

		cal_end.setTime(eDate);

		return getWorkingDay(cal_start, cal_end);
	}

	/**
	 * function: 工作日的天数差
	 * 
	 * @param cDate
	 *            开始时间
	 * 
	 * @param eDate
	 *            结束时间
	 * 
	 * @return int
	 * 
	 * Jul 28, 2009
	 */
	public static int getWorkingDay(String cDate, String eDate) {

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

		try {

			Date startDate = sdf.parse(cDate);

			Date endDate = sdf.parse(eDate);

			return getWorkingDay(startDate, endDate);

		} catch (ParseException e) {

			e.printStackTrace();
		}

		return 0;
	}
}