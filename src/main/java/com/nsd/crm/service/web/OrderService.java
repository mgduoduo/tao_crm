package com.nsd.crm.service.web;

import com.nsd.crm.common.SearchCriteria;
import com.nsd.crm.entry.OrderInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface OrderService {

	public OrderInfo save(OrderInfo orderInfo);
	public void update(OrderInfo orderInfo);
	public void deleteOrderInfoByID(int orderID);
	public OrderInfo getOrderInfoByID(int orderID);
	public OrderInfo getOrderInfoByExpressNO(String expressNO);

	public byte[] generateOrderInfoAsFile(List<OrderInfo> orderInfoList, String fileName);

	/***** for page tag ********/
//	List<OrderInfo> getOrderListBySearchCriteria(SearchCriteria searchCriteria);
	public Integer getCountOfOrderListBySearchCriteria(SearchCriteria searchCriteria);

	public List<OrderInfo> getAllOrderList(Map<String, Object> pageMap);

	public List<OrderInfo> getOrderListBySearchCriteria(SearchCriteria searchCriteria, Map<String, Object> pageMap);
	/*************/



	public List<OrderInfo> getOrderListByFromDtToDt(String FromDate, String toDate);//unused.
	public List<OrderInfo> getAllOrderList();//unused.
	public List<OrderInfo> getOrderListBySearchCriteria(SearchCriteria searchCriteria);//unused.

	/**** for spring pagination*********/
	Page<OrderInfo> getOrderPageListBySearchCriteria(SearchCriteria searchCriteria, Pageable page);
	
	//create for daofu page 
	public Integer getCountOfOrderListBySearchCriteriaforDaofu(SearchCriteria searchCriteria);
	
	public List<OrderInfo> getOrderListBySearchCriteriaforDaofu(SearchCriteria searchCriteria, Map<String, Object> pageMap);

	public List<OrderInfo> getOrderListBySearchCriteriaforDaofu(SearchCriteria searchCriteria);
}

