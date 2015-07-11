'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('scripts', function() {
    return gulp.src('app/js/app.js')
        .pipe($.browserify({
            insertGlobals: true,
            transform: ['babelify']
        }))
        .pipe(gulp.dest('dist/js'))
        .pipe($.livereload());
});

gulp.task('styles', function () {
    return gulp.src('app/css/dashboard.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            errLogToConsole: true
        }))
        .pipe($.autoprefixer('last 2 version'))
        .pipe($.minifyCss())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css'))
        .pipe($.livereload());
});

gulp.task('copy', function () {
    return gulp.src(['app/index.html'])
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['dist'], function () {
    $.livereload.listen();
    gulp.watch('app/css/**', ['styles']);
    gulp.watch('app/js/**', ['scripts']);
});

gulp.task('dist', ['copy', 'styles', 'scripts']);
