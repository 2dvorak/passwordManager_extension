function isPasswordTypeInput(targetDoc) {
    var inputs = targetDoc.getElementsByTagName('input');
    var passInput;
    for(var i = 0; i < inputs.length; i++) {
        // found input type 'password'
        if(inputs[i].type.toLowerCase() == "password") {
            return true;
        }
    }
    // no input has type 'password'
    // maybe using iframe?
    // or no login form at all?
    if(typeof passInput == "undefined") {
        //iframe
        var iframes = targetDoc.getElementsByTagName('iframe');
        for(var j = 0; j < iframes.length; j++) {
            // not returning undefined means it found a input with type 'password'
            if(getPasswordTypeInput(iframes[j].contentDocument)) {
                // immediately returns
                return true;
            }
        }
        // no iframe?
        // other cases to be handled..
    }
    return false;
}

function getPasswordTypeInput(targetDoc) {
    var inputs = targetDoc.getElementsByTagName('input');
    var passInput;
    for(var i = 0; i < inputs.length; i++) {
        // found input type 'password'
        if(inputs[i].type.toLowerCase() == "password") {
            passInput = inputs[i];
            //break
            return passInput;
        }
    }
    // no input has type 'password'
    // maybe using iframe?
    // or no login form at all?
    if(typeof passInput == "undefined") {
    
        //iframe
        var iframes = targetDoc.getElementsByTagName('iframe');
        for(var j = 0; j < iframes.length; j++) {
            var returnInput = getPasswordTypeInput(iframes[j].contentDocument);
            // not returning undefined means it found a input with type 'password'
            if(typeof returnInput == "object") {
                // immediately returns
                return returnInput;
            }
        }
        
        // no iframe?
        // other cases to be handled..
    }
    return passInput;
}

//deprecated, use getPasswordTypeInput then get value of it
function getPasswordTypeInputValue (targetDoc) {
    var inputs = targetDoc.getElementsByTagName('input');
    var pass;
    for(var i = 0; i < inputs.length; i++) {
        if(inputs[i].type.toLowerCase() == "password") {
            pass = inputs[i].value;
            break;
        }
    }
    // no input has type 'password'
    // maybe using iframe?
    // or no login form at all
    if(typeof pass == "undefined") {
        var iframes = targetDoc.getElementsByTagName('iframe');
        for(var j = 0; j < iframes.length; j++) {
            var returnPass = getPasswordTypeInputValue(iframes[j].contentDocument);
            if(typeof returnPass == "string") {
                return returnPass;
            }
        }
    }
    return pass;
}

// get password input then change its value
function setPasswordTypeInputValue(newInputValue) {
    var passInput = getPasswordTypeInput(document);
    var passInputOld = passInput.value;
    //alert("old pw : " + passInput.value + "\nnew pw : " + newInputValue);
    if(typeof passInput == "undefined") {
        return false;
    }
    // most cases
    else if(typeof passInput == "object") {
        passInput.value = newInputValue;
        return true;
    }
    // is there any other possible cases..??
}

// find form of password input
function findFormOfPasswordInput(passInput) {
    var parent = passInput.parentNode;
    while(parent.tagName.toLowerCase() != "form") {
        parent = parent.parentNode;
    }
    return parent;
}

// not working, wrong recursion
// deprecated
// find submit button(login button) for password input
function findSubmitButton(passInput) {
    var form = findFormOfPasswordInput(passInput);
    var loginButton;
    for(i =0; i< form.childNodes.length; i++) {
        if(typeof form.childNodes[i] == "object") {
            if(form.childNodes[i].nodeName.toLowerCase() == "input" || form.childNodes[i].nodeName.toLowerCase() == "button") {
                if(form.childNodes[i].type.toLowerCase() == "password") {
                    loginButton = form.childNodes[i];
                    return loginButton;
                }
            }
        }
    }
    for(i =0; i< form.childNodes.length; i++) {
        var returnedButton = findSubmitButton(passInput);
        if(typeof returnedButton == "object") {
            return returnedButton;
        }
    }
    return loginButton;
}

// java hashcode equivalent for javascript
/*
String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}*/

//deprecated
function checkSavedDate(url) {
    var savedDate;
    var d = new Date();
    chrome.storage.sync.get(url,function(items) {
        savedDate = items.date;
    });
    // 90 days old?
    if(typeof savedDate == "undefined") {
        return false;
    }
    if(d.getTime() - savedDate > 2592000000*3) {
        return true;
    } else {
        return false;
    }
}

function checkDate(date) {
    var d = new Date();
    if(d.getTime() - date > 0) {//> 2592000000*3) {
        return true;
    } else {
        return false;
    }
}

