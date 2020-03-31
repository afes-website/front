<?php
$overwrite_image = null;
function main() {
  global $overwrite_image;
  $type = $_SERVER["REQUEST_URI"]==='/' ? 'website' : 'article';
  echo "<head prefix=\"og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# {$type}: http://ogp.me/ns/{$type}#\">";

  $title = get_title($_SERVER["REQUEST_URI"]);
  echo "<title>{$title}</title>";

  if (!should_support_ogp()) return;
  print_meta('og:title', $title);
  print_meta('og:type', $type);

  print_meta('og:url', 'https://afes.info' . $_SERVER["REQUEST_URI"]);

  $image = 'https://afes.info/img/thumbnail.jpg';
  if ($overwrite_image !== null)$image = $overwrite_image;
  print_meta('og:image', $image);

  // below are static ogp tags
  print_meta('og:site_name', '73rd AFes');
  print_meta('og:longitude', '35.65438888');
  print_meta('og:latitude', '139.72733333');
  print_meta('og:street-address', 'Moto-Azabu 2-3-29');
  print_meta('og:locality', 'Minato-ku');
  print_meta('og:region', 'Tokyo');
  print_meta('og:postal-code', '106-0046');
  print_meta('og:country-name', 'Japan');
  print_meta('og:email', 'contact@afes.info');
  print_meta('og:description',
    '第73回麻布学園文化祭公式ウェブサイトです。2020年6月12日～14日に開催予定。当日の展示に関する情報や、日々の活動の様子などを掲載しています。');
}

function should_support_ogp() {
  // User Agent Data from https://crieit.net/posts/OGP-Twitter-LINE-8
  switch ($_SERVER['HTTP_USER_AGENT']) {
    case 'Twitterbot/1.0':
    case 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)':
    case 'facebookexternalhit/1.1;line-poker/1.0':
    case 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.4 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0':
    case 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)':
    case 'Mozilla/5.0 (Windows NT 6.1; WOW64) SkypeUriPreview Preview/0.5':
    case 'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)':
    case 'Mozilla/5.0 (compatible; PlurkBot/1.0; +https://www.plurk.com/) Firefox/61.0':
      return true;
  }
  return false;
}

function print_meta($key, $value) {
  echo "<meta property=\"{$key}\" content=\"{$value}\">";
}

function get_blog_title($id) {
  $api_base_url = 'https://api.afes.info';

  $context = stream_context_create(array(
    'http' => array('ignore_errors' => true)
  ));

  $res = file_get_contents($api_base_url . '/blog/articles/' . $id, false, $context);
  if (strpos($http_response_header[0], '200') === false)return '';
  return json_decode($res)->title;
}

function get_blog_category_name($id) {
  $categories = [
    "news" => "お知らせ",
    "general" => "文実全体",
    "workTeam" => "分科局",
    "exh" => "展示団体",
    "contrib" => "個人･寄稿",
    "internal" => "内部生向け",
  ];
  return $categories[$id];
}

function get_title($uri) {
  $title = '';
  if (should_support_ogp())
    $title = _get_title($uri);
  $common_suffix = '第73回麻布中学校･高等学校文化祭';
  if($title === '' || $title === null)return $common_suffix;
  return $title . ' - ' . $common_suffix;
}

function starts_with($str, $needle) {
  return substr($str, 0, strlen($needle)) === $needle;
}

function _get_title($uri) {
  global $overwrite_image;
  if(substr($uri, -1)==='/') // cut trailing '/'
    $uri = substr($uri, 0, -1);
  switch ($uri) {
    case '': // trailing '/' is cut
      return '';
    case '/about':
      $overwrite_image = get_img('about.jpg');
      return '学校長・委員長挨拶';
    case '/access':
      return 'アクセス';
    case '/contact':
      return 'お問い合わせ';
    case '/policy':
      return 'プライバシーポリシー';
    case '/document':
      return '資料庫';
    case '/blog':
      return '近況 記事一覧';
    // Admin routes are disabled
    // case '/blog/admin':
    //   return 'ブログ管理';
    // case '/blog/admin/post':
    //   return '記事投稿/編集';
    // case '/blog/admin/paths':
    //   return '記事一覧';
    // case '/blog/admin/revisions':
    //   return 'あなたの記事リクエスト一覧';
  }
  // below are dynamic routes

  if (starts_with($uri, '/blog/')) {
    $parts = explode('/', $uri);
    if (count($parts) == 3) { // category
      return get_blog_category_name($parts[2]) . ' 記事一覧';
    } else if(count($parts) == 4) { // article
      return get_blog_title($parts[3]);
    }
  }

  // Admin routes are disabled
  // if(starts_with($uri, '/blog/admin/paths/:id')) {}
  // if(starts_with($uri, '/blog/admin/revisions/')) {}
  return '';
}

function get_img($filename) {
  $dpos = strrpos($filename, '.');
  $fn = substr($filename, 0, $dpos);
  $ext = substr($filename, $dpos+1);
  foreach(glob(__DIR__ . '/img/' . "{$fn}.*.{$ext}") as $file){
    if(is_file($file)){
        return 'https://afes.info/img/' . basename($file);
    }
  }
  return null;
}

main();
