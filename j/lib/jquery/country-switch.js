$(document).ready(function(){
		  
	var cookieCountry = $.cookie('LOCALE').substring(3);
	var country = '';
	switch (cookieCountry) {
		case 'AR': country = 'Argentina'
		break;
		case 'AU': country = 'Australia'
		break;
		case 'AT': country = 'Austria'
		break;
		case 'BD': country = 'Bangladesh'
		break;
		case 'BR': country = 'Brazil'
		break;
		case 'CA': country = 'Canada'
		break;
		case 'CL': country = 'Chile'
		break;
		case 'CN': country = 'China'
		break;
		case 'CO': country = 'Colombia'
		break;
		case 'CZ': country = 'Czech Republic'
		break;
		case 'DK': country = 'Denmark'
		break;
		case 'EC': country = 'Ecuador'
		break;
		case 'FL': country = 'Finland'
		break;
		case 'FR': country = 'France'
		break;
		case 'HK': country = 'Hong Kong'
		break;
		case 'IN': country = 'India'
		break;
		case 'ID': country = 'Indonesia'
		break;
		case 'IE': country = 'Ireland'
		break;
		case 'IL': country = 'Israel'
		break;
		case 'IT': country = 'Italy'
		break;
		case 'JP': country = 'Japan'
		break;
		case 'KR': country = 'Korea'
		break;
		case 'LT': country = 'Lithuania'
		break;
		case 'LU': country = 'Luxembourg'
		break;
		case 'MY': country = 'Malaysia'
		break;
		case 'MX': country = 'Mexico'
		break;
		case 'NL': country = 'Netherlands'
		break;
		case 'NZ': country = 'New Zealand'
		break;
		case 'NO': country = 'Norway'
		break;
		case 'PK': country = 'Pakistan'
		break;
		case 'PY': country = 'Paraguay'
		break;
		case 'PE': country = 'Peru'
		break;
		case 'PH': country = 'Philippines'
		break;
		case 'PT': country = 'Portugal'
		break;
		case 'RU': country = 'Russia'
		break;
		case 'PG': country = 'Singapore'
		break;
		case 'ZA': country = 'South Africa'
		break;
		case 'ES': country = 'Spain'
		break;
		case 'LK': country = 'Sri Lanka'
		break;
		case 'SE': country = 'Sweden'
		break;
		case 'CH': country = 'Switzerland'
		break;
		case 'TW': country = 'Taiwan'
		break;
		case 'TH': country = 'Thailand'
		break;
		case 'AE': country = 'UAE'
		break;
		case 'GB': country = 'United Kingdom'
		break;
		case 'US': country = 'United States'
		break;
		case 'UY': country = 'Uruguay'
		break;
		case 'VE': country = 'Venezuela'
		break;
		case 'VN': country = 'Vietnam'
		break;
	}
	$('#showCountryLang_a').html(country);
	
});