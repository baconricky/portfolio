var hideLabels = (window.location.pathname.indexOf('/forms/generic-') == 0);
var unmasked = false;

var intval = window.setInterval(function(){
	if (document.body) {
		if (!unmasked) {
			var mask = document.createElement('div');
			mask.setAttribute('id', 'mask');
			document.body.appendChild(mask);
		}

		window.clearInterval(intval);
	}
}, 10);

if (hideLabels) {
	var style = document.createElement('style');
	style.setAttribute('type', 'text/css');
	var styleDef = '.elqLayout td.LayoutTableRowStart { display: none !important; }';
	if (style.styleSheet) {
		style.styleSheet.cssText = styleDef;
	} else {
		style.appendChild(document.createTextNode(styleDef));
	}
	document.getElementsByTagName("head")[0].appendChild(style);
}

if (typeof eloquaConfig != 'object') {
	eloquaConfig = {};
}

var addEvent = function( obj, type, fn ) {
	if (obj.addEventListener) {
		obj.addEventListener(type, fn, false);
	} else if (obj.attachEvent) {
		obj.attachEvent('on' + type, function() { return fn.apply(obj, new Array(window.event));});
	}
}

var findAncestor = function(el, nodeName) {
	while (el.tagName != nodeName && el.parentNode) {
		el = el.parentNode;
	}
	if (el.tagName == nodeName){
		return el;
	}
}

var getFieldLabels = function(fieldEl) {
	var tr = findAncestor(fieldEl, 'TR');

	if (tr) {
		var labels = getChildrenWithClassName( tr, "elqLabel" );
		return labels;
	} else {
		return [];
	}
}
var getChildrenWithClassName = function(el, className) {
	if (typeof el.getElementsByClassName == 'function') {
	   return el.getElementsByClassName(className);
	} else {
	   var els = [];
	   if (typeof el.childNodes != 'undefined') {
		for (var i=0; i<el.childNodes.length; i++) {
		   var matches = getChildrenWithClassName(el.childNodes[i], className);
		   for (var j=0; j<matches.length; j++) {
			els.push( matches[j] );
		   }
		}
	   }
	   if (el.className) {
		var classes = el.className.split(/\s+/);
		for (var i=0; i<classes.length; i++) {
		   if (className == classes[i]) {
			els.push(el);
			break;
		   }
		}
	   }
	   return els;
	}
}
var findTextNodes = function(root) {
	var textNodes = [];
	if (!root) {
		return textNodes;
	} else if (root.nodeType == 3) {
		if (root.nodeValue && root.nodeValue.replace(/(^\s|\s$)/g, '')) {
			textNodes.push(root);
		}
	} else if (root && root.childNodes) {
		var nodes = root.childNodes;
		for (var i=0; i<nodes.length; i++) {
			textNodes = textNodes.concat( findTextNodes(nodes[i]) );
		}
	}
	return textNodes;
};
var firstText = function(el) {
	var nodes = findTextNodes(el);
	if (nodes && nodes.length) {
		return nodes[0].nodeValue;
	} else {
		return '';
	}
};
var trim = function(str) {
	return str.replace(/(^\s+|\s+$)/g, '');
};

var HelperText = function(field, text) {
	var h = {
		className : 'helperText',
		el : field,
		helperText : text,
		init : function() {
			var that = this;
			addEvent(this.el, 'focus', function() {
				that.focus();
			});
			addEvent(this.el, 'blur', function() {
				that.blur();
			});
			addEvent(this.el, 'change', function() {
				that.blur();
			});
			this.blur();
		},
		focus : function() {
			if (this.el.value == this.helperText) {
				this.el.value = '';
				this.toggleClass(false);
			}
		},
		blur : function() {
			this.toggleClass();
			if (this.el.value == '') {
				this.el.value = this.helperText;
			}

		},
		toggleClass : function(on) {
			var classes = this.el.className.split(/ +/);

			for (var i=0; i<classes.length; i++) {
				if (classes[i] == this.className) {
					classes.splice(i--, 1);
				}
			}

			if (on === true || (on !== false && !this.hasUserValue())) {
				classes.push(this.className);
			}

			var newClassName = classes.join(' ');
			this.el.setAttribute('class', newClassName);
			this.el.setAttribute('className', newClassName);
		},
		hasUserValue : function() {
			return this.el.value != '' && this.el.value != this.helperText;
		},
		clear : function() {
			this.el.value = '';
		}
	};

	return h;
}