function getExpire(date) {
    var d = new Date();
    return parseInt((d.getTime() - date)/86400000,10);
}

function checkPassInputAndRemoveEventListener() {
    // is passInput still exists?
    if(typeof getPasswordTypeInput(document) == "undefined") {
        alert("login suceed?");
        window.removeEventListener("load", checkPassInputAndRemoveEventListener, false);
    } else {
        alert("login failed?");
    }
}

function loginAction() {
    /*var savedData;
    var url = extractRootDomain(location.href);
    var passInput = getPasswordTypeInput(document);

    chrome.storage.sync.get("passwordChecker",function(items) {
        //console.log(url,items[url]);
        var data = items["passwordChecker"];
        if(typeof data == "undefined") {
            var d = new Date();
            var json = {};
            json[url] = d.getTime();
            updateHashDate(JSON.stringify(json));
        } else if(JSON.parse(data)[url] == "undefined") {
            // new site
            var d = new Date();
            alert("new site");
            var json = JSON.parse(data);
            json[url] = d.getTime();
            updateHashDate(JSON.stringify(json));
        } else {
            if(checkDate(JSON.parse(data)[url])) {
                alert("change!");
            }
            else {
                alert("not now");
            }
        }
    });*/
}

// check password's oldness
// 1:90 days old. change now
// 0: new site. don't know
// -1: ok
function checkPasswordChangeAlert() {
    var savedData;
    var url = extractRootDomain(location.href);
    var passInput = getPasswordTypeInput(document);

    chrome.storage.sync.get("passwordChecker",function(items) {
        //console.log(url,items[url]);
        var data = items["passwordChecker"];
        //just installed extension?
        if(typeof data == "undefined") {
            var d = new Date();
            var json = {};
            json[url] = d.getTime();
            updateHashDate(JSON.stringify(json));
            console.log("new install");
            return 0;
        }
        // new site?
        else if(typeof JSON.parse(data)[url] == "undefined") {
            // new site
            var d = new Date();
            //alert("new site");
            var json = JSON.parse(data);
            json[url] = d.getTime();
            updateHashDate(JSON.stringify(json));
            console.log("new site");
            return 0;
        }
        // old site
        else {
            if(checkDate(JSON.parse(data)[url])) {
                //alert("change");
                callNotification(url, getExpire(JSON.parse(data)[url]));
                console.log("change");
                return 1;
            }
            else {
                //alert("not now");
                //callNotification(url);
                console.log("not now");
                return -1;
            }
        }
    });
}

function callNotification(url,expire) {
    chrome.runtime.sendMessage({from : 'content',text: 'showNoti',url:url,expire:expire});
    /*var notification = window.webkitNotifications.createNotification(
        'exclamation.png',  // icon url - can be relative
        'Hello!',  // notification title
        'Lorem ipsum...'  // notification body text
    );
    
    notification.show();
    */
    /*var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
    var hour = time[1] % 12 || 12;               // The prettyprinted hour.
    var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
    new Notification(hour + time[2] + ' ' + period, {
        icon: 'exclamation.png',
        body: 'Time to make the toast.'
    });*/
    
}

function updateHashDate(data) {
    //var json = {};
    //json[url] = data;
    //console.log(JSON.stringify(json));
    chrome.storage.sync.set({"passwordChecker":data}, function() {
      // Notify that we saved.
      //alert('updated');
    });
}

// get iframe with its document
function getIframe(inputDoc) {
    var iframes = document.getElementsByTagName("iframe");
    for(var i=0; i<iframes.length;i++) {
        if(iframes[i].contentDocument == inputDoc) {
            return iframes[i];
        }
    }
    return null;
}

