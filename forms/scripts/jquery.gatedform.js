/**********************************************************/
// DynamicForm  v1.15.11
/**********************************************************/
// https://mojo.redhat.com/docs/DOC-188933
/**********************************************************/
(function(window, document, $, undefined) {
    "use strict";
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(encodeURIComponent(this.value) || "");
            } else {
                o[this.name] = encodeURIComponent(this.value) || "";
            }
        });
        return o;
    };
    $.ajaxSetup({
        "cache": true,
        "beforeSend": function(xhr) {
            xhr.overrideMimeType("application/x-javascript; charset=utf-8");
        }
    });
    window.dynamicForm = window.dynamicForm || {};
    dynamicForm.Util = {
        ToString: function(obj, normalize) {
            var string = "";
            switch (typeof obj) {
                case "undefined":
                    string = "UNDEFINED";
                    break;
                case "null":
                    string = "NULL";
                    break;
                case "boolean":
                    string = obj ? "true" : "false";
                    break;
                case "string":
                    string = obj;
                    break;
                case "number":
                    string = obj.toString(10);
                    break;
                default:
                    string = obj.serializeObject();
                    break;
            }


            if (normalize === 'toLowerCase') {
                string = string.toLowerCase();
            }

            return string;
        },
        GetScript: function(path) {
            //Try local version 1st, if missing fall back to www.redhat.com
            var deferred = new $.Deferred();
            deferred = $.getScript(dynamicForm.Util.GetUrlPrefix() + path,
                deferred.resolve(),
                function() {
                    deferred.resolve();
                    return $.getScript("//www.redhat.com" + path, deferred.resolve(), deferred.resolve());
                });
            return deferred;
        },
        HasValue: function(value) {
            var ret = false;
            if (typeof value !== "undefined") {
                ret = (value !== "undefined" && value !== dynamicForm.constants.UNAVAILABLE && value !== "");
            }
            return ret;
        },
        //Tools to display testing info on screen
        // add "&testing=true" to query string to enable
        Testing: {
            okToUpdate: false,
            Show: function() {
                if (dynamicForm.options.testing) {
                    $.getScript("/forms/scripts/lib/bootstrap/3.2.0/js/bootstrap.js", function(a, b, c) {
                        var panels = $('<div />').attr('id', 'DynamicFormDebugPanels').addClass('panel').addClass('panel-info');
                        var panelBody = $('<div />').addClass('panel-body');
                        var navTabs = '<ul id="testingTabs" class="nav nav-tabs"><li class="active"><a href="#form" id="formTab" role="tab" data-toggle="tab">Form</a></li><li><a href="#data" id="dataTab" role="tab" data-toggle="tab">Data</a></li><li><a href="#config" role="tab" id="configTab" data-toggle="tab">Configuration</a></li></ul>';
                        var tabContent = $('<div class="tab-content" />');
                        var tabPanes = '<div class="tab-pane fade in active" id="form"></div><div class="tab-pane fade" id="data"></div><div class="tab-pane fade" id="config"></div>';
                        tabContent.append(tabPanes);
                        panelBody.append('<div class="panel-heading">Dynamic Form Content: ' + dynamicForm.options.QA_Version + '</div>');
                        panelBody.append(navTabs);
                        panelBody.append(tabContent);
                        panels.append(panelBody);
                        //var formContainer = dynamicForm.options.elqFormContainerId || "GatedFormContainer";
                        if ($("#DynamicFormDebugPanels").length > 0) {
                            $("#DynamicFormDebugPanels").replaceWith(panels);
                        } else {
                            $('body').append(panels);
                        }
                        dynamicForm.Util.Testing.Update();
                        //$('#DynamicFormDebugPanels a[data-toggle="tab"]').removeClass('bg-primary');
                    });
                }
            },
            Update: function(tab) {
                if (dynamicForm.options.testing && typeof $.fn.tab !== 'undefined') {
                    //Tabs: form, lookup, config
                    switch (tab) {
                        case "form":
                            $('#' + tab).html('<pre>' + JSON.stringify($('#' + dynamicForm.options.elqFormName).serializeArray(), undefined, 4) + '</pre>');
                            $('#testingTabs a[data-toggle="tab"][href="#' + tab + '"]').tab('show');
                            break;
                        case "data":
                            $('#' + tab).html('<pre>' + JSON.stringify(dynamicForm.data, undefined, 4) + '</pre>');
                            $('#testingTabs a[data-toggle="tab"][href="#' + tab + '"]').tab('show');
                            break;
                        case "config":
                            $('#' + tab).html('<pre>' + JSON.stringify(dynamicForm.options, undefined, 4) + '</pre>');
                            $('#testingTabs a[data-toggle="tab"][href="#' + tab + '"]').tab('show');
                            break;
                        default:
                            $("#form").html('<pre>' + JSON.stringify($('#' + dynamicForm.options.elqFormName).serializeArray(), undefined, 4) + '</pre>');
                            $("#data").html('<pre>' + JSON.stringify(dynamicForm.data, undefined, 4) + '</pre>');
                            $("#config").html('<pre>' + JSON.stringify(dynamicForm.options, undefined, 4) + '</pre>');
                    }
                }
            }
        },
        //return domain dynamicForm script was loaded from - that's where the supporting files should also be
        GetUrlPrefix: (function() {
            var scripts = document.getElementsByTagName("script"),
                index = scripts.length - 1,
                my_script = scripts[index],
                my_src = my_script.src,
                my_script_url = "";

            my_script_url = my_src.split("/")[0] + "//" + my_src.split("/")[2];

            if (typeof my_src.split("/")[2] === 'undefined' || my_src.split("/")[2] === 'undefined') {
                my_script_url = "//www.redhat.com";
            }
            return function() {
                return my_script_url;
            };
        })(),
        //offer access rules allow offer to be gated or "tracked" - autosubmitted with or without contact info
        //this is set in eloqua (maybe salesforce?) or via config/querystring
        GetOfferAccessRule: function() {
            //gated by default, allows config option to switch from tracked to gated
            var access_rule = dynamicForm.constants.ACCESS_RULE.GATED;
            try {
                if (typeof dynamicForm.options.offer_id !== 'undefined' && typeof dynamicForm.data.GetElqOffer[dynamicForm.options.offer_id] === 'function') {
                    var offer_access_rule = dynamicForm.data.GetElqOffer[dynamicForm.options.offer_id](dynamicForm.options.lookup.offer.fields.accessrule).toLowerCase();
                    if (offer_access_rule.indexOf("track") >= 0) {
                        access_rule = dynamicForm.constants.ACCESS_RULE.TRACKED;
                    }
                    if (typeof dynamicForm.options.access_rule !== 'undefined') {
                        if (dynamicForm.options.access_rule.indexOf("track") >= 0) {
                            access_rule = dynamicForm.constants.ACCESS_RULE.TRACKED;
                        }
                    }
                }
            } catch (e) {
                //console.error("[dynamicForm logging]: ", e);
                access_rule = dynamicForm.constants.ACCESS_RULE.GATED;
            }
            return access_rule;
        },
        //currently loads concatenated plugins file, can be replaced later with require.js
        CheckPlugins: function() {
            var deferred = new $.Deferred(),
                plugins = new $.Deferred(),
                translation_plugin = new $.Deferred();
            $.when(dynamicForm.Util.GetScript("/forms/scripts/jquery.gatedform.plugins.js")).then(function() {
                plugins.resolve();
            });
            $.when(dynamicForm.Util.GetScript("/j/js18n.js")).then(function() {
                translation_plugin.resolve();
            });
            $.when(plugins, translation_plugin).then(function() {
                deferred.resolve();
            });
            return deferred;
        },
        //currently handles "no_css", later will load other stylesheets as needed
        CheckStylesheet: function() {
            var baseCss = [''
                    //"http://devwebdrupal2-webdrupal-admin.dist.dvlp.ext.phx1.redhat.com/profiles/rh/themes/redhatdotcom/css/forms.css",
                    //dynamicForm.Util.GetUrlPrefix() + "/forms/css/jquery.gatedform.css"
                ],
                optionalCss = [''
                    //"http://devwebdrupal2-webdrupal-admin.dist.dvlp.ext.phx1.redhat.com/profiles/rh/themes/redhatdotcom/css/overpass.css", "http://devwebdrupal2-webdrupal-admin.dist.dvlp.ext.phx1.redhat.com/profiles/rh/themes/redhatdotcom/css/bootstrap.css", "http://devwebdrupal2-webdrupal-admin.dist.dvlp.ext.phx1.redhat.com/profiles/rh/themes/redhatdotcom/css/style.css", "http://devwebdrupal2-webdrupal-admin.dist.dvlp.ext.phx1.redhat.com/profiles/rh/themes/redhatdotcom/css/editorial.css", "http://devwebdrupal2-webdrupal-admin.dist.dvlp.ext.phx1.redhat.com/profiles/rh/themes/redhatdotcom/css/print.css"
                ];
            var deferred = $.Deferred();
            if (dynamicForm.options.no_css) {
                //remove css
                $("head link[href*=\"jquery.gatedform.css\"]").detach();
                deferred.resolve();
            } else {
                if ($("head link[href*=\"jquery.gatedform.css\"]").length < 1) {
                    var i, form_css, len = baseCss.length;
                    for (i = 0; i < len; i++) {
                        form_css = document.createElement("link");
                        form_css.rel = "stylesheet";
                        form_css.href = baseCss[i];
                        document.getElementsByTagName("head")[0].appendChild(form_css);
                    }
                }
                deferred.resolve();
            }
            return deferred;
        },
        //used by "GetLanguageCode" to get language from domain
        GetSubDomain: function() {
            var sub = dynamicForm.constants.UNAVAILABLE,
                hashes = document.domain.split("."),
                prefix = hashes[0];
            if (prefix.length > 0 && prefix.length < 5) {
                sub = prefix;
            }
            return sub;
        },
        GetLanguageCode: function(type) {
            var cookie_name = "LOCALE",
                cookie_language = $.cookie(cookie_name),
                language = "en";
            //1. try to get value from cookie -- LEGACY
            if (dynamicForm.Util.HasValue(cookie_language)) {
                language = cookie_language.substr(0, 2);
            }
            //2. get from path of window (parent should be able to pass to modal)
            //TODO - assumes the country code is the first item in the pathname, may not apply to non-redhat next sites
            var path_var = window.location.pathname.split("/")[1];
            if (path_var.length == 2) {
                language = path_var;
            }
            //3.get from querystring/options
            if (dynamicForm.Util.HasValue(dynamicForm.options.language)) {
                language = dynamicForm.options.language;
            }
            //last chance, check subdomain?
            // var domain_var = dynamicForm.Util.GetSubDomain();
            // if (dynamicForm.Util.HasValue(domain_var)) {
            //     language = domain_var;
            // }
            //save to options before leaving
            dynamicForm.options.language = language;
            return language;
        },
        GetCountryCode: function(languageCode) {
            var cookie_name = "LOCALE";
            var cookie_language = $.cookie(cookie_name);
            // TODO - remember to take into account www.redhat.com/<Language>/
            var country = "";
            if ($.url(document.URL, false).param("country")) {
                country = $.url(document.URL, false).param("country");
            } else {
                if ($.url(document.URL, false).param("Country")) {
                    country = $.url(document.URL, false).param("Country");
                } else {
                    if (dynamicForm.Util.HasValue(dynamicForm.options.country)) {
                        country = dynamicForm.options.country;
                    } else {
                        if (typeof cookie_language !== "undefined" && cookie_language !== dynamicForm.constants.UNAVAILABLE) {
                            country = cookie_language.substr(3, 5);
                        }
                    }
                }
            }
            return country;
        },
        GetCookieValue: function(name) {
            var value = dynamicForm.constants.UNAVAILABLE;
            if (dynamicForm.Util.HasValue(dynamicForm.data[name])) {
                value = dynamicForm.data[name];
            } else {
                if (dynamicForm.Util.HasValue($.cookie(name))) {
                    value = dynamicForm.data[name] = $.cookie(name);
                }
            }
            return value;
        }
    };
    //default bundle location for js18n (translation bundles)
    window.js18nConfig = {
        bundlePath: dynamicForm.Util.GetUrlPrefix() + "/j/js18n-bundles"
    };
    dynamicForm.constants = {
        TIMEOUT: 3000,
        UNAVAILABLE: "UNAVAILABLE",
        ACCESS_RULE: {
            TRACKED: "tracked",
            GATED: "gated"
        },
        STATUS: {
            ERROR: "-1",
            OK: "0",
            WORKING: "1"
        },
        TYPE: {
            INLINE: "inline",
            MODAL: "modal",
            DIRECT: "direct"
        },
        VIEW: {
            AUTO: "auto",
            BAD_OFFER: "bad offer",
            CONVERSION: "conversion",
            FORM: "form",
            SEND_MSG: "msg",
            DOWNLOAD: "download"
        },
        LAYOUT: {
            HORIZONTAL: "h",
            VERTICAL: "v"
        },
        OMNITURE: {
            DIVIDER: " | ",
            CHANNEL: {
                LANDING: "landing page",
                LIGHTBOX: "lightbox"
            },
            EVENT: {
                PAGE_LOAD: "event17",
                FORM_SUBMIT: "event18",
                INTCMP: "event31"
            },
            FIRST_MINOR_SECTION: "dynamic form",
            SECOND_MINOR_SECTION: {
                LIGHTBOX: "lightbox",
                EMBEDDED: "embedded"
            }
        }
    };
    dynamicForm.data = {
        verificationId: dynamicForm.constants.UNAVAILABLE,
        LookupRetryCount: 0,
        StandardFieldCount: 0,
        rh_pid: dynamicForm.constants.UNAVAILABLE,
        rh_omni_itc: dynamicForm.constants.UNAVAILABLE,
        rh_omni_tc: dynamicForm.constants.UNAVAILABLE
    };
    dynamicForm.options = {
        RedHatCookies: ['rh_omni_itc', 'rh_omni_tc', 'rh_pid'],
        show_terms_input: false,
        contact_known: false,
        MAX_RETRIES: 2,
        MAX_PROXY_RETRIES: 2,
        // testing: false,
        // no_offer: false,
        no_auto: false,
        // no_css: false,
        load_scode: true,
        elqCustomerGUID: "",
        elqFormContainerId: "GatedFormContainer",
        elqFormName: "RespondedToCampaign",
        elqFormSubmitFrame: "elqFormSubmitFrame",
        IMATESTRECORD: "",
        //AdditionalContactFields: [],
        NameOrder: "western",
        //default to western, use "eastern" for reverse order
        // ShowSalutation: "",
        GoogleAnalyticsID: null,
        GoogleRemarketing: {
            id: "990030321",
            language: "en",
            format: "3",
            color: "ffffff",
            label: "rxV4CN_35QQQ8dOK2AM",
            value: "0",
            remarketing_only: true,
            custom_params: window.google_tag_params
        },
        GoogleAdWordsConversionTracking: {
            id: "991646916",
            language: "en",
            format: "3",
            color: "ffffff",
            label: "Sjx6CLyuoAkQxKnt2AM",
            value: "0",
            remarketing_only: false,
            custom_params: ''
        },
        social: {
            google: {
                url: "//plus.google.com/+RedHat",
                label: "Add us on Google+"
            },
            twitter: {
                url: "//www.twitter.com/redhatnews",
                label: "Follow us on Twitter"
            },
            linkedin: {
                url: "//www.linkedin.com/groups?home=&gid=2525539&trk=anet_ug_hm",
                label: "Connect on LinkedIn"
            },
            facebook: {
                url: "//www.facebook.com/redhatinc",
                label: "Friend us on Facebook"
            }
        },
        FormTitle: "",
        FormIntro: "Register to access the assets in our Resource Library and receive emails customized to your interests.",
        WelcomeMessage: "<div>Welcome back, {{contact_email}}.</div><div id=\"NotI\" class=\"small\">Not {{contact_email}}? <a href=\"#\">Click here</a></div>",
        NotI: "",DefaultValue: "-- Please Select --",
        FormCallToAction: "Continue",
        RelatedTitle: "Recommended",
        ThanksTitle: "Your content is ready.",
        ThanksCallToAction: "Get it now",
        ThanksText: "Thank you for your interest in Red Hat. Your information has been submitted successfully.",
        ShowThanksButton: true,
        FormPrivacyURL: "//www.redhat.com/footer/privacy-policy.html",
        FormPrivacyText: "Privacy Statement",
        ErrorTitle: "Thank you for your interest in Red Hat.",
        ErrorMessage: "There was a problem processing your request, one of our associates will reach out to you soon.",
        TermsAndConditions: '',
        //EXAMPLE: 'I understand Red Hat often uses authorized business partners to best serve its customers. Red Hat may share my contact information with those partners.',
        TermsAndConditionsAgree: 'I have READ and AGREE with these terms and conditions.',
        form: {
            method: "post",
            fields: [],
            timeout: 3000 //3 seconds
        },
        fields: {
            visitor: ['V_Browser_Type', 'V_CityFromIP', 'V_CountryFromIP', 'V_ProvinceFromIP', 'V_ZipCodeFromIP', 'V_MostRecentReferrer', 'V_MostRecentSearchEngine', 'V_MostRecentSearchQuery'],
            contact: ['C_Title', 'C_Address1', 'C_Address2', 'C_Address3', 'C_City', 'C_State_Prov', 'C_Zip_Postal', 'C_Country', 'C_Industry1', 'C_Annual_Revenue1', 'C_Number_of_Employees1', 'C_Salutation', 'C_FirstName', 'C_LastName', 'C_EmailAddress', 'C_BusPhone', 'C_Company', 'C_Department1', 'C_Job_Role11'],
            Tactic: ['Apps_Tactics_T_Type1', 'Apps_Tactics_T_Campaign_ID_181', 'Apps_Tactics_T_Record_Type1', 'Apps_Tactics_T_Campaign_Name1'],
            Offer: ['Apps_Offers_O_Access_Rule1', 'Apps_Offers_O_Campaign_ID_181', 'Apps_Offers_O_Campaign_Name1', 'Apps_Offers_O_Target_Persona1', 'Apps_Offers_O_Buying_Stage1', 'Apps_Offers_O_Solution_Code1', 'Apps_Offers_O_Type1', 'Apps_Offers_O_Asset_URL1', 'Apps_Offers_O_Language1', 'Apps_Offers_O_Record_Type1', 'isOnWaitingList']
        },
        lookup: {
            visitor: {
                key: "14c651bb-beae-4f74-a382-d1adede85da0",
                fields: {
                    browser_type: "V_Browser_Type",
                    last_page_in_visiit: "V_LastPageInVisit",
                    mostRecentReferrer: "V_MostRecentReferrer",
                    elq_email: "V_ElqEmailAddress",
                    countryFromIp: "V_CountryFromIP",
                    stateFromIp: "V_ProvinceFromIP",
                    cityFromIp: "V_CityFromIP",
                    email: "V_Email_Address",
                    //not returned currently...
                    zipFromIp: "V_ZipCodeFromIP",
                    mostRecentSearchEngine: "V_MostRecentSearchEngine",
                    mostRecentSearchQuery: "V_MostRecentSearchQuery"
                }
            },
            contact: {
                key: "af62a316-6489-4a86-b35e-0b5956fcb3a4",
                query: "C_EmailAddress",
                fields: {
                    email: "C_EmailAddress",
                    firstName: "C_FirstName",
                    lastName: "C_LastName",
                    company: "C_Company",
                    city: "C_City",
                    state_prov: "C_State_Prov",
                    zip_postal: "C_Zip_Postal",
                    country: "C_Country",
                    title: "C_Title",
                    industry1: "C_Industry1",
                    annual_revenue1: "C_Annual_Revenue",
                    department: "C_Department1",
                    employees_count: "C_Number_of_Employees1",
                    verificationId: "C_verificationId___Most_Recent1",
                    hasRegistered: "C_Has_Submitted_Long_Form1",
                    //registeredDate: "C_Last_Submitted_Long_Form_Date1",
                    registeredDate: "C_DateModified",
                    role: "C_Job_Role11",
                    //not returned currently...
                    address1: "C_Address1",
                    addredd2: "C_Address2",
                    address3: "C_Address3",
                    salutation: "C_Salutation",
                    language: "C_Language_Preference1"
                }
            },
            tactic: {
                key: "6964661e-603a-4f93-8e13-07467544315b",
                query: "Apps_Tactics_T_Campaign_ID_181",
                fields: {
                    campaignId15: "Apps_Tactics_T_Campaign_ID_151",
                    campaignId18: "Apps_Tactics_T_Campaign_ID_181",
                    campaignName: "Apps_Tactics_T_Campaign_Name1",
                    type: "Apps_Tactics_T_Type1",
                    recordType: "Apps_Tactics_T_Record_Type1",
                    isOnWaitingList: "isOnWaitingList"
                }
            },
            offer: {
                key: "b68eb5c2-6b22-40b6-bdb6-cba3f848b1c4",
                query: "Apps_Offers_O_Campaign_ID_181",
                fields: {
                    offerId15: "Apps_Offers_O_Campaign_ID_151",
                    offerId18: "Apps_Offers_O_Campaign_ID_181",
                    campaignName: "Apps_Offers_O_Campaign_Name1",
                    targetAudience: "Apps_Offers_O_Target_Persona1",
                    buyingStage: "Apps_Offers_O_Buying_Stage1",
                    solutionCode: "Apps_Offers_O_Solution_Code1",
                    type: "Apps_Offers_O_Type1",
                    assetUrl: "Apps_Offers_O_Asset_URL1",
                    description: "Apps_Offers_O_Description1",
                    language: "Apps_Offers_O_Language1",
                    accessrule: "Apps_Offers_O_Access_Rule1",
                    recordType: "Apps_Offers_O_Record_Type1",
                    //not returned currently...
                    isOnWaitingList: "isOnWaitingList",
                }
            }
        }
    };
    dynamicForm.BuildOptions = function(opts) {
        var deferred = $.Deferred();
        dynamicForm.options = $.extend({}, dynamicForm.options, opts);
        var params = $.url(document.URL, false).param();
        dynamicForm.options = $.extend({}, dynamicForm.options, params);
        var _sandbox = {
            QA_Version: "1.15.11 SANDBOX + jQuery " + $.fn.jquery,
            elqSiteId: "711611696"
        };
        var _production = {
            QA_Version: "1.15.11 + jQuery " + $.fn.jquery,
            //TODO: check qa.engage
            elqSiteId: "1795"
        };
        try {
            //Set up environment
            if (!location.hostname) {
                location.hostname = window.location.host;
            }
            var host = location.hostname;
            var isSandbox = (host.search('localhost') > -1 || host.search('theharris.info') > -1 || host.search('redhat.dev') > -1 || host.search('qa.engage.redhat.com') > -1 || host.search('dynamicForm-itmarketing.itos.redhat.com') > -1 || host.search('.devlab.redhat.com') > -1 || host.search('.rhcloud.com') > -1);
            if (isSandbox) {
                //Starting with SANDBOX settings
                // window.js18nConfig = {
                //   bundlePath: dynamicForm.Util.GetUrlPrefix() + "/j/js18n-bundles"
                // };
                dynamicForm.options = $.extend({}, dynamicForm.options, _sandbox);
            } else {
                // window.js18nConfig = {
                //   bundlePath: "//www.redhat.com/j/js18n-bundles"
                // };
                //Starting with PRODUCTION settings
                dynamicForm.options = $.extend({}, dynamicForm.options, _production);
            }
            //dynamicForm.options.form.fields.elqSiteId.value = dynamicForm.options.elqSiteId;
            // TODO: update configure options with query string parameters
            // query string should be able to override the above settings
            // var config_opt,
            //     pLen = params.length,
            //     i;
            // for (i = 0; i > pLen; i++) {
            //     config_opt = params[i];
            //     dynamicForm.options[config_opt.toLowerCase()] = params.param(config_opt);
            // }
            //clone params object
            for (var key in params) {
                if (params.hasOwnProperty(key)) { //filter prototype
                    dynamicForm.options[key.toLowerCase()] = params[key];
                }
            }

            if (dynamicForm.Util.HasValue(dynamicForm.options.IMATESTRECORD) && !dynamicForm.Util.HasValue(dynamicForm.options.QA_Imatestrecord)) {
                dynamicForm.options.QA_Imatestrecord = dynamicForm.options.IMATESTRECORD;
            }
            if (dynamicForm.Util.HasValue(dynamicForm.options.p) && !dynamicForm.Util.HasValue(dynamicForm.options.parent_url)) {
                dynamicForm.options.parent_url = dynamicForm.options.p;
            }
            if (dynamicForm.Util.HasValue(dynamicForm.options.udf) && !dynamicForm.Util.HasValue(dynamicForm.options.CustomQuestions)) {
                dynamicForm.options.CustomQuestions = dynamicForm.options.udf;
            }
            if (dynamicForm.Util.HasValue(dynamicForm.options.sal) && !dynamicForm.Util.HasValue(dynamicForm.options.ShowSalutation)) {
                if (dynamicForm.options.sal === "1" || dynamicForm.options.sal === "true" || dynamicForm.options.showsalutation == 'true' || dynamicForm.options.showsalutation == '1') {
                    dynamicForm.options.ShowSalutation = "true";
                }
            }
            if (dynamicForm.Util.HasValue(dynamicForm.options.ar) && !dynamicForm.Util.HasValue(dynamicForm.options.access_rule)) {
                dynamicForm.options.access_rule = dynamicForm.options.ar;
            }
            dynamicForm.options.language = dynamicForm.options.language || params.Language || params.language;
            dynamicForm.options.view = dynamicForm.options.view || dynamicForm.constants.VIEW.FORM;

            if (dynamicForm.options.no_auto === '1' || params.no_auto === 'true' || params.no_auto === '1') {
                dynamicForm.options.no_auto = true;
            }

            dynamicForm.options.no_offer = (dynamicForm.options.no_offer == 'true' || dynamicForm.options.no_offer == '1');
            dynamicForm.options.display_method = dynamicForm.options.display_method || params.display_method || dynamicForm.constants.TYPE.DIRECT;

            var param_thanks = params.ThanksButton || params.ShowThanksButton;

            var pref_show_thanks_btn = dynamicForm.Util.ToString(dynamicForm.options.ShowThanksButton, "toLowerCase");
            var pref_thanks_btn = dynamicForm.Util.ToString(dynamicForm.options.ThanksButton, "toLowerCase");
            var param_show_thanks_btn = dynamicForm.Util.ToString(param_thanks, "toLowerCase");

            if (dynamicForm.Util.HasValue(pref_thanks_btn)) {
                dynamicForm.options.ShowThanksButton = (pref_thanks_btn === 'true');
            } else if (dynamicForm.Util.HasValue(param_show_thanks_btn)) {
                dynamicForm.options.ShowThanksButton = (param_show_thanks_btn === 'true');
            }

            if (dynamicForm.Util.HasValue(dynamicForm.options.no) && !dynamicForm.Util.HasValue(dynamicForm.options.NameOrder)) {
                if (dynamicForm.options.no === "e") {
                    dynamicForm.options.NameOrder = "eastern";
                } else {
                    dynamicForm.options.NameOrder = "western";
                }
            }

            //switch to "proxy" to use the lookup proxy first.
            dynamicForm.options.urls = {
                elqLookups: [
                    'https://s' + dynamicForm.options.elqSiteId + '.t.eloqua.com/visitor/v200/svrGP',
                    'https://elqproxy-theharris.rhcloud.com/elqLookup.php'
                    // to test for 503 errors:
                    // 'http://httpbin.org/status/503'
                    // other http codes:
                    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Response_codes

                ]
            };

        } catch (e) {
            //console.error("[dynamicForm logging]: ", e);
        } finally {
            deferred.resolve();
        }
        $.when(deferred).then(function() {
            if (typeof dynamicForm.options.offer_id === "undefined") {
                dynamicForm.options.no_offer = true;
            }
            if (dynamicForm.options.no_offer) {
                dynamicForm.options.no_auto = true;
            }
            //if (typeof dynamicForm.options.fields !== "undefined") {
            if (dynamicForm.options.ShowSalutation === "true") {
                dynamicForm.options.form.fields["salutation"] = {
                    type: "select",
                    standard: true,
                    cls: "",
                    display: true,
                    label: "Salutation",
                    id: "C_Salutation",
                    name: "C_Salutation",
                    options: [dynamicForm.options.DefaultValue, "Mr.", "Mrs.", "Ms.", "Dr."]
                };
            } else {
                dynamicForm.options.form.fields["salutation"] = {
                    type: "select",
                    standard: true,
                    cls: "",
                    display: false,
                    label: "Salutation",
                    id: "C_Salutation",
                    name: "C_Salutation",
                    options: [dynamicForm.options.DefaultValue, "Mr.", "Mrs.", "Ms.", "Dr."]
                };
            }
            if (dynamicForm.options.NameOrder === "eastern") {
                dynamicForm.options.form.fields["last name"] = {
                    standard: true,
                    type: "text",
                    cls: "",
                    display: true,
                    label: "Last name",
                    id: "C_LastName",
                    name: "C_LastName"
                };
                dynamicForm.options.form.fields["first name"] = {
                    standard: true,
                    type: "text",
                    cls: "",
                    display: true,
                    label: "First name",
                    id: "C_FirstName",
                    name: "C_FirstName"
                };
            } else {
                dynamicForm.options.form.fields["first name"] = {
                    standard: true,
                    type: "text",
                    cls: "",
                    display: true,
                    label: "First name",
                    id: "C_FirstName",
                    name: "C_FirstName"
                };
                dynamicForm.options.form.fields["last name"] = {
                    standard: true,
                    type: "text",
                    cls: "",
                    display: true,
                    label: "Last name",
                    id: "C_LastName",
                    name: "C_LastName"
                };
            }
            dynamicForm.options.form.fields["elqformname"] = {
                value: dynamicForm.options.elqFormName,
                type: "text",
                cls: "form-control",
                display: false,
                id: "elqFormName",
                name: "elqFormName"
            };
            dynamicForm.options.form.fields["elqsiteid"] = {
                value: dynamicForm.options.elqSiteId,
                type: "text",
                cls: "form-control",
                display: false,
                id: "elqSiteId",
                name: "elqSiteId"
            };
            dynamicForm.options.form.fields["work email"] = {

                type: "email",
                cls: "form-control",
                standard: true,
                display: true,
                label: "Work email",
                id: "C_EmailAddress",
                name: "C_EmailAddress"
            };
            dynamicForm.options.form.fields["work phone"] = {

                standard: true,
                type: "tel",
                cls: "form-control",
                display: true,
                label: "Work phone",
                id: "C_BusPhone",
                name: "C_BusPhone"
            };
            dynamicForm.options.form.fields["mobile phone"] = {

                standard: true,
                type: "tel",
                cls: "form-control",
                display: false,
                label: "Mobile phone",
                id: "C_MobilePhone",
                name: "C_MobilePhone"
            };
            dynamicForm.options.form.fields["fax"] = {

                standard: true,
                type: "tel",
                cls: "form-control",
                display: false,
                label: "Fax",
                id: "C_Fax",
                name: "C_Fax"
            };
            dynamicForm.options.form.fields["company"] = {

                standard: true,
                type: "text",
                cls: "form-control",
                display: true,
                label: "Company",
                id: "C_Company",
                name: "C_Company"
            };
            dynamicForm.options.form.fields["department"] = {

                standard: true,
                type: "select",
                cls: "form-control",
                display: true,
                label: "Department",
                id: "C_Department1",
                name: "C_Department1",
                options: [dynamicForm.options.DefaultValue, "IT - Applications/Development", "IT - Business Intelligence", "IT - Database", "IT - Desktop/Help Desk", "IT - Network", "IT - Operations", "IT - Project Management", "IT - Quality/Testing", "IT - Risk/Compliance/Security", "IT - Server/Storage", "IT - Telecom", "IT - Web", "IT - All", "Customer Service/Call Center", "Executive Office", "Finance", "Human Resources", "Legal", "Marketing Communications", "Research & Development", "Sales", "Technical Support"]
            };
            dynamicForm.options.form.fields["job role"] = {

                standard: true,
                type: "select",
                //      attr: 'disabled="disabled"',
                cls: "disabled form-control",
                display: true,
                label: "Job role",
                id: "C_Job_Role11",
                name: "C_Job_Role11",
                options: [dynamicForm.options.DefaultValue]
            };
            dynamicForm.options.form.fields["job title"] = {

                standard: true,
                type: "text",
                cls: "form-control",
                display: false,
                label: "Job title",
                id: "C_Title",
                name: "C_Title"
            };
            dynamicForm.options.form.fields["address"] = {

                standard: true,
                type: "text",
                cls: "form-control",
                display: false,
                label: "Address",
                id: "C_Address1",
                name: "C_Address1"
            };
            dynamicForm.options.form.fields["address 2"] = {

                standard: true,
                type: "text",
                cls: "form-control",
                display: false,
                label: "Address 2",
                id: "C_Address2",
                name: "C_Address2"
            };
            dynamicForm.options.form.fields["address 3"] = {

                standard: true,
                type: "text",
                cls: "form-control",
                display: false,
                label: "Address 3",
                id: "C_Address3",
                name: "C_Address3"
            };
            dynamicForm.options.form.fields["city"] = {

                standard: true,
                type: "text",
                cls: "form-control",
                display: false,
                label: "City",
                id: "C_City",
                name: "C_City"
            };
            dynamicForm.options.form.fields["state/province"] = {

                standard: true,
                type: "text",
                cls: "form-control",
                display: false,
                label: "State/Province",
                id: "C_State_Prov",
                name: "C_State_Prov"
            };
            dynamicForm.options.form.fields["zip/postal code"] = {

                standard: true,
                type: "text",
                cls: "form-control",
                display: false,
                label: "Zip/Postal code",
                id: "C_Zip_Postal",
                name: "C_Zip_Postal"
            };
            dynamicForm.options.form.fields["country"] = {
                standard: true,
                type: "select",
                cls: "form-control",
                display: true,
                label: "Country",
                id: "C_Country",
                name: "C_Country",
                options: [dynamicForm.options.DefaultValue, 'United States', 'Afghanistan', 'Aland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'Brit/Indian Ocean Terr.', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo', 'Congo,  The Dem. Republic Of', 'Cook Islands', 'Costa Rica', 'Côte D\'Ivore', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Eritrea', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Terr.', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard/McDonald Isls.', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea (South)', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'N. Mariana Isls.', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestinian Territory,  Occupied', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Samoa', 'San Marino', 'Sao Tome/Principe', 'Saudi Arabia', 'Senegal', 'Serbia and Montenegro', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovak Republic', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'Spain', 'Sri Lanka', 'St. Helena', 'St. Pierre and Miquelon', 'St. Vincent and Grenadines', 'Suriname', 'Svalbard/Jan Mayen Isls.', 'Swaziland', 'Sweden', 'Switzerland', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks/Caicos Isls.', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'US Minor Outlying Is.', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Viet Nam', 'Virgin Islands (British)', 'Virgin Islands (U.S.)', 'Wallis/Futuna Isls.', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe']
            };
            dynamicForm.options.form.fields["industry"] = {
                standard: true,
                type: "select",
                cls: "form-control",
                display: false,
                label: "Industry",
                id: "C_Industry1",
                name: "C_Industry1",
                options: [dynamicForm.options.DefaultValue, 'Aerospace &amp; Defense', 'Agriculture', 'Apparel', 'Associations', 'Automotive', 'Biotech', 'Business Services', 'Construction', 'Consumer Goods &amp; Services', 'Education', 'Energy &amp; Utilities', 'Financial Services', 'Food &amp; Beverage', 'Furniture', 'Government', 'Hardware', 'Healthcare &amp; Medical', 'Home &amp; Garden', 'Hospitality &amp; Travel', 'Manufacturing', 'Media &amp; Entertainment', 'Mining', 'Pharmaceuticals', 'Printing &amp; Publishing', 'Real Estate', 'Recreation', 'Retail &amp; Distribution', 'Software &amp; Technology', 'Telecommunications', 'Textiles', 'Transportation &amp; Logistics']
            };
            dynamicForm.options.form.fields["annual revenue"] = {
                standard: true,
                type: "select",
                cls: "form-control",
                display: false,
                label: "Annual revenue",
                id: "C_Annual_Revenue1",
                name: "C_Annual_Revenue1",
                options: [dynamicForm.options.DefaultValue, '$1 - $1M', '$1M - $5M', '$5M - $10M', '$10M - $25M', '$25M - $50M', '$50M - $100M', '$100M - $250M', '$250M - $500M', '$500M - $1B', '$1B - $2.5B', '$2.5B - $5B', 'Over $5B']
            };
            dynamicForm.options.form.fields["number of employees"] = {
                standard: true,
                type: "select",
                cls: "form-control",
                display: false,
                label: "Number of employees",
                id: "C_Number_of_Employees1",
                name: "C_Number_of_Employees1",
                options: [dynamicForm.options.DefaultValue, '1 - 99','100 - 999']
            };
            dynamicForm.options.form.fields["areas of interest"] = {
                standard: true,
                type: "multiple",
                cls: "form-control",
                display: false,
                label: "Areas of interest",
                id: "C_Areas_of_Interest1",
                name: "C_Areas_of_Interest1",
                options: [dynamicForm.options.DefaultValue, "Linux Platforms",
                    "Red Hat JBoss Middleware",
                    "Virtualization",
                    "Cloud Computing",
                    "Storage",
                    "Training",
                    "Certification",
                    "Consulting"
                ]
            };
            dynamicForm.options.form.fields["cities nearby"] = {
                standard: true,
                type: "multiple",
                cls: "form-control",
                display: false,
                label: "Cities nearby",
                id: "C_Cities_nearby1",
                name: "C_Cities_nearby1",
                options: [dynamicForm.options.DefaultValue,
                    "Accra",
                    "Addis Ababa",
                    "Adelaide",
                    "Algiers",
                    "Almaty",
                    "Amman",
                    "Amsterdam",
                    "Anadyr",
                    "Anchorage",
                    "Ankara",
                    "Antananarivo",
                    "Asuncion",
                    "Athens",
                    "Atlanta",
                    "Auckland",
                    "Baghdad",
                    "Bangalore",
                    "Bangkok",
                    "Barcelona",
                    "Beijing",
                    "Beirut",
                    "Belgrade",
                    "Berlin",
                    "Bogota",
                    "Boston",
                    "Brasilia",
                    "Brisbane",
                    "Brussels",
                    "Bucharest",
                    "Budapest",
                    "Buenos Aires",
                    "Cairo",
                    "Calgary",
                    "Canberra",
                    "Cape Town",
                    "Caracas",
                    "Casablanca",
                    "Chicago",
                    "Columbus",
                    "Copenhagen",
                    "Dallas",
                    "Dar es Salaam",
                    "Darwin",
                    "Denver",
                    "Detroit",
                    "Dhaka",
                    "Doha",
                    "Dubai",
                    "Dublin",
                    "Edmonton",
                    "Frankfurt",
                    "Guatemala",
                    "Halifax",
                    "Hanoi",
                    "Harare",
                    "Havana",
                    "Helsinki",
                    "Hong Kong",
                    "Honolulu",
                    "Houston",
                    "Indianapolis",
                    "Islamabad",
                    "Istanbul",
                    "Jakarta",
                    "Jerusalem",
                    "Johannesburg",
                    "Kabul",
                    "Karachi",
                    "Kathmandu",
                    "Khartoum",
                    "Kingston",
                    "Kinshasa",
                    "Kiritimati",
                    "Kolkata",
                    "Kuala Lumpur",
                    "Kuwait City",
                    "Kyiv",
                    "La Paz",
                    "Lagos",
                    "Lahore",
                    "Las Vegas",
                    "Lima",
                    "Lisbon",
                    "London",
                    "Los Angeles",
                    "Madrid",
                    "Managua",
                    "Manila",
                    "Melbourne",
                    "Mexico City",
                    "Miami",
                    "Minneapolis",
                    "Minsk",
                    "Montevideo",
                    "Montreal",
                    "Moscow",
                    "Mumbai",
                    "Nairobi",
                    "Nassau",
                    "New Delhi",
                    "New Orleans",
                    "New York",
                    "Oslo",
                    "Ottawa",
                    "Paris",
                    "Perth",
                    "Philadelphia",
                    "Phoenix",
                    "Prague",
                    "Reykjavik",
                    "Rio de Janeiro",
                    "Riyadh",
                    "Rome",
                    "Salt Lake City",
                    "San Francisco",
                    "San Juan",
                    "San Salvador",
                    "Santiago",
                    "Santo Domingo",
                    "S&atilde;o Paulo",
                    "Seattle",
                    "Seoul",
                    "Shanghai",
                    "Singapore",
                    "Sofia",
                    "St. John's",
                    "Stockholm",
                    "Suva",
                    "Sydney",
                    "Taipei",
                    "Tallinn",
                    "Tashkent",
                    "Tegucigalpa",
                    "Tehran",
                    "Tokyo",
                    "Toronto",
                    "Vancouver",
                    "Vienna",
                    "Warsaw",
                    "Washington DC",
                    "Winnipeg",
                    "Yangon",
                    "Zagreb",
                    "Z&uuml;rich"
                ]
            };
            dynamicForm.options.form.fields["language preference"] = {
                standard: true,
                type: "select",
                cls: "form-control",
                display: false,
                label: "Language preference",
                id: "C_Language_Preference1",
                name: "C_Language_Preference1",
                options: [dynamicForm.options.DefaultValue, "English",
                    "Spanish",
                    "French",
                    "Italian",
                    "Portuguese",
                    "Japanese",
                    "Chinese",
                    "Korean"
                ]
            };
            dynamicForm.options.form.fields["additional information"] = {
                type: "text",
                display: false,
                label: "Additional information",
                id: "C_Addition_Information1",
                name: "C_Addition_Information1"
            };
            dynamicForm.options.form.fields["a_timestamp"] = {
                type: "text",
                display: false,
                id: "A_Timestamp",
                name: "A_Timestamp"
            };
            dynamicForm.options.form.fields["a_submissionid"] = {
                type: "text",
                display: false,
                id: "A_SubmissionID",
                name: "A_SubmissionID"
            };
            dynamicForm.options.form.fields["a_landingpageurl"] = {
                type: "text",
                display: false,
                id: "A_LandingPageURL",
                name: "A_LandingPageURL"
            };
            dynamicForm.options.form.fields["a_referringpageurl"] = {
                type: "text",
                display: false,
                id: "A_ReferringPageURL",
                name: "A_ReferringPageURL"
            };
            dynamicForm.options.form.fields["a_redirecturl"] = {
                type: "text",
                display: false,
                id: "A_RedirectURL",
                name: "A_RedirectURL"
            };
            dynamicForm.options.form.fields["a_tacticid_internal"] = {
                type: "text",
                display: false,
                id: "rh_omni_itc",
                name: "A_TacticID_Internal"
            };
            dynamicForm.options.form.fields["a_tacticid_external"] = {
                type: "text",
                display: false,
                id: "rh_omni_tc",
                name: "A_TacticID_External"
            };
            dynamicForm.options.form.fields["a_offerid"] = {
                type: "text",
                display: false,
                id: "A_OfferID",
                name: "A_OfferID"
            };
            dynamicForm.options.form.fields["a_offerid_selected"] = {
                type: "text",
                display: false,
                id: "A_OfferID_Selected",
                name: "A_OfferID_Selected"
            };
            dynamicForm.options.form.fields["a_partnerid"] = {
                type: "text",
                display: false,
                id: "rh_pid",
                name: "A_PartnerID"
            };
            dynamicForm.options.form.fields["a_verificationid"] = {
                type: "text",
                display: false,
                id: "A_VerificationID",
                name: "A_VerificationID"
            };
            dynamicForm.options.form.fields["elqcustomerGguid"] = {
                type: "text",
                display: false,
                id: "elqCustomerGUID",
                name: "elqCustomerGUID"
            };
            dynamicForm.options.form.fields["a_elqvisitorguid"] = {
                type: "text",
                display: false,
                id: "A_ElqVisitorGuid",
                name: "A_ElqVisitorGuid"
            };
            dynamicForm.options.form.fields["a_offerdetails_campaignname"] = {
                type: "text",
                display: false,
                id: "Apps_Offers_O_Campaign_Name1",
                name: "A_OfferDetails_CampaignName"
            };
            dynamicForm.options.form.fields["a_offerdetails_type"] = {
                type: "text",
                display: false,
                id: "Apps_Offers_O_Type1",
                name: "A_OfferDetails_Type"
            };
            dynamicForm.options.form.fields["a_offerdetails_solutioncode"] = {
                type: "text",
                display: false,
                id: "Apps_Offers_O_Solution_Code1",
                name: "A_OfferDetails_SolutionCode"
            };
            dynamicForm.options.form.fields["a_offerdetails_buyingstage"] = {
                type: "text",
                display: false,
                id: "Apps_Offers_O_Buying_Stage1",
                name: "A_OfferDetails_BuyingStage"
            };
            dynamicForm.options.form.fields["a_offerdetails_targetpersona"] = {
                type: "text",
                display: false,
                id: "Apps_Offers_O_Target_Persona1",
                name: "A_OfferDetails_TargetPersona"
            };
            dynamicForm.options.form.fields["asseturl"] = {
                type: "text",
                display: false,
                id: "Apps_Offers_O_Asset_URL1",
                name: "A_OfferDetails_AssetURL"
            };
            dynamicForm.options.form.fields["a_tacticdetails_campaignname"] = {
                type: "text",
                display: false,
                id: "Apps_Tactics_T_Campaign_Name1",
                name: "A_TacticDetails_CampaignName"
            };
            dynamicForm.options.form.fields["a_tacticdetails_type"] = {
                type: "text",
                display: false,
                id: "Apps_Tactics_T_Type1",
                name: "A_TacticDetails_Type"
            };
            dynamicForm.options.form.fields["a_ux_type"] = {
                type: "text",
                display: false,
                id: "A_UX_Type",
                name: "A_UX_Type",
                value: "Long Form"
            };
            dynamicForm.options.form.fields["a_ux_status"] = {
                type: "text",
                display: false,
                id: "A_UX_Status",
                name: "A_UX_Status",
                value: "OK"
            };
            dynamicForm.options.form.fields["a_ux_language"] = {
                type: "text",
                display: false,
                id: "A_UX_Language",
                name: "A_UX_Language"
            };
            dynamicForm.options.form.fields["a_ux_browser"] = {
                type: "text",
                display: false,
                id: "A_UX_Browser",
                name: "A_UX_Browser"
            };
            dynamicForm.options.form.fields["v_cityfromip"] = {
                type: "text",
                display: false,
                id: "V_CityFromIP",
                name: "V_CityFromIP"
            };
            dynamicForm.options.form.fields["v_provincefromip"] = {
                type: "text",
                display: false,
                id: "V_ProvinceFromIP",
                name: "V_ProvinceFromIP"
            };
            dynamicForm.options.form.fields["v_zipcodefromip"] = {
                type: "text",
                display: false,
                id: "V_ZipCodeFromIP",
                name: "V_ZipCodeFromIP"
            };
            dynamicForm.options.form.fields["v_countryfromip"] = {
                type: "text",
                display: false,
                id: "V_CountryFromIP",
                name: "V_CountryFromIP"
            };
            dynamicForm.options.form.fields["v_browser_type"] = {
                type: "text",
                display: false,
                id: "V_Browser_Type",
                name: "V_Browser_Type"
            };
            dynamicForm.options.form.fields["qa_version"] = {
                type: "text",
                display: false,
                label: "QA_Version",
                id: "QA_Version",
                name: "QA_Version"
            };
            dynamicForm.options.form.fields["qa_ruaspambot"] = {
                type: "text",
                display: false,
                label: "QA_Ruaspambot",
                id: "QA_Ruaspambot",
                name: "QA_Ruaspambot"
            };
            dynamicForm.options.form.fields["qa_imatestrecord"] = {
                type: "text",
                display: false,
                label: "QA_Imatestrecord",
                id: "QA_Imatestrecord",
                name: "QA_Imatestrecord"
            };
            dynamicForm.options.form.fields["db_annual_revenue"] = {
                type: "text",
                display: false,
                label: "DB_Annual_Revenue",
                id: "DB_Annual_Revenue",
                name: "DB_Annual_Revenue"
            };
            dynamicForm.options.form.fields["db_state_prov"] = {
                type: "text",
                display: false,
                label: "DB_State_Prov",
                id: "DB_State_Prov",
                name: "DB_State_Prov"
            };
            dynamicForm.options.form.fields["db_zip_postal"] = {
                type: "text",
                display: false,
                label: "DB_ZIP_Postal",
                id: "DB_ZIP_Postal",
                name: "DB_ZIP_Postal"
            };
            dynamicForm.options.form.fields["db_country"] = {
                type: "text",
                display: false,
                label: "DB_Country",
                id: "DB_Country",
                name: "DB_Country"
            };
            dynamicForm.options.form.fields["db_industry"] = {
                type: "text",
                display: false,
                label: "DB_Industry",
                id: "DB_Industry",
                name: "DB_Industry"
            };
            dynamicForm.options.form.fields["db_audience"] = {
                type: "text",
                display: false,
                label: "DB_Audience",
                id: "DB_Audience",
                name: "DB_Audience"
            };
            dynamicForm.options.form.fields["db_audience_segment"] = {
                type: "text",
                display: false,
                label: "DB_Audience_Segment",
                id: "DB_Audience_Segment",
                name: "DB_Audience_Segment"
            };
            dynamicForm.options.form.fields["db_marketing_alias"] = {
                type: "text",
                display: false,
                label: "DB_Marketing_Alias",
                id: "DB_Marketing_Alias",
                name: "DB_Marketing_Alias"
            };
            dynamicForm.options.form.fields["db_fortune1000"] = {
                type: "text",
                display: false,
                label: "DB_Fortune1000",
                id: "DB_Fortune1000",
                name: "DB_Fortune1000"
            };
            dynamicForm.options.form.fields["db_employee_band"] = {
                type: "text",
                display: false,
                label: "DB_Employee_Band",
                id: "DB_Employee_Band",
                name: "DB_Employee_Band"
            };
            dynamicForm.options.form.fields["db_employee_count"] = {
                type: "text",
                display: false,
                label: "DB_Employee_Count",
                id: "DB_Employee_Count",
                name: "DB_Employee_Count"
            };
            dynamicForm.options.form.fields["db_website"] = {
                type: "text",
                display: false,
                label: "DB_Website",
                id: "DB_Website",
                name: "DB_Website"
            };
            dynamicForm.options.form.fields["db_primary_sic"] = {
                type: "text",
                display: false,
                label: "DB_Primary_SIC",
                id: "DB_Primary_SIC",
                name: "DB_Primary_SIC"
            };
            dynamicForm.options.form.fields["db_named_account"] = {
                type: "text",
                display: false,
                label: "DB_Named_Account",
                id: "DB_Named_Account",
                name: "DB_Named_Account"
            };
            dynamicForm.options.form.fields["db_demandbaseid"] = {
                type: "text",
                display: false,
                label: "DB_DemandBaseID",
                id: "DB_DemandBaseID",
                name: "DB_DemandBaseID"
            };
            dynamicForm.options.form.fields["db_duns_number"] = {
                type: "text",
                display: false,
                label: "DB_DUNS_Number",
                id: "DB_DUNS_Number",
                name: "DB_DUNS_Number"
            };
            dynamicForm.options.form.fields["db_oracle_partyid"] = {
                type: "text",
                display: false,
                label: "DB_Oracle_PartyID",
                id: "DB_Oracle_PartyID",
                name: "DB_Oracle_PartyID"
            };
            dynamicForm.options.form.fields["db_salesforce_accountid"] = {
                type: "text",
                display: false,
                label: "DB_SalesForce_AccountID",
                id: "DB_SalesForce_AccountID",
                name: "DB_SalesForce_AccountID"
            };
            dynamicForm.options.form.fields["f_formdata_alert_to"] = {
                type: "text",
                display: false,
                label: "F_FormData_Alert_To",
                id: "F_FormData_Alert_To",
                name: "F_FormData_Alert_To"
            };
            dynamicForm.options.form.fields["f_formdata_alert_subject"] = {
                type: "text",
                display: false,
                label: "F_FormData_Alert_Subject",
                id: "F_FormData_Alert_Subject",
                name: "F_FormData_Alert_Subject"
            };
            dynamicForm.options.form.fields["f_formdata_alert_onlyif"] = {
                type: "text",
                display: false,
                label: "F_FormData_Alert_OnlyIF",
                id: "F_FormData_Alert_OnlyIF",
                name: "F_FormData_Alert_OnlyIF"
            };
        });
        $.when(deferred).then(function() {});
        return deferred;
    };
    dynamicForm.UI = {
        Loading: {
            Show: function(container_id) {
                if (typeof container_id === "undefined" || $("#" + container_id).length < 1) {
                    container_id = dynamicForm.options.elqFormContainerId;
                }
                var imgUrl = dynamicForm.Util.GetUrlPrefix() + '/forms/img/spinner.gif';
                $("#" + container_id).hide();
                if ($("#Loading").length > 0) {
                    $("#Loading").show();
                } else {
                    $("#" + container_id).before('<div id="Loading" class="ajax-loader"><img src="' + imgUrl + '" alt="Loading" title="Loading" /></div>');
                    var loading = $("#Loading");
                    loading.css("width", "auto").css("text-align", "center");
                }
            },
            Hide: function(container_id) {
                if (typeof container_id === "undefined" || $("#" + container_id).length < 1) {
                    container_id = dynamicForm.options.elqFormContainerId;
                }
                $("#Loading").hide();
                $("#" + container_id).show();
            }
        }
    };
    dynamicForm.init = function(opts) {
        var deferred = $.Deferred();
        if ($('script[src*="elqImg"]').length < 1) {
            dynamicForm.Util.GetScript("/forms/scripts/vendor/elq/elqImg.js");
        }
        if ($('script[src*="elqCfg"]').length < 1) {
            dynamicForm.Util.GetScript("/forms/scripts/vendor/elq/elqCfg.js");
        }
        var scode_loaded = new $.Deferred(),
            build_opts = dynamicForm.BuildOptions(opts);
        $.when(build_opts).then(function() {
            if (dynamicForm.options.type === dynamicForm.constants.TYPE.MODAL) {
                $("section.rh-form").removeClass("reversed").css("padding-top", "1.5rem");
            }
            if (dynamicForm.options.type === dynamicForm.constants.TYPE.DIRECT) {
                $("section.rh-form").addClass("reversed");
            }
            if (dynamicForm.options.load_scode !== 'false') {
                if (typeof s === "undefined") {
                    // TODO: check to see if error is 404, then go get from redhat.com
                    // TODO: ???
                    // TODO: Profit
                    scode_loaded = dynamicForm.Util.GetScript("/j/s_code.js");
                } else {
                    scode_loaded.resolve();
                }
            } else {
                scode_loaded.resolve();
            }
            $.when(scode_loaded).then(function() {
                var fldName, fldObj, key;
                if (dynamicForm.options.hideStandardFields) {
                    try {
                        for (key in dynamicForm.options.hideStandardFields) {
                            try {
                                fldName = dynamicForm.options.hideStandardFields[key];
                                fldObj = dynamicForm.options.form.fields[fldName.toLowerCase()];
                                fldObj.display = false;
                            } catch (e) {
                                //console.error("[dynamicForm logging]: ", e);
                            }
                        }
                    } catch (e) {
                        //console.error("[dynamicForm logging]: ", e);
                    }
                }
                if (dynamicForm.options.showAdditionalFields) {
                    try {
                        for (key in dynamicForm.options.showAdditionalFields) {
                            try {
                                fldName = dynamicForm.options.showAdditionalFields[key];
                                fldObj = dynamicForm.options.form.fields[fldName.toLowerCase()];
                                fldObj.display = true;
                                if (typeof fldObj.label === 'undefined') {
                                    fldObj.label = fldObj.name;
                                }
                            } catch (e) {
                                //console.error("[dynamicForm logging]: ", e);
                            }
                        }
                    } catch (e) {
                        //console.error("[dynamicForm logging]: ", e);
                    }
                }
                dynamicForm.elqTracker = new $.elq(dynamicForm.options.elqSiteId);
                $.fn.elqTrack(dynamicForm.options.elqSiteId);
                dynamicForm.elqTracker.pageTrack({
                    url: dynamicForm.options.urls.elqLookups[0]
                });
                deferred.resolve();
            });
        });
        $.when(deferred).then(function() {
            dynamicForm.Util.Testing.Show();
        });
        return deferred;
    };
    dynamicForm.Start = function(opts) {
        var deferred = $.Deferred();
        //initialize dynamic form with options from page if available
        $.when(dynamicForm.init(opts)).then(function() {
            //kick off tracking scripts for initial page load
            dynamicForm.Tracking('init');
            //show loading indicator
            dynamicForm.UI.Loading.Show();
            //assume view is FORM unless otherwise indicated
            var view = dynamicForm.options.view || dynamicForm.constants.VIEW.FORM;
            //wait for eloqua data lookups to complete
            $.when(dynamicForm.Lookup.All(),dynamicForm.Lookup.Contact()).then(function() {
                // Check if there is a "container" object on the page
                //     This decides if it"s an in-line form or a modal form
                // Look for Query String Parameters
                //     Specified view destination can be sent along
                var container = $("#" + dynamicForm.options.elqFormContainerId);
                dynamicForm.options.display_method = dynamicForm.constants.TYPE.DIRECT;
                if (container.length < 1) {
                    dynamicForm.options.view = dynamicForm.constants.TYPE.MODAL;
                }
                if (dynamicForm.options.view !== dynamicForm.constants.VIEW.SEND_MSG && dynamicForm.options.view !== dynamicForm.constants.VIEW.DOWNLOAD) {
                    try {
                        if (window.top === window.self) {
                            //form is embedded in another window
                            dynamicForm.options.display_method = dynamicForm.constants.TYPE.INLINE;
                            if (document.location.pathname === '/forms/' || document.location.pathname === '/forms') {
                                dynamicForm.options.display_method = dynamicForm.constants.TYPE.DIRECT;
                                //} else {
                                //console.info("document.location.pathname: ", document.location.pathname);
                            }
                        } else {
                            //form is an iframe, and likely in modal
                            //TODO: when converted from iframe, need to find way to determine this...
                            dynamicForm.options.display_method = dynamicForm.constants.TYPE.DIRECT;
                        }
                    } catch (e) {
                        //console.error("[dynamicForm logging]: ", e);
                    }
                }
                switch (dynamicForm.options.view) {
                    case dynamicForm.constants.TYPE.MODAL:
                        deferred = dynamicForm.ModalWindow.Start();
                        break;
                    case dynamicForm.constants.VIEW.SEND_MSG:
                        //send message to parent to display submission response (view=download)
                        deferred = dynamicForm.SubmissionResponse.SendMessage();
                        break;
                    case dynamicForm.constants.VIEW.CONVERSION:
                    case dynamicForm.constants.VIEW.DOWNLOAD:
                        //send to submission response (query string parameter is download or conversion)
                        deferred = dynamicForm.SubmissionResponse.Start();
                        break;
                    case dynamicForm.constants.VIEW.AUTO:
                        //attempt to send to auto submit, unless...
                        //1. There are UDF / Custom Questions
                        if (typeof dynamicForm.options.CustomQuestions !== "undefined") {
                            if (dynamicForm.options.CustomQuestions.length > 0) {
                                dynamicForm.options.view = dynamicForm.constants.VIEW.FORM;
                                deferred = dynamicForm.form.Start();
                                break;
                            } else {
                                if (typeof dynamicForm.data.GetElqOffer[dynamicForm.options.offer_id] !== "undefined") {
                                    //no offer was specified (not bad error)
                                    if (dynamicForm.options.no_offer) {
                                        deferred = dynamicForm.Auto.Start();
                                    } else {
                                        if (typeof dynamicForm.data.GetElqOffer[dynamicForm.options.offer_id](dynamicForm.options.lookup.offer.fields.assetUrl) === "undefined") {
                                            //2. no offer found
                                            deferred = dynamicForm.error_message.Start();
                                        } else {
                                            deferred = dynamicForm.Auto.Start();
                                        }
                                    }
                                } else {
                                    deferred = dynamicForm.form.Start();
                                }
                            }
                            break;
                        } else {
                            dynamicForm.options.view = dynamicForm.constants.VIEW.FORM;
                            deferred = dynamicForm.form.Start();
                            break;
                        }
                        break;
                    case dynamicForm.constants.VIEW.BAD_OFFER:
                        $("#A_UX_Status").val("Bad Offer");
                        deferred = dynamicForm.form.Start();
                        break;
                    case dynamicForm.constants.VIEW.FORM:
                        //$("#A_UX_Status").val("Bad Offer");
                        deferred = dynamicForm.form.Start();
                        break;
                }
            });
        });
        $.when(deferred).then(function() {
            //start done
        });
        return deferred;
    };
    //Uses Handlebars templates to generate form elements and output the needed HTML
    dynamicForm.UI.Template = {
        //generate list of "related" offers, hard coded at the moment, but configurable via dynamicForm.options.Related
        related: function(obj) {
            var tpl = Handlebars.compile('<a class="promo-offer" href="{{url}}" target="_blank"><div class="row-fluid related-links"><div class="span2 icon-container"><span class="promo-icon {{icon}}" aria-hidden="true" data-icon=""></span></div><div class="span9 content"><h>{{title}}</h2><p>{{text}}</p></div><div class="span1 arrow-container"><img src="//www.redhat.com/g/icons/go-arrow-gray2.png"></div></div></a>'),
                output = tpl.render(obj),
                form_css,
                cssFiles = [
                    "//www.redhat.com/assets/fonts/brand-icons/brand-icons-forms.css",
                    "//img.en25.com/Web/RedHat/multi-offer_09032013.css",
                    "//img.en25.com/Web/RedHat/webfonts_09032013.css"
                ];
            //TODO: no_css check and move into form CSS/SASS
            for (var i in cssFiles) {
                if ($('head link[href*="' + cssFiles[i] + '"]').length < 1) {
                    try {
                        form_css = document.createElement("link");
                        form_css.rel = "stylesheet";
                        form_css.href = cssFiles[i];
                        document.getElementsByTagName("head")[0].appendChild(form_css);
                    } catch (e) {
                        //console.error(e);
                    }
                }
            }
            obj.title = dynamicForm.options.RelatedTitle;
            return output;
        },
        Form: {
            //generate html of form element based on type and usage
            //type="hidden" is forced if the form is to be auto submitted.
            _GenerateElement: function(context) {

                context.group_cls = "control-group form-group";

                if (context.type !== 'multi' && context.type !== 'select') {
                    if (!dynamicForm.Util.HasValue(context.value)) {

                        context.value = "";
                    }
                }
                if (!dynamicForm.Util.HasValue(context.cls)) {
                    context.cls = "form-control";
                }
                if (!dynamicForm.Util.HasValue(context.attr)) {
                    context.attr = "";
                }

                if (dynamicForm.Util.HasValue(context.udf) && context.udf) {
                    context.group_cls = context.group_cls + " udf";
                }

                if (context.name === "C_EmailAddress") {
                    context.group_cls = context.group_cls + " email";
                }
                if (!dynamicForm.Util.HasValue(context.attr)) {
                    context.attr = "";
                }
                if (!dynamicForm.Util.HasValue(context.name)) {
                    context.name = context.id;
                }
                //if autosubmit, all fields should be hidden
                if (dynamicForm.options.view === dynamicForm.constants.VIEW.AUTO) {
                    context.type = 'hidden';
                } else if (dynamicForm.options.view === dynamicForm.constants.VIEW.AUTO) {
                    context.type = 'hidden';
                } else {
                    if ((dynamicForm.options.view !== dynamicForm.constants.VIEW.AUTO) && !context.display) {
                        context.type = 'hidden';
                    }
                }
                var source = '';
                switch (context.type) {
                    case "hidden":
                        source = '<input {{attr}} class="{{cls}}" type="{{type}}" name="{{name}}" id="{{id}}" value="{{{value}}}">';
                        break;
                    case "textarea":
                        source = '<div class="{{group_cls}}"><label class="required col-sm-2 control-label" for="{{name}}">{{{label}}}</label><div class="controls col-sm-10"><textarea {{attr}} class="form-control required {{cls}}" name="{{name}}" id="{{id}}">{{{value}}}</textarea></div></div>';
                        break;
                    case "tel":
                        //falls through
                    case "number":
                        //falls through
                    case "text":
                        //falls through
                    case "email":
                        source = '<div class="{{group_cls}}"><label class="required col-sm-2 control-label" for="{{name}}">{{{label}}}</label><div class="controls col-sm-10"><input {{attr}} class="form-control required {{cls}}" type="{{type}}" name="{{name}}" id="{{id}}" value="{{{value}}}"></div></div>';
                        break;
                    case "multiple":
                        context.size = context.size || 3;
                        context.attr = context.attr + ' multiple="multiple" size="' + context.size + '"';
                        source = '<div class="{{group_cls}}"><label class="required col-sm-2 control-label" for="{{name}}">{{{label}}}</label><div class="controls col-sm-10"><select {{attr}} class="form-control required {{cls}}" name="{{name}}" id="{{id}}">{{#option_list options}}<option value="{{{val}}}">{{{label}}}</option>{{/option_list}}</select></div></div>';
                        break;
                    case "select":
                        source = '<div class="{{group_cls}}"><label class="required col-sm-2 control-label" for="{{name}}">{{{label}}}</label><div class="controls col-sm-10"><select {{attr}} class="form-control required {{cls}}" name="{{name}}" id="{{id}}">{{#option_list options}}<option value="{{{val}}}">{{{label}}}</option>{{/option_list}}</select></div></div>';
                        break;
                    case "button":
                        // falls through
                    case "submit":
                        source = '<div class="form-group form-action"><div class="col-sm-10 col-sm-offset-2"><button {{attr}} data-type="{{type}}" name="{{name}}" id="{{id}}" class="{{cls}}">{{{value}}}</button></div></div>';
                        break;
                }
                var template = Handlebars.compile(source);
                return template(context);
            },
            //generate html of dynamic form  on type and usage
            GenerateHTML: function() {
                var tmpl = "",
                    dfd = new $.Deferred(),
                    question, formHTML = '',
                    i, key, field, html, attributes;
                dynamicForm.data.StandardFieldCount = 0;
                // 1. Base form fields
                //var keys = Object.keys(dynamicForm.options.form.fields);
                try {
                    for (key in dynamicForm.options.form.fields) {
                        field = dynamicForm.options.form.fields[key];
                        html = dynamicForm.UI.Template.Form._GenerateElement(field);
                        formHTML = formHTML + html;
                        if (field.standard && field.display) {
                            dynamicForm.data.StandardFieldCount++;
                        }
                    }
                } catch (e) {
                    //console.error("[dynamic form] logging: ", e);
                }
                if (typeof dynamicForm.options.CustomQuestions !== "undefined") {
                    for (i = 0; i < dynamicForm.options.CustomQuestions.length; i++) {
                        question = dynamicForm.options.CustomQuestions[i];
                        $.validator.addClassRules("UDF_0" + (i + 1) + "_Question", {
                            required: true
                        });
                        if (typeof question === "string") {
                            formHTML = formHTML.concat(dynamicForm.UI.Template.Form._GenerateElement({
                                type: "text",
                                display: false,
                                value: question,
                                attr: "",
                                id: "UDF_0" + (i + 1) + "_Question",
                                name: "UDF_0" + (i + 1) + "_Question"
                            }));
                            attributes = question.attr || "";
                            if (question.updatesOfferId) {
                                attributes += "data-updates_offer_id=" + question.updatesOfferId;
                            }
                            formHTML = formHTML.concat(dynamicForm.UI.Template.Form._GenerateElement({
                                label: question,
                                type: "textarea",
                                display: true,
                                name: "UDF_0" + (i + 1) + "_Answer",
                                attr: attributes,
                                id: "UDF_0" + (i + 1) + "_Answer",
                                cls: "expanding",
                                value: "",
                                udf: true
                            }));
                        } else {
                            if (typeof question === "object") {
                                formHTML = formHTML.concat(dynamicForm.UI.Template.Form._GenerateElement({
                                    type: "text",
                                    display: false,
                                    value: question.label,
                                    id: "UDF_0" + (i + 1) + "_Question",
                                    name: "UDF_0" + (i + 1) + "_Question"
                                }));
                                attributes = question.attr || "";
                                if (question.updatesOfferId) {
                                    attributes += "data-updates_offer_id=" + question.updatesOfferId;
                                }
                                formHTML = formHTML.concat(dynamicForm.UI.Template.Form._GenerateElement({
                                    update: question.update || "",
                                    label: question.label,
                                    display: question.display || true,
                                    attr: attributes,
                                    type: question.type || "select",
                                    name: "UDF_0" + (i + 1) + "_Answer",
                                    id: "UDF_0" + (i + 1) + "_Answer",
                                    cls: "form-control required",
                                    value: "",
                                    options: question.options,
                                    udf: true
                                }));
                            }
                        }
                    }
                }
                if (dynamicForm.options.view !== dynamicForm.constants.VIEW.AUTO) {
                    //3.Close and add button
                    var button_obj = {
                        attr: '',
                        type: "submit",
                        display: true,
                        value: dynamicForm.options.FormCallToAction,
                        name: "FormSubmitButton",
                        id: "FormSubmitButton",
                        cls: "btn cta-primary"
                    };
                    //cls: "btn btn-danger btn-block cta-primary"
                    formHTML = formHTML.concat(dynamicForm.UI.Template.Form._GenerateElement(button_obj));
                }

                var context = {
                    elqFormSubmitFrame: dynamicForm.options.elqFormSubmitFrame,
                    form: {
                        action: "https://s" + dynamicForm.options.elqSiteId + ".t.eloqua.com/e/f2",
                        method: "POST"
                    },
                    Logo: {
                        title: "Red Hat Logo",
                        src: dynamicForm.Util.GetUrlPrefix() + "/forms/img/rh-logo103x36.png",
                        height: "36",
                        width: "103",
                        class: "rh-logo"
                    },
                    elqFormName: dynamicForm.options.elqFormName,
                    FormTitle: dynamicForm.options.FormTitle,
                    FormIntro: dynamicForm.options.FormIntro,
                    FormPrivacyText: dynamicForm.options.FormPrivacyText,
                    FormPrivacyURL: dynamicForm.options.FormPrivacyURL,
                    formHTML: formHTML,
                    ShowLogo: ((dynamicForm.options.view === dynamicForm.constants.VIEW.FORM) && (dynamicForm.options.display_method !== dynamicForm.constants.TYPE.INLINE)),
                    contact_email: ""
                };

                if ( dynamicForm.options.contact_known ) {
                    context.contact_email = dynamicForm.options.email;
                    tmpl = Handlebars.compile( dynamicForm.options.WelcomeMessage );
                    context.FormIntro = tmpl(context);
                }

                var template = Handlebars.compile('<iframe id="{{elqFormSubmitFrame}}" class="hidden" name="{{elqFormSubmitFrame}}" height="0" width="0"></iframe><form class="form-horizontal" role="form" target="{{elqFormSubmitFrame}}" action="{{form.action}}" method="{{form.method}}" id="{{elqFormName}}" name="{{elqFormName}}"><section class="form-header"><div class="form-group">{{#if ShowLogo}}<div class="col-sm-2"><img alt="Logo.alt" title="{{{Logo.title}}}" src="{{Logo.src}}" height="{{Logo.height}}" width="{{Logo.width}}" class="{{Logo.class}}"></div>{{#if FormTitle}}<div class="col-sm-offset-2 col-sm-10"><h1>{{{FormTitle}}}</h1></div>{{/if}}{{else}}{{#if FormTitle}}<div class="col-sm-offset-2 col-sm-10"><h4>{{{FormTitle}}}</h4></div>{{/if}}{{/if}}</div><div class="form-group">{{#if FormIntro}}<div class="col-sm-12 form-message">{{{FormIntro}}}</div>{{/if}}<div class="col-sm-offset-2 col-sm-10" id="validationMessages"></div></div></section><section class="form-content">{{{formHTML}}}</section>{{#if FormPrivacyText}}<section class="form-footer"><div class="form-group"><div class="col-sm-10 col-sm-offset-2"><a href="{{FormPrivacyURL}}" target="_blank">{{FormPrivacyText}}</a></div></div></section>{{/if}}</form>');
                $.when(dynamicForm.UI.Template.Form.html = template(context)).then(function() {
                    dfd.resolve();
                });
                //debugger;
                return dfd.promise();
            },
            GetHTML: function() {
                Handlebars.registerHelper('option_list', function(items, options) {
                    var i, l = items.length,
                        out = "",
                        _items = items;
                    for (i = 0; i < l; i++) {
                        if (typeof items[i] === 'string') {
                            if (items[i] !== dynamicForm.options.DefaultValue) {
                                _items[i] = {
                                    val: decodeURIComponent(items[i]),
                                    label: decodeURIComponent(items[i])
                                };
                            } else {
                                _items[i] = {
                                    val: "",
                                    label: decodeURIComponent(items[i])
                                };
                            }
                        }
                    }
                    for (i = 0; i < l; i++) {
                        out = out + options.fn(_items[i]);
                    }
                    return out;
                });
                var dfd = new $.Deferred(),
                    html;
                if (typeof dynamicForm.UI.Template.Form.html === "undefined") {
                    dfd = dynamicForm.UI.Template.Form.GenerateHTML();
                } else {
                    dfd.resolve();
                }
                $.when(dfd).then(function() {
                    html = dynamicForm.UI.Template.Form.html;
                });
                $("#wrapper").css("#background", "transparent");
                return html;
            }
        },
        Thanks: {
            GenerateHTML: function() {
                var i, dfd = new $.Deferred(),
                    downloadUrl = dynamicForm.options.asseturl;

                    //console.log("downloadUrl: ", downloadUrl);

                if (typeof dynamicForm.data.GetElqOffer !== 'undefined') {
                    downloadUrl = dynamicForm.data.GetElqOffer[dynamicForm.options.offer_id](dynamicForm.options.lookup.offer.fields.assetUrl);
                    if (dynamicForm.data.UpdatedOfferId) {
                        downloadUrl = dynamicForm.data.GetElqOffer[dynamicForm.data.UpdatedOfferId](dynamicForm.options.lookup.offer.fields.assetUrl);
                    }
                }

                var _CallToAction = "",
                    _ShowCallToAction = true;
                if (dynamicForm.Util.HasValue(dynamicForm.options.ThanksCallToAction) && dynamicForm.Util.HasValue(downloadUrl)) {
                    _CallToAction = '<a href="' + downloadUrl + '" class="btn cta-primary" target="_blank" id="ActionButton">' + dynamicForm.options.ThanksCallToAction + '</a>';
                }
                //console.log("_CallToAction: ", _CallToAction);

                if ((dynamicForm.options.no_offer || !dynamicForm.options.ShowThanksButton) && !dynamicForm.Util.HasValue(downloadUrl)) {
                    _ShowCallToAction = false;
                }
                var context = {
                    ContainerName: "DynamicFormThankYou",
                    Title: dynamicForm.options.ThanksTitle,
                    Message: dynamicForm.options.ThanksText,
                    ShowCallToAction: _ShowCallToAction,
                    CallToAction: _CallToAction,
                    VerificationId: dynamicForm.Util.GetVerificationId(),
                    Logo: {
                        title: "Red Hat Logo",
                        src: dynamicForm.Util.GetUrlPrefix() + "/forms/img/rh-logo103x36.png",
                        height: "36",
                        width: "103",
                        class: "rh-logo"
                    },
                    ShowLogo: (
                        (dynamicForm.options.view === dynamicForm.constants.VIEW.CONVERSION ||
                            dynamicForm.options.view === dynamicForm.constants.VIEW.DOWNLOAD ||
                            dynamicForm.options.view === dynamicForm.constants.VIEW.AUTO) &&
                        (dynamicForm.options.display_method === dynamicForm.constants.TYPE.DIRECT ||
                            dynamicForm.options.display_method !== dynamicForm.constants.TYPE.INLINE)
                    )
                };


                var headerTmpl = Handlebars.compile('<section class="form-header"><div class="form-group">{{#if ShowLogo}}<div class="col-sm-2"><img alt="Logo.alt" title="{{{Logo.title}}}" src="{{Logo.src}}" height="{{Logo.height}}" width="{{Logo.width}}" class="{{Logo.class}}"></div>{{#if Title}}<div class="col-sm-10"><h1>{{{Title}}}</h1></div>{{/if}}{{else}}{{#if Title}}<div class="col-sm-12"><h2>{{{Title}}}</h2></div>{{/if}}{{/if}}</div></section>');
                var contentTmpl = Handlebars.compile('<section class="form-content"><div class="col-sm-12">{{{Message}}}</div>{{#if ShowCallToAction}}<div class="col-sm-offet-2 col-sm-10">{{{CallToAction}}}</div>{{/if}}</section>');
                var footerTmpl = Handlebars.compile('<section class="form-footer"><div class="col-sm-12 text-muted" id="verificationId">Verification ID: {{VerificationId}}</div></section>');

                var header = headerTmpl(context),
                    content = contentTmpl(context),
                    footer = footerTmpl(context),
                    RelatedLinks = "",
                    SocialLinks = "";

                try {
                    //reset formHTML, just in case...
                    if ((typeof dynamicForm.options.Related !== "undefined" && dynamicForm.options.Related.length > 0)) {
                        RelatedLinks = "<section class=\"form-group related-links\">";
                        var relatedMax = dynamicForm.options.Related.length;
                        if (relatedMax > 3) {
                            relatedMax = 3;
                        }
                        RelatedLinks = RelatedLinks.concat('<div class="col-sm-12 row-fluid"><h1>' + dynamicForm.options.RelatedTitle + '</h1></div>');

                        for (i = 0; i < relatedMax; i++) {
                            var related = dynamicForm.UI.Template.related(dynamicForm.options.Related[i]);
                            RelatedLinks = RelatedLinks.concat(related);
                        }
                        RelatedLinks = RelatedLinks.concat("</section>");
                    }

                    if (dynamicForm.options.display_method === dynamicForm.constants.TYPE.DIRECT) {
                        SocialLinks = SocialLinks.concat('<section class="form-group"><div class="col-sm-12"><ul class="social-icons"><li><a href="' + dynamicForm.options.social.google.url + '" target="_blank"><img src="http://www.redhat.com/summit/2013/img/icon_googleplus_16.png"></a></li><li><a href="' + dynamicForm.options.social.twitter.url + '" target="_blank"><img src="//www.redhat.com/g/connect/twitter-i.png"></a></li><li><a href="' + dynamicForm.options.social.facebook.url + '" target="_blank"><img src="//www.redhat.com/g/connect/facebook-i.png"></a></li><li><a href="http://youtube.com/user/RedHatVideos" target="_blank"><img src="//www.redhat.com/g/connect/youtube-i.png"></a></li><li><a href="' + dynamicForm.options.social.linkedin.url + '" target="_blank"><img src="//www.redhat.com/g/connect/linkedin-i.png"></a></li></ul></div></section>');
                        //check this
                    }
                } catch (e) {
                    //console.error("[dynamicForm logging]: ", e);
                } finally {
                    dynamicForm.UI.Template.Thanks.html = '<div id="DynamicFormThankYou" class="hero-unit">' + header + content + footer + RelatedLinks + SocialLinks + '</div>';
                    dfd.resolve();
                }
                return dfd.promise();
            },
            GetHTML: function() {
                var dfd = new $.Deferred(),
                    html;
                if (typeof dynamicForm.UI.Template.Thanks.html === "undefined") {
                    dfd = dynamicForm.UI.Template.Thanks.GenerateHTML();
                } else {
                    dfd.resolve();
                }
                $.when(dfd).then(function() {
                    html = dynamicForm.UI.Template.Thanks.html;
                });
                return html;
            }
        },
        Error: {
            GenerateHTML: function() {
                //reset formHTML, just in case...
                dynamicForm.UI.Template.Error.html = "";
                var html = "".concat("<div id=\"Error\" class=\"hero-unit\">");
                if (dynamicForm.options.display_method === dynamicForm.constants.TYPE.DIRECT) {
                    html = html.concat("<h1>", dynamicForm.options.ErrorTitle, "</h1>");
                } else {
                    html = html.concat("<h2>", dynamicForm.options.ErrorTitle, "</h2>");
                }
                if (typeof dynamicForm.options.ErrorMessage !== "undefined") {
                    html = html.concat("<p>", dynamicForm.options.ErrorMessage, "</p>");
                }
                html = html.concat("</div>");
                dynamicForm.UI.Template.Error.html = html;
                return dynamicForm.UI.Template.Error.html;
            },
            GetHTML: function() {
                var dfd = new $.Deferred(),
                    html;
                if (typeof dynamicForm.UI.Template.Error.html === "undefined") {
                    dfd = dynamicForm.UI.Template.Error.GenerateHTML();
                } else {
                    dfd.resolve();
                }
                $.when(dfd).then(function() {
                    html = dynamicForm.UI.Template.Error.html;
                });
                return html;
            }
        }
    };
    dynamicForm.buildOption = function(val, label) {
        return $("<option />").attr("value", val).text(label);
    };
    dynamicForm.data = {
        SubmissionHandled: false,
        prepop: {},
        elq_guid: dynamicForm.constants.UNAVAILABLE
    },
    dynamicForm.Lookup = {

        data: {},
        All: function() {
            var options = dynamicForm.options,
                all = new $.Deferred(),
                guid = new $.Deferred(),
                visitor = new $.Deferred(),
                tactic = new $.Deferred(),
                offer = new $.Deferred();
            dynamicForm.Lookup.elqGuid().done(function() {
                guid.resolve();
                dynamicForm.Lookup.Visitor().done(function() {
                    visitor.resolve();
                });
            });
            dynamicForm.Lookup.Tactic().done(function() {
                tactic.resolve();
            });
            dynamicForm.Lookup.Offer().done(function() {
                offer.resolve();
            });
            $.when(guid, visitor, tactic, offer).then(function() {
                all.resolve();
            });
            $.when(all).then(dynamicForm.Util.Testing.Update('data'));
            return all;
        },
        elqGuid: function(callback) {
            var elqGuid = $.Deferred();
            $.when(dynamicForm.elqTracker.GetElqGuid()).then(function() {
                dynamicForm.data.prepop['elqCustomerGUID'] = dynamicForm.data.elq_guid;
                dynamicForm.data.prepop['A_ElqVisitorGuid'] = dynamicForm.data.elq_guid;
                $("#elqCustomerGUID").val(dynamicForm.data.elq_guid);
                $("#A_ElqVisitorGuid").val(dynamicForm.data.elq_guid);
                elqGuid.resolve();
            }, function() {
                elqGuid.resolve();
            });
            $.when(elqGuid).then(dynamicForm.Util.Testing.Update('data'));
            return elqGuid;
        },
        Visitor: function() {
            var deferred = new $.Deferred(),
                lookup_def = new $.Deferred(),
                fields = dynamicForm.options.fields.visitor,
                lookup = dynamicForm.elqTracker.GetData({
                    lookup: dynamicForm.options.lookup.visitor.key,
                    lookup_func: "GetElqVisitor"
                });
            lookup.done(function() {
                if (typeof dynamicForm.data.GetElqVisitor === 'function') {
                    var fieldval = '';
                    var i = 0;
                    for (i = 0; i < fields.length; i++) {
                        if (dynamicForm.data.GetElqVisitor(fields[i]) !== '' && dynamicForm.data.GetElqVisitor(fields[i]) !== dynamicForm.constants.UNAVAILABLE) {
                            dynamicForm.data.prepop[fields[i]] = dynamicForm.data.GetElqVisitor(fields[i]);
                        }
                        if (i == fields.length - 1) {
                            deferred.resolve();
                        }
                    }
                } else {
                    deferred.resolve();
                }
            }).fail(function() {
                deferred.resolve();
            });
            $.when(deferred).then(dynamicForm.Util.Testing.Update('data'));
            return deferred;
        },
        Contact: function() {
            var deferred = new $.Deferred();
            var email = dynamicForm.Util.GetEmailAddress();
            if (!dynamicForm.Util.HasValue(email) || (typeof dynamicForm.data.GetElqVisitor === 'undefined' && typeof dynamicForm.data.GetElqContact === 'function')) {
                deferred.resolve();
            } else {
                var ContactLookupParam = ''.concat('<', dynamicForm.options.lookup.contact.query, '>', email, '</', dynamicForm.options.lookup.contact.query, '>'),
                    lookup = dynamicForm.elqTracker.GetData({
                        lookup: dynamicForm.options.lookup.contact.key,
                        lookup_param: ContactLookupParam,
                        lookup_func: "GetElqContact"
                    });
                lookup.done(function() {
                    var fields = dynamicForm.options.fields.contact;
                    var fieldval = '';
                    var i = 0;

                    if (typeof dynamicForm.data.GetElqContact === 'function') {
                        if ( dynamicForm.Util.GetEmailAddress() ) {
                            dynamicForm.options.contact_known = true;
                        }

                        for (i = 0; i < fields.length; i++) {
                            if (dynamicForm.data.GetElqContact(fields[i]) !== '' && dynamicForm.data.GetElqContact(fields[i]) !== dynamicForm.constants.UNAVAILABLE) {
                                if ($("#" + fields[i]).attr('type') !== "hidden") {
                                    $("#" + fields[i]).val(dynamicForm.data.GetElqContact(fields[i]));
                                }
                            }
                            if (i == fields.length - 1) {
                                deferred.resolve();
                            }
                        }
                    } else {
                        deferred.resolve();
                    }
                }).fail(function() {
                    deferred.resolve();
                });
            }
            $.when(deferred).then(dynamicForm.Util.Testing.Update('data'));
            return deferred;
        },
        Tactic: function() {
            var deferred = $.Deferred(),
                TacticID = dynamicForm.Util.GetCookieValue('rh_omni_tc'),
                fields = dynamicForm.options.fields.Tactic,
                TacticLookupParam = ''.concat('<', dynamicForm.options.lookup.tactic.query, '>', TacticID, '</', dynamicForm.options.lookup.tactic.query, '>'),
                lookup = dynamicForm.elqTracker.GetData({
                    lookup: dynamicForm.options.lookup.tactic.key,
                    lookup_param: TacticLookupParam,
                    lookup_func: "GetElqTactic"
                });
            lookup.done(function() {
                var fieldval = '';
                //once the script is loaded, populate the fields accordingly
                var i = 0;
                if (typeof dynamicForm.data.GetElqTactic === 'function') {
                    for (i = 0; i < fields.length; i++) {
                        dynamicForm.data.prepop[fields[i]] = dynamicForm.data.GetElqTactic(fields[i]) || dynamicForm.constants.UNAVAILABLE;
                        $("#" + fields[i]).val(dynamicForm.data.GetElqTactic(fields[i]) || dynamicForm.constants.UNAVAILABLE);
                        if (i == fields.length - 1) {
                            deferred.resolve();
                        }
                    }
                } else {
                    for (i = 0; i < fields.length; i++) {
                        dynamicForm.data.prepop[fields[i]] = dynamicForm.constants.UNAVAILABLE;
                        $("#" + fields[i]).val(dynamicForm.constants.UNAVAILABLE);
                        if (i == fields.length - 1) {
                            deferred.resolve();
                        }
                    }
                }
            });
            $.when(deferred).then(dynamicForm.Util.Testing.Update('data'));
            return deferred;
        },
        Offer: function(opts) {
            var deferred = new $.Deferred(),
                ms = new Date().getMilliseconds(),
                offer_id = dynamicForm.data.UpdatedOfferId || dynamicForm.Util.GetOfferId();
            if (dynamicForm.options.no_offer) {
                deferred.resolve();
            } else {
                if (!dynamicForm.Util.HasValue(offer_id) || (typeof dynamicForm.data.GetElqOffer !== 'undefined' && typeof dynamicForm.data.GetElqOffer[offer_id] === 'function')) {
                    deferred.resolve();
                } else {
                    var fields = dynamicForm.options.fields.Offer;
                    var OfferLookupParam = ''.concat('<', dynamicForm.options.lookup.offer.query, '>', offer_id, '</', dynamicForm.options.lookup.offer.query, '>');
                    var lookup = new dynamicForm.elqTracker.GetData({
                        lookup: dynamicForm.options.lookup.offer.key,
                        lookup_param: OfferLookupParam,
                        lookup_func: "GetElqOffer",
                        key: offer_id
                    });
                    lookup.done(function() {
                        var i = 0, isUpdatedOffer = false;

                        isUpdatedOffer = (offer_id === dynamicForm.data.UpdatedOfferId);

                        if (typeof dynamicForm.data.GetElqOffer !== 'undefined') {
                            if (typeof dynamicForm.data.GetElqOffer[offer_id] === 'function') {
                                var fieldval = '';
                                //once the script is loaded, populate the fields accordingly
                                for (i = 0; i < fields.length; i++) {
                                    dynamicForm.data.prepop[fields[i]] = dynamicForm.data.GetElqOffer[offer_id](fields[i]) || dynamicForm.constants.UNAVAILABLE;
                                    if (!isUpdatedOffer) {
                                        $("#" + fields[i]).val(dynamicForm.data.GetElqOffer[offer_id](fields[i]) || dynamicForm.constants.UNAVAILABLE);
                                    }
                                    if (i === (fields.length - 1)) {
                                        deferred.resolve();
                                    }
                                }
                            } else {

                                if (dynamicForm.options.no_offer) {
                                    $("#A_UX_Status").val("No Offer: " + dynamicForm.options.offer_id);
                                } else {
                                    $("#A_UX_Status").val("Bad Offer: " + dynamicForm.options.offer_id);
                                }
                                for (i = 0; i < fields.length; i++) {
                                    dynamicForm.data.prepop[fields[i]] = dynamicForm.constants.UNAVAILABLE;
                                    if (!isUpdatedOffer) {
                                        $("#" + fields[i]).val(dynamicForm.constants.UNAVAILABLE);
                                    }
                                    if (i == fields.length - 1) {
                                        deferred.resolve();
                                    }
                                }
                            }
                        } else {
                            if (dynamicForm.options.no_offer) {
                                $("#A_UX_Status").val("No Offer: " + dynamicForm.options.offer_id);
                            } else {
                                $("#A_UX_Status").val("Bad Offer: " + dynamicForm.options.offer_id);
                            }
                            for (i = 0; i < fields.length; i++) {
                                dynamicForm.data.prepop[fields[i]] = dynamicForm.constants.UNAVAILABLE;
                                if (!isUpdatedOffer) {
                                    $("#" + fields[i]).val(dynamicForm.constants.UNAVAILABLE);
                                }
                                if (i == fields.length - 1) {
                                    deferred.resolve();
                                }
                            }
                        }
                    }).fail(function() {
                        var i = 0,
                        isUpdatedOffer = (offer_id === dynamicForm.data.UpdatedOfferId);

                        for (i = 0; i < fields.length; i++) {
                            dynamicForm.data.prepop[fields[i]] = dynamicForm.constants.UNAVAILABLE;
                            if (!isUpdatedOffer) {
                                $("#" + fields[i]).val(dynamicForm.constants.UNAVAILABLE);
                            }
                            if (i == fields.length - 1) {
                                deferred.resolve();
                            }
                        }

                    });
                }
            }
            $.when(deferred).then(dynamicForm.Util.Testing.Update('data'));
            return deferred;
        }
    };
    dynamicForm.form = {
        Validation: function(config) {
            //english format only
            $.validator.addMethod("phone", function(value, element) {
                var re = /^((((\(\d{3}\) )|(\(\d{3}\))|(\d{3}(-| |.)))\d{3}(-| |.)\d{4})|(\+?\d{2}((-| |.)\d{1,8}){1,5}))(( x| ext)\d{1,5}){0,1}$/;
                return re.test(value);
            }, "Please enter a valid phone number.");
            // NOTE - should be required and empty: QA_Ruaspambot
            $.validator.addMethod("spamalot", function(value, element) {
                return value === "";
            }, "Are you sure you're human?");
            var msg = "Please fill out all fields marked in red.";
            $("#" + dynamicForm.options.elqFormName).validate({
                onkeyup: false,
                onclick: false,
                onfocusout: false,
                rules: {
                    "C_Salutation": {
                        required: $("#C_Salutation").is(":visible")
                    },
                    "C_FirstName": {
                        required: $("#C_FirstName").is(":visible")
                    },
                    "C_LastName": {
                        required: $("#C_LastName").is(":visible")
                    },
                    "C_EmailAddress": {
                        required: $("#C_EmailAddress.require").is(":visible"),
                        email: true
                    },
                    "C_BusPhone": {
                        required: $("#C_BusPhone").is(":visible"),
                        minlength: 1
                    },
                    "C_Address1": {
                        required: $("#C_Address1").is(":visible")
                    },
                    "C_Address2": {
                        required: $("#C_Address2").is(":visible")
                    },
                    "C_Address3": {
                        required: $("#C_Address3").is(":visible")
                    },
                    "C_City": {
                        required: $("#C_City").is(":visible")
                    },
                    "C_State_Prov": {
                        required: $("#C_State_Prov").is(":visible")
                    },
                    "C_Zip_Postal": {
                        required: $("#C_Zip_Postal").is(":visible")
                    },
                    "C_Country": {
                        required: $("#C_Country").is(":visible")
                    },
                    "C_Industry1": {
                        required: $("#C_Industry1").is(":visible")
                    },
                    "C_Annual_Revenue1": {
                        required: $("#C_Annual_Revenue1").is(":visible")
                    },
                    "C_Number_of_Employees1": {
                        required: $("#C_Number_of_Employees1").is(":visible")
                    },
                    "C_Company": {
                        required: $("#C_Company").is(":visible")
                    },
                    "C_Department1": {
                        required: $("#C_Department1").is(":visible")
                    },
                    "QA_Ruaspambot": {
                        spamalot: true
                    },
                    "C_Job_Role11": {
                        required: $("#C_Job_Role11").is(":visible")
                    },
                    "A_AgreeTC": {
                        required: $("#A_AgreeTC").is(":visible")
                    }
                },
                groups: {
                    all: ["A_AgreeTC", "C_Title", "C_Address1", "C_Address2", "C_Address3", "C_City", "C_State_Prov", "C_Zip_Postal", "C_Country", "C_Industry1", "C_Annual_Revenue1", "C_Number_of_Employees1", "C_Salutation", "C_FirstName", "C_LastName", "C_EmailAddress", "C_BusPhone", "C_Company", "C_Department1", "C_Job_Role11", "UDF_01_Answer", "UDF_02_Answer", "UDF_03_Answer"].join(" ")
                },
                messages: {
                    "A_AgreeTC": msg,
                    "C_Title": msg,
                    "C_Address1": msg,
                    "C_Address2": msg,
                    "C_Address3": msg,
                    "C_City": msg,
                    "C_State_Prov": msg,
                    "C_Zip_Postal": msg,
                    "C_Country": msg,
                    "C_Industry1": msg,
                    "C_Annual_Revenue1": msg,
                    "C_Number_of_Employees1": msg,
                    "C_Salutation": msg,
                    "C_FirstName": msg,
                    "C_LastName": msg,
                    "C_EmailAddress": msg,
                    "C_BusPhone": msg,
                    "C_Company": msg,
                    "C_Department1": msg,
                    "C_Job_Role11": msg,
                    "UDF_01_Answer": msg,
                    "UDF_02_Answer": msg,
                    "UDF_03_Answer": msg
                },
                errorLabelContainer: "#validationMessages",
                showErrors: function(errorMap, error_list) {
                    clearTimeout(dynamicForm.form.timer);
                    dynamicForm.form.ValidationErrors(this, error_list);
                },
                submitHandler: function(form) {
                    if (typeof dynamicForm.data.GetElqOffer === 'undefined') {
                        if (dynamicForm.options.no_offer) {
                            $("#A_UX_Status").val("No Offer: " + dynamicForm.options.offer_id);
                        } else {
                            $("#A_UX_Status").val("Bad Offer: " + dynamicForm.options.offer_id);
                        }
                    } else {
                        dynamicForm.data.prepop["A_UX_Type"] = "Long Form";
                        $("#A_UX_Type").val("Long Form");
                    }

                    //console.log("OK, submitting...")

                    $.when(dynamicForm.form.PrepDynamicForm()).then(function() {
                        form.submit();
                    });
                },
                invalidHandler: function(event, validator) {
                    dynamicForm.UI.Loading.Show();
                    clearTimeout(dynamicForm.form.timer);
                    // "this " refers to the form
                    var errors = validator.numberOfInvalids(),
                        messages = $("#validationMessages"),
                        container = $("#" + dynamicForm.options.elqFormContainerId);
                    $("#FormSubmitButton").text(dynamicForm.options.FormCallToAction);
                    $.when(dynamicForm.Translate(document.getElementById(dynamicForm.options.elqFormContainerId))).then(function() {
                        $("#FormSubmitButton").attr("disabled", false).removeClass('disabled');
                        if (errors) {
                            messages.slideDown();
                            dynamicForm.UI.Loading.Hide();
                        }
                    });
                }
            });
        },
        UpdateFromUdf: function(field) {
            var udf_field = $(field),
                updates_offer_id = udf_field.data("updates_offer_id");
            if (updates_offer_id) {
                $("#A_UX_Status").val("New Offer Selected: " + udf_field.val());
                $("#A_OfferID_Selected").val(udf_field.val());
                dynamicForm.data.UpdatedOfferId = udf_field.val();
            }
        },
        Start: function(opts) {
            var FormInit = new $.Deferred();
            $.when(dynamicForm.Util.CheckStylesheet(), dynamicForm.Lookup.Contact()).then(function() {
                dynamicForm.Util.Testing.Show();
                dynamicForm.UI.Loading.Show();
                var hasSubmittedLongForm = false,
                    registrationDate = "",
                    channel = $.url(document.URL, false).param("channel") || "landing page",
                    offerAccessRule = dynamicForm.Util.GetOfferAccessRule();
                if (offerAccessRule === dynamicForm.constants.ACCESS_RULE.TRACKED) {
                    dynamicForm.options.view = dynamicForm.constants.VIEW.AUTO;
                }

                if (typeof dynamicForm.data.GetElqContact === "function") {
                    hasSubmittedLongForm = dynamicForm.Util.HasValue( dynamicForm.Util.GetEmailAddress() );
                    registrationDate = dynamicForm.data.GetElqContact(dynamicForm.options.lookup.contact.fields.registeredDate);
                    if (hasSubmittedLongForm && dynamicForm.Eloqua.IsRegistrationCurrent(registrationDate)) {
                        dynamicForm.options.view = dynamicForm.constants.VIEW.AUTO;
                    } else {
                        dynamicForm.options.view = dynamicForm.constants.VIEW.FORM;
                    }
                } else {
                    // $.when(dynamicForm.Lookup.Contact()).then(function() {
                    //     dynamicForm.form.Start();
                    // });
                }
                if (typeof dynamicForm.data.GetElqOffer === "function") {
                    //Always show form for event or tradeshow
                    if ((dynamicForm.data.GetElqOffer[dynamicForm.options.offer_id](dynamicForm.options.lookup.offer.fields.type).toLowerCase() === "event") || (dynamicForm.data.GetElqOffer[dynamicForm.options.offer_id](dynamicForm.options.lookup.offer.fields.type).toLowerCase() === "tradeshow")) {
                        dynamicForm.options.view = dynamicForm.constants.VIEW.FORM;
                    }
                }
                if (dynamicForm.Util.GetOfferAccessRule() === dynamicForm.constants.ACCESS_RULE.TRACKED) {
                    dynamicForm.options.view = dynamicForm.constants.VIEW.FORM;
                }
                if (typeof dynamicForm.options.CustomQuestions !== "undefined") {
                    dynamicForm.options.view = dynamicForm.constants.VIEW.FORM;
                }
                if (dynamicForm.options.no_auto) {
                    dynamicForm.options.view = dynamicForm.constants.VIEW.FORM;
                }
                switch (dynamicForm.options.view) {
                    case dynamicForm.constants.VIEW.AUTO:
                        FormInit = dynamicForm.form.Auto();
                        break;
                    case dynamicForm.constants.VIEW.FROM:
                        FormInit = dynamicForm.form.Long();
                        break;
                    default:
                        FormInit = dynamicForm.form.Long();
                }
                dynamicForm.Util.Testing.Show();
            });
            $.when(FormInit).then(function() {
                if (dynamicForm.options.testing) {
                    //write initially
                    dynamicForm.Util.Testing.Show();
                    $(":input").on('change', function() {
                        //update as needed
                        dynamicForm.Util.Testing.Show();
                    });
                }
            });
            return FormInit;
        },
        Auto: function(opts) {
            dynamicForm.UI.Loading.Show();
            var deferred = new $.Deferred(),
                channel = $.url(document.URL, false).param("channel") || "landing page",
                offer_id = dynamicForm.Util.GetOfferId(),
                trigger_omniture_def = null,
                container = $("#" + dynamicForm.options.elqFormContainerId);
            var parentFirstMinor = "";
            if ($.url(document.URL, false).param("prop14")) {
                parentFirstMinor = " | " + $.url(document.URL, false).param("prop14");
            } else {
                if ($.url(document.URL, false).param("eVar27")) {
                    parentFirstMinor = " | " + $.url(document.URL, false).param("eVar27");
                }
            }
            dynamicForm.Omniture.SetOption("pageName", "rh | " + channel + parentFirstMinor + " | " + dynamicForm.constants.OMNITURE.FIRST_MINOR_SECTION + " | " + offer_id + " | form");
            dynamicForm.Omniture.AddEvent(dynamicForm.constants.OMNITURE.EVENT.PAGE_LOAD);
            dynamicForm.Omniture.SetOption("evar48", "");
            dynamicForm.Omniture.Trigger();
            dynamicForm.Util.CheckStylesheet();
            var form = $("#" + dynamicForm.options.elqFormName),
                offerAccessRule,
                ready_to_submit = new $.Deferred();
            $("#elqFormSubmitFrame").hide();
            var html = dynamicForm.UI.Template.Form.GetHTML();
            //$("#" + dynamicForm.options.elqFormName).detach();
            $("#" + dynamicForm.options.elqFormContainerId).html(html);
            $.when(dynamicForm.Lookup.Contact(), dynamicForm.form.PopulateFields()).then(function() {
                $("#" + dynamicForm.options.elqFormName).attr("action", 'https://s' + dynamicForm.options.elqSiteId + '.t.eloqua.com/e/f2');
                $("#A_SubmissionID").val(dynamicForm.Util.GetSubmissionId());
                $("#C_EmailAddress").val(dynamicForm.Util.GetEmailAddress());
                $("#A_UX_Type").val("Autosubmit " + dynamicForm.Util.GetOfferAccessRule());
                if (typeof dynamicForm.data.GetElqOffer === 'undefined') {
                    if (dynamicForm.options.no_offer) {
                        $("#A_UX_Status").val("No Offer: " + dynamicForm.options.offer_id);
                    } else {
                        $("#A_UX_Status").val("Bad Offer: " + dynamicForm.options.offer_id);
                    }
                }
                $.when(dynamicForm.form.PrepDynamicForm()).then(function() {
                    $("#" + dynamicForm.options.elqFormName).submit();
                    dynamicForm.Omniture.ResetEvents();
                    deferred.resolve();
                });
            });
            return deferred;
        },
        Long: function(opts) {
            var container = $("#" + dynamicForm.options.elqFormContainerId),
                form = $("#" + dynamicForm.options.elqFormName),
                deferred = new $.Deferred(),
                trigger_omniture_def = new $.Deferred(),
                validation_ready = new $.Deferred(),
                email = dynamicForm.Util.GetEmailAddress(),
                tactic_id = dynamicForm.Util.GetCookieValue('rh_omni_tc'),
                offer_id = dynamicForm.Util.GetOfferId(),
                lookup_key, lookup_field = dynamicForm.options.fields,
                lookup_from_key;
            dynamicForm.UI.Loading.Show();
            dynamicForm.data.verificationId = dynamicForm.Util.UpdateVerificationId();
            var formHtml = dynamicForm.UI.Template.Form.GetHTML();
            if (dynamicForm.options.testing) {
                $(":input").on("change", dynamicForm.Util.Testing.Update('form'));
            }
            $("#" + dynamicForm.options.elqFormName).detach();
            $("#" + dynamicForm.options.elqFormContainerId).html(formHtml);

            $.when(dynamicForm.Lookup.Contact()).then(function() {
                if (dynamicForm.options.contact_known || (dynamicForm.Util.GetOfferAccessRule() === dynamicForm.constants.ACCESS_RULE.TRACKED)) {
                    //console.log("+ known/tracked");
                    var excludes = ".form-action";
                    if (typeof dynamicForm.options.CustomQuestions !== "undefined" || (dynamicForm.Util.GetOfferAccessRule() === dynamicForm.constants.ACCESS_RULE.TRACKED) ) {
                        $(".form-content > .form-group", "#" + dynamicForm.options.elqFormName).not(".form-action").not(".udf").not(".email").hide();
                    } else {
                        $(".form-content > .form-group", "#" + dynamicForm.options.elqFormName).not(".form-action").hide();
                    }
                } else {
                    //console.log("- unknown/gatedvisitor");
                }

                if (dynamicForm.Util.GetOfferAccessRule() === dynamicForm.constants.ACCESS_RULE.TRACKED && contact_known) {
                    $("#" + dynamicForm.options.lookup.contact.fields.email).removeAttr("required").removeClass('required');
                }

                $("#NotI", "#" + dynamicForm.options.elqFormContainerId).on("click", function() {
                    $(".form-content > .form-group", "#" + dynamicForm.options.elqFormName).show();
                    $("#NotI", "#" + dynamicForm.options.elqFormContainerId).hide();
                });

                if (dynamicForm.options.display_method !== dynamicForm.constants.TYPE.MODAL && dynamicForm.options.width < 600) {
                    $(".form-horizontal").removeClass("form-horizontal");
                    $(".col-sm-10").removeClass("col-sm-10");
                    $(".form-control").addClass("input-block-level");
                    $(".col-sm-2").removeClass("col-sm-2");
                    $(".col-sm-offset-2").removeClass("col-sm-offset-2");
                    $(".cta-primary").removeClass("cta-primary").addClass("btn-large btn-block btn-danger");
                }
                $("#elqFormSubmitFrame").hide();
                dynamicForm.UI.Loading.Hide();
                $.validator.setDefaults({
                    ignore: []
                });
                $("#A_SubmissionID").val(dynamicForm.Util.GetSubmissionId());
                $("textarea", container).autosize();
                var FormInit = new $.Deferred(),
                    channel = $.url(document.URL, false).param("channel") || "landing page",
                    parentFirstMinor = "";
                if ($.url(document.URL, false).param("prop14")) {
                    parentFirstMinor = " | " + $.url(document.URL, false).param("prop14");
                } else {
                    if ($.url(document.URL, false).param("eVar27")) {
                        parentFirstMinor = " | " + $.url(document.URL, false).param("eVar27");
                    }
                }
                $("select").each(function() {
                    var updates_offer_id = $(this).attr("data-updates_offer_id");
                    if (updates_offer_id) {
                        $(this).on("change", function() {
                            dynamicForm.form.UpdateFromUdf(this);
                        });
                    }
                });
                $('#C_EmailAddress').on('change', function() {
                    dynamicForm.data.prepop['A_SubmissionID'] = dynamicForm.Util.GetSubmissionId();
                    $('#A_SubmissionID').val(dynamicForm.Util.GetSubmissionId());
                });
                dynamicForm.form.UpdateJobRoleList();
                $.when(dynamicForm.Translate(document.getElementById(dynamicForm.options.elqFormContainerId))).then(function() {
                    $.when(dynamicForm.Util.GetScript("/forms/scripts/vendor/demandbase/widget.js")).then(function() {
                        //TODO: check w interaction of demandbaseForm script and dependancies
                        document.RH_DB_FORM_NAME = dynamicForm.options.elqFormName;
                        $.when(dynamicForm.Util.GetScript("/forms/scripts/vendor/demandbase/demandbaseForm.js")).then(function() {
                            DemandbaseForm.formConnector.init();
                        });
                    });
                    var offer_id = dynamicForm.Util.GetOfferId(),
                        channel = $.url(document.URL, false).param("channel") || "landing page";
                    dynamicForm.Omniture.SetOption("pageName", "rh | " + channel + " | " + dynamicForm.constants.OMNITURE.FIRST_MINOR_SECTION + " | " + offer_id + " | form");
                    dynamicForm.Omniture.AddEvent(dynamicForm.constants.OMNITURE.EVENT.PAGE_LOAD);
                    trigger_omniture_def = dynamicForm.Omniture.Trigger();
                    dynamicForm.form.UpdateJobRoleList();
                    $.when(dynamicForm.form.PopulateFields(), dynamicForm.form.Validation()).then(function() {
                        dynamicForm.Omniture.ResetEvents();
                        validation_ready.resolve();
                    });
                });
            });

            $.when(validation_ready, trigger_omniture_def).then(function() {
                deferred.resolve();
                // $('#A_SubmissionID').val(dynamicForm.Util.GetSubmissionId());
                // $("#rh_omni_itc").val(dynamicForm.Util.GetCookieValue('rh_omni_itc'));
                // $("#rh_omni_tc").val(dynamicForm.Util.GetCookieValue('rh_omni_tc'));
                // $("#rh_pid").val(dynamicForm.Util.GetCookieValue('rh_pid'));
            });
            return deferred;
        },
        ValidateElqForm: function(elq_form) {
            return $(elq_form).valid();
        },
        s4: function() {
            // http://note19.com/2007/05/27/javascript-guid-generator/
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        },
        ValidationErrors: function(validator, error_list) {
            var len = error_list.length,
                i = 0;
            $(".has-error, .error", "#" + dynamicForm.options.elqFormName).removeClass("has-error error");
            if (len > 0) {
                for (i = 0; i < len; i++) {
                    var $el = $(error_list[i].element);
                    $el.closest(".form-group, .control-group").addClass("has-error error");
                }
            }
            if (validator.numberOfInvalids() > 0) {
                $("#validationMessages").slideDown();
                validator.defaultShowErrors();
                dynamicForm.Translate(document.getElementById("validationMessages"));
            } else {
                $("#validationMessages").slideUp();
            }
        },
        PopulateFields: function() {
            var deferred = new $.Deferred(),
                offer_id = dynamicForm.Util.GetOfferId(),
                lookup_def = null,
                form = $("#" + dynamicForm.options.elqFormName);
            $.when(dynamicForm.Lookup.All()).then(function() {
                //non-lookup data
                dynamicForm.data.prepop['A_Timestamp'] = dynamicForm.Util.GetTimestamp();
                dynamicForm.data.prepop['A_LandingPageURL'] = document.URL;
                dynamicForm.data.prepop['A_OfferID'] = dynamicForm.Util.GetOfferId();
                dynamicForm.data.prepop['A_UX_Language'] = dynamicForm.Util.GetLanguageCode();
                // clear phone number per security concerns
                //dynamicForm.data.prepop['C_BusPhone'] = "";
                dynamicForm.data.prepop['A_ReferringPageURL'] = dynamicForm.Util.GetReferringPageUrl();
                dynamicForm.data.prepop['A_Timestamp'] = dynamicForm.Util.GetTimestamp();
                var verificationId = dynamicForm.Util.GetVerificationId();
                dynamicForm.data.prepop['A_VerificationID'] = verificationId;
                dynamicForm.data.prepop['A_UX_Type'] = $("#A_UX_Type").val();
                dynamicForm.data.prepop['A_UX_Status'] = $("#A_UX_Status").val();
                dynamicForm.data.prepop['A_RedirectURL'] = dynamicForm.Util.GetRedirectUrl({
                    offer_id: dynamicForm.Util.GetOfferId(),
                    pid: dynamicForm.Util.GetCookieValue('rh_pid'),
                    sc_cid: dynamicForm.Util.GetCookieValue('rh_omni_tc'),
                    verificationId: dynamicForm.Util.GetVerificationId()
                });
                dynamicForm.data.prepop['QA_Version'] = dynamicForm.options.QA_Version;
                dynamicForm.data.prepop['A_UX_Browser'] = navigator.userAgent;
                var key, field, value;
                try {
                    for (key in dynamicForm.options.form.fields) {
                        field = dynamicForm.options.form.fields[key];
                        value = dynamicForm.data.prepop[field.id];
                        if (dynamicForm.Util.HasValue(value)) {
                            $("#" + field.id).val(value);
                        }
                    }
                } catch (e) {
                    //console.error("[dynamicForm logging]: ", e);
                } finally {
                    deferred.resolve();
                }
            });
            if (dynamicForm.options.testing) {
                dynamicForm.Util.Testing.Show();
            }
            $.when(deferred).then(function() {
                dynamicForm.form.UpdateJobRoleList();
            });
            return deferred;
        },
        PrepDynamicForm: function(event) {
            dynamicForm.UI.Loading.Show();
            var form = $("#" + dynamicForm.options.elqFormName),
                lookup_def = dynamicForm.Lookup.All(),
                ready_to_submit = $.Deferred();
            $.when(lookup_def).then(function() {
                try {
                    $("#QA_Imatestrecord").val(dynamicForm.options.IMATESTRECORD);

                    //repopulate if the offer id has changed
                    $("#A_VerificationID").val(dynamicForm.Util.GetVerificationId({
                        force: true
                    }));
                    if (typeof dynamicForm.data.UpdatedOfferId === 'undefined') {
                        dynamicForm.data.UpdatedOfferId = $.url(document.URL, false).param('UpdatedOfferId');
                    }
                    $("#A_RedirectURL").val(dynamicForm.Util.GetRedirectUrl({
                        offer_id: dynamicForm.Util.GetOfferId(),
                        pid: dynamicForm.Util.GetCookieValue('rh_pid'),
                        sc_cid: dynamicForm.Util.GetCookieValue('rh_omni_tc'),
                        verificationId: dynamicForm.Util.GetVerificationId()
                    }));
                    var visitor_fields = dynamicForm.options.lookup.visitor.fields,
                        i, fld;
                    for (i = 0; i < visitor_fields.length; i++) {
                        fld = visitor_fields[i];
                        $("#" + fld).val(dynamicForm.data.prepop[fld]);
                    }
                    $("#A_SubmissionID").val(dynamicForm.Util.GetSubmissionId());
                    $("#rh_omni_itc").val(dynamicForm.Util.GetCookieValue('rh_omni_itc'));
                    $("#rh_omni_tc").val(dynamicForm.Util.GetCookieValue('rh_omni_tc'));
                    $("#rh_pid").val(dynamicForm.Util.GetCookieValue('rh_pid'));
                    var tactic_fields = dynamicForm.options.lookup.tactic.fields;
                    $.when(dynamicForm.Lookup.Tactic()).then(function() {
                        for (i = 0; i < tactic_fields.length; i++) {
                            fld = tactic_fields[i];
                            $("#" + fld).val(dynamicForm.data.prepop[fld]);
                        }
                    });
                    var offer_fields = dynamicForm.options.lookup.offer.fields;
                    for (i = 0; i < offer_fields.length; i++) {
                        fld = offer_fields[i];
                        $("#" + fld).val(dynamicForm.data.prepop[fld]);
                    }
                } catch (e) {
                    //console.error("[dynamicForm logging]: ", e);
                    ready_to_submit.resolve();
                } finally {
                    ready_to_submit.resolve();
                }
                $.when(ready_to_submit).then(function() {
                    // $("#"+dynamicForm.options.elqFormName).off("submit");
                    // $("#"+dynamicForm.options.elqFormName).on("submit", function() {
                    $.receiveMessage(function(e) {
                        // Get the height from the passed data.";

                        //console.log("received: ", e);

                        var params = $.url("file.html?" + e.data).param();
                        var status = $.url("file.html?" + e.data).param("status");
                        var offer_id = $.url("file.html?" + e.data).param("offer_id");
                        var postLoadAction = $.url("file.html?" + e.data).param("do");
                        var modal = $.url("file.html?" + e.data).param("modal");
                        if (dynamicForm.Util.HasValue(modal)) {
                            dynamicForm.options.no_css = false;
                            if (modal === "resize") {
                                $.colorbox.resize();
                            }
                        }
                        if (status === dynamicForm.constants.STATUS.OK) {
                            dynamicForm.form.HandleSubmission();
                        }
                    });
                    dynamicForm.form.timer = setTimeout(function() {
                        dynamicForm.form.HandleSubmission();
                    }, dynamicForm.constants.TIMEOUT);
                });
                // An optional origin URL (Ignored where window.postMessage is unsupported).
            }, dynamicForm.Util.GetUrlPrefix());
            return ready_to_submit;
        },
        timer: setTimeout(function() {
            return;
        }, 0),
        HandleSubmission: function() {
            clearTimeout(dynamicForm.form.timer);
            if (dynamicForm.data.SubmissionHandled) {
                return;
            }
            dynamicForm.data.SubmissionHandled = true;
            var config = {
                offer_id: dynamicForm.Util.GetOfferId(),
                pid: dynamicForm.Util.GetCookieValue('rh_pid'),
                sc_cid: dynamicForm.Util.GetCookieValue('rh_omni_tc'),
                verificationId: dynamicForm.Util.GetVerificationId()
            }
            if (dynamicForm.Util.HasValue(config.offer_id)) {
                dynamicForm.options.offer_id = config.offer_id;
            }
            if (dynamicForm.Util.HasValue(config.UpdatedOfferId)) {
                dynamicForm.data.UpdatedOfferId = config.UpdatedOfferId;
            }
            dynamicForm.SubmissionResponse.Start();
        },
        UpdateJobRoleList: function() {
            //TODO: use the template function for the initial render?
            $("#C_Department1").off("change");
            var form = $("#" + dynamicForm.options.elqFormName),
                department_field = $("#" + dynamicForm.options.lookup.contact.fields.department),
                job_role_field = $("#C_Job_Role11"),
                job_role_label = $("label[for=C_Job_Role11]", form),
                selected_dept = $("option:selected", department_field).val(),
                selected_job_role = $("option:selected", job_role_field).val(),
                original_options = $("option", job_role_field),
                container = $("#" + dynamicForm.options.elqFormContainerId);
            original_options.detach();
            job_role_label.removeClass("disabled");
            job_role_field.removeClass("disabled").attr("disabled", false);
            var options = [];
            switch (selected_dept) {
                case "IT - Applications/Development":
                    options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security/Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Programmer/Developer", "Specialist/Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                    break;
                case "IT - Business Intelligence":
                    options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security/Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Programmer/Developer", "Specialist/Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                    break;
                case "IT - Desktop/Help Desk":
                    options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security/Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Programmer/Developer", "Specialist/Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                    break;
                case "IT - Network":
                    options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security/Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Programmer/Developer", "Specialist/Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                    break;
                case "IT - Operations":
                    options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security/Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Programmer/Developer", "Specialist/Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                    break;
                case "IT - Project Management":
                    options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security/Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Programmer/Developer", "Specialist/Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                    break;
                case "IT - Quality/Testing":
                    options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security/Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Programmer/Developer", "Specialist/Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                    break;
                case "IT - Risk/Compliance/Security":
                    options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security/Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Programmer/Developer", "Specialist/Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                    break;
                case "IT - Database":
                    options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security/Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Programmer/Developer", "Specialist/Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                    break;
                case "IT - Server/Storage":
                    options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security/Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Programmer/Developer", "Specialist/Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                    break;
                case "IT - Telecom":
                    options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security/Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Programmer/Developer", "Specialist/Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                    break;
                case "IT - Web":
                    options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security/Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Programmer/Developer", "Specialist/Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                    break;
                case "IT - All":
                    options = ["Analyst", "Architect", "Assistant", "Chief Architect", "Chief Security/Compliance Officer", "CIO", "Consultant", "Database Administrator", "Director", "Engineer", "Manager", "Network Administrator", "Programmer/Developer", "Specialist/Staff", "Student", "System Administrator", "Vice President", "Webmaster"];
                    break;
                case "Customer Service/Call Center":
                    options = ["Consultant", "Director", "Manager", "Representative/Specialist", "Vice President"];
                    break;
                case "Executive Office":
                    options = ["Assistant", "CEO", "CFO", "Chairman", "Chief Architect", "Chief Security/Compliance Officer", "CIO", "CMO", "COO", "CTO", "General Counsel", "General Manager", "Owner", "Partner/Principal", "President"];
                    break;
                case "Finance":
                    options = ["CFO", "Consultant", "Finance/Accounting", "Procurement/Purchasing", "Treasurer/Comptroller", "Vice President"];
                    break;
                case "Human Resources":
                    options = ["Consultant", "Director", "Manager", "Representative/Specialist", "Vice President"];
                    break;
                case "Legal":
                    options = ["Consultant", "General Counsel", "Lawyer/Solicitor", "Legal Services/Paralegal", "Partner/Principal"];
                    break;
                case "Marketing Communications":
                    options = ["CMO", "Consultant", "Director", "Industry Analyst", "Manager", "Press/Media", "Representative/Specialist", "Vice President"];
                    break;
                case "Research & Development":
                    options = ["Architect", "Chief Architect/Chief Scientist", "Consultant", "CTO", "Director", "Engineer", "Manager", "Product Manager", "Programmer/Developer", "Student", "Vice President"];
                    break;
                case "Sales":
                    options = ["Account Executive/Manager", "Consultant", "Director", "General Manager", "Manager", "Vice President"];
                    break;
                case "Technical Support":
                    options = ["Consultant", "Director", "Engineer/Specialist", "Manager", "Vice President"];
                    break;
                default:
                    job_role_label.addClass("disabled");
                    options = ["Consultant", "Director", "Industry Analyst", "Manager", "Press/Media", "Professor/Instructor", "Staff", "Student", "Vice President"];
                    break;
            }
            var i, select_options = ["<option value=\"\">" + dynamicForm.options.DefaultValue + "</option>"];
            //job_role_field.append(please_select);
            for (i = 0; i < options.length; i++) {
                select_options.push("<option value=\"" + options[i] + "\">" + options[i] + "</option>");
            }
            job_role_field.append(select_options.join(""));
            dynamicForm.Translate(document.getElementById(dynamicForm.options.elqFormContainerId));
            $("#C_Department1").on("change", function() {
                dynamicForm.Translate(document.getElementById(dynamicForm.options.elqFormContainerId));
                dynamicForm.form.UpdateJobRoleList();
                dynamicForm.Translate(document.getElementById(dynamicForm.options.elqFormContainerId));
            });
            if (selected_dept === "") {
                job_role_label.addClass("disabled");
                job_role_field.addClass("disabled").attr("disabled", true);
                return;
            }
            if (selected_job_role !== "" && ($('option[value="' + selected_job_role + '"]', job_role_field).length > 0)) {
                job_role_field.val(selected_job_role);
                dynamicForm.Translate(document.getElementById(dynamicForm.options.elqFormContainerId));
            } else {
                if (typeof dynamicForm.data.GetElqContact === 'function') {
                    if ((typeof dynamicForm.data.GetElqContact("C_Job_Role11") !== "undefined") && (dynamicForm.data.GetElqContact("C_Job_Role11") !== "")) {
                        if (job_role_field.is(":visible")) {
                            job_role_field.val(dynamicForm.data.GetElqContact("C_Job_Role11"));
                        }
                    } else if (selected_dept === "") {
                        job_role_field.attr('disabled', 'disabled');
                    } else {
                        $('option[value=""]', job_role_field).attr('selected', 'selected');
                    }
                } else {
                    $('option[value=""]', job_role_field).attr('selected', 'selected');
                }
                dynamicForm.Translate(document.getElementById(dynamicForm.options.elqFormContainerId));
            }
            dynamicForm.form.UpdateDisabled($(":input", form));
            return this;
        },
        UpdateDisabled: function(form_inputs) {
            form_inputs.each(function() {
                var id = $(this).attr("id");
                if ($(this).is(":disabled")) {
                    $(this).addClass("disabled");
                    $("label[for=" + id + "]").addClass("disabled");
                } else {
                    $(this).removeClass("disabled");
                    $("label[for=" + id + "]").removeClass("disabled");
                }
            });
            return this;
        }
    };
    dynamicForm.ModalWindow = {
        Start: function(opts) {
            var deferred = new $.Deferred(),
                DynamicFormModal = $("#DynamicFormModal"),
                link_search = "offer_id=",
                form_links = $("a[href*=\"" + link_search + "\"]"),
                ct = dynamicForm.GetClientPlatform();
            if ($("head link[href*=\"colorbox.css\"]").length < 1) {
                var form_css = document.createElement("link");
                form_css.rel = "stylesheet";
                form_css.href = dynamicForm.Util.GetUrlPrefix() + "/forms/css/colorbox.css";
                document.getElementsByTagName("head")[0].appendChild(form_css);
            }
            try {
                form_links.colorbox({
                    overlayClose: false,
                    // TODO - remove iframe?
                    iframe: true,
                    fastIframe: true,
                    initialWidth: "80%",
                    width: "80%",
                    initialHeight: "90%",
                    height: "90%",
                    href: function() {
                        var query_string_data = $.url(this.href).param();
                        query_string_data["lb"] = 1;
                        query_string_data["view"] = dynamicForm.constants.VIEW.FORM;
                        query_string_data["type"] = dynamicForm.constants.TYPE.MODAL;
                        query_string_data["lpg"] = document.URL;
                        if (dynamicForm.Util.HasValue(s.prop14)) {
                            query_string_data["prop14"] = s.prop14;
                        }
                        if (dynamicForm.Util.HasValue(s.eVar27)) {
                            query_string_data["eVar27"] = s.eVar27;
                        }
                        if (dynamicForm.Util.HasValue(s.channel)) {
                            query_string_data["channel"] = s.channel;
                        }
                        if (dynamicForm.Util.HasValue(document.referrer)) {
                            query_string_data["referrer"] = encodeURIComponent(document.referrer);
                        }
                        return dynamicForm.Util.GetUrlPrefix() + "/forms/?" + $.param(query_string_data) + "&";
                    },
                    speed: 300,
                    escKey: true,
                    reposition: true,
                    scrolling: 'auto',
                    fixed: true,
                    onOpen: function() {
                        dynamicForm.options.display_method = dynamicForm.constants.TYPE.DIRECT;
                        $("#wrapper").css("background", "transparent").css("max-width", "100%");
                        if (ct === "mobile") {
                            window.open($(this).attr("href"), "_blank");
                            $.colorbox.close();
                        }
                    }
                });
                deferred.resolve();
            } catch (e) {
                //console.error("[dynamicForm logging]: ", e);
                deferred.resolve();
            }
            return deferred;
        }
    };
    dynamicForm.Util.UpdateVerificationId = function() {
        return (dynamicForm.form.s4() + dynamicForm.form.s4());
    };
    dynamicForm.Util.GetVerificationId = function(options) {
        var force_update = false;
        if (typeof options !== "undefined" && typeof options.force !== "undefined") {
            force_update = options.force || false;
        }
        dynamicForm.data.verificationId = dynamicForm.data.verificationId || "";
        if (force_update || dynamicForm.data.verificationId === "") {
            //contact and qs do not have a verification id, so make a new one...
            dynamicForm.data.verificationId = dynamicForm.Util.UpdateVerificationId();
        }
        return dynamicForm.data.verificationId;
    };
    dynamicForm.Util.GetOfferId = function(update) {
        var offer_id,
            updated_offer_id = dynamicForm.data.UpdatedOfferId;
        try {
            if (dynamicForm.Util.HasValue(dynamicForm.options.offer_id)) {
                offer_id = dynamicForm.options.offer_id;
            }
        } catch (e) {
            //console.error("[dynamicForm logging]: ", e);
        }
        return offer_id;
    };
    dynamicForm.Tracking = function(type) {
        //init = all
        //thanks =
        if (type === 'init') {
            //DemandBase Remarketing Tracking
            dynamicForm.Demandbase.Remarketing();
            //Google Remarketing Tracking
            dynamicForm.Google.Tracking(dynamicForm.options.GoogleRemarketing);
            //Google Analytics Tracking
            dynamicForm.Google.Analytics();
        }
        if (type === 'thanks') {
            //DemandBase Remarketing Tracking
            dynamicForm.Demandbase.Remarketing();
            //Google Remarketing Tracking
            dynamicForm.Google.Tracking(dynamicForm.options.GoogleRemarketing);
            //Google Analytics Tracking
            dynamicForm.Google.Analytics();
            //Google AdWords Conversion Tracking
            dynamicForm.Google.Tracking(dynamicForm.options.GoogleAdWordsConversionTracking);
        }
    };
    dynamicForm.Eloqua = {
        ParseLookupDate: function(input) {
            var date = "";
            if (input) {
                var parts = input.match(/(\d+)/g);
                // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
                // there seem to be two styles that get returned from eloqua. one starts with the year, and one starts with the month. detect.
                if (parts[0] > 1000) {
                    // NOTE - Date Format 2012-11-02 12:00:00
                    // NOTE - months are 0-based
                    date = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
                } else {
                    // NOTE - Default to 12-30-2012
                    // NOTE - months are 0-based
                    date = new Date(parts[2], parts[0] - 1, parts[1]);
                }
            }
            return date;
        },
        IsRegistrationCurrent: function(regDateStr) {
            // NOTE - to force the welcome-back view when testing, return false;
            var isCurrent = false;
            if (regDateStr.length > 0) {
                var regDate = dynamicForm.Eloqua.ParseLookupDate(regDateStr);
                var oneDay = 1000 * 60 * 60 * 24;
                var daysSinceReg = Math.round((new Date().getTime() - regDate) / oneDay);
                if (daysSinceReg <= 1) {
                    isCurrent = true;
                }
            }
            return isCurrent;
        }
    };
    dynamicForm.Demandbase = {
        Remarketing: function() {
            var myKey = "223190404d28f4fcabacfadefef244ea33868fb1";
            $.getJSON("//api.demandbase.com/api/v2/ip.json?key=" + myKey + "&page=" + document.location.href + "&page_title=" + document.title + "&referrer=" + document.referrer);
        }
    };
    dynamicForm.Google = {
        Analytics: function() {
            var _gaq = _gaq || [];
            _gaq.push(["_setAccount", dynamicForm.options.GoogleAnalyticsID]);
            _gaq.push(["_trackPageview"]);
            window._gaq = _gaq;
            return $.getScript(("https:" === document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js");
        },
        Tracking: function(config) {
            window.google_conversion_id = config.id;
            window.google_conversion_language = config.language;
            window.google_conversion_format = config.format;
            window.google_conversion_color = config.color;
            window.google_conversion_label = config.label;
            window.google_conversion_value = 0;
            if (config.value) {
                window.google_conversion_value = config.value;
            }
            window.google_custom_params = config.custom_params;
            window.google_remarketing_only = config.remarketing_only;
            /* jshint ignore:start */
            var oldDocWrite = document.write; // save old doc write
            document.write = function(node) { // change doc write to be friendlier, temporary
                $("body").append(node);
            };
            var deferred = new $.Deferred();
            $.getScript("//www.googleadservices.com/pagead/conversion.js", function(data) {
                document.write = oldDocWrite;
                deferred.resolve();
            });
            /* jshint ignore:end */
            return deferred;
        }
    };
    dynamicForm.Omniture = {
        GetInterface: function() {
            var offer_type = dynamicForm.Util.GetOfferAccessRule(),
                contact_type = (typeof dynamicForm.data.GetElqContact === "function") ? "known" : "unknown",
                std_fld_count = dynamicForm.data.StandardFieldCount || 0,
                form_type = dynamicForm.options.view,
                udf_count = ((typeof dynamicForm.options.CustomQuestions !== "undefined") ? dynamicForm.options.CustomQuestions.length : "0") + " udf";
            return "".concat(contact_type, " | ", offer_type, " | ", form_type, " | ", udf_count, " | ", std_fld_count).toLowerCase();
        },
        SetOptions: function(o) {
            dynamicForm.Omniture.options = $.extend(dynamicForm.Omniture.options, o);
        },
        SetOption: function(name, value) {
            if (dynamicForm.Util.HasValue(value)) {
                dynamicForm.Omniture.options[name] = value.toLowerCase();
            }
        },
        events: [],
        options: {},
        AddEvent: function(event) {
            dynamicForm.Omniture.events.push(event.toLowerCase());
        },
        ResetEvents: function(event) {
            // TODO: reset evar0 and evar1
            // s.eVar0 = '';
            // s.eVar1 = '';
            dynamicForm.Omniture.events = [];
        },
        Trigger: function() {
            var deferred = new $.Deferred();
            if (typeof s !== "undefined") {
                var o = dynamicForm.Omniture.options;
                s.pageName = o.pageName.toLowerCase();
                s.channel = $.url(document.URL, false).param("channel") || "landing page";
                if (dynamicForm.Util.HasValue(o.eVar1)) {
                    s.eVar1 = o.eVar1;
                }
                if (dynamicForm.Util.HasValue(o.eVar48)) {
                    s.eVar48 = o.eVar48;
                }
                s.eVar30 = dynamicForm.Util.GetOfferId();
                s.eVar31 = dynamicForm.Omniture.GetInterface();
                if ($.unique(dynamicForm.Omniture.events)[0] === dynamicForm.constants.OMNITURE.EVENT.FORM_SUBMIT) {
                    s.eVar31 = "";
                }
                var lc = dynamicForm.Util.GetLanguageCode();
                if (dynamicForm.Util.HasValue(lc)) {
                    s.prop2 = s.eVar22 = lc.toLowerCase();
                }
                var cc = dynamicForm.Util.GetCountryCode();
                if (dynamicForm.Util.HasValue(cc)) {
                    s.prop3 = s.eVar19 = cc.toLowerCase();
                }
                s.prop14 = s.eVar27 = dynamicForm.constants.OMNITURE.FIRST_MINOR_SECTION;
                s.prop15 = s.eVar28 = dynamicForm.options.display_method === dynamicForm.constants.TYPE.INLINE ? "embedded" : "lightbox";
                s.events = $.unique(dynamicForm.Omniture.events).join(",");
                deferred = dynamicForm.Util.GetScript("/j/rh_omni_footer.js");
            } else {
                deferred.resolve();
            }
            $.when(deferred).then(function() {
                dynamicForm.Omniture.ResetEvents();
            });
            return deferred;
        }
    };
    dynamicForm.Util.GetSubmissionId = function() {
        return dynamicForm.Util.GetEmailAddress() + "_" + dynamicForm.Util.GetTimestamp();
    };
    dynamicForm.Util.GetRedirectUrl = function(options) {
        var query_string_data = {
            view: options.view || dynamicForm.constants.VIEW.SEND_MSG,
            version: dynamicForm.options.QA_Version
        };
        if (dynamicForm.Util.HasValue(options.offer_id)) {
            query_string_data["offer_id"] = options.offer_id;
        }
        if (dynamicForm.Util.HasValue(options.UpdatedOfferId)) {
            query_string_data["UpdatedOfferId"] = options.UpdatedOfferId;
        }
        if (dynamicForm.Util.HasValue(options.sc_cid)) {
            query_string_data["sc_cid"] = options.sc_cid;
        }
        if (dynamicForm.Util.HasValue(options.language)) {
            query_string_data["language"] = options.language;
        }
        if (dynamicForm.Util.HasValue(options.country)) {
            query_string_data["country"] = options.country;
        }
        if (dynamicForm.Util.HasValue(options.pid)) {
            query_string_data["pid"] = options.pid;
        }
        if (dynamicForm.Util.HasValue(options.channel)) {
            query_string_data["channel"] = options.channel;
        }
        if (dynamicForm.Util.HasValue(options.prop14)) {
            query_string_data["prop14"] = options.prop14;
        }
        if (dynamicForm.Util.HasValue(options.eVar27)) {
            query_string_data["eVar27"] = options.eVar27;
        }
        if (dynamicForm.Util.HasValue(options.referrer)) {
            query_string_data["referrer"] = options.referrer;
        }
        if (dynamicForm.Util.HasValue(options.verificationId)) {
            query_string_data["verificationId"] = options.verificationId;
        }
        if (dynamicForm.Util.HasValue(options.offer_id)) {
            //if (typeof options.pid !== "undefined" && options.pid !== dynamicForm.constants.UNAVAILABLE) {
            query_string_data["p"] = encodeURIComponent(document.location.href.split("?")[0]);
            //}
        }
        var host = options.parent_url || "".concat(dynamicForm.Util.GetUrlPrefix(), "/forms/"),
            url = host + "?" + $.param(query_string_data);
        return url;
    };
    dynamicForm.Util.GetReferringPageUrl = function() {
        var ReferringPageURL = $.url(document.URL, false).param("ref");
        var url;
        if (typeof ReferringPageURL !== "undefined" && ReferringPageURL !== "" && ReferringPageURL !== dynamicForm.constants.UNAVAILABLE) {
            url = ReferringPageURL;
        } else {
            if (typeof dynamicForm.data.GetElqVisitor !== "undefined") {
                url = dynamicForm.data.GetElqVisitor("V_MostRecentReferrer");
            } else {
                url = document.referrer ? document.referrer : dynamicForm.constants.UNAVAILABLE;
            }
        }
        return url;
    };
    dynamicForm.Util.GetLandingPageUrl = function() {
        var landingPageURL = $.url(document.URL, false).param("lpg");
        var url;
        if (typeof landingPageURL !== "undefined" && landingPageURL !== "" && landingPageURL !== dynamicForm.constants.UNAVAILABLE) {
            url = landingPageURL;
        } else {
            url = document.URL ? document.URL : dynamicForm.constants.UNAVAILABLE;
        }
        return url;
    };
    dynamicForm.GetClientPlatform = function() {
        var ua = (navigator.userAgent || navigator.vendor || window.opera);
        if (typeof dynamicForm.options.client_platform === "undefined") {
            if ((/iPhone|iPod|Android|BlackBerry|Opera Mini|IEMobile/).test(ua)) {
                dynamicForm.options.client_platform = "mobile";
            } else {
                if ((/iPad|IEMobile/).test(ua)) {
                    dynamicForm.options.client_platform = "tablet";
                } else {
                    if (!!((/(iPad|SCH-I800|xoom|NOOK|silk|kindle|GT-P7510)/i).test(ua))) {
                        dynamicForm.options.client_platform = "tablet";
                    } else {
                        dynamicForm.options.client_platform = "desktop";
                    }
                }
            }
        }
        return dynamicForm.options.client_platform;
    };
    dynamicForm.Util.GetTimestamp = function() {
        var date = new Date();
        return "".concat(date.getFullYear(), "-", ((date.getMonth() + 1) < 10) ? "0" + ((date.getMonth() + 1)) : (date.getMonth() + 1), "-", (date.getDate() < 10) ? ("0" + date.getDate()) : date.getDate(), " ", (date.getHours() < 10) ? ("0" + date.getHours()) : date.getHours(), ":", (date.getMinutes() < 10) ? ("0" + date.getMinutes()) : date.getMinutes(), ":", (date.getSeconds() < 10) ? ("0" + date.getSeconds()) : date.getSeconds());
    };
    dynamicForm.Util.GetEmailAddress = function() {
        var email = dynamicForm.constants.UNAVAILABLE;
        //1. try visitor lookup
        if (typeof dynamicForm.data.GetElqVisitor === "function") {
            email = dynamicForm.data.GetElqVisitor(dynamicForm.options.lookup.visitor.fields.email);
            if (email === "") {
                email = dynamicForm.data.GetElqVisitor(dynamicForm.options.lookup.visitor.fields.elqEmail);
            }
        }
        //2. try contact lookup
        if (typeof dynamicForm.data.GetElqContact === "function") {
            email = dynamicForm.data.GetElqContact(dynamicForm.options.lookup.contact.fields.email);
        }
        //3. try query string param
        if (dynamicForm.Util.HasValue(dynamicForm.options.email)) {
            email = dynamicForm.options.email;
        }
        //4. try form value
        var emailVal = $("#" + dynamicForm.options.lookup.contact.fields.email).val();
        if (dynamicForm.Util.HasValue(emailVal)) {
            email = emailVal;
        }
        dynamicForm.options.email = decodeURI(email);
        return dynamicForm.options.email;
    };
    dynamicForm.Translate = function(block) {
        // NOTE - Provides the js18n translation for the Job Roles choices that are created dynamically from this field.
        var deferred = $.Deferred();
        var langSrc = "en";
        if (!dynamicForm.Util.HasValue(block)) {
            block = document.body;
        }
        var langDest = dynamicForm.Util.GetLanguageCode();
        // TODO - Need to define a DynamicForm-centric message bundle, so we don"t clobber stuff from the rest of the site
        try {
            js18n.convert(block, ["messages"], langSrc, langDest, function() {
                deferred.resolve();
            }, null);
        } catch (e) {
            //console.error("[dynamicForm logging]: ", e);
            deferred.resolve();
        }
        return deferred;
    };
    dynamicForm.SubmissionResponse = {
        SendMessage: function() {
            var container = $("#" + dynamicForm.options.elqFormContainerId);
            dynamicForm.Tracking('thanks');
            // NOTE - Append the Iframe into the DOM.
            var parent_url = decodeURIComponent($.url(document.URL, false).param("p"));
            var divider = "?";
            if (parent_url.indexOf("?") >= 0) {
                divider = "&";
            }
            var src, openInNewWindow = false;
            if (!dynamicForm.Util.HasValue(parent_url)) {
                //openInNewWindow = true;
                src = dynamicForm.Util.GetRedirectUrl({
                    parent_url: "".concat(dynamicForm.Util.GetUrlPrefix(), "/forms/"),
                    offer_id: dynamicForm.Util.GetOfferId(),
                    pid: dynamicForm.Util.GetCookieValue('rh_pid'),
                    sc_cid: dynamicForm.Util.GetCookieValue('rh_pid'),
                    verificationId: dynamicForm.Util.GetVerificationId(),
                    view: dynamicForm.constants.VIEW.DOWNLOAD
                });
            } else {
                src = dynamicForm.Util.GetRedirectUrl({
                    parent_url: parent_url,
                    offer_id: dynamicForm.Util.GetOfferId(),
                    pid: dynamicForm.Util.GetCookieValue('rh_pid'),
                    sc_cid: dynamicForm.Util.GetCookieValue('rh_pid'),
                    verificationId: dynamicForm.Util.GetVerificationId(),
                    view: dynamicForm.constants.VIEW.SEND_MSG
                });
            }
            if (openInNewWindow) {
                parent.document.location = src;
            } else {
                var msg = {
                    status: dynamicForm.constants.STATUS.OK,
                    offer_id: dynamicForm.Util.GetOfferId()
                };
                $.postMessage(msg, src);
            }
        },
        Start: function() {
            dynamicForm.data.SubmissionHandled = true;
            dynamicForm.Tracking('thanks');
            dynamicForm.Util.Testing.Show();
            dynamicForm.UI.Loading.Show();
            var deferred = new $.Deferred(),
                container = $("#" + dynamicForm.options.elqFormContainerId),
                channel = $.url(document.URL, false).param("channel") || "landing page";
            $.when(dynamicForm.Lookup.Offer(), dynamicForm.Util.CheckStylesheet()).then(function() {
                var content = '',
                    url = '';

                if (dynamicForm.options.no_offer) {
                    content = dynamicForm.UI.Template.Thanks.GetHTML();
                } else {
                    content = dynamicForm.UI.Template.Thanks.GetHTML();
                    if (typeof dynamicForm.data.GetElqOffer === 'undefined') {
                        content = dynamicForm.UI.Template.Error.GetHTML();
                    } else {
                        if (typeof dynamicForm.data.GetElqOffer[dynamicForm.options.offer_id] === 'undefined' &&
                            typeof dynamicForm.data.GetElqOffer[dynamicForm.data.UpdatedOfferId] === 'undefined') {
                            content = dynamicForm.UI.Template.Error.GetHTML();
                        }

                        if (typeof dynamicForm.data.UpdatedOfferId !== 'undefined' &&
                            dynamicForm.Util.HasValue(dynamicForm.data.UpdatedOfferId)) {
                            if (typeof dynamicForm.data.GetElqOffer[dynamicForm.data.UpdatedOfferId] === 'undefined') {
                                content = dynamicForm.UI.Template.Error.GetHTML();
                            } else {
                                url = dynamicForm.data.GetElqOffer[dynamicForm.data.UpdatedOfferId](dynamicForm.options.lookup.offer.fields.assetUrl);
                            }
                        } else {
                            if (typeof dynamicForm.data.GetElqOffer[dynamicForm.options.offer_id] === 'undefined') {
                                content = dynamicForm.UI.Template.Error.GetHTML();
                            } else {
                                url = dynamicForm.data.GetElqOffer[dynamicForm.options.offer_id](dynamicForm.options.lookup.offer.fields.assetUrl);
                            }
                        }
                    }
                }

                if (typeof dynamicForm.options.asseturl !== 'undefined' && dynamicForm.Util.HasValue(dynamicForm.options.asseturl)) {
                    url = dynamicForm.options.asseturl;
                }

                $("#" + dynamicForm.options.elqFormName).hide();
                $("#" + dynamicForm.options.elqFormContainerId).append(content);
                if (dynamicForm.options.display_method !== dynamicForm.constants.TYPE.MODAL && dynamicForm.options.width < 600) {
                    $(".form-horizontal").removeClass("form-horizontal");
                    $(".col-sm-10").removeClass("col-sm-10");
                    $(".form-control").addClass("input-block-level");
                    $(".col-sm-2").removeClass("col-sm-2");
                    $(".col-sm-offset-2").removeClass("col-sm-offset-2");
                    $(".cta-primary").removeClass("cta-primary").addClass("btn-large btn-block btn-danger");
                }
                $.when(dynamicForm.Translate(document.getElementById(dynamicForm.options.elqFormContainerId))).then(function() {
                    dynamicForm.UI.Loading.Hide();
                    if (dynamicForm.options.view === dynamicForm.constants.VIEW.DOWNLOAD || dynamicForm.options.view === dynamicForm.constants.VIEW.SEND_MSG) {
                        dynamicForm.Omniture.SetOption("pageName", "rh | " + channel + " | " + dynamicForm.constants.OMNITURE.FIRST_MINOR_SECTION + " | " + dynamicForm.Util.GetOfferId() + " | thank you");
                        dynamicForm.Omniture.SetOption("interface", "");
                        dynamicForm.Omniture.SetOption("eVar30", dynamicForm.options.offer_id);
                        dynamicForm.Omniture.SetOption("eVar48", dynamicForm.data.UpdatedOfferId);
                        dynamicForm.Omniture.AddEvent(dynamicForm.constants.OMNITURE.EVENT.FORM_SUBMIT);
                    }
                    $("#ActionButton").off("click");
                    if (dynamicForm.options.display_method !== dynamicForm.constants.TYPE.MODAL) {
                        if (typeof url === "undefined" || url === "") {
                            $("A_UX_Status").val("ERROR - no offer asset url for " + dynamicForm.options.offer_id);
                        }
                        $("#ActionButton").attr("href", url).removeClass("disabled");
                    } else {
                        $("#ActionButton").show().on("click", function() {
                            if (typeof $.colorbox !== "undefined") {
                                $.colorbox.close();
                            }
                        });
                    }
                    deferred.resolve();
                });
            });

            $.when(deferred).then(function() {
                if (dynamicForm.options.view === dynamicForm.constants.VIEW.DOWNLOAD || dynamicForm.options.view === dynamicForm.constants.VIEW.SEND_MSG) {
                    dynamicForm.Omniture.Trigger();
                }

                $("#QA_Imatestrecord").val(dynamicForm.options.IMATESTRECORD);
            });
            return deferred;
        }
    };
    dynamicForm.error_message = {
        Start: function(opts) {
            var container = $("#" + dynamicForm.options.elqFormContainerId),
                error_html = dynamicForm.UI.Template.Error.GetHTML();
            dynamicForm.Util.CheckStylesheet();
            container.html(error_html);
            dynamicForm.Translate(document.getElementById(dynamicForm.options.elqFormContainerId));
        }
    };
    dynamicForm.event = {
        GetICalDateTimeString: function(dt) {
            var dtObj;
            if (typeof dt === "string") {
                dtObj = new Date(dt);
            }
            // NOTE - padding function
            function s(a, b) {
                return (1e15 + a + "").slice(-b);
            }
            // NOTE - default date parameter
            if (typeof dtObj === "undefined") {
                dtObj = new Date();
            }
            // NOTE - returns ISO datetime
            return dtObj.getUTCFullYear() + s(dtObj.getUTCMonth() + 1, 2) + s(dtObj.getUTCDate(), 2) + "T" + s(dtObj.getUTCHours(), 2) + s(dtObj.getUTCMinutes(), 2) + s(dtObj.getUTCSeconds(), 2) + "Z";
        },
        Tool: function(opts) {
            dynamicForm.BuildOptions(opts);
            $("#eventUrl").hide();
            var startDatePicker = $("#startDate").datetimepicker({
                    pickSeconds: false,
                    startDate: new Date(),
                    pick12HourFormat: true,
                    language: "en"
                }),
                endDatePicker = $("#endDate").datetimepicker({
                    pickSeconds: false,
                    startDate: new Date(),
                    pick12HourFormat: true,
                    language: "en"
                }),
                tpl = Handlebars.compile($("#url").html()),
                form = $("#icsBuilder");
            $("#icsBuilder :input:visible").on("change", function(e) {
                e.preventDefault();
                var theForm = $("#icsBuilder").serializeObject(),
                    startDatePicker = $("#startDate").data("datetimepicker"),
                    endDatePicker = $("#endDate").data("datetimepicker"),
                    dtstart = startDatePicker.getDate(),
                    dtend = endDatePicker.getDate();
                theForm.startDate = encodeURIComponent(dtstart.toDateString());
                theForm.startTime = encodeURIComponent(dtstart.toTimeString());
                theForm.endDate = encodeURIComponent(dtend.toDateString());
                theForm.endTime = encodeURIComponent(dtend.toTimeString());
                theForm.dtstart = dynamicForm.event.GetICalDateTimeString(dtstart);
                theForm.dtend = dynamicForm.event.GetICalDateTimeString(dtend);
                theForm.url_prefix = dynamicForm.Util.GetUrlPrefix(); //url prefix
                var eventUrl = tpl.render(theForm);
                $("#eventUrl").html("<a href=\"" + eventUrl + "\" target=\"_blank\">" + eventUrl + "</a>").show();
            });
        },
        generateIcs: function(opts) {
            dynamicForm.BuildOptions(opts);
            var tmplHtml = $("#DynamicEventTemplate").html(),
                tpl = Handlebars.compile(tmplHtml),
                data = $.url(document.URL, false).param(),
                timestamp = new Date(),
                ICS = tpl.render(data);
            window.location = "data:text/calendar;charset=utf8," + encodeURI(ICS);
        }
    };
    $.fn.elqTrack = function(siteid, elqid) {
        if (typeof elqid === "undefined") {
            elqid = "";
        }
        if (typeof siteid === "undefined") {
            return false;
        }
        var url = dynamicForm.options.urls.elqLookups[0],
            ref2 = document.referrer !== "" ? document.referrer : "elqNone";
        this.each(function() {
            var ref = this.href;
            if (ref === "") {
                return false;
            }
            $(this).click(function() {
                var ms = new Date().getMilliseconds(),
                    track = "".concat(url, "?pps=10&siteid=", siteid, "&elq=", elqid, "&ref=", ref, "&ref2=", ref2, "&ms=", ms);
                $.ajax({
                    url: track,
                    async: false,
                    dataType: "script"
                });
                return false;
            });
        });
    };
    // NOTE - elq jQuery function usage: var elqTracker = new jQuery.elq(xxx); elqTracker.(pageTrack);
    $.elq = function(id) {
        var settings,
            url = dynamicForm.options.urls.elqLookups[0],
            proxy = dynamicForm.options.urls.elqLookups[1],
            site_id = id;
        return {
            pageTrack: function(options) {
                settings = $.extend({
                    url: "",
                    success: ""
                }, options);
                var pageTrackOpts = {
                        pps: "3",
                        siteid: dynamicForm.options.elqSiteId,
                        src: "pageTrack",
                        ref: encodeURIComponent(document.URL),
                        ref2: document.referrer !== "" ? encodeURIComponent(document.referrer) : "elqNone",
                        tzo: new Date(20020101).getTimezoneOffset(),
                        ms: new Date().getMilliseconds()
                    },
                    elqSrc,
                    elqFrame = $("#elqFrame");
                elqSrc = url + "?" + $.param(pageTrackOpts);
                if (elqFrame.length > 0) {
                    elqFrame.load(function() {
                        if (typeof settings.success === "function") {
                            settings.success();
                        }
                    });
                    elqFrame.attr("src", elqSrc);
                } else {
                    try {
                        elqFrame = document.createElement("iframe");
                        elqFrame.style.display = "none";
                        elqFrame.id = "elqFrame";
                        $(elqFrame).load(function() {
                            if (typeof settings.success === "function") {
                                settings.success();
                            }
                        });
                        elqFrame.src = elqSrc;
                        document.body.appendChild(elqFrame);
                    } catch (e) {
                        //console.error(e);
                    }
                }
                // var elqImg = new Image(1,1);
                // $(elqImg).load(function () {
                //     if(typeof settings.success === "function"){
                //             settings.success();
                //     }
                // });
                // elqImg.src = elqSrc;
            },
            GetElqGuid: function(callback) {
                var deferred = new $.Deferred();
                deferred.resolve();
                var queryStringItems = {
                        pps: 70,
                        siteid: site_id,
                        ref: encodeURIComponent(location.href),
                        ms: new Date().getMilliseconds()
                    },
                    dlookup = url + "?" + $.param(queryStringItems),
                    guid = dynamicForm.Util.GetCookieValue("rh_elqCustomerGUID");
                try {
                    if (guid !== dynamicForm.constants.UNAVAILABLE) {
                        dynamicForm.data.elq_guid = guid;
                        deferred.resolve();
                    } else {
                        $.getScript(dlookup, function() {
                            if (typeof GetElqCustomerGUID !== "undefined") {
                                if (typeof GetElqCustomerGUID === "function") {
                                    dynamicForm.data.elq_guid = new GetElqCustomerGUID();
                                    if (typeof callback === "function") {
                                        callback();
                                    }
                                    deferred.resolve();
                                }
                            }
                        });
                    }
                } catch (e) {
                    //console.error("[dynamicForm logging] error: ", e);
                    deferred.resolve();
                }
                return deferred;
            },
            ProcessData: function(settings, ElqData) {
                var deferred = $.Deferred();
                if (settings.key) {
                    if (typeof dynamicForm.data[settings.lookup_func] === 'undefined') {
                        dynamicForm.data[settings.lookup_func] = [];
                    }
                    dynamicForm.data[settings.lookup_func][settings.key] = (function() {
                        return;
                    })();
                } else {
                    dynamicForm.data[settings.lookup_func] = (function() {
                        return;
                    })();
                }
                try {
                    if (typeof ElqData !== "undefined") {
                        if (typeof ElqData === "function") {
                            if (dynamicForm.data && settings.lookup_func) {
                                if (settings.key) {
                                    dynamicForm.data[settings.lookup_func][settings.key] = (function() {
                                        return ElqData;
                                    })();
                                } else {
                                    dynamicForm.data[settings.lookup_func] = (function() {
                                        return ElqData;
                                    })();
                                }
                            }
                            deferred.resolve();
                        }
                        if (typeof settings.success === "function") {
                            settings.success();
                        }
                    }
                } catch (e) {
                    //console.error("[dynamicForm logging] error: ", e);
                    deferred.resolve();
                } finally {
                    deferred.resolve();
                }
                return deferred;
            },
            GetData: function(options) {
                var deferred = $.Deferred(),
                    settings = $.extend({
                        retry: dynamicForm.data.LookupRetryCount,
                        useSecondary: options.useSecondary
                    }, options),
                    queryStringItems = {
                        pps: 50,
                        siteid: site_id,
                        DLKey: settings.lookup,
                        DLLookup: settings.lookup_param,
                        ms: new Date().getMilliseconds(),
                        callback: settings.lookup_func
                    },
                    dlookup = url + "?" + $.param(queryStringItems);
                if (settings.useSecondary && settings.lookup_func !== "GetElqVisitor") {
                    dlookup = proxy + "?" + $.param(queryStringItems);
                }

                // http://stackoverflow.com/a/11741631
                // For cross domain script tags, the success event fires but the error event does not; no matter what syntax you use. You can try this approach:
                //     Create an error handler and set it to fire after few seconds using handle = window.setTimeout
                //     Inside your success callback function, cancel the timeout using window.clearTimeout(handle)

                var getScriptTimeout;
                getScriptTimeout = window.setTimeout(function() {
                    deferred.resolve();
                }, dynamicForm.constants.TIMEOUT);

                $.getScript(dlookup, function(data, textStatus, jqxhr) {
                    try {
                        switch (settings.lookup_func) {
                            case "GetElqVisitor":
                                $.when(dynamicForm.elqTracker.ProcessData(settings, GetElqVisitor)).then(function() {
                                    deferred.resolve();
                                });
                                break;
                            case "GetElqContact":
                                $.when(dynamicForm.elqTracker.ProcessData(settings, GetElqContact)).then(function() {
                                    deferred.resolve();
                                });
                                break;
                            case "GetElqTactic":
                                $.when(dynamicForm.elqTracker.ProcessData(settings, GetElqTactic)).then(function() {
                                    deferred.resolve();
                                });
                                break;
                            case "GetElqOffer":
                                $.when(dynamicForm.elqTracker.ProcessData(settings, GetElqOffer)).then(function() {
                                    deferred.resolve();
                                });
                                break;
                            default:
                                $.when(dynamicForm.elqTracker.ProcessData(settings, GetElqContentPersonalizationValue)).then(function() {
                                    deferred.resolve();
                                });
                                break;
                        }
                    } catch (e) {
                        //console.error("[dynamicForm logging] error: ", e);
                        if (settings.retry < dynamicForm.options.MAX_RETRIES) {
                            setTimeout(function() {
                                settings.retry++;
                                deferred.notify();
                                $.when(dynamicForm.elqTracker.GetData(settings)).then(function() {
                                    deferred.resolve();
                                });
                            }, 300 * (settings.retry));
                        } else if (settings.retry >= dynamicForm.options.MAX_RETRIES && settings.useSecondary) {
                            deferred.resolve();
                        } else {
                            if (settings.lookup_func === "GetElqVisitor") {
                                deferred.resolve();
                            } else {
                                setTimeout(function() {
                                    deferred.notify();
                                    settings.useSecondary = true;
                                    settings.retry = 0;
                                    $.when(dynamicForm.elqTracker.GetData(settings)).then(function() {
                                        deferred.resolve();
                                    });
                                }, 0);
                            }
                        }
                    } finally {
                        window.clearTimeout(getScriptTimeout);
                    }
                });
                return deferred;
            },
            redirect: function(options) {
                var settings = $.extend({
                    url: "",
                    elq: ""
                }, options);
                if (settings.url === "") {
                    return false;
                }
                var src = "redirect";
                var ms = new Date().getMilliseconds();
                var ref2 = document.referrer !== "" ? document.referrer : "elqNone";
                var redir = url + "?pps=10&siteid=" + site_id + "&elq=" + settings.elq + "&ref=" + settings.url + "&ref2=" + ref2 + "&ms=" + ms;
                $.ajax({
                    url: redir,
                    async: false,
                    dataType: "script",
                    success: function() {
                        //success
                    }
                });
            }
        };
    };
    document.onreadystatechange = function() {
        if (document.readyState === "complete") {
            var config = {};
            if (typeof window.GatedFormConfig !== "undefined") {
                config = window.GatedFormConfig;
            }
            if (typeof DynamicFormConfig !== "undefined") {
                config = DynamicFormConfig;
            }
            config.width = $("#" + dynamicForm.options.elqFormContainerId).width();
            var url_prefix = dynamicForm.Util.GetUrlPrefix(),
                url = document.URL;
            $.when(dynamicForm.Util.CheckPlugins()).then(function() {
                if (url.indexOf(url_prefix + "/forms/eventTool.html") > -1) {
                    //launch tool to create event ics link
                    dynamicForm.event.tool(config);
                } else {
                    if (url.indexOf(url_prefix + "/forms/event.html") > -1) {
                        //launch tool to generate ics file for event
                        dynamicForm.event.generateIcs(config);
                    } else {
                        //launch dynamic form app
                        dynamicForm.Start(config);
                    }
                }
            });
        }
    };
})(window, document, jQuery);
