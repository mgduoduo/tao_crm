package com.nsd.crm.service;

import com.nsd.crm.common.SearchCriteria;
import com.nsd.crm.common.constant.CommonConstant;
import com.nsd.crm.common.util.DateUtil;
import com.nsd.crm.common.util.FileUtil;
import com.nsd.crm.entry.OrderInfo;
import com.nsd.crm.entry.TxnRel;
import com.nsd.crm.entry.common.MyCode;
import com.nsd.crm.repository.OrderRepository;
import com.nsd.crm.service.web.CodeService;
import com.nsd.crm.service.web.OrderService;
import com.nsd.crm.service.web.TxnService;
import jxl.Workbook;
import jxl.WorkbookSettings;
import jxl.write.Label;
import jxl.write.Number;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileInputStream;
import java.util.*;

@Component
public class OrderServiceImpl implements OrderService {

	private final static Logger LOGGER = LoggerFactory.getLogger(OrderServiceImpl.class);

	private static final int MAX_PAGE_SIZE = 50;
	private static final String OUTPUT_FILE_NAME = "orderList";

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private TxnService txnService;

	@Autowired
	private CodeService codeService;

	@Override
	@Transactional
	public OrderInfo save(OrderInfo orderInfo) {

		OrderInfo orderInfo11 = this.getOrderInfoByExpressNO(orderInfo.getExpressNO());
		if(orderInfo11==null){
			orderInfo = orderRepository.save(orderInfo);
		}

		return orderInfo;
	}

	@Override
	@Transactional
	public void update(OrderInfo orderInfo) {


		/******* method-1 : delete all firstly, then save all  *********/
		// ******* if delete product, re-calculate the total count of backupCount. ********
		// cannot do like this,because: javax.persistence.EntityExistsException: A different object with the same identifier value was already associated with the session ,

		/*txnService.deleteTxnListByExpressNO(orderInfo.getExpressNO());

		for(TxnRel txnRel : txnList){
			if(CommonConstant.COMMON_BOOLEAN_N.equals(txnRel.getDeleteIndicator())){
				txnService.save(txnRel);
			}
		}
		orderRepository.update(orderInfo);*/

		List<TxnRel> txnListFromUI = orderInfo.getTxnList();

		orderInfo.setTxnList(null);// set the child-collection object as empty
		orderRepository.update(orderInfo);//update the parent object

		/******* method-2 : if exists, update, else insert.  *********/
		LOGGER.debug("It must re-calculate the total count of backupCount once update order info .");

		List<String> existedProdNOList = new ArrayList<String>();
		Map<String, TxnRel> tempMap = new HashMap<String, TxnRel>();
		List<TxnRel> originalTxnListFromDB = txnService.getTxnListByExpressNO(orderInfo.getExpressNO());

		if(originalTxnListFromDB!=null && originalTxnListFromDB.size() > 0) {
			for (TxnRel txnRel : originalTxnListFromDB) {
				existedProdNOList.add(txnRel.getRefProdNO());
				tempMap.put(txnRel.getRefProdNO(), txnRel);
			}
		}

		if(txnListFromUI!=null && !txnListFromUI.isEmpty()){

			for(TxnRel rel1 : txnListFromUI){
				rel1.setRefExpressNO(orderInfo.getExpressNO());

				if(originalTxnListFromDB != null && !originalTxnListFromDB.isEmpty()) {
					if(existedProdNOList.contains(rel1.getRefProdNO())){
						// Step-1: if exists, update by data from UI .
						if(CommonConstant.COMMON_BOOLEAN_Y.equals(rel1.getDeleteIndicator())){
							LOGGER.debug("Do delete the record, refProdNo=" + rel1.getRefProdNO());
							txnService.deleteTxn(rel1);
						}else{
							LOGGER.debug("Do update using UI data if the record exists in DB, refProdNo="+rel1.getRefProdNO());
							TxnRel rel2 = tempMap.get(rel1.getRefProdNO());
							rel2.setRefExpressNO(orderInfo.getExpressNO());
							rel2.setRefProdNO(rel1.getRefProdNO());
							rel2.setPurchaseCount(rel1.getPurchaseCount());
							rel2.setDeleteIndicator(rel1.getDeleteIndicator());
//							rel2.setRemark(rel1.getRemark());
							txnService.updateTxn(rel2);
						}
					}else{
						LOGGER.debug("Do insert if the record not exists in DB, which means a new record! refProdNo="+rel1.getRefProdNO());
						// Step-2: if not exists, insert new records.
						txnService.save(rel1);
					}

				}else{
					LOGGER.debug("Do insert if no record found in DB, refProdNo=" + rel1.getRefProdNO());
					txnService.save(rel1);
				}
			}
		}else{

			if(!existedProdNOList.isEmpty()){
				LOGGER.debug("Do delete all the related records if no record passed from UI!");
				txnService.deleteTxnListByExpressNO(orderInfo.getExpressNO());//TODO pending double confirm
			}
		}

		//update orderInfo
//		orderInfo.setTxnList(null);// set the child-collection object as empty
//		orderRepository.update(orderInfo);//update the parent object

	}