var GenericForm = function(form, config) {
	if (!config) {
		config = {};
	}

	return {
		routingFields : [],
		params : config.queryStringParams || {},
		init : function() {
			var fields = form.elements;
			this.helpers = [];

			if (config.hideLabels) {
				for (var i=0; i<fields.length; i++) {
					var className = fields[i].className;
					if (className && className.match(/\belqField\b/) && fields[i].nodeName != 'SELECT') {
						var labels = getFieldLabels(fields[i]);

						var label = trim(firstText(labels[0]));
						var isRequired = trim(firstText(labels[labels.length-1])) == '*';

						var helperText = (isRequired ? '*' : '') + label;

						var h = new HelperText(fields[i], helperText);
						h.init();
						this.helpers.push(h);
					}
				}
			}

			if ('generic-newsletter' == form.name) {
				this.routingFields = ['query_Type','Focus','query_SuperRegion','query_Country'];
			} else if ('generic-contact' == form.name) {
				this.routingFields = ['query_Type','query_SuperRegion','query_Country'];
			}

			this.addListeners();

		},
		addListeners : function() {
			var that = this;
			var _onsubmit = (function(){ return form.onsubmit }());
			form.onsubmit = function() {

				// derive super region
				var country_code = that.getValue('query_Country');
				if (country_code) {
					var superRegion = SUPER_REGION_LOOKUP[country_code];
					if (superRegion) {
						that.setValue('query_SuperRegion', superRegion);
					}
				}

				var routing = [];
				for (var i=0; i<that.routingFields.length; i++) {
					routing.push(that.getValue(that.routingFields[i]) || '');
				}
				that.setValue('Routing', routing.join('|'));

				if (config.hideLabels) {
					for (var i=0; i<that.helpers.length; i++) {
						if (!that.helpers[i].hasUserValue()) {
							that.helpers[i].clear();
						}
					}
					if (typeof _onsubmit == 'function') {
						var success = _onsubmit.apply(form);
						if (!success) {
							for (var i=0; i<that.helpers.length; i++) {
								if (!that.helpers[i].hasUserValue()) {
									that.helpers[i].blur();
								}
							}
						}

						return success;
					}
				} else if (typeof _onsubmit == 'function') {
					return _onsubmit.apply(form);
				}
			};
		},
		getValue : function(fieldName) {
			var field = form[fieldName];

			if (field) {
				if (field.length) {
					for (var i=0; i<field.length; i++) {
						if (field[i].type == 'radio' && field[i].checked) {
							return field[i].value;
						}
					}
				} else {
					return form[fieldName].value;
				}
			}
		},
		setValue : function(fieldName, value) {
			var field = form[fieldName];

			if (field) {
				if (field.type == 'radio') {
					for (var i=0; i<field.length; i++) {
						if (value == field[i].value) {
							field[i].setAttribute('checked', 'checked');
						}
					}
				} else {
					form[fieldName].value = value;
				}
			}
		}
	};
}

var js18nConfig = {bundlePath: '/j/js18n-bundles'};

