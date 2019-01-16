var gulp = require('gulp');

/* Styles*/
var sass = require('gulp-sass');
var gulpStylelint = require('gulp-stylelint');
var autoprefixer = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

/* JS*/
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');

/* Utilities */
var gutil = require("gulp-util");
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

var config = {
    PORT: "3005",
    BUILD_PATH: 'public/build/',
    SOURCE_PATH: 'public/src/',
    SASS_WATCH: 'public/src/scss/**/*.scss',
    SASS_INPUT: 'public/src/scss/app.scss',
    CSS_OUTPUT: 'app.css',
    CSS_OUTPUT_MIN: 'app.min.css',
    JS_INPUT: 'public/src/js/app.js',
    JS_OUTPUT: 'public/build/',
    JS_WATCH: 'public/src/js/**/*.js',
    REFRESH_WATCH: [
        'craft/templates/*.html',
        'craft/templates/*.twig',
        'craft/templates/**/*.twig',
        'public/build/*.js'
    ],
};

gulp.task('stylelint', function() {
    return gulp
        .src(config.SASS_WATCH)
        .pipe(gulpStylelint({
            failAfterError: false,
            reporters: [
                {
                    formatter: 'string',
                    console: true
                }
            ]
        }));
});

gulp.task('sass', ['stylelint'], function() {
	return gulp.src(config.SASS_INPUT)
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
        browsers: ['> 3%']
    }))
	.pipe(sass({
        includePaths: [
            require('node-normalize-scss').includePaths
        ]
	}).on('error', sass.logError))
	.pipe(rename(config.CSS_OUTPUT))
    .pipe(sourcemaps.write())
	.pipe(gulp.dest(config.BUILD_PATH))
	.pipe(browserSync.stream());
});

gulp.task('minify-css', ['sass'], function() {
	return gulp.src(config.BUILD_PATH + config.CSS_OUTPUT)
	.pipe(cleanCss({compatibility:'ie8'}))
	.pipe(rename(config.CSS_OUTPUT))
	.pipe(gulp.dest(config.BUILD_PATH));
});

gulp.task('scripts', function() {
    // Single entry point to browserify
    gulp.src(config.JS_INPUT)
        .pipe(browserify({
            insertGlobals : true
        }))
        .pipe(gulp.dest(config.BUILD_PATH))
});

gulp.task('minify-js', ['scripts'], function (cb) {
    pump([
            gulp.src(config.JS_INPUT),
            uglify(),
            gulp.dest(config.JS_OUTPUT)
        ],
        cb
    );
});

gulp.task('watch', ['sass', 'scripts'], function() {
    //Start browser sync server
	browserSync.init({
        port: config.PORT,
		proxy:"malbecliving.co.nz.local"
	});
    //Watch SASS files
	gulp.watch(config.SASS_WATCH, ['sass']);
    //Watch html, php and JS files to reload page
    gulp.watch(config.REFRESH_WATCH).on('change', browserSync.reload);
    // Watch js
    gulp.watch(config.JS_WATCH, ['scripts']);
});

gulp.task('build', ['minify-css', 'minify-js']);

gulp.task('default', ['watch']);
