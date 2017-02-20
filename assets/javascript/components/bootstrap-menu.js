'use strict';

console.trace("app/components/bootstrap-menu loaded");

var $ = require('jquery');

var init = function () {
    $('[data-submenu]').each(function () {
        var $element = $(this);
        $element.submenupicker();
    });
};

module.exports = {
    initialize: init
};