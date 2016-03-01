<#assign basePath=rc.contextPath>
<#assign cc=JspTaglibs["/WEB-INF/tld/cc_0_1.tld"]>
<link href="${basePath}/resources/css/redmond/jquery-ui-1.7.1.custom.css" rel="stylesheet">
<script type="text/javascript" src="${basePath}/resources/js/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="${basePath}/resources/js/datepicker.js"></script>
<script type="text/javascript">
    var jQuery_datepicker = jQuery.noConflict(true);

    var formID = "createOrderInfoForm";
    jQuery_datepicker(function () {

        jQuery_datepicker("#shopingDate").datepicker({    //  记得要括在大括号之内
            appendText:"(yyyy-mm-dd)",
            dateFormat:"yy-mm-dd",  //设置日期格式
            changeMonth:true,   //是否提供月份选择
            changeYear:true,    //是否提供年份选择
            navigationAsDateFormat:true,
            numberOfMonths: 1,// 可显示几个月份的面板,
            dayNamesMin: ['日','一','二','三','四','五','六'],  //日期简写名称
            monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']  //月份简写名称
        });


    });

    //    jQuery(function(){
    //        jQuery("#createOrderInfoForm input").each(function(){
    //            jQuery(this).bind('blur', function(){
    //                jQuery(this).val(jQuery(this).val().trim());
    //            });
    //        });
    //    });

    function validatorFields(tableID){
        var warningText = "<br/><font color='red'>所有红色标注的项目都必须不能为空、或是数量为0, 请检查后重新提交!</font>";
        var validIndicator = true;
        if(jQuery("#"+tableID+" select[name='payType']").val()==''
                || jQuery("#"+tableID+" input[name='expressNO']").val()=='' || jQuery("#"+tableID+" input[name='expressNO']").val().trim()==''
                || jQuery("#"+tableID+" input[name='shopingDate']").val()=='' || jQuery("#"+tableID+" input[name='shopingDate']").val().trim()==''
                || jQuery("#"+tableID+" input[name='totalPrice']").val()=='' || jQuery("#"+tableID+" input[name='totalPrice']").val().trim()==''
                || jQuery("#"+tableID+" input[name='customerName']").val()=='' || jQuery("#"+tableID+" input[name='customerName']").val().trim()==''
                || jQuery("#"+tableID+" input[name='customerPhoneNO']").val()=='' || jQuery("#"+tableID+" input[name='customerPhoneNO']").val().trim()==''
                || jQuery("#"+tableID+" input[name='receiveAdd']").val()=='' || jQuery("#"+tableID+" input[name='receiveAdd']").val().trim()==''
                || jQuery("#"+tableID+" select[name='expressCompany']").val()=='' ){
            validIndicator = false;
        }


        if(!validIndicator){
            jQuery("#warningOrderSpan").html(warningText);
        }
        return validIndicator;
    }

    function validatorProdCount(tabID) {
        var valid = true;
        jQuery("#"+tabID+" input[name='purchaseCount']").each(function(){
            var purchaseCount = jQuery(this).val();
            var backupCountSpan = jQuery(this).parents("tr:eq(0)").find("span[name='backupCount']");//
            var backupCount = jQuery(backupCountSpan).html();
            if(purchaseCount > backupCount){
                //jQuery(backupCountSpan).after("&nbsp;&nbsp;<font color='red'>存货数量已不足</font>");
                valid = false;
            }
        });
        return valid;
    }

    function submitSave(){

        //jQuery.support.cors = true;// it's importance  for resolving the ajax 405 error.

        jQuery("#warningOrderSpan").html("");

        if(!validatorFields("createOrderInfoForm")){
            return false;
        }

        if(!validatorProdCount("createOrderInfoForm")) {
            if (!confirm("提示:清单中部分商品的购买数量已超出当前库存数，是否仍继续保存?")) {
                return false;
            }
        }
        /*jQuery("#createOrderInfoForm").attr("action", "${basePath}/easyShop/createOrderInfo.do");
        jQuery("#createOrderInfoForm").submit();*/

        jQuery.ajax({
            type:"POST",
            url:"${basePath}/easyShop/createOrderInfo.do?n="+Math.round(Math.random()*100),
            data:jQuery('#createOrderInfoForm').serialize(),
            dataType: "text",   //返回值类型       使用json的话也可以，但是需要在JS中编写迭代的html代码，如果格式样式
            error:function(xhr, ajaxOptions, thrownError){
                alert(xhr.status);
            },
            success:function(data){
                if(data != ''){
                    jQuery("#warningOrderSpan").html("<font color='red'>提示：保存出错，请检查是否该交单号已存在！</font>");
                }else{
                    alert("保存成功！");
                    changeMenu('menu_1');// refresh the order listing.
                }
            }
        });
    }
    function submitSaveTxn(){

        //jQuery.support.cors = true;// it's importance  for resolving the ajax 405 error.

        jQuery("#warningOrderSpan").html("");

        var validIndicator = true;
        if(validIndicator){
            //input
            var purchaseCountArr = jQuery("#createTxnRelForm input[name='purchaseCount']");
            if(purchaseCountArr.length > 0){
                for(var i=0; i< purchaseCountArr.length; i++){
                    if(purchaseCountArr[i].value == '' || purchaseCountArr[i].value == 'undefined' || purchaseCountArr[i].value == 0){
                        purchaseCountArr[i].value = '';
                        validIndicator = false;
                        break;
                    }
                }
            }
        }

        if(validIndicator) {
            // dropdown
            var prodNOArr = jQuery("#createTxnRelForm select[name='refProdNO']");

            if (prodNOArr.length > 0) {

                for (var i = 0; i < prodNOArr.length; i++) {
                    if(!validIndicator){
                        break;
                    }
                    if (prodNOArr[i].value == '' || prodNOArr[i].value == 'undefined') {
                        validIndicator = false;
                        break;
                    }

//                    for(var j = prodNOArr.length-1; j > i; j--){
//                        if(prodNOArr[i].value == prodNOArr[j].value){
//                            validIndicator = false;
//                            warningText = "<br/> <font color='red'>亲, 既然一个订单中有多个商品是同一种,干嘛不把他们统计在一起?</font>";
//                            break;
//                        }
//                    }
                }
            }
        }

        if(!validIndicator){
            var warningText = "<font color='red'>所有红色标注的项目都必须不能为空、或是数量为0, 请检查后重新提交!</font>";
            jQuery("#warningTxnSpan").html(warningText);
            return false;
        }

        if(!validatorProdCount("createTxnRelForm")) {
            if (!confirm("提示:清单中部分商品的购买数量已超出当前库存数，是否仍继续保存?")) {
                return false;
            }
        }

        jQuery.ajax({
            type:"POST",
            url:"${basePath}/easyShop/createTxnRel.do?n="+Math.round(Math.random()*100),
            data:jQuery('#createTxnRelForm').serialize(),
            dataType: "text",   //返回值类型       使用json的话也可以，但是需要在JS中编写迭代的html代码，如果格式样式
            error:function(xhr, ajaxOptions, thrownError){
                alert(xhr.status);
            },
            success:function(data){
                //jQuery("#orderInfoForUpdate").html("");
                //jQuery("#orderInfoForUpdate").hide();
                if(data==''){
                    alert("保存成功！");
                    changeMenu('menu_1');// refresh the order listing.
                }else{
                    jQuery("#warningTxnSpan").html("<font color='red'>提示：部分订单和产品清单已经添加， 请修改订单！不可重复添加！:"+data+"</font>");
                }
            }
        });
    }

    function delInx(obj){
        if(confirm("是否确认要删除该条记录?")){
            var parentTr = jQuery(obj).parents("tr:eq(0)");
            var parentTable = jQuery(obj).parents("table:eq(0)");

            jQuery(parentTr).find("input[name='deleteIndicator']").val("Y");

            parentTr.hide();

        }
    }

    function addInx(obj){

        var $parentTable = jQuery(obj).parents("table:eq(0)");
        var $lastBodyTr = jQuery($parentTable).find("tr:last").prev("tr");
        var parentCss = $lastBodyTr.attr("class");
        var rowClass = parentCss=='row1' ? 'row2' : 'row1';

        var expressNOList = jQuery("#expressNOList").find("option");

        var expressOptions = "<option value=''>---请选择---</option>";
        if(expressNOList!='' && expressNOList.length > 0){
            for(var i=0; i<expressNOList.length; i++){
                expressOptions = expressOptions + "<option value='"+expressNOList[i].value+"'>"+expressNOList[i].text+"</option>";
            }
        }

        var prodDropdownList = jQuery("#productList").find("option");

        var options = "<option value=''>---请选择---</option>";
        if(prodDropdownList!='' && prodDropdownList.length > 0){
            for(var i=0; i<prodDropdownList.length; i++){
                options = options + "<option value='"+prodDropdownList[i].value+"'>"+prodDropdownList[i].text+"</option>";
            }
        }

        var newRow = "<tr class='"+rowClass+"'>"
                +"<td class='vector1'>订单编号</td>"
                +"<td><select name='refExpressNO' class='dropdown_s'>"
                + expressOptions
                + "</select><font color='red'> *</font></td>"
                +"<td class='vector1'>产品型号</td>"
                +"<td><select name='refProdNO' onchange='selectProd(this)' class='dropdown_s'>"
                + options
                + "</select><font color='red'> *</font></td>"
                +"<td class='vector1'>购买数量</td><td><input type='text' name='purchaseCount'/><font color='red'> *</font></td>"
                +"<td class='vector1'>库存量</td><td><span name='backupCount'></span></td>"
                +"<td><input type='hidden' name='deleteIndicator' value='N'/>"
                +"<a href='javascript:;' onclick='delInx(this)'><img src='${basePath}/resources/images/delete.gif'/></a>"
                <#--+"&nbsp;<a href='javascript:;' onclick='addInx(this)'><img src='${basePath}/resources/images/ico_add.gif'/></a>"-->
                +"</td></tr>";

//        jQuery($parentTable).find("tr:last").before(newRow);
        $lastBodyTr.after(newRow);
    }

    function selectProd(obj){
        var $parentTr =  jQuery(obj).parents("tr:eq(0)");
        var prodNO = jQuery(obj).val();
        if(prodNO == ''){
            jQuery($parentTr).find("span[name='backupCount'").html("");
            return false;
        }

        jQuery.ajax({
            type:"POST",
            url:"${basePath}/easyShop/getProdByProdNO.do?n="+Math.round(Math.random()*100),
            data:{"prodNO":prodNO},
            dataType: "text",   //返回值类型       使用json的话也可以，但是需要在JS中编写迭代的html代码，如果格式样式
            error:function(xhr, ajaxOptions, thrownError){
                alert(xhr.status);
            },
            success:function(data){
                jQuery($parentTr).find("span[name='backupCount'").html(data);
            }
        });
    }

