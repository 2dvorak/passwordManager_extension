//console.log(sessionStorage.password);

window.addEventListener("load",function() {
    document.getElementById("refreshBtn").addEventListener("click",getRandomCode);
    document.getElementById("applyBtn").addEventListener("click",apply);
    //document.getElementById("applyBtn").addEventListener("click",apply);
    
    
    
    var passwordInput = document.getElementById("hiddenPW"),
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
    
    document.getElementById("select").addEventListener("click",function() {
        console.log("select");
        passwordInput.value = document.getElementById("select").value;
        var event = document.createEvent('Event');
        event.initEvent('keyup', true, true);
        event.keyCode = 0;
        passwordInput.dispatchEvent(event);
    });
});

function createCode(objArr, iLength) {
    var arr = objArr;
    var randomStr = "";

    for (var j=0; j<iLength; j++) {
        randomStr += arr[Math.floor(Math.random()*arr.length)];
    }

    return randomStr
}

function getRandomCode(iLength) {
	var num = "0,1,2,3,4,5,6,7,8,9";
	var ss = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z"
	var bs = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z"
	var char = "~,`,!,@,#,$,%,^,&,*,(,),-,+,|,_,=,\,[,],{,},<,>,?,/,.,;"
    var arr="";
    var count = 0;

    if(document.getElementById('small').checked) {
    	arr += ss;
    	count ++;
    }

    if(document.getElementById('large').checked) {
    	if(count > 0){
    		arr += ',';
    	}

    	arr += bs;
    	count ++;
    }

    if(document.getElementById('num').checked) {
    	if(count > 0){
    		arr += ',';
    	}

    	arr += num;
    	count ++;
    }

    if(document.getElementById('char').checked) {
    	if(count > 0){
    		arr += ',';
    	}

    	arr += char;
    	count ++;
    }

    arr = arr.split(",");
    
   
	var opfix = document.getElementById('opfix').value;
	var osfix = document.getElementById('osfix').value;
	
	var pfix = sessionStorage.prefix;
	var sfix = sessionStorage.suffix;

    var min = Number(document.getElementById('min').value);
    var max = Number(document.getElementById('max').value);
    var ori = sessionStorage.password;
    
    if(document.getElementById('pre').checked) {
		ori = pfix + ori;
	} else if(opfix != "") {
	    ori = opfix + ori;
	}
    
    var oriLength = ori.length
    
    if(document.getElementById('suf').checked) {
		oriLength += sfix.length
	} else if(osfix != "") {
	    oriLength += osfix.length
	}
    
    console.log(oriLength);
    
    if(max <= oriLength) {
        max = 0;
        min = 0;
    } else if ( min < oriLength && oriLength <= max) {
        max -= oriLength;
        min = 0;
    } else if (oriLength <= min) {
        max -= oriLength;
        min -= oriLength;
    }
        
	var length = Math.floor(Math.random()*(max-min+1)) + min;

    var rnd = createCode(arr, length);
    rnd = ori + rnd;
    
    if(document.getElementById('suf').checked) {
		rnd = rnd + sfix;
	} else if(osfix != "") {
	    rnd = rnd + osfix;
	}
    
    document.getElementById('one').value = rnd;
    document.getElementById('one').text = rnd;

    length = Math.floor(Math.random()*(max-min+1)) + min;

    rnd = createCode(arr, length);
    rnd = ori + rnd;
    
    if(document.getElementById('suf').checked) {
		rnd = rnd + sfix;
	} else if(osfix != "") {
	    rnd = rnd + osfix;
	}
    
    document.getElementById('two').value = rnd;
    document.getElementById('two').text = rnd;

    length = Math.floor(Math.random()*(max-min+1)) + min;

    rnd = createCode(arr, length);
    rnd = ori + rnd;
    
    if(document.getElementById('suf').checked) {
		rnd = rnd + sfix;
	} else if(osfix != "") {
	    rnd = rnd + osfix;
	}
    
    document.getElementById('three').value = rnd;
    document.getElementById('three').text = rnd;
}

function apply() {
	//console.log(document.getElementById('pre').checked)
	//console.log(document.getElementById('suf').checked)
	//console.log(document.getElementById('fix').value);

    var pass = document.getElementById('select').value;

	chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {text: 'setNewPw',newPw:pass}, function(response) {
            console.log(response);
        });
    });
}
