/*! BUILD: 2015-02-11 */
document.oncontextmenu=function(a){var a=a||window.event;return a.returnValue=!1,!1},window.onhelp=function(){return!1},document.onkeydown=function(a){var a=a||window.event;if(a.altKey&&(37==a.keyCode||39==a.keyCode))return a.returnValue=!1,!1;if(8==a.keyCode){var b=a.srcElement?a.srcElement:a.target,c=b.nodeName.toUpperCase();if("INPUT"!==c&&"TEXTAREA"!==c&&"OBJECT"!==c)return a.returnValue=!1,!1;if(b.getAttribute("readonly")===!0||"readonly"===b.getAttribute("readonly"))return a.returnValue=!1,!1}return 116==a.keyCode||a.ctrlKey&&82==a.keyCode?(a.keyCode=0,a.returnValue=!1,!1):122==a.keyCode?(a.keyCode=0,a.returnValue=!1,!1):a.ctrlKey&&78==a.keyCode?(a.returnValue=!1,!1):a.shiftKey&&121==a.keyCode?(a.returnValue=!1,!1):a.srcElement&&"A"==a.srcElement.tagName&&a.shiftKey?(a.returnValue=!1,!1):a.altKey&&115==a.keyCode?(showModelessDialog("about:blank","","dialogWidth:1px;dialogheight:1px"),!1):void 0};