</script>
<div id="top_content">
    <div id="content">
        <p id="whereami">
        </p>

    <#--        <h1>
                订单详情&nbsp;&nbsp;--&nbsp;&nbsp;${orderInfo.expressNO}
            </h1>-->

        <form method="POST" id="createOrderInfoForm" action="${basePath}/easyShop/createOrderInfo.do">
            <table class="table">
                <tr class="table_header">
                    <td colspan="7">新增订单 </td>
                </tr>
                <tr class="row1">
                    <td class="vector1">订单编号</td>
                    <td>
                        <input type="text" name="expressNO"/><font color="red">&nbsp;*</font></td>
                    <td class="vector1" style="width: 90px;">付款方式</td>
                    <td>
                        <select name="payType" class="dropdown_s">
                            <option value="">---请选择---</option>
                        <#if payTypeCodeList?exists>
                            <#list payTypeCodeList as code>
                                <option value="${code.codeID}" >${code.codeDesc}</option>
                            </#list>
                        </#if>
                        </select><font color="red">&nbsp;*</font>
                    </td>
                    <td class="vector1">购买时间</td>
                    <td><input type="text" readonly="readonly" style="width: 100px;" id="shopingDate" name="shopingDate" value="" />
                        <font color="red"> *</font></td>
                    <td></td>
                </tr>
                <tr class="row2">
                    <td class="vector1">总价</td>
                    <td>
                        <input type="text" name="totalPrice"/><font color="red"> *</font>&nbsp;元
                    </td>
                    <td class="vector1">买家QQ号</td>
                    <td>
                        <input type="text" name="customerQQ"/>
                    </td>
                    <td class="vector1">买家旺旺号</td>
                    <td>
                        <input type="text" name="customerWW"/>
                    </td>
                    <td></td>
                </tr>
                <tr class="row1">
                    <td class="vector1">收件人姓名</td>
                    <td><input type="text" name="customerName" /><font color="red">&nbsp;*</font></td>
                    <td class="vector1">收件人联系方式</td>
                    <td><input type="text" name="customerPhoneNO" /><font color="red"> *</font></td>
                    <td class="vector1">收件人地址</td>
                    <td><input type="text" name="receiveAdd" /><font color="red"> *</font></td>
                    <td></td>
                </tr>
                <tr class="row2">
                    <td class="vector1">快递公司</td>
                    <td>
                        <select name="expressCompany" class="dropdown_s">
                            <option value="">---请选择---</option>
                        <#if expressCompanyCodeList?exists>
                            <#list expressCompanyCodeList as code>
                                <option value="${code.codeID}" >${code.codeDesc}</option>
                            </#list>
                        </#if>
                        </select><font color="red">&nbsp;*</font>
                    <td class="vector1">物流状况</td>
                    <td>

                        <select name="expressStatus" class="dropdown_s">
                            <option value="">---请选择---</option>
                        <#if expressStatusCodeList?exists>
                            <#list expressStatusCodeList as code>
                                <option value="${code.codeID}" >${code.codeDesc}</option>
                            </#list>
                        </#if>
                        </select>

                    </td>
                    <td class="vector1">备注</td>
                    <td><input type="text" name="remark" />
                    </td>
                    <td></td>
                </tr>

                <#--<#if orderInfo.txnList?size gt 0 >
                <#list orderInfo.txnList as txn>
                    <#if txn.product?exists && txn.deleteIndicator == 'N'>
                        <tr class="row<#if txn_index % 2 = 1>1<#else>2</#if>">
                            <td class="vector1">产品型号</td>
                            <td>
                                <input type="hidden" name="txnID" value="${txn.txnID}"/>
                                <input type="hidden" name="refProdNO" value="${txn.refProdNO}"/>${txn.refProdNO}

                            </td>

                            <td class="vector1">购买数量</td>
                            <td>
                                <input type="text" name="purchaseCount" value="<#if txn.purchaseCount??>${txn.purchaseCount}</#if>"/><font color="red"> *</font></td>
                            </td>
                            <td class="vector1">库存量</td>
                            <td>
                                <#if txn.product.backupCount??>${txn.product.backupCount}</#if>
                            </td>

                            <td>
                                <input type="hidden" name="deleteIndicator" value="${txn.deleteIndicator}"/>
                                <a href="javascript:;" onclick="delInx(this)"><img src="${basePath}/resources/images/delete.gif"/></a>
                            </td>
                        </tr>
                    </#if>
                </#list>
            </#if>-->
                <tr class="row1">
                    <td colspan="7" align="center">
                        <input type="button" id="submitBtn" value="保存订单" class="btnUnActive_01"
                               onclick="submitSave()"/>
                        <br/><span id="warningOrderSpan"></span>
                    </td>
                </tr>
            </table>
        </form>

        <hr/>
        <form method="POST" id="createTxnRelForm" action="${basePath}/easyShop/createTxnRel.do">
            <table class="table">

                <tr class="table_header">
                    <td colspan="8">新增订货清单</td>
                    <td width="3%">
                        <a href="javascript:;" onclick="addInx(this)"><img src="${basePath}/resources/images/ico_add.gif"/></a>

                        <select id="productList" class="dropdown_s" style="display: none">
                        <#if productCodeList?exists>
                            <#list productCodeList as prod>
                                <option value="${prod.prodNo}">${prod.prodName}</option>
                            </#list>
                        </#if>
                        </select>

                        <select id="expressNOList" class="dropdown_s" style="display: none">
                        <#if orderInfoList?exists>
                            <#list orderInfoList as orderInfo>
                                <option value="${orderInfo.expressNO}">${orderInfo.expressNO}</option>
                            </#list>
                        </#if>
                        </select>
                    </td>
                </tr>

                <tr class="row1">
                    <td colspan="9" align="center">
                        <input type="button" id="submitBtn" value="保存订货清单" class="btnUnActive_01"
                               onclick="submitSaveTxn()"/>
                        <br/><span id="warningTxnSpan"></span>
                    </td>
                </tr>
            </table>
        </form>

    </div>
</div>