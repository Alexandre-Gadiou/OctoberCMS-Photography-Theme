'use strict';

var $ = require('jquery');

global.jQuery = $;
global.$ = $;

var bootstrap3 = require('../vendor/bootstrap-sass/assets/javascripts/bootstrap.min.js');
var bootstrapSubMenu = require('../vendor/bootstrap-submenu/dist/js/bootstrap-submenu.min.js');


var bootstrapMenu = require('./components/bootstrap-menu');
var facebookFramework = require('./components/facebook-framework');


console.trace('app loaded');

$(function () {
    bootstrapMenu.initialize();
    facebookFramework.initialize();
});
