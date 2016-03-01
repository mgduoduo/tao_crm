package com.nsd.crm.repository;

import com.nsd.crm.common.SearchCriteria;
import com.nsd.crm.common.constant.CommonConstant;
import com.nsd.crm.common.util.DateUtil;
import com.nsd.crm.common.util.MD5Util;
import com.nsd.crm.entry.OrderInfo;
import com.nsd.crm.entry.Product;
import com.nsd.crm.entry.TxnRel;
import com.nsd.crm.entry.common.MyCode;
import com.nsd.crm.entry.common.User;
import com.nsd.crm.service.web.*;
import jxl.Workbook;
import jxl.WorkbookSettings;
import jxl.read.biff.BiffException;
import jxl.write.*;
import jxl.write.Number;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Random;

public class TestCustomerRepository {

	static ApplicationContext context;
	private ProdService prodService ;
	private TxnService txnService ;
	private OrderService orderService;
	private UserService userService;
	private CodeService codeService;
	@Before
	public void setUp() throws Exception {
		context = new ClassPathXmlApplicationContext("spring-test.xml");
		prodService = context.getBean(ProdService.class);
		txnService = context.getBean(TxnService.class);
		orderService = context.getBean(OrderService.class);
		userService = context.getBean(UserService.class);
		codeService = context.getBean(CodeService.class);
	}


	public void testCode(){
		MyCode code = new MyCode();
		code.setCodeID("code_01");
		code.setCodeTypeID("codeType_01");
		code.setCodeDesc("this is the code 01");
		codeService.saveCode(code);

		MyCode myCode = codeService.findCodeByCodeTypIDAndCodeID("codeType_01", "code_01");
		if(myCode != null){
			System.out.println("~~"+myCode.getCodeDesc());
		}
	}

	@Test
	public void testUser(){
		User user = new User();
		user.setUsername("abc");
		user.setPassword(MD5Util.parseStrToMd5L32(MD5Util.parseStrToMd5L32("abc")));
		userService.saveUser(user);
		System.out.println("pp="+user.getPassword());
	}



	public void testInsertTxn(){
	String expressNO = "Express03";
	String productNO = "Product01";
		OrderInfo orderInfo = orderService.getOrderInfoByExpressNO(expressNO);

		orderInfo.setCustomerQQ("QQQQQQQQQQQ");

		List<TxnRel> txnRelList = orderInfo.getTxnList();
//		System.out.println(txnRelList==null?0:txnRelList.size());

		TxnRel txnRel = new TxnRel();
		txnRel.setRefExpressNO(expressNO);
		txnRel.setRefProdNO(productNO);
		txnRel.setPurchaseCount(323);
		txnRel.setDeleteIndicator("N");

//		Product product = prodService.getProductByProdNO(txnRel.getRefProdNO());
//		txnRel.setProduct(product);
	 	txnService.save(txnRel);


		if(txnRelList.size()>0 && !txnRelList.isEmpty()){
			txnRelList.add(txnRel);
		}
		orderService.update(orderInfo);
	}

	public void testQuery(){

//		List<Product> productList = prodService.getAllProductList();
//		System.out.println("productList~~"+(productList!=null?productList.size():0));
//
//		List<TxnRel> txnRelList = txnService.getAllTxnListByExpressNO("Express01");
//		System.out.println("txnRelList~~"+(txnRelList==null?0:txnRelList.size()));

		List<OrderInfo> orderInfoList = orderService.getAllOrderList();
		System.out.println("orderInfoList~~"+(orderInfoList!=null?orderInfoList.size():0));
		if(orderInfoList!=null)
		System.out.println("orderInfoList.getTxnList~~"+(orderInfoList.get(0).getTxnList()!=null?orderInfoList.get(0).getTxnList().size():0));

		if(orderInfoList!=null && orderInfoList.get(0).getTxnList()!=null){
			System.out.println("orderInfoList.getTxnList.getProduct~~"+(orderInfoList.get(0).getTxnList().get(0).getProduct()!=null?orderInfoList.get(0).getTxnList().get(0).getProduct().getProdName():0));
		}

	}

	String[] orderInfoHeaderArr = {"序号","订单号","付款方式","订单状态"
			,"总价","客户QQ","客户WW","购买时间","收货人姓名","收货人地址","联系方式"
			,"快递公司","快递费用"};

	String[] productDetailHeaderArr = {"序号","订单号","产品型号","产品名称"
			,"购买数量","库存数量"};


