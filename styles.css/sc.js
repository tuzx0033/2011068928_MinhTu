var Journey = {
    eventsData: [],
    templatesData: [],
    segmentsData: [],
    events: [],
    eventsTrigger: {}
}; 

Journey.loadScript = (url, callback) => {
    var script = document.createElement("script");
    script.onload = () => {
        callback();
    };
    script.src = url;
    document.head.appendChild(script);
};

Journey.loadStyle = (url, callback) => {
    var link = document.createElement("link");
    link.href = url;
    link.type = "text/css";
    link.rel = "stylesheet";
    link.media = "screen,print";
    link.onload = () => {
        callback();
    };
    document.getElementsByTagName("head")[0].appendChild(link);
}

Journey.runEvent = (event, parentData) => {
    console.log("RUN: ", event);
    if (Journey.events[event.type]) {
        if (event.type == "flow-wait-by-duration" || event.type == "flow-wait-until-date") {
            Journey.triggerEvent(event, parentData);
        } else {
            Journey.events[event.type] (event, parentData);
        }
    } else {
        console.error("event " + event.type + " not exits")
    }
};

Journey.renderTemplate = (html, data) => {
    // profile
    const profileFields = ["address", "birthday", "email", "fullname", "phone"];
    profileFields.forEach((field) => {
        var re = new RegExp(`\{\{profile\.${field}\}\}`, "gm");
        if (re.test(html) && Journey.profile[field]) {
            html = html.replace(re, Journey.profile[field]);
        }
    });
    if (/\{\{profile\.gender\}\}/gm.test(html) && Journey.profile.gender) {
        html = html.replace(/\{\{profile\.gender\}\}/gm, (Journey.profile.gender == 1 ? "Nữ" : Journey.profile.gender == 2 ? "Nam" : "N/A"));
    }
    if (/\{\{profile\.last_active\}\}/gm.test(html) && Journey.profile.last_active) {
        html = html.replace(/\{\{profile\.last_active\}\}/gm, (new Date(Journey.profile.last_active * 1000)).toString());
    }

    if (/\{\{frequency\}\}/gm.test(html) && data.frequency) {
        html = html.replace(/\{\{frequency\}\}/gm, data.frequency);
    }
    
    return html;
};

Journey.triggerEvent = (event, parentData) => {
    if (Journey.events[event.type]) {
        if (event.type == "flow-wait-by-duration") {
            var ds = 0;
            if (event.properties.duration_type == "minutes") {
                ds = parseInt(event.properties.duration) * 60 * 1000;
            } else if (event.properties.duration_type == "hours") {
                ds = parseInt(event.properties.duration) * 60 * 60 * 1000;
            } else if (event.properties.duration_type == "days") {
                ds = parseInt(event.properties.duration) * 60 * 60 * 24 * 1000;
            }

            if (ds > 0) {
                var keyTriggerInterval = `${event.journey_id}.${event.type}.${event.id}.${parentData ? parentData.id : 'source'}`;
                Journey.eventsTrigger[keyTriggerInterval] = setInterval(function () {
                    clearInterval(Journey.eventsTrigger[keyTriggerInterval]);
                    Journey.events[event.type] (event, parentData);
                }, 60000);
            }
        } else if (event.type == "flow-wait-until-date") {
            // var date = new Date(event.end_date);
            // var now = new Date();
            // if (date.getFullYear() == now.getFullYear() && date.getMonth() == now.getMonth() && date.getDate() == now.getDate()) {
            //     Journey.events[event.type] (event, parentData);
            // }
        }
    } else {
        console.error("event " + event.type + " not exits")
    }
}

