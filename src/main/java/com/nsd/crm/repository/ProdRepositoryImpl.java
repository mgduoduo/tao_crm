package com.nsd.crm.repository;

import com.nsd.crm.common.SearchCriteria;
import com.nsd.crm.entry.Product;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import java.util.List;
import java.util.Map;

@Repository
@Transactional
public class ProdRepositoryImpl implements ProdRepository {

    private final static Logger LOGGER = LoggerFactory.getLogger(ProdRepositoryImpl.class);

    @PersistenceContext(type = PersistenceContextType.EXTENDED)
    private EntityManager entityManager;

    public EntityManager getEntityManager() {
        return entityManager;
    }

    @Override
    @Transactional
    public Product save(Product entity) {
        entityManager.persist(entity);
        entityManager.flush();
        return entity; //with id
    }

    @Override
    public Product findOne(int prodID) {
        return entityManager.find(Product.class, prodID);
    }

    @Override
    public List<Product> findAll() {
        String sql = "select * from tb_product";
        Query query = entityManager.createNativeQuery(sql, Product.class);
        if (query.getResultList().isEmpty()) {
            return null;
        }
        return (List<Product>) query.getResultList();
    }

    @Override
    public List<Product> getProdListBySearchCriteria(SearchCriteria searchCriteria, Map<String, Object> pageMap) {
        StringBuffer sqlBuf = new StringBuffer("select p.* from tb_product p where 1=1");

        if(searchCriteria!=null){
            if(StringUtils.isNotBlank(searchCriteria.getProductNO())){
                sqlBuf.append(" and p.prod_no = '"+searchCriteria.getProductNO().trim()+"'");
            }

            if(StringUtils.isNotBlank(searchCriteria.getProductName())){
                sqlBuf.append(" and p.prod_name like '%"+searchCriteria.getProductName().trim()+"%'");
            }
        }

        sqlBuf.append(" order by p.backup_count desc, p.prod_name desc");

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

        Query query = entityManager.createNativeQuery(sqlBuf.toString(), Product.class);
        if(query.getResultList().isEmpty()){
            return null;
        }

        return (List<Product>)query.getResultList();
    }

    @Override
    @Transactional
    public void deleteProductByID(int prodID) {
        entityManager.createNativeQuery("delete from tb_product where prod_id=" + prodID).executeUpdate();
    }

    @Override
    @Transactional
    public void updateProduct(Product product) {
        entityManager.merge(product);
        entityManager.flush();
    }

    @Override
    public Product getProductByProdNO(String prodNO) {
        String sql = "SELECT p.* FROM TB_PRODUCT p WHERE p.PROD_NO=?1";
        Query query = entityManager.createNativeQuery(sql, Product.class)
                .setParameter(1, prodNO);

        if (query.getResultList().isEmpty()) {
            return null;
        }
        return (Product) query.getSingleResult();
    }

}
