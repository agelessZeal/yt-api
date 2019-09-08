var ytConf = {
    key: "AIzaSyCRa8k7KtiWsh7zl0umIifi63DBwDk3t44",
    maxResult: 40,
    total_result:0,
    chart: "mostPopular",
    part_search: "snippet",
    part_video: "snippet,contentDetails",
    api_search_point: "https://www.googleapis.com/youtube/v3/search",
    api_video_point: "https://www.googleapis.com/youtube/v3/videos",
    pageToken: "",
    regionCode: "US",
    region_code_api: "http://ip-api.com/json",
    prev_query: "",
    is_search: false,
    is_init:true,
    is_global:false,
};


function goToVideoView(video_id) {
    window.open('detail.php?video_id='+video_id+"&duration=",'_blank');
}

function onSearchYT() {

    var query = $('#search-box').val();
    if (ytConf.prev_query == query) return;

    ytConf.pageToken = "";
    ytConf.is_search = true;

    searchYTVideos(true,query, ytConf.chart);

}

function searchYTVideos(is_search, query = "", chart = "") {
    var fetchURL = "";
    if (is_search) {
        fetchURL += ytConf.api_search_point + "?key=" + ytConf.key + "&part=" + ytConf.part_search;
        if (query != "") fetchURL += "&q=" + query;
    } else {
        fetchURL += ytConf.api_video_point + "?key=" + ytConf.key + "&part=" + ytConf.part_video;
    }

    if (chart != "") fetchURL += "&chart=" + ytConf.chart;
    fetchURL += "&pageToken=" + ytConf.pageToken;
    fetchURL += "&maxResults=" + ytConf.maxResult;
    if(!ytConf.is_global){
        fetchURL += "&regionCode=" + getRegionCode();
    }

    $('#yt-video-loading').show();

    $.getJSON(fetchURL, function (res) {
        var videoItems = [];
        if (res.hasOwnProperty('items') && res.hasOwnProperty('pageInfo')) {
            videoItems = res.items;
            if(res.hasOwnProperty('nextPageToken')){
                ytConf.pageToken = res.nextPageToken;
            }else{
                ytConf.pageToken = "";
            }

        }
        if(videoItems.length<1 && ytConf.is_init){
            ytConf.is_global = true;
            searchYTVideos(false, "", ytConf.chart);
            return;
        }
        makeYTItem(query, videoItems);

        ytConf.prev_query = query;

        ytConf.is_init = false;

    });
}

function makeYTItem(query, ytItems) {

    if (ytConf.prev_query != query) {
        $(".yt-video-contents").html("");
    }
    if(ytConf.is_search){
        searchVideosFromIDS(ytItems);
    }

    ytItems.forEach(function (item) {

        var duration = getDuration(item.contentDetails.duration);

        var videoTag = '<div class="col-md-3 col-sm-4 col-xs-12">';
        videoTag += '<div class="yt-video-item" onclick="goToVideoView(\'' + item.id + '\',\''+duration+'\')">';
        videoTag += '<img src="' + item.snippet.thumbnails.medium.url + '">';
        videoTag += '<div class="video-content-title">' + item.snippet.title + "</div>";
        videoTag += '<div class="video-content-info">';
        videoTag += '<span>'+cutOffStr(item.snippet.channelTitle)+'</span> ,';

        if(item.hasOwnProperty('contentDetails')){
            videoTag += '<span>'+duration+'</span>, ';
        }

        videoTag += '<span>'+isoDateStrParse(item.snippet.publishedAt)+'</span>';
        videoTag += '</div>';
        videoTag += '</div></div>';
        $(videoTag).appendTo($(".yt-video-contents"));
    });
    $('#yt-video-loading').fadeOut(1200);
}

function getRegionCode() {
    var regionCode = localStorage.getItem('yt-app-region-code');
    if (typeof regionCode != "undefined" && regionCode != null) return regionCode;
    $.get(ytConf.region_code_api, function (res) {

        localStorage.setItem('yt-app-region-code', res.countryCode);
        console.log(res.country);// "United States"
        if(ytConf.is_init){
            searchYTVideos(false, "", ytConf.chart);
        }
        return res.countryCode;
    }, "jsonp");
}

function searchVideosFromIDS(youtubeIDs) {
    var fetchURL = 'https://www.googleapis.com/youtube/v3/videos?key=' + ytConf.key + '&part=contentDetails';
    for(var i=0; i<youtubeIDs.length;i++){
        setTimeout(function (i) {
            fetchURL += "&id="+youtubeIDs[i].id.videoId;
            $.getJSON(fetchURL, function (res) {
                var videoItems = [];
                if (res.hasOwnProperty('items') && res.hasOwnProperty('pageInfo')) {
                    videoItems = res.items[0];
                    console.log(youtubeIDs[i].snippet.title + youtubeIDs[i].snippet.thumbnails.medium.url);
                    var duration = getDuration(videoItems.contentDetails.duration);
                    var videoTag = '<div class="col-md-3 col-sm-4 col-xs-12">';
                    videoTag += '<div class="yt-video-item" onclick="goToVideoView(\'' + youtubeIDs[i].id.videoId + '\',\''+duration+')">';
                    videoTag += '<img src="' + youtubeIDs[i].snippet.thumbnails.medium.url + '">';
                    videoTag += '<div class="video-content-title">' + youtubeIDs[i].snippet.title + "</div>";
                    videoTag += '<div class="video-content-info">';
                    videoTag += '<span>'+cutOffStr(youtubeIDs[i].snippet.channelTitle)+'</span> ,';
                    videoTag += '<span>'+duration+'</span>, ';
                    videoTag += '<span>'+isoDateStrParse(youtubeIDs[i].snippet.publishedAt)+'</span>';
                    videoTag += '</div>';
                    videoTag += '</div></div>';
                    $(videoTag).appendTo($(".yt-video-contents"));
                }
            });
        },i*50,i);
    }

    $('#yt-video-loading').fadeOut(1200);

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
    return realTimeStr;
}


$('#search-box').keypress(function (event) {
    if (event.keyCode == 13) {
        onSearchYT();
    }
});

$('.yt-video-contents').on('scroll', function () {
    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
        if(ytConf.pageToken != ""){
            searchYTVideos(ytConf.is_search, ytConf.prev_query, ytConf.chart);
        }
    }
});

$( "#search-box" ).autocomplete({
    source: function( request, response ) {
        //console.log(request.term);
        var sqValue = [];
        $.ajax({
            type: "POST",
            url: "http://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&hjson=t&cp=1",
            dataType: 'jsonp',
            data: $.extend({
                q: request.term
            }, {  }),
            success: function(data){
                console.log(data[1]);
                obj = data[1];
                $.each( obj, function( key, value ) {
                    sqValue.push(value[0]);
                });
                response( sqValue);
            },

        });
    },
    select: function (event, ui) {
        $('#search-box').val(ui.item.value);
        onSearchYT();
        return false;
    },
});

//init Process
localStorage.clear();
getRegionCode();


$(window).resize(function () {
    pageResize();
});

function pageResize() {
    $('#yt-video-loading').width($('.yt-video-wrapper').width() - 30);
}
pageResize();