	@Override
	@Transactional
	public void deleteOrderInfoByID(int orderID) {
		orderRepository.deleteOrderInfoByID(orderID);
	}

	@Override
	public OrderInfo getOrderInfoByID(int orderID) {
		return orderRepository.getOrderInfoByID(orderID);
	}

	@Override
	public OrderInfo getOrderInfoByExpressNO(String expressNO) {
		return orderRepository.getOrderInfoByExpressNO(expressNO);
	}

	@Override
	public List<OrderInfo> getOrderListByFromDtToDt(String fromDate, String toDate) {
		return this.getAllOrderListByFromDtToDt(fromDate, toDate);
	}

	@Override
	public List<OrderInfo> getAllOrderList() {
		return this.getAllOrderListByFromDtToDt(null, null);
	}

	@Override
	public List<OrderInfo> getAllOrderList(Map<String, Object> pageMap) {

		return this.getOrderListBySearchCriteria(null, pageMap);
	}

	@Override
	public List<OrderInfo> getOrderListBySearchCriteria(SearchCriteria searchCriteria) {
		if(searchCriteria==null){
			return null;
		}
		return this.getOrderListBySearchCriteria(searchCriteria, null);
	}

	@Override
	public Integer getCountOfOrderListBySearchCriteria(SearchCriteria searchCriteria) {
		List result = this.getOrderListBySearchCriteria(searchCriteria);
		return (result==null||result.isEmpty())? 0 : result.size();
	}

	@Override
	public List<OrderInfo> getOrderListBySearchCriteria(SearchCriteria searchCriteria, Map<String, Object> pageMap) {
		return orderRepository.getOrderListBySearchCriteria(searchCriteria, pageMap);
	}

	@Override
	public Page<OrderInfo> getOrderPageListBySearchCriteria(SearchCriteria searchCriteria, Pageable page) {

		int pageNumber = page.getPageNumber();
		int pageSize = page.getPageSize();
		PageRequest request =
				new PageRequest(pageNumber - 1, MAX_PAGE_SIZE, Sort.Direction.DESC, "startTime");
		return orderRepository.getOrderPageListBySearchCriteria(searchCriteria, page);
	}

	private List<OrderInfo> getAllOrderListByFromDtToDt(String fromDate, String toDate){
		if(fromDate!=null && !"".equals(fromDate) && !"".equals(fromDate.trim())){
			if(!DateUtil.isValidFormat(DateUtil.FORMAT_DATE_YYYY_MM_DD, fromDate)){
				return null;
			}
		}
		if(toDate!=null && !"".equals(toDate) && !"".equals(toDate.trim())){
			if(DateUtil.isValidFormat(DateUtil.FORMAT_DATE_YYYY_MM_DD, toDate)){
				return null;
			}
		}

		return orderRepository.getOrderListByFromDtToDt(fromDate, toDate);
	}


	public byte[] generateOrderInfoAsFile(List<OrderInfo> orderInfoList, String fileName){
		//generate output file
		byte[] content = null;
		try{
			if(fileName == null || "".equals(fileName)){
				String currDateStr = DateUtil.formatDate(new Date(), DateUtil.FORMAT_DATE_YYYYMMDD);
				fileName = CommonConstant.OUTPUT_FILE_NAME + "_" + currDateStr + CommonConstant.OUTPUT_FILE_TYPE_EXCEL;
			}
			File file = new File(fileName);
			if(file.exists()){
				file.exists();
			}

			//generate file
			this.generateExlFile(file, orderInfoList);

			content = FileUtil.convertInputStreamToByte(new FileInputStream(file));

		} catch (Exception e){
			return null;
		}
		return content;
	}

