const {src, dest, watch, series, parallel} = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')(require('node-sass'));
const { logError } = sass;

// Search paths
const files = {
    htmlPath: "src/**/*.html",
    cssPath: "src/css/*.css",
    jsPath: "src/js/*.js",
    imagePath: "src/images/*",
    sassPath: "src/sass/*.scss"
}

// HTML-task, copy html files
function copyHTML() {
    return src(files.htmlPath)
    .pipe(dest('pub'))
}

// JS-task, concat and minimize JS files
function jsTask() {
    return src(files.jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('script.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub/js'));
}

// CSS-task, concat and minimize CSS files
/* function cssTask() { 
    return src(files.cssPath)
    .pipe(concat('style.css'))
    .pipe(cssnano())
    .pipe(dest('pub/css'))
    .pipe(browserSync.stream());
} */

// image-task, minimize images
function imageTask() { 
    return src(files.imagePath)
    .pipe(imagemin())
    .pipe(dest('pub/images'));
}

function sassTask() {
    return src(files.sassPath)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", logError))
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub/css'))
    .pipe(browserSync.stream());
}

// Watcher
function watchTask() {

    browserSync.init({
        server: "./pub"
    });

    watch([files.htmlPath, files.jsPath, files.imagePath, files.sassPath], parallel(copyHTML, jsTask, imageTask, sassTask)).on('change', browserSync.reload);
}

exports.default = series (
    parallel(copyHTML, jsTask, imageTask, sassTask),
    watchTask
);