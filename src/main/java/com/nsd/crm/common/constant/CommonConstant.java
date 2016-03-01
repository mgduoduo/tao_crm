package com.nsd.crm.common.constant;

/**
 * Created by gaoqiang on 30/1/2015.
 */
public class CommonConstant {
    public final static String CONTEXT_NAME = "/tao-crm";

    public final static String USER_SESSION_OBJECT = "userSession";

    public final static String DEFAULT_TOKEN_NAME = "easyShop-token";
    public final static String TOKEN_VALUE = "value-token";
  /*  public static void main(String[] args){
        String s ="TAo-crM";
        System.out.println(s.indexOf(CONTEXT_NAME));
    }*/

    public final static String COMMON_BOOLEAN_N = "N";
    public final static String COMMON_BOOLEAN_Y = "Y";

    public final static String CODE_CONTACT_TP = "CONTACT_TP";
    public final static String CODE_EXPRESS_COMPANY = "EXPRESS_COMPANY";
    public final static String CODE_EXPRESS_STATUS = "EXPRESS_STATUS";
    public final static String CODE_PAY_TP = "PAY_TP";
    public final static String CODE_CMN_YES_NO = "CMN_YES_NO";
    public final static String CODE_CMN_YES_NO_NA = "CMN_YES_NO_NA";

    public static final String OUTPUT_FILE_NAME = "test_output";
    public static final String OUTPUT_FILE_TYPE_EXCEL = ".xls";
    public static final String OUTPUT_FILE_TYPE_TXT = ".txt";


    public static final String[] ORDER_INFO_HEADER_ARR = {"序号","订单号","付款方式","订单状态"
            ,"总价","客户QQ","客户WW","购买时间","收货人姓名","收货人地址","联系方式"
            ,"快递公司","快递费用"};

    public static final String[] PRODUCT_DETAIL_HEADER_ARR = {"序号","订单号","产品型号","产品名称"
            ,"购买数量","库存数量"};

    public final static int EXL_HEADER_IDX = 0;
    public final static int EXL_BODY_IDX = 1;


}
