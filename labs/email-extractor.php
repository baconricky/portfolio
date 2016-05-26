<?php /**/ ?><?php
set_include_path(
	get_include_path() . 
	PATH_SEPARATOR . '/usr/local/lib/php' . PATH_SEPARATOR . "/home/theharr/.pear/home/theharr/pear/php/"
);

include("SOAP/Client.php");

$google_key     = "ABQIAAAAg2WQIfghSw47ci0r3F_a4xQCh0J2O1gBTVoGWXLQMzOkS4ZU4hQB6jUOx-E-FbXhLZObkAAyXFjhGQ";
$google_url     = "http://ajax.googleapis.com/ajax/services/search/web";
$soapoptions    = array('namespace' => 'urn:GoogleSearch','trace' => 0);
$src_email      = isset($_REQUEST['src_email']) ? htmlspecialchars($_REQUEST['src_email']) : '';
?>

<form method="post">
  Please enter starting email address<br />
  <input type="text" name="src_email" size="65" value="<?php echo $src_email;  ?>"/>
  <hr />
  <input type="submit" value="Do Work" />
</form>

<?php
if (isset($_REQUEST['src_email']) && !empty($_REQUEST['src_email'])) 
{
	$results = google_search_api(array('q' => $_REQUEST['src_email']));

	print "<!--";
	print_r($results);
	print "-->";

	$responseData = $results->responseData;
	print "<table>";
	$email_arr = array();
	foreach($responseData->results as $result) {
		$getEmailsFromUrl = getEmailsFromUrl($result->url);
		if (is_array($getEmailsFromUrl)) {
			//print "<p>Merging...</p>";
			//print_r($getEmailsFromUrl);
			//print "<p>in to</p>";
			$email_arr += $getEmailsFromUrl;
			//print_r($email_arr);
		} else {
			//print "<em>Not an array...</em>";
		}
	}
	print "</table>";
	//print "<hr>";
	//print "<h1>All Emails</h1>";
	//print_r($email_arr);
	
} 
else 
{
    echo "<h1>Please enter an email address!</h1>";
}

function google_search_api($args, $referer = 'http://localhost/test/', $endpoint = 'web'){
	$url = "http://ajax.googleapis.com/ajax/services/search/".$endpoint;
 
	if ( !array_key_exists('v', $args) )
		$args['v'] = '1.0';
 
	$url .= '?'.http_build_query($args, '', '&');
 
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	// note that the referer *must* be set
	curl_setopt($ch, CURLOPT_REFERER, $referer);
	$body = curl_exec($ch);
	curl_close($ch);
	//decode and return the response
	return json_decode($body);
}

function getEmailsFromUrl($url) 
{
    // fetch data from specified url
    $text = file_get_contents($url);
    
    $hash = md5($text);
    
    echo "<tr><td>Source URL</td><td>".$url."</td></tr>";
    echo "<tr><td>MD5</td><td>".$hash."</td></tr>";

    // parse emails
    if (!empty($text)) {
        $res = preg_match_all("/[a-z0-9]+([_\\.-][a-z0-9]+)*@([a-z0-9]+([\.-][a-z0-9]+)*)+\\.[a-z]{2,}/i",$text,$matches);
        if ($res) {
            foreach(array_unique($matches[0]) as $email) {
                echo "<tr><td>".$email."</td>";
                
                $email_arr[] = $email;
                
                // take a given email address and split it into the username and domain.
                //Will move to separate process... eventually
                list($userName, $mailDomain) = split("@", $email);
                if (checkdnsrr($mailDomain, "MX")) {
	                echo "<td>Valid</td>";
                } else {
   	                echo "<td>Invalid</td>";
				}
            }
        } else {
		    echo "<tr><td colspan=2>No emails found.</td></tr>";
        }
    }
    else
    {
	    echo "<tr><td colspan=2>No text?</td></tr>";
    }
    echo "<tr><td colspan=2><hr></td></tr>";
	return ($email_arr);
}
?>