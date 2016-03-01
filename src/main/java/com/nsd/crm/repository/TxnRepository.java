package com.nsd.crm.repository;

import com.nsd.crm.entry.TxnRel;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TxnRepository {

    public TxnRel save(TxnRel txn);
    public void deleteTxnByID(int txnID);
    public void deleteTxnByExpressNO(String expressNO);
    public void updateTxn(TxnRel txn);
    public TxnRel getTxnByID(int txnID);


    public List<TxnRel> getTxnListByExpressNO(String expressNO, String deleteIndicator);

    TxnRel getTxnByExpressNOAndProdNO(String expressNO, String prodNO);


}