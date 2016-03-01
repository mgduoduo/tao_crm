package com.nsd.crm.common.tag;

import com.nsd.crm.service.web.CodeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import javax.servlet.jsp.tagext.TagSupport;
import java.util.Map;

/**
 * Created by gaoqiang on 31/1/2015.
 */

public class BaseTag extends TagSupport {

    private final static Logger LOGGER = LoggerFactory.getLogger(BaseTag.class);

    private static BaseTag instance;

    public BaseTag(){
        if(codeService == null){
            //注入service
            ApplicationContext applicationContext = new ClassPathXmlApplicationContext("/spring.xml");
            Map<String, Object> oMap =  (Map) applicationContext.getBeansOfType(CodeService.class);
            codeService = (CodeService)oMap.get("codeServiceImpl");
        }
    }

    private static BaseTag getInstance(){
        if(instance==null){
            instance = new BaseTag();
        }
        return instance;
    }

    public CodeService codeService;

    public void setCodeService(CodeService codeService) {
        this.codeService = codeService;
    }

    public CodeService getCodeService() {
        BaseTag.getInstance();//初始化
        return codeService;
    }

}