// script for popup window
function showPopup(e) {
    var popup = document.getElementById("myPopup");
    var body = popup.contentDocument.getElementsByTagName("body")[0];
    var html = popup.contentDocument.documentElement;
    var icon = getPasswordTypeInput(document).ownerDocument.getElementById("passInputIconSpan");
    var iframe = getIframe(icon.ownerDocument);
    var left;
    var top;
    if(iframe != null) {
        left = iframe.getBoundingClientRect().left + icon.getBoundingClientRect().left;
        top = iframe.getBoundingClientRect().top + icon.getBoundingClientRect().top;
    } else {
        left = icon.getBoundingClientRect().left;
        top = icon.getBoundingClientRect().top;
    }
    //chrome.runtime.sendMessage({text: 'getPopupDoc'}, function(response) {
    //    console.log(html);
    //    console.log(response);
        //html.innerHTML = '<html>    <head>        <meta http-equiv="X-UA-Compatible"content="IE=edge">        <meta charset="utf-8">        <title>kms passcheck</title>        <style>            body {                font-family: sans-serif;                font-size: 1em;                font-weight: 300;            }            input {                font-family: sans-serif;                font-size: 1em;                font-weight: 300;                /*color: #888;*/                border: 1px solid #bbb;                border-radius: 3px;                padding: 0.25em 10px;                line-height: 1.5em;            }            label::after {                content: ":";            }            div {                margin-bottom: 10px;            }            .hsimp-time {                display: inline;                margin-left: 10px;            }            .hsimp-checks li {                list-style: none;            }            .hsimp-checks h2 {                font-size: 0.8em;                margin-bottom: 0;            }            .hsimp-checks p {                margin-top: 0;                font-size: 0.7em;            }        </style>        <!--<link rel="stylesheet" href="hsimp.css">        <script src="hsimp.min.js">        </script>               <script src="popup_check.js">        </script>--><script>window.onload = popup_check(document);console.log("working?")</script>    </head>    <body style="width:400px;">        <h3>Password Checker</h3>        <input type="button" name="get" value="Get Password"/>        <br/><br/>or Enter your password below<br/><br/>        <input id="password-box" type="password" />        <div id="password-time" class="hsimp-time"></div>        <ul id="password-checks" class="hsimp-checks"></ul>        Check out our recommended secure password        <input type="button" id = "button1" value = "Check" />       <!--  <input type="button" id = "button1" onclick="button1_click()" value = "특수문자 추가" />        <input type="button" id = "button3" onclick="generate_random()" value = "랜덤암호 생성" />        <input type="button" onclick="add_random()" value="랜덤문자 추가"/>        <input type="button" name="button2" class="btn" value="Check" onclick="updateTxt()"> -->                            </body></html>';
        popup.setAttribute("style","visibility: visible;width: 410px;background-color: #fff;color: #000;text-align: center;border-radius: 6px;padding: 8px 0;position: absolute;z-index:1000;animation:fadeIn 1s;margin-left: -200px;top:" + (top + 20 + parseInt(icon.getAttribute("height").split("px")[0],10)).toString() +"px;left:" + left.toString() + "px;");
        getPasswordTypeInput(document).ownerDocument.getElementById("passInputIconSpan").removeEventListener("click", showPopup);
        getPasswordTypeInput(document).ownerDocument.getElementById("passInputIconSpan").addEventListener("click",hidePopup,false);
        window.removeEventListener("resize",showPopup)
        window.addEventListener("resize",showPopup,false);
    //});
    //body.innerHTML = "<h2 style=\"width:400px;\">Password Checker</h2>Check out our recommended secure passwords";
    /*popup.setAttribute("style","visibility: visible;width: 410px;background-color: #fff;color: #000;text-align: center;border-radius: 6px;padding: 8px 0;position: absolute;z-index:1000;animation:fadeIn 1s;margin-left: -200px;top:" + (top + parseInt(icon.getAttribute("height").split("px")[0],10)).toString() +"px;left:" + left.toString() + "px;");
    getPasswordTypeInput(document).ownerDocument.getElementById("passInputIconSpan").removeEventListener("click", showPopup);
    getPasswordTypeInput(document).ownerDocument.getElementById("passInputIconSpan").addEventListener("click",hidePopup,false);
    window.addEventListener("resize",showPopup,false);*/
}

function hidePopup(e) {
    var popup = document.getElementById("myPopup");
    var body = popup.contentDocument.getElementsByTagName("body")[0];
    var icon = getPasswordTypeInput(document).ownerDocument.getElementById("passInputIconSpan");
    body.innerHTML = "<h2 style=\"width:610px;\">Password Checker</h2>Check out our recommended secure passwords";
    popup.setAttribute("style","visibility:hidden;width: 620px;background-color: #fff;color: #000;text-align: center;border-radius: 6px;padding: 8px 0;position: absolute;z-index:1000;top:" + (icon.getBoundingClientRect().top + 20) +"px;left:" + icon.getBoundingClientRect().left + "px;");
  	getPasswordTypeInput(document).ownerDocument.getElementById("passInputIconSpan").removeEventListener("click", hidePopup);
  	getPasswordTypeInput(document).ownerDocument.getElementById("passInputIconSpan").addEventListener("click",showPopup,false);
  	window.removeEventListener("resize",showPopup);
}

