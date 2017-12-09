window.addEventListener("load", function () {
    var passwordInput = document.getElementById("password-box"),
        timeDiv = document.getElementById("password-time"),
        checksList = document.getElementById("password-checks");


    // Code to render the time returned by HSIMP
    var renderTime = function (time, input) {
        timeDiv.innerHTML = time || "";
    };

    // Code to output the checks returned by HSIMP
    var renderChecks = function (checks, input) {
        checksList.innerHTML = "";

        for (var i = 0, l = checks.length; i < l; i++) {
            var li = document.createElement("li"),
                title = document.createElement("h2"),
                message = document.createElement("p");

            title.innerHTML = checks[i].name;
            li.appendChild(title);

            message.innerHTML = checks[i].message;
            li.appendChild(message);

            checksList.appendChild(li);
        }
    };

    // Setup the HSIMP object
    var attachTo = hsimp({
        options: {
            calculationsPerSecond: 10e9, // 10 billion calculations per second
            good: 31557600,//31557600e9, // 1 billion years
            ok: 2592000//31557600e3 // 1 thousand years
        },
        outputTime: renderTime,
        outputChecks: renderChecks
    });
    
    // setup custom values for "instantly"/"forever"
    hsimp.setDictionary({
        "instantly": "Immediately",
        "forever": "Aaaaaaaaaaaaaaaages",
    });

    // Run the HSIMP
    attachTo(passwordInput);
    
    document.getElementById("button1").addEventListener("click",check);
});

function check() {
    sessionStorage.password = document.getElementById('password-box').value;
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {text: 'getUrl'}, function(response) {
            if(typeof response != "undefined") {
                sessionStorage.prefix = response.split('.')[0];
                sessionStorage.suffix = response.split('.')[1];
            } else {
                sessionStorage.prefix = "";
                sessionStorage.suffix = "";
            }
            location.href ="check.html" 
        });
    });
    
}

function button1_click() {
    var ida = document.getElementById('password-box').value;
    ida += getRandomSpecialLetter(4);
        document.getElementById('password-box').value = ida;
    attachTo(passwordInput);
    
}


function updateTxt() {
    var field1 = document.getElementById('password-box').value;
    alert(field1);
}

function generate_random() {
    var length = Math.floor(Math.random() * 10);
    length = length % 6 + 10;
    var ida  = getRandomCode(length);
//                    document.getElementById('password-box').innerText = ida;
    document.getElementById('password-box').value = ida;
}

function add_random() {
    var ida = document.getElementById('password-box').value;
    ida += getRandomLetter(4);
        document.getElementById('password-box').value = ida;
}

// Random Code 생성
function createCode(objArr, iLength) {
    var arr = objArr;
    var randomStr = "";

    for (var j=0; j<iLength; j++) {
        randomStr += arr[Math.floor(Math.random()*arr.length)];
    }

    return randomStr
}


// 숫자 + 문자 + 특수문자
function getRandomCode(iLength) {
    var arr="0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,~,`,!,@,#,$,%,^,&,*,(,),-,+,|,_,=,\,[,],{,},<,>,?,/,.,;".split(",");

    var rnd = createCode(arr, iLength);
    return rnd;
}

function getRandomSpecialLetter(iLength) {
  var arr="~,`,!,@,#,$,%,^,&,*,(,),-,+,|,_,=,\,[,],{,},<,>,?,/,.,;".split(",");

    var rnd = createCode(arr, iLength);

    return rnd;
}

function getRandomLetter(iLength) {
  var arr="a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9".split(",");

    var rnd = createCode(arr, iLength);
    return rnd;
}

/*window.onload = popup_check(document);

function popup_check(targetDoc) {
    //var targetDoc = document.getElementById("myPopup").contentDocument;
    var passwordInput = targetDoc.getElementById("password-box"),
        timeDiv = targetDoc.getElementById("password-time"),
        checksList = targetDoc.getElementById("password-checks");


    // Code to render the time returned by HSIMP
    var renderTime = function (time, input) {
        timeDiv.innerHTML = time || "";
    };

    // Code to output the checks returned by HSIMP
    var renderChecks = function (checks, input) {
        checksList.innerHTML = "";

        for (var i = 0, l = checks.length; i < l; i++) {
            var li = document.createElement("li"),
                title = document.createElement("h2"),
                message = document.createElement("p");

            title.innerHTML = checks[i].name;
            li.appendChild(title);

            message.innerHTML = checks[i].message;
            li.appendChild(message);

            checksList.appendChild(li);
        }
    };

    // Setup the HSIMP object
    var attachTo = hsimp({
        options: {
            calculationsPerSecond: 10e9, // 10 billion calculations per second
            good: 31557600,//31557600e9, // 1 billion years
            ok: 2592000//31557600e3 // 1 thousand years
        },
        outputTime: renderTime,
        outputChecks: renderChecks
    });
    
    // setup custom values for "instantly"/"forever"
    hsimp.setDictionary({
        "instantly": "Immediately",
        "forever": "Aaaaaaaaaaaaaaaages",
    });

    // Run the HSIMP
    attachTo(passwordInput);
    
    targetDoc.getElementById("button1").addEventListener("click",check);
}//);

function check() {
    sessionStorage.password = document.getElementById('password-box').value;
    location.href ="check.html" 
}

function button1_click() {
    var ida = document.getElementById('password-box').value;
    ida += getRandomSpecialLetter(4);
        document.getElementById('password-box').value = ida;
    attachTo(passwordInput);
    
}


function updateTxt() {
    var field1 = document.getElementById('password-box').value;
    alert(field1);
}

function generate_random() {
    var length = Math.floor(Math.random() * 10);
    length = length % 6 + 10;
    var ida  = getRandomCode(length);
//                    document.getElementById('password-box').innerText = ida;
    document.getElementById('password-box').value = ida;
}

function add_random() {
    var ida = document.getElementById('password-box').value;
    ida += getRandomLetter(4);
        document.getElementById('password-box').value = ida;
}

// Random Code 생성
function createCode(objArr, iLength) {
    var arr = objArr;
    var randomStr = "";

    for (var j=0; j<iLength; j++) {
        randomStr += arr[Math.floor(Math.random()*arr.length)];
    }

    return randomStr
}


// 숫자 + 문자 + 특수문자
function getRandomCode(iLength) {
    var arr="0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,~,`,!,@,#,$,%,^,&,*,(,),-,+,|,_,=,\,[,],{,},<,>,?,/,.,;".split(",");

    var rnd = createCode(arr, iLength);
    return rnd;
}

function getRandomSpecialLetter(iLength) {
  var arr="~,`,!,@,#,$,%,^,&,*,(,),-,+,|,_,=,\,[,],{,},<,>,?,/,.,;".split(",");

    var rnd = createCode(arr, iLength);

    return rnd;
}

function getRandomLetter(iLength) {
  var arr="a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9".split(",");

    var rnd = createCode(arr, iLength);
    return rnd;
}*/
