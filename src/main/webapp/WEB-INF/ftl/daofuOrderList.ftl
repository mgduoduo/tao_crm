<#assign basePath=rc.contextPath>
<#assign cc=JspTaglibs["/WEB-INF/tld/cc_0_1.tld"]>
<#assign page=JspTaglibs["/WEB-INF/tld/pg_0_1.tld"]>
<script type="text/javascript" src="${basePath}/resources/js/jquery-1.7.2.min.js"></script>
<script type="text/javascript">
    function showInfo(expressNO, operateType){

        jQuery('#orderInfoDiv').html("");
        jQuery('#orderInfoDiv').hide();
        jQuery.ajax({
            type:"POST",
            url:"${basePath}/easyShop/orderInfoDaofu.do?n="+Math.round(Math.random()*100),
            data:{"expressNO": expressNO, "operateType":operateType},
            dataType: "html",   //返回值类型       使用json的话也可以，但是需要在JS中编写迭代的html代码，如果格式样式
            cache:false,
            async: false,
            success:function(data){
                //var json = eval('('+msg+')');//拼接的json串
                jQuery('#orderInfoDiv').show();
                jQuery('#orderInfoDiv').html(data);
            },
            error:function(error){alert("error");}
        });

    }

    function go(pageNum){
        var pageSize = jQuery("#pageSize").val();
        var toUrl = "";
        var n = Math.round(Math.random()*100); //used for refresh the ajax request.
        toUrl = "${basePath}/easyShop/searchDaofu.do"+'?pageNum=' + pageNum + '&pageSize='+pageSize+'&n='+n;
        submitPage(pageNum, pageSize, toUrl);

    }

    function submitPage(pageNum, pageSize, toUrl){
        jQuery('#searchResultDiv').html("");

        jQuery.ajax({
            type:"POST",
            url: toUrl,
            data:jQuery('#searchForm').serialize(),
            dataType: "html",   //返回值类型       使用json的话也可以，但是需要在JS中编写迭代的html代码，如果格式样式
            cache:false,
            async: false,
            success:function(data){
                //var json = eval('('+msg+')');//拼接的json串
                jQuery('#searchResultDiv').html(data);
            },
            error:function(error){alert("error");}
        });

    }

    function downFile(){

        var isSearch = jQuery("#isSearch").val();
        if(isSearch=='Y'){
            jQuery("#searchForm").attr("action","${basePath}/easyShop/download.do");
            jQuery("#searchForm").submit();
        }else if(isSearch =='N'){
            jQuery("#resultPageForm").attr("action","${basePath}/easyShop/download.do");
            jQuery("#resultPageForm").submit();
        }

    }

</script>
<div style="display: none">
    <form id="resultPageForm" action="" method="post">

    </form>
</div>

<div id="top_content">
    <div id="content">
        <p id="whereami">
        </p>
        <input type="hidden" name="isSearch" id="isSearch" value="${isSearch}">
        <h1>
            订单列表
        </h1>
        <table class="table">
            <tr class="table_header">
                <td>操作</td>
                <td>序号</td>
                <td>到付单号</td>
                <td>收货人地址</td>
                <td>购买时间</td>
                <td>客户QQ</td>
                <td>客户WW</td>
                <td>物流状况</td>
                <td>备注</td>
            </tr>

        <#if orderInfoList?exists >
            <#list orderInfoList as orderInfo>
                <tr class="row<#if orderInfo_index % 2 = 1>1<#else>2</#if>">
                    <td style="width:50px;">
                        <a href="javascript:;" onclick="showInfo('${orderInfo.expressNO}', '1')" >查看</a>
                        <#if isSearch!='Y'>
                            <br/>
                            <a href="javascript:;" onclick="showInfo('${orderInfo.expressNO}', '2')" >修改</a>
                        </#if>
                    </td>
                    <td style="width:50px;" align="center">${pageSize*(pageNum-1) + orderInfo_index+1}</td>
                    <td style="width:120px;"><a href="javascript:;" onclick="showInfo('${orderInfo.expressNO}', '1')" >${orderInfo.expressNO}</a></td>

                    <td style="width:240px;word-break: break-all">${orderInfo.receiveAdd}</td>
                    <td style="width:160px;"><@cc.dateFormat value="${orderInfo.shopingDate}" formatTo="YYYY-MM-DD"/></td>
                    <td style="width:160px;word-break: break-all">${orderInfo.customerQQ}</td>
                    <td style="width:130px;word-break: break-all">${orderInfo.customerWW}</td>
                    <td style="width:120px;">
                        <#if expressStatusCodeList?exists>
                        <#list expressStatusCodeList as code>
                            <#if orderInfo.expressStatus == code.codeID>${code.codeDesc}</#if>
                        </#list>
                    </#if>
                    </td>
                    <td style="width:50px;"><#if orderInfo.remark??>${orderInfo.remark}</#if></td>
                </tr>
            </#list>
            <tr class="row1">
                <td colspan="2">
                    <a href="javascript:;" onclick="downFile()">导出所有结果</a>
                </td>
                <td colspan="7">
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
<div id="orderInfoDiv" style="display: none">

</div>


