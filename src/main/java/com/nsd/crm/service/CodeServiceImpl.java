package com.nsd.crm.service;

import com.nsd.crm.entry.common.MyCode;
import com.nsd.crm.repository.CodeRepository;
import com.nsd.crm.service.web.CodeService;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class CodeServiceImpl implements CodeService {

    private final static Logger LOGGER = LoggerFactory.getLogger(CodeServiceImpl.class);

    @Autowired
    private CodeRepository codeRepository;

    public void setCodeRepository(CodeRepository codeRepository) {
        this.codeRepository = codeRepository;
    }

    @Override
    public MyCode findCodeByCodeTypIDAndCodeID(String codeTypeID, String codeID) {
        return codeRepository.findCodeByCodeTypIDAndCodeID(codeTypeID, codeID);
    }

    @Override
    public List<MyCode> findCodeListByCodeTypID(String codeTypeID) {
        return codeRepository.findCodeListByCodeTypID(codeTypeID);
    }

    @Override
    public Map<String, MyCode> findCodeMappingByCodeTypID(String codeTypeID) {
        List<MyCode> myCodeList = this.findCodeListByCodeTypID(codeTypeID);
        if(myCodeList==null){
            return null;
        }
        Map<String, MyCode> codeMapping = new HashMap<String, MyCode>();

        for(MyCode code : myCodeList){
            codeMapping.put(code.getCodeID(), code);
        }
        return codeMapping;
    }

    @Override
    @Transactional
    public boolean saveCode(MyCode code) {
        try {
            if (code == null || StringUtils.isEmpty(code.getCodeTypeID()) || StringUtils.isEmpty(code.getCodeTypeID())) {
                LOGGER.debug("Cannot save empty code info. One(or more) of code/codeTypeID/codeID is empty.");
                return false;
            }
            MyCode existedCode = this.findCodeByCodeTypIDAndCodeID(code.getCodeTypeID(), code.getCodeID());
            if (existedCode != null) {
                LOGGER.debug("The code mapping existed in DB already.");
                return false;
            }
            codeRepository.saveCode(code);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            return false;
        }
        return true;
    }

    @Override
    @Transactional
    public boolean deleteCodeByCodeTypeID(String codeTypeID) {
        try {
            codeRepository.deleteCodeByCodeTypeID(codeTypeID);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            return false;
        }
        return true;
    }

    @Override
    @Transactional
    public boolean deleteCodeByCodeTypeIDAndCodeID(String codeTypeID, String codeID) {
        try {
            codeRepository.deleteCodeByCodeTypeIDAndCodeID(codeTypeID, codeID);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            return false;
        }
        return true;
    }
}