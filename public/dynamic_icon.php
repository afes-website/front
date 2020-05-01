<?php

$ua = $_SERVER['HTTP_USER_AGENT'];

if (strpos($ua, 'Android') !== false) {
  echo '<link rel="apple-touch-icon" type="image/png" sizes="180x180" href="android-touch-icon.png" />';
}
if (strpos($ua, 'iPhone') !== false || strpos($ua, 'iPad') !== false) {
  echo '<link rel="apple-touch-icon" type="image/png" sizes="180x180" href="apple-touch-icon.png" />';
}