// add icon button to password input
function setIconPasswordInput(opt) {
    var passInput = getPasswordTypeInput(document);
    if(opt == 1) {
        passInput.setAttribute("style","background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAeVJREFUOI2Vk09IG0EUxr+Z2Y0mJnFjF7HQSNL1UA1o/yhFlJZ46L3QU9tL0ZwET7lo6bUVvOptpZfmVmihp+aQVAg9lYIBsQilS0o1mNhdirQ125nxoGtSG8v6O34z3/fe4/EIAAqA4BgjHLzysL8vM6Fr6XioMwEAX3/+tkp1p5CrVM3P+78+oYkkABgAqJQEFgaTi9OJi7OMUIY2cCn4qrWz8nTzy7wr5AGOKzOVksDz0dTrdG/sTjvjaYq7dv7Rh427rpAHDAB9MnR56d6l3vt+zACQ7AoaIYVF1mr2W2KEg6ni7evrZ7V9FlwKnl77OMLmBuKPx3q6x89jBgBKCG0I0VAmdC3tiY7r2nsNtw4AUgKEABLNFUkJ6B2qrqlqDAAmdW1K8VYFAC8qVfPZpjXfUojgKOOEhcHE4qwRzwJAPNSZoPj7N/mfGQCRpzSSv3VtPRUND7eOcNK+bKZ62oVAc4SNH/tlpVR3Cl6Apqox79EPpbpToLlK1eRScL8mDy4Fz1WqJrMbf75HA2rPjVj05nkCTGt7+dW3Wo4BoO/3nHcj3ZGxZFfQ8GMu7tr5bHkrIyQ4A0CFBH+zU3sZUljkqhYepYTQdkYuBTet7eVseSvTekz/nPOD/r6ZSV2b8nPOh0YDwrT0Z05sAAAAAElFTkSuQmCC\") !important; background-repeat: no-repeat; background-attachment: scroll; background-size: 18px 18px; background-position: 98% 50%; z-index:100000 !important");
    } else if(opt == 0) {
        passInput.setAttribute("style","background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAgJJREFUOI11k11Ik1EYx39795U5+4IyI3NNJC/a0thFJGloF7a6MexWBqOomy4MJK8KuimLBgWSixS9m92YkgVzHxDd2QZFuEDY6xYxoqiL/Nre875djNba++4Ph3Pg+f3/z3MOHKjS6eN0TY8yszZLTsRQlRgiE2bt+QiTnW2crObLathJw/QoMyKGqiXQjJYSQzwdZsJuxf7XZwJw1OFYHOPNGTddNTtUKLLM0oVb+IoKRTPA4xs8udTNQJmoa4OmABz0w54+EL9hO1sutx7CZbeyY+k9EZOnlRPJZyTNElJpJgucyoH1AIh1MNeXXJ8G4Md8OaRQpNg+RLsU8BEomwE0BdJDsOyGd7vgow9MEuwf/O8aNitWfz9+S3cHPbpL/oz8O9d7SvtmRof1dHDW4mykxfipzOC6D4eHS4G5MR3R0sgRSdXQDP37+qH5JuQn4cN5UNd1iAZIch7ZeALg+zx8CQLCsCznkaVEirhh9VcU5Nuwka6Zn0gRl0ILhBRh0MJ5F7wpaB4xNG9ssTn1minpc470+BzjemIFCnnYWjUMeBDmYe4bWROAzYLt1T0Wz3npqzlvhebe8vLyHQYVgWIGECpiNk54t4O93mN4JVPpj1Rru0jh0QuC14NcUwQKoAfdLjxXLnK1t5NeZxNHVQ2R+UommiQaWmAinWWlkv8D7Hu4eE2UkYsAAAAASUVORK5CYII=\") !important; background-repeat: no-repeat; background-attachment: scroll; background-size: 18px 18px; background-position: 98% 50%; z-index:100000 !important");
    } else if(opt == -1) {
        passInput.setAttribute("style","background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAc5JREFUOE/Nks1rE0EYxosnzy2IV3vqyVr8P8Q/QFtobDc7O7vJ7mY/Jl/bD71Y7KlgLxZBhILFg3rUi7SCpxY/ChYh1HRnkyZp0ySUkKJPZ7eQS1LJSXxhmMv8nvd9n3mGhv7Lmip4V2mJ3VU5e0wD9jRRzSWpz8YGGlYrsptaJbupNzyYrTkYzTmYp/NI1LInlLs5z/OuXCpEg8wNtZwupNoLUIM0KGfRUbgLqWpDb3ugvjt/uYDP1qzOYhcMYdm3IXMbG/V3eNJYhVxyOrTojPeIkLJ3XQBB8jgPybcw65sR/MA38L71EWE9r62DtjIg/abQKrnbCme/SdnBcnUVK7VniB0ku/DG0VshmoLe9MRKbL1nAvUgOyF2PZstm/jQuOi40/4e3a8EPC3ECHdgCGOFmS97BJRdd0QpuvtaPQvNz2C7+QX4E8JvunDoiXm6APrLtvsaSQrOkt15CIlbMHgeK4driAsfws4iB9Dr+dDgY/mHO9pXIPYpNkz23c/22SPQCsMMN6MvVEvpKA/Joxyk3dTMXwN1byt+jRTcF1qQbhuNiyDp4mfEej+lr/rkQGkMH5HtxC2yZ03Le1Yi/s26c/+1MjIw/E8fngNIcz6cUXBevgAAAABJRU5ErkJggg==\") !important; background-repeat: no-repeat; background-attachment: scroll; background-size: 18px 18px; background-position: 98% 50%; z-index:100000 !important");
    }
}


