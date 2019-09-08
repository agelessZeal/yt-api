<?php
/**
 * Created by PhpStorm.
 * User: BrightStone
 * Date: 9/14/2018
 * Time: 10:59 PM
 */

require_once "YT.php";

$video_id = "";
$duration = "";
$qualities = null;
$video_info = null;
$created_at = "";
$related_videos = null;

if (!empty($_GET['id']))

    $video_id = $_GET['id'];
    $yt = new YT();

    $video_info = $yt->get_detail_info($video_id);

    $video_info = $video_info['items'][0];

    $qualities = $yt->get_quality($video_id);
    $related_videos = $yt->get_related_videos($video_id);

    $duration = $yt->get_duration_str($video_info['contentDetails']['duration']);
    $created_at = $yt->get_created_at($video_info['snippet']['publishedAt']);

    if(array_key_exists('items',$related_videos)){
        $related_videos = $related_videos['items'];
    };

?>
<!DOCTYPE html>
<html lang="en-us">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <meta name="apple-touch-fullscreen" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="format-detection" content="telephone=no">
    <title>YT-APP</title>
    <link rel="stylesheet" href="assets/css/bootstrap.css">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css" type="text/css"/>

    <link rel="stylesheet" href="assets/plugins/spinners.css">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="container">
    <a class="btn btn-primary my-fav-btn" href="favorite.php">My Favorite</a>
    <a class="btn btn-warning my-history-btn" href="history.php">My History</a>
    <div class="yt-search-form" style="display: none">
        <div class="row">
            <div class="col-xs-9">
                <input class="form-control" id="search-box" placeholder="Search Videos...">
            </div>
            <div class="col-xs-3">
                <button class="btn btn-success" id="search-btn" onclick="onSearchYT()">FIND</button>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="yt-video-wrapper">
            <div class="spinner-container" id="yt-video-loading">
                <div class="loader loader-4"></div>
            </div>
            <?php
            if ($video_info != null) { ?>
                <div class="yt-video-details">
                    <img src="<?= $video_info['snippet']['thumbnails']['medium']['url'] ?>">
                    <p><span class="video-detail-title">Title : </span><?= $video_info['snippet']['title'] ?></p>
                    <p><span class="video-detail-owner">Owner : </span><?= $video_info['snippet']['channelTitle'] ?>, <span
                                class="video-detail-duration">Duration : </span><?= $duration ?></p>
                    <p><span class="video-detail-publish">Created at : </span><?= $created_at ?></p>
                    <?php foreach ($qualities as $qt) {  ?>
                        <?php if(property_exists($qt,'quality')) { ?>
                            <button class="btn btn-success video-quality-label" onclick='goToStream("<?= ($qt->url) ?>","<?= $qt->type ?>")'>
                                <?= $qt->itag ?>-<?= $qt->quality ?>
                                <?php if($qt->type=='video/mp4' || $qt->type == 'video/webm' || $qt->type == 'video/ogg') {
                                    echo " View";
                                } else {
                                    echo " Download";
                                } ?>
                            </button>
                        <?php } ?>
                    <?php } ?>
                    <?php  if($duration=='LIVE') { ?>
                        <button class="btn btn-success video-quality-label" onclick="goToYTLive('<?= $video_id ?>')"><?= $duration ?></button>
                    <?php } ?>
                </div>
                <hr>
                <div class="related-videos">
                    <?php
                    foreach ($related_videos as $rv): ?>
                        <div class="related-video-items" onclick="goToVideoView(this)" data-id="<?= $rv['id']['videoId'] ?>">
                            <div class="row">
                                <div class="col-xs-6" style="padding-right: 0">
                                    <img src="<?= $rv['snippet']['thumbnails']['medium']['url'] ?>">
                                </div>
                                <div class="col-xs-6">
                                    <h5><?= $rv['snippet']['title'] ?></h5>
                                    <p><?= (strlen($rv['snippet']['channelTitle'])>10)?substr($rv['snippet']['channelTitle'],0,10).'...':$rv['snippet']['channelTitle']; ?></p>
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-primary add-to-fav-btn" onclick="saveFavoriteVideos('<?= $rv['id']['videoId']  ?>')">Add To Favorite</button>
                    <?php endforeach;?>
                </div>
            <?php } else { ?>
                <p style="font-weight: bold;font-size: 20px">No Video Info</p>
            <?php } ?>
        </div>
    </div>
</div>

<script type="text/javascript" src="assets/js/jquery-1.10.2.min.js"></script>
<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js" type="text/javascript"></script>
<script type="text/javascript" src="assets/js/bootstrap.js"></script>
<script type="text/javascript" src="assets/js/my-lib.js"></script>
<script type="text/javascript" src="assets/js/yt-view.js"></script>
</body>
</html>