	private void generateExlFile(File file, List<OrderInfo> orderInfoList) throws Exception{
//		Map<String, MyCode> contactTypeCodeList = codeService.findCodeMappingByCodeTypID(CommonConstant.CODE_CONTACT_TP);
		Map<String, MyCode> expressCompanyCodeList = codeService.findCodeMappingByCodeTypID(CommonConstant.CODE_EXPRESS_COMPANY);
		Map<String, MyCode> expressStatusCodeList = codeService.findCodeMappingByCodeTypID(CommonConstant.CODE_EXPRESS_STATUS);
		Map<String, MyCode> payTypeCodeList = codeService.findCodeMappingByCodeTypID(CommonConstant.CODE_PAY_TP);
//		Map<String, MyCode> commonYesNOList = codeService.findCodeMappingByCodeTypID(CommonConstant.CODE_CMN_YES_NO);

		if(orderInfoList==null || orderInfoList.isEmpty()){
			return ;
		}

		WorkbookSettings wbSettings = new WorkbookSettings();
		wbSettings.setLocale(new Locale("cn", "CN"));
		WritableWorkbook wworkbook = Workbook.createWorkbook(file, wbSettings);

		WritableSheet wsheet = wworkbook.createSheet("Sheet1--订单信息", 0);

		// header
		for(int k=0; k < CommonConstant.ORDER_INFO_HEADER_ARR.length; k++){
			Label label = new Label(k, 0, CommonConstant.ORDER_INFO_HEADER_ARR[k]);
			wsheet.addCell(label);
		}

		// orderInfo body
		for(int i=0; i<orderInfoList.size(); i++){
//			String[] headerArr = {"序号","订单号","付款方式","订单状态"
//			,"总价","客户QQ","客户WW","购买时间","收货人姓名","收货人地址","联系方式"
//					,"快递公司","快递费用"};

			OrderInfo orderInfo = orderInfoList.get(i);
			int j=0;

			wsheet.addCell(new jxl.write.Number(j++, i+1, i+1));
			wsheet.addCell(new Label(j++, i+1, orderInfo.getExpressNO()==null?"":orderInfo.getExpressNO()));
			wsheet.addCell(new Label(j++, i+1, payTypeCodeList.get(orderInfo.getPayType())==null?"":payTypeCodeList.get(orderInfo.getPayType()).getCodeDesc()));
			wsheet.addCell(new Label(j++, i+1, expressStatusCodeList.get(orderInfo.getExpressStatus())==null?"":expressStatusCodeList.get(orderInfo.getExpressStatus()).getCodeDesc()));
			wsheet.addCell(new Number(j++, i+1, orderInfo.getTotalPrice()==null?0:orderInfo.getTotalPrice()));
			wsheet.addCell(new Label(j++, i+1, orderInfo.getCustomerQQ()==null?"":orderInfo.getCustomerQQ()));
			wsheet.addCell(new Label(j++, i+1, orderInfo.getCustomerWW()==null?"":orderInfo.getCustomerWW()));
			wsheet.addCell(new Label(j++, i+1, orderInfo.getShopingDateStr()==null?"":orderInfo.getShopingDateStr()));
			wsheet.addCell(new Label(j++, i+1, orderInfo.getCustomerName()==null?"":orderInfo.getCustomerName()));
			wsheet.addCell(new Label(j++, i+1, orderInfo.getReceiveAdd()==null?"":orderInfo.getReceiveAdd()));
			wsheet.addCell(new Label(j++, i+1, orderInfo.getCustomerPhoneNO()==null?"":orderInfo.getCustomerPhoneNO()));
			wsheet.addCell(new Label(j++, i+1, expressCompanyCodeList.get(orderInfo.getExpressCompany())==null?"":expressCompanyCodeList.get(orderInfo.getExpressCompany()).getCodeDesc()));
			wsheet.addCell(new Number(j++, i+1, orderInfo.getExpressCharge()==null?0:orderInfo.getExpressCharge()));

		}

		WritableSheet wsheet2 = wworkbook.createSheet("Sheet2--订单详情", 1);
		for(int k=0; k < CommonConstant.PRODUCT_DETAIL_HEADER_ARR.length; k++){
			Label label = new Label(k, 0, CommonConstant.PRODUCT_DETAIL_HEADER_ARR[k]);
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
					wsheet2.addCell(new Label(j++, row+1, txnRel.getRefExpressNO()==null?"":txnRel.getRefExpressNO()));
					wsheet2.addCell(new Label(j++, row+1, txnRel.getRefProdNO()==null?"":txnRel.getRefProdNO()));
					wsheet2.addCell(new Label(j++, row+1, txnRel.getProduct()==null?"":txnRel.getProduct().getProdName()));
					wsheet2.addCell(new Number(j++, row+1, txnRel.getPurchaseCount()));
					wsheet2.addCell(new Number(j++, row+1, txnRel.getProduct()==null?0:(txnRel.getProduct().getBackupCount()==null?0:txnRel.getProduct().getBackupCount())));
				}
			}
		}

		wworkbook.write();
		wworkbook.close();
	}

	@Override
	public Integer getCountOfOrderListBySearchCriteriaforDaofu(
			SearchCriteria searchCriteria) {
		List result = this.getOrderListBySearchCriteriaforDaofu(searchCriteria);
		return (result==null||result.isEmpty())? 0 : result.size();
	}

	@Override
	public List<OrderInfo> getOrderListBySearchCriteriaforDaofu(
			SearchCriteria searchCriteria, Map<String, Object> pageMap) {
		return orderRepository.getOrderListBySearchCriteriaforDaofu(searchCriteria, pageMap);
	}

	@Override
	public List<OrderInfo> getOrderListBySearchCriteriaforDaofu(
			SearchCriteria searchCriteria) {
		if(searchCriteria==null){
			return null;
		}
		return this.getOrderListBySearchCriteriaforDaofu(searchCriteria, null);
	}
}