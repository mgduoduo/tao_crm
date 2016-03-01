<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<#assign basePath=rc.contextPath>
<#import "/spring.ftl" as spring />
<#assign page=JspTaglibs["/WEB-INF/tld/pg_0_1.tld"]>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>存货管理</title>
    <link href="${basePath}/resources/css/site.css" rel="stylesheet">
    <link href="${basePath}/resources/css/style.css" rel="stylesheet">
    <script type="text/javascript" src="${basePath}/resources/js/jquery-1.7.2.min.js"></script>
    <script type="text/javascript">

        function submitSearch(){
            jQuery("#searchBackupListForm").attr("action", "${basePath}/easyShop/backupProductManage.do");
            jQuery("#searchBackupListForm").submit();
        }


        // for pagination
        function go(pageNum){
            var pageSize = jQuery("#pageSize").val(); // the value comes from pagination.
            jQuery("#searchBackupListForm").attr("action", "${basePath}/easyShop/backupProductManage.do?pageNum="+pageNum+"&pageSize="+pageSize);
            jQuery("#searchBackupListForm").submit();

        }

    </script>
</head>
<body>

<div id="wrap">
    <#include "./header.ftl">
    <div id="top_content">
        <div id="content">
            <p id="whereami">
            </p>

            <h1>
                库存详情
            </h1>

            <form method="post" id="searchBackupListForm" action="${basePath}/easyShop/backupProductManage.do">
                <table class="table">
                    <tr class="row1">
                        <td class="vector1">产品型号</td>
                        <td>
                            <select name="productNO" class="dropdown_s">
                                <option value="">---请选择---</option>
                            <#if productCodeList?exists>
                                <#list productCodeList as prod>
                                    <option value="${prod.prodNo}">${prod.prodName}</option>
                                </#list>
                            </#if>
                            </select>
                        </td>
                        <td class="vector1">产品名称</td>
                        <td><input type="text" name="productName"/></td>
                        <td colspan="2" align="center">
                            <input type="button" id="submitBtn" value="提交查询" class="btnUnActive_01" onclick="submitSearch()"/>
                        </td>
                    </tr>
                </table>
            </form>

            <div id="prodListDiv">

            <table class="table">
                <tr class="table_header">
                    <td>操作</td>
                    <td>型号</td>
                    <td>商品名称</td>
                    <td>剩余数量</td>
                    <td>供应商</td>
                    <td>进货价</td>
                    <td>描述</td>
                    <td>备注</td>
                </tr>

                <#if prodList?exists >
                    <#list prodList as prod>
                        <tr class="row<#if prod_index % 2 = 1>1<#else>2</#if>">
                            <td>${pageSize*(pageNum-1) + prod_index+1}</td>
                            <td><#if prod.prodNo??>${prod.prodNo}</#if></td>
                            <td><#if prod.prodName??>${prod.prodName}</#if></td>
                            <td><#if prod.backupCount??>${prod.backupCount}</#if></td>
                            <td><#if prod.supplier??>${prod.supplier}</#if></td>
                            <td><#if prod.prodPrice??>${prod.prodPrice}</#if></td>
                            <td><#if prod.prodDesc??>${prod.prodDesc}</#if></td>
                            <td><#if prod.remark??>${prod.remark}</#if></td>
                        </tr>
                    </#list>
                    <tr class="row1">

                        <td colspan="8">
                            <@page.createPager pageSize="${pageSize}" totalPage="${totalPage}" totalCount="${totalCount}" curPage="${pageNum}" formId="testForm"/>
                        </td>
                    </tr>
                <#else>
                    <tr class="row1">
                        <td colspan="9">
                            No record found.
                        </td>
                    </tr>
                </#if>
            </table>

            </div>

        </div>
    </div>
    <div id="footer">
        <div id="footer_bg">
            去<<我的店铺>>看看
        </div>
    </div>
</div>

</body>
</html>