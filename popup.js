// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}



/**
 * Change the background color of the current page.
 *
 * @param {string} color The new background color.
 */
/*
function changeBackgroundColor(color) {
  var script = 'document.body.style.backgroundColor="' + color + '";';
  // See https://developer.chrome.com/extensions/tabs#method-executeScript.
  // chrome.tabs.executeScript allows us to programmatically inject JavaScript
  // into a page. Since we omit the optional first argument "tabId", the script
  // is inserted into the active tab of the current window, which serves as the
  // default.
  chrome.tabs.executeScript({
    code: script
  });
}*/

/**
 * Gets the saved background color for url.
 *
 * @param {string} url URL whose background color is to be retrieved.
 * @param {function(string)} callback called with the saved background color for
 *     the given url on success, or a falsy value if no color is retrieved.
 */
/*
function getSavedBackgroundColor(url, callback) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
  // for chrome.runtime.lastError to ensure correctness even when the API call
  // fails.
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}*/

/**
 * Sets the given background color for url.
 *
 * @param {string} url URL for which background color is to be saved.
 * @param {string} color The background color to be saved.
 */
/*function saveBackgroundColor(url, color) {
  var items = {};
  items[url] = color;
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
  // optional callback since we don't need to perform any action once the
  // background color is saved.
  chrome.storage.sync.set(items);
}*/

function doStuffWithDom(pass) {
    // do something with returned DOM element
    alert("doStuff return : " + pass);
}

function changePWcontent(pwNew) {
    // change target password input to newPW
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {text: 'setNewPw',newPw:pwNew}, null);
    });
}

function checkPassword() {
    // check password
}

// This extension loads the saved background color for the current tab if one
// exists. The user can select a new background color from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage. The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
// to a document's origin. Also, using chrome.storage.sync instead of
// chrome.storage.local allows the extension data to be synced across multiple
// user devices.
document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    var pwCheck = document.getElementById('pwCheck');
    //var pwApply = document.getElementById('pwApply');
    //var pwNew = document.getElementById('pwNew');
    var pwBox = document.getElementById("password-box");
    //alert("loaded");
    pwCheck.onclick = function () {
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendMessage(tab.id, {text: 'getInputs'}, function(response) {
                console.log(response);
                pwBox.value = response;
                var event = document.createEvent('Event');
                event.initEvent('keyup', true, true);
                event.keyCode = 0;
                pwBox.dispatchEvent(event);
                /*var evt = document.createEvent("KeyboardEvent");
                (evt.initKeyEvent || evt.initKeyboardEvent)("keyup", true, true, window,
                                    0, 0, 0, 0,
                                    0, character.charCodeAt(0));
                pwBox.dispatchEvent(evt);*/
                //let keyupEvent = new Event('keyup');
                //pwBox.dispatchEvent(keyupEvent);
            });
        });
    };
    /*
    pwApply.onclick = function() {
        //alert("input pw in extension : " + pwNew.value);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {text: 'setNewPw',newPw:pwNew.value}, function(response) {
                alert(url + " : " + response);
            });
        });
    };*/
    

/*    document.getElementById('pwCheck').addEventListener('click', () => {
        //console.log("Popup DOM fully loaded and parsed");

        function getPassContent() {
            //You can play with your DOM here or check URL against your regex
            //console.log('Tab script:');
            //console.log(document.body);

            //return document.getElementsByTagName('input');
            return document;
        }

        //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
        chrome.tabs.executeScript({
            code: '(' + getPassContent + ')();' //argument here is a string but function.toString() returns function's code
        }, (result) => {
            //Here we have just the innerHTML and not DOM structure
            //console.log('Popup script:')
            //console.log(results[0]);
            alert("getPass return " + result);
            alert("getPass return[0] " + result[0]);
            var pass;
            alert("result " + result.contructor.name);
            var inputs = result.getElementsByTagName('input');
            
            alert("inputs " + inputs.contructor.name);
            for(var i = 0; i < inputs.length; i++) {
                if(inputs[i].type.toLowerCase() == 'password') {
                    pass = inputs[i].value;
                }
            }
            alert("getPass for " + pass);
        });
    });*/


  });
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'getPopupDoc') {
        console.log(document.documentElement);
        sendResponse('<html>    <head>        <meta http-equiv="X-UA-Compatible"content="IE=edge">        <meta charset="utf-8">        <title>kms passcheck</title>        <style>            body {                font-family: sans-serif;                font-size: 1em;                font-weight: 300;            }            input {                font-family: sans-serif;                font-size: 1em;                font-weight: 300;                /*color: #888;*/                border: 1px solid #bbb;                border-radius: 3px;                padding: 0.25em 10px;                line-height: 1.5em;            }            label::after {                content: ":";            }            div {                margin-bottom: 10px;            }            .hsimp-time {                display: inline;                margin-left: 10px;            }            .hsimp-checks li {                list-style: none;            }            .hsimp-checks h2 {                font-size: 0.8em;                margin-bottom: 0;            }            .hsimp-checks p {                margin-top: 0;                font-size: 0.7em;            }        </style>        <link rel="stylesheet" href="hsimp.css">        <script src="hsimp.min.js">        </script>               <script src="popup_check.js">        </script>    </head>    <body style="width:400px;">        <h3>Password Checker</h3>        <input type="button" name="get" value="Get Password"/>        <br/><br/>or Enter your password below<br/><br/>        <input id="password-box" type="password" />        <div id="password-time" class="hsimp-time"></div>        <ul id="password-checks" class="hsimp-checks"></ul>        Check out our recommended secure password        <input type="button" id = "button1" value = "Check" />       <!--  <input type="button" id = "button1" onclick="button1_click()" value = "특수문자 추가" />        <input type="button" id = "button3" onclick="generate_random()" value = "랜덤암호 생성" />        <input type="button" onclick="add_random()" value="랜덤문자 추가"/>        <input type="button" name="button2" class="btn" value="Check" onclick="updateTxt()"> -->                            </body></html>');
    }
});

