/*! BUILD: 2015-07-17 */
Common.controllers.CivilTransfer = Spine.Controller.sub({
    NOW_EXECUTE_TYPE: Common.propertiesConfig["exec.atonceexec"],
    RESERVE_EXECUTE_TYPE: Common.propertiesConfig["exec.dateexec"],
    RESERVE_EYCLE_TYPE: "2",
    _executeType: "0",
    SERVICE_ID: Common.propertiesConfig["transfer_accounts_type.domesticinterbankremittance"],
    BOCFLAG: "0",
    _hashTable: new Common.Hashtable,
    _payeeIdTable: new Common.Hashtable,
    _hashTbFromAcc: new Common.Hashtable,
    _cnapsCode: "",
    _IBKnumber: "",
    _sysDate: null,
    _sysTime: null,
    _needCommissionCharge: "",
    _preCommissionCharge: "",
    _remitSetMealFlag: "",
    _flag: !1,
    fromAccountMap: new Common.Hashtable,
    transDirect: {bocFlag: "0", isAppointed: "0"},
    currentIndex: "0",
    pageSize: "10",
    ejsPath: {
        main: "templates/transfersAndRemittances/civilTransfer/civilTransferMain.ejs",
        confirm: "templates/transfersAndRemittances/civilTransfer/civilTransferConfirm.ejs",
        success: "templates/transfersAndRemittances/civilTransfer/civilTransferSuccess.ejs",
        selectPayeeAccount: "templates/transfersAndRemittances/civilTransfer/selectPayeeAccount.ejs",
        queryOpenAccBank: "templates/transfersAndRemittances/civilTransfer/queryOpenAccBank.ejs",
        payeeQueryPop: "templates/transfersAndRemittances/civilTransfer/selectPayees.ejs",
        showAccount: "templates/transfersAndRemittances/bocTransfer/showAccount.ejs",
        queryOpenAccBankRst: "templates/transfersAndRemittances/civilTransfer/queryOpenAccBankRst.ejs",
        bigtips: "templates/transfersAndRemittances/civilTransfer/bigtips.ejs",
        transferBigPushBill: "templates/transfersAndRemittances/civilTransfer/transferBigPushBill.ejs",
        queryAccountDetail: "templates/common/queryAccountBalance.ejs",
        credQueryAccountDetail: "templates/common/credQueryAccountBalance.ejs",
        securityIntercept: "templates/transfersAndRemittances/civilTransfer/SecurityIntercept.ejs",
        aStrideBankPayConfirm: "templates/transfersAndRemittances/civilTransfer/aStrideBankPayConfirm.ejs",
        aStrideBankPaySuccess: "templates/transfersAndRemittances/civilTransfer/aStrideBankPaySuccess.ejs",
        queryOpenBankName: "templates/transfersAndRemittances/civilTransfer/queryOpenBankName.ejs",
        queryOpenBankName_table: "templates/transfersAndRemittances/civilTransfer/queryOpenBankName_table.ejs"
    },
    initParams: function () {
        var a = this;
        a.NOW_EXECUTE_TYPE = Common.propertiesConfig["exec.atonceexec"], a.RESERVE_EXECUTE_TYPE = Common.propertiesConfig["exec.dateexec"], a.RESERVE_EYCLE_TYPE = "2", a._executeType = "0", a.SERVICE_ID = Common.propertiesConfig["transfer_accounts_type.domesticinterbankremittance"], a.BOCFLAG = "0", a._hashTable = new Common.Hashtable, a._payeeIdTable = new Common.Hashtable, a._hashTbFromAcc = new Common.Hashtable, a._IBKnumber = "", a._sysDate = null, a._sysTime = null, a._needCommissionCharge = "", a._preCommissionCharge = "", a._remitSetMealFlag = "", a._flag = !1, a.fromAccountMap = new Common.Hashtable, a.transDirect = {
            bocFlag: "0",
            isAppointed: "0"
        }, a.currentIndex = "0", a.pageSize = "10"
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
            a.el.find("#civilTransferMain").hide(), Common.SF.showSelector(a.SERVICE_ID, function () {
                a._conversationId = Common.SF.get("conversationId"), a._fillSelectData(), DateUtil.getCurrentTime(function (b) {
                    Common.LightBox.hide(), a.sysDate = b.date, $("#date_execdate_7818").datepicker(), $("#date_execdate_7818").val(CU.Date.addDays(new Date(b.date), 1).toString("/")), $("#ul_state_date_data_36157").datepicker().val(CU.Date.addDays(a.sysDate, 1));
                    var c = {
                        selectedDate: {
                            year: b.date.split("/")[0],
                            month: b.date.split("/")[1],
                            day: b.date.split("/")[2]
                        }
                    };
                    $("#ul_end_date_data_36159").val("").datepicker(c)
                }), a.el.find("#btn_querybalance_1533").on("click", function () {
                    a._queryAccountDetail()
                }), Common.upperAmount(a, "#txt_transamount_1690", "#capital_amount"), a.queryAccountNumber(null, !0), a.el.find("#txt_transinaccparent_1601").on("focus", function () {
                    a.queryAccountNumber(function () {
                        $("#txt_transinaccparent_1601").trigger("keyup")
                    }), a.showBubble(this)
                }).on("blur", function () {
                    a.el.find(".tips-radius02").hide()
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
                    $("#show_account_infor_1900").length > 0 && "txt_transinaccparent_1601" != $(a).attr("id") && $("#show_account_infor_1900").remove()
                }), a.el.find("#btn_selecttoaccount_2495").on("click", function () {
                    $(this).hasClass("btn-disabled") || a._selectToAccount()
                }), a.el.find("#cb_sendmessagetopayee_1694_1").on("click", function (a) {
                    $(a).attr("checked") ? ($("#liPayeemobile").show(), $("#liMessage").show()) : ($("#txt_payeemobile_1696").val(""), $("#liPayeemobile").hide(), $("#liMessage").hide())
                }), a.el.find("#rd_exec_1727_1").on("click", function () {
                    a.el.find("#stool-selector input[name='rd_choose_security_tool_17637']").attr("disabled", !1).next("label").removeClass("text-darkengray"), $("#liDateExec").hide(), $("li:[id*='rd_exec_36154_1654_']").hide(), a._executeType = a.NOW_EXECUTE_TYPE
                }), a.el.find("#rd_exec_1727_2").on("click", function () {
                    var b = a.el.find("#stool-selector #rd_choose_security_tool_17637_2");
                    b.size() > 0 ? (a.el.find("#stool-selector input[name='rd_choose_security_tool_17637']").attr("disabled", !0).attr("checked", !1).next("label").addClass("text-darkengray"), b.attr("disabled", !1).next("label").removeClass("text-darkengray"), $.browser.msie && b.on("click", function () {
                        b.trigger("change")
                    }), b.trigger("click"), $("#liDateExec").show(), $("li:[id*='rd_exec_36154_1654_']").hide(), a._executeType = a.RESERVE_EXECUTE_TYPE) : (a.el.find("#rd_exec_1727_1").trigger("click"), Common.LightBox.showMessage(CU.getDictNameByKey("l90011")))
                }), a.el.find("#rd_exec_36154_3").on("click", function () {
                    var b = a.el.find("#stool-selector #rd_choose_security_tool_17637_2");
                    b.size() > 0 ? (a.el.find("#stool-selector input[name='rd_choose_security_tool_17637']").attr("disabled", !0).attr("checked", !1).next("label").addClass("text-darkengray"), b.attr("disabled", !1).next("label").removeClass("text-darkengray"), $.browser.msie && b.on("click", function () {
                        b.trigger("change")
                    }), b.trigger("click"), $("#liDateExec").hide(), $("li:[id*='rd_exec_36154_1654_']").show(), a._executeType = a.RESERVE_EYCLE_TYPE) : (a.el.find("#rd_exec_1727_1").trigger("click"), Common.LightBox.showMessage(CU.getDictNameByKey("l90011")))
                }), a.el.find("#btn_reset_1733").on("click", function () {
                    a._resetCivilTransfer()
                }), a.el.find("#rd_trans_mode_0").on("click", function () {
                    $("#rd_exec_36154_3").parent().hide(), $("#capital_amount").text("-"), $("#bankNameTips").hide(), $("#rd_trans_mode_1").removeAttr("checked"), $(this).attr("checked", !0), "0" != a.transDirect.bocFlag && (a.queryAccountNumber(null, !0), Common.SF.showSelector("PB032", function () {
                        a.el.find("#rd_exec_1727_1").trigger("click")
                    }, null, a._conversationId)), a.transDirect.bocFlag = "0", a.transDirect.isAppointed = "0", $("#span_transinaccparent_1601,#span_payeename_1600").hide(), $("#txt_payeename_1600,#txt_transinaccparent_1601").attr({
                        disabled: !1,
                        payeeId: "",
                        accountNumber: ""
                    }).removeClass("disabled").val("").show(), CU.changeLan($("#txt_addaccforbank_1664").attr({
                        lan: "l89613",
                        payeecnaps: "",
                        toBankCode: ""
                    }).parent()), $("#txt_addaccforbankname_1687").attr({
                        lan: "l90096",
                        bankName: ""
                    }), CU.changeLan($("#civilTransferMain").find("li.bankName").show()), $("#txt_transamount_1690,#txt_postscript_1693,#txt_payeemobile_1696").val(""), $("#btn_selecttoaccount_2495").hasClass("btn-disabled") ? $("#txt_transinaccparent_1601").addClass("disabled") : ""
                }), a.el.find("#rd_trans_mode_1").on("click", function () {
                    $("#capital_amount").text("-"), $("#rd_exec_36154_3").parent().show(), $("#civilTransferMain [id*='rd_exec_36154_1654_']").hide(), $("#bankNameTips").show(), $("#rd_trans_mode_0").removeAttr("checked"), $(this).attr("checked", !0), "3" != a.transDirect.bocFlag && (a.queryAccountNumber(null, !0), Common.SF.showSelector("PB113", function () {
                        a.el.find("#rd_exec_1727_1").trigger("click")
                    }, null, a._conversationId)), a.transDirect.bocFlag = "3", a.transDirect.isAppointed = "0", $("#span_transinaccparent_1601,#span_payeename_1600").hide(), $("#txt_payeename_1600,#txt_transinaccparent_1601").attr({
                        disabled: !1,
                        payeeId: "",
                        accountNumber: ""
                    }).removeClass("disabled").val("").show(), CU.changeLan($("#txt_addaccforbank_1664").attr({
                        lan: "l89613",
                        payeecnaps: "",
                        toBankCode: ""
                    }).parent()), $("#txt_addaccforbankname_1687").attr({
                        lan: "l90096",
                        bankName: ""
                    }), CU.changeLan($("#civilTransferMain").find("li.bankName").hide()), $("#txt_transamount_1690,#txt_postscript_1693,#txt_payeemobile_1696").val(""), $("#btn_selecttoaccount_2495").hasClass("btn-disabled") ? $("#txt_transinaccparent_1601").addClass("disabled") : ""
                }), a.el.find("#txt_transinaccparent_1601,#txt_payeename_1600").on("change", function () {
                    var b = $.trim($("#txt_transinaccparent_1601").val());
                    if (b && !isNaN(b)) {
                        if ($("#txt_transinaccparent_1601").attr("accountNumber", b), a._hashTable.contains(b)) {
                            var c = !1;
                            if ($.each(a._payeeIdTable._hash, function (d, e) {
                                    return e.accountNumber == b && e.isAppointed == a.transDirect.isAppointed && e.bocFlag == a.transDirect.bocFlag ? ($("#txt_transinaccparent_1601").attr("payeeId", e.payeetId), c = !0, !1) : void 0
                                }), c) {
                                var d = a._payeeIdTable.item($("#txt_transinaccparent_1601").attr("payeeId")), e = $("#txt_payeename_1600").val() == d.accountName && $("#txt_addaccforbank_1664").text() == d.bankName && $("#txt_addaccforbankname_1687").text() == d.address;
                                $("#saveAsPayee").attr("disabled", e).attr("checked", !e)
                            } else $("#saveAsPayee").attr("disabled", !1).attr("checked", !0), $("#txt_transinaccparent_1601").attr("payeeId", "")
                        } else $("#txt_transinaccparent_1601").attr("payeeId", ""), $("#saveAsPayee").attr("disabled", !1).attr("checked", !0);
                        $("#cb_sendmessagetopayee_1694_1").attr("checked") || ($("#cb_sendmessagetopayee_1694_1").attr("checked", !0), $("#liPayeemobile").show())
                    }
                }), a.el.find("#txt_transamount_1690").on("blur", function () {
                    if (!isNaN(this.value) && this.value > a.remainde_balance)return Common.LightBox.showMessage(CU.getDictNameByKey("l52989")), !1;
                    var b = $("[name=rd_trans_mode_1015]:checked").get(0).value;
                    if ("1" == b && !isNaN(this.value) && this.value > 5e4) {
                        var c = {
                            messageLan: "l91289",
                            conLan: "l0315",
                            nodeId: $("#txt_transamount_1690"),
                            inwordsId: $("#capital_amount"),
                            point: a
                        };
                        Common.LightBox.showCallbackMessage(c)
                    }
                }), Common.LoadBankName(a.el.find("#civilTransferMain")), Common.LoadBranchName(a.el.find("#civilTransferMain")), CU.changeLan(a.el.find("#civilTransferMain")), a.el.find("#civilTransferMain").show()
            })
        })
    },
    events: {"click #btn_nextstep_1732": "civilTransferNext"},
    civilTransferNext: function () {
        var a = this;
        if (formValid.checkAll("#civilTransferMain") && Common.SF.check()) {
            if ("0" == a._executeType) {
                if (!a.remainde_balance)return void Common.LightBox.showMessage(CU.getDictNameByKey("l52989"));
                if (Number(a._datas().amount - a.remainde_balance) > 0)return void Common.LightBox.showMessage(CU.getDictNameByKey("l52989"))
            }
            if ($("#txt_transinaccparent_1601").val() == a.fromAccountMap.item(a.fromAccountSel.val))return void Common.LightBox.showMessage(CU.getDictNameByKey("l2241"));
            $("#cb_sendmessagetopayee_1694_1").attr("checked") || $("#txt_payeemobile_1696").val("");
            var b = Common.VU.validateExecutePeriod(a.el, "rd_exec_1727", a.sysDate, "date_execdate_7818", "ul_state_date_data_36157", "ul_end_date_data_36159");
            if (b)return void Common.LightBox.showMessage(b);
            var c = "";
            if ("0" == a.transDirect.bocFlag) {
                if (!$("#txt_addaccforbank_1664").attr("toBankCode"))return void Common.LightBox.showMessage(CU.getDictNameByKey("l87915"));
                if (!$("#txt_addaccforbankname_1687").attr("bankName"))return void Common.LightBox.showMessage(CU.getDictNameByKey("l87916"));
                c = "1" == a.transDirect.isAppointed ? new Model("PsnDirTransBocNationalTransferVerify", a._datas(), a._conversationId) : new Model("PsnTransBocNationalTransferVerify", a._datas(), a._conversationId), Common.LightBox.show(), Common.postRequest(c).then(function (b) {
                    var c = CU.ajaxDataHandle(b);
                    if (c) {
                        var d = a._datas(), e = {
                            serviceId: "0" == a.transDirect.isAppointed ? "PB032" : "PB034",
                            fromAccountId: d.fromAccountId + "",
                            currency: "001",
                            amount: d.amount,
                            cashRemit: "00",
                            remark: d.remark,
                            payeeActno: d.payeeActno,
                            payeeName: d.payeeName,
                            toOrgName: d.toOrgName,
                            cnapsCode: d.cnapsCode
                        };
                        Common.postRequest(new Model("PsnTransGetNationalTransferCommissionCharge", e)).then(function (b) {
                            var e = CU.ajaxDataHandle(b);
                            if (e) {
                                104 == d.accountType || 104 == d.payeeType || 103 == d.accountType || 103 == d.payeeType ? (a._flag = !1, a._preCommissionCharge = 0) : "0" == e.getChargeFlag ? (a._needCommissionCharge = "", a._preCommissionCharge = "", a._remitSetMealFlag = "0", a._flag = !0) : e.needCommissionCharge >= 0 && "0" == e.remitSetMealFlag ? (a._flag = !0, a._needCommissionCharge = e.needCommissionCharge, a._preCommissionCharge = e.preCommissionCharge, a._remitSetMealFlag = e.remitSetMealFlag) : (a._preCommissionCharge = 0, a._remitSetMealFlag = e.remitSetMealFlag, a._flag = !1), $("#civilTransferMain").hide(), $("#civilTransferConfirm").hide();
                                var f = a._datas();
                                f.needCommissionCharge = a._needCommissionCharge, f.preCommissionCharge = a._preCommissionCharge, f.remitSetMealFlag = a._remitSetMealFlag, a.el.find("#civilTransferConfirm").html(a.ejsPath.confirm, f, function () {
                                    Common.SF.appendInputTo("#input_container ul.layout-lr", function () {
                                        a._flag && $("#jizhunfeiyong").show(), a.el.find("#btn_forward_4730").on("click", function () {
                                            $("#civilTransferMain").show(), $("#civilTransferConfirm").hide()
                                        }), a.bindTransferConfirm(), Common.LightBox.hide(), $("#civilTransferConfirm").show(), CU.changeLan(a.el.find("#civilTransferConfirm"))
                                    }, c)
                                })
                            }
                        })
                    } else Common.LightBox.hide()
                })
            } else a.different_banks_next()
        }
    },
    bindTransferConfirm: function () {
        var a = this;
        Common.postRequest(CU.createTokenId(a._conversationId)).then(function (b) {
            a.confirmToken = CU.ajaxDataHandle(b), a.confirmToken ? (Common.LightBox.hide(), a.el.find("#btn_confirm_4729").off("click").on("click", function () {
                a.civilTransferConfirm()
            })) : Common.LightBox.hide()
        })
    },
    civilTransferConfirm: function () {
        var a = this;
        return formValid.checkAll(a.el) ? (Common.LightBox.show(), void Common.postRequest(new Model("PsnCommonQuerySystemDateTime")).then(function (b) {
            var c = (CU.ajaxDataHandle(b).dateTme, a._datas());
            c.token = a.confirmToken, Common.AC.enabled && (c.devicePrint = encode_deviceprint()), c._signedData = "", c.openChangeBooking = "", c.dueDate = a._executeType == a.NOW_EXECUTE_TYPE ? "" : a._datas().executeDate;
            var d = Common.SF.get("Smc"), e = Common.SF.get("Otp");
            d && $.extend(c, {
                activ: d.Version,
                state: d.State,
                Smc: d.Value,
                Smc_RC: d.RandomKey_C
            }), e && $.extend(c, {activ: e.Version, state: e.State, Otp: e.Value, Otp_RC: e.RandomKey_C});
            var f = Common.SF.get("signedData");
            if (f) {
                if (!f.result)return Common.LightBox.hide(), !1;
                c._signedData = f.result
            }
            c.openChangeBooking = "O";
            var g = "";
            "0" == a.transDirect.bocFlag && (g = "1" == a.transDirect.isAppointed ? new Model("PsnDirTransNationalTransferSubmit", c, a._conversationId) : new Model("PsnTransNationalTransferSubmit", c, a._conversationId)), Common.postRequest(g).then(function (d) {
                if (d.response[0].error && "Security.intercept" == d.response[0].error.code)a.el.append(a.ejsPath.securityIntercept, function () {
                    var b = a.el.find("#security_intercept");
                    a.el.find("#security_intercept_btn").on("click", function () {
                        b.remove(), Common.LightBox.hide(), a.init()
                    }), CU.changeLan(b), CU.setObjAbsCenter(b)
                }); else {
                    var e = CU.ajaxDataHandle(d);
                    e && CU.isSuccesful(d) ? (a._datas().saveAsPayeeYn && (c.toAccountId = $("#txt_transinaccparent_1601").val(), Common.postRequest(CU.createConversation()).then(function (b) {
                        var d = CU.ajaxDataHandle(b);
                        d && Common.postRequest(CU.createTokenId(d)).then(function (b) {
                            var e = CU.ajaxDataHandle(b);
                            if (e) {
                                c.token = e;
                                var f = "";
                                f = "0" == a.transDirect.isAppointed ? {
                                    toAccountId: c.payeeActno + "",
                                    payeeName: c.payeeName,
                                    cnapsCode: c.cnapsCode,
                                    bankName: c.bankName,
                                    toOrgName: c.toOrgName,
                                    payeeMobile: c.payeeMobile,
                                    token: e
                                } : {
                                    payeeActno: c.payeeActno,
                                    payeeId: c.payeeId,
                                    payeeName: c.payeeName,
                                    payeeMobile: c.payeeMobile,
                                    bankName: c.bankName,
                                    toOrgName: c.toOrgName,
                                    cnapsCode: c.cnapsCode,
                                    token: e
                                }, Common.postRequest(new Model("0" == a.transDirect.isAppointed ? "PsnTransNationalAddPayee" : "PsnDirTransNationalAddPayee", f, d)).then(function (a) {
                                    CU.ajaxDataHandle(a)
                                })
                            } else Common.LightBox.hide()
                        })
                    })), e && e.transMonStatus ? a.preventForSwindle(e, c) : CU.isSuccesful(b) && a.showSuccess(e, c)) : (Common.LightBox.hide(), Common.SF.clear(), Common.postRequest(CU.createTokenId(a._conversationId)).then(function (b) {
                        a.confirmToken = CU.ajaxDataHandle(b)
                    }))
                }
            })
        })) : !1
    },
    preventForSwindle: function (a, b) {
        var c = this, d = "";
        c.ac = new Common.AC({
            data: a, el: c.el, conversationId: c._conversationId, ok: function (a) {
                d = "0" == c.transDirect.bocFlag ? new Model("PsnTransNationalTransferSubmitReinforce", c.ac.get(), c._conversationId) : "0" == c.transDirect.isAppointed ? new Model("PsnEbpsRealTimePaymentTransferReinforce", c.ac.get(), c._conversationId) : new Model("PsnDirTransCrossBankTransferSubmitReinforce", c.ac.get(), c._conversationId), Common.postRequest(d).then(function (d) {
                    var e = c.ac.ajaxDataHandle(d);
                    CU.isSuccesful(d) ? (c.ac.hide(), "0" == c.transDirect.bocFlag ? c.showSuccess(e, b) : c._success(e, b)) : Common.LightBox.hide(), a()
                })
            }
        }), "ALLOW" === c.ac.result && (c.ac.hide(), "0" == c.transDirect.bocFlag ? c.showSuccess(a, b) : c._success(a, b))
    },
    showSuccess: function (a, b) {
        var c = this;
        b.batSeq = a.batSeq, b.transactionId = a.transactionId, b.fromAccountType = a.fromAccountType, b.fromAccountNum = a.fromAccountNum, b.fromAccountNickname = a.fromAccountNickname, b.fromIbkNum = a.fromIbkNum, b.currency = a.currency, b.amount = a.amount, b.commissionCharge = a.commissionCharge, b.postage = a.postage, b.furInfo = a.furInfo, b.needCommissionCharge = c._needCommissionCharge, b.remitSetMealFlag = c._remitSetMealFlag, b.workDayFlag = null, 104 == b.fromAccountType || 104 == b.payeeType || 1 == c._remitSetMealFlag || 103 == b.fromAccountType || 103 == b.payeeType ? (b.needCommissionCharge = 0, b.preCommissionCharge = 0) : b.preCommissionCharge = 0 == b.executeType ? a.finalCommissionCharge : c._preCommissionCharge, "1" == a.workDayFlag && (b.workDayFlag = a.workDayFlag), b.preCommissionCharge = c._preCommissionCharge, null != a.executeDate && (b.executeDate = a.executeDate), 0 == b.executeType && (b.remainde_balance = c.remainde_balance - b.amount - Number(b.preCommissionCharge)), $("#civilTransferConfirm").hide(), c.el.find("#civilTransferSuccess").html(c.ejsPath.success, b, function () {
            Common.LightBox.hide(), c._flag && $("#jizhunfeiyong_success").show(), c.el.find("#btn_print_5549").on("click", function () {
                c.el.find("#civilTransferSuccess").printArea()
            }), CU.changeLan(c.el), "1" == a.workDayFlag && DateUtil.getCurrentTime(function (b) {
                c.el.append(c.ejsPath.bigtips, {lan: b.date == a.executeDate ? "l15684" : "l15685"}, function () {
                    var a = c.el.find("#transfer_big_tips");
                    a.on("click", "#btn_big_tips_sure", function () {
                        a.remove(), Common.LightBox.hide()
                    }), Common.LightBox.show(), CU.changeLan(CU.setObjAbsCenter(a))
                })
            }), c.el.find("#btn_confirm_102403").on("click", function () {
                var a = {transType: "0"}, d = {
                    fromAccountId: b.fromAccountId + "",
                    fromAccountType: b.fromAccountType,
                    fromAccountNum: b.fromAccountNum,
                    fromIbkNum: b.fromIbkNum,
                    fromAccountNickname: b.fromAccountNickname,
                    payeeId: b.payeeId,
                    payeeName: b.payeeName,
                    payeeActno: b.payeeActno,
                    payeeMobile: b.payeeMobile,
                    bankName: b.bankName,
                    currency: b.currency,
                    amount: b.amount,
                    remark: b.remark,
                    remittanceInfo: b.remittanceInfo,
                    executeDate: b.executeDate,
                    toOrgName: b.toOrgName,
                    cnapsCode: b.cnapsCode
                };
                Common.LightBox.show(), Common.postRequest(CU.createTokenId(c._conversationId)).then(function (b) {
                    var e = CU.ajaxDataHandle(b);
                    e ? (a.token = e, Common.postRequest(new Model("PsnTransNationalChangeBooking", a, c._conversationId)).then(function (b) {
                        var e = CU.ajaxDataHandle(b);
                        e ? ($.extend(a, d), a.batSeq = e.batSeq, a.transactionId = e.transactionId, a.currency = e.currency, a.amount = e.amount, a.commissionCharge = e.commissionCharge, a.postage = e.postage, a.furInfo = e.furInfo, a.status = e.status, a.needCommissionCharge = c._needCommissionCharge, a.preCommissionCharge = c._preCommissionCharge, a.remitSetMealFlag = c._remitSetMealFlag, c.el.find("#civilTransferSuccess").html(c.ejsPath.transferBigPushBill, a, function () {
                            Common.LightBox.hide(), c._flag && $("#jizhunfeiyong_finish").show(), c.el.find("#btn_print_102436").on("click", function () {
                                c.el.find("#transfer_big_push_bill").printArea()
                            }), c.el.find("#btn_tt").off("click").on("click", "a", function () {
                                Common.triggerAction("ReservationManage")
                            }), CU.changeLan(c.el.find("#transfer_big_push_bill"))
                        })) : Common.LightBox.hide()
                    })) : Common.LightBox.hide()
                })
            }), c.el.find("#btn_cancel_102404").on("click", function () {
                c.el.find("#civilTransferMain").show(), c.el.find("#civilTransferSuccess").hide()
            })
        }).show()
    },
    _datas: function () {
        var a = this, b = a._hashTbFromAcc.item(a.fromAccountSel.val), c = $("#txt_transinaccparent_1601").attr("payeeId"), d = a._payeeIdTable.item(c);
        return {
            fromAccountId: a.fromAccountSel.val + "",
            accountNumber: b.accountNumber,
            accountType: b.accountType,
            nickName: b.nickName,
            accountIbkNum: b.accountIbkNum,
            payeeName: $("#txt_payeename_1600").val(),
            payeeActno: $("#txt_transinaccparent_1601").val(),
            bankName: $("#txt_addaccforbank_1664").text(),
            toOrgName: $("#txt_addaccforbankname_1687").text(),
            payeeType: void 0 == d ? "" : d.type,
            payeeNickName: void 0 == d ? "" : d.payeeAlias,
            amount: $("#txt_transamount_1690").val().replace(/\,/g, ""),
            currency: Common.propertiesConfig["kind_of_currencies.currency_rmb"],
            payeeMobile: $("#txt_payeemobile_1696").val(),
            remark: $("#txt_postscript_1693").val().trim(),
            executeType: a._executeType,
            executeDate: $("#date_execdate_7818").val(),
            payeeId: c ? c + "" : "",
            cnapsCode: $("#txt_addaccforbank_1664").attr("payeecnaps"),
            _combinId: Common.SF.get("combinId"),
            sendmessageYn: $("#cb_sendmessagetopayee_1694_1").attr("checked"),
            saveAsPayeeYn: $("#saveAsPayee").attr("checked")
        }
    },
    _resetCivilTransfer: function () {
        var a = this;
        a.init()
    },
    _fillSelectData: function () {
        var a = this;
        Common.postRequest(new Model("PsnCommonQueryAllChinaBankAccount")).then(function (b) {
            var c = CU.ajaxDataHandle(b);
            if (c && c.length > 0) {
                var d = [];
                $.each(c, function (b, c) {
                    if (c.accountType == Common.propertiesConfig["account_type.greatwallelecdebitcard"] || c.accountType == Common.propertiesConfig["account_type.ordindemand"] || c.accountType == Common.propertiesConfig["account_type.allinonedemanddepos"] || c.accountType == Common.propertiesConfig["account_type.greatwallcrecard"]) {
                        a._hashTbFromAcc.add(c.accountId, c);
                        var e = "<span lan='payeraccount_" + c.accountType + "'>" + CU.getDictNameByKey("payeraccount_" + c.accountType) + "</span><span>" + Common.Security.mask("", c.accountNumber) + "</span><span>" + c.nickName + "</span><span lan='payeraccount_" + c.accountIbkNum + "'>" + CU.getDictNameByKey("payeraccount_" + c.accountIbkNum) + "</span>";
                        d.push({key: c.accountId, val: e}), a.fromAccountMap.add(c.accountId, c.accountNumber)
                    }
                });
                var e = {
                    data: d,
                    appendTo: $("#sel_transoutaccparent_1524").empty(),
                    defValue: d.length > 0 ? d[0].key + "" : "",
                    defText: d.length > 0 ? d[0].val : "",
                    oddCls: "even",
                    callback: function (b) {
                        var c = "104" == a._hashTbFromAcc.item(b.val).accountType;
                        $("#civilTransferMain #rd_trans_mode_0").attr("disabled", c).next().toggleClass("text-darkengray", c), $("#civilTransferMain #rd_trans_mode_" + (c ? "1" : "0")).trigger("click"), a.availableBalance(), c && Common.LightBox.showMessage(CU.getDictNameByKey("l90753"))
                    }
                };
                a.fromAccountSel = new ITSelect(e), a.fromAccountSel.setValue(d[0].key)
            }
            CU.changeLan(a.el.find("#sel_transoutaccparent_1524"))
        })
    },
    availableBalance: function () {
        var a = this, b = a.fromAccountSel.val + "", c = a._hashTbFromAcc.item(b), d = {accountId: a.fromAccountSel.val + ""};
        Common.LightBox.show(), "104" == c.accountType ? (model = new Model("PsnCrcdCurrencyQuery", {accountNumber: c.accountNumber}), Common.postRequest(model).then(function (c) {
            var d = CU.ajaxDataHandle(c);
            !d || "001" != d.currency1.code && "001" != d.currency2.code ? (a.el.find("#available_deposit_amount").text("-").parent().parent().show(), a.el.find("#available_balance").parent().parent().hide(), Common.LightBox.showMessage(CU.getDictNameByKey("l44606")), Common.LightBox.hide(), a.remainde_balance = "0") : Common.postRequest(new Model("PsnCrcdQueryAccountDetail", {
                accountId: b,
                currency: "001"
            })).then(function (b) {
                var c = CU.ajaxDataHandle(b);
                CU.isSuccesful(b) ? (a.el.find("#txt_transinaccparent_1601").removeClass("disabled").removeAttr("readonly", !1), a.el.find("#btn_selecttoaccount_2495").removeClass("btn-disabled"), Common.LightBox.hide(), c ? (a.el.find("#available_deposit_amount").text(c.crcdAccountDetailList[0].loanBalanceLimit.formatNum("001", !1, !0)).parent().parent().show(), a.el.find("#available_balance").parent().parent().hide(), a.remainde_balance = c.crcdAccountDetailList[0].loanBalanceLimit) : (a.el.find("#available_deposit_amount").text("-").parent().parent().show(), a.el.find("#available_balance").parent().parent().hide(), a.remainde_balance = "0")) : (Common.LightBox.hide(), a.el.find("#available_deposit_amount").text("-").parent().parent().show(), a.el.find("#available_balance").parent().parent().hide(), a.remainde_balance = "0", a.el.find("#txt_transinaccparent_1601").val("").addClass("disabled").attr("readonly", !0), a.el.find("#btn_selecttoaccount_2495").addClass("btn-disabled"))
            })
        })) : Common.postRequest(new Model("PsnAccountQueryAccountDetail", d)).then(function (b) {
            var c = CU.ajaxDataHandle(b);
            if (CU.isSuccesful(b))if (a.el.find("#txt_transinaccparent_1601").removeClass("disabled").removeAttr("readonly", !1), a.el.find("#btn_selecttoaccount_2495").removeClass("btn-disabled"), Common.LightBox.hide(), c && c.accountDetaiList && c.accountDetaiList.length > 0) {
                var d = 0;
                $.each(c.accountDetaiList, function (b, c) {
                    "001" == c.currencyCode && (d++, a.el.find("#available_balance").text(c.availableBalance.formatNum("001", !1, !0)).parent().parent().show(), a.el.find("#available_deposit_amount").parent().parent().hide(), a.remainde_balance = c.availableBalance)
                }), 0 == d && (a.el.find("#available_balance").text("-").parent().parent().show(), a.el.find("#available_deposit_amount").parent().parent().hide(), a.remainde_balance = 0, Common.LightBox.showMessage(CU.getDictNameByKey("l44606")))
            } else $("#civilTransferMain").find("#available_balance").text("-").parent().parent().show(), a.el.find("#available_deposit_amount").parent().parent().hide(), a.remainde_balance = "0", Common.LightBox.showMessage(CU.getDictNameByKey("l44606")); else Common.LightBox.hide(), $("#civilTransferMain").find("#available_balance").text("-").parent().parent().show(), a.el.find("#available_deposit_amount").parent().parent().hide(), a.remainde_balance = "0", a.el.find("#txt_transinaccparent_1601").val("").addClass("disabled").attr("readonly", !0), a.el.find("#btn_selecttoaccount_2495").addClass("btn-disabled")
        })
    },
    _queryAccountDetail: function () {
        var a = this, b = a.fromAccountSel.val;
        if (!b)return void Common.LightBox.showMessage(CU.getDictNameByKey("l6742"));
        var c = b + "", d = a._hashTbFromAcc.item(c), e = {accountId: c};
        if ("104" == d.accountType) {
            var f = new Model("PsnCrcdCurrencyQuery", {accountNumber: d.accountNumber});
            Common.LightBox.show(), Common.postRequest(f).then(function (b) {
                var d = CU.ajaxDataHandle(b);
                !d || "001" != d.currency1.code && "001" != d.currency2.code ? (Common.LightBox.hide(), Common.LightBox.showMessage(CU.getDictNameByKey("l44606"))) : Common.postRequest(new Model("PsnCrcdQueryAccountDetail", {
                    accountId: c,
                    currency: "001"
                })).then(function (b) {
                    var c = CU.ajaxDataHandle(b);
                    c ? (c.currency = "001", a.el.append(a.ejsPath.credQueryAccountDetail, c, function () {
                        var b = a.el.find("#credDetailPop");
                        a.el.find("#credClose, a.close").on("click", function () {
                            b.remove(), Common.LightBox.hide()
                        }), CU.changeLan(b), CU.setObjAbsCenter(b)
                    })) : Common.LightBox.hide()
                })
            })
        } else Common.LightBox.show(), Common.postRequest(new Model("PsnAccountQueryAccountDetail", e)).then(function (b) {
            var c = CU.ajaxDataHandle(b);
            c ? (Common.LightBox.hide(), a.el.append(a.ejsPath.queryAccountDetail, c, function () {
                var b = a.el.find("#div_balance_query");
                a.el.find("#btn_close_14727, a.close").on("click", function () {
                    b.remove(), Common.LightBox.hide()
                }), CU.changeLan(b), CU.setObjAbsCenter(b), Common.LightBox.show(a.el)
            })) : Common.LightBox.hide()
        })
    },
    _selectToAccount: function () {
        var a, b = this, c = {};
        $("#rd_trans_mode_1").is(":checked") ? (b.BOCFLAG = "3", b.transDirect.bocFlag = "3", a = "l56071") : (b.BOCFLAG = "0", b.transDirect.bocFlag = "0", a = "l50718"), c = {
            bocFlag: [b.BOCFLAG],
            isAppointed: "",
            payeeName: "",
            currentIndex: b.currentIndex,
            pageSize: b.pageSize
        };
        var d = new Model("PsnTransPayeeListqueryForDim", c);
        d.setCurrentIndex = function (a) {
            return a && (this.attributes.params.currentIndex = (a - 1) * this.attributes.params.pageSize), this
        }, Common.LightBox.show(), Common.postRequest(d).then(function (c) {
            var e = CU.ajaxDataHandle(c);
            e ? b.el.append(b.ejsPath.payeeQueryPop, {tab_lan: a}, function () {
                var a = b.el.find("#divBocPayeeAcct");
                a.find("#goto_manager_1048").on("click", "a", function () {
                    Common.triggerAction("ManagePayee"), Common.LightBox.hide()
                }), b.el.find("a.close, #btn_close_6830").on("click", function () {
                    a.remove(), Common.LightBox.hide()
                }), b.el.find("#btnBocSearchPayee").on("click", function () {
                    var c = $("#txtSearchPayee").val();
                    ("请输入收款人姓名" == c || "Please enter the payee name" == c) && (c = ""), b.localSearch(c, d, a)
                }), b.el.find("#txtSearchPayee").on("keydown", function (a) {
                    var b = CU.getKeyCode(a);
                    13 == b && $("#btnBocSearchPayee").trigger("click")
                }), b.queryData(e, d, a)
            }) : Common.LightBox.hide()
        })
    },
    localSearch: function (a, b, c) {
        var d = this;
        b.attributes.params.payeeName = a, b.attributes.params.bocFlag = [d.transDirect.bocFlag], b.attributes.params.currentIndex = "0", Common.postRequest(b).then(function (a) {
            var e = CU.ajaxDataHandle(a);
            e && d.queryData(e, b, c)
        })
    },
    queryData: function (a, b, c) {
        var d = this;
        a ? d.el.find("#divBocPayeeAcctList").html("").html(d.ejsPath.selectPayeeAccount, {
            list: a.list,
            crashOrNot: d.transDirect.bocFlag
        }, function () {
            d.paging2(d.ejsPath.selectPayeeAccount, b, "#divBocPayeeAcctList", "#different_trans_pager_foot", a.recordCount, 1, c), d.el.find("a.selectPayee").off("click").on("click", function (a) {
                d.bindEventTaga(a, !1), Common.LightBox.hide()
            }), CU.setObjAbsCenter(c), CU.changeLan(c)
        }) : (CU.setObjAbsCenter(c), CU.changeLan(c))
    },
    handleOpenChangeBooking: function (a) {
        var b = a.split(" "), c = (b[0], b[0] + " 09:00:00"), d = b[0] + " 17:00:00", e = Date.parse(c), f = Date.parse(d), g = Date.parse(a);
        return g > e && f > g ? "C" : "O"
    },
    different_banks_next: function () {
        var a = this, b = "", c = $("input[name=rd_exec_1727]:checked");
        if (!$("#txt_addaccforbank_1664").attr("payeecnaps"))return Common.LightBox.showMessage(CU.getDictNameByKey("l87915")), !1;
        if ($("#civilTransferMain").find("#txt_transamount_1690").val() > 5e4)return Common.LightBox.showMessage(CU.getDictNameByKey("l8880")), !1;
        if ("2" == c.val() && (b = a.el.find("#civilTransferMain").find("input[name='pay_cycle']:checked").val(), !b))return void Common.LightBox.showMessage(CU.getDictNameByKey("l48320"));
        a._data = "", a._data = "0" == a.transDirect.isAppointed ? {
            params: {
                fromAccountId: a.fromAccountSel.val + "",
                transoutaccparent: a.fromAccountSel.txt,
                payeeActno: $("#txt_transinaccparent_1601").val(),
                payeeActno2: $("#txt_transinaccparent_1601").val(),
                payeeName: $("#txt_payeename_1600").val(),
                payeeCnaps: $("#txt_addaccforbank_1664").attr("payeecnaps"),
                payeeBankName: $("#txt_addaccforbank_1664").attr("bankName"),
                payeeOrgName: $("#txt_addaccforbank_1664").attr("bankName"),
                currency: "001",
                amount: $("#txt_transamount_1690").val().replace(/\,/g, ""),
                memo: $("#txt_postscript_1693").val(),
                sendMsgFlag: $("#cb_sendmessagetopayee_1694_1").is(":checked") + "",
                executeType: a._executeType,
                _combinId: Common.SF.get("combinId") + ""
            }
        } : {
            params: {
                fromAccountId: a.fromAccountSel.val + "",
                payeeActno: $("#txt_transinaccparent_1601").val(),
                executeType: a._executeType,
                bankName: $("#txt_addaccforbank_1664").attr("bankName"),
                toOrgName: $("#txt_addaccforbank_1664").attr("bankName"),
                cnapsCode: $("#txt_addaccforbank_1664").attr("payeecnaps"),
                remark: $("#txt_postscript_1693").val(),
                amount: $("#txt_transamount_1690").val().replace(/\,/g, ""),
                payeeName: $("#txt_payeename_1600").val(),
                currency: "001",
                sendMsgFlag: $("#cb_sendmessagetopayee_1694_1").is(":checked") + "",
                payeeId: $("#txt_transinaccparent_1601").attr("payeeId") + "",
                _combinId: Common.SF.get("combinId") + ""
            }
        }, "true" === a._data.params.sendMsgFlag && $.extend(a._data.params, {
            payeeMobile: $("#txt_payeemobile_1696").val(),
            remittanceInfo: $("#txt_postscript_1693").val()
        }), "1" == a._data.params.executeType ? $.extend(a._data.params, {executeDate: $("#date_execdate_7818").val()}) : "2" == a._data.params.executeType && ($.extend(a._data.params, {
            startDate: $("#ul_state_date_data_36157").val(),
            endDate: $("#ul_end_date_data_36159").val(),
            cycleSelect: b
        }), "1" == a.transDirect.isAppointed && $.extend(a._data.params, {dueDate: $("#ul_state_date_data_36157").val()})), a.ischecked = $("#saveAsPayee").is(":checked"), Common.LightBox.show();
        var d = {};
        d = "1" == a.transDirect.isAppointed ? new Model("PsnDirTransCrossBankTransfer", a._data.params, a._conversationId) : new Model("PsnEbpsRealTimePaymentConfirm", a._data.params, a._conversationId), Common.postRequest(d).then(function (b) {
            var d = CU.ajaxDataHandle(b);
            if (d) {
                var e = {
                    serviceId: "0" == a.transDirect.isAppointed ? "PB113" : "PB118",
                    fromAccountId: a._data.params.fromAccountId + "",
                    currency: "001",
                    amount: a._data.params.amount,
                    cashRemit: "00",
                    remark: a._data.params.remark,
                    payeeActno: a._data.params.payeeActno,
                    payeeName: a._data.params.payeeName,
                    toOrgName: a._data.params.payeeOrgName || a._data.params.toOrgName,
                    memo: $("#txt_postscript_1693").val(),
                    cnapsCode: a._data.params.payeeCnaps || a._data.params.cnapsCode
                }, f = a._hashTbFromAcc.item(a.fromAccountSel.val);
                $.extend(a._data, {
                    accountIbkNum: f.accountIbkNum,
                    payeename: $("#txt_payeename_1600").val(),
                    transoutaccparent: a.fromAccountSel.txt,
                    execType: parseInt(c.val()),
                    transaccount: f,
                    execTypeText: c.next().text()
                }), Common.postRequest(new Model("PsnTransGetNationalTransferCommissionCharge", e)).then(function (b) {
                    Common.LightBox.hide();
                    var c = CU.ajaxDataHandle(b);
                    if (c) {
                        "104" == f.accountType ? $.extend(a._data, {
                            needCommissionCharge: "0",
                            preCommissionCharge: "0",
                            remitSetMealFlag: "0",
                            flag: !0
                        }) : "0" == c.getChargeFlag ? $.extend(a._data, {
                            needCommissionCharge: "",
                            preCommissionCharge: "",
                            remitSetMealFlag: "0",
                            flag: !0
                        }) : "0" == c.remitSetMealFlag && c.needCommissionCharge >= 0 ? $.extend(a._data, {
                            needCommissionCharge: c.needCommissionCharge,
                            preCommissionCharge: c.preCommissionCharge,
                            remitSetMealFlag: c.remitSetMealFlag,
                            flag: "true"
                        }) : $.extend(a._data, {
                            flag: !1,
                            preCommissionCharge: "0.00",
                            remitSetMealFlag: c.remitSetMealFlag
                        });
                        var e = $("#civilTransferConfirm");
                        e.html(a.ejsPath.aStrideBankPayConfirm, a._data, function () {
                            Common.SF.appendInputTo("#ulsf", function () {
                                a._data.flag && $("#jizhuanfeiyong_confirm").show(), CU.changeLan(e), e.show(), a.el.find("#btn_forward_36497").on("click", function () {
                                    $("#civilTransferMain").show(), $("#civilTransferConfirm").hide()
                                }), a.bindConfirm()
                            }, d)
                        }).siblings().hide()
                    }
                })
            } else Common.LightBox.hide()
        })
    },
    bindConfirm: function () {
        var a = this;
        Common.postRequest(new Model("PSNGetTokenId", a._conversationId)).then(function (b) {
            a.confirmToken = CU.ajaxDataHandle(b), a.confirmToken && a.el.find("#btn_confirm_36496").on("click", function () {
                a._confirm()
            })
        })
    },
    _confirm: function () {
        var a = this;
        if (formValid.checkAll(a.el)) {
            var b = "";
            b = "0" == a.transDirect.isAppointed ? {
                fromAccountId: a._data.params.fromAccountId + "",
                transoutaccparent: a._data.params.transoutaccparent,
                payeeActno: a._data.params.payeeActno,
                payeeName: a._data.params.payeeName,
                payeeCnaps: a._data.params.payeeCnaps,
                payeeBankName: a._data.params.payeeBankName,
                payeeOrgName: a._data.params.payeeOrgName,
                currency: a._data.params.currency,
                amount: a._data.params.amount,
                memo: a._data.params.memo,
                sendMsgFlag: a._data.params.sendMsgFlag,
                executeType: a._data.params.executeType,
                token: a.confirmToken
            } : {
                fromAccountId: a._data.params.fromAccountId + "",
                payeeActno: a._data.params.payeeActno,
                executeType: a._data.execType + "",
                bankName: a._data.params.bankName,
                toOrgName: a._data.params.toOrgName,
                cnapsCode: a._data.params.cnapsCode,
                remark: a._data.params.remark,
                amount: a._data.params.amount,
                payeeName: a._data.params.payeeName,
                currency: a._data.params.currency,
                payeeId: $("#txt_transinaccparent_1601").attr("payeeId"),
                sendMsgFlag: a._data.params.sendMsgFlag,
                token: a.confirmToken,
                _combinId: a._data.params._combinId
            };
            var c = Common.SF.get("Smc"), d = Common.SF.get("Otp");
            Common.AC.enabled && (b.devicePrint = encode_deviceprint());
            var e = Common.SF.get("signedData");
            if (e) {
                if (!e.result)return !1;
                $.extend(b, {_signedData: e.result})
            }
            c && $.extend(b, {
                activ: c.Version,
                state: c.State,
                Smc: c.Value,
                Smc_RC: c.RandomKey_C
            }), d && $.extend(b, {
                activ: d.Version,
                state: d.State,
                Otp: d.Value,
                Otp_RC: d.RandomKey_C
            }), "true" === b.sendMsgFlag && $.extend(b, {
                payeeMobile: a._data.params.payeeMobile,
                remittanceInfo: a._data.params.remittanceInfo
            }), "0" === b.executeType || ("1" === b.executeType ? (b.dueDate = $("#date_execdate_7818").val(), b.executeDate = $("#date_execdate_7818").val()) : (b.dueDate = $("#ul_state_date_data_36157").val(), b.startDate = $("#ul_state_date_data_36157").val(), b.endDate = $("#ul_end_date_data_36159").val(), b.cycleSelect = a._data.params.cycleSelect)), Common.LightBox.show();
            var f = "";
            f = "0" == a.transDirect.isAppointed ? new Model("PsnEbpsRealTimePaymentTransfer", b, a._conversationId) : new Model("PsnDirTransCrossBankTransferSubmit", b, a._conversationId), Common.postRequest(f).then(function (c) {
                Common.LightBox.hide();
                var d = CU.ajaxDataHandle(c);
                d ? a.preventForSwindle(d, b) : (Common.SF.clear(), Common.postRequest(new Model("PSNGetTokenId", a._conversationId)).then(function (b) {
                    a.confirmToken = CU.ajaxDataHandle(b)
                }), Common.postRequest(new Model("PSNGetTokenId", a._conversationId)).then(function (b) {
                    a.nextToken = CU.ajaxDataHandle(b)
                }))
            })
        }
    },
    _success: function (a, b) {
        var c = this;
        if (a) {
            var d = $("#civilTransferSuccess");
            c._data.batSequence = a.batSequence || a.batSeq, c._data.transactionId = a.transactionId, c._data.transoutaccparent = b.transoutaccparent, c._data.execType = b.executeType, "0" == c._data.execType && (c._data.remainde_balance = c.remainde_balance - c._data.params.amount - Number(c._data.preCommissionCharge)), d.html(c.ejsPath.aStrideBankPaySuccess, c._data, function () {
                c._data.flag && $("#jizhunfeiyong_success").show(), $("#btn_print_38552").on("click", function () {
                    c.el.find("#strideBankPrintInfo").printArea()
                }), c.ischecked && Common.postRequest(new Model("PSNGetTokenId", c._conversationId)).then(function (a) {
                    var b = CU.ajaxDataHandle(a);
                    c._data.paymentSaveParams = "", c._data.paymentSaveParams = "0" == c.transDirect.isAppointed ? {
                        payeeActno: c._data.params.payeeActno,
                        payeeName: c._data.params.payeeName,
                        payeeBankName: c._data.params.payeeBankName,
                        payeeOrgName: c._data.params.payeeOrgName,
                        payeeCnaps: c._data.params.payeeCnaps,
                        token: b
                    } : {
                        payeeActno: c._data.params.payeeActno,
                        payeeId: c._data.params.payeeId,
                        payeeName: c._data.params.payeeName,
                        bankName: c._data.params.bankName,
                        toOrgName: c._data.params.toOrgName,
                        cnapsCode: c._data.params.cnapsCode,
                        token: b
                    }, "true" === c._data.params.sendMsgFlag && (c._data.paymentSaveParams.payeeMobile = c._data.params.payeeMobile);
                    var d = new Model("0" == c.transDirect.isAppointed ? "PsnEbpsRealTimePaymentSavePayee" : "PsnDirTransCrossBankAddPayee", c._data.paymentSaveParams, c._conversationId);
                    Common.postRequest(d).then(function (a) {
                        CU.ajaxDataHandle(a)
                    })
                }), CU.changeLan(d), d.show()
            }).siblings().hide()
        }
    },
    paging2: function (a, b, c, d, e, f, g) {
        var h = this, i = {
            canvas: d, callbackFn: function (f) {
                Common.LightBox.setZIndex("913"), Common.postRequest(b.setCurrentIndex(f)).then(function (i) {
                    var j = CU.ajaxDataHandle(i);
                    j ? h.el.find(c).html(a, {list: j.list, crashOrNot: h.transDirect.bocFlag}, function () {
                        Common.LightBox.setZIndex("9"), h.paging2(a, b, c, d, e, f, g), h.el.find("a.selectPayee").off("click").on("click", function (a) {
                            h.bindEventTaga(a, !1), Common.LightBox.hide()
                        }), CU.changeLan(h.el.find(c))
                    }) : (h.el.find(d).empty(), h.el.find(d).hide())
                })
            }, pageIndex: f, point: h, recordCount: e, pageSize: 10
        }, j = Pager.getInstance();
        j.init(i), e > 0 ? $(d).show() : $(d).hide()
    },
    queryAccountNumber: function (a, b) {
        var c = this;
        $("#rd_trans_mode_1").is(":checked") ? (c.BOCFLAG = "3", c.transDirect.bocFlag = "3") : (c.BOCFLAG = "0", c.transDirect.bocFlag = "0");
        var d = {
            bocFlag: [c.BOCFLAG],
            isAppointed: "",
            payeeName: "",
            currentIndex: c.currentIndex,
            pageSize: 500
        }, e = new Model("PsnTransPayeeListqueryForDim", d);
        e.setCurrentIndex = function (a) {
            return a && (this.attributes.params.currentIndex = (a - 1) * this.attributes.params.pageSize), this
        }, Common.postRequest(e).then(function (d) {
            if (CU.isSuccesful(d)) {
                var e = CU.ajaxDataHandle(d);
                if (e && e.list && e.list.length > 0) {
                    if (c._hashTable && c._hashTable.clear(), c._payeeIdTable && c._payeeIdTable.clear(), e.list && e.list.length > 0) {
                        var f = [], g = [];
                        $.each(e.list, function (a, b) {
                            c._hashTable.add(b.accountNumber, b), c._payeeIdTable.add(b.payeetId, b), Common.currentUser.customerName == b.accountName ? f.push(b) : g.push(b)
                        }), e.list = f.concat(g)
                    }
                    b || ($("#show_account_infor_1900").length > 0 ? $("#show_account_infor_1900").show() : c.el.append(c.ejsPath.showAccount, {list: e.list}, function () {
                        var b = $("#show_account_infor_1900"), d = $("#txt_transinaccparent_1601"), e = d.offset2(), f = e.top + d.height(), g = e.left;
                        b.css({
                            position: "absolute",
                            top: f + "px",
                            left: g + "px"
                        }), b.off("click", "a").on("click", "a", function (a) {
                            c.bindEventTaga(a, !0)
                        }), a && a(), CU.changeLan(b)
                    }))
                } else a && a()
            } else a && a()
        })
    },
    bindEventTaga: function (a, b) {
        var c = this, d = $(b ? "#show_account_infor_1900" : "#divBocPayeeAcct"), e = c._payeeIdTable.item($($(a).closest("a")).attr("payeetId"));
        if (c.transDirect.isAppointed = $($(a).closest("a")).attr("isAppointed"), $("#span_payeename_1600").text(e.accountName), $("#txt_payeename_1600").val(e.accountName).removeClass("warning"), $("#span_transinaccparent_1601").text(e.accountNumber), $("#txt_transinaccparent_1601").attr("payeeId", e.payeetId), $("#txt_transinaccparent_1601").attr("accountNumber", e.accountNumber).val(e.accountNumber).removeClass("warning"), $("#saveAsPayee").attr("checked", !1).attr("disabled", "disabled"), $("#cb_sendmessagetopayee_1694_1").attr("checked", !0), $("#liPayeemobile").show(), $("#txt_payeemobile_1696").val(e.mobile).removeClass("warning"), $("#txt_addaccforbank_1664").attr({
                payeecnaps: e.cnapsCode,
                lan: "",
                bankName: e.bankName
            }).text(e.bankName), "0" == c.transDirect.bocFlag) {
            $("#txt_addaccforbankname_1687").attr({lan: "", bankName: e.address, title: e.address}).text(e.address);
            for (var f = Common.usualBankList, g = 0, h = f.length; h > g; g++)if ("-1" != f[g].bankName.indexOf(e.bankName)) {
                $("#txt_addaccforbank_1664").attr("toBankCode", f[g].toBankCode);
                break
            }
            "1" == c.transDirect.isAppointed ? ($("#span_transinaccparent_1601,#span_payeename_1600").show(), $("#txt_payeename_1600,#txt_transinaccparent_1601").attr("disabled", !0).addClass("disabled").hide(), Common.SF.showSelector("PB034", function () {
                c.el.find("#rd_exec_1727_1").trigger("click"), d.remove()
            }, null, c._conversationId)) : ($("#span_transinaccparent_1601,#span_payeename_1600").hide(), $("#txt_payeename_1600,#txt_transinaccparent_1601").attr("disabled", !1).removeClass("disabled").show(), Common.SF.showSelector("PB032", function () {
                c.el.find("#rd_exec_1727_1").trigger("click"), d.remove()
            }, null, c._conversationId))
        } else"1" == c.transDirect.isAppointed ? ($("#span_transinaccparent_1601,#span_payeename_1600").show(), $("#txt_payeename_1600,#txt_transinaccparent_1601").attr("disabled", !0).addClass("disabled").hide(), Common.SF.showSelector("PB118", function () {
            c.el.find("#rd_exec_1727_1").trigger("click"), d.remove()
        }, null, c._conversationId)) : ($("#span_transinaccparent_1601,#span_payeename_1600").hide(), $("#txt_payeename_1600,#txt_transinaccparent_1601").attr("disabled", !1).removeClass("disabled").show(), Common.SF.showSelector("PB113", function () {
            c.el.find("#rd_exec_1727_1").trigger("click"), d.remove()
        }, null, c._conversationId))
    }
});