// add icon button to password input with cool popup.
// failed to complete T.T
function addIconSpanToPasswordInputWithPopup() {
    var passInput = getPasswordTypeInput(document);
    var newPassInput = passInput.cloneNode(true);
    var holderPara = document.createElement("div");
    var iconSpan = document.createElement("div");
    var popup = document.createElement("iframe");
    popup.setAttribute("style","visibility:hidden;width: 620px;background-color: #fff;color: #000;text-align: center;border-radius: 6px;padding: 8px 0;position: absolute;z-index:1000;top: 200%;left: 50%;margin-left: -310px;");
    popup.setAttribute("id","myPopup");
    //popup.setAttribute("src","popup.html");
    var width = parseInt(window.getComputedStyle(passInput, null).getPropertyValue("width").split("px")[0]);
    var height = parseInt(window.getComputedStyle(passInput, null).getPropertyValue("height").split("px")[0]);
    var paddingTop = parseInt(window.getComputedStyle(passInput, null).getPropertyValue("padding-top").split("px")[0]);
    var paddingBottom = parseInt(window.getComputedStyle(passInput, null).getPropertyValue("padding-bottom").split("px")[0]);
    var rect = passInput.getBoundingClientRect();
    holderPara.setAttribute("style","position:relative;height:" + (rect.bottom - rect.top).toString() +"px");
    iconSpan.setAttribute("id","passInputIconSpan");
    iconSpan.setAttribute("style","background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAc5JREFUOE/Nks1rE0EYxosnzy2IV3vqyVr8P8Q/QFtobDc7O7vJ7mY/Jl/bD71Y7KlgLxZBhILFg3rUi7SCpxY/ChYh1HRnkyZp0ySUkKJPZ7eQS1LJSXxhmMv8nvd9n3mGhv7Lmip4V2mJ3VU5e0wD9jRRzSWpz8YGGlYrsptaJbupNzyYrTkYzTmYp/NI1LInlLs5z/OuXCpEg8wNtZwupNoLUIM0KGfRUbgLqWpDb3ugvjt/uYDP1qzOYhcMYdm3IXMbG/V3eNJYhVxyOrTojPeIkLJ3XQBB8jgPybcw65sR/MA38L71EWE9r62DtjIg/abQKrnbCme/SdnBcnUVK7VniB0ku/DG0VshmoLe9MRKbL1nAvUgOyF2PZstm/jQuOi40/4e3a8EPC3ECHdgCGOFmS97BJRdd0QpuvtaPQvNz2C7+QX4E8JvunDoiXm6APrLtvsaSQrOkt15CIlbMHgeK4driAsfws4iB9Dr+dDgY/mHO9pXIPYpNkz23c/22SPQCsMMN6MvVEvpKA/Joxyk3dTMXwN1byt+jRTcF1qQbhuNiyDp4mfEej+lr/rkQGkMH5HtxC2yZ03Le1Yi/s26c/+1MjIw/E8fngNIcz6cUXBevgAAAABJRU5ErkJggg==\") !important; background-repeat: no-repeat; background-attachment: scroll; background-size: 100%; background-position: center center; width: " + (height*0.8).toString() + "px; height: " + (height*0.8).toString() + "px;position: absolute; left: " + (rect.right - rect.left - height*0.8).toString() + "px; bottom: 0; top: 0; z-index:10000;" + "padding-top:" + paddingTop.toString() + "px;padding-bottom:" + paddingBottom.toString() + "px; margin:auto;");
    iconSpan.setAttribute("height",(height*0.8).toString() + "px");
    iconSpan.setAttribute("width",(height*0.8).toString() + "px");
    holderPara.appendChild(newPassInput);
    holderPara.appendChild(iconSpan);
    //holderPara.appendChild(popup);
    document.getElementsByTagName("body")[0].appendChild(popup);
    passInput.parentNode.replaceChild(holderPara,passInput);
    return {
        holderPara: holderPara,
        iconSpan : iconSpan,
        passInput : newPassInput
    };
}

// deprecated
function ourFunctionForIconSpan() {
    alert("clicked!\nhash of 'aaa' : " + Sha256.hash('aaa'));
}

