/*! VERSION: 307_20131112, DATE: 2013-11-12 */
CurrencyUtil = {
    currency2CN: function (a) {
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(a))return "";
        var b = "仟佰拾亿仟佰拾万仟佰拾元角分", c = "";
        if (a += "00", a.length > b.length)return "";
        var d = a.indexOf(".");
        d >= 0 && (a = a.substring(0, d) + a.substr(d + 1, 2)), b = b.substr(b.length - a.length);
        for (var e = 0; e < a.length; e++)c += "零壹贰叁肆伍陆柒捌玖".charAt(a.charAt(e)) + b.charAt(e);
        return c.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整")
    }, formatCurrency: function (a) {
        var b = dojo.trim(a + "");
        if (null == b || "" == b)return "";
        for (var c = b.replace(/[^\d\.]/g, "").replace(/(\.\d{2}).+$/, "$1"), d = c.split("."); /\d{4}(,|$)/.test(d[0]);)d[0] = d[0].replace(/(\d)(\d{3}(,|$))/, "$1,$2");
        var e = d[0] + (d.length > 1 ? "." + d[1] : "");
        return e
    }, formatDecimalCurrency: function (a) {
        var b = dojo.trim(a + "");
        if (null == b || "" == b)return "-";
        var c = "+", d = parseFloat(a);
        0 > d && (c = "-");
        for (var e = b.replace(/[^\d\.]/g, "").replace(/(\.\d{2}).+$/, "$1"), f = e.split("."); /\d{4}(,|$)/.test(f[0]);)f[0] = f[0].replace(/(\d)(\d{3}(,|$))/, "$1,$2");
        var g = f[0];
        return f.length > 1 ? g = f[1].length > 1 ? g + "." + f[1] : g + "." + f[1] + "0" : g ? g += ".00" : "-", "-" == c && (g = "-" + g), g || "-"
    }, formatDecimalCurrencyToFixedThree: function (a) {
        var b = dojo.trim(a + "");
        if (null == b || "" == b)return "-";
        var c = "+", d = parseFloat(a);
        0 > d && (c = "-");
        for (var e = b.replace(/[^\d\.]/g, "").replace(/(\.\d{3}).+$/, "$1"), f = e.split("."); /\d{4}(,|$)/.test(f[0]);)f[0] = f[0].replace(/(\d)(\d{3}(,|$))/, "$1,$2");
        var g = f[0];
        return f.length > 1 ? g = f[1].length > 1 ? 3 != f[1].length ? g + "." + f[1] + "0" : g + "." + f[1] : g + "." + f[1] + "00" : g ? g += ".000" : "-", "-" == c && (g = "-" + g), g || "-"
    }, formatAllCurrency: function (a, b) {
        return null == a ? null : "027" == b ? this.amountFormat(a) : this.formatDecimalCurrency(a)
    }, replaceMoney: function (a) {
        return a = dojo.trim(a + ""), a.replace(/\,/g, "")
    }, amountFormat: function (a) {
        return a = this.formatCurrency(a), -1 == a.indexOf(".") ? a : a = a.substring(0, a.indexOf("."))
    }, CNYFormat: function (a) {
        for (var b = ["角", "分"], c = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"], d = new Array(["元", "万", "亿", "万"], ["", "拾", "佰", "仟"]), e = "", f = 0; f < b.length; f++)e += (c[Math.floor(10 * 1e3 * a * Math.pow(10, f) / 1e3) % 10] + b[f]).replace(/零./, "");
        e = e || "整", a = Math.floor(a);
        for (var f = 0; f < d[0].length && a > 0; f++) {
            for (var g = "", h = 0; h < d[1].length && a > 0; h++)g = c[a % 10] + d[1][h] + g, a = Math.floor(a / 10);
            e = g.replace(/(零.)*零$/, "").replace(/^$/, "零") + d[0][f] + e
        }
        return e.replace(/(零.)*零元/, "元").replace(/(零.)+/g, "零").replace(/^整$/, "零元整")
    }
};