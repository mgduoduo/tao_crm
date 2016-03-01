package com.nsd.crm.repository;

import com.nsd.crm.common.SearchCriteria;
import com.nsd.crm.entry.Product;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface ProdRepository {


    public Product save(Product product);

    public void deleteProductByID(int prodID);

    public void updateProduct(Product product);

    public Product getProductByProdNO(String prodNO);

    public Product findOne(int prodID);

    public List<Product> findAll();

    List<Product> getProdListBySearchCriteria(SearchCriteria searchCriteria, Map<String, Object> pageMap);
}