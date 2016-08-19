
function adsgrace_callback(json){
    function nowdatetime(){
        var now = new Date();
        //conv to utc time
        now = new Date(now.getTime()+(now.getTimezoneOffset()*60*1000));
        var year = now.getYear(); if (year < 2000) { year += 1900; };
        function fmtzero(value){
            return (value < 10) ? '0' + value : '' + value;
        };
        var month = fmtzero(now.getMonth() + 1);
        var day = fmtzero(now.getDate());
        var hour = fmtzero(now.getHours());
        var min = fmtzero(now.getMinutes());
        return year + month + day + hour + min;
    };
    var now = nowdatetime();

    function is_target(ad){
        if (now<ad['start']){return false;};
        if (ad['end']<now){return false;};
        return true;
    };

    function show_ad(host_image, adid, ads){
        var elem = document.getElementById('adsgrace-'+adid);
        if (!elem){return;}
        var tags = '';
        for (var i = 0; i<ads.length; i++) {
            var ad = ads[i];
            if (!is_target(ad)){continue;};
            var width = ('width' in ad) ? 'width="'+ad['width']+'"' : '';
            var tag = '<span class="adsgrace-item" id="adsgrace-'+adid+'-'+(i+1)+'"><a href="'+ad['url']+'" target="_blank"><img src="'+host_image+ad['image_id']+'" '+width+' /></a></span>';
            tags += tag;
        };
        elem.innerHTML = tags;
    };

    var host_image = json['host_image'];
    var ads = json['ads'];
    for (var i = 0; i<ads.length; i++) {
        var elem = ads[i];
        show_ad(host_image, elem['adid'], elem['items'])
    }

}

function adsgrace_contentLoaded(win, fn) {
    // https://github.com/dperini/ContentLoaded/blob/master/src/contentloaded.js
    var done = false, top = true,
    doc = win.document, root = doc.documentElement,
    add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
    rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
    pre = doc.addEventListener ? '' : 'on',
    init = function(e) {
        if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
        (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
        if (!done && (done = true)) fn.call(win, e.type || e);
    },
    poll = function() {
        try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
        init('poll');
    };
    if (doc.readyState == 'complete') fn.call(win, 'lazy');
    else {
        if (doc.createEventObject && root.doScroll) {
            try { top = !win.frameElement; } catch(e) { }
            if (top) poll();
        }
        doc[add](pre + 'DOMContentLoaded', init, false);
        doc[add](pre + 'readystatechange', init, false);
        win[add](pre + 'load', init, false);
    }
}

adsgrace_contentLoaded(window, function(){
    var elem = document.getElementById('adsgrace');
    if (!elem){return;}

    var fileid = elem.getAttribute('data-id');
    var fileurl = 'https://s3-ap-northeast-1.amazonaws.com/adsgrace/' + fileid
    var script = document.createElement('script');
    script.src = fileurl
    document.body.appendChild(script)
});
