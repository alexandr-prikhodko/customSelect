'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    //css part
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    livereload = require('gulp-livereload'),
    //html part
    jade = require('gulp-jade'),
    //js part
    include = require("gulp-include"),
    uglify  = require('gulp-uglify');

/*====================================================================================================================*/
gulp.task('default', ['gulp_watch']);

gulp.task('gulp_watch', function () {
    livereload.listen();
    gulp.watch('sass/**/*.scss', ['sass']).on('change', livereload.changed);
    gulp.watch('jade/**/*.jade', ['jade']).on('change', livereload.changed);
    gulp.watch('js/**/*.js', ['js']);
});

/*====================================================================================================================*/

gulp.task('jade', function() {
    return gulp.src('jade/*.jade')
        .pipe(jade({pretty: true})) //pipe to jade plugin
        .pipe(gulp.dest('../dist/')) //tell gulp our output folder
        .pipe(livereload());
});

/*====================================================================================================================*/

gulp.task('sass', function () {
    return gulp.src('sass/**/*.scss')
        //compile scss code to css
        .pipe(sass().on('error', sass.logError))
        //add browser prefixes
        .pipe(autoprefixer({
            browsers: ['last 20 versions'],
            cascade: false
        }))
        //clean and minify css
        .pipe(cleanCSS({compatibility: 'ie9'})) //commented for comfortable dev process

        //push to project folder
        .pipe(gulp.dest('../dist/css'))
        .pipe(livereload());    //обновляем браузер
});

/*====================================================================================================================*/
var jsFiles     = 'js/**/*.js',
    jsDest      = '../dist/js';

gulp.task('js', function() {
    return gulp.src(jsFiles)
        .pipe(include())
        .on('error', console.log)
        .pipe(gulp.dest(jsDest))
        //.pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest))
        .pipe(livereload());
});