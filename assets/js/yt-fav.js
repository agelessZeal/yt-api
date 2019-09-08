var ytConf = {
    key: "AIzaSyCRa8k7KtiWsh7zl0umIifi63DBwDk3t44",
    part_video: "snippet,contentDetails",
    api_video_point: "https://www.googleapis.com/youtube/v3/videos",
};
function makeFavoriteVideos() {
    var favVideos = getFavVideos();
    favVideos.forEach(function (item) {
        setTimeout(function () {
            var fetchURL = ytConf.api_video_point + "?key=" + ytConf.key + "&part=" + ytConf.part_video+"&id="+item;
            $.getJSON(fetchURL, function (res) {
                var videoItems = [];
                if (res.hasOwnProperty('items') && res.hasOwnProperty('pageInfo')) {
                    videoItems = res.items;
                }
                makeFavVideoTags(videoItems)
            });
        },50,item);
    })
}

function makeFavVideoTags(item) {
    if(item.length == 0) return;
    item = item[0];
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
    videoTag += '</div>';
    videoTag += '</div></div>';
    $(videoTag).appendTo($(".yt-video-contents"));

}

makeFavoriteVideos();