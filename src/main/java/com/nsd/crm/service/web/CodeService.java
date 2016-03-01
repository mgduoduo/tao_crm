package com.nsd.crm.service.web;

import com.nsd.crm.entry.common.MyCode;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface CodeService {

	public MyCode findCodeByCodeTypIDAndCodeID(String codeTypeID, String codeID);
	public List<MyCode> findCodeListByCodeTypID(String codeTypeID);
	public Map<String, MyCode> findCodeMappingByCodeTypID(String codeTypeID);

	public boolean saveCode(MyCode code);
	public boolean deleteCodeByCodeTypeID(String codeTypeID);
	public boolean deleteCodeByCodeTypeIDAndCodeID(String codeTypeID, String codeID);

}

