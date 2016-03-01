package com.nsd.crm.repository;

import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.FlushModeType;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;
import javax.persistence.Query;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.nsd.crm.common.SearchCriteria;
import com.nsd.crm.common.util.DateUtil;
import com.nsd.crm.common.util.HibernateUtil;
import com.nsd.crm.entry.OrderInfo;

@Repository
public class OrderRepositoryImpl implements OrderRepository{

	private final static Logger LOGGER = LoggerFactory.getLogger(OrderRepositoryImpl.class);

	@PersistenceContext(type = PersistenceContextType.EXTENDED)
	private EntityManager entityManager;
	 
	public EntityManager getEntityManager() {
	return entityManager;
	}

	@Override
	@Transactional
	public OrderInfo save(OrderInfo orderInfo) {
		entityManager.persist(orderInfo);
		entityManager.flush();
		return orderInfo;
	}

	@Override
	@Transactional
	public void deleteOrderInfoByID(int orderID) {

	}

	@Override
	public OrderInfo getOrderInfoByID(int orderID) {
		return entityManager.find(OrderInfo.class, orderID);
	}

	@Override
	public OrderInfo getOrderInfoByExpressNO(String expressNO) {

		String sql = "select o1.* from TB_TRADE_ORDER o1 where o1.express_NO=?1";
		Query query = entityManager.createNativeQuery(sql, OrderInfo.class)
				.setParameter(1, expressNO);

		if(query.getResultList().isEmpty()){
			return null;
		}
		return (OrderInfo)query.getSingleResult();
	}

