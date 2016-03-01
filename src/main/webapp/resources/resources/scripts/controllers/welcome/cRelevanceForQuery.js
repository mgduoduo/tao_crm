/*! BUILD: 2015-02-11 */
Common.controllers.RelevanceForQuery=Spine.Controller.sub({el:"#wrapper",ejsPath:{tips:"templates/welcome/relevanceForQueryTips.ejs",start:"templates/welcome/relevanceForQueryStart.ejs",confirm:"templates/welcome/relevanceForQueryConfirm.ejs",borrowSuccess:"templates/welcome/relevanceForQuerySuccess.ejs",unborrowSuccess:"templates/welcome/relevanceForQueryUnBorrowSuccess.ejs"},allowAccountAutoRelate:["101","103","104","119","107","140","150","152","170","188","300","190","199"],init:function(){var a=this;Common.LightBox.show(),Common.request(CU.createConversation(),function(b){Common.request(new Model("PsnAutoLoginCheckIsLinked",b),function(c){"Y"==c.isLinkable?a.el.append(a.ejsPath.tips,function(){var d=a.el.find("#relevance-for-query-tips");Common.LightBox.show(),CU.changeLan(d),CU.setObjScreenAbsCenter(d),d.on("click","a.close, #btn_56617_1172158",function(){d.remove(),Common.LightBox.hide()}).on("click","#btn_56619_1172157",function(){a.start({linkData:c,pop:d,cid:b})})}):Common.LightBox.hide()},function(){Common.LightBox.hide()})},function(){Common.LightBox.hide()})},start:function(a){var b=this,c=a.pop;b.el.append(b.ejsPath.start,a.linkData,function(){c.remove(),c=b.el.find("#relevance-for-query-start"),Common.SF.showSelector("PB010",function(d){d===!1?(Common.LightBox.hide(),c.remove()):(b.el.find("#stool-selector p.text-darkenred").remove(),CU.changeLan(c),CU.setObjScreenAbsCenter(c),c.on("click","a.close, #btn_cancel_1172152",function(){c.remove(),Common.LightBox.hide()}),c.on("click","#btn_nextstep_1172151",function(){b.confirm($.extend(a,{pop:c}))}))},null,a.cid)})},confirm:function(a){var b=this,c=a.pop;Common.SF.check()&&Common.request(new Model("PsnAutoLoginRelevancePre",{_combinId:Common.SF.get("combinId")},a.cid),function(d){{var f=a.linkData.accountType;a.linkData.isHaveEleCashAcct}if("300"==f);else if("119"==f){var g=[];b.relevanceDebitAccountHt=new Common.Hashtable,$.each(d.relevanceDebitAccountList,function(a,c){$.inArray(c.accountType,b.allowAccountAutoRelate)>-1&&(g.push(c),b.relevanceDebitAccountHt.add(c.accountNumber,c))}),d.relevanceDebitAccountList=g}b.el.append(b.ejsPath.confirm,d,function(){c.remove(),c=b.el.find("#relevance-for-query-confirm"),Common.request(new Model("PSNGetRandom",a.cid),function(f){Common.SF.appendInputTo("#relevance-stool-list",function(){CU.changeLan(c),CU.setObjScreenAbsCenter(c),c.find("#relevance-account-list tr").each(function(a,b){$(b).addClass(1&a?"even":"odd")}),boxes=c.find("#relevance-account-list tr input[type=checkbox]").filter(function(a){return!a.disabled}),c.find("#cb_quanxuan_1172141").on("change",function(){boxes.attr("checked",this.checked)}),c.find("#relevance-account-list tr input[type=checkbox]").on("change",function(){var a=!0;boxes.each(function(){a=a&&this.checked}),c.find("#cb_quanxuan_1172141").attr("checked",a)}),c.find("#relevance-account-list tr input[linetype=eleMainLine]").on("change",function(){b.cardLineChange(e)}),c.on("click","a.close, #btn_cancel_1172139",function(){c.remove(),Common.LightBox.hide()}),Common.request(CU.createTokenId(a.cid),function(e){b.token=e,c.find("#btn_confirm_1172138").on("click",function(){b.result($.extend(a,{pop:c,token:b.token,random:f,preData:d}))})})},$.extend({},d,d.securityEntity),f)})})})},result:function(a){if(formValid.checkAll(a.pop)){var b=this,c=a.pop,d=Common.SF.get("Otp"),e=Common.SF.get("Smc"),f=Common.SF.get("signedData"),g=c.find("#relevance-account-list tr input[type=checkbox]").filter(function(a){return!a.disabled&&a.checked}),h={accountType:a.linkData.accountType,accountNumber:a.linkData.accountNumber,isHaveEleCashAcct:a.preData.isHaveEleCashAcct,token:a.token,devicePrint:encode_deviceprint()};if("300"==a.linkData.accountType)h.branchId=a.preData.relevanceAccountICCardResult.branchId+"",h.linkAcctFlag="";else if("119"==a.linkData.accountType){var i=b.confirmborrow(c,a);if(0===i.selectedAccountArray.length||0===g.size())return void Common.LightBox.showMessage(CU.getDictNameByKey("l8781"));$.extend(h,i),h.mainAccountNumber=a.preData.mainAccountNumber}else if("103"==a.linkData.accountType||"104"==a.linkData.accountType||"107"==a.linkData.accountType){var j,k="";"1"===a.preData.isHaveEleCashAcct?(j=$("#automj").is(":checked"),a.preData.relevanceCreditAccount.linkedFlag?j&&(k="2"):k=j?"3":"1"):"0"===a.linkData.isHaveEleCashAcct&&(k="1"),$.extend(h,{mainAccountNumber:a.preData.mainAccountNumber,linkAcctFlag:k,currencyCode2:a.preData.relevanceCreditAccount.currencyCode2,currencyCode:a.preData.relevanceCreditAccount.currencyCode,cardDescription:a.preData.relevanceCreditAccount.cardDescription,branchId:a.preData.relevanceCreditAccount.branchId+"",selectedAccountArray:[],isCashbind:j})}if(d&&$.extend(h,{activ:d.Version,state:d.State,Otp:d.Value,Otp_RC:d.RandomKey_C}),e&&$.extend(h,{activ:e.Version,state:e.State,Smc:e.Value,Smc_RC:e.RandomKey_C}),f){if(!f.result)return!1;$.extend(h,{_signedData:f.result})}Common.request(new Model("PsnRelevanceAccountResult",h,a.cid),function(c){if(c){var d=new Common.AC({el:b.el,data:c,conversationId:a.cid,random:a.random,ok:function(c){Common.request(new Model("PsnRelevanceAccountResultReinforce",d.get(),a.cid),function(c){d.hide(),b.success($.extend(a,{data:c}))},null,function(){c()})}});"ALLOW"==d.result&&(d.hide(),b.success($.extend(a,{data:c})))}else b.success($.extend(a,h))},function(){Common.SF.clear(),Common.postRequest(CU.createTokenId(a.cid)).then(function(a){b.token=CU.ajaxDataHandle(a)})})}},success:function(a){var b,c,d=this,e=a.pop;"119"==a.linkData.accountType?(b=d.ejsPath.borrowSuccess,c=a.data):(b=d.ejsPath.unborrowSuccess,c=a),d.el.append(b,c,function(){e.remove(),e=d.el.find("#relevance-for-query-success"),CU.setObjScreenAbsCenter(e),CU.changeLan(e),e.find("#relevance-for-query-success tr").each(function(a,b){$(b).addClass(1&a?"even":"odd")}),e.on("click","a.close, #btn_2888_1172162",function(){e.remove(),Common.LightBox.hide()})})},cardLineChange:function(a){for(var b=$(a.target),c=b.attr("accountNumber"),d=b.parent().parent().nextAll("tr").find("[accountNumber='"+c+"'][lineType=eleLine]"),e=null,f=0;f<d.length;f++)e=$(d.get(f)),e.attr("disabled")||e.attr("checked",b.is(":checked"))},confirmborrow:function(a,b){var c=this,d=null,e=[];a.find("tr[accountNumber]").each(function(a,f){var g,h=$(f),i="0",j="0",k="0",l=h.find("input[linetype=eleMainLine]"),m=null,n=c.relevanceDebitAccountHt.item(h.attr("accountNumber"));if("1"===n.isHaveEleCashAcct){if(n.linkedFlag&&("0"===n.linkEleCashAcctFlag||"2"===n.linkEleCashAcctFlag)&&("0"==n.linkMedicalAcctFlag||"2"==n.linkMedicalAcctFlag))return!0;n.linkedFlag&&"1"===n.linkEleCashAcctFlag&&(m=h.next().find("input"),m.is(":checked")&&(g="2",j="1")),n.linkedFlag||"1"!==n.linkEleCashAcctFlag||(m=h.next().find("input"),l.is(":checked")&&m.is(":checked")?(g="3",j="1"):l.is(":checked")&&!m.is(":checked")&&(g="1")),n.linkedFlag||"0"!==n.linkEleCashAcctFlag&&"2"!==n.linkEleCashAcctFlag||(g="1")}else{if(n.linkedFlag&&("0"==n.linkMedicalAcctFlag||"2"==n.linkMedicalAcctFlag))return!0;l.is(":checked")&&(g="1")}if("1"===n.isHaveMedicalAcct&&(n.linkedFlag&&"1"===n.linkMedicalAcctFlag&&(m="1"===n.linkEleCashAcctFlag?h.nextAll().eq(1).find("input"):h.next().find("input"),m.is(":checked")&&(k="1")),n.linkedFlag||"1"!==n.linkMedicalAcctFlag||(m="1"===n.linkEleCashAcctFlag?h.nextAll().eq(1).find("input"):h.next().find("input"),m.is(":checked")&&(k="1"))),"119"!=n.accountType&&!g)return!0;var o={accountNumber:n.accountNumber,accountIbkNum:n.accountIbkNum,linkAcctFlag:g};i=l.attr("checked")&&!l.attr("disabled")?"1":"0","119"==n.accountType&&($.extend(o,{linkDebitOrNot:i,linkEcashOrNot:j,linkMedicalOrNot:k}),delete o.linkAcctFlag);var n=o;b.linkData.accountNumber===h.attr("accountNumber")&&(d=n),e.push(n)});var f={linkAcctFlag:d?d.linkAcctFlag:"",selectedAccountArray:e};return f}});