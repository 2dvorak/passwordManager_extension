var loginAction = false;

//alert("background");

function showNotification(url,expire) {
    /*var notification = webkitNotifications.createNotification(
        'exclamation.png',  // icon url - can be relative
        'Hello!',  // notification title
        'Lorem ipsum...'  // notification body text
    );
    
    notification.show();*/
    //var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
    //var hour = time[1] % 12 || 12;               // The prettyprinted hour.
    //var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
    new Notification('Well, it\'s embarrassing.',{
        icon: 'exclamation.png',
        body: 'Your password for ' + url + ' is ' + expire.toString() + ' days old.'
    });
}
    

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if ((msg.from === 'content') &&(msg.text === 'loginAction')) {
        loginAction = true;
        //alert("msg from content");
    }
    if((msg.from === 'content') && (msg.text === 'pageLoad')) {
        if(loginAction) {
            sendResponse(true);
            loginAction = false;
        } else {
            sendResponse(false);
        }
    }
    if((msg.from === 'content') && (msg.text === 'showNoti')) {
        showNotification(msg.url,msg.expire);
    }
});
