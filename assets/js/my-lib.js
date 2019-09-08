var osStatus = '';
var isMobile = false;

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        isMobile = true;
        return "Windows Phone";

    }

    if (/android/i.test(userAgent)) {
        isMobile = true;
        return "Android";
    }
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        isMobile = true;
        return "iOS";
    }
    return "unknown";
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
osStatus = getMobileOperatingSystem();

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function goToVideoView(self) {
    var video_id;
    video_id = $(self).data('id');

    saveHistoryVideos(video_id);

    window.open('detail.php?id='+video_id,'_blank');
}

function getDuration(timeString) {
    var realTimeStr;
    var hr = 0, hrStr = "", hrPos;
    var minute = 0, minuteStr = "", minutePos;
    var seconds = 0, secondsStr = "", secondsPos;

    realTimeStr = timeString.substr(2);
    hrPos = realTimeStr.indexOf('H');
    if (hrPos != -1) {
        hrStr = realTimeStr.substr(0, hrPos);
        hr = parseInt(hrStr);
        realTimeStr = realTimeStr.substr(hrPos + 1);
    }
    minutePos = realTimeStr.indexOf('M');
    if (minutePos != -1) {
        minuteStr = realTimeStr.substr(0, minutePos);
        minute = parseInt(minuteStr);
        realTimeStr = realTimeStr.substr(minutePos + 1);
    }
    secondsPos = realTimeStr.indexOf('S');
    if (secondsPos != -1) {
        secondsStr = realTimeStr.substr(0, realTimeStr.length - 1);
        seconds = parseInt(secondsStr);
    }
    realTimeStr = "";
    if (hr > 0) {
        if (hr.length < 2) hr = "0" + hr;
        realTimeStr += hr + "h:";
    }
    if (minute > 0) {
        if (minute.length < 2) minute = "0" + minute;
        realTimeStr += minute + "m:";
    }
    if (seconds > 0) {
        if (seconds.length < 2) seconds = "0" + seconds;
        realTimeStr += seconds+"s";
    }
    if(realTimeStr =="") return "LIVE";
    return realTimeStr;
}

function cutOffStr(str) {

    if(str.length>10) str = str.substr(0,10) + "...";
    return str;

}

function isoDateStrParse(dateStr) {
    var newDate;
    newDate =  new Date(dateStr);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);

    return ((newDate.getYear() + 1900) +"-"+(newDate.getMonth() + 1) + '-' + newDate.getDate() + ' ' +newDate.getHours()+":"+newDate.getMinutes()) ;
}

function saveFavoriteVideos(video_id) {

    var prevVideos = localStorage.getItem('yt-fav-videos');
    if(typeof prevVideos != "undefined" && prevVideos != null){
        prevVideos = JSON.parse(prevVideos);
        if(prevVideos.indexOf(video_id) == -1 ){
            prevVideos.push(video_id);
        }
    } else{
        prevVideos = [video_id];
    }
    localStorage.setItem('yt-fav-videos',JSON.stringify(prevVideos));

}

function getFavVideos() {
    var retVideos = [];
    var prevVideos = localStorage.getItem('yt-fav-videos');
    if(typeof prevVideos != "undefined" && prevVideos != null){
        retVideos = JSON.parse(prevVideos);
    }
    return retVideos;
}

function saveHistoryVideos(video_id) {

    var prevVideos = localStorage.getItem('yt-history-videos');
    if(typeof prevVideos != "undefined" && prevVideos != null){
        prevVideos = JSON.parse(prevVideos);
        if(prevVideos.indexOf(video_id) == -1 ){
            prevVideos.push(video_id);
        }
    } else{
        prevVideos = [video_id];
    }
    localStorage.setItem('yt-history-videos',JSON.stringify(prevVideos));

}

function getHistoryVideos() {
    var retVideos = [];
    var prevVideos = localStorage.getItem('yt-history-videos');
    if(typeof prevVideos != "undefined" && prevVideos != null){
        retVideos = JSON.parse(prevVideos);
    }
    return retVideos;
}