	@Override
	public List<OrderInfo> getOrderListByFromDtToDt(String fromDateStr, String toDateStr) {
		StringBuffer strBuf = new StringBuffer("select o1.* from TB_TRADE_ORDER o1 where 1=1 ");
		if(fromDateStr!=null && !"".equals(fromDateStr)){
			fromDateStr = fromDateStr + " 00:00:00";
			strBuf.append(" AND o1.PURCHASE_DATE >= str_to_date('"+fromDateStr+"','%Y-%m-%d %H:%i:%s')");
		}
		if(toDateStr!=null && "".equals(toDateStr)){
			toDateStr = fromDateStr + " 23:59:59";
			strBuf.append(" AND o1.PURCHASE_DATE <= str_to_date('"+toDateStr+"','%Y-%m-%d %H:%i:%s')");
		}

		Query query = entityManager.createNativeQuery(strBuf.toString(), OrderInfo.class);

		if(query.getResultList().isEmpty()){
			return null;
		}
		return (List<OrderInfo>)query.getResultList();
	}

//	@Override
//	public List<OrderInfo> getOrderListBySearchCriteria(SearchCriteria searchCriteria) {
//
//		StringBuffer sqlBuf = new StringBuffer();
//		sqlBuf.append("select o.* from tb_trade_order o, tb_txn_rel rel, tb_product p where o.express_no = rel.express_no and rel.prod_no = p.prod_no ");
//		if(StringUtils.isNotBlank(searchCriteria.getExpressNO())){
//			sqlBuf.append(" and o.express_no = '"+searchCriteria.getExpressNO().trim()+"'");
//		}
//		if(StringUtils.isNotBlank(searchCriteria.getCustomerName())){
//			sqlBuf.append(" and o.customer_name = '"+searchCriteria.getCustomerName().trim()+"'");
//		}
//		if(StringUtils.isNotBlank(searchCriteria.getCustomerContactNO())){
//			if(StringUtils.isNotBlank(searchCriteria.getCustomerContactType())){
//				if("QQ".equals(searchCriteria.getCustomerContactType())){
//					sqlBuf.append(" and o.CUSTOMER_QQ = '"+searchCriteria.getCustomerContactNO().trim()+"'");
//				}else if("WW".equals(searchCriteria.getCustomerContactType())){
//					sqlBuf.append(" and o.CUSTOMER_WW = '"+searchCriteria.getCustomerContactNO().trim()+"'");
//				}else if("MP".equals(searchCriteria.getCustomerContactType())){
//					sqlBuf.append(" and o.CUSTOMER_CONTACT_NO = '"+searchCriteria.getCustomerContactNO().trim()+"'");
//				}else{
//					sqlBuf.append(" and (");
//					sqlBuf.append("o.CUSTOMER_QQ = '"+searchCriteria.getCustomerContactNO().trim()+"'");
//					sqlBuf.append("or o.CUSTOMER_WW = '"+searchCriteria.getCustomerContactNO().trim()+"'");
//					sqlBuf.append("or o.CUSTOMER_CONTACT_NO = '"+searchCriteria.getCustomerContactNO().trim()+"'");
//					sqlBuf.append(")");
//				}
//			}else{
//				sqlBuf.append(" and (");
//				sqlBuf.append("o.CUSTOMER_QQ = '"+searchCriteria.getCustomerContactNO().trim()+"'");
//				sqlBuf.append(" or o.CUSTOMER_WW = '"+searchCriteria.getCustomerContactNO().trim()+"'");
//				sqlBuf.append(" or o.CUSTOMER_CONTACT_NO = '"+searchCriteria.getCustomerContactNO().trim()+"'");
//				sqlBuf.append(")");
//			}
//		}
//
//		if(StringUtils.isNotBlank(searchCriteria.getShopingDateFromStr())){
//			String fromDateStr = searchCriteria.getShopingDateFromStr().trim();
//			fromDateStr = fromDateStr +" 00:00:00";
//			sqlBuf.append(" AND o.PURCHASE_DATE >= str_to_date('"+fromDateStr+"','%Y-%m-%d %H:%i:%s')");
//		}
//		if(StringUtils.isNotBlank(searchCriteria.getShopingDateToStr())){
//			String toDateStr = searchCriteria.getShopingDateToStr().trim();
//			toDateStr = toDateStr +" 23:59:59";
//			sqlBuf.append(" AND o.PURCHASE_DATE <= str_to_date('"+toDateStr+"','%Y-%m-%d %H:%i:%s')");
//		}
//		if(StringUtils.isNotBlank(searchCriteria.getPayType())){
//			sqlBuf.append(" and o.PAYMENT_TYPE = '"+searchCriteria.getPayType().trim()+"'");
//		}
//		if(StringUtils.isNotBlank(searchCriteria.getExpressStatus())){
//			sqlBuf.append(" and o.EXPRESS_STATUS = '"+searchCriteria.getExpressStatus().trim()+"'");
//		}
//
//		if(StringUtils.isNotBlank(searchCriteria.getProductNO())){
//			sqlBuf.append(" and p.prod_no = '"+searchCriteria.getProductNO().trim()+"'");
//		}
//		if(StringUtils.isNotBlank(searchCriteria.getProductName())){
//			sqlBuf.append(" and o.prod_name = '"+searchCriteria.getProductName().trim()+"'");
//		}
//
//		sqlBuf.append(" order by o.purchase_date desc");
//
//		Query query = entityManager.createNativeQuery(sqlBuf.toString(), OrderInfo.class);
//		if(query.getResultList().isEmpty()){
//			return null;
//		}
//		return (List<OrderInfo>)query.getResultList();
//	}

	@Override
	@Transactional
	public void update(OrderInfo orderInfo) {

//		if(!entityManager.contains(orderInfo)){
			entityManager.merge(orderInfo);
			entityManager.flush();
//		}else{
//			entityManager.merge(orderInfo);
//			entityManager.flush();
//		}
	}