/*document.addEventListener('DOMContentLoaded', () => {
    setBackgroundImageToPasswordInput(backgroundImageStyle);
});*/

//window.addEventListener ("load", onWindowLoadCaller, false);

window.onload = onWindowLoadCaller();

function onWindowLoadCaller (evt) {
    try{
        /*chrome.runtime.sendMessage({from : 'content',text: 'pageLoad'}, function(response) {
            if(response) {
                if(typeof getPasswordTypeInput(document) == "undefined") {
                    alert("login action");
                }
            }
        });*/
        //setBackgroundImageToPasswordInput(backgroundImageStyle);
        //var passInputFamily = addIconSpanToPasswordInput();
        //passInputFamily.iconSpan.onclick = ourFunctionForIconSpan();
        //passInputFamily.iconSpan.addEventListener("click", showPopup, false);
        //passInputFamily.iconSpan.addEventListener("click", popup_check(document.getElementById("myPopup").contentDocument), false);
        //passInputFamily.iconSpan.setAttribute("onclick", "showPopup(this)");
        //var passInputForm = findFormOfPasswordInput(passInputFamily.passInput);
        //passInputForm.addEventListener("submit",loginAction);
        checkPasswordChangeAlert();
        //console.log(chk);
        //setIconPasswordInput(chk);
    } catch(exception) {
        console.log(exception);
        try {
            window.addEventListener ("load", onWindowLoadCaller, false);
            //var chk = checkPasswordChangeAlert();
            //console.log(chk);
            //setIconPasswordInput(chk);
        } catch(exception2) {
            console.log(exception2);
        }
    }
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'getInputs') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        var pass = getPasswordTypeInputValue(document);
        sendResponse(pass);
    }
    // not used, window onload event listener will do this automatically
    else if (msg.text === 'setBackgroundImageToPasswordInput') {
        setBackgroundImageToPasswordInput(backgroundImageStyle);
        sendResponse('response');
    }
    // 
    else if (msg.text === 'setNewPw') {
        setPasswordTypeInputValue(msg.newPw);
        var url = extractRootDomain(location.href);
        chrome.storage.sync.get("passwordChecker",function(items) {
            //console.log(url,items[url]);
            var data = items["passwordChecker"];
            //just installed extension?
            if(typeof data == "undefined") {
                var d = new Date();
                var json = {};
                json[url] = d.getTime();
                updateHashDate(JSON.stringify(json));
                //console.log("new install");
                //return 0;
            }
            // new site?
            else if(typeof JSON.parse(data)[url] == "undefined") {
                // new site
                var d = new Date();
                //alert("new site");
                var json = JSON.parse(data);
                json[url] = d.getTime();
                updateHashDate(JSON.stringify(json));
                console.log("new site");
                return 0;
            }
            // old site
            else {
                var d = new Date();
                var json = JSON.parse(data);
                json[url] = d.getTime();
                updateHashDate(JSON.stringify(json));
            }
            sendResponse('done');
        });
    } else if (msg.text === 'getUrl') {
        sendResponse(extractRootDomain(location.href));
    }
});

// for domain name
// domain name can be used to generate password or be used as key for checking date

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain 
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 1].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}


// sha256 hash from https://www.movable-type.co.uk/scripts/sha256.html


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* SHA-256 (FIPS 180-4) implementation in JavaScript                  (c) Chris Veness 2002-2017  */
/*                                                                                   MIT Licence  */
/* www.movable-type.co.uk/scripts/sha256.html                                                     */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';


/**
 * SHA-256 hash function reference implementation.
 *
 * This is an annotated direct implementation of FIPS 180-4, without any optimisations. It is
 * intended to aid understanding of the algorithm rather than for production use.
 *
 * While it could be used where performance is not critical, I would recommend using the ‘Web
 * Cryptography API’ (developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest) for the browser,
 * or the ‘crypto’ library (nodejs.org/api/crypto.html#crypto_class_hash) in Node.js.
 *
 * See csrc.nist.gov/groups/ST/toolkit/secure_hashing.html
 *     csrc.nist.gov/groups/ST/toolkit/examples.html
 */
class Sha256 {

