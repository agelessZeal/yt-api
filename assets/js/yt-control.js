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

        if(typeof item != "undefined" && typeof item.contentDetails != "undefined") {
            var duration = getDuration(item.contentDetails.duration);

            var videoTag = '<div class="col-md-3 col-sm-4 col-xs-12">';
            videoTag += '<div class="yt-video-item" onclick="goToVideoView(this)" data-id="'+item.id+'">';
            videoTag += '<img src="' + item.snippet.thumbnails.medium.url + '">';
            videoTag += '<div class="video-content-title">' + item.snippet.title + "</div>";
            videoTag += '<div class="video-content-info">';
            videoTag += '<span>'+cutOffStr(item.snippet.channelTitle)+'</span> ,';

            if(item.hasOwnProperty('contentDetails')){
                videoTag += '<span class="video-duration">'+duration+'</span>, ';
            }

            videoTag += '<span class="video-created-at">'+isoDateStrParse(item.snippet.publishedAt)+'</span>';
            videoTag += '</div></div>';
            videoTag += '<button class="btn btn-primary add-to-fav-btn" onclick="saveFavoriteVideos(\''+ item.id +'\')">Add To Favorite</button>';
            videoTag += '</div>';
            $(videoTag).appendTo($(".yt-video-contents"));
        }

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
    for(var i=0; i<youtubeIDs.length;i++){
        setTimeout(function (i) {
            var fetchURL = 'https://www.googleapis.com/youtube/v3/videos?key=' + ytConf.key + '&part=contentDetails'+"&id="+youtubeIDs[i].id.videoId;
            $.getJSON(fetchURL, function (res) {
                var videoItems = [];
                if (res.hasOwnProperty('items') && res.hasOwnProperty('pageInfo')) {
                    videoItems = res.items[0];
                    console.log(youtubeIDs[i].snippet.title + youtubeIDs[i].snippet.thumbnails.medium.url);
                    if (typeof videoItems != "undefined" && typeof videoItems.contentDetails != "undefined") {
                        var duration = getDuration(videoItems.contentDetails.duration);
                        var videoTag = '<div class="col-md-3 col-sm-4 col-xs-12">';
                        videoTag += '<div class="yt-video-item" onclick="goToVideoView(this)" data-id="'+youtubeIDs[i].id.videoId+'">';
                        videoTag += '<img src="' + youtubeIDs[i].snippet.thumbnails.medium.url + '">';
                        videoTag += '<div class="video-content-title">' + youtubeIDs[i].snippet.title + "</div>";
                        videoTag += '<div class="video-content-info">';
                        videoTag += '<span>'+cutOffStr(youtubeIDs[i].snippet.channelTitle)+'</span> ,';
                        videoTag += '<span class="video-duration">'+duration+'</span>, ';
                        videoTag += '<span class="video-created-at">'+isoDateStrParse(youtubeIDs[i].snippet.publishedAt)+'</span>';
                        videoTag += '</div></div>';
                        videoTag += '<button class="btn btn-primary add-to-fav-btn" onclick="saveFavoriteVideos(\''+ youtubeIDs[i].id.videoId +'\')">Add To Favorite</button>';
                        videoTag += '</div>';
                        $(videoTag).appendTo($(".yt-video-contents"));
                    }
                }
            });
        },i*50,i);
    }

    $('#yt-video-loading').fadeOut(1200);

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
