const {src, dest, watch, series, parallel} = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
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

// Image-task, minimize images
function imageTask() { 
    return src(files.imagePath)
    .pipe(imagemin())
    .pipe(dest('pub/images'));
}

// Sass-task. Convert and compress scss code to css code.
function sassTask() {
    return src(files.sassPath)
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'compressed'
    }).on("error", logError))
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