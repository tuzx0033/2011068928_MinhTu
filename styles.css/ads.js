Function.prototype.bind||(Function.prototype.bind=function(){var e=this,t=Array.prototype.slice.call(arguments),i=t.shift();return function(){return e.apply(i,t.concat(Array.prototype.slice.call(arguments)))}});var isMobile={Android:function(){return navigator.userAgent.match(/Android/i)},BlackBerry:function(){return navigator.userAgent.match(/BlackBerry/i)},iOS:function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i)},Opera:function(){return navigator.userAgent.match(/Opera Mini/i)},Windows:function(){return navigator.userAgent.match(/IEMobile/i)},any:function(){return isMobile.Android()||isMobile.BlackBerry()||isMobile.iOS()||isMobile.Opera()||isMobile.Windows()}},enDic={CLOSE_TEXT_LABEL:"Close Ad",ERROR_MESSAGE_LABEL:"Video content error. Please try again by Ctrl + F5!",AD_MESSAGE:"Ad will show after",AD_LOADING:"Ad loading...",AD_SKIP:"Close Ad after",AD_DIMENSSION:"s",REPLAY_LABEL:"Replay",STOP_LABEL:"Stop",AUTO_NEXT_LABEL:"Next",SUGGESTION_LABEL:"Suggestion"},viDic={CLOSE_TEXT_LABEL:"Bỏ qua quảng cáo",ERROR_MESSAGE_LABEL:"Nội dung không thể xem lúc này. Vui lòng Ctrl + F5 để thử lại!",AD_MESSAGE:"Quảng cáo có thể hiển thị sau",AD_SKIP:"Bỏ qua quảng cáo sau",AD_LOADING:"Đang tải quảng cáo...",AD_DIMENSSION:"giây",REPLAY_LABEL:"Xem lại",STOP_LABEL:"Dừng",AUTO_NEXT_LABEL:"Tiếp theo",SUGGESTION_LABEL:"Có thể bạn quan tâm"},selectDic="undefined"!=typeof SITE_ID&&1003888==SITE_ID||"undefined"!=typeof ZONE_ADS&&1==ZONE_ADS?enDic:viDic;function AdObject(e,t,n,o,a){var r=e,d=e.id().replace("_html5_api",""),s=e.contentEl().children[0],l="";if(0==a)l=o;else;this.moinitIMA=!1,this.moinitAd=!1;var c,g,m,u,p,f,h,y,A=!1,E=!1,T=[],w=document.getElementById(t),b=document.getElementById(n),S="paused",_=null,D=!1;this.mainSource=r.src(),this.moadDataXml="";var L,I=6,M=null,C=null,O=5,x=null,N=!1;this.moMainCurrentTime=0;var R="";this.playAd=function(){return E},this.loadAd=function(){return A},this.initAd=function(e){if(!e)return this.moinitAd;this.moinitAd=e},this.pauseAd=function(){m&&m.pause()},this.initAdPlugin=function(e){if(!e)return this.moinitIMA;this.moinitIMA=e},this.mainCurrentTime=function(e){if(void 0===e)return this.moMainCurrentTime;this.moMainCurrentTime=e},this.moslotForCurrentTime=function(e){for(v in u=null,T)T[v].seen||T[v].time!=e||(u=T[v]);u&&B(u)},this.moslotForType=function(e){for(v in T)if(!T[v].seen&&T[v].type==e)return(u=T[v])&&B(u),T[v];return null},this.removeAdData=function(){clearInterval(C),clearTimeout(_),clearTimeout(x),m&&m.destroy(),w&&(w.innerHTML="",w.style.display="none"),L&&r&&document.getElementById(r.id())&&(document.getElementById(r.id()).removeChild(L),L=null),b&&(b.innerHTML="",b.style.display="none",b.style.height="1px",b.style.width="1px"),A=!1,E=!1,moMainCurrentTime=0,r&&(mainSource=r.src()),this.initIMA()},this.initIMA=function(){"undefined"!=typeof google&&w&&(w.style.display="none",google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED),c=new google.ima.AdDisplayContainer(w,s),g=new google.ima.AdsLoader(c),m=null,g.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,k,!1,g),g.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR,(function(e){F(e)}),!1)),this.initAdPlugin(!0)};var k=function(e){var t=new google.ima.AdsRenderingSettings;t.restoreCustomPlaybackStateOnAdBreakComplete=!0,t.useStyledNonLinearAds=!0,t.bitrate=4e3,(m=e.getAdsManager(s,t)).addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR,F),m.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSETE_REQUESD,U),m.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,H),m.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED,V),m.addEventListener(google.ima.AdEvent.Type.LOADED,V),m.addEventListener(google.ima.AdEvent.Type.STARTED,V),m.addEventListener(google.ima.AdEvent.Type.AD_PROGRESS,V),m.addEventListener(google.ima.AdEvent.Type.COMPLETE,V),m.addEventListener(google.ima.AdEvent.Type.FIRST_QUARTILE,V),m.addEventListener(google.ima.AdEvent.Type.MIDPOINT,V),m.addEventListener(google.ima.AdEvent.Type.THIRD_QUARTILE,V),m.addEventListener(google.ima.AdEvent.Type.CLICK,V),m.addEventListener(google.ima.AdEvent.Type.SKIPPED,V),m.addEventListener(google.ima.AdEvent.Type.VOLUME_MUTED,V),m.addEventListener(google.ima.AdEvent.Type.VOLUME_CHANGED,V),m.addEventListener(google.ima.AdEvent.Type.RESUMED,V),m.addEventListener(google.ima.AdEvent.Type.IMPRESSION,V),m.addEventListener(google.ima.AdEvent.Type.LINEAR_CHANGED,V),m.addEventListener(google.ima.AdEvent.Type.PAUSED,V),m.addEventListener(google.ima.AdEvent.Type.USER_CLOSE,V),m&&m.setVolume(s.muted?0:Math.max(.1,s.volume-.3));try{m.init(s.offsetWidth,s.offsetHeight,google.ima.ViewMode.NORMAL),m.start()}catch(e){w.style.display="none"}}.bind(this);this.moinitAds2=function(e){if(window.adb||"undefined"==typeof google)return!1;c&&c.initialize(),T=[],O=5,L=document.createElement("div"),document.getElementById(r.id()).appendChild(L),L&&(L.className="ad_time_txt",L.innerHTML=selectDic.AD_MESSAGE+' <strong style="color:#fff; font-size: 13px;">'+O+"</strong> "+selectDic.AD_DIMENSSION),setTimeout((function(){L&&(L.className="ad_time_txt txt_fly_in")}),100),clearInterval(M),M=setInterval(function(){if(r.paused())return!1;O-=1,L&&(L.innerHTML=selectDic.AD_MESSAGE+' <strong style="color:#fff; font-size: 13px;">'+O+"</strong> "+selectDic.AD_DIMENSSION),1==O&&(clearInterval(M),this.moslotForType("pre-roll")||(moadsShowing=!1,m&&m.destroy(),w.style.display="none",clearTimeout(y),L.className="ad_time_txt",setTimeout((function(){L&&document.getElementById(r.id())&&(document.getElementById(r.id()).removeChild(L),L=null)}),1100),moresumeMainContent(!1)))}.bind(this),1e3);try{var t=0,n=0,o=0;for(i in over=0,e.adlist)switch(e.adlist[i].type){case"preroll":var a=new moAdSlot("pre-roll-"+t,"pre-roll",0,"",e.adlist[i].duration,convertTimeFormat(e.adlist[i].skipOffset),"",e.adlist[i].tag,"",r.duration());t++,T.push(a);break;case"midroll":a=new moAdSlot("mid-roll-"+n,"mid-roll",e.adlist[i].offset,"",e.adlist[i].duration,convertTimeFormat(e.adlist[i].skipOffset),"",e.adlist[i].tag,"",r.duration());n++,T.push(a);break;case"postroll":a=new moAdSlot("post-roll-"+o,"post-roll",r.duration(),"",e.adlist[i].duration,convertTimeFormat(e.adlist[i].skipOffset),"",e.adlist[i].tag,"",r.duration());o++,T.push(a);break;case"overlay":a=new moAdSlot("overlay"+over,"overlay",e.adlist[i].offset,"",convertTimeFormat(e.adlist[i].duration),convertTimeFormat(e.adlist[i].skipOffset),e.adlist[i].size,e.adlist[i].tag,e.adlist[i].script,r.duration());over++,T.push(a)}console.log(T)}catch(a){console.log("LOG:ADS",a)}}.bind(this),this.moinitAds=function(e){if(window.adb||"undefined"==typeof google)return!1;c&&c.initialize(),T=[];try{var t=new XMLHttpRequest;if(t.onreadystatechange=function(i){if(4==t.readyState&&200==t.status&&(moadDataXml=t.responseXML,t.getResponseHeader("Content-Type").indexOf("xml")>0&&1==validateXML(moadDataXml))){try{var n=document.createAttribute("adtitle");n.value=moadDataXml.getElementsByTagName("AdTitle")[0].childNodes[0].nodeValue,s.setAttributeNode(n)}catch(i){console.log("cannot add attribute for video tag!!!")}try{var o=1==moadDataXml.getElementsByTagName("Configs").length?parseAdsParameters(moadDataXml.getElementsByTagName("Configs")[0].childNodes[0].nodeValue):parseAdsParameters('{"'+moadDataXml.getElementsByTagName("Ad")[0].getAttribute("id")+'":{"type":"preroll","skipOffset":"00:00:06","duration":"00:00:30"}}'),a=0,d=0,l=0,c=0;Object.keys(o).forEach((function(e){for(var t=moadDataXml.getElementsByTagName("Ad"),i=0;i<t.length;i++)if(t[i].getAttribute("id")===e){t[i];switch(o[e].type){case"preroll":var n=new moAdSlot("pre-roll-"+a,"pre-roll",0,e,convertTimeFormat(o[e].duration),convertTimeFormat(o[e].skipOffset),"","",null!=o[e].script?o[e].script:"",r.duration());a++,T.push(n);break;case"midroll":n=new moAdSlot("mid-roll-"+d,"mid-roll",convertTimeFormat(o[e].starttime),e,convertTimeFormat(o[e].duration),convertTimeFormat(o[e].skipOffset),"","",null!=o[e].script?o[e].script:"",r.duration());d++,T.push(n);break;case"postroll":n=new moAdSlot("post-roll-"+l,"post-roll",r.duration(),e,convertTimeFormat(o[e].duration),convertTimeFormat(o[e].skipOffset),"","",null!=o[e].script?o[e].script:"",r.duration());l++,T.push(n);break;case"overlay":n=new moAdSlot("overlay"+c,"overlay",convertTimeFormat(o[e].starttime),e,convertTimeFormat(o[e].duration),convertTimeFormat(o[e].skipOffset),"","",null!=o[e].script?o[e].script:"",r.duration());c++,T.push(n)}}})),this.moslotForType("pre-roll")}catch(i){try{errorTrackingUrl=e.getElementsByTagName("Error")[0].childNodes[0].nodeValue}catch(i){errorTrackingUrl=""}}try{moadDataXml.getElementsByTagName("AdRequest")[0].childNodes[0].nodeValue}catch(i){}}}.bind(this),e.indexOf("eclick.vn")>=0)t.open("GET",decodeURI(e)+(decodeURI(e).indexOf("?")>0?"&dur=":"?dur=")+r.duration()+"&sw="+s.offsetWidth+"&sh="+s.offsetHeight+"&fosp_aid="+getCookie("fosp_aid")+"&retargeting_id="+("undefined"!=typeof ASPQ_gebMWv?ASPQ_gebMWv:"")+"&gwdadgroup="+("undefined"!=typeof gwdadgroup?gwdadgroup:"")+"&gwdblob="+("undefined"!=typeof gwdblob?gwdblob:"")+"&gwdadserver="+("undefined"!=typeof gwdadserver?gwdadserver:"")+"&gwd="+("undefined"!=typeof gwd?gwd:"")+"&pv="+(Math.random().toString(36)+"00000000000000000").slice(2,12)+"&adb="+window.adb+(null!=s.getAttribute("data-ex")&&""!=s.getAttribute("data-ex")?"&"+s.getAttribute("data-ex"):""),!0);else{var i=window.location!=window.parent.location?document.referrer:document.location.href,n=decodeURI(e);n=(n=n.replace("[timestamp]",(new Date).getTime())).replace("[referrer_url]",encodeURI(i));try{e=window.location.href.split("/");n=n.replace("[description_url]",encodeURI(e[0]+"//"+e[2]))}catch(e){console.log("cannot get href")}n+="&cust_params="+encodeURIComponent("ap=0"+(null!=s.getAttribute("data-ex")&&""!=s.getAttribute("data-ex")?"&"+s.getAttribute("data-ex"):"")),t.open("GET",n)}window.ASPQ_gebMWv=window.gwdadgroup=window.gwdblob=window.gwdadserver=window.gwd="",t.withCredentials=!1,t.send()}catch(e){console.log("error load ad data!"+e)}}.bind(this);var B=function(e){if(N=!1,A=!0,clearInterval(C),clearTimeout(_),window.adb)return!1;if(e.seen=!0,""!=l)try{if("overlay"==e.type)if(""!=e.tag){if((i=e.tag).indexOf("eclick.vn")>=0)i.open("GET",decodeURI(t)+(decodeURI(t).indexOf("?")>0?"&dur=":"?dur=")+r.duration()+"&sw="+s.offsetWidth+"&sh="+s.offsetHeight+"&fosp_aid="+getCookie("fosp_aid")+"&retargeting_id="+("undefined"!=typeof ASPQ_gebMWv?ASPQ_gebMWv:"")+"&gwdadgroup="+("undefined"!=typeof gwdadgroup?gwdadgroup:"")+"&gwdblob="+("undefined"!=typeof gwdblob?gwdblob:"")+"&gwdadserver="+("undefined"!=typeof gwdadserver?gwdadserver:"")+"&gwd="+("undefined"!=typeof gwd?gwd:"")+"&pv="+(Math.random().toString(36)+"00000000000000000").slice(2,12)+"&adb="+window.adb+(null!=s.getAttribute("data-ex")&&""!=s.getAttribute("data-ex")?"&"+s.getAttribute("data-ex"):""),!0);else{i=(i=decodeURI(i)).replace("[timestamp]",(new Date).getTime());try{var t=window.location.href.split("/");i=i.replace("[description_url]",encodeURI(t[0]+"//"+t[2]))}catch(e){console.log("cannot get href")}i=i.replace("[referrer_url]",encodeURI(window.location!=window.parent.location?document.referrer:document.location.href)),i+="&cust_params="+encodeURIComponent("ap=0"+(null!=s.getAttribute("data-ex")&&""!=s.getAttribute("data-ex")?"&"+s.getAttribute("data-ex"):""))}"undefined"!=typeof google&&P(i,!0),window.ASPQ_gebMWv=window.gwdadgroup=window.gwdblob=window.gwdadserver=window.gwd=""}else G(e);else{var i;if((i=e.tag).indexOf("eclick.vn")>=0)i.open("GET",decodeURI(t)+(decodeURI(t).indexOf("?")>0?"&dur=":"?dur=")+r.duration()+"&sw="+s.offsetWidth+"&sh="+s.offsetHeight+"&fosp_aid="+getCookie("fosp_aid")+"&retargeting_id="+("undefined"!=typeof ASPQ_gebMWv?ASPQ_gebMWv:"")+"&gwdadgroup="+("undefined"!=typeof gwdadgroup?gwdadgroup:"")+"&gwdblob="+("undefined"!=typeof gwdblob?gwdblob:"")+"&gwdadserver="+("undefined"!=typeof gwdadserver?gwdadserver:"")+"&gwd="+("undefined"!=typeof gwd?gwd:"")+"&pv="+(Math.random().toString(36)+"00000000000000000").slice(2,12)+"&adb="+window.adb+(null!=s.getAttribute("data-ex")&&""!=s.getAttribute("data-ex")?"&"+s.getAttribute("data-ex"):""),!0);else{i=(i=decodeURI(i)).replace("[timestamp]",(new Date).getTime());try{t=window.location.href.split("/");i=i.replace("[description_url]",encodeURI(t[0]+"//"+t[2]))}catch(e){console.log("cannot get href")}i=i.replace("[referrer_url]",encodeURI(window.location!=window.parent.location?document.referrer:document.location.href));try{t=window.location.href.split("/");i=i.replace("[description_url]",encodeURI(t[0]+"//"+t[2]))}catch(e){console.log("cannot get href")}i+="&cust_params="+encodeURIComponent("ap=0"+(null!=s.getAttribute("data-ex")&&""!=s.getAttribute("data-ex")?"&"+s.getAttribute("data-ex"):"")+"&aex=0&brs="+(ZONE_BRANDSAFE||"")+"&article="+Video.articleId)}"undefined"!=typeof google&&P(i,!0),window.ASPQ_gebMWv=window.gwdadgroup=window.gwdblob=window.gwdadserver=window.gwd=""}}catch(e){console.log(e)}else{if(""!=e.script){var n=document.createElement("script");n.text=decodeURIComponent(e.script),document.head.appendChild(n).parentNode.removeChild(n)}try{for(var o=moadDataXml.getElementsByTagName("Ad"),a=0;a<o.length;a++)if(o[a].getAttribute("id")===e.id){var d=(new DOMParser).parseFromString('<VAST version="2.0"></VAST>',"text/xml");d.getElementsByTagName("VAST")[0].appendChild(o[a]);t=(new XMLSerializer).serializeToString(d);"undefined"!=typeof google&&P(t,!1)}}catch(e){console.log("error load ad data!"+e)}}}.bind(this),P=function(e,t){clearInterval(C),R=r.poster(),r.poster(""),mainSource=r.src(),moMainCurrentTime=r.currentTime(),"post-roll"!=u.type&&"mid-roll"!=u.type||r.pause(),w.style.backgroundColor="transparent",w.style.height="1px",w.style.width="1px",w.style.top=0,w.style.left=0,w.style.display="block";var i=new google.ima.AdsRequest;t?i.adTagUrl=e:i.adsResponse=e,i.linearmoAdSlotWidth=s.offsetWidth,i.linearmoAdSlotHeight=s.offsetHeight,i.nonLinearmoAdSlotWidth=s.offsetWidth,i.nonLinearmoAdSlotHeight=s.offsetHeight,g.requestAds(i)}.bind(this),U=function(){moMainCurrentTime=r.currentTime(),r.pause()}.bind(this),H=function(){this.moresumeMainContent(!0)}.bind(this),F=function(e){var t=e.getError();console.log(t),m&&m.destroy(),clearInterval(C),w.style.display="none",A=!1,E=!1,clearTimeout(y),clearInterval(M),L&&(L.className="ad_time_txt"),setTimeout((function(){L&&document.getElementById(r.id())&&(document.getElementById(r.id()).removeChild(L),L=null)}),1100),this.moresumeMainContent(400==t.getErrorCode()||400==t.getVastErrorCode())}.bind(this),V=function(e){switch(p=e.getAd(),e.type){case google.ima.AdEvent.Type.USER_CLOSE:this.moresumeMainContent(!0);break;case google.ima.AdEvent.Type.PAUSED:S="paused";try{playerStatusChange(d,"paused")}catch(e){console.log(e)}break;case google.ima.AdEvent.Type.RESUMED:S="playing";try{playerStatusChange(d,"playing")}catch(e){console.log(e)}break;case google.ima.AdEvent.Type.FIRST_QUARTILE:case google.ima.AdEvent.Type.MIDPOINT:case google.ima.AdEvent.Type.THIRD_QUARTILE:break;case google.ima.AdEvent.Type.CLICK:"paused"==S?m.resume():"playing"==S&&m.pause();break;case google.ima.AdEvent.Type.SKIPPED:case google.ima.AdEvent.Type.IMPRESSION:case google.ima.AdEvent.Type.VOLUME_MUTED:case google.ima.AdEvent.Type.VOLUME_CHANGED:break;case google.ima.AdEvent.Type.LOADED:if(console.log("AD INFO: ",p),void 0!==window.track&&window.track.length>0)for(var t=0;t<window.track.length;t++)window.track[t].mode="hidden";if(w.style.height="100%",w.style.width="100%",p.getContentType().indexOf("audio")>=0||0==s.offsetHeight||p.getContentType().indexOf("video/3gpp")>=0)return m.stop(),!1;if(clearInterval(M),L&&(L.innerHTML=selectDic.AD_LOADING),p.isLinear()){for(v in isMobile.any()?(isMobile.Android()||document.getElementById(d).children[0].src==mainSource)&&r.pause():r.pause(),T)!T[v].seen&&"overlay"==T[v].type&&r.currentTime()+15>T[v].time&&r.currentTime()+15<r.duration()&&(T[v].time=Math.floor(r.currentTime()+15));w.style.left="0",w.style.top="0",E=!0}else E=!1,w.style.top="-40px",clearTimeout(_),_=setTimeout((function(){m.stop()}),1e4);break;case google.ima.AdEvent.Type.AD_PROGRESS:D||5!=Math.round(e.getAdData().duration-m.getRemainingTime())||(D=!0,Video.trackingDataPlayer(r.id(),"videoAd5s",r.src(),"",((new Date).getTime()-r.rtv)/1e3),r.rtv=(new Date).getTime()),document.getElementById(d+"_adProgess")&&(document.getElementById(d+"_adProgess").style.width=100*(e.getAdData().duration-m.getRemainingTime())/e.getAdData().duration+"%");break;case google.ima.AdEvent.Type.STARTED:if(Video.trackingDataPlayer(r.id(),"videoAdStart",r.src(),"0%",((new Date).getTime()-r.rtv)/1e3),r.rtv=(new Date).getTime(),p.isLinear()){try{r.player_.removeClass("vjs-controls-enabled"),r.player_.addClass("vjs-controls-disabled")}catch(e){console.log("cannot hide controls!!!")}r.pause(),(p.getContentType().indexOf("video")>=0||p.getContentType().indexOf("application/x-mpeg")>=0||p.getContentType().indexOf("application/javascript")>=0)&&(w.style.display="block",(f=document.createElement("div")).className="fp-ad-close-text",f.id=d+"_fpAdClose",f.style.fontSize=Math.round(5*s.offsetHeight)/100+"px",(h=document.createElement("div")).className="vjs-progress-holder vjs-slider vjs-slider-horizontal",h.id=d+"_adProgressBar",h.style.height="4px",h.style.backgroundColor="#acacac",h.style.display=p.getContentType().indexOf("application/javascript")>=0?"none":"block",h.style.position="absolute",h.style.bottom="0",h.style.width="100%",h.style.margin="0",h.style.padding="0",""!=w.innerHTML&&(w.appendChild(f),f&&(f.innerHTML=selectDic.AD_SKIP+" 6 "+selectDic.AD_DIMENSSION),w.appendChild(h),h&&(h.innerHTML='<div id="'+d+'_adProgess" class="ad-play-progress" style="width: 0%;height:100%;background-color:#ffb100;"></div>')),L&&(L.className="ad_time_txt"),setTimeout((function(){L&&document.getElementById(r.id())&&(document.getElementById(r.id()).removeChild(L),L=null)}),1100),clearInterval(C),I=6,C=setInterval(function(){if(I-=1,f&&(f.innerHTML=selectDic.AD_SKIP+" "+I+" "+selectDic.AD_DIMENSSION),0==I)return clearInterval(C),f&&(f.innerHTML=selectDic.CLOSE_TEXT_LABEL,f.addEventListener("click",function(){Video.trackingDataPlayer(r.id(),"videoAdSkip",r.src(),"",((new Date).getTime()-r.rtv)/1e3),r.rtv=(new Date).getTime(),moadsShowing=!1,m.stop(),x=setTimeout(function(){try{this.moresumeMainContent(!0)}catch(e){console.log("cannot stop this ads!")}}.bind(this),1e3)}.bind(this),!1)),!1}.bind(this),1e3))}break;case google.ima.AdEvent.Type.COMPLETE:clearTimeout(x),Video.trackingDataPlayer(r.id(),"videoAdComplete",r.src(),"100%",((new Date).getTime()-r.rtv)/1e3),r.rtv=(new Date).getTime(),this.moresumeMainContent(!0);break;case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:clearTimeout(x),this.moresumeMainContent(!0);case google.ima.AdEvent.Type.LINEAR_CHANGED:}}.bind(this),G=function(e){if(s.offsetWidth<e.width||s.offsetHeight<e.height)return b.innerHTML="",b.style.display="none",A=!1,E=!1,!1;e.script=e.script.replace(/div-gpt-ad-overlay/gi,r.id().replace("media-video-","").replace("_html5_api","")+"-div-gpt-ad-overlay"),b.style.display="block",b.style.width=0!=e.width?e.width+"px":"480px",b.style.height=0!=e.height?e.height+"px":"70px",b.style.overflow="hidden",b.style.left=(b.parentNode.offsetWidth-(0!=e.width?e.width:480))/2+"px",b.style.top=b.parentNode.offsetHeight-(0!=e.height?e.height:70)-40+"px",b.innerHTML=decodeURIComponent(e.script);var t=document.createElement("div");t.className="fp-ad-close-button",b.appendChild(t),t&&t.addEventListener("click",(function(){clearTimeout(_),b.innerHTML="",b.style.display="none",b.style.height="1px",b.style.width="1px",A=!1,E=!1}),!1),_=setTimeout((function(){b.innerHTML="",b.style.display="none",A=!1,E=!1}),1e3*e.duration);for(var i=b.getElementsByTagName("script"),n=0;n<i.length;n++){var o=i[n],a=o.parentElement,d=document.createElement("script");""!=o.getAttribute("async")&&"true"!=o.getAttribute("async")||(d.async=!0),o.src&&(d.src=o.src),o.text&&(d.text=o.text),a.insertBefore(d,o),a.removeChild(o)}}.bind(this);this.moresumeMainContent=function(e){if(N)return!1;N=!0,clearTimeout(x),L&&document.getElementById(r.id())&&(document.getElementById(r.id()).removeChild(L),L=null),w&&(w.style.display="none",w.style.height="1px",w.style.width="1px",f&&w.contains(f)&&(w.removeChild(f),f=null),h&&w.contains(h)&&(w.removeChild(h),h=null)),A=!1,E=!1,clearInterval(C),""!=R&&r.poster(R),r.ended()?Video.showEndVideo(r.id().replace("media-video-","").replace("_html5_api","")):r.play(),void 0!==window.track&&window.track.length>0&&(window.track[0].mode="showing");try{r.player_.removeClass("vjs-controls-disabled"),r.player_.addClass("vjs-controls-enabled")}catch(e){}},this.screenChange=function(e){"none"!=w.style.display&&m&&(w.style.opacity=0,setTimeout((function(){m&&m.resize(e?16*e/9:s.offsetWidth,e||s.offsetHeight,r.isFullscreen()?google.ima.ViewMode.FULLSCREEN:google.ima.ViewMode.NORMAL),document.getElementById(d+"_fpAdClose")&&(document.getElementById(d+"_fpAdClose").style.fontSize=Math.round(4*(e||s.offsetHeight))/100+"px"),w.style.opacity=1}),1e3))},this.show=function(e){"none"!=w.style.display&&m&&(w.style.opacity=e)}}function parseAdsParameters(a){return!/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(a.replace(/"(\\.|[^"\\])*"/g,""))&&eval("("+a+")")}function convertTimeFormat(e){return 3600*e.substr(0,1)+60*e.substr(3,2)+1*e.substr(6,2)}function moAdSlot(e,t,i,n,o,a,r,d,s,l){this.name=e,this.type=t,this.tag=d,this.script=s,"number"==typeof i?this.time=i:"string"==typeof i&&i.indexOf("%")>=0?isNaN(l)?this.time=i:this.time=Math.floor(parseInt(i.substr(0,i.length-1))*l/100):this.time=convertTimeFormat(i),this.id=n,this.skip=parseInt(a)>0?parseInt(a):5,this.source="",this.duration=o,this.sourceType="",null!=r&&""!=r?(this.width=parseInt(r.substr(0,r.indexOf("x"))),this.height=parseInt(r.substr(r.indexOf("x")+1,r.length))):(this.width=0,this.height=0),this.seen=!1}function getCookie(e){for(var t=e+"=",i=document.cookie.split(";"),n=0;n<i.length;n++){for(var o=i[n];" "==o.charAt(0);)o=o.substring(1);if(0==o.indexOf(t))return o.substring(t.length,o.length)}return""}function setCookie(e,t,i){var n=new Date;n.setTime(n.getTime()+24*i*60*60*1e3);var o="expires="+n.toUTCString();document.cookie=e+"="+t+";"+o+";domain="+document.domain+";path=/"}function getStorage(e){var t;try{t=localStorage.getItem(e)}catch(e){t=-1}return t}function setStorage(e,t){var i;try{localStorage.setItem(e,t),i=1}catch(e){i=0}return i}function validateXML(e){if(window.ActiveXObject){var t=new ActiveXObject("Microsoft.XMLDOM");return t.async=!1,t.loadXML(e),0!=t.parseError.errorCode?0:1}if(document.implementation&&document.implementation.createDocument){new DOMParser;return e.getElementsByTagName("parsererror").length>0?0:1}return 0}