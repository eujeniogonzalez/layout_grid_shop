const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const pug = require('gulp-pug');
const del = require('del');

// Таск для сборки PUG-файлов
gulp.task('pug', function(callback) {
    return gulp.src('./src/pug/pages/**/*.pug')
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Pug',
                    sound: false,
                    message: err.message
                }
            })
        
        }))
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./build/'))
        .pipe(browserSync.stream())
    callback()
});

// Таск для компиляции SCSS в CSS
gulp.task('scss', function(callback) {

    return gulp.src('./src/scss/main.scss')

        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
                return {
                    title: 'Styles',
                    sound: false,
                    message: err.message
                }
            })
        
        }))

        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 4 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/css/'))
        .pipe(browserSync.stream())
    callback();
});

// Копирование изображений
gulp.task('copy:img', function() {
    return gulp.src('./src/img/**/*.*')
    .pipe(gulp.dest('./build/img/')); 
});

// Копирование скриптов
gulp.task('copy:js', function() {
    return gulp.src('./src/js/**/*.*')
    .pipe(gulp.dest('./build/js/')); 
});

// Слежение за изменением в файлах
gulp.task('watch', function(){
    gulp.watch(['./build/img/**/*.*', './build/js/**/*.js'], gulp.parallel(browserSync.reload))
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('scss'));
    gulp.watch('./src/pug/**/*.pug', gulp.parallel('pug'));
    gulp.watch('./src/img/**/*.*', gulp.parallel('copy:img'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('copy:js'));
})

// Задача для старта сервера из папки app
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
});

// Очищаем папку build
gulp.task('clean:build', function() {
    return del('./build')
});

gulp.task(
    'default',
    gulp.series(
        gulp.parallel('clean:build'),
        gulp.parallel('pug', 'scss', 'copy:img', 'copy:js'),
        gulp.parallel('server', 'watch')
    )
);