addEvent(window, 'load', function(){
	var bundle = "messages";
	var srcLang = "en";

	var params = {};
	if (window.location.search && window.location.search.length > 1) {
		var qs = window.location.search.substring(1);
		var parts = qs.split(/&/);
		for (var i=0; i<parts.length; i++) {
			var pieces = parts[i].split(/=/);
			params[ pieces[0] ] = pieces[1];
		}
	}

	var destLang = 'en';

	if (params.Language) {
		destLang = params.Language.toLowerCase();
	} else if (typeof lang == 'string' && lang) {
		destLang = lang.toLowerCase();
	}

	var body_id = document.body.getAttribute('id');
	var isConfirmationPage = body_id && body_id.match(/^thank-you-/);

	if (!isConfirmationPage) {
		var theForm = document.forms[0];
		var formConfig = {
			queryStringParams : params,
			hideLabels : hideLabels
		};

		if (theForm && theForm.name == 'generic-newsletter') {

			// add the focus fields
			var box = function(name, value, labelText, checked) {
				var rdo;
				try {
					rdo = document.createElement('<input type="radio" name="' + name + '" value="' + value + '" ' + (checked?'checked="checked"':'') + '/>');
				} catch(err) {
					rdo = document.createElement('input');
				}
				rdo.setAttribute('type', 'radio');
				rdo.setAttribute('name', name);
				rdo.setAttribute('value', value);

				if (checked) {
					rdo.setAttribute('checked', 'checked');
				}
				var label = document.createElement('label');
				label.appendChild(rdo);
				label.appendChild(document.createTextNode(labelText));
				return label;
			}
			var div = document.createElement('div');
			var lbl = document.createElement('label');
			var strong = document.createElement('strong');
			strong.appendChild(document.createTextNode('Your focus:'));
			lbl.appendChild(strong);
			lbl.appendChild( document.createElement('br') );
			div.appendChild(lbl);
			div.appendChild(box("Focus", "Business", "Business", true));
			div.appendChild(box("Focus", "Technical", "Technical"));

			// TODO: support per-newsletter languages
			if (destLang != 'en') {
				var langNote = document.createElement('p');
				langNote.setAttribute('class', 'note');
				langNote.appendChild( document.createTextNode('(English only)') );
				document.getElementById("MainDiv").insertBefore(langNote, document.getElementById("ContainerDiv0"));
			}

			document.getElementById("MainDiv").insertBefore(div, document.getElementById("ContainerDiv1"));
			document.getElementById("MainDiv").removeChild(document.getElementById('Focus'));
		}
	}

	var unmask = function() {
		var mask = document.getElementById('mask');
		if (mask) {
			document.body.removeChild(mask);
		}
		unmasked = true;
	}

	if (srcLang != destLang) {
		js18n.convert(document.body, ['messages'], srcLang, destLang, function(src, dest){
			if (!isConfirmationPage) {
				var form = new GenericForm(theForm, formConfig);
				form.init();

				var msg = 'Please fill out all fields marked in red.';
				eloquaConfig.errorMessageText = js18n.convertTerm(msg, src, dest) || msg;
			}

			unmask();
		});
	} else if (!isConfirmationPage) {
		var form = new GenericForm(theForm, formConfig);
		form.init();
		unmask();
	} else {
		unmask();
	}
});

var SUPER_REGION_LOOKUP = function(){
	var data = {
		'APAC' : ['AS','AU','BD','BN','BT','CC','CK','CN','CX','FJ','FM','HK','HM','ID','IN','IO','JP','KH','KI','KP','KR','LA','LK','MH','MM','MN','MO','MP','MV','MY','NF','NP','NR','NU','NZ','PG','PH','PK','PN','PW','SB','SG','TF','TH','TK','TL','TO','TP','TV','TW','VN','VU','WF','WS'],
		'EMEA' : ['AD','AE','AF','AL','AM','AO','AQ','AT','AX','AZ','BA','BE','BF','BG','BH','BI','BJ','BV','BW','BY','CD','CF','CG','CH','CI','CM','CS','CV','CY','CZ','DE','DJ','DK','DZ','EE','EG','EH','ER','ES','ET','FI','FO','FR','FX','GA','GB','GE','GG','GH','GI','GL','GM','GN','GP','GQ','GR','GW','HR','HU','IE','IL','IM','IQ','IR','IS','IT','JE','JO','KE','KG','KM','KW','KZ','LB','LI','LR','LS','LT','LU','LV','LX','LY','MA','MC','MD','ME','MG','MK','ML','MQ','MR','MT','MU','MW','MZ','NA','NC','NE','NG','NL','NO','OM','PF','PL','PS','PT','QA','RE','RO','RS','RU','RW','SA','SC','SD','SE','SH','SI','SJ','SK','SL','SM','SN','SO','ST','SY','SZ','TD','TG','TJ','TM','TN','TR','TZ','UA','UG','UZ','VA','YE','YT','ZA','ZM','ZR','ZW'],
		'LATAM' : ['AG','AI','AN','AR','AW','BB','BL','BM','BO','BR','BS','BZ','CL','CO','CR','CU','DM','DO','EC','FK','GD','GF','GS','GT','GU','GY','HN','HT','JM','KN','KY','LC','MF','MS','MX','NI','PA','PE','PM','PR','PY','SR','SV','TC','TT','UM','UY','VC','VE','VG','VI'],
		'NA' : ['CA','NA','US']
	}
	var lookup = {};
	for (var k in data) { if (data.hasOwnProperty(k)) {
		var list = data[k];
		for (var i=0; i<list.length; i++) {
			lookup[ list[i] ] = k;
		}
	} }
	return lookup;
}();