    /**
     * Generates SHA-256 hash of string.
     *
     * @param   {string} msg - (Unicode) string to be hashed.
     * @param   {Object} [options]
     * @param   {string} [options.msgFormat=string] - Message format: 'string' for JavaScript string
     *   (gets converted to UTF-8 for hashing); 'hex-bytes' for string of hex bytes ('616263' ≡ 'abc') .
     * @param   {string} [options.outFormat=hex] - Output format: 'hex' for string of contiguous
     *   hex bytes; 'hex-w' for grouping hex bytes into groups of (4 byte / 8 character) words.
     * @returns {string} Hash of msg as hex character string.
     */
    static hash(msg, options) {
        const defaults = { msgFormat: 'string', outFormat: 'hex' };
        const opt = Object.assign(defaults, options);

        // note use throughout this routine of 'n >>> 0' to coerce Number 'n' to unsigned 32-bit integer

        switch (opt.msgFormat) {
            default: // default is to convert string to UTF-8, as SHA only deals with byte-streams
            case 'string':   msg = utf8Encode(msg);       break;
            case 'hex-bytes':msg = hexBytesToString(msg); break; // mostly for running tests
        }

        // constants [§4.2.2]
        const K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2 ];

        // initial hash value [§5.3.3]
        const H = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19 ];

        // PREPROCESSING [§6.2.1]

        msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

        // convert string msg into 512-bit blocks (array of 16 32-bit integers) [§5.2.1]
        const l = msg.length/4 + 2; // length (in 32-bit integers) of msg + ‘1’ + appended length
        const N = Math.ceil(l/16);  // number of 16-integer (512-bit) blocks required to hold 'l' ints
        const M = new Array(N);     // message M is N×16 array of 32-bit integers

        for (let i=0; i<N; i++) {
            M[i] = new Array(16);
            for (let j=0; j<16; j++) { // encode 4 chars per integer (64 per block), big-endian encoding
                M[i][j] = (msg.charCodeAt(i*64+j*4+0)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16)
                        | (msg.charCodeAt(i*64+j*4+2)<< 8) | (msg.charCodeAt(i*64+j*4+3)<< 0);
            } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
        }
        // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
        // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
        // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
        const lenHi = ((msg.length-1)*8) / Math.pow(2, 32);
        const lenLo = ((msg.length-1)*8) >>> 0;
        M[N-1][14] = Math.floor(lenHi);
        M[N-1][15] = lenLo;


        // HASH COMPUTATION [§6.2.2]

        for (let i=0; i<N; i++) {
            const W = new Array(64);

            // 1 - prepare message schedule 'W'
            for (let t=0;  t<16; t++) W[t] = M[i][t];
            for (let t=16; t<64; t++) {
                W[t] = (Sha256.σ1(W[t-2]) + W[t-7] + Sha256.σ0(W[t-15]) + W[t-16]) >>> 0;
            }

            // 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
            let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];

            // 3 - main loop (note '>>> 0' for 'addition modulo 2^32')
            for (let t=0; t<64; t++) {
                const T1 = h + Sha256.Σ1(e) + Sha256.Ch(e, f, g) + K[t] + W[t];
                const T2 =     Sha256.Σ0(a) + Sha256.Maj(a, b, c);
                h = g;
                g = f;
                f = e;
                e = (d + T1) >>> 0;
                d = c;
                c = b;
                b = a;
                a = (T1 + T2) >>> 0;
            }

            // 4 - compute the new intermediate hash value (note '>>> 0' for 'addition modulo 2^32')
            H[0] = (H[0]+a) >>> 0;
            H[1] = (H[1]+b) >>> 0;
            H[2] = (H[2]+c) >>> 0;
            H[3] = (H[3]+d) >>> 0;
            H[4] = (H[4]+e) >>> 0;
            H[5] = (H[5]+f) >>> 0;
            H[6] = (H[6]+g) >>> 0;
            H[7] = (H[7]+h) >>> 0;
        }

        // convert H0..H7 to hex strings (with leading zeros)
        for (let h=0; h<H.length; h++) H[h] = ('00000000'+H[h].toString(16)).slice(-8);

        // concatenate H0..H7, with separator if required
        const separator = opt.outFormat=='hex-w' ? ' ' : '';

        return H.join(separator);

        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

        function utf8Encode(str) {
            try {
                return new TextEncoder().encode(str, 'utf-8').reduce((prev, curr) => prev + String.fromCharCode(curr), '');
            } catch (e) { // no TextEncoder available?
                return unescape(encodeURIComponent(str)); // monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
            }
        }

        function hexBytesToString(hexStr) { // convert string of hex numbers to a string of chars (eg '616263' -> 'abc').
            const str = hexStr.replace(' ', ''); // allow space-separated groups
            return str=='' ? '' : str.match(/.{2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
        }
    }



    /**
     * Rotates right (circular right shift) value x by n positions [§3.2.4].
     * @private
     */
    static ROTR(n, x) {
        return (x >>> n) | (x << (32-n));
    }


    /**
     * Logical functions [§4.1.2].
     * @private
     */
    static Σ0(x) { return Sha256.ROTR(2,  x) ^ Sha256.ROTR(13, x) ^ Sha256.ROTR(22, x); }
    static Σ1(x) { return Sha256.ROTR(6,  x) ^ Sha256.ROTR(11, x) ^ Sha256.ROTR(25, x); }
    static σ0(x) { return Sha256.ROTR(7,  x) ^ Sha256.ROTR(18, x) ^ (x>>>3);  }
    static σ1(x) { return Sha256.ROTR(17, x) ^ Sha256.ROTR(19, x) ^ (x>>>10); }
    static Ch(x, y, z)  { return (x & y) ^ (~x & z); }          // 'choice'
    static Maj(x, y, z) { return (x & y) ^ (x & z) ^ (y & z); } // 'majority'

}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

