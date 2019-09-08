<?php
/**
 * Created by PhpStorm.
 * User: BrightStone
 * Date: 9/14/2018
 * Time: 10:59 PM
 */
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
            <div class="yt-video-contents">
            </div>
        </div>
    </div>
</div>

<script type="text/javascript" src="assets/js/jquery-1.10.2.min.js"></script>
<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js" type="text/javascript"></script>
<script type="text/javascript" src="assets/js/bootstrap.js"></script>
<script type="text/javascript" src="assets/js/my-lib.js"></script>
<script type="text/javascript" src="assets/js/yt-fav.js"></script>
</body>
</html>