	public void testGenerateFile() throws IOException, WriteException, BiffException {
//		List<OrderInfo> orderInfoList = orderService.getAllOrderList();
		SearchCriteria searchCriteria = new SearchCriteria();
		searchCriteria.setExpressNO("Express01");
		List<OrderInfo> orderInfoList = orderService.getOrderListBySearchCriteria(searchCriteria);
		List<Product> productCodeList = prodService.getAllProductList();
		Map<String, MyCode> contactTypeCodeList = codeService.findCodeMappingByCodeTypID(CommonConstant.CODE_CONTACT_TP);
		Map<String, MyCode> expressCompanyCodeList = codeService.findCodeMappingByCodeTypID(CommonConstant.CODE_EXPRESS_COMPANY);
		Map<String, MyCode> expressStatusCodeList = codeService.findCodeMappingByCodeTypID(CommonConstant.CODE_EXPRESS_STATUS);
		Map<String, MyCode> payTypeCodeList = codeService.findCodeMappingByCodeTypID(CommonConstant.CODE_PAY_TP);
		Map<String, MyCode> commonYesNOList = codeService.findCodeMappingByCodeTypID(CommonConstant.CODE_CMN_YES_NO);


		if(orderInfoList==null || orderInfoList.isEmpty()){
			return ;
		}

		WritableWorkbook wworkbook = null;
		File file = new File("D:\\myapp\\output3.xls");
		if(file.exists()){
			file.delete();
		}
		WorkbookSettings wbSettings = new WorkbookSettings();

		wbSettings.setLocale(new Locale("cn", "CN"));
		wworkbook = Workbook.createWorkbook(file, wbSettings);
		WritableSheet wsheet = wworkbook.createSheet("First Sheet", 0);

		// header
		for(int k=0; k < orderInfoHeaderArr.length; k++){
			Label label = new Label(k, 0, orderInfoHeaderArr[k]);
			wsheet.addCell(label);
		}


		// orderInfo body
		for(int i=0; i<orderInfoList.size(); i++){
			OrderInfo orderInfo = orderInfoList.get(i);
			int j=0;

			wsheet.addCell(new Number(j++, i+1, i+1));
			wsheet.addCell(new Label(j++, i+1, orderInfo.getExpressNO()));
			wsheet.addCell(new Label(j++, i+1, payTypeCodeList.get(orderInfo.getPayType())==null?"":payTypeCodeList.get(orderInfo.getPayType()).getCodeDesc()));
			wsheet.addCell(new Label(j++, i+1, expressStatusCodeList.get(orderInfo.getExpressStatus())==null?"":expressStatusCodeList.get(orderInfo.getExpressStatus()).getCodeDesc()));
			wsheet.addCell(new Number(j++, i+1, orderInfo.getTotalPrice()==null?0:orderInfo.getTotalPrice()));
			wsheet.addCell(new Label(j++, i+1, orderInfo.getCustomerQQ()));
			wsheet.addCell(new Label(j++, i+1, orderInfo.getCustomerWW()));
			wsheet.addCell(new Label(j++, i+1, orderInfo.getShopingDateStr()));
			wsheet.addCell(new Label(j++, i+1, orderInfo.getCustomerName()));
			wsheet.addCell(new Label(j++, i+1, orderInfo.getReceiveAdd()));
			wsheet.addCell(new Label(j++, i+1, orderInfo.getCustomerPhoneNO()));
			wsheet.addCell(new Label(j++, i+1, expressCompanyCodeList.get(orderInfo.getExpressCompany())==null?"":expressCompanyCodeList.get(orderInfo.getExpressCompany()).getCodeDesc()));
			wsheet.addCell(new Number(j++, i+1, orderInfo.getExpressCharge()==null?0:orderInfo.getExpressCharge()));

//			String[] headerArr = {"序号","订单号","付款方式","订单状态"
//					,"总价","客户QQ","客户WW","购买时间","收货人姓名","收货人地址","联系方式"
//					,"快递公司","快递费用"};
		}

//		wsheet.addCell(new Label(0, 6, "总和"));
//		StringBuffer buf = new StringBuffer();
//		buf.append("SUM(B1:B5)");
//		Formula f = new Formula(1, 6, buf.toString());
//		wsheet.addCell(f);
//
//		Number number = new Number(3,4,3.1459);
//		wsheet.addCell(number);

		WritableSheet wsheet2 = wworkbook.createSheet("Second Sheet", 1);
		for(int k=0; k < productDetailHeaderArr.length; k++){
			Label label = new Label(k, 0, productDetailHeaderArr[k]);
			wsheet2.addCell(label);
		}


		for(int i=0; i<orderInfoList.size(); i++){
			List<TxnRel> txnRelList = orderInfoList.get(i).getTxnList();
			if(txnRelList!=null && !txnRelList.isEmpty()){
				for(int row=0; row<txnRelList.size(); row++){
					TxnRel txnRel = txnRelList.get(row);
					int j=0;
//					String[] productDetailHeaderArr = {"序号","订单号","产品型号","产品名称"
//							,"购买数量","库存数量"};
					wsheet2.addCell(new Number(j++, row+1, row+1));
					wsheet2.addCell(new Label(j++, row+1, txnRel.getRefExpressNO()));
					wsheet2.addCell(new Label(j++, row+1, txnRel.getRefProdNO()));
					wsheet2.addCell(new Label(j++, row+1, txnRel.getProduct()==null?"":txnRel.getProduct().getProdName()));
					wsheet2.addCell(new Number(j++, row+1, txnRel.getPurchaseCount()));
					wsheet2.addCell(new Number(j++, row+1, txnRel.getProduct()==null?0:(txnRel.getProduct().getBackupCount()==null?0:txnRel.getProduct().getBackupCount())));
				}
			}
		}


		wworkbook.write();
		wworkbook.close();

//		Workbook workbook = Workbook.getWorkbook(new File("D:\\myapp\\output1.xls"));
//		Sheet sheet = workbook.getSheet(0);
//		Cell cell1 = sheet.getCell(0, 2);
//		System.out.println(cell1.getContents());
//		Cell cell2 = sheet.getCell(3, 4);
//		System.out.println(cell2.getContents());
//		workbook.close();
	}

	
	public void testInsertRecord(){
		for(int i=0; i< 5; i++){

			String expressNO = "Express0"+i;
			String productNO = "Product0"+i;
			// 1 insert test record
			Product product = new Product();
			product.setProdNo(productNO);
			product.setProdName("Prod name");

			Product product1 = prodService.getProductByProdNO(productNO);
			if(product1 != null){
				System.out.println(product1==null?"==== 1 ==== "+product1.getProdID()+","+product1.getProdName()+","+product1.getProdNo():"no product!");
			}else{
				product1 = prodService.save(product);
			}



			TxnRel txnRel = new TxnRel();
			txnRel.setRefExpressNO(expressNO);
			List<TxnRel> txnRelList = txnService.getTxnListByExpressNO(expressNO);
			if(txnRelList==null || txnRelList.isEmpty()){
				txnRel.setRefProdNO(productNO);
				txnRel.setPurchaseCount(new Random().nextInt(10));
				txnRel.setDeleteIndicator(CommonConstant.COMMON_BOOLEAN_N);
				txnRel.setProduct(product);

				txnService.save(txnRel);
			}


			txnRelList = txnService.getTxnListByExpressNO(expressNO);
			if(txnRelList!=null && !txnRelList.isEmpty()){
				TxnRel txnRel1 = txnRelList.get(0);
				//System.out.println(txnRel1==null?"==== 2 ==== "+txnRel1.getTxnID()+","+txnRel1.getRefExpressNO()+","+txnRel1.getRefProdNO():"no txnRel1!");
			}


			OrderInfo orderInfo = new OrderInfo();
			orderInfo.setExpressNO(expressNO);
			orderInfo.setTotalPrice(new Random().nextInt(1000));
			orderInfo.setPayType(i % 3 == 1 ? "C" : (i % 3 == 2 ? "A" : "B"));
			orderInfo.setExpressCompany(i % 3 == 1 ? "C" : (i % 3 == 2 ? "A" : "B"));
			orderInfo.setReceiveAdd("address receive");
			orderInfo.setCustomerName("customer name");
			orderInfo.setCustomerPhoneNO("phone no");
			orderInfo.setRefundIndicator(CommonConstant.COMMON_BOOLEAN_N);
			orderInfo.setExpressStatus(i%3==1?"C":(i%3==2?"A":"B"));
			orderInfo.setCustomerQQ("QQ"+new Random().nextInt(5));
			orderInfo.setCustomerWW("WW"+new Random().nextInt(5));
			try {
				orderInfo.setShopingDate(DateUtil.strToSqlDate("yyyyMMdd", "20121224"));
			} catch (ParseException e) {
				e.printStackTrace();
			}
			orderInfo.setTxnList(null);

			OrderInfo orderInfo2 = orderService.getOrderInfoByExpressNO(expressNO);
			if(orderInfo2==null){

				orderInfo2 = orderService.save(orderInfo);
			}

			//System.out.println(orderInfo2==null?"==== 0 ==== "+orderInfo2.getExpressNO()+","+orderInfo2.getCustomerPhoneNO()+","+orderInfo2.getCustomerName():"no orderInfo2!");


			OrderInfo orderInfo1 = orderService.getOrderInfoByExpressNO(expressNO);
			//System.out.println(orderInfo1==null?"==== 3 ==== "+orderInfo1.getTradeID()+","+orderInfo1.getExpressNO()+","+orderInfo1.getCustomerName():"no orderInfo1!");
		}

	}

}