if (typeof module != 'undefined' && module.exports) module.exports = Sha256; // ≡ export default Sha256





////////////////////////
//
// deprecated functions
//
//
//
//

// get currently focused password input value
function getCurrentInputActivated(targetDoc) {
    var currentInput = targetDoc.activeElement;
    if(currentInput.tagName == "IFRAME") {
        return getCurrentInput(currentInput.contentDocument);
    }
    else {
        return currentInput.value;
    }
}

// set currently focused password input value
function setCurrentInputActivated(targetDoc, newInputValue) {
    var currentInput = targetDoc.activeElement;
    if(currentInput.tagName == "IFRAME") {
        setCurrentInput(currentInput.contentDocument, newInputValue);
    }
    else {
        currentInput.value = newInputValue;
    }
}


// deprecated
// for our icon
function setBackgroundImageToPasswordInput(style) {
    var passInput = getPasswordTypeInput(document);
    passInput.setAttribute("style",style);
    //passInput.setAttribute("onclick","alert(\"clicked!\");");
    var backgroundImageDiv = document.createElement("div");
    var rect = passInput.getBoundingClientRect();
    var backgroundImageOnclick = "alert('input pw : ' + getElementById('" + passInput.id + "').value);";
    //var left = rect.left + (rect.right - rect.left)*0.98 - 18;
    //var top = rect.top + (rect.bottom - rect.top)*0.5 - 9;
    //var left = window.getComputedStyle(passInput, null).getPropertyValue("left");
    //var top = window.getComputedStyle(passInput, null).getPropertyValue("top");
    var width = parseInt(window.getComputedStyle(passInput, null).getPropertyValue("width").split("px")[0]);
    var height = parseInt(window.getComputedStyle(passInput, null).getPropertyValue("height").split("px")[0]);
    var left = width*0.98 - 18;
    var top = height*0.5 - 9;
    var backgroundImageButtonStyle = "position:absolute;cursor:pointer;width:18px;height:18px;top:" + top + "px;left: " + left + "px;";
    backgroundImageDiv.setAttribute("style",backgroundImageButtonStyle);
    backgroundImageDiv.setAttribute("onclick",backgroundImageOnclick);
    passInput.parentElement.appendChild(backgroundImageDiv);
}

// deprecated
// our icon in password input field
var backgroundImageStyle = "background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAc5JREFUOE/Nks1rE0EYxosnzy2IV3vqyVr8P8Q/QFtobDc7O7vJ7mY/Jl/bD71Y7KlgLxZBhILFg3rUi7SCpxY/ChYh1HRnkyZp0ySUkKJPZ7eQS1LJSXxhmMv8nvd9n3mGhv7Lmip4V2mJ3VU5e0wD9jRRzSWpz8YGGlYrsptaJbupNzyYrTkYzTmYp/NI1LInlLs5z/OuXCpEg8wNtZwupNoLUIM0KGfRUbgLqWpDb3ugvjt/uYDP1qzOYhcMYdm3IXMbG/V3eNJYhVxyOrTojPeIkLJ3XQBB8jgPybcw65sR/MA38L71EWE9r62DtjIg/abQKrnbCme/SdnBcnUVK7VniB0ku/DG0VshmoLe9MRKbL1nAvUgOyF2PZstm/jQuOi40/4e3a8EPC3ECHdgCGOFmS97BJRdd0QpuvtaPQvNz2C7+QX4E8JvunDoiXm6APrLtvsaSQrOkt15CIlbMHgeK4driAsfws4iB9Dr+dDgY/mHO9pXIPYpNkz23c/22SPQCsMMN6MvVEvpKA/Joxyk3dTMXwN1byt+jRTcF1qQbhuNiyDp4mfEej+lr/rkQGkMH5HtxC2yZ03Le1Yi/s26c/+1MjIw/E8fngNIcz6cUXBevgAAAABJRU5ErkJggg==\") !important; background-repeat: no-repeat; background-attachment: scroll; background-size: 18px 18px;";// background-position: 98% 50%;";