	@Override
	//unused
	public Page<OrderInfo> getOrderPageListBySearchCriteria(SearchCriteria searchCriteria, Pageable page) {
		// remove the cache.
		//HibernateUtil.clearLevel2Cache(entityManager.getEntityManagerFactory());

		StringBuffer sqlBuf = new StringBuffer();
		sqlBuf.append("select distinct o.* from tb_trade_order o left join  tb_txn_rel rel on o.express_no = rel.express_no left join  tb_product p on rel.prod_no = p.prod_no where 1=1 ");
		if(StringUtils.isNotBlank(searchCriteria.getExpressNO())){
			sqlBuf.append(" and o.express_no = '"+searchCriteria.getExpressNO().trim()+"'");
		}
		if(StringUtils.isNotBlank(searchCriteria.getCustomerName())){
			sqlBuf.append(" and o.customer_name = '"+searchCriteria.getCustomerName().trim()+"'");
		}
		if(StringUtils.isNotBlank(searchCriteria.getCustomerContactNO())){
			if(StringUtils.isNotBlank(searchCriteria.getCustomerContactType())){
				if("QQ".equals(searchCriteria.getCustomerContactType())){
					sqlBuf.append(" and o.CUSTOMER_QQ = '"+searchCriteria.getCustomerContactNO().trim()+"'");
				}else if("WW".equals(searchCriteria.getCustomerContactType())){
					sqlBuf.append(" and o.CUSTOMER_WW = '"+searchCriteria.getCustomerContactNO().trim()+"'");
				}else if("MP".equals(searchCriteria.getCustomerContactType())){
					sqlBuf.append(" and o.CUSTOMER_CONTACT_NO = '"+searchCriteria.getCustomerContactNO().trim()+"'");
				}else{
					sqlBuf.append(" and (");
					sqlBuf.append("o.CUSTOMER_QQ = '"+searchCriteria.getCustomerContactNO().trim()+"'");
					sqlBuf.append("or o.CUSTOMER_WW = '"+searchCriteria.getCustomerContactNO().trim()+"'");
					sqlBuf.append("or o.CUSTOMER_CONTACT_NO = '"+searchCriteria.getCustomerContactNO().trim()+"'");
					sqlBuf.append(")");
				}
			}else{
				sqlBuf.append(" and (");
				sqlBuf.append("o.CUSTOMER_QQ = '"+searchCriteria.getCustomerContactNO().trim()+"'");
				sqlBuf.append(" or o.CUSTOMER_WW = '"+searchCriteria.getCustomerContactNO().trim()+"'");
				sqlBuf.append(" or o.CUSTOMER_CONTACT_NO = '"+searchCriteria.getCustomerContactNO().trim()+"'");
				sqlBuf.append(")");
			}
		}

		if(StringUtils.isNotBlank(searchCriteria.getShopingDateFromStr())){
			String fromDateStr = searchCriteria.getShopingDateFromStr().trim();
			fromDateStr = fromDateStr +" 00:00:00";
			sqlBuf.append(" AND o.PURCHASE_DATE >= str_to_date('"+fromDateStr+"','%Y-%m-%d %H:%i:%s')");
		}
		if(StringUtils.isNotBlank(searchCriteria.getShopingDateToStr())){
			String toDateStr = searchCriteria.getShopingDateToStr().trim();
			toDateStr = toDateStr +" 23:59:59";
			sqlBuf.append(" AND o.PURCHASE_DATE <= str_to_date('"+toDateStr+"','%Y-%m-%d %H:%i:%s')");
		}
		if(StringUtils.isNotBlank(searchCriteria.getPayType())){
			sqlBuf.append(" and o.PAYMENT_TYPE = '"+searchCriteria.getPayType().trim()+"'");
		}
		if(StringUtils.isNotBlank(searchCriteria.getExpressStatus())){
			sqlBuf.append(" and o.EXPRESS_STATUS = '"+searchCriteria.getExpressStatus().trim()+"'");
		}

		if(StringUtils.isNotBlank(searchCriteria.getProductNO())){
			sqlBuf.append(" and p.prod_no = '"+searchCriteria.getProductNO().trim()+"'");
		}
		if(StringUtils.isNotBlank(searchCriteria.getProductName())){
			sqlBuf.append(" and o.prod_name = '"+searchCriteria.getProductName().trim()+"'");
		}

		sqlBuf.append(" order by o.purchase_date desc");

//		HibernateUtil.clearLevel1Cache(entityManager);
//		HibernateUtil.clearLevel2Cache(entityManager.getEntityManagerFactory());

		Query query = entityManager.createNativeQuery(sqlBuf.toString(), OrderInfo.class);
		entityManager.setFlushMode(FlushModeType.COMMIT);
		if(query.getResultList().isEmpty()){
			return null;
		}

		return null;
//		PageRequest request =
//				new PageRequest(page.getPageNumber() - 1, page.getPageSize(), page.getSort().toString(), page.getSort());
//		return deploymentRepo.findAll(pageRequest);
	}

