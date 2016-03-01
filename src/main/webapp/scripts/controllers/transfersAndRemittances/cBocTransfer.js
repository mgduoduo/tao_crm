/*! BUILD: 2015-07-21 */
Common.controllers.BocTransfer = Spine.Controller.sub({
    _conversationId: "",
    _saveAsPayeeYn: !0,
    _sendmessageYn: !0,
    _executeType: "0",
    _payeetId: "",
    _needCommissionCharge: "",
    _preCommissionCharge: "",
    _remitSetMealFlag: "",
    _flag: !1,
    _receiveNumber: "",
    _hashTbFromAcc: new Common.Hashtable,
    ejsPath: {
        main: "templates/transfersAndRemittances/bocTransfer/bocTransferMain.ejs",
        confirm: "templates/transfersAndRemittances/bocTransfer/bocTransferConfirm.ejs",
        finish: "templates/transfersAndRemittances/bocTransfer/bocTransferFinish.ejs",
        payeeQueryPop: "templates/transfersAndRemittances/bocTransfer/selectPayeeAccount_boc.ejs",
        payeeListPop: "templates/transfersAndRemittances/bocTransfer/selectPayeeAccountList.ejs",
        showAccount: "templates/transfersAndRemittances/bocTransfer/showAccountBoc.ejs",
        payeeRelaListPop: "templates/transfersAndRemittances/bocTransfer/selectRelaPayeeAccountList.ejs",
        queryAccountDetail: "templates/common/queryAccountBalance.ejs",
        credQueryAccountDetail: "templates/common/credQueryAccountBalance.ejs",
        relatedTransferStep2: "templates/transfersAndRemittances/bocTransfer/relatedTransferStep2.ejs",
        relatedTransferStep3: "templates/transfersAndRemittances/bocTransfer/relatedTransferStep3.ejs",
        queryAccount: "templates/transfersAndRemittances/bocTransfer/QueryAccount.ejs",
        QueryAccountResult: "templates/transfersAndRemittances/bocTransfer/QueryAccountResult.ejs",
        capitalTransferConfirm: "templates/transfersAndRemittances/bocTransfer/captitalTOConfirm.ejs",
        capitalTransferResult: "templates/transfersAndRemittances/bocTransfer/capitalTOResult.ejs"
    },
    initParams: function () {
        var a = this;
        a._conversationId = "", a._saveAsPayeeYn = !0, a._sendmessageYn = !0, a._executeType = "0", a._payeetId = "", a._hashTbFromAcc = new Common.Hashtable, a._hashRelaToAcc = new Common.Hashtable, a.cashRemitType = new Common.Hashtable, a.accountType = ["119", "101", "188", "104", "103", "190", "199", "107"], a.transDirect = "0", a.yht_accountType = "", a.currentIndex = "0", a.pageSize = "10"
    },
    showBubble: function (a) {
        var b = this, c = b.el.find(".tips-radius02");
        b._el_width || (b._el_width = c.width());
        var d, e;
        document.documentElement && document.documentElement.scrollTop ? (d = document.documentElement.scrollTop, e = document.documentElement.scrollLeft) : document.body && (d = document.body.scrollTop, e = document.body.scrollLeft);
        var f = $(a).position().left - b._el_width - e + 208, g = $(a).position().top + $(a).height() + d;
        b.el.append(c.css({left: f + "px", top: g + "px", position: "absolute"}))
    },
    init: function () {
        var a = this;
        a.initParams(), Common.LightBox.show(), a.el.html(a.ejsPath.main, {}, function () {
            Common.SF.showSelector("PB031", function () {
                a._conversationId = Common.SF.get("conversationId"), a.firstChangeLanFlag = !0, a._fillSelectData(), DateUtil.getCurrentTime(function (b) {
                    a.sysDate = b.date, a.el.find("#txt_execdate_6145, #txt_51_5107").val(CU.Date.addDays(b.date, 1)).datepicker();
                    var c = {
                        selectedDate: {
                            year: b.date.split("/")[0],
                            month: b.date.split("/")[1],
                            day: b.date.split("/")[2]
                        }
                    };
                    $("#txt_52_5111").val("").datepicker(c), Common.LightBox.hide()
                }), a.el.find("#btnQueryBalance,#btnQueryOnlineBalance").on("click", function () {
                    a._queryAccountDetail()
                }), Common.upperAmount(a, "#txt_transamount_471", "#capital_amount"), Common.upperAmount(a, "#txt_transamount_68732", "#online_capital_amount"), a.queryAccountNumber(null, !0), a.el.find("#txt_transinaccparent_458").on("focus", function () {
                    a.queryAccountNumber(function () {
                        $("#txt_transinaccparent_458").trigger("keyup")
                    }), a.showBubble(this)
                }).on("blur", function () {
                    a.el.find(".tips-radius02").hide(), a._receiveNumber = $("#txt_transinaccparent_458").val()
                }).on("keyup", function (b) {
                    var c = $(b).val(), d = c.replace(/[^0-9]/g, "");
                    if (c != d && $(b).val(d), d) {
                        var e = $("#show_account_infor_1900 li"), f = 0, g = 0;
                        if ($.each(e, function (a, b) {
                                LiquidMetal.score($(b).find("a").attr("accountnumber"), d) > 0 ? ($(b).show(), f++ < 5 && (g += $(b).height())) : $(b).hide()
                            }), 0 == f) {
                            for (var h = "", i = 0; i < d.length; i += 4)h += d.substring(i, i + 4) + " ";
                            a.el.find("#inputAccount").text(h.replace(/(\s*$)/g, "")), a.el.find(".tips-radius02").show(), $("#show_account_infor_1900").css({
                                height: "0px",
                                border: "none"
                            })
                        } else a.el.find(".tips-radius02").hide(), $("#show_account_infor_1900").css({
                            height: g + 1 + "px",
                            border: "1px solid #b5bbc7"
                        })
                    } else a.el.find(".tips-radius02").hide(), $("#show_account_infor_1900 li").hide(), $("#show_account_infor_1900").css({
                        height: "0px",
                        border: "none"
                    })
                }), $("#wrapper").off("click").on("click", function (a) {
                    $("#show_account_infor_1900").length > 0 && "txt_transinaccparent_458" != $(a).attr("id") && $("#show_account_infor_1900").remove()
                }), a.el.find("#btn_selecttoaccount_456").on("click", function () {
                    $(this).hasClass("btn-disabled") || (a._selectPayeeAccount(!1), a._setObjAbsCenter = 1)
                }), a.el.find("#btn_selecttoaccount_457").on("click", function () {
                    $(this).hasClass("btn-disabled") || (a._selectPayeeAccount(!0), a._setObjAbsCenter = 2)
                }), a.el.find("#cb_sendmessagetopayee_5291_1").on("click", function (a) {
                    $(a).attr("checked") ? $("#liPayeemobile").show() : ($("#txt_payeemobile_553").val(""), $("#liPayeemobile").hide())
                }), a.el.find("#rd_exec_3955_1").on("click", function (b) {
                    a.el.find("#stool-selector input[name='rd_choose_security_tool_17637']").attr("disabled", !1).next("label").removeClass("text-darkengray"), $("#liDateExec, #liStartDate, #liCycle, #liEndDate").hide(), a._executeType = $(b).val()
                }), a.el.find("#rd_exec_3955_2").on("click", function (b) {
                    if ("2" == a.transDirect)$("#liDateExec").show(), $("#liStartDate, #liCycle, #liEndDate").hide(), a._executeType = $(b).val(); else {
                        var c = a.el.find("#stool-selector #rd_choose_security_tool_17637_2");
                        c.size() > 0 ? (a.el.find("#stool-selector input[name='rd_choose_security_tool_17637']").attr("disabled", !0).attr("checked", !1).next("label").addClass("text-darkengray"), c.attr("disabled", !1).next("label").removeClass("text-darkengray"), $.browser.msie && c.on("click", function () {
                            c.trigger("change")
                        }), c.trigger("click"), $("#liDateExec").show(), $("#liStartDate, #liCycle, #liEndDate").hide(), a._executeType = $(b).val()) : (a.el.find("#rd_exec_3955_1").trigger("click"), Common.LightBox.showMessage(CU.getDictNameByKey("l90011")))
                    }
                }), a.el.find("#rd_exec_3955_3").on("click", function (b) {
                    if ("2" == a.transDirect)$("#liDateExec").hide(), $("#liStartDate, #liCycle, #liEndDate").show(), a._executeType = $(b).val(); else {
                        var c = a.el.find("#stool-selector #rd_choose_security_tool_17637_2");
                        c.size() > 0 ? (a.el.find("#stool-selector input[name='rd_choose_security_tool_17637']").attr("disabled", !0).attr("checked", !1).next("label").addClass("text-darkengray"), c.attr("disabled", !1).next("label").removeClass("text-darkengray"), $.browser.msie && c.on("click", function () {
                            c.trigger("change")
                        }), c.trigger("click"), $("#liDateExec").hide(), $("#liStartDate, #liCycle, #liEndDate").show(), a._executeType = $(b).val()) : (a.el.find("#rd_exec_3955_1").trigger("click"), Common.LightBox.showMessage(CU.getDictNameByKey("l90011")))
                    }
                }), a.el.find("#btnBocTransferNext").on("click", function () {
                    a._bocTransferNext()
                }), a.el.find("#btnBocTransferEmpty").on("click", function () {
                    a._resetBocTransfer()
                }), a.el.find("#btn_queryacc_25402").on("click", function () {
                    a.queryAccount()
                }), a.el.find("#rd_moneyremit_25406_1,#rd_moneyremit_25406_2").on("click", function () {
                    a.isOutCrcd || a.isInCrcd || a._cash_remit("#available_balance", a.sel_kind_of_currencies_rela_25404.val, a.cash_remit_list, this.value)
                }), a.el.find("#txt_transinaccparent_458,#txt_payeename_455").on("change", function () {
                    if (a._hashRelaToAcc.contains($("#txt_transinaccparent_458").val())) {
                        var b = a._hashRelaToAcc.item($("#txt_transinaccparent_458").val()).accountName == $("#txt_payeename_455").val();
                        $("#chkSaveAsPayee").attr("disabled", b).attr("checked", !b)
                    } else $("#chkSaveAsPayee").attr("disabled", !1).attr("checked", !0);
                    $("#cb_sendmessagetopayee_5291_1").attr("checked") || ($("#cb_sendmessagetopayee_5291_1").attr("checked", !0), $("#liPayeemobile").show())
                })
            })
        })
    },
    _fillSelectData: function () {
        var a = this;
        Common.postRequest(new Model("PsnCommonQueryAllChinaBankAccount", {accountType: ["104", "119", "188", "101", "190", "199"]})).then(function (b) {
            var c = CU.ajaxDataHandle(b);
            if (c) {
                var d = [];
                $.each(c, function (b, c) {
                    var e = "<span lan='payeraccount_" + c.accountType + "'>" + CU.getDictNameByKey("payeraccount_" + c.accountType) + "</span><span class='ml5 mr5'>" + StringUtil.maskAccount(c.accountNumber) + "</span><span>" + c.nickName + "</span><span class='ml5' lan='payeraccount_" + c.accountIbkNum + "'>" + CU.getDictNameByKey("payeraccount_" + c.accountIbkNum) + "</span>";
                    d.push({
                        key: c.accountNumber,
                        val: e
                    }), a._hashTbFromAcc.add(c.accountNumber, c), a._hashTbFromAcc.add("accountNumber", c.accountNumber)
                }), a._fromAccountSelelct = new ITSelect({
                    data: d,
                    appendTo: $("#sel_transoutaccparent_452,#sel_online_to_account").empty(),
                    defValue: d[0].key,
                    defText: d[0].val,
                    oddCls: "even",
                    callback: function (b) {
                        if (b.val == $("#txt_transinaccparent_458").attr("accountnumber"))return Common.LightBox.showMessage(CU.getDictNameByKey("l2241")), void a._fromAccountSelelct.reset();
                        a.validateAccount = !0, a.yht_accountType = a._hashTbFromAcc.item(b.val).accountType;
                        var e = a.el.find("#BocTransfer_main_account,#stool-selector,#divBocTransferMainFooter"), f = a.el.find("#online_account_choose,#online_acc_tips");
                        if ("199" == a.yht_accountType)e.show(), f.hide(), 2 != a.transDirect ? "1" == a.transDirect && $("#txt_payeename_455").val().length > 0 && a._receiveNumber.length > 0 ? (Common.LightBox.showMessage(CU.getDictNameByKey("l56093")), a.validateAccount = !1, a._fromAccountSelelct.reset(), a.yht_accountType = a._hashTbFromAcc.item(d[0].key).accountType) : ($("#span_payeename_455,#span_transinaccparent_458").show(), $("#txt_payeename_455,#txt_transinaccparent_458").addClass("disabled").attr("disabled", !0).hide(), $("#btn_selecttoaccount_456").addClass("btn-disabled"), Common.LightBox.showMessage(CU.getDictNameByKey("l50873")), a.availableBalance()) : a.availableBalance(); else if ("190" == a.yht_accountType) {
                            var g = a._hashTbFromAcc.item(b.val).accountId + "";
                            $("#sel_online_from_account").text(""), $("#txt_transamount_68732").val(""), e.hide(), f.show(), a.onlineAcconutChoose(g, e, f, c)
                        } else $("#btn_selecttoaccount_456").removeClass("btn-disabled"), e.show(), f.hide(), a.availableBalance(), "0" == a.transDirect && ($("#span_payeename_455,#span_transinaccparent_458").hide(), $("#txt_payeename_455,#txt_transinaccparent_458").removeClass("disabled").attr("disabled", !1).show());
                        a.firstChangeLanFlag && (a.el.find("#divBocTransferMain").show(), CU.changeLan(a.el.find("#divBocTransferMain")), a.firstChangeLanFlag = !1)
                    }
                }), a.validateAccount = !0, a._fromAccountSelelct.setValue(d[0].key)
            }
            CU.changeLan(a.el.find("#sel_transoutaccparent_452"))
        }), a.el.find("input[name='rd_title_1102']").on("click", function () {
            "M" == $(this).val() ? $("#showMonth").show() : $("#showMonth").hide()
        }), CU.changeLan(a.el)
    },
    onlineAcconutChoose: function (a, b, c, d) {
        var e = this;
        e._bankObject = null, Common.postRequest(new Model("PsnOFAAccountStateQuery")).then(function (f) {
            var g = CU.ajaxDataHandle(f);
            if (g && "S" == g.openStatus) {
                for (var h = g.bankAccount ? g.bankAccount : g.mainAccount, i = 0; i < d.length; i++)if (h.accountId === d[i].accountId) {
                    e._bankObject = d[i];
                    break
                }
                e._bankObject = e._bankObject ? e._bankObject : h, e.el.find("#sel_online_from_account").text(StringUtil.maskAccount(e._bankObject.accountNumber)), Common.postRequest(new Model("PsnAccountQueryAccountDetail", {accountId: a})).then(function (a) {
                    var d = CU.ajaxDataHandle(a), f = [];
                    e.cashRemitType = new Common.Hashtable, d ? (e.cashRemitType && e.cashRemitType.clear(), $.each(d.accountDetaiList, function (a, b) {
                        e.inArray(b.currencyCode, f) || f.push({
                            key: b.currencyCode,
                            val: "<span lan='currency_type_" + b.currencyCode + "'>" + CU.getDictNameByKey("currency_type_" + b.currencyCode) + "</span>"
                        }), e.cashRemitType.contains(b.currencyCode) ? (e.cashRemitType.remove(b.currencyCode), "001" != b.currencyCode && e.cashRemitType.add(b.currencyCode, "all")) : e.cashRemitType.add(b.currencyCode, b.cashRemit)
                    }), e.currencySelect = new ITSelect({
                        data: f,
                        appendTo: $("#sel_kind_of_currencies_68729").empty(),
                        defValue: "",
                        defText: Common.ItSelectData.pleaseSelect,
                        oddCls: "odd",
                        callback: function (a) {
                            var b = a.val, c = e.cashRemitType.item(b);
                            Common.VU.addAmountValid(b, "#txt_transamount_68732"), e.controlMoneyRemit(c, "#rd_cashremittype_80678_1", "#rd_cashremittype_80678_2", function () {
                                var a = "001" == b ? "00" : e.el.find("[name='rd_cashremittype_80678']:checked").get(0).value;
                                e._cash_remit("#online_available_balance", b, d.accountDetaiList, a), e.el.find("[name='rd_cashremittype_80678']").unbind("click").bind("click", function () {
                                    e._cash_remit("#online_available_balance", b, d.accountDetaiList, this.value)
                                })
                            })
                        }
                    }), e.currencySelect.setValue(f.length > 0 ? f[0].key : ""), CU.changeLan($("#online_account_choose")), b.hide(), c.show()) : (e.currencySelect = new ITSelect({
                        data: f,
                        appendTo: $("#sel_kind_of_currencies_68729").empty(),
                        oddCls: "odd"
                    }), e.currencySelect.enable(), CU.changeLan($("#online_account_choose")), b.hide(), c.show())
                })
            } else g && "B" == g.openStatus ? (Common.LightBox.showMessage(CU.getDictNameByKey("l55243")), CU.changeLan($("#online_account_choose")), b.hide(), c.show()) : g && "R" == g.openStatus && (Common.LightBox.showMessage(CU.getDictNameByKey("l55242")), CU.changeLan($("#online_account_choose")), b.hide(), c.show())
        })
    },
    availableBalance: function () {
        var a = this, b = a._hashTbFromAcc.item(a._fromAccountSelelct.val), c = b.accountId + "", d = {accountId: c}, e = null;
        a._queryDetailList = [], "104" == b.accountType ? (e = new Model("PsnCrcdCurrencyQuery", {accountNumber: b.accountNumber}), Common.LightBox.show(), Common.postRequest(e).then(function (b) {
            var d = CU.ajaxDataHandle(b);
            if (a.num2 = 0, d) {
                a.num2++;
                var e = ("2" == a.transDirect ? a.sel_kind_of_currencies_rela_25404.val : "001", []);
                d.currency1 && d.currency1.code && e.push(new Model("PsnCrcdQueryAccountDetail", {
                    accountId: c,
                    currency: d.currency1.code
                })), d.currency2 && d.currency2.code && e.push(new Model("PsnCrcdQueryAccountDetail", {
                    accountId: c,
                    currency: d.currency2.code
                })), Common.postRequest(e).then(function (b) {
                    var c, d = CU.ajaxDataHandle(b);
                    if (2 == e.length && (c = CU.ajaxDataHandle(b, 1)), CU.isSuccesful(b))if (a.el.find("#txt_transinaccparent_458").removeClass("disabled").removeAttr("readonly"), a.el.find("#btn_selecttoaccount_456,#btn_selecttoaccount_457").removeClass("btn-disabled"), Common.LightBox.hide(), d && d.crcdAccountDetailList && d.crcdAccountDetailList.length > 0) {
                        if (a._queryDetailList = d.crcdAccountDetailList, c && (a._queryDetailList = a._queryDetailList.concat(c.crcdAccountDetailList)), 2 == a.transDirect) {
                            var f = a._hashTbFromAcc.item(a._fromAccountSelelct.val), g = $("#txt_transinaccparent_458").attr("accountNumber"), h = a._hashRelaToAcc.item(g);
                            a._showRelaInfor(f, h, g)
                        }
                        a.el.find("#available_deposit_amount").text(d.crcdAccountDetailList[0].loanBalanceLimit.formatNum(a.sel_kind_of_currencies_rela_25404 ? a.sel_kind_of_currencies_rela_25404.val : "001")).parent().parent().show(), a.el.find("#available_balance").parent().parent().hide(), a.remainde_balance = d.crcdAccountDetailList[0].loanBalanceLimit;
                        var i = "", j = d.crcdAccountDetailList;
                        c && (j = j.concat(c.crcdAccountDetailList)), a.cacheCrcd = {}, $.each(j, function (b, c) {
                            i += "<div>" + c.loanBalanceLimit.formatNum(c.currency) + '<span class="ml5" lan=currency_type_' + c.currency + "></span></div>", a.cacheCrcd[c.currency] = c.loanBalanceLimit
                        }), a.el.find("#available_deposit_amount").empty().html($(i)), CU.changeLan(a.el.find("#available_deposit_amount"))
                    } else a.el.find("#available_deposit_amount").text("-").parent().parent().show(), a.el.find("#available_balance").parent().parent().hide(), a.remainde_balance = "0"; else Common.LightBox.hide(), a.el.find("#available_deposit_amount").text("-").parent().parent().show(), a.el.find("#available_balance").parent().parent().hide(), a.remainde_balance = "0", a.el.find("#txt_transinaccparent_458").val("").addClass("disabled").attr("readonly", !0), a.el.find("#btn_selecttoaccount_456,#btn_selecttoaccount_457").addClass("btn-disabled")
                })
            } else Common.LightBox.showMessage(CU.getDictNameByKey("l44606")), Common.LightBox.hide(), a.el.find("#available_deposit_amount").text("-").parent().parent().show(), a.el.find("#available_balance").parent().parent().hide(), a.remainde_balance = "0"
        })) : (Common.LightBox.show(), Common.postRequest(new Model("PsnAccountQueryAccountDetail", d)).then(function (c) {
            var d = CU.ajaxDataHandle(c);
            if (CU.isSuccesful(c))if (Common.LightBox.hide(), a.el.find("#txt_transinaccparent_458").removeClass("disabled").removeAttr("readonly"), a.el.find("#btn_selecttoaccount_456,#btn_selecttoaccount_457").removeClass("btn-disabled"), d && d.accountDetaiList && d.accountDetaiList.length > 0) {
                if (a._queryDetailList = d.accountDetaiList, 2 == a.transDirect) {
                    var e = a._hashTbFromAcc.item(a._fromAccountSelelct.val), f = $("#txt_transinaccparent_458").attr("accountNumber"), g = a._hashRelaToAcc.item(f);
                    a._showRelaInfor(e, g, f)
                }
                var h = 0, i = $("[name='rd_moneyremit_25406']:checked"), j = "", k = null;
                a.num2 = 0, a.cashRemitType && a.cashRemitType.clear(), $.each(d.accountDetaiList, function (b, c) {
                    "001" == c.currencyCode && a.num2++, 2 != a.transDirect ? "001" == c.currencyCode && (h++, a.el.find("#available_balance").text(c.availableBalance.formatNum("001")).parent().parent().show(), a.el.find("#available_deposit_amount").parent().parent().hide(), a.remainde_balance = c.availableBalance) : (i.length > 0 ? (j = i.attr("Value"), k = c.currencyCode == a.sel_kind_of_currencies_rela_25404.val && j == c.cashRemit) : k = c.currencyCode == a.sel_kind_of_currencies_rela_25404.val, k && (h++, a.el.find("#available_balance").text(c.availableBalance.formatNum(a.sel_kind_of_currencies_rela_25404.val, !1, !0)).parent().parent().show(), a.el.find("#available_deposit_amount").parent().parent().hide(), a.remainde_balance = c.availableBalance)), a.cashRemitType.contains(c.currencyCode) ? (a.cashRemitType.remove(c.currencyCode), "001" != c.currencyCode && a.cashRemitType.add(c.currencyCode, "all")) : a.cashRemitType.add(c.currencyCode, c.cashRemit)
                }), (0 == a.num2 || "199" == b.accountType) && ($("#span_payeename_455,#span_transinaccparent_458").show(), $("#txt_payeename_455,#txt_transinaccparent_458").addClass("disabled").attr("disabled", !0).hide(), $("#btn_selecttoaccount_456").addClass("btn-disabled"), 2 != a.transDirect && Common.LightBox.showMessage(CU.getDictNameByKey(0 == a.num2 ? "l54831" : "l50873"))), 0 == h && ($("#divBocTransferMain").find("#available_balance").text("-").parent().parent().show(), a.el.find("#available_deposit_amount").parent().parent().hide(), a.remainde_balance = 0, 2 != a.transDirect && Common.LightBox.showMessage(CU.getDictNameByKey("l54831")))
            } else $("#divBocTransferMain").find("#available_balance").text("-").parent().parent().show(), a.el.find("#available_deposit_amount").parent().parent().hide(), a.remainde_balance = "0"; else Common.LightBox.hide(), $("#divBocTransferMain").find("#available_balance").text("-").parent().parent().show(), a.el.find("#available_deposit_amount").parent().parent().hide(), a.remainde_balance = "0", a.el.find("#txt_transinaccparent_458").val("").addClass("disabled").attr("readonly", !0), a.el.find("#btn_selecttoaccount_456,#btn_selecttoaccount_457").addClass("btn-disabled")
        }))
    },
    _bocTransferNext: function () {
        var a = this;
        if ("190" == a._hashTbFromAcc.item(a._fromAccountSelelct.val).accountType)return formValid.checkAll("#online_account_choose") ? (a.onlineAccountConfirm(), !1) : !1;
        if ($("#sel_kind_of_currencies_rela_25404").hasClass("hide") ? $("#sel_kind_of_currencies_rela_25404").attr("validategroup", "{required:false}") : $("#sel_kind_of_currencies_rela_25404").attr("validategroup", "{required:true}"), formValid.checkAll("#divBocTransferMain")) {
            if ($("#txt_payeename_455").val().length < 1 || a._receiveNumber.length < 1 || !a.validateAccount)return Common.LightBox.showMessage(CU.getDictNameByKey("l50873")), !1;
            if ("0" == a._executeType) {
                if (a.isInCrcd) {
                    var b = a.el.find("input[name=rd_moneyremit_25406]:checked").val(), c = "001" == a.sel_kind_of_currencies_rela_25404.val ? a.sel_kind_of_currencies_rela_25404.val : a.sel_kind_of_currencies_rela_25404.val;
                    b && (c += b);
                    var d = $("#txt_transamount_471").val().replace(/\,/g, ""), e = a.cacheDebit[c];
                    if (a.remainde_balance = e, Number(e) < Number(d))return Common.LightBox.showMessage(CU.getDictNameByKey("l52989")), !1
                }
                if (a.isOutCrcd && !a.isInCrcd) {
                    var b = a.el.find("input[name=rd_moneyremit_25406]:checked").val(), c = "001" == a.sel_kind_of_currencies_rela_25404.val ? a.sel_kind_of_currencies_rela_25404.val : a.sel_kind_of_currencies_rela_25404.val;
                    b && (c += b);
                    var d = $("#txt_transamount_471").val().replace(/\,/g, ""), e = a.cacheCrcd[c];
                    if (a.remainde_balance = e, Number(e) < Number(d))return Common.LightBox.showMessage(CU.getDictNameByKey("l52989")), !1
                }
                if (!(a.remainde_balance && Number(a.remainde_balance - $("#txt_transamount_471").val().replace(/\,/g, "")) >= 0))return Common.LightBox.showMessage(CU.getDictNameByKey("l52989")), !1
            }
            if ("2" == a._executeType && (a.el.find("input[name='rd_title_1102']:checked").length <= 0 || !a.el.find("input[name='rd_title_1102']:checked").val()))return void Common.LightBox.showMessage(CU.getDictNameByKey("l0105") + CU.getDictNameByKey("l0438"));
            var f = a._hashTbFromAcc.item(a._fromAccountSelelct.val), g = a._receiveNumber, h = f.accountId + "", i = f.accountType, j = f.accountNumber, k = f.nickName, l = f.accountIbkNum, m = $("#txt_payeename_455").val(), n = g, o = $("#txt_transamount_471").val(), p = $("#txt_postscript_551").val().trim(), q = $("#txt_payeemobile_553").val(), r = $("#txt_execdate_6145").val(), s = $("#txt_51_5107").val(), t = a.el.find("input[name='rd_title_1102']:checked").val(), u = $("#txt_52_5111").val(), v = Common.VU.validateExecutePeriod(a.el, "rd_exec_3955", a.sysDate, "txt_execdate_6145", "txt_51_5107", "txt_52_5111");
            if (v)return void Common.LightBox.showMessage(v);
            if ("2" != a._executeType || !(a.el.find("input[name='rd_title_1102']:checked").length <= 0) && a.el.find("input[name='rd_title_1102']:checked").val()) {
                a._saveAsPayeeYn = $("#chkSaveAsPayee").attr("checked"), a._sendmessageYn = $("#cb_sendmessagetopayee_5291_1").attr("checked");
                var w = {
                    fromAccountId: h + "",
                    payeeName: m,
                    payeeActno: n,
                    amount: o.replace(/\,/g, ""),
                    currency: "001",
                    remark: p,
                    executeType: a._executeType,
                    _combinId: Common.SF.get("combinId")
                };
                if ("1" == a.transDirect ? w.payeeId = a._payeetId : a._payeetId = "", 1 == a._sendmessageYn && (w.payeeMobile = q), "1" == a._executeType && (w.executeDate = r), "2" == a._executeType && (w.startDate = s, w.cycleSelect = t, w.endDate = u), "2" == a.transDirect)a._relaTransNext(); else {
                    if (!Common.SF.check())return;
                    Common.LightBox.show(), Common.postRequest(new Model("1" == a.transDirect ? "PsnDirTransBocTransferVerify" : "PsnTransBocTransferVerify", w, a._conversationId)).then(function (b) {
                        var c = CU.ajaxDataHandle(b);
                        if (c) {
                            a.toAccountType = c.toAccountType, a.payeeBankNum = c.payeeBankNum, a.transinAcc = n;
                            var d = {
                                payeeName: m,
                                toAccountId: n + "",
                                toAccountType: c.toAccountType,
                                payeeBankNum: c.payeeBankNum,
                                payeeMobile: q
                            }, e = {
                                accountType: i,
                                accountNumber: j,
                                nickName: k,
                                accountIbkNum: l,
                                transinAcc: n,
                                payeeName: m,
                                toAccountType: c.toAccountType,
                                payeeBankNum: c.payeeBankNum,
                                transAmount: o,
                                remark: p,
                                payeemobile: q,
                                executeType: a._executeType,
                                execdate: r,
                                startDate: s,
                                cycle: CU.getDictNameByKey("cycle_" + t),
                                endDate: u,
                                needExecCnt: a._getNeetCount(s, u, t)
                            }, f = {
                                serviceId: "1" == a.transDirect ? "PB033" : "PB031",
                                fromAccountId: h + "",
                                currency: "001",
                                amount: o.formatNum(w.currency),
                                remark: p,
                                payeeActno: n,
                                payeeName: m
                            };
                            a.conmmissionCharge(f, i, a.toAccountType, function (b) {
                                $.extend(e, b), a.conmmissionChargeResult = b, a.preCommissionCharge = e.preCommissionCharge, a.remitSetMealFlag = e.remitSetMealFlag, a.el.find("#divBocTransferConfirm").html(a.ejsPath.confirm, e, function () {
                                    e.flag && $("#jizhunfeiyong_confirm").show(), a._sendmessageYn ? $("#liPayeemobileConfirm").show() : $("#liPayeemobileConfirm").hide(), "0" == a._executeType ? $("#liExecdateConfirm, #liStartdateConfirm, #liCycleconfirm, #liEnddateConfirm, #liNeedExecuteCntConfirm").hide() : "1" == a._executeType ? ($("#liStartdateConfirm, #liCycleconfirm, #liEnddateConfirm, #liNeedExecuteCntConfirm").hide(), $("#liExecdateConfirm").show()) : "2" == a._executeType && ($("#liExecdateConfirm").hide(), $("#liStartdateConfirm, #liCycleconfirm, #liEnddateConfirm, #liNeedExecuteCntConfirm").show()), a.el.find("#divBocTransferMain, #divBocTransferMainFooter").hide(), a.el.find("#divBocTransferConfirm").show(), Common.SF.appendInputTo("#divConfirm ul.layout-lr", function () {
                                        a.el.find("#btnBocTransferBefore").on("click", function () {
                                            a.el.find("#divBocTransferMain, #divBocTransferMainFooter").show(), $("#pageNo em").text($("#divBocTransferMain p.page-num em").text()), a.el.find("#divBocTransferConfirm").hide()
                                        }), a.bindBocTransferConfirm(w, d), CU.changeLan(a.el.find("#divBocTransferConfirm"))
                                    }, c)
                                })
                            })
                        } else Common.LightBox.hide()
                    })
                }
            }
        }
    },
    onlineAccountConfirm: function () {
        var a = this, b = a._hashTbFromAcc.item(a._fromAccountSelelct.val), c = a.currencySelect.val, d = "001" == c ? "00" : a.el.find("input[type='radio'][name='rd_cashremittype_80678']:checked").val(), e = {
            currency: c,
            cashRemit: d,
            amount: $("#txt_transamount_68732").val(),
            fromAccInformation: b,
            toAccInformation: a._bankObject
        }, f = a.el.find("#divBocTransferConfirm");
        Common.LightBox.show(), Common.postRequest(CU.createTokenId(a._conversationId)).then(function (b) {
            a.tokenId = CU.ajaxDataHandle(b), a.tokenId ? f.html(a.ejsPath.capitalTransferConfirm, e, function () {
                CU.changeLan(f), Common.LightBox.hide(), a.el.find("#divBocTransferMain").hide(), f.show(), a.el.find("#btn_forward_68753").on("click", function () {
                    f.hide(), a.el.find("#divBocTransferMain").show()
                }), a.el.find("#btn_confirm_68752").on("click", function () {
                    a.onlineAccountSuccess(e, f)
                })
            }) : Common.LightBox.hide()
        })
    },
    onlineAccountSuccess: function (a, b) {
        var c = this, d = {
            financialAccountId: a.fromAccInformation.accountId,
            bankAccountId: a.toAccInformation.accountId,
            currency: a.currency,
            cashRemit: a.cashRemit,
            amount: a.amount,
            token: c.tokenId
        };
        Common.LightBox.show(), Common.postRequest(new Model("PsnOFAFinanceTransfer", d, c._conversationId)).then(function (d) {
            var e = CU.ajaxDataHandle(d);
            if (e) {
                a.transStatus = e.transStatus, a.transId = e.transId;
                var f = c.el.find("#divBocTransferFinish");
                f.html(c.ejsPath.capitalTransferResult, a, function () {
                    CU.changeLan(f), Common.LightBox.hide(), b.hide(), f.show(), c.el.find("#btn_print_online").on("click", function () {
                        f.find("#print_area_online").printArea()
                    })
                })
            } else Common.postRequest(new Model("PSNGetTokenId", c._conversationId)).then(function (a) {
                c.tokenId = CU.ajaxDataHandle(a), Common.LightBox.hide()
            })
        })
    },
    conmmissionCharge: function (a, b, c, d) {
        104 == b || 104 == c || 103 == b || 103 == c ? d({
            needCommissionCharge: "0.00",
            preCommissionCharge: "0.00",
            remitSetMealFlag: "0",
            flag: !1
        }) : Common.postRequest(new Model("PsnTransGetBocTransferCommissionCharge", a)).then(function (a) {
            var b = CU.ajaxDataHandle(a);
            d("1" == b.getChargeFlag ? b.needCommissionCharge >= 0 && "0" == b.remitSetMealFlag ? {
                needCommissionCharge: b.needCommissionCharge,
                preCommissionCharge: b.preCommissionCharge,
                remitSetMealFlag: b.remitSetMealFlag,
                flag: !0
            } : {
                needCommissionCharge: b.needCommissionCharge,
                preCommissionCharge: "0.00",
                remitSetMealFlag: b.remitSetMealFlag,
                flag: !1
            } : {needCommissionCharge: "", preCommissionCharge: "", remitSetMealFlag: "0", flag: !0})
        })
    },
    bindBocTransferConfirm: function (a, b) {
        var c = this;
        Common.postRequest(CU.createTokenId(c._conversationId)).then(function (d) {
            c.confirmToken = CU.ajaxDataHandle(d), c.confirmToken ? (Common.LightBox.hide(), c.el.find("#btnBocTransferConfirm").off("click").on("click", function () {
                return formValid.checkAll(c.el) ? void c._bocTransferConfirm(a, b) : !1
            })) : Common.LightBox.hide()
        })
    },
    _resetBocTransfer: function () {
        var a = this;
        a.init()
    },
    _bocTransferConfirm: function (a, b) {
        var c = this, d = Common.SF.get("Smc"), e = Common.SF.get("Otp"), f = {
            fromAccountId: a.fromAccountId + "",
            payeeName: a.payeeName,
            payeeActno: a.payeeActno,
            toAccountType: b.toAccountType,
            payeeBankNum: b.payeeBankNum,
            payeeId: c._payeetId,
            amount: a.amount,
            currency: "001",
            remark: a.remark,
            executeType: c._executeType,
            _signedData: null,
            token: c.confirmToken
        };
        Common.AC.enabled && (f.devicePrint = encode_deviceprint()), 1 == c._sendmessageYn && (f.payeeMobile = a.payeeMobile), "1" == c._executeType && (f.executeDate = a.executeDate), "2" == c._executeType && (f.startDate = a.startDate, f.cycleSelect = a.cycleSelect, f.endDate = a.endDate), d && $.extend(f, {
            activ: d.Version,
            state: d.State,
            Smc: d.Value,
            Smc_RC: d.RandomKey_C
        }), e && $.extend(f, {activ: e.Version, state: e.State, Otp: e.Value, Otp_RC: e.RandomKey_C});
        var g = Common.SF.get("signedData");
        if (g) {
            if (!g.result)return !1;
            f._signedData = g.result
        }
        Common.LightBox.show();
        var h = "1" == c.transDirect ? new Model("PsnDirTransBocTransferSubmit", f, c._conversationId) : new Model("PsnTransBocTransferSubmit", f, c._conversationId);
        Common.postRequest(h).then(function (a) {
            var d = CU.ajaxDataHandle(a);
            d ? d && CU.isSuccesful(a) ? c._saveAsPayeeYn ? Common.postRequest(CU.createConversation()).then(function (a) {
                var e = CU.ajaxDataHandle(a);
                e ? Common.postRequest(CU.createTokenId(e)).then(function (a) {
                    var g = CU.ajaxDataHandle(a);
                    g ? (b.token = g, Common.postRequest(new Model("PsnTransBocAddPayee", b, e)).then(function (a) {
                        CU.ajaxDataHandle(a), c.preventForSwindle(d, f, b)
                    })) : Common.LightBox.hide()
                }) : Common.LightBox.hide()
            }) : c.preventForSwindle(d, f, b) : c.showSuccess(d, f, b) : (Common.LightBox.hide(), Common.SF.clear(), Common.postRequest(CU.createTokenId(c._conversationId)).then(function (a) {
                c.confirmToken = CU.ajaxDataHandle(a)
            }))
        })
    },
    preventForSwindle: function (a, b, c) {
        var d = this;
        d.ac = new Common.AC({
            data: a, el: d.el, conversationId: d._conversationId, ok: function (a) {
                Common.postRequest(new Model("PsnTransBocTransferSubmitReinforce", d.ac.get(), d._conversationId)).then(function (e) {
                    var f = d.ac.ajaxDataHandle(e);
                    CU.isSuccesful(e) ? (d.ac.hide(), d.showSuccess(f, b, c)) : Common.LightBox.hide(), a()
                })
            }
        }), "ALLOW" === d.ac.result && d.showSuccess(a, b, c)
    },
    showSuccess: function (a, b) {
        var c = this, d = {
            toAccountType: c.toAccountType,
            batSeq: a.batSeq,
            transactionId: a.transactionId,
            fromAccountType: a.fromAccountType,
            fromAccountNum: a.fromAccountNum,
            fromAccountNickname: a.fromAccountNickname,
            fromIbkNum: a.fromIbkNum,
            transinAcc: c.transinAcc,
            payeeName: b.payeeName,
            payeeBankNum: c.payeeBankNum,
            currency: a.currency,
            transAmount: a.amount,
            commissionCharge: null != a.commissionCharge ? a.commissionCharge.formatNum() : null,
            postage: null != a.postage ? a.postage.formatNum() : null,
            remark: b.remark,
            payeeMobile: b.payeeMobile,
            executeType: $("#div_executemode_2598").text(),
            execute_type: c._executeType,
            status: a.status,
            execdate: b.executeDate ? b.executeDate : null,
            startDate: b.startDate ? b.startDate : null,
            cycle: b.cycleSelect ? b.cycleSelect : null,
            endDate: b.endDate ? b.endDate : null,
            needCount: a.needCount ? a.needCount : null,
            finalCommissionCharge: a.finalCommissionCharge
        };
        d.finalCommissionCharge = 104 == d.toAccountType || 104 == d.fromAccountType || 1 == c.remitSetMealFlag || 103 == d.toAccountType || 103 == d.fromAccountType ? 0 : 0 == d.execute_type ? a.finalCommissionCharge : c.preCommissionCharge, "0" == c._executeType && (d.remainde_balance = c.remainde_balance - d.transAmount - Number(d.finalCommissionCharge)), $.extend(d, c.conmmissionChargeResult), c.el.find("#divBocTransferFinish").html(c.ejsPath.finish, d, function () {
            Common.LightBox.hide(), c.conmmissionChargeResult.flag && $("#jizhunfeiyong_finish").show(), c.el.find("#btn_print_3084").on("click", function () {
                $("#divBocTransferFinish").printArea()
            }), c._sendmessageYn ? c.el.find("#liPayeemobileFinish").show() : c.el.find("#liPayeemobileFinish").hide(), "0" == c._executeType ? (c.el.find("#liOnlineBankingTransactionSn, #liPoundage, #liTelegraphicTransferCost").show(), c.el.find("#liExecdateFinish,#liExecuteResult").hide(), "1" == c.transDirect && c.el.find("#liExecuteResult").show(), c.el.find("#liStartdateFinish, #liCycleFinish, #liEnddateFinish, #liNeedExecuteCntFinish").hide()) : "1" == c._executeType ? (c.el.find("#liOnlineBankingTransactionSn,#liExecuteResult").hide(), c.el.find("#liExecdateFinish").show(), c.el.find("#liStartdateFinish, #liCycleFinish, #liEnddateFinish, #liNeedExecuteCntFinish").hide()) : "2" == c._executeType && (c.el.find("#liOnlineBankingTransactionSn,#liExecuteResult").hide(), c.el.find("#liExecdateFinish").hide(), c.el.find("#liStartdateFinish, #liCycleFinish, #liEnddateFinish, #liNeedExecuteCntFinish").show()), c.el.find("#divBocTransferMain, #divBocTransferMainFooter, #divBocTransferConfirm").hide(), c.el.find("#divBocTransferFinish").show(), CU.changeLan(c.el.find("#divBocTransferFinish")), c._saveAsPayeeYn || Common.postRequest(CU.closeConversation(c._conversationId))
        })
    },
    _queryAccountDetail: function () {
        var a = this;
        if (!a._fromAccountSelelct.val)return void Common.LightBox.showMessage(CU.getDictNameByKey("l6742"));
        var b = a._hashTbFromAcc.item(a._fromAccountSelelct.val), c = b.accountId + "", d = {accountId: c}, e = null;
        "104" == b.accountType ? (e = new Model("PsnCrcdCurrencyQuery", {accountNumber: b.accountNumber}), Common.LightBox.show(), Common.postRequest(e).then(function (b) {
            var d = CU.ajaxDataHandle(b);
            if (d) {
                var e = [];
                d.currency1 && d.currency1.code && e.push(new Model("PsnCrcdQueryAccountDetail", {
                    accountId: c,
                    currency: d.currency1.code
                })), d.currency2 && d.currency2.code && e.push(new Model("PsnCrcdQueryAccountDetail", {
                    accountId: c,
                    currency: d.currency2.code
                }));
                {
                    "2" == a.transDirect ? a.sel_kind_of_currencies_rela_25404.val : "001"
                }
                Common.postRequest(e).then(function (b) {
                    var c, d = CU.ajaxDataHandle(b);
                    d ? (2 == e.length && (c = CU.ajaxDataHandle(b, 1)), d.currency = "001", d.crcdAccountDetailList = d.crcdAccountDetailList.concat(c.crcdAccountDetailList), a.el.append(a.ejsPath.credQueryAccountDetail, d, function () {
                        var b = a.el.find("#credDetailPop");
                        a.el.find("#credClose, a.close").on("click", function () {
                            b.remove(), Common.LightBox.hide()
                        }), CU.changeLan(b), CU.setObjAbsCenter(b)
                    })) : Common.LightBox.hide()
                })
            } else Common.LightBox.hide(), Common.LightBox.showMessage(CU.getDictNameByKey("l44606"))
        })) : (Common.LightBox.show(), Common.postRequest(new Model("PsnAccountQueryAccountDetail", d)).then(function (b) {
            var c = CU.ajaxDataHandle(b);
            c ? a.el.append(a.ejsPath.queryAccountDetail, c, function () {
                var b = a.el.find("#div_balance_query");
                a.el.find("#btn_close_14727, a.close").on("click", function () {
                    b.remove(), Common.LightBox.hide()
                }), CU.changeLan(b), CU.setObjAbsCenter(b)
            }) : Common.LightBox.hide()
        }))
    },
    _selectPayeeAccount: function (a) {
        var b = this, c = {
            bocFlag: ["1"],
            isAppointed: "",
            payeeName: "",
            currentIndex: b.currentIndex,
            pageSize: b.pageSize
        }, d = {
            accountType: b.accountType,
            currentIndex: b.currentIndex,
            pageSize: b.pageSize
        }, e = new Model("PsnQueryChinaBankAccount", d), f = new Model("PsnTransPayeeListqueryForDim", c);
        f.setCurrentIndex = function (a) {
            return a && (this.attributes.params.currentIndex = (a - 1) * this.attributes.params.pageSize), this
        }, e.setCurrentIndex = function (a) {
            return a && (this.attributes.params.currentIndex = (a - 1) * this.attributes.params.pageSize), this
        }, Common.LightBox.show(), Common.postRequest(f, e).then(function (c) {
            if (CU.isSuccesful(c) && CU.isSuccesful(c, 1)) {
                var d = CU.ajaxDataHandle(c), g = CU.ajaxDataHandle(c, 1);
                d && g ? b.el.append(b.ejsPath.payeeQueryPop, {}, function () {
                    var c = b.el.find("#divBocPayeeAcct");
                    b.el.find("#bank_of_china_tab").off("click").on("click", function () {
                        return "199" == b.yht_accountType || 0 == b.num2 ? void Common.LightBox.showMessage(CU.getDictNameByKey(0 == b.num2 ? "l54831" : "l50873")) : (b.queryData(d, f, c), b.el.find("#bank_of_china_tab").addClass("tabs-current"), b.el.find("#bank_of_rela_tab").hasClass("tabs-current") && b.el.find("#bank_of_rela_tab").removeClass("tabs-current"), c.find("ul").next("div").show(), c.find("#trans_rela_pager_foot").hide(), void c.find("#txtSearchPayee").parent().show())
                    }), b.el.find("#bank_of_rela_tab").on("click", function () {
                        b.queryRelaData(g, e, c), b.el.find("#bank_of_rela_tab").addClass("tabs-current"), b.el.find("#bank_of_china_tab").hasClass("tabs-current") && b.el.find("#bank_of_china_tab").removeClass("tabs-current"), c.find("#trans_pager_foot").hide(), c.find("#txtSearchPayee").parent().hide()
                    }), "199" == b.yht_accountType || 0 == b.num2 || a ? b.el.find("#bank_of_rela_tab").trigger("click") : b.el.find("#bank_of_china_tab").trigger("click"), b.el.find("a.close, #btn_close_6830").on("click", function () {
                        c.remove(), Common.LightBox.hide()
                    }), c.find("#goto_manager_1045").on("click", "a", function () {
                        Common.triggerAction("ManagePayee"), Common.LightBox.hide()
                    }), CU.changeLan(c), CU.setObjAbsCenter(c)
                }) : Common.LightBox.hide()
            } else Common.LightBox.hide(), CU.ajaxDataHandle(c) && CU.ajaxDataHandle(c, 1)
        })
    },
    localSearch: function (a, b, c, d) {
        var e = this;
        0 == d && (b.attributes.params.payeeName = a, b.attributes.params.currentIndex = "0", Common.postRequest(b).then(function (a) {
            var d = CU.ajaxDataHandle(a);
            d && e.queryData(d, b, c)
        }))
    },
    queryData: function (a, b, c) {
        var d = this;
        a ? (d.el.find("#divBocRelaPayeeAcctList").hide(), d.el.find("#divBocPayeeAcctList").html(d.ejsPath.payeeListPop, {list: a.list}, function () {
            a.list && a.list.length > 0, d.paging(d.ejsPath.payeeListPop, b, "#divBocPayeeAcctList", "#trans_pager_foot", a.recordCount, 1, c), d.el.find("#btnBocSearchPayee").off("click").on("click", function () {
                var a = $("#txtSearchPayee").val(), e = a == $("#txtSearchPayee").attr("placeholder") ? "" : a;
                d.localSearch(e, b, c, 0)
            }), d.el.find("#txtSearchPayee").on("keydown", function (a) {
                var b = CU.getKeyCode(a);
                13 == b && $("#btnBocSearchPayee").trigger("click")
            }), $("#divBocPayeeAcctList").on("click", "a", function (a) {
                var b = $(a);
                return d._fromAccountSelelct.val == b.attr("accountNumber") ? void Common.LightBox.showMessage(CU.getDictNameByKey("l2241")) : (d.el.find("#cashRemit_rela_0930").hide(), $("#divBocTransferMain").find("#stool-selector").show(), d._receiveNumber = b.attr("accountNumber"), "1" == b.attr("isAppointed") ? (d.transDirect = "1", $("#chkSaveAsPayee").attr("checked", !1).parent().hide(), $("#span_payeename_455,#span_transinaccparent_458").show(), $("#txt_payeename_455,#txt_transinaccparent_458").addClass("disabled").attr("disabled", !0).hide(), Common.SF.showSelector("PB033", function () {
                    Common.LightBox.hide(), d.el.find("#rd_exec_3955_1").trigger("click"), d._saveAsPayeeYn = !1
                }, null, d._conversationId)) : (d.transDirect = "0", $("#chkSaveAsPayee").attr("checked", !1).attr("disabled", !0), $("#chkSaveAsPayee").parent().show(), $("#span_payeename_455,#span_transinaccparent_458").hide(), $("#txt_payeename_455,#txt_transinaccparent_458").removeClass("disabled").attr("disabled", !1).show(), Common.SF.showSelector("PB031", function () {
                    Common.LightBox.hide(), d.el.find("#rd_exec_3955_1").trigger("click")
                }, null, d._conversationId)), $("#txt_postscript_551").next("p").attr("lan", "l8115"), CU.changeLan($("#txt_postscript_551").parent()), $("#cb_sendmessagetopayee_5291_1").attr("checked", !0), $("#sel_kind_of_currencies_rela_25404,#btn_queryacc_25402").hide(), $("#sel_kind_of_currencies_fixed_25404").show(), $("#liPayeemobile").show(), $("#liPayeemobile").prev().show(), $("#span_payeename_455").text(b.attr("accountName")), $("#txt_payeename_455").val(b.attr("accountName")).removeClass("warning"), $("#span_transinaccparent_458").text(b.attr("accountNumber")), $("#txt_transinaccparent_458").val(b.attr("accountNumber")).attr("accountNumber", b.attr("accountNumber")).removeClass("warning"), $("#txt_payeemobile_553").val(b.attr("mobile")).removeClass("warning"), d._payeetId = b.attr("payeetId"), c.remove(), void d.availableBalance())
            }), CU.changeLan(c), "1" == d._setObjAbsCenter && CU.setObjAbsCenter(c)
        }).show()) : (CU.setObjAbsCenter(c), CU.changeLan(c))
    },
    queryRelaData: function (a, b, c) {
        var d = this;
        a ? (d.el.find("#divBocPayeeAcctList").hide(), d.el.find("#divBocRelaPayeeAcctList").html(d.ejsPath.payeeRelaListPop, {list: a.list}, function () {
            a.list && a.list.length > 0 && d.paging(d.ejsPath.payeeRelaListPop, b, "#divBocRelaPayeeAcctList", "#trans_rela_pager_foot", a.recordCount, 1), d.el.find("#btnBocSearchPayee").off("click").on("click", function () {
                var a = $("#txtSearchPayee").val();
                d.localSearch(a, b, c, 1)
            }), d.el.find("#txtSearchPayee").on("keydown", function (a) {
                var b = CU.getKeyCode(a);
                13 == b && $("#btnBocSearchPayee").trigger("click")
            }), $("#divBocRelaPayeeAcctList").on("click", "a", function (a) {
                var b = $(a), e = b.attr("accountNumber");
                return d._fromAccountSelelct.val == e ? void Common.LightBox.showMessage(CU.getDictNameByKey("l2241")) : (d.transDirect = 2, d._receiveNumber = e, d.popBocRel = c, d.getRelaInfor(e), void 0)
            }), "199" == d.yht_accountType && CU.setObjAbsCenter(c), CU.changeLan(c), "2" == d._setObjAbsCenter && CU.setObjAbsCenter(c)
        }).show()) : (CU.setObjAbsCenter(c), CU.changeLan(c))
    },
    _getNeetCount: function (a, b, c) {
        var d = this, e = 0;
        return "W" == c ? e = 1 + Math.floor((Date.parse(b) - Date.parse(a)) / 864e5 / 7) : "D" == c ? e = 1 + Math.floor((Date.parse(b) - Date.parse(a)) / 864e5 / 14) : "M" == c && (e = d._getMonthCnt(a, b)), e
    },
    _getMonthCnt: function (a, b) {
        for (var c = 0, d = new Date(a.replace(/\-/g, "/")), e = new Date(b.replace(/\-/g, "/")); d.getTime() <= e.getTime();)c++, d.setMonth(d.getMonth() + 1);
        return c
    },
    controlMoneyRemit: function (a, b, c, d) {
        var e = this, f = e.el.find(b + "," + c), g = e.el.find(b), h = e.el.find(c);
        switch (f.removeAttr("disabled").attr("checked", !1), a) {
            case"00":
                f.attr("disabled", "disabled").attr("checked", !1).next().addClass("text-darkengray");
                break;
            case"01":
                g.attr("checked", !0).next().removeClass("text-darkengray"), h.attr("disabled", "disabled").attr("checked", !1).next().addClass("text-darkengray");
                break;
            case"02":
                h.attr("checked", !0).next().removeClass("text-darkengray"), g.attr("disabled", "disabled").attr("checked", !1).next().addClass("text-darkengray");
                break;
            case"all":
                h.next().removeClass("text-darkengray"), g.next().removeClass("text-darkengray"), g.attr("checked", !0);
                break;
            default:
                f.attr("disabled", "disabled").attr("checked", !1).next().addClass("text-darkengray")
        }
        d && d()
    },
    _getmoneyflag: function () {
        return $("#rd_moneyremit_25406_1").is(":checked") ? "01" : $("#rd_moneyremit_25406_2").is(":checked") ? "02" : "00"
    },
    _relaTransNext: function () {
        var a = this, b = (a._getmoneyflag(), a.el.find("[name=rd_exec_3955]:checked").val()), c = a._hashTbFromAcc.item(a._fromAccountSelelct.val), d = CU.getDictNameByKey("payeraccount_" + c.accountType) + " " + StringUtil.maskAccount(c.accountNumber) + " " + c.nickName, e = a._hashRelaToAcc.item($("#txt_transinaccparent_458").attr("accountNumber")), f = CU.getDictNameByKey("payeraccount_" + e.accountType) + " " + StringUtil.maskAccount(e.accountNumber) + " " + e.nickName, g = null, h = a._hashTbFromAcc.item(a._fromAccountSelelct.val).accountType, i = a._hashRelaToAcc.item(a._receiveNumber).accountType;
        if (a.el.find("input[name=rd_moneyremit_25406]:visible").size() && !a.el.find("input[name=rd_moneyremit_25406]:visible").attr("disabled") && !a.el.find("input[name=rd_moneyremit_25406]:visible").filter(":checked").val())return Common.LightBox.showMessage(CU.getDictNameByKey("l5692")), !1;
        g = "001" == a.sel_kind_of_currencies_rela_25404.val ? "00" : $.inArray(i, ["104", "103", "107"]) > -1 && "104" == h ? "00" : $("#cashRemit_rela_x2x_0930").is(":visible") ? "01" : a.el.find("input[name=rd_moneyremit_25406]:checked").val(), a.data = {
            accountType_out: c.accountType,
            accountNumber_out: c.accountNumber,
            nickName_out: c.nickName,
            accountType_in: e.accountType,
            accountNumber_in: e.accountNumber,
            nickName_in: e.nickName,
            transoutaccparent: d,
            transoutaccparent_area: a._hashTbFromAcc.item(a._fromAccountSelelct.val).accountIbkNum,
            transinaccparent_area: a._hashRelaToAcc.item($("#txt_transinaccparent_458").attr("accountNumber")).accountIbkNum,
            transinaccparent: f,
            kind_of_currencies: a.sel_kind_of_currencies_rela_25404.txt,
            currency: a.sel_kind_of_currencies_rela_25404.val,
            moneyflag: g,
            transamount: $("#txt_transamount_471").val().replace(/\,/g, ""),
            postscript: $("#txt_postscript_551").val().trim(),
            execType: b,
            pexecNextHeader: "",
            cashRemit: g,
            datetime_execdate: $("#txt_execdate_6145").val(),
            datetime_execcircle_start: $("#txt_51_5107").val(),
            datetime_execcircle_end: $("#txt_52_5111").val(),
            datetime_execcircle_circle: $("input[name='rd_title_1102']:checked").val(),
            datetime_execcircle_count: "0"
        }, 0 == a.data.execType ? (a.data.executemode = "l1723", a.data.pexecNextHeader = "l0369") : 1 == a.data.execType ? (a.data.executemode = "l0114", a.data.pexecNextHeader = "l0487") : (a.data.executemode = "l0115", a.data.pexecNextHeader = "l0488", a.data.datetime_execcircle_count = a._getNeetCount(a.data.datetime_execcircle_start, a.data.datetime_execcircle_end, $("input[name='rd_title_1102']:checked").val()));
        var j = {
            serviceId: "PB021",
            fromAccountId: c.accountId + "",
            toAccountId: e.accountId + "",
            currency: a.sel_kind_of_currencies_rela_25404.val,
            amount: a.data.transamount.formatNum(a.sel_kind_of_currencies_rela_25404.val),
            remark: $("#txt_postscript_551").val(),
            cashRemit: a._getmoneyflag()
        };
        a.conmmissionCharge(j, c.accountType, e.accountType, function (b) {
            $.extend(a.data, b);
            var c = $("#divBocTransferConfirm");
            c.html("").html(a.ejsPath.relatedTransferStep2, a.data, function () {
                b.flag && $("#jizhuanfeiyong_step2").show(), a.el.find("#btn_forward_3425").on("click", function () {
                    a.el.find("#divBocTransferMain, #divBocTransferMainFooter").show(), $("#pageNo em").text($("#divBocTransferMain p.page-num em").text()), a.el.find("#divBocTransferConfirm").hide()
                }), CU.changeLan(c), a.bindConfirmButton()
            }).show().siblings().hide()
        })
    },
    bindConfirmButton: function () {
        var a = this;
        Common.postRequest(new Model("PSNCreatConversation")).then(function (b) {
            a.confirmCID = CU.ajaxDataHandle(b), a.confirmCID ? Common.postRequest(new Model("PSNGetTokenId", a.confirmCID)).then(function (b) {
                a.confirmToken = CU.ajaxDataHandle(b), a.confirmToken ? (Common.LightBox.hide(), a.el.find("#btn_confirm_3424").off("click").on("click", function () {
                    a._confirm()
                })) : Common.LightBox.hide()
            }) : Common.LightBox.hide()
        })
    },
    _confirm: function () {
        var a = this, b = a._receiveNumber, c = {
            devicePrint: encode_deviceprint(),
            payeeActno: a._hashRelaToAcc.item(b).accountNumber,
            payeeName: a._hashRelaToAcc.item(b).accountName,
            fromAccountId: a._hashTbFromAcc.item(a._fromAccountSelelct.val).accountId + "",
            toAccountId: a._hashRelaToAcc.item(b).accountId + "",
            currency: a.sel_kind_of_currencies_rela_25404.val,
            amount: $("#txt_transamount_471").val().replace(/\,/g, ""),
            cashRemit: a.data.cashRemit,
            remark: $("#txt_postscript_551").val(),
            executeType: "" + a.data.execType,
            token: a.confirmToken
        };
        0 == a.data.execType ? a.data.remainde_balance = a.remainde_balance - c.amount : 1 == a.data.execType ? (c.dueDate = $("#txt_execdate_6145").val(), c.executeDate = $("#txt_execdate_6145").val()) : (c.dueDate = $("#txt_51_5107").val(), c.startDate = $("#txt_51_5107").val(), c.endDate = $("#txt_52_5111").val(), c.cycleSelect = a.el.find("input[name='rd_title_1102']:checked").val()), Common.LightBox.show(), Common.postRequest(new Model("PsnTransLinkTransferSubmit", c, a.confirmCID)).then(function (b) {
            var c = CU.ajaxDataHandle(b);
            if (c) {
                Common.postRequest(new Model("PSNCloseConversation", a.confirmCID)).then(function () {
                });
                var d = $("#divBocTransferFinish");
                (104 == a.data.accountType_in || 103 == a.data.accountType_in || 104 == a.data.accountType_out || 103 == a.data.accountType_out || 1 == a.data.remitSetMealFlag) && (c.finalCommissionCharge = 0, a.data.flag = !1), c.currency = a.data.currency, 0 == a.data.execType && (a.data.remainde_balance = a.data.remainde_balance - Number(c.finalCommissionCharge)), d.html(a.ejsPath.relatedTransferStep3, $.extend(a.data, c), function () {
                    a.data.flag && $("#jizhuanfeiyong_step3").show(), $("#divBocTransferFinish").find("#btn_print_3426").on("click", function () {
                        $("#divBocTransferFinish").printArea()
                    }), Common.LightBox.hide(), CU.changeLan(d)
                }).show().siblings().hide()
            } else Common.postRequest(new Model("PSNGetTokenId", a.confirmCID)).then(function (b) {
                Common.LightBox.hide(), a.confirmToken = CU.ajaxDataHandle(b)
            })
        })
    },
    paging: function (a, b, c, d, e, f, g) {
        var h = this, i = {
            canvas: d, callbackFn: function (f) {
                Common.LightBox.setZIndex("913"), Common.postRequest(b.setCurrentIndex(f)).then(function (i) {
                    var j = CU.ajaxDataHandle(i);
                    j ? h.el.find(c).html(a, {list: j.list}, function () {
                        Common.LightBox.setZIndex("9"), h.paging(a, b, c, d, e, f, g), $("#divBocPayeeAcctList").off("click", "a").on("click", "a", function (a) {
                            var b = $(a);
                            return a.val == b.attr("accountNumber") ? void Common.LightBox.showMessage(CU.getDictNameByKey("l2241")) : (h.el.find("#cashRemit_rela_0930").hide(), $("#divBocTransferMain").find("#stool-selector").show(), "1" == b.attr("isAppointed") ? (h.transDirect = "1", $("#span_payeename_455,#span_transinaccparent_458").show(), $("#txt_payeename_455,#txt_transinaccparent_458").addClass("disabled").attr("disabled", !0).hide(), Common.SF.showSelector("PB033", function () {
                                $("#chkSaveAsPayee").attr("checked", !1).parent().hide(), h.el.find("#rd_exec_3955_1").trigger("click"), Common.LightBox.hide()
                            }, null, h._conversationId)) : (h.transDirect = "0", $("#span_payeename_455,#span_transinaccparent_458").hide(), $("#txt_payeename_455,#txt_transinaccparent_458").removeClass("disabled").attr("disabled", !1).show(), Common.SF.showSelector("PB031", function () {
                                $("#chkSaveAsPayee").parent().show().attr("checked", !1), h.el.find("#rd_exec_3955_1").trigger("click"), Common.LightBox.hide()
                            }, null, h._conversationId)), h._receiveNumber = b.attr("accountNumber"), $("#cb_sendmessagetopayee_5291_1").attr("checked", !0), $("#sel_kind_of_currencies_rela_25404,#btn_queryacc_25402").hide(), $("#sel_kind_of_currencies_fixed_25404").show(), $("#liPayeemobile").show(), $("#liPayeemobile").prev().show(), $("#span_payeename_455").text(b.attr("accountName")), $("#txt_payeename_455").val(b.attr("accountName")).removeClass("warning"), $("#span_transinaccparent_458").text(b.attr("accountNumber")), $("#txt_transinaccparent_458").val(b.attr("accountNumber")).removeClass("warning"), $("#txt_payeemobile_553").val(b.attr("mobile")).removeClass("warning"), $("#txt_postscript_551").next("p").attr("lan", "l8115"), CU.changeLan($("txt_postscript_551").parent()), h._payeetId = b.attr("payeetId"), void g.remove())
                        }), CU.changeLan(h.el.find(c))
                    }) : (h.el.find(d).empty(), h.el.find(d).hide())
                })
            }, pageIndex: f, point: h, recordCount: e, pageSize: 10
        }, j = Pager.getInstance();
        j.init(i), e > 0 ? $(d).show() : $(d).hide()
    },
    queryAccount: function () {
        var a = this, b = a._receiveNumber, c = b, d = a._hashRelaToAcc.item(c), e = CU.getDictNameByKey("payeraccount_" + d.accountType) + " " + StringUtil.maskAccount(d.accountNumber) + " " + d.nickName;
        Common.postRequest(CU.createConversation()).then(function (b) {
            crc = CU.ajaxDataHandle(b), crc && Common.postRequest(new Model("PsnCrcdQueryBilledTrans", {
                accountId: d.accountId,
                statementMonth: "9999/99"
            }, crc)).then(function (b) {
                var c = CU.ajaxDataHandle(b);
                c && CU.isSuccesful(b) ? a.el.append(a.ejsPath.queryAccount, {selectedCard: e}, function () {
                    var b = a.el.find("#div_balance_query"), d = {};
                    $("#QueryAccountResult").html(a.ejsPath.QueryAccountResult, {result: c}, function () {
                        CU.changeLan(b)
                    }), a.el.find("a.close,#btn_close_14726").on("click", function () {
                        CU.closeConversation(d), b.remove(), Common.LightBox.hide()
                    }), CU.changeLan(b), CU.setObjAbsCenter(b), Common.LightBox.show(a.el)
                }) : (CU.closeConversation(crc), Common.LightBox.showMessage(CU.getDictNameByKey("l8867")))
            })
        })
    },
    queryAccountNumber: function (a, b) {
        var c = this, d = {
            bocFlag: ["1"],
            isAppointed: "",
            payeeName: "",
            currentIndex: 0,
            pageSize: 500
        }, e = {accountType: c.accountType, currentIndex: 0, pageSize: 500};
        relaModel = new Model("PsnQueryChinaBankAccount", e), dimModel = new Model("PsnTransPayeeListqueryForDim", d), dimModel.setCurrentIndex = function (a) {
            return a && (this.attributes.params.currentIndex = (a - 1) * this.attributes.params.pageSize), this
        }, relaModel.setCurrentIndex = function (a) {
            return a && (this.attributes.params.currentIndex = (a - 1) * this.attributes.params.pageSize), this
        }, Common.postRequest(dimModel, relaModel).then(function (d) {
            if (CU.isSuccesful(d) && CU.isSuccesful(d, 1)) {
                var e = CU.ajaxDataHandle(d), f = CU.ajaxDataHandle(d, 1);
                if (e && e.list && e.list.length > 0 || f && f.list && f.list.length > 0) {
                    var g = [], h = [];
                    c._hashRelaToAcc && c._hashRelaToAcc.clear(), f && f.list && f.list.length > 0 && $.each(f.list, function (a, b) {
                        c._hashRelaToAcc.add(b.accountNumber, b)
                    }), e && e.list && e.list.length > 0 && $.each(e.list, function (a, b) {
                        c._hashRelaToAcc.add(b.accountNumber, b), Common.currentUser.customerName == b.accountName ? g.push(b) : h.push(b)
                    });
                    var i = f.list.concat(g.concat(h));
                    b || ($("#show_account_infor_1900").length > 0 ? $("#show_account_infor_1900").show() : c.el.append(c.ejsPath.showAccount, {list: i}, function () {
                        var b = $("#txt_transinaccparent_458"), d = $("#show_account_infor_1900"), e = b.offset2(), f = e.top + b.height(), g = e.left;
                        d.css({
                            position: "absolute",
                            top: f + "px",
                            left: g + "px"
                        }), d.off("click", "a").on("click", "a", function (a) {
                            var b = $($(a).closest("a")), d = b.attr("bocFlag"), e = b.attr("isAppointed"), f = b.attr("accountNumber");
                            return c._fromAccountSelelct.val == b.attr("accountNumber") ? void Common.LightBox.showMessage(CU.getDictNameByKey("l2241")) : void(d && "1" == d ? ("0" == e ? (c.transDirect = "0", $("#chkSaveAsPayee").attr("checked", !1).attr("disabled", !0), $("#chkSaveAsPayee").parent().show(), $("#span_payeename_455,#span_transinaccparent_458").hide(), $("#txt_payeename_455,#txt_transinaccparent_458").removeClass("disabled").attr("disabled", !1).show(), Common.SF.showSelector("PB031", function () {
                                c.el.find("#rd_exec_3955_1").trigger("click")
                            }, null, c._conversationId)) : (c.transDirect = "1", $("#chkSaveAsPayee").attr("checked", !1).parent().hide(), $("#span_payeename_455,#span_transinaccparent_458").show(), $("#txt_payeename_455,#txt_transinaccparent_458").addClass("disabled").attr("disabled", !0).hide(), Common.SF.showSelector("PB033", function () {
                                c.el.find("#rd_exec_3955_1").trigger("click")
                            }, null, c._conversationId)), c._receiveNumber = b.attr("accountNumber"), $("#cb_sendmessagetopayee_5291_1").attr("checked", !0), $("#liPayeemobile").show(), $("#liPayeemobile").prev().show(), $("#span_payeename_455").text(b.attr("accountName")), $("#txt_payeename_455").val(b.attr("accountName")).removeClass("warning"), $("#span_transinaccparent_458").text(b.attr("accountNumber")), $("#txt_transinaccparent_458").val(b.attr("accountNumber")).attr("accountNumber", b.attr("accountNumber")).removeClass("warning"), $("#txt_payeemobile_553").val(b.attr("mobile")).removeClass("warning"), $("#txt_postscript_551").next("p").attr("lan", "l8115"), CU.changeLan($("txt_postscript_551").parent()), c._payeetId = b.attr("payeetId"), $("#show_account_infor_1900").remove()) : (c.transDirect = "2", c.getRelaInfor(f), $("#show_account_infor_1900").remove()))
                        }), a && a(), CU.changeLan($("#show_account_infor_1900"))
                    }))
                } else a && a()
            } else a && a()
        })
    },
    getRelaInfor: function (a) {
        var b = this, c = b._hashRelaToAcc.item(a), d = b._hashTbFromAcc.item(b._fromAccountSelelct.val);
        $.inArray(c.accountType, ["103", "104", "107"]) > -1 ? b._showRelaInfor(d, c, a) : (b._showRelaInfor(d, c, a), $("#btn_queryacc_25402").hide())
    },
    _showRelaInfor: function (a, b, c) {
        var d = this, e = [], f = !1;
        if ($.inArray(b.accountType, ["103", "104", "107"]) > -1) {
            d.isInCrcd = !0;
            var g = [new Model("PsnCrcdCurrencyQuery", {accountNumber: c})];
            g.push("104" == a.accountType ? new Model("PsnCrcdCurrencyQuery", {accountNumber: a.accountNumber}) : new Model("PsnAccountQueryAccountDetail", {accountId: a.accountId + ""})), Common.postRequest(g).then(function (f) {
                var g, h = CU.ajaxDataHandle(f), i = CU.ajaxDataHandle(f, 1);
                (h || i) && ($.inArray(b.accountType, ["104", "103"]) > -1 && h && h.currency1 && h.currency2 ? Common.postRequest(new Model("PsnCrcdChargeOnRMBAccountQuery", {accountId: b.accountId + ""})).then(function (f) {
                    if (g = CU.ajaxDataHandle(f)) {
                        if (g.openFlag) {
                            var j = [];
                            "104" == a.accountType ? (i.currency1 && "001" == i.currency1.code && j.push("001"), i.currency2 && "001" == i.currency2.code && j.push("001")) : $.each(i.accountDetaiList, function (a, b) {
                                "001" == b.currencyCode && j.push(b)
                            }), e = 0 != j.length ? [{
                                key: "001",
                                val: '<span lan="currency_type_001">' + CU.getDictNameByKey("currency_type_001") + "</span>"
                            }] : []
                        } else e = d.handlerCurData(h, i, "104" != a.accountType ? !0 : !1);
                        d.handlerCrcdCurSelectByIn(e, a, b, c)
                    }
                }) : (e = d.handlerCurData(h, i, "104" != a.accountType ? !0 : !1), d.handlerCrcdCurSelectByIn(e, a, b, c)), d.cash_remit_list = d._queryDetailList)
            })
        } else"104" == a.accountType ? (d.isOutCrcd = !0, e = [], f = !0, d.cash_remit_list = [], d.cashRemitType.clear(), Common.postRequest(new Model("PsnCrcdCurrencyQuery", {accountNumber: a.accountNumber})).then(function (a) {
            var b = CU.ajaxDataHandle(a);
            b && (b.currency1 && b.currency1.code && e.push({
                key: b.currency1.code,
                val: '<span lan="currency_type_' + b.currency1.code + '">' + CU.getDictNameByKey("currency_type_" + b.currency1.code) + "</span>"
            }), b.currency2 && b.currency2.code && e.push({
                key: b.currency2.code,
                val: '<span lan="currency_type_' + b.currency2.code + '">' + CU.getDictNameByKey("currency_type_" + b.currency2.code) + "</span>"
            }), d.popBocRel && (d.popBocRel.remove(), d.popBocRel = null, Common.LightBox.hide()), d.sel_kind_of_currencies_rela_25404 = new ITSelect({
                data: e,
                appendTo: $("#sel_kind_of_currencies_rela_25404").empty(),
                callback: function () {
                    d.el.find("#cashRemit_rela_x2x_0930").show(), d.el.find("#cashRemit_rela_0930").hide(), "001" == this.val ? d.el.find("#cashRemit_rela_x2x_0930").hide() : d.el.find("#cashRemit_rela_x2x_0930").show(), "027" == this.val ? Common.VU.addAmountValid("027", "#txt_transamount_471", "15") : "034" == this.val ? Common.VU.addAmountValid("034", "#txt_transamount_471") : Common.VU.addAmountValid("001", "#txt_transamount_471", "12")
                }
            }), e.length > 0 && d.sel_kind_of_currencies_rela_25404.setValue(e[0].key + ""))
        })) : (d.isOutCrcd = !1, d.isInCrcd = !1, d.cash_remit_list = d._queryDetailList, d.cashRemitType && d.cashRemitType.clear(), $.each(d._queryDetailList, function (a, b) {
            "001" == b.currencyCode && (f = !0, d.num2 = 3), d.inArray(b.currencyCode, e) || e.push({
                key: b.currencyCode,
                val: "<span lan='currency_type_" + b.currencyCode + "'>" + CU.getDictNameByKey("currency_type_" + b.currencyCode) + "</span>"
            }), d.cashRemitType.contains(b.currencyCode) ? (d.cashRemitType.remove(b.currencyCode), "001" != b.currencyCode && d.cashRemitType.add(b.currencyCode, "all")) : d.cashRemitType.add(b.currencyCode, b.cashRemit)
        }), d.popBocRel && (d.popBocRel.remove(), d.popBocRel = null, Common.LightBox.hide()), d.sel_kind_of_currencies_rela_25404 = new ITSelect({
            data: e,
            appendTo: $("#sel_kind_of_currencies_rela_25404").empty(),
            callback: function (a) {
                "027" == d.sel_kind_of_currencies_rela_25404.val ? Common.VU.addAmountValid("027", "#txt_transamount_471", "12") : "034" == d.sel_kind_of_currencies_rela_25404.val ? Common.VU.addAmountValid("034", "#txt_transamount_471") : Common.VU.addAmountValid("001", "#txt_transamount_471", "12"), $.each(d._queryDetailList, function (a, b) {
                    d.sel_kind_of_currencies_rela_25404.val == b.currencyCode && d.el.find("#available_balance").text(b.availableBalance.formatNum(d.sel_kind_of_currencies_rela_25404.val, !1, !0))
                });
                var b = d.cashRemitType.item(a.val);
                d.controlMoneyRemit(b, "#rd_moneyremit_25406_1", "#rd_moneyremit_25406_2"), $("#divBocTransferMain").find("#rd_moneyremit_25406_1").attr("disabled") ? $("#divBocTransferMain").find("#rd_moneyremit_25406_2").attr("disabled") || $("#divBocTransferMain").find("#rd_moneyremit_25406_2").trigger("click") : $("#divBocTransferMain").find("#rd_moneyremit_25406_1").trigger("click"), "001" == this.val ? d.el.find("#cashRemit_rela_0930").hide() : d.el.find("#cashRemit_rela_0930").show()
            }
        }), d.el.find("#cashRemit_rela_x2x_0930").hide(), d.el.find("#cashRemit_rela_0930").show(), e.length > 0 && d.sel_kind_of_currencies_rela_25404.setValue(f ? "001" : e[0].key)), d.sel_kind_of_currencies_rela_25404 && "001" == d.sel_kind_of_currencies_rela_25404.val || "104" == a.accountType && ("103" == b.accountType || "104" == b.accountType || "107" == b.accountType) ? d.el.find("#cashRemit_rela_0930,#cashRemit_rela_x2x_0930").hide() : d.el.find("#cashRemit_rela_0930").show(), $("#sel_kind_of_currencies_rela_25404").show(), $("#sel_kind_of_currencies_fixed_25404").hide(), $("#divBocTransferMain").find("#stool-selector").hide(), $("#chkSaveAsPayee").attr("checked", !1).parent().hide(), $("#liPayeemobile").hide(), $("#cb_sendmessagetopayee_5291_1").attr("checked", !1), $("#liPayeemobile").prev().hide(), $("#span_payeename_455,#span_transinaccparent_458").show(), $("#txt_payeename_455,#txt_transinaccparent_458").addClass("disabled").attr("disabled", !0).hide(), d.transDirect = "2", $("#txt_postscript_551").next("p").attr("lan", "l9142"), CU.changeLan($("#txt_postscript_551").parent()), d._receiveNumber = c, $("#span_payeename_455").text(b.accountName), $("#txt_payeename_455").val(b.accountName).removeClass("warning"), $("#span_transinaccparent_458").text(Common.Security.mask("", b.accountNumber)), $("#txt_transinaccparent_458").val(Common.Security.mask("", b.accountNumber)).attr("accountNumber", b.accountNumber).removeClass("warning")
    },
    handlerCrcdCurSelectByIn: function (a, b, c, d) {
        var e = this;
        return 0 == a.length ? (Common.LightBox.showMessage(CU.getDictNameByKey("l89547")), !1) : (e.popBocRel && (e.popBocRel.remove(), e.popBocRel = null, Common.LightBox.hide()), e.sel_kind_of_currencies_rela_25404 = new ITSelect({
            data: a,
            appendTo: $("#sel_kind_of_currencies_rela_25404").empty(),
            callback: function (a) {
                if ("104" == b.accountType && $.inArray(c.accountType, ["103", "104", "107"]) > -1)e.el.find("#cashRemit_rela_x2x_0930").hide(), e.el.find("#cashRemit_rela_0930").hide(); else if ("104" != b.accountType && $.inArray(c.accountType, ["103", "104", "107"]) > -1) {
                    if (e.el.find("#cashRemit_rela_x2x_0930").hide(), "001" == this.val)e.el.find("#cashRemit_rela_0930").hide(); else {
                        var d = [];
                        e.cacheDebit[this.val + "01"] >= 0 && d.push("#rd_moneyremit_25406_1"), e.cacheDebit[this.val + "02"] >= 0 && d.push("#rd_moneyremit_25406_2"), e.el.find("input[name=rd_moneyremit_25406]").attr("disabled", !1).next().removeClass("text-darkengray"), e.el.find("#cashRemit_rela_0930").show(), 1 == d.length ? "#rd_moneyremit_25406_1" == d[0] ? (e.el.find("#rd_moneyremit_25406_2").attr("disabled", !0).next().addClass("text-darkengray"), e.el.find("#rd_moneyremit_25406_1").attr("checked", !0).next().removeClass("text-darkengray")) : (e.el.find("#rd_moneyremit_25406_1").attr("disabled", !0).next().addClass("text-darkengray"), e.el.find("#rd_moneyremit_25406_2").attr("checked", !0).next().removeClass("text-darkengray")) : e.el.find("input[name=rd_moneyremit_25406]").attr({
                            disabled: !1,
                            checked: !1
                        }).next().removeClass("text-darkengray")
                    }
                    var f = a.val, g = e.cashRemitType.item(f);
                    e.controlMoneyRemit(g, "#rd_moneyremit_25406_1", "#rd_moneyremit_25406_2")
                }
                "027" == this.val ? Common.VU.addAmountValid("027", "#txt_transamount_471", "15") : "034" == e.sel_kind_of_currencies_rela_25404.val ? Common.VU.addAmountValid("034", "#txt_transamount_471") : Common.VU.addAmountValid("001", "#txt_transamount_471", "12")
            }
        }), e.sel_kind_of_currencies_rela_25404 && "001" == e.sel_kind_of_currencies_rela_25404.val || "104" == b.accountType && ("103" == c.accountType || "104" == c.accountType || "107" == c.accountType) ? e.el.find("#cashRemit_rela_0930,#cashRemit_rela_x2x_0930").hide() : e.el.find("#cashRemit_rela_0930").show(), $("#sel_kind_of_currencies_rela_25404").show(), $("#sel_kind_of_currencies_fixed_25404").hide(), $("#divBocTransferMain").find("#stool-selector").hide(), $("#chkSaveAsPayee").attr("checked", !1).parent().hide(), $("#liPayeemobile").hide(), $("#cb_sendmessagetopayee_5291_1").attr("checked", !1), $("#liPayeemobile").prev().hide(), $("#span_payeename_455,#span_transinaccparent_458").show(), $("#txt_payeename_455,#txt_transinaccparent_458").addClass("disabled").attr("disabled", !0).hide(), e.transDirect = "2", $("#txt_postscript_551").next("p").attr("lan", "l9142"), CU.changeLan($("#txt_postscript_551").parent()), e._receiveNumber = d, $("#span_payeename_455").text(c.accountName), $("#txt_payeename_455").val(c.accountName).removeClass("warning"), $("#span_transinaccparent_458").text(Common.Security.mask("", c.accountNumber)), $("#txt_transinaccparent_458").val(Common.Security.mask("", c.accountNumber)).attr("accountNumber", c.accountNumber).removeClass("warning"), void e.buildAvailableBalance(function () {
            e.sel_kind_of_currencies_rela_25404.setValue(a[0].key)
        }))
    },
    buildAvailableBalance: function (a) {
        var b = this, c = "", d = b.sel_kind_of_currencies_rela_25404.data;
        b.cacheDebit = {}, $.each(d, function (a, d) {
            $.each(b._queryDetailList, function (a, e) {
                d.key == e.currencyCode && (c += "<div>" + e.availableBalance.formatNum(d.key) + '<span class="ml5" lan=currency_type_' + d.key + "></span>", "001" != d.key && (c += "<span lan=moneyremit_" + e.cashRemit + "></span>"), c += "</div>", "001" == d.key ? b.cacheDebit[d.key] = e.availableBalance : b.cacheDebit[d.key + e.cashRemit] = e.availableBalance), d.key == e.currency && (c += "<div>" + e.loanBalanceLimit.formatNum(d.key) + '<span class="ml5" lan=currency_type_' + d.key + "></span>", "001" != d.key && (c += "<span lan=moneyremit_" + e.cashRemit + "></span>"), c += "</div>", b.cacheDebit[d.key] = e.loanBalanceLimit)
            })
        }), b.el.find("#available_balance").empty().html($(c)), CU.changeLan(b.el.find("#available_balance")), a && a()
    },
    inArray: function (a, b) {
        if (b && 0 !== b.length) {
            var c = !1;
            return $.each(b, function (b, d) {
                d.key === a + "" && (c = !0)
            }), c
        }
        return !1
    },
    _cash_remit: function (a, b, c, d) {
        for (var e = this, f = c.length, g = 0; f > g; g++)if (c[g].currencyCode == b && c[g].cashRemit == d) {
            e.el.find(a).text(c[g].availableBalance.formatNum(b, !1, !0)), e.remainde_balance = c[g].availableBalance;
            break
        }
    },
    handlerCurData: function (a, b, c) {
        var d = [], e = [], f = [];
        return a && (a.currency1 && a.currency1.code && e.push(a.currency1.code), a.currency2 && a.currency2.code && e.push(a.currency2.code)), c ? $.each(b.accountDetaiList, function (a, b) {
            -1 == $.inArray(b.currencyCode, f) && f.push(b.currencyCode)
        }) : (b.currency1 && b.currency1.code && f.push(b.currency1.code), b.currency2 && b.currency2.code && f.push(b.currency2.code)), $.each(f, function (a, b) {
            -1 != $.inArray(b, e) && d.push({
                key: b,
                val: '<span lan="currency_type_' + b + '">' + CU.getDictNameByKey("currency_type_" + b) + "</span>"
            })
        }), d
    },
    queryBookBalance: function (a) {
        var b = this, c = b.sel_kind_of_currencies_rela_25404.val;
        Common.LightBox.show(), Common.postRequest(new Model("PsnCrcdQueryAccountDetail", {
            accountId: a.accountId + "",
            currency: c
        })).then(function (a) {
            var d = CU.ajaxDataHandle(a);
            if (d) {
                var e, f = d.crcdAccountDetailList[0].currentBalance, g = '<span class="mr5" lan="{1}"></span><span lan="num" currCode="001">{0}</span>';
                e = "0" == d.crcdAccountDetailList[0].currentBalanceflag ? "l0582" : "1" == d.crcdAccountDetailList[0].currentBalanceflag ? "l0587" : "", g = g.format(f.formatNum(c), e), $("#btn_queryacc_25402").show(), Common.LightBox.hide()
            } else g = "", Common.LightBox.hide();
            var h = b.el.find("#div_avaliableamount_2893").html(g).closest("li").show();
            CU.changeLan(h)
        })
    }
});