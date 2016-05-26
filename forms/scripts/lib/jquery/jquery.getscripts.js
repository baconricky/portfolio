/**
 * jQuery.getScripts v1.0.1
 * https://github.com/hudsonfoo/jquery-getscripts
 *
 * Load one or multiple JavaScript files from the server using a GET HTTP request, then execute them..
 *
 * Copyright 2014 David Hudson
 *
 * Released Under the Following Licenses
 * https://github.com/hudsonfoo/jquery-getscripts/blob/1.0.0/MIT-LICENSE.txt
 *
 * Date: 2014-03-23T21:35:00
 */
(function($) {
    "use strict";

    if ($.getScripts) {
        return;
    }

    $.getScripts = function(options) {
        var _options, _sync, _async, _response;

        _options = $.extend({
            'async': false,
            'cache': true
        }, options);

        if (typeof _options.urls === 'string') {
            _options.urls = [_options.urls];
        }

        _response = [];

        _sync = function() {
            $.ajax({
                url: _options.urls.shift(),
                dataType: 'script',
                cache: _options.cache,
                success: function() {
                    _response.push(arguments);
                    if (_options.urls.length > 0) {
                        _sync();
                    } else if (typeof options.success === 'function') {
                        options.success($.merge([], _response));
                    }
                }
            });
        };

        _async = function() {
            _response.push(arguments);
            if (_response.length === _options.urls.length &&
                typeof options.success === 'function') {
                options.success($.merge([], _response));
            }
        };

        if (_options.async === true) {
            for (var i = 0; i < _options.urls.length; i++) {
                $.ajax({
                    url: _options.urls[i],
                    dataType: 'script',
                    cache: _options.cache,
                    success: _async
                });
            }
        } else {
            _sync();
        }
    };
})(jQuery);
