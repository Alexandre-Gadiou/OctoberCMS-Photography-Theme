'use strict';

var gulp = require('gulp');
var del = require('del');
var rename = require('gulp-rename');
var batch = require('gulp-batch');
var watch = require('gulp-watch');
var ejs = require("gulp-ejs");
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

 /**
 * Config object
 */
var config = {
  'srcFolder' : './',
  'htmlFolder' : './prototype/',
  'distFolder' : './prototype/dist/'
};

gulp.task('clean', function () {
  return del(config.distFolder);
});

gulp.task('clean:html', function () {
  return del(config.distFolder+'*.html');
});

gulp.task('clean:css', function () {
  return del(config.distFolder+'assets/css/**/*');
});

gulp.task('clean:javascript', function () {
  return del(config.distFolder+'assets/javascript/**/*');
});

gulp.task('clean:images', function () {
  return del(config.distFolder+'assets/images/**/*');
});

gulp.task('clean:fonts', function () {
  return del(config.distFolder+'assets/fonts/**/*');
});

gulp.task('clean:vendor', function () {
  return del(config.distFolder+'assets/vendor/**/*');
});

gulp.task('ejs', function() {
  return gulp.src(config.htmlFolder+"pages/*.ejs")
    .pipe(ejs({
        msg: "Building html static pages"
    }))
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest(config.distFolder));
});

gulp.task('sass', function () {
  return gulp.src(config.srcFolder+'assets/sass/theme.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.srcFolder+'assets/css/'));
});

gulp.task('cssmin', function() {
  return gulp.src(config.srcFolder+'assets/css/theme.css')
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.srcFolder+'assets/css/'));
});

gulp.task('jsmin', function() {
  return gulp.src(config.srcFolder+'assets/javascript/main.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.srcFolder+'assets/javascript/'));
});

gulp.task('browserify', function() {
    return gulp.src(config.srcFolder+'assets/javascript/app.js')
        .pipe(browserify())
        .pipe(rename({basename:'main',extname:'.js'}))
        .pipe(gulp.dest(config.srcFolder+'assets/javascript/'));
});

gulp.task('watch', function () {
    watch(config.htmlFolder+'components/**/*.ejs', batch(function (events, done) {
        gulp.start('buildHTML', done);
    }));
    watch(config.htmlFolder+'content/**/*.ejs', batch(function (events, done) {
        gulp.start('buildHTML', done);
    }));
    watch(config.htmlFolder+'layouts/**/*.ejs', batch(function (events, done) {
        gulp.start('buildHTML', done);
    }));
    watch(config.htmlFolder+'pages/**/*.ejs', batch(function (events, done) {
        gulp.start('buildHTML', done);
    }));
    watch(config.htmlFolder+'partials/**/*.ejs', batch(function (events, done) {
        gulp.start('buildHTML', done);
    }));
    watch(config.srcFolder+'assets/sass/**/*.scss', batch(function (events, done) {
        gulp.start('buildCSS', done);
    }));
    watch([config.srcFolder+'assets/javascript/**/*.js','!'+config.srcFolder+'assets/javascript/main.js','!'+config.srcFolder+'assets/javascript/main.min.js'], batch(function (events, done) {
        gulp.start('buildJS', done);
    }));
    watch(config.srcFolder+'assets/images/**/*', batch(function (events, done) {
        gulp.start('buildImages', done);
    }));
    watch(config.srcFolder+'assets/fonts/**/*', batch(function (events, done) {
        gulp.start('buildFonts', done);
    }));
    watch(config.srcFolder+'assets/vendor/**/*', batch(function (events, done) {
        gulp.start('buildVendor', done);
    }));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: config.distFolder,
            index: "index.html"
        }
    });

    gulp.start('watch');

    gulp.watch(config.distFolder+"*.html").on('change', browserSync.reload);
    gulp.watch(config.distFolder+"assets/css/**/*.css").on('change', browserSync.reload);
    gulp.watch(config.distFolder+"assets/javascript/**/*.js").on('change', browserSync.reload);
    gulp.watch(config.distFolder+"assets/images/**/*").on('change', browserSync.reload);
    gulp.watch(config.distFolder+"assets/fonts/**/*").on('change', browserSync.reload);

});


gulp.task('copy:css', function() {
  return gulp.src(config.srcFolder+'assets/css/**/*.*')
    .pipe(gulp.dest(config.distFolder+'assets/css/'));
});

gulp.task('copy:javascript', function() {
  return gulp.src(config.srcFolder+'assets/javascript/**/*.*')
    .pipe(gulp.dest(config.distFolder+'assets/javascript/'));
});

gulp.task('copy:images', function() {
  return gulp.src(config.srcFolder+'assets/images/**/*.*')
    .pipe(gulp.dest(config.distFolder+'assets/images/'));
});

gulp.task('copy:fonts', function() {
  return gulp.src(config.srcFolder+'assets/fonts/**/*.*')
    .pipe(gulp.dest(config.distFolder+'assets/fonts/'));
});

gulp.task('copy:vendorBower', function() {
  return gulp.src('./bower_components/**/*.*')
    .pipe(gulp.dest(config.srcFolder+'assets/vendor/'));
});

gulp.task('copy:vendorAssets', function() {
  return gulp.src(config.srcFolder+'assets/vendor/**/*.*')
    .pipe(gulp.dest(config.distFolder+'assets/vendor/'));
});


gulp.task('buildHTML', function(cb) {
  runSequence('clean:html','ejs', cb);
});
gulp.task('buildCSS', function(cb) {
  runSequence('sass','copy:css', cb);
});
gulp.task('buildJS', function(cb) {
  runSequence('browserify','copy:javascript', cb);
});
gulp.task('buildImages', function(cb) {
  runSequence('clean:images','copy:images', cb);
});
gulp.task('buildFonts', function(cb) {
  runSequence('clean:fonts','copy:fonts', cb);
});
gulp.task('buildVendor', function(cb) {
  runSequence('clean:vendor','copy:vendorBower','copy:vendorAssets', cb);
});


gulp.task('build', function(cb) {
  runSequence('clean','buildVendor', 'buildFonts', 'buildImages', 'buildCSS', 'buildJS', 'buildHTML', cb);
});
gulp.task('default', function(cb) {
  runSequence('build','browser-sync', cb);
});
gulp.task('release', function(cb) {
  runSequence('build','cssmin','jsmin', cb);
});