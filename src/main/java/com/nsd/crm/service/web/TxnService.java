package com.nsd.crm.service.web;

import com.nsd.crm.entry.TxnRel;

import java.util.List;

public interface TxnService {

    public TxnRel save(TxnRel txn);

    public void updateTxn(TxnRel txn);

    void deleteTxn(TxnRel txn);

    public TxnRel getTxnByID(int txnID);

    public TxnRel getTxnByExpressNOAndProdNO(String expressNO, String prodNO);

    public boolean isExistTxnByExpressNOAndProdNO(String expressNO, String prodNO);

    /**
     * only include active txn records which del_ind='N'
     */
    public List<TxnRel> getTxnListByExpressNO(String expressNO);

    /**
     * include all
     */
    public List<TxnRel> getAllTxnListByExpressNO(String expressNO);

    void deleteTxnListByExpressNO(String expressNO);

    void saveTxnList(List<TxnRel> txnList);

}