	@Override
	public List<OrderInfo> getOrderListBySearchCriteria(SearchCriteria searchCriteria, Map<String, Object> pageMap) {

//		HibernateUtil.clearLevel2Cache(entityManager);
//		HibernateUtil.clearLevel2Cache(entityManager.getEntityManagerFactory());

		StringBuffer sqlBuf = new StringBuffer();
		sqlBuf.append("select distinct o.* from tb_trade_order o left join  tb_txn_rel rel on o.express_no = rel.express_no left join  tb_product p on rel.prod_no = p.prod_no where 1=1 ");

		if(searchCriteria != null){

			if(StringUtils.isNotBlank(searchCriteria.getExpressNO())){
				sqlBuf.append(" and o.express_no = '"+searchCriteria.getExpressNO().trim()+"'");
			}
			if(StringUtils.isNotBlank(searchCriteria.getCustomerQQ())){
				sqlBuf.append(" and o.customer_name = '"+searchCriteria.getCustomerQQ().trim()+"'");
			}
			if(StringUtils.isNotBlank(searchCriteria.getCustomerWW())){
				sqlBuf.append(" and o.customer_name = '"+searchCriteria.getCustomerWW().trim()+"'");
			}

			if(StringUtils.isNotBlank(searchCriteria.getShopingDateFromStr())){
				String fromDateStr = searchCriteria.getShopingDateFromStr().trim();
				fromDateStr = fromDateStr +" 00:00:00";
				sqlBuf.append(" AND o.PURCHASE_DATE >= str_to_date('"+fromDateStr+"','%Y-%m-%d %H:%i:%s')");
			}
			if(StringUtils.isNotBlank(searchCriteria.getShopingDateToStr())){
				String toDateStr = searchCriteria.getShopingDateToStr().trim();
				toDateStr = toDateStr +" 23:59:59";
				sqlBuf.append(" AND o.PURCHASE_DATE <= str_to_date('"+toDateStr+"','%Y-%m-%d %H:%i:%s')");
			}

			if(StringUtils.isNotBlank(searchCriteria.getProductNO())){
				sqlBuf.append(" and p.prod_no = '"+searchCriteria.getProductNO().trim()+"'");
			}
			if(StringUtils.isNotBlank(searchCriteria.getProductName())){
				sqlBuf.append(" and o.prod_name = '"+searchCriteria.getProductName().trim()+"'");
			}
		}

		sqlBuf.append(" order by o.purchase_date desc");

		if(pageMap!=null && pageMap.keySet().size()>0){
			if(StringUtils.isNotEmpty(String.valueOf(pageMap.get("startIndex")))
					&& StringUtils.isNotEmpty(String.valueOf(pageMap.get("pageSize")))
					&& StringUtils.isNotEmpty(String.valueOf( pageMap.get("totalCount")))) {

				Integer startIndex = Integer.valueOf(String.valueOf(pageMap.get("startIndex")));
				Integer pageSize =  Integer.valueOf(String.valueOf(pageMap.get("pageSize")));
				Integer totalCount = Integer.valueOf(String.valueOf(pageMap.get("totalCount")));

				if (startIndex + pageSize > totalCount) {
					pageSize = totalCount;// 超出总数,设置偏移量为最后一个数, 即 默认到最后
				}
				// Mysql分页
				sqlBuf.append(" LIMIT " + startIndex + "," + pageSize);
			}
		}
		HibernateUtil.clearLevel1Cache(entityManager);
//		HibernateUtil.clearLevel2Cache(entityManager.getEntityManagerFactory());
		Query query = entityManager.createNativeQuery(sqlBuf.toString(), OrderInfo.class);
		if(query.getResultList().isEmpty()){
			return null;
		}
		return (List<OrderInfo>)query.getResultList();
	}

	@Override
	public List<OrderInfo> getOrderListBySearchCriteriaforDaofu(
			SearchCriteria searchCriteria, Map<String, Object> pageMap) {
		StringBuffer sql = new StringBuffer();
		 sql.append("select distinct o.* from tb_trade_order o, tb_txn_rel rel, tb_product p where o.EXPRESS_NO = rel.EXPRESS_NO and rel.prod_no = p.prod_no ");
		 if(searchCriteria!=null){
			 //productName
			 if(DateUtil.isNotEmpty(searchCriteria.getExpressNO())){
				 sql.append(" and o.EXPRESS_NO = '"+searchCriteria.getExpressNO()+"'");
			 }
			 if(DateUtil.isNotEmpty(searchCriteria.getCustomerQQ())){
				 sql.append(" and o.CUSTOMER_QQ = '"+searchCriteria.getCustomerQQ()+"'");
			 }
			 if(DateUtil.isNotEmpty(searchCriteria.getCustomerWW())){
				 sql.append(" and o.CUSTOMER_WW = '"+searchCriteria.getCustomerWW()+"'");
			 }
			 
			 if(DateUtil.isNotEmpty(searchCriteria.getShopingDateFromStr())){
				String fromDateStr = searchCriteria.getShopingDateFromStr().trim();
				fromDateStr = fromDateStr +" 00:00:00";
				sql.append(" AND o.PURCHASE_DATE >= str_to_date('"+fromDateStr+"','%Y-%m-%d %H:%i:%s')");
			 }
			 if(DateUtil.isNotEmpty(searchCriteria.getShopingDateToStr())){
				String toDateStr = searchCriteria.getShopingDateToStr().trim();
				toDateStr = toDateStr +" 23:59:59";
				sql.append(" AND o.PURCHASE_DATE <= str_to_date('"+toDateStr+"','%Y-%m-%d %H:%i:%s')");
			 }
		  }
		 sql.append(" AND o.PAYMENT_TYPE = 'DF' order by o.PURCHASE_DATE desc");
		 
		 if(pageMap!=null){
			if(StringUtils.isNotEmpty(String.valueOf(pageMap.get("startIndex")))
					&& StringUtils.isNotEmpty(String.valueOf(pageMap.get("pageSize")))
					&& StringUtils.isNotEmpty(String.valueOf( pageMap.get("totalCount")))) {

				Integer startIndex = Integer.valueOf(String.valueOf(pageMap.get("startIndex")));
				Integer pageSize =  Integer.valueOf(String.valueOf(pageMap.get("pageSize")));
				Integer totalCount = Integer.valueOf(String.valueOf(pageMap.get("totalCount")));

				if (startIndex + pageSize > totalCount) {
					pageSize = totalCount;// 超出总数,设置偏移量为最后一个数, 即 默认到最后
				}
				// Mysql分页
				sql.append(" LIMIT " + startIndex + "," + pageSize);
			}
		 }
		 
		 Query query = entityManager.createNativeQuery(sql.toString(),OrderInfo.class);
		 if(query.getResultList().isEmpty()){
			 return null;  
		 }else{
			 return (List<OrderInfo>)query.getResultList();
		 }
	}
}
