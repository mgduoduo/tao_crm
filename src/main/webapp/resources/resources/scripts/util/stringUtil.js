/*! BUILD: 2014-07-09 */
StringUtil={sbc2dbc:function(a){for(var b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);b+=String.fromCharCode(12288!=d?d>65280&&65375>d?d-65248:d:d-12256)}return b},clearLeft0:function(a){return a?a.replace(/^0+/g,""):""},maskMobile:function(a){return a.substr(0,3)+"****"+a.substr(7,4)},maskAccount:function(a){return a?(a+="",a.substr(0,4)+"******"+a.substr(a.length-4,4)):""},maskIdentity:function(a){return(a?a+"":"").replace(/\B\w\B/g,"*")},substring:function(a,b,c){if("string"!=typeof a)return"";var d=a.split(""),e=0;result="";for(var f=b;f<a.length&&(result+=d[f],e+=d[f].len(),!(e>=c));f++);return result}};