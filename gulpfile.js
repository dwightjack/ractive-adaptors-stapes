'use strict';

/*jshint node:true */

// Include Gulp & tools we'll use
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    moment = require('moment'),
    del = require('del'),
    connect = require('connect'),
    http = require('http'),
    $ = require('gulp-load-plugins')(),
    merge = require('merge-stream'),
    karma = require('karma'),
    runSequence = require('run-sequence'),
    pkg = require('./package.json'),
    banner;

/**
 * Parses the given file using JSDoc's parser.
 * Since JSDoc doesn't isn't require-able, we need to get the parse info from the command line.
 *
 * @param  {String}   filename
 * @param  {Function} cb       ({Object}) -> null - Executed with the AST
 */

pkg.today = moment().format('YYYY-MM-DD');
pkg.year = moment().format('YYYY');

banner = [
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ',
    '<%= pkg.today + "\\n" %>',
    '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>',
    '* Copyright (c) <%= pkg.year %> <%= pkg.author.name %>;',
    ' Licensed <%= pkg.license %> */<%= "\\n" %>'
].join('');


gulp.task('clean', function (done) {
    del(['dist'], {dot: true}, done);
});

gulp.task('jshint', function () {
    return gulp.src(['src/**/*.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('scripts', ['clean'], function() {
    var browserStream,
        moduleStream;

    browserStream = gulp.src(['src/ractive-adaptors-stapes.js', 'src/lib/*.js'])
        .pipe($.concat('ractive-adaptors-stapes.browser.js'))
        .pipe(gulp.dest('dist'))
        .pipe($.uglify({ preserveComments: 'some'}))
        .pipe($.header(banner, {pkg: pkg}))
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));

    moduleStream = gulp.src('src/ractive-adaptors-stapes.js')
        .pipe($.header(banner, {pkg: pkg}))
        .pipe(gulp.dest('dist'));

    return merge(browserStream, moduleStream);
});

gulp.task('test', function (done) {
    karma.server.start({
        configFile: __dirname + '/karma.conf.js',
        autoWatch: false,
        singleRun: true
    }, done);
});

gulp.task('test:run', function (done) {
    karma.runner.run({
        configFile: __dirname + '/karma.conf.js'
    }, done);
});


gulp.task('serve', function () {
    var app = connect();
    app.use(require('serve-static')(__dirname));
    app.use(require('serve-index')(__dirname, {icons: true}));
    http.createServer(app).listen(3000);
    gutil.log(gutil.colors.green('Static server started at http://localhost:3000'));
});

gulp.task('bump', function () {
    var argv = require('minimist')(process.argv.slice(2));

    return gulp.src(['package.json', 'bower.json'])
        .pipe($.bump({type: argv.type || 'patch'}))
        .pipe(gulp.dest('./'));
});

gulp.task('default', function (done) {
    runSequence(['jshint', 'scripts'], 'test', done);
});


gulp.task('dev', ['jshint', 'scripts'], function () {
    karma.server.start({
        configFile: __dirname + '/karma.conf.js',
        autoWatch: false
    });

    gulp.watch(['src/**/*.js', 'test/**/*.js'], function () {
        runSequence(['jshint', 'scripts'], 'test:run');
    });


});

