<?php
set_include_path(
	get_include_path() . 
	PATH_SEPARATOR . '/usr/local/lib/php' . PATH_SEPARATOR . "/home/theharr/.pear/home/theharr/pear/php/"
);

include("SOAP/Client.php");

class ProspecktorUser
{
    //use openID
}


class Search 
{
    var $searchArgs;
    var $searchProvider;
    
    function Search($searchArgs, $searchProvider='google') 
    {
        $this->searchArgs = $searchArgs;
        $this->searchProvider = $searchProvider;
    }

    function setSearchArgs($args) 
    {
        $this->searchArgs = $args;
    }
    
    function getSearchArgs() 
    {
        return $this->searchArgs;
    }
    
    function setSearchProvider($args) 
    {
        $this->searchProvider = $args;
    }
    
    function getSearchProvider() 
    {
        return $this->searchProvider;
    }

    function search_api()
    {
        $referer = 'http://localhost/test/';
        $args = $this->getSearchArgs();
     
        if ( !array_key_exists('v', $args) )
            $args['v'] = '1.0';
     
        $this->search_url .= '?'.http_build_query($args, '', '&');
     
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->search_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        // note that the referer *must* be set
        curl_setopt($ch, CURLOPT_REFERER, $referer);
        $body = curl_exec($ch);
        curl_close($ch);
        //decode and return the response
        return json_decode($body);
    }
}

class Google extends Search 
{
    var $dev_key = "ABQIAAAAg2WQIfghSw47ci0r3F_a4xQCh0J2O1gBTVoGWXLQMzOkS4ZU4hQB6jUOx-E-FbXhLZObkAAyXFjhGQ";
    var $search_url = "http://ajax.googleapis.com/ajax/services/search/web";
}

class Twitter extends Search 
{
    var $dev_key = "";
    var $search_url = "http://search.twitter.com/search.atom";
}

class LinkedIn extends Search 
{
    var $dev_key = "";
    var $search_url = "";
}

class Yahoo extends Search 
{
    var $dev_key = "";
    var $search_url = "";
}

class Bing extends Search 
{
    var $dev_key = "C00C84CF326E9C30BC1A8DCA1370C890823C160E";
    var $search_url = "http://api.search.live.net/json.aspx";
}

class AdNetwork
{
    var $some_key = "1";
}

class GoogleAdWords extends AdNetwork
{
    var $url = "http://google.com";
}

class BingAds extends AdNetwork
{
    var $url = "http://google.com";
}

class ProcessDocument
{
    var $arrDocEmails;
    
    function getKeywords($strUrl)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_URL, $strUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        // note that the referer *must* be set
        curl_setopt($ch, CURLOPT_REFERER, $referer);
        $head = curl_exec($ch);
        curl_close($ch);
        //decode and return the response
        print "<hr />\n<pre>\n";
        print_r($head);
        print "</pre>\n<hr />\n";
        return $head;
    }
	
    function getEmailsFromDoc($strDocURL) 
    {
        // fetch data from specified url
        $strFileContents = file_get_contents($strDocURL);
        $hFileId = md5($strFileContents);
        
        print "<!-- Source URL: ".$strDocURL." -->\n";
        print "<!-- MD5: ".$hFileId." -->\n\n";

        // parse text to find email address and other info
        if (!empty($strFileContents)) 
		{
			//find email addresses
            $nPregResultCount = preg_match_all("/[a-z0-9]+([_\\.-][a-z0-9]+)*@([a-z0-9]+([\.-][a-z0-9]+)*)+\\.[a-z]{2,}/i",$strFileContents,$matches);
            if ($nPregResultCount) 
			{
                foreach(array_unique($matches[0]) as $foundEmail) {
                    //take a given email address and split it into the username and domain.
                    /*
                    list($userName, $mailDomain) = split("@", $foundEmail);
                    if (checkdnsrr($mailDomain, "MX")) 
					{
				        print "<!-- email: ".$foundEmail." -->\n";
                        $this->arrDocEmails[] = $foundEmail;
                    }
					*/
					//here is a good place to put the domain in a table so we can get more info
                    $strHeadOfDoc = ProcessDocument::getKeywords($mailDomain);
                    print "<hr />\n<pre>\n";
                    print_r($strHeadOfDoc);
                    print "</pre>\n<hr />\n";
                }
            } 
        }
		return $this->arrDocEmails;
    }
}

class Prospeckt
{
	var $person;
	var $domain;
	
	function Prospeckt($args) 
	{
		$this->setPerson($args->person);
		$this->setDomain($args->domain);
	}
	
	function getPerson() 
	{
		return $this->person;
	}
	function setPerson($args) 
	{
		$this->person = new ProspecktPerson($args);
	}

	function getDomain() 
	{
		return $this->domain;
	}
	function setDomain($args) 
	{
		$this->domain = new ProspecktDomain($args);
	}
}

class ProspecktSocialMap
{
	var $socialId;
	var $networkName;
	var $devKey;

  	function ProspecktSocialMap($args)
	{
		$this->setSocialId($args->socialId);
		$this->setNetworkName($args->networkName);
		$this->setDevKey($args->devKey);
	}
    
