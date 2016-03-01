<#assign basePath=rc.contextPath>
<#assign cc=JspTaglibs["/WEB-INF/tld/cc_0_1.tld"]>
<#--<link href="${basePath}/resources/css/site.css" rel="stylesheet">
<link href="${basePath}/resources/css/style.css" rel="stylesheet">-->

<div id="top_content">
    <div id="content">
        <p id="whereami">
        </p>

        <table class="table">
            <tr class="table_header">
                <td colspan="6">订单详情 &nbsp;&nbsp;--&nbsp;&nbsp; ${orderInfo.expressNO}</td>
            </tr>
            <tr class="row1">
                <td class="vector1" style="width: 100px;">订单编号</td>
                <td style="width: 150px;">${orderInfo.expressNO}</td>
                <td class="vector1" style="width: 100px;">付款方式</td>
                <td style="width: 150px;">
                <#if payTypeCodeList?exists>
                        <#list payTypeCodeList as code>
                    <#if orderInfo.payType == code.codeID>${code.codeDesc}</#if>
                </#list>
                    </#if>
                </td>
                <td class="vector1" style="width: 100px;">购买时间</td>
                <td>
                <@cc.dateFormat formatTo="yyyy-MM-dd" value="${orderInfo.shopingDate}"/>
                </td>
            </tr>
            <tr class="row2">
                <td class="vector1">总价</td>
                <td>
                <@cc.moneyFormat value="${orderInfo.totalPrice}"/>&nbsp;元
                </td>
                <td class="vector1">买家QQ号</td>
                <td>
                <#if orderInfo.customerQQ??>${orderInfo.customerQQ}</#if>
                </td>
                <td class="vector1">买家旺旺号</td>
                <td>
                <#if orderInfo.customerWW??>${orderInfo.customerWW}</#if>
                </td>
            </tr>
            <tr class="row1">
                <td class="vector1">收件人姓名</td>
                <td>
                <#if orderInfo.customerName??>${orderInfo.customerName}</#if>
                </td>
                <td class="vector1">收件人联系方式</td>
                <td>
                <#if orderInfo.customerPhoneNO??>${orderInfo.customerPhoneNO}</#if>
                </td>
                <td class="vector1">收件人地址</td>
                <td>
                <#if orderInfo.receiveAdd??>${orderInfo.receiveAdd}</#if>
                </td>
            </tr>
            <tr class="row2">
                <td class="vector1">快递公司</td>
                <td>
                <#if orderInfo.expressCompany??>${orderInfo.expressCompany}</#if>
                <#if expressCompanyCodeList?exists>
                    <#list expressCompanyCodeList as code>
                        <#if orderInfo.expressCompany == code.codeID>${code.codeDesc}</#if>
                    </#list>
                </#if>
                </td>
                <td class="vector1">物流状况</td>
                <td>
                <#--<#if orderInfo.expressStatus??>${orderInfo.expressStatus}</#if>-->
                <#if expressStatusCodeList?exists>
                    <#list expressStatusCodeList as code>
                        <#if orderInfo.expressStatus == code.codeID>${code.codeDesc}</#if>
                    </#list>
                </#if>
                </td>
                <td class="vector1">备注</td>
                <td>
                <#if orderInfo.remark??>${orderInfo.remark}</#if>
                </td>
            </tr>

        <#if orderInfo.txnList?size gt 0 >
            <tr class="table_header">
                <td colspan="6">订货清单</td>

            </tr>
            <#list orderInfo.txnList as txn>
                <#if txn.product?exists && txn.deleteIndicator == 'N'>
                    <tr class="row<#if txn_index % 2 = 1>1<#else>2</#if>">
                        <td class="vector1">产品型号</td>
                        <td>
                       		 <#if txn.refProdNO??>${txn.refProdNO}</#if>
                        </td>
                        <td class="vector1">购买数量</td>
                        <td>
                       		 <#if txn.purchaseCount??>${txn.purchaseCount}</#if>
                        </td>
                        <td class="vector1">库存量</td>
                        <td>
                            <#if txn.product.backupCount??>${txn.product.backupCount}</#if>
                        </td>
                    </tr>
                </#if>
            </#list>
        </#if>
        </table>

    </div>
</div>
