/*! BUILD: 2014-10-31 */
$.fn.extend({sec:function(a){"use strict";var b,c,d,e,f={width:200,height:22,mode:0,RandomKey_S:"",required:!0},g=[{PasswordIntensityMinLength:8,MaxLength:20,OutputValueType:2,PasswordIntensityRegularExpression:"^[a-zA-Z0-9]*$",reg:"reg9",tips:"tips0239"},{PasswordIntensityMinLength:8,MaxLength:20,OutputValueType:2,PasswordIntensityRegularExpression:"(^[!-~]*[A-Za-z]+[!-~]*[0-9]+[!-~]*$)|(^[!-~]*[0-9]+[!-~]*[A-Za-z]+[!-~]*$)",reg:"reg27",tips:"tips0239"},{PasswordIntensityMinLength:6,MaxLength:6,OutputValueType:1,PasswordIntensityRegularExpression:"^[0-9]{6}$",reg:"reg57",tips:"tips0266"},{PasswordIntensityMinLength:6,MaxLength:6,OutputValueType:1,PasswordIntensityRegularExpression:"^[0-9]{6}$",reg:"reg57",tips:"tips0266"},{PasswordIntensityMinLength:8,MaxLength:20,OutputValueType:1,PasswordIntensityRegularExpression:"^[!-~]*$",reg:"reg27",tips:"tips0239"},{PasswordIntensityMinLength:3,MaxLength:3,OutputValueType:1,PasswordIntensityRegularExpression:"^[0-9]{3}$",reg:"reg57",tips:"tips0266"},{PasswordIntensityMinLength:8,MaxLength:20,OutputValueType:2,PasswordIntensityRegularExpression:"^[^＀-￿]*$",reg:"reg27",tips:"tips0239"},{PasswordIntensityMinLength:6,MaxLength:6,OutputValueType:1,PasswordIntensityRegularExpression:"^[0-9]{6}$",reg:"reg57",tips:"tips0266"},{PasswordIntensityMinLength:6,MaxLength:6,OutputValueType:2,PasswordIntensityRegularExpression:"^[0-9]{6}$",reg:"reg57",tips:"tips0266"},{PasswordIntensityMinLength:8,MaxLength:20,OutputValueType:2,PasswordIntensityRegularExpression:"((?=^[0-9a-zA-Z~!@#$%^&*()_+-=[]{}\\|;':\",.<>/?]{8,20}$)((?=.*[0-9])(?=.*[a-zA-Z])|(?=.*[~!@#$%^&*()_+-=[]{}\\|;':\",.<>/?])(?=.*[a-zA-Z])|(?=.*[0-9])(?=.*[~!@#$%^&*()_+-=[]{}\\|;':\",.<>/?])).*$)",reg:"reg114",tips:"tips0319"},{PasswordIntensityMinLength:6,MaxLength:20,OutputValueType:2,PasswordIntensityRegularExpression:"^[!-~]*$",reg:"reg27",tips:"tips0239"},{PasswordIntensityMinLength:8,MaxLength:20,OutputValueType:2,PasswordIntensityRegularExpression:"(^[!-~]*[A-Za-z]+[!-~]*[0-9]+[!-~]*$)|(^[!-~]*[0-9]+[!-~]*[A-Za-z]+[!-~]*$)",reg:"reg114",tips:"tips0319"},{PasswordIntensityMinLength:8,MaxLength:20,OutputValueType:1,PasswordIntensityRegularExpression:"^[!-~]*[a-zA-Z0-9]+[!-~]*$",reg:"reg144",tips:"tips0541"},{PasswordIntensityMinLength:6,MaxLength:6,OutputValueType:1,PasswordIntensityRegularExpression:"^[0-9]{6}$",reg:"reg57",tips:"tips0266"},{PasswordIntensityMinLength:8,MaxLength:8,OutputValueType:1,PasswordIntensityRegularExpression:"^[0-9]{8}$",reg:"reg57",tips:"tips0266"},{PasswordIntensityMinLength:10,MaxLength:10,OutputValueType:1,PasswordIntensityRegularExpression:"^[0-9]{10}$",reg:"reg57",tips:"tips0266"},{PasswordIntensityMinLength:11,MaxLength:11,OutputValueType:1,PasswordIntensityRegularExpression:"^[0-9]{11}$",reg:"reg57",tips:"tips0266"}],h="SecEditCtrl";if("string"==typeof a)try{if(c=$(this).children().get(0),"clear"===a.toLowerCase())return this.each(function(a,b){$(b).removeClass("warning").removeAttr("pass").children().get(0).Clear()});if("RandomKey_C"===a)return $(this).attr("RC");if("State"!==a)return a=$.browser.msie||"Value"!==a?a:"value",e=c[a],"PasswordLengthIntensity"===a||"PasswordComplexIntensity"===a?"false"!=$(this).attr("required")||c.Value?$.browser.msie?!!parseInt(e):e:1:e?e+"":null;try{return d=c.State?c.State+"":null,void 0===d?"0":d}catch(i){return"0"}}catch(j){return console&&console.warn&&console.warn(j.message),""}return b=$.extend({},f,a),$.extend(b,g[b.mode]),this.each(function(){var a,c,d;$.browser.msie||$.browser.mozilla&&5==$.browser.version?(a='<object classid="',a+='clsid:E61E8363-041F-455c-8AD0-8A61F1D8E540" '):a='<object type="application/npSecEditCtl.BOC.x86" ',a+='width="'+(b.width-2)+'"',a+='height="'+(b.height-2)+'">',$.browser.msie||(a+='<param name="PasswordIntensityMinLength" value="'+b.PasswordIntensityMinLength+'"/>',a+='<param name="MaxLength" value="'+b.MaxLength+'"/>',a+='<param name="OutputValueType" value="'+b.OutputValueType+'"/>',a+='<param name="PasswordIntensityRegularExpression" value="'+b.PasswordIntensityRegularExpression+'"/>',a+='<param name="RandomKey_S" value="'+b.RandomKey_S+'"/>'),a+="</object>";var e=this;$(this).empty().addClass(h).css({width:b.width-2+"px",height:b.height-2+"px",borderTop:"1px solid white",borderBottom:"1px solid white"}).attr({tips:"tipsrequired tipsmax tipsmin "+b.tips,validateGroup:"{required:true,maxLength:"+b.MaxLength+",minLength:"+b.PasswordIntensityMinLength+","+b.reg+":true}",required:""+b.required}).html(a),c=$(this).children().get(0),d=setInterval(function(){c.Version&&(clearInterval(d),($.browser.msie||$.browser.mozilla&&5==$.browser.version)&&(c.PasswordIntensityMinLength=b.PasswordIntensityMinLength,c.MaxLength=b.MaxLength,c.OutputValueType=b.OutputValueType,c.PasswordIntensityRegularExpression=b.PasswordIntensityRegularExpression,c.RandomKey_S=b.RandomKey_S),$(e).attr("RC",c.RandomKey_C))},200),$(this).on("focus",function(){c.focus(),b.focus&&b.focus()})})}});