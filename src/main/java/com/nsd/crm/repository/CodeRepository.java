package com.nsd.crm.repository;

import com.nsd.crm.entry.common.MyCode;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface CodeRepository {

   MyCode findCodeByCodeTypIDAndCodeID(String codeTypeID, String codeID);

   List<MyCode> findCodeListByCodeTypID(String codeTypeID);

   void saveCode(MyCode code);

   void deleteCodeByCodeTypeID(String codeTypeID);

   void deleteCodeByCodeTypeIDAndCodeID(String codeTypeID, String codeID);

}