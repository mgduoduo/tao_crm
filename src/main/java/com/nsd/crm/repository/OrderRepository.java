package com.nsd.crm.repository;

import com.nsd.crm.common.SearchCriteria;
import com.nsd.crm.entry.OrderInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface OrderRepository {

    public OrderInfo save(OrderInfo orderInfo);
    public void deleteOrderInfoByID(int orderID);
    public OrderInfo getOrderInfoByID(int orderID);
    public OrderInfo getOrderInfoByExpressNO(String expressNO);

    public List<OrderInfo> getOrderListByFromDtToDt(String fromDate, String toDate);

//    List<OrderInfo> getOrderListBySearchCriteria(SearchCriteria searchCriteria);//tmp
    void update(OrderInfo orderInfo);

    /***** for spring ***********/
    Page<OrderInfo> getOrderPageListBySearchCriteria(SearchCriteria searchCriteria, Pageable page);

    /****** for page tag **********/
    List<OrderInfo> getOrderListBySearchCriteria(SearchCriteria searchCriteria, Map<String, Object> pageMap);
    
    
    //set for the daofu
    List<OrderInfo> getOrderListBySearchCriteriaforDaofu(SearchCriteria searchCriteria, Map<String, Object> pageMap);
}