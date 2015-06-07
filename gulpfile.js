'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('scripts', function() {
    return gulp.src('app/js/app.js')
        .pipe($.browserify({
            insertGlobals: true,
            transform: ['babelify']
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('copy', function () {
    return gulp.src([
            'app/index.html',
            'app/**/*.css',
        ])
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['dist'], function () {
    gulp.watch('app/css/**', ['copy']);
    gulp.watch('app/js/**', ['scripts']);
});

gulp.task('dist', ['copy', 'scripts']);