	function setSocialId($arg)
	{
		$this->socialId = $arg;
	}
	function setNetworkName($arg)
	{
		$this->networkName = $arg;
	}
	function setDevKey($arg)
	{
		$this->devKey = $arg;
	}
}

class ProspecktSocial
{
	var $personId;
	var $socialId;

	function ProspecktSocial($args)
	{
		$this->setPersonId($args->personId);
		$this->setSocialId($args->socialId);
	}
    
	function setPersonId($arg)
	{
		$this->personId = $arg;
	}
    
	function setSocialId($arg)
	{
		$this->socialId = $arg;
	}
}

class ProspecktPerson
{
	var $personId;
	var $email;
	var $firstName;
	var $lastName;
	
	function ProspecktPerson($args)
	{
		$this->setPersonId($args->personId);
		$this->setEmail($args->email);
		$this->setFirstName($args->firstName);
		$this->setLastName($args->lastName);
	}
	
	function setPersonId($arg)
	{
		$this->personId = $arg;
	}
	function setEmail($arg)
	{
		$this->email = $arg;
	}
	function setFirstName($arg)
	{
		$this->firstName = $arg;
	}
	function setLastName($arg)
	{
		$this->lastName= $arg;
	}
}

class ProspecktDomainKeywordMap
{
	var $keywordId;
	var $keyword;

  	function ProspecktDomainKeywordMap($args)
	{
		$this->setKeywordId($args->keywordId);
		$this->setkeyword($args->keyword);
	}
	function setKeywordId($arg)
	{
		$this->keywordId= $arg;
	}
	function setkeyword($arg)
	{
		$this->keyword= $arg;
	}
}	

class ProspecktDomain
{
	var $domainId;
	var $domainName;
	var $valid;

  	function ProspecktDomain($args)
	{
		$this->setDomainId($args->domainId);
		$this->setDomainName($args->domainName);
		$this->setValid($args->valid);
	}
	
	function setDomainId($arg)
	{
		$this->domainId = $arg;
	}
	function setDomainName($arg)
	{
		$this->domainName = $arg;
	}
	function setValid($arg)
	{
		$this->valid = $arg;
	}
}

class ProspecktFile
{
	var $fileId;
	var $fileHash;
	var $processedDate;

  	function ProspecktFile($args)
	{
		$this->setFileId($args->fileId);
		$this->setFileHash($args->fileHash);
		$this->setProcessedDate($args->processedDate);
	}
	
	function setFileId($arg)
	{
		$this->fileId = $arg;
	}
	function setFileHash($arg)
	{
		$this->fileHash = $arg;
	}
	function setProcessedDate($arg)
	{
		$this->processedDate = $arg;
	}
}

class Prospecktor
{
    var $args;
    var $prospects;
    
	function getProspects() 
	{
		return $this->prospects;
	}
    function Prospecktor($args) 
    {
        $this->args = $args;
        $this->process();
    }
    
    function process()
    {
		//get documents from google
        $google = new Google($this->args);
        $searchResults = $google->search_api()->responseData->results;

		$result = array();
		//go thru each document and fetch email address info
        foreach($searchResults as $searchResult) 
		{
			//go thru each result and process
		    $arrEmailsFromDoc = ProcessDocument::getEmailsFromDoc($searchResult->url);
			$result = array_merge($result, $arrEmailsFromDoc);

        }
		$this->prospects = $result;
    } 
}
?>


<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <?php 
			if (array_key_exists('src_email',$_POST))
            {
		     	echo "<title>Prospecktor : ".$_POST[src_email]."</title>\n";
			} 
			else 
			{
		     	echo "<title>Prospecktor : Welcome</title>\n";
			}
		?>
        <link rel="stylesheet" href="style.css" type="text/css" />
        <link rel="stylesheet" href="style.css" type="text/css" />
        <link rel="shortcut icon" href="favicon.ico" />
        <script src="http://cdn.jquerytools.org/1.2.5/jquery.tools.min.js" type="text/javascript"></script>
    </head>
    <body>
        <form method="post" id="prospecktor">
            <fieldset>
                <legend>Your details</legend>
                <ol>
                    <li>
                        <label for="src_email">Email:</label>
                        <input id="src_email" name="src_email" type="text" placeholder="First and last name" required autofocus />
                    </li>
                </ol>
            </fieldset>
            <fieldset>
                <button type="submit">Do Work</button>
            </fieldset>
        </form>
        <hr />
        <?php 
            $arrProspects = array();
			if (array_key_exists('src_email',$_POST)) 
			{
                $args = array('q' => $_POST['src_email']);
                $Prospecktor = new Prospecktor($args);
				$arrProspects = $Prospecktor->getProspects();
				$nProspects = count($arrProspects);
				print "<h3>I found ". $nProspects ." Prospects from ".$_POST['src_email']."</h3>";
				
			}
		?>
        <hr />
        <div class="showProspects">
        	<table>
        	<?php
				
		        foreach($arrProspects as $prospect) 
				{
					print "<tr><td>$prospect</td></tr>";
				}
			?>
            </table>
        </div>
    </body>
</html>