package com.nsd.crm.service.web;

import com.nsd.crm.common.SearchCriteria;
import com.nsd.crm.entry.OrderInfo;
import com.nsd.crm.entry.Product;

import java.util.List;
import java.util.Map;

public interface ProdService {

	public Product save(Product product);
	public void deleteProductByID(int prodID);
	public void updateProduct(Product product);
	public Product getProductByID(int prodID);
	public Product getProductByProdNO(String prodNO);
	public List<Product> getAllProductList();

	public Integer getCountOfProdListBySearchCriteria(SearchCriteria searchCriteria);
	public List<Product> getProdListBySearchCriteria(SearchCriteria searchCriteria);
	public List<Product> getProdListBySearchCriteria(SearchCriteria searchCriteria, Map<String, Object> pageMap);

	public void updateTotalBackupCountOfProduct(String prodNO, int currCount, int originalCount) ;
}

