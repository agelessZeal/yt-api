<?php
/**
 * Created by PhpStorm.
 * User: BrightStone
 * Date: 9/14/2018
 * Time: 10:59 PM
 */

class YT
{
    private $yt_key = 'AIzaSyCRa8k7KtiWsh7zl0umIifi63DBwDk3t44';

    public function get_yt_info($id)
    {
        $url = "http://www.youtube.com/watch?v=" . $id;
        $youtube = "http://www.youtube.com/oembed?url=" . $url . "&format=json";
        $curl = curl_init($youtube);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $return = curl_exec($curl);
        curl_close($curl);
        return json_decode($return, true);
    }

    function get_detail_info($id)
    {
        $url = 'https://www.googleapis.com/youtube/v3/videos?id=' . $id . '&part=snippet,contentDetails';
        $url .= '&key=' . $this->yt_key;
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $return = curl_exec($curl);
        curl_close($curl);
        return json_decode($return, true);
    }

    public function get_quality($id)
    {
        parse_str(file_get_contents('http://www.youtube.com/get_video_info?video_id=' . $id), $video_data);
        $streams = $video_data['url_encoded_fmt_stream_map'];
        $streams = explode(',', $streams);
        $counter = 1;
        $qualityData = [];
        foreach ($streams as $streamdata) {
            $tmpObj = new StdClass();
            parse_str($streamdata, $streamdata);
            foreach ($streamdata as $key => $value) {
                if ($key == "url") {
                    $value = urldecode($value);
                }
                if ($key == 'type') {
                    $value = explode(';', $value);
                    $value = $value[0];
                }
                $tmpObj->$key = $value;
            }
            array_push($qualityData, $tmpObj);
            $counter = $counter + 1;
        }
        return $qualityData;
    }

    public function get_related_videos($id)
    {
        $url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=' . $id . '&type=video';
        $url .= '&key=' . $this->yt_key;
        $url .= '&maxResults=16';
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $return = curl_exec($curl);
        curl_close($curl);
        return json_decode($return, true);
    }

    public function get_duration_str($timeString)
    {

        $hr = 0;
        $hrStr = "";
        $minute = 0;
        $minuteStr = "";
        $seconds = 0;
        $secondsStr = "";

        $realTimeStr = substr($timeString, 2);
        $hrPos = strpos($realTimeStr, 'H');
        if ($hrPos !== false) {
            $hrStr = substr($realTimeStr, 0, $hrPos);
            $hr = (int)($hrStr);
            $realTimeStr = substr($realTimeStr, $hrPos + 1);
        }
        $minutePos = strpos($realTimeStr, 'M');
        if ($minutePos !== false) {
            $minuteStr = substr($realTimeStr, 0, $minutePos);
            $minute = (int)($minuteStr);
            $realTimeStr = substr($realTimeStr, $minutePos + 1);
        }
        $secondsPos = strpos($realTimeStr, 'S');
        if ($secondsPos !== false) {
            $secondsStr = substr($realTimeStr, 0, strlen($realTimeStr) - 1);
            $seconds = (int)($secondsStr);
        }
        $realTimeStr = "";
        if ($hr > 0) {
            if (strlen($hr) < 2) $hr = "0" . $hr;
            $realTimeStr .= $hr . "h:";
        }
        if ($minute > 0) {
            if (strlen($minute) < 2) $minute = "0" . $minute;
            $realTimeStr .= $minute . "m:";
        }
        if ($seconds > 0) {
            if (strlen($seconds) < 2) $seconds = "0" . $seconds;
            $realTimeStr .= $seconds . "s";
        }
        if ($realTimeStr == "") return "LIVE";
        return $realTimeStr;

    }
    public function get_created_at($createdTime){
        $date = DateTime::createFromFormat("Y-m-d\TH:i:s.u\Z", $createdTime);
        return $date->format('Y-m-d H:i');
    }

}