Journey.setData = (eventId, data, journeyId, type) => {
    if (Journey.profile && Journey.profile.fo_id) {
        let dataJson = (data != "") ? JSON.stringify(data).toString() : "";
        let dataTracking = {
            uid: Journey.profile.fo_id,
            journey_id: parseInt(journeyId),
            event_id: parseInt(eventId),
            data: dataJson,
            type: type ?? "all"
        };
        let jsonString = JSON.stringify(dataTracking);

        fetch("https://adp.vnecdn.net/jn/tk", {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: jsonString.toString()
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        
        fetch("https://lc.vnecdn.net/jn/cl/", {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: jsonString.toString()
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        if (!window.jn_dt) {
            window.jn_dt = {};
        }
        if (!window.jn_dt[journeyId]) {
            window.jn_dt[journeyId] = {};
        }
        window.jn_dt[journeyId][eventId] = data;

        sessionStorage.setItem(`jn_dt_${Journey.profile.fo_id}_${journeyId}_${eventId}`, dataJson);

        return true;
    }
    return false;
};

Journey.getData = (eventId, journeyId) => {
    let jnDataJson = sessionStorage.getItem(`jn_dt_${Journey.profile.fo_id}_${journeyId}_${eventId}`);
    if (jnDataJson) {
        window.jn_dt[journeyId][eventId] = JSON.parse(jnDataJson);
    }

    if (window.jn_dt && Journey.profile && Journey.profile.fo_id) {
        if (jn_dt[journeyId]) {
            if (jn_dt[journeyId][eventId]) {
                if (typeof jn_dt[journeyId][eventId] == "string") {
                    return JSON.parse(jn_dt[journeyId][eventId]);
                }
                return jn_dt[journeyId][eventId];
            }
        }
    }
    
    return null;
};

Journey.pushTrackingDetail = (eventId, data, journeyId, type, typeTracking) => {
    if (Journey.profile && Journey.profile.fo_id) {
        let dataTracking = [{
            uid: Journey.profile.fo_id,
            journey_id: parseInt(journeyId),
            event_id: parseInt(eventId),
            data: (data != "") ? JSON.stringify(data).toString() : "",
            type: type,
            type_tracking: typeTracking
        }];
        let jsonString = JSON.stringify(dataTracking);
        fetch("https://lc.vnecdn.net/jn/web/", {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: jsonString.toString()
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        return true;
    }
    return false;
};

Journey.getCookie = (name) => {
    var value = null;
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) value = c.substring(nameEQ.length, c.length);
    }
    return value;
};

Journey.getFOID = _ => {
    let id = +Journey.getCookie('myvne_user_id');
    if (id <= 0) {
        id = Journey.getCookie('fosp_aid');
        if (!id) {
            id = Journey.getCookie('fosp_uid');
        }
    }
    return id ? id : '';
}

Journey.checkUser = (segments) => {
    var key = "f_opt";
    key = "" + decodeURIComponent(window.localStorage.getItem(key));
    key = key.split(";ex=");
    var f_opt;
    if (2 == key.length && 0 < key[1]) {
        var b = new Date;
        b = b.valueOf();
        f_opt = b <= key[1] ? key[0] : "";
    } else {
        f_opt = key[0];
    }
    var data;
    try {
        for (var b = "", c = 0; c < f_opt.length; c++) 0 != c % 14 && (b += f_opt[c]);
        data = JSON.parse(decodeURIComponent(b));
    } catch (d) {}
    let ok = false;
    if (data && data.segment && data.segment.length > 0) {
        if (segments && segments.length > 0) {
            segments.forEach((s) => {
                if (data.segment.includes(s)) {
                    ok = true;
                    return;
                }
            });
        }
    }
    if (data && data.fo_id) {
        Journey.profile = data;
    } else {
        var userId = Journey.getCookie("fosp_uid");
        if (userId != "") {
            Journey.profile = {
                user_id: userId,
                fo_id: userId
            };
        }
    }

    if (typeof myvne_users != 'undefined' && typeof myvne_users.profile != 'undefined' && !Journey.isObjectEmpty(myvne_users.profile)) {
        Journey.profile.fullname = myvne_users.profile.user_fullname;
        Journey.profile.email = myvne_users.profile.user_email;
    }

    if (Journey.profile.fullname == null || Journey.profile.fullname == '') {
        if (Journey.profile.email != null && Journey.profile.email != '') {
            var arrEmail = Journey.profile.email.split("@");
            Journey.profile.fullname = arrEmail[0];
        } else {
            Journey.profile.fullname = 'bạn';
        }
    } else {
        Journey.profile.fullname = Journey.profile.fullname.replaceAll("+", " ");
    }

    return ok;
};

Journey.getGoalEvents = (startEvent) => {
    var journeyGoalEvents = [];
    if (startEvent.childs && startEvent.childs.length > 0) {
        startEvent.childs.forEach(function (eventChild) {
            var _journeyGoalEvents = Journey.getGoalEvents(eventChild);
            journeyGoalEvents = journeyGoalEvents.concat(_journeyGoalEvents);
        });
    } else {
        journeyGoalEvents.push(startEvent);
    }
    
    return journeyGoalEvents;
};

Journey.showPopup = (content, options) => {
    if (!document.querySelector("style[jn-popup-style]")) {
        let styles = `
        .jn-model-main {
            text-align: center;
            overflow: hidden;
            position: fixed;
            /* z-index: 1050; */
            -webkit-overflow-scrolling: touch;
            outline: 0;
            opacity: 0;
            -webkit-transition: opacity 0.15s linear, z-index 0.15;
            -o-transition: opacity 0.15s linear, z-index 0.15;
            transition: opacity 0.15s linear, z-index 0.15;
            z-index: -1;
            overflow-x: hidden;
            overflow-y: auto;
        }
        .jn-model-open {
            z-index: 99999;
            opacity: 1;
            overflow: hidden;
        }
        .jn-model-inner {
            -webkit-transform: translate(0, -25%);
            -ms-transform: translate(0, -25%);
            transform: translate(0, -25%);
            -webkit-transition: -webkit-transform 0.3s ease-out;
            -o-transition: -o-transform 0.3s ease-out;
            transition: -webkit-transform 0.3s ease-out;
            -o-transition: transform 0.3s ease-out;
            transition: transform 0.3s ease-out;
            transition: transform 0.3s ease-out, -webkit-transform 0.3s ease-out;
            display: inline-block;
            vertical-align: middle;
            width: 600px;
            margin: 30px auto;
            max-width: 97%;
        }
        .jn-model-wrap {  
            display: block;
            width: 100%;
            height: 100%;
            position: relative;
            background-color: #fff;
            border: 1px solid #999;
            border: 1px solid rgba(0, 0, 0, 0.2);
            border-radius: 6px;
            -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
            box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
            background-clip: padding-box;
            outline: 0; 
            text-align: left;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            max-height: calc(100vh - 70px);
            overflow-y: auto;
        }
        .jn-model-open .jn-model-inner {
            -webkit-transform: translate(0, 0);
            -ms-transform: translate(0, 0);
            transform: translate(0, 0);
            position: relative;
            z-index: 999;
        }
        .jn-model-open .jn-bg-overlay {
            background: rgba(0, 0, 0, 0.6);
            z-index: 99;
        }
        .jn-bg-overlay {
            background: rgba(0, 0, 0, 0);
            height: 100vh;
            width: 100%;
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 0;
            -webkit-transition: background 0.15s linear;
            -o-transition: background 0.15s linear;
            transition: background 0.15s linear;
        }
        .jn-close-btn {
            position: absolute;
            right: 0;
            top: -30px;
            cursor: pointer;
            z-index: 99;
            font-size: 30px;
            color: #fff;
        }
        .jn-model-content-wrap {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        @media screen and (min-width:800px){
            .jn-model-main:before {
                content: "";
                display: inline-block;
                height: auto;
                vertical-align: middle;
                margin-right: -0px;
                height: 100%;
            }
        }
        @media screen and (max-width:799px){
            .jn-model-inner{margin-top: 45px;}
        }`;
        var styleSheet = document.createElement("style")
        styleSheet.setAttribute("jn-popup-style", "true");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }
    
    const id = `jn-model-${options.id}`;
    if (document.querySelector(`#${id}`)) {
        document.querySelector(`#${id}`).classList.add("jn-model-open");
    } else {
        if (typeof options.overlay != "boolean") {
            options.overlay = true;
        }

        const modelMain = document.createElement("div");
        modelMain.classList.add("jn-model-main");
        modelMain.setAttribute("id", id);
        if (typeof options.position != "object" || (options.position.x == "center" && options.position.y == "center")) {
            modelMain.style.top = "0";
            modelMain.style.right = "0";
            modelMain.style.bottom = "0";
            modelMain.style.left = "0";
        } else {
            if (options.position.x == "left") {
                modelMain.style.left = "0";
            } else if (options.position.x == "right") {
                modelMain.style.right = "0";
            } else {
                modelMain.style.left = "0";
                modelMain.style.right = "0";
            }

            if (options.position.y == "top") {
                modelMain.style.top = "0";
            } else if (options.position.y == "bottom") {
                modelMain.style.bottom = "0";
            } else {
                modelMain.style.top = "0";
                modelMain.style.bottom = "0";
            }
        }

        const modelInner = document.createElement("div");
        modelInner.classList.add("jn-model-inner");
        if (options.width) {
            modelInner.style.width = options.width;
        }
        if (options.height) {
            modelInner.style.height = options.height;
        }
        modelMain.insertAdjacentElement("beforeend", modelInner);

        const closeBtn = document.createElement("div");
        closeBtn.classList.add("jn-close-btn");
        closeBtn.innerHTML = "×";
        if (!options.overlay) {
            closeBtn.style.color = "black";
        }
        closeBtn.addEventListener("click", () => {
            modelMain.classList.remove("jn-model-open");
            if (typeof options.onClose == "function") {
                options.onClose();
            }
        });
        modelInner.insertAdjacentElement("beforeend", closeBtn);

        const modelWrap = document.createElement("div");
        modelWrap.classList.add("jn-model-wrap");
        modelInner.insertAdjacentElement("beforeend", modelWrap);

        const contentWrap = document.createElement("div");
        contentWrap.classList.add("jn-model-content-wrap");
        contentWrap.innerHTML = content;
        modelWrap.insertAdjacentElement("beforeend", contentWrap);

        if (options.overlay) {
            const modelOverlay = document.createElement("div");
            modelOverlay.classList.add("jn-bg-overlay");
            modelOverlay.addEventListener("click", () => {
                modelMain.classList.remove("jn-model-open");
                if (typeof options.onClose == "function") {
                    options.onClose();
                }
            });
            modelMain.insertAdjacentElement("beforeend", modelOverlay);
        }
        
        document.body.insertAdjacentElement("beforeend", modelMain);
        modelMain.classList.add("jn-model-open");

        // on click button
        const links = modelMain.querySelectorAll("a");
        links.forEach((el) => {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                let link = el.getAttribute("href");
                if (link != "") {
                    let target = el.getAttribute("target");
                    if (typeof options.onClick == "function") {
                        options.onClick(link, target);
                    }
                }
            });
        });
    }
};

Journey.isObjectEmpty = (objectName) => {
    return Object.keys(objectName).length === 0
};

Journey.showBoxArticles = (event, currentData) => {
    var jnMynews = document.getElementById('jn-mynews');
    if (jnMynews) {
        const iCheck = setInterval(() => {
            if (typeof myvne_users != 'undefined') {
                clearInterval(iCheck);
                myvne_users.getProfileData(function(p){
                    if (Object.keys(p).length > 0) {
                        let localSettings = localStorage.getItem('myvne_settings');
                        if (localSettings == null) {
                            return;
                        }
                        if (typeof localSettings == 'string') {
                            localSettings = JSON.parse(localSettings);
                        }
                        const { my_news } = localSettings;
                        if (typeof my_news == 'undefined' || (my_news && my_news.length == 0)) {
                            return;
                        }
                        const runScript = (keyPS) => {
                            const fospAID = Journey.getFOID();
                            fetch(`https://ps.vnexpress.net/mynews/bt?limit=5&fosp_aid=${fospAID}&setting=${keyPS}`)
                            .then((response) => response.json())
                            .then((result) => {
                                const { data, error } = result;
                                
                                if (typeof window.count_refresh_key == 'undefined') {
                                    window.count_refresh_key = 1;
                                }

                                if (error == 1 && window.count_refresh_key <= 5) {
                                    window.count_refresh_key++;
                                    myvne_users.get_key_my_news({my_news:my_news},function(key){
                                        runScript(key);
                                    });
                                }
                                if (data && data.length > 0) {
                                    let aIds = [];
                                    for (const item of data) {
                                        aIds.push(Object.keys(item)[0]);
                                    }
                                    fetch(`https://gw.vnexpress.net/ar/get_basic?article_id=${aIds.join(',')}&limit=${aIds.length}&data_select=article_id,title,share_url,publish_time,lead,thumbnail_url&thumb_size=380x228,120x72&thumb_quality=100&thumb_dpr=1,2&thumb_fit=crop`)
                                    .then((response) => response.json())
                                    .then((result) => {
                                        const { data } = result;
                                        if (data.length > 0) {
                                            var itemsHtml = [];
                                            var thumb = '';
                                            for (i in data) {
                                                if (i == 2) {
                                                    break
                                                }
                                                if (i == 0 && data[i].thumb_list != null) {
                                                    thumb = `
                                                    <div class="thumb-art" style="width: 100px; float: right; margin-left: 10px; flex-shrink: 0;">
                                                        <div class="thumb thumb-5x3" style="aspect-ratio: 5 / 3; border-radius: 4px; position: relative;">
                                                            <img src="${data[i].thumb_list.thumb_380_228_100_1_crop}" alt="" style="object-fit: cover;
                                                            position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 100%; border-radius: 4px;">
                                                        </div>
                                                    </div>`;
                                                }
                        
                                                itemsHtml.push(`♦ ${data[i].title}`);
                                            }
                                            jnMynews.parentNode.innerHTML = `
                                            <p style="font-family: Arial; font-size: 16px; color: #222; line-height: 1.4;display: inline-block; margin: 0;">
                                                ${itemsHtml.join("<br>")}
                                            </p>
                                            ${thumb}`;
                                        }
                                    });
                                }
                            });
                        }
                        let keyPS = localStorage.getItem('my_news_generate_key');
                        if (keyPS == null) {
                            myvne_users.get_key_my_news({my_news:my_news},function(key){
                                runScript(key);
                            });
                        }else{
                            runScript(keyPS);
                        }
                    }
                });
            }
        }, 50);

        jnMynews.parentNode.style.cursor = "pointer";
        jnMynews.parentNode.addEventListener("click", (e) => {
            e.preventDefault();
            let dataTracking = {
                url: event.properties.confirm_link
            };
            Journey.pushTrackingDetail(event.id, dataTracking, event.journey_id, event.type, "click");
            Journey.setData(event.id, currentData, event.journey_id);
            if (event.properties.confirm_link_target == "new") {
                window.open(event.properties.confirm_link, "_blank");
            } else {
                window.location.href = event.properties.confirm_link;
            }
        });
        
        setTimeout(() => {
            clearInterval(iCheck);
        }, 10000);
    }
};

Journey.events["trigger-segments"] = (event, parentData) => {
    if (event.childs && event.childs.length > 0) {
        event.childs.forEach(function (eventChild) {
            Journey.runEvent(eventChild, parentData);
        });
    }
};

Journey.events["trigger-activity"] = (event, parentData) => {
    if (event.childs && event.childs.length > 0) {
        event.childs.forEach(function (eventChild) {
            Journey.runEvent(eventChild, parentData);
        });
    }
};

Journey.events["condition-visit-page"] = (event, parentData) => {
    var check = "not-ok";
    if (event.properties.url != null) {
        if (event.properties.url == location.pathname) {
            check = "ok";
        } else {
            var arrUrl = event.properties.url.split(",");
            for (var i in arrUrl) {
                var reStr = arrUrl[i].replaceAll("*", ".*").replaceAll("/", "\/").replaceAll(".", "\.");
                var re = new RegExp(`/${reStr}/`);
                if (re.test(location.href)) {
                    check = "ok";
                    break;
                }
            }
        }
        
        if (check == "ok") {
            var currentData = Journey.getData(event.id, event.journey_id);
            if (!currentData) {
                currentData = {
                    frequency: 0,
                }
            }
            
            currentData.frequency ++;
            Journey.setData(event.id, currentData, event.journey_id);
            parentData = currentData;
        }
    }
    
    if (check == "ok" && event.childs && event.childs.length > 0) {
        event.childs.forEach((eventChild) => {
            Journey.runEvent(eventChild, parentData);
        });
    }
};

Journey.events["condition-exit-intent"] = (event, parentData) => {
    if (event.childs && event.childs.length > 0) {
        function mo(e) {
            if (!e.toElement && !e.relatedTarget) {
                event.childs.forEach((eventChild) => {
                    Journey.runEvent(eventChild, parentData);
                });
                document.removeEventListener("mouseout", mo);
            }
        }
        document.addEventListener("mouseout", mo);
    }
};

Journey.events["condition-property"] = (event, parentData) => {
    if (event.properties.name != null && event.properties.condition != null) {
        var iCheck = setInterval(() => {
            if (typeof myvne_users != 'undefined' && typeof myvne_users.profile != 'undefined' && !Journey.isObjectEmpty(myvne_users.profile)) {
                clearInterval(iCheck);
                var propertyPath = event.properties.name.split('.');
                var value;
                for (i in propertyPath) {
                    if (value == null) {
                        value = myvne_users.profile[propertyPath[i]];
                    } else {
                        value = value[propertyPath[i]];
                    }
                }
                
                var check = "not-ok";
                if (event.properties.condition == 'not-empty') {
                    if (typeof value == 'object' && !Journey.isObjectEmpty(value)) {
                        check = "ok";
                    } else if (value != 'undefined' && value != null && value != '') {
                        check = "ok";
                    }
                } else if (event.properties.value != null) {
                    if (event.properties.condition == 'eq') {
                        if (value == event.properties.value) {
                            check = "ok";
                        }
                    } else if (event.properties.condition == 'gte') {
                        if (value >= event.properties.value) {
                            check = "ok";
                        }
                    } else if (event.properties.condition == 'lte') {
                        if (value <= event.properties.value) {
                            check = "ok";
                        }
                    }
                }

                // tracking
                var trackingType = "no";
                if (check == "ok") {
                    trackingType = "yes";
                }
                Journey.setData(event.id, "", event.journey_id, trackingType);

                if (event.childs && event.childs.length > 0) {
                    event.childs.forEach((eventChild) => {
                        if (check == "ok" && eventChild.from_pid == 'pp-o-1') {
                            Journey.runEvent(eventChild, parentData);
                        }
                        if (check == "not-ok" && eventChild.from_pid == 'pp-o-2') {
                            Journey.runEvent(eventChild, parentData);
                        }
                    });
                }
            }
        }, 300);

        setTimeout(() => {
            clearInterval(iCheck);
        }, 10000);
    }
};

Journey.events["condition-user-active"] = (event, parentData) => {
    var currentData = Journey.getData(event.id, event.journey_id);
    if (!currentData) {
        currentData = {
            last_active: 0,
        }
    }

    if (event.properties.url != null) {
        var hasActive = false;
        if (event.properties.url == location.pathname) {
            hasActive = true;
        } else {
            var arrUrl = event.properties.url.split(",");
            for (var i in arrUrl) {
                var reStr = arrUrl[i].replaceAll("*", ".*").replaceAll("/", "\/").replaceAll(".", "\.");
                var re = new RegExp(`/${reStr}/`);
                if (re.test(location.href)) {
                    hasActive = true;
                    break;
                }
            }
        }
        
        if (hasActive || currentData.last_active == 0) {
            currentData.last_active = Math.floor((new Date(new Date().setHours(0, 0, 0, 0))).getTime()/1000);
            // currentData.last_active = Math.floor(new Date().getTime()/1000);
        }
    }

    if (event.properties.day != null && currentData != null && currentData.last_active != null && currentData.last_active != 0) {
        var check = "not-ok";
        var now = Math.floor((new Date(new Date().setHours(0, 0, 0, 0))).getTime()/1000);
        // var now = Math.floor(new Date().getTime()/1000);
        var from = now - event.properties.day * 86400;
        // var from = now - event.properties.day * 60;
        if (from <= currentData.last_active && currentData.last_active <= now) {
            check = "ok";
        }

        // tracking
        var trackingType = "no";
        if (check == "ok") {
            trackingType = "yes";
        }
        Journey.setData(event.id, currentData, event.journey_id, trackingType);
        
        if (event.childs && event.childs.length > 0) {
            event.childs.forEach((eventChild) => {
                if (check == "ok" && eventChild.from_pid == 'ua-o-1') {
                    Journey.runEvent(eventChild, currentData);
                }
                if (check == "not-ok" && eventChild.from_pid == 'ua-o-2') {
                    Journey.runEvent(eventChild, currentData);
                }
            });
        }
    }
};

Journey.events["condition-has-done-event"] = (event, parentData) => {
    var check = "not-ok";
    if (event.properties.event_type == "message") {
        if (event.properties.event == "show" && parentData.show) {
            check = "ok";
        } else if (event.properties.event == "click" && parentData.click) {
            check = "ok";
        } else if (event.properties.event == "close" && parentData.close) {
            check = "ok";
        }
    }

    if (event.childs && event.childs.length > 0) {
        event.childs.forEach((eventChild) => {
            if (check == "ok" && eventChild.from_pid == 'hde-o-1') {
                Journey.runEvent(eventChild, parentData);
            }
            if (check == "not-ok" && eventChild.from_pid == 'hde-o-2') {
                Journey.runEvent(eventChild, parentData);
            }
        });
    }
};

Journey.events["condition-frequency"] = (event, parentData) => {
    var currentData = Journey.getData(event.id, event.journey_id);
    if (!currentData) {
        currentData = {
            frequency: 0,
        }
    }
    currentData.frequency ++;
    
    if (event.properties.condition != null && event.properties.frequency != null) {
        var check = "not-ok";
        if (event.properties.condition == 'eq') {
            if (currentData.frequency == event.properties.frequency) {
                check = "ok";
            }
        } else if (event.properties.condition == 'gte') {
            if (currentData.frequency >= event.properties.frequency) {
                check = "ok";
            }
        } else if (event.properties.condition == 'lte') {
            if (currentData.frequency <= event.properties.frequency) {
                check = "ok";
            }
        } else if (event.properties.condition == 'gt') {
            if (currentData.frequency > event.properties.frequency) {
                check = "ok";
            }
        } else if (event.properties.condition == 'lt') {
            if (currentData.frequency < event.properties.frequency) {
                check = "ok";
            }
        }

        // tracking
        var trackingType = "no";
        if (check == "ok") {
            trackingType = "yes";
        }
        Journey.setData(event.id, currentData, event.journey_id, trackingType);

        if (event.childs && event.childs.length > 0) {
            event.childs.forEach((eventChild) => {
                if (check == "ok" && eventChild.from_pid == 'fr-o-1') {
                    Journey.runEvent(eventChild, parentData);
                }
                if (check == "not-ok" && eventChild.from_pid == 'fr-o-2') {
                    Journey.runEvent(eventChild, parentData);
                }
            });
        }
    }
};

Journey.events["flow-wait-by-duration"] = (event, parentData) => {
    if (event.childs && event.childs.length > 0) {
        event.childs.forEach((eventChild) => {
            Journey.runEvent(eventChild, parentData);
        });
    }
    Journey.setData(event.id, "", event.journey_id);
};

Journey.events["action-template"] = (event, parentData) => {
    var currentData = Journey.getData(event.id, event.journey_id);
    var executed = currentData != null && currentData.executed == true;
    if (!currentData) {
        currentData = {
            executed: true,
        }
    }

    if (!executed) {
        if (event.properties.template != null) {
            (async function () {
                var div = document.createElement("div");
                div.innerHTML = Journey.templatesData[event.properties.template].html;
                
                var components = Journey.templatesData[event.properties.template].components;
                if (components && components.length > 0) {
                    for (var i in components) {
                        var component = components[i];

                        // articles
                        if (component.type == 'articles') {
                            if (!component.size) continue;

                            const data = await fetch(`https://gw.vnexpress.net/ar/get_rule_2?category_id=1002691&limit=${component.size}&page=1&data_select=title,lead,privacy,thumbnail_url,share_url,article_type,article_category,publish_time&thumb_size=120x72&thumb_quality=100&thumb_dpr=1,2&thumb_fit=crop`).then(
                                async (result) => {
                                    const {
                                        data
                                    } = await result.json();
                                    
                                    return data;
                                }
                            ).catch(() => {
                                console.log("get articles error");
                            });
                            
                            let htmlThumb = "", htmlTitle = "";
                            data[1002691].data.forEach((row) => {
                                htmlThumb += `<td><image src="${row.thumb_list.thumb_120_72_100_1_crop}"></td>`;
                                htmlTitle += `<td><h3>${row.title}</h3></td>`;
                            });
                            div.querySelector("#articles table").innerHTML = `<tr>${htmlThumb}</tr><tr>${htmlTitle}</tr>`;
                        }
                    }
                }

                let dataRender = {};
                if (parentData && parentData.frequency) {
                    dataRender.frequency = parentData.frequency;
                }
                let html = Journey.renderTemplate(div.innerHTML, dataRender);
                if (event.properties.show_type == "modal") {
                    let popupOptions = {
                        onClose: () => {
                            Journey.pushTrackingDetail(event.id, "", event.journey_id, event.type, "close");
                        },
                        onClick: (link, target) => {
                            let dataTracking = {
                                url: link
                            };
                            Journey.pushTrackingDetail(event.id, dataTracking, event.journey_id, event.type, "click");
                            if (target && target == "_blank") {
                                window.open(link, "_blank");
                            } else {
                                window.location.href = link;
                            }
                        },
                        width: "500px",
                        height: "300px"
                    };
                    if (event.properties.overlay && event.properties.overlay == "0") {
                        popupOptions.overlay = false;
                    }
                    if (event.properties.position) {
                        popupOptions.position = event.properties.position;
                    }
                    if (event.properties.width) {
                        popupOptions.width = event.properties.width;
                    }
                    if (event.properties.height) {
                        popupOptions.height = event.properties.height;
                    }

                    Journey.showPopup(html, popupOptions);
                    Journey.pushTrackingDetail(event.id, "", event.journey_id, event.type, "show");

                } else if (event.properties.show_type == "embed") {
                    if (event.properties.target != null && event.properties.target.position != null && event.properties.target.selector != null) {
                        if (!document.querySelector(`#${component.type}`)) {
                            const selector = document.querySelector(event.properties.target.selector);
                            if (selector) {
                                switch (event.properties.target.position) {
                                    case "inside":
                                        selector.insertAdjacentHTML("beforeend", html);
                                        Journey.pushTrackingDetail(event.id, "", event.journey_id, event.type, "show");
                                        break;
                                    case "before":
                                        selector.insertAdjacentHTML("beforebegin", html);
                                        Journey.pushTrackingDetail(event.id, "", event.journey_id, event.type, "show");
                                        break;
                                    case "after":
                                        selector.insertAdjacentHTML("afterend", html);
                                        Journey.pushTrackingDetail(event.id, "", event.journey_id, event.type, "show");
                                        break;
                                    case "replace":
                                        selector.parentNode().replaceChild(div, selector);
                                        Journey.pushTrackingDetail(event.id, "", event.journey_id, event.type, "show");
                                        break;
                                    default:
                                }
                            }
                        }
                    }
                }
            })();
        }

        if (event.childs && event.childs.length > 0) {
            event.childs.forEach((eventChild) => {
                Journey.runEvent(eventChild, parentData);
            });
        }
    }

    Journey.setData(event.id, currentData, event.journey_id);
};

Journey.events["action-email"] = (event, parentData) => {
    Journey.setData(event.id, "", event.journey_id, "x");
};

Journey.events["action-message"] = (event, parentData) => {
    if (event.properties.show_mode != null && event.properties.show_mode != "any_page" && event.properties.show_mode_url != null && event.properties.show_mode_url != "") {
        var arrUrl = event.properties.show_mode_url.split(",");
        var checkUrl = "not-match";
        for (var i in arrUrl) {
            var reStr = arrUrl[i].replaceAll("*", ".*").replaceAll("/", "\/").replaceAll(".", "\.");
            var re = new RegExp(`/${reStr}/`);
            if (re.test(location.href)) {
                checkUrl = "match";
                break;
            }
        }
        if (checkUrl == "match") {
            if (event.properties.show_mode == "exclude_page") {
                return;
            }
        } else {
            if (event.properties.show_mode == "page") {
                return;
            }
        }
    }

    var currentData = Journey.getData(event.id, event.journey_id);
    if (!currentData) {
        currentData = {
            last_show: 0,
        }
    }
    
    var showMessage = false;
    if (event.properties.repeat == '1' && event.properties.duration != null && event.properties.duration_type != null) {
        if (currentData.last_show == 0) {
            showMessage = true;
        } else {
            var durationInSecond = 0;
            if (event.properties.duration_type == "minutes") {
                durationInSecond = parseInt(event.properties.duration) * 60;
            } else if (event.properties.duration_type == "hours") {
                durationInSecond = parseInt(event.properties.duration) * 60 * 60;
            } else if (event.properties.duration_type == "days") {
                durationInSecond = parseInt(event.properties.duration) * 60 * 60 * 24;
            }
            
            var now = Math.floor((new Date()).getTime()/1000);
            if (now - currentData.last_show >= durationInSecond) {
                showMessage = true;
            }
        }
    } else if (currentData.last_show == 0) {
        showMessage = true;
    }

    if (showMessage) {
        if (event.properties.duration_type != null && event.properties.duration_type == "days") {
            currentData.last_show = Math.floor((new Date(new Date().setHours(0, 0, 0, 0))).getTime()/1000);
        } else {
            currentData.last_show = Math.floor((new Date()).getTime()/1000);
        }
        currentData.show = true;
        
        const boxId = `jn-msg-${event.id}`;
        const box = document.createElement("div");
        box.setAttribute("id", boxId);
        box.classList.add("box-notify");
        box.style.borderRadius = "8px";
        box.style.backgroundColor = "#fff";
        box.style.boxShadow = "0px 6px 24px 0px rgba(0, 0, 0, 0.20)";
        box.style.borderLeft = "2px solid #C92A57";
        box.style.padding = "16px";
        box.style.width = "370px";
        box.style.position = "fixed";
        box.style.zIndex = "999";
        if (event.properties.position.x == "right") {
            box.style.right = "10px";
        } else {
            box.style.left = "10px";
        }
        if (event.properties.position.y == "top") {
            box.style.top = "10px";
        } else {
            box.style.bottom = "10px";
        }
        box.style.boxSizing = "border-box";

        const close = document.createElement("a");
        close.style.position = "absolute";
        close.style.top = "10px";
        close.style.right = "10px";
        close.setAttribute("href", "javascript:void(0);");
        close.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4.2097 4.3871L4.29289 4.29289C4.65338 3.93241 5.22061 3.90468 5.6129 4.2097L5.70711 4.29289L12 10.585L18.2929 4.29289C18.6834 3.90237 19.3166 3.90237 19.7071 4.29289C20.0976 4.68342 20.0976 5.31658 19.7071 5.70711L13.415 12L19.7071 18.2929C20.0676 18.6534 20.0953 19.2206 19.7903 19.6129L19.7071 19.7071C19.3466 20.0676 18.7794 20.0953 18.3871 19.7903L18.2929 19.7071L12 13.415L5.70711 19.7071C5.31658 20.0976 4.68342 20.0976 4.29289 19.7071C3.90237 19.3166 3.90237 18.6834 4.29289 18.2929L10.585 12L4.29289 5.70711C3.93241 5.34662 3.90468 4.77939 4.2097 4.3871L4.29289 4.29289L4.2097 4.3871Z" fill="#BDBDBD"></path></svg>`;
        box.insertAdjacentElement("beforeend", close);
        close.addEventListener("click", () => {
            box.remove();
            Journey.pushTrackingDetail(event.id, "", event.journey_id, event.type, "close");

            if (event.properties.required_action == '1') {
                Journey.setData(event.id, currentData, event.journey_id);
            }
        });

        if (event.properties.title != "") {
            const title = document.createElement("h4");
            title.style.marginTop = "0";
            title.style.marginBottom = "4px";
            title.style.paddingRight = "28px";
            title.innerHTML = `<p style="color: #626262; font-size: 14px;font-family: Arial;line-height: 1.4; text-decoration: none; font-weight: 400;">${Journey.renderTemplate(event.properties.title, {})}</p>`;
            box.insertAdjacentElement("beforeend", title);
        }

        const message = document.createElement("div");
        message.style.display = "flex";
        message.innerHTML = `<p class="description" style="font-family: Arial; font-size: 16px; color: #222; line-height: 1.4;display: inline-block; margin: 0;">${Journey.renderTemplate(event.properties.message, {})}</p>`;
        box.insertAdjacentElement("beforeend", message);

        const option = document.createElement("div");
        option.style.display = "flex";
        option.style.justifyContent = "end";
        option.style.alignItems = "center";
        option.style.width = "100%";
        option.style.marginTop = "12px";
        const cancel = document.createElement("a");
        cancel.style.color = "#9F9F9F";
        cancel.style.fontFamily = "Arial";
        cancel.style.fontSize = "14px";
        cancel.style.fontWeight = "400";
        cancel.style.lineHeight = "1.4";
        cancel.style.marginRight = "8px";
        cancel.style.padding = "8px";
        cancel.setAttribute("href", "javascript:void(0);");
        cancel.innerHTML = event.properties.cancel_text;
        option.insertAdjacentElement("beforeend", cancel);
        cancel.addEventListener("click", () => {
            box.remove();
            Journey.pushTrackingDetail(event.id, "", event.journey_id, event.type, "close");

            if (event.properties.required_action == '1') {
                Journey.setData(event.id, currentData, event.journey_id);
            }
        });
        const confirm = document.createElement("a");
        confirm.style.borderRadius = "4px";
        confirm.style.background = "#C92A57";
        confirm.style.padding = "6px 8px 6px 6px";
        confirm.style.color = "#fff";
        confirm.style.fontFamily = "Arial";
        confirm.style.fontSize = "14px";
        confirm.style.fontWeight = "700";
        confirm.style.lineHeight = "1";
        confirm.style.border = "0";
        confirm.style.display = "flex";
        confirm.style.alignItems = "center";
        confirm.setAttribute("href", event.properties.confirm_link);
        if (event.properties.confirm_link_target == "new") {
            confirm.setAttribute("target", "_blank");
        }
        confirm.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8.59266 6.83347H18.82V4.16681H5.18356V19.8335H18.82V17.1668H8.59266V13.5001H13.3654V10.5001H8.59266V6.83347Z" fill="white" fill-opacity="0.87"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M20.5245 22.5C21.0894 22.5 21.5473 22.0523 21.5473 21.5V2.5C21.5473 1.94767 21.0894 1.5 20.5245 1.5H3.47903C2.91414 1.5 2.4563 1.94767 2.4563 2.5V21.5C2.4563 22.0523 2.91414 22.5 3.47903 22.5H20.5245ZM18.9188 7.83347H9.61539V9.50014H13.4643C14.0288 9.50014 14.3881 9.98314 14.3881 10.5351V13.5351C14.3881 14.0871 14.0288 14.5001 13.4643 14.5001H9.61539V16.1668H18.9188C19.4834 16.1668 19.8427 16.6498 19.8427 17.2018V19.8685C19.8427 20.4205 19.4834 20.8335 18.9188 20.8335H5.28242C4.71753 20.8335 4.16083 20.4205 4.16083 19.8685V4.20181C4.16083 3.64981 4.71753 3.16681 5.28242 3.16681H18.9188C19.4834 3.16681 19.8427 3.64981 19.8427 4.20181V6.86847C19.8427 7.42048 19.4834 7.83347 18.9188 7.83347Z" fill="white" fill-opacity="0.87"></path></svg><span style="margin-left: 6px;">${event.properties.confirm_text}</span>`;
        option.insertAdjacentElement("beforeend", confirm);
        box.insertAdjacentElement("beforeend", option);
        confirm.addEventListener("click", (e) => {
            e.preventDefault();

            if (event.properties.required_action == '1') {
                Journey.setData(event.id, currentData, event.journey_id);
            }

            let link = confirm.getAttribute("href");
            if (link != "") {
                let dataTracking = {
                    url: link
                };
                Journey.pushTrackingDetail(event.id, dataTracking, event.journey_id, event.type, "click");
                if (event.properties.confirm_link_target == "new") {
                    window.open(link, "_blank");
                } else {
                    window.location.href = link;
                }
            }
        });

        document.body.insertAdjacentElement("beforeend", box);
        Journey.pushTrackingDetail(event.id, "", event.journey_id, event.type, "show");

        if (event.properties.required_action == null || event.properties.required_action == '0') {
            Journey.setData(event.id, currentData, event.journey_id);
        }

        Journey.showBoxArticles(event, currentData);
    } else {
        if (event.childs && event.childs.length > 0) {
            event.childs.forEach((eventChild) => {
                Journey.runEvent(eventChild, currentData);
            });
        }
    }
};

Journey.events["action-update-property"] = (event, parentData) => {
    if (event.properties.name != null && event.properties.value != null) {
        var iCheck = setInterval(() => {
            if (typeof myvne_users != 'undefined' && typeof myvne_users.profile != 'undefined' && !Journey.isObjectEmpty(myvne_users.profile)) {
                clearInterval(iCheck);

                var data = {};
                data[event.properties.name] = event.properties.value;
                myvne_users.updateSettings_v2(data, false, function(){});

                Journey.setData(event.id, "", event.journey_id);
            }
        }, 300);

        setTimeout(() => {
            clearInterval(iCheck);
        }, 10000);
    }
};

Journey.events["action-exit"] = (event, parentData) => {
    var currentData = {
        exit_at: Math.floor((new Date()).getTime()/1000),
    };
    Journey.setData(event.id, currentData, event.journey_id);
};

Journey.events["action-return"] = (event, parentData) => {
    if (Journey.profile && Journey.profile.fo_id) {
        let dataTracking = {
            uid: Journey.profile.fo_id,
            journey_id: parseInt(event.journey_id)
        };
        let jsonString = JSON.stringify(dataTracking);

        fetch("https://adp.vnecdn.net/jn/rt", {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: jsonString.toString()
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        var prefix = `jn_dt_${Journey.profile.fo_id}_${event.journey_id}_`;
        var arr = [];
        for (var i = 0; i < sessionStorage.length; i++){
            if (sessionStorage.key(i).substring(0, prefix.length) == prefix) {
                arr.push(sessionStorage.key(i));
            }
        }
        for (var i = 0; i < arr.length; i++) {
            sessionStorage.removeItem(arr[i]);
        }
    }
};

Journey.readyToRun = () => {
    var isReady = false;
    if (Journey.eventsData.length > 0) {
        Journey.eventsData.forEach((event) => {
            if (Journey.checkUser(Journey.segmentsData[event.journey_id])) {
                isReady = true;
                return;
            }
        });
    }
    return isReady;
};

Journey.init = () => {
    if (Journey.eventsData.length > 0) {
        Journey.eventsData.forEach((event) => {
            var goalEvents = Journey.getGoalEvents(event);
            if (goalEvents.length > 0) {
                var isFinished = false;

                var userGoalEventsId = [];
                if (window.jn_dt && jn_dt[event.journey_id]) {
                    userGoalEventsId = Object.keys(jn_dt[event.journey_id]);
                }
                
                if (userGoalEventsId.length > 0) {
                    goalEvents.forEach((goalEvent) => {
                        if (userGoalEventsId.includes(goalEvent.id) && goalEvent.type == "action-exit") {
                            isFinished = true;
                            return;
                        }
                    });
                }

                if (!isFinished) {
                    if (event.type == "trigger-segments") {
                        if (Journey.checkUser(Journey.segmentsData[event.journey_id])) {
                            Journey.runEvent(event);
                        }
                    } else if (event.type == "trigger-activity") {
                        Journey.checkUser(Journey.segmentsData[event.journey_id]);
                        Journey.runEvent(event);
                    }
                }
            }
        });
    }
};