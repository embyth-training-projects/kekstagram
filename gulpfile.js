'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var newer = require('gulp-newer');
var htmlmin = require('gulp-htmlmin');
var zip = require('gulp-zip');
var del = require('del');
var pipeline = require('readable-stream').pipeline;
var browserSync = require('browser-sync').create('Local Server');

const isDev = !process.env.NODE_ENV;
const isProd = !!process.env.NODE_ENV;

gulp.task('scripts', function () {
  return pipeline(
    gulp.src('./js/**/*.js'),
    newer('./build/js/'),
    gulp.dest('./build/js')
  );
});

gulp.task('html', function () {
  return gulp.src('./*.html')
    .pipe(newer('./build/'))
    .pipe(gulpif(
      isProd,
      htmlmin({
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        removeComments: true
      })
    ))
    .pipe(gulp.dest('./build/'));
});

gulp.task('copy', function () {
  return gulp.src(['favicon.ico', './css/**/*.css', './fonts/**/*.{woff,woff2,ttf,eot,svg}', './img/**/*.{jpg,jpeg,svg,gif,png}', './photos/**/*.{jpg,jpeg,svg,gif,png}'], { base: '.' })
    .pipe(newer('./build/'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('clean', function () {
  return del('./build/');
});

gulp.task('server', function (done) {
  browserSync.init({
    server: {
      baseDir: './build/'
    },
    notify: false,
    open: true,
    cors: true,
    ui: false,
    reloadOnRestart: true,
  });

  done();
});

gulp.task('watch', function () {
  gulp.watch('./**/*.html').on('all', gulp.series('html', browserSync.reload));
  gulp.watch('./js/**/*.js').on('all', gulp.series('scripts', browserSync.reload));
});

gulp.task('build', gulp.series('clean', gulp.parallel('copy', 'html', 'scripts')));

gulp.task('default', gulp.series('build', 'server', 'watch'));

// Archiving project
const leadingZero = number => number < 10 ? `0${number}` : number;

const getDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = leadingZero(now.getMonth() + 1);
  const day = leadingZero(now.getDate());
  const hours = leadingZero(now.getHours());
  const minutes = leadingZero(now.getMinutes());
  const seconds = leadingZero(now.getSeconds());

  return `${year}-${month}-${day}-${hours}${minutes}${seconds}`;
};

gulp.task('zip', function () {
  let dateTime = getDateTime();
  let fileName = `dist-${dateTime}.zip`;

  return gulp.src('./build/**/*.*')
    .pipe(zip(fileName))
    .pipe(gulp.dest('./dist'));
});
