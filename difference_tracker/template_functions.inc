<?php
function difference_tracker_string_decode($text) {

    return str_replace(array('&lt;', '&gt;', '=&quot;', '%3D', '%26'),
                       array('<', '>', '="', '&', '#'),
                       ($text));
  // else {
  //   return str_replace('%2F', '/', urlencode($text));
  // }
}