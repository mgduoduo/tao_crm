package com.nsd.crm.service;

import com.nsd.crm.common.SearchCriteria;
import com.nsd.crm.common.constant.CommonConstant;
import com.nsd.crm.entry.Product;
import com.nsd.crm.repository.ProdRepository;
import com.nsd.crm.service.web.ProdService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Component
public class ProdServiceImpl implements ProdService {

	private final static Logger LOGGER = LoggerFactory.getLogger(ProdServiceImpl.class);

	@Autowired
	private ProdRepository prodRepository;
	
	public void setProdRepository(ProdRepository prodRepository){
		this.prodRepository = prodRepository;
	}

	@Override
	@Transactional
	public Product save(Product product) {
		return prodRepository.save(product);
	}

	@Override
	@Transactional
	public void deleteProductByID(int prodID) {
		prodRepository.deleteProductByID(prodID);
	}

	@Override
	@Transactional
	public void updateProduct(Product product) {
		prodRepository.updateProduct(product);
	}

	@Override
	public Product getProductByID(int prodID) {
		return prodRepository.findOne(prodID);
	}

	@Override
	public Product getProductByProdNO(String prodNO) {
		return prodRepository.getProductByProdNO(prodNO);
	}

	@Override
	public List<Product> getAllProductList() {
		return prodRepository.findAll();
	}

	@Override
	public Integer getCountOfProdListBySearchCriteria(SearchCriteria searchCriteria) {
		List<Product> prodList = this.getProdListBySearchCriteria(searchCriteria);
		return prodList==null||prodList.isEmpty()?0:prodList.size();
	}

	@Override
	public List<Product> getProdListBySearchCriteria(SearchCriteria searchCriteria) {
		return this.getProdListBySearchCriteria(searchCriteria, null);
	}

	@Override
	public List<Product> getProdListBySearchCriteria(SearchCriteria searchCriteria, Map<String, Object> pageMap) {
		return prodRepository.getProdListBySearchCriteria(searchCriteria, pageMap);
	}

	@Override
	@Transactional
	public void updateTotalBackupCountOfProduct(String prodNO, int currCount, int originalCount) {
		//re-calculate the new total count of backup count of the product.
		Product prod = this.getProductByProdNO(prodNO);

		if(prod!=null){
			int backupCount = prod.getBackupCount()==null?0:prod.getBackupCount();
			if(originalCount > currCount){
				prod.setBackupCount(backupCount + originalCount - currCount);
			}else if(currCount > originalCount){
				prod.setBackupCount( (backupCount + originalCount > currCount) ? (backupCount + originalCount - currCount) : 0);
			}
			this.updateProduct(prod);
		}
	}

}