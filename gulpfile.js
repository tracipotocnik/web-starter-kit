// Gulp file for BSD Tools template starter kit

// Plugins
// -------
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browsersync = require('browser-sync').create(),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    pug = require('gulp-pug'),
    minifycss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    zip = require('gulp-zip');

// Variables
// ---------
var dist = 'dist/',
    source = 'source/';

// Error Handling
// --------------
function handleError() {
  this.emit('end');
}


// Build Tasks
// -----------
gulp.task('sass', function(){
  return gulp.src(source + 'styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(gulp.dest(dist + 'css/' ))
    .pipe(browsersync.stream());
});

gulp.task('css', function(){
  return gulp.src(source + 'css/*.css')
    .pipe(minifycss())
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest(dist + 'css/'));

});

gulp.task('images', function(){
  return gulp.src(source + 'img/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(dist + 'img/'));
});

gulp.task('templates', function(){
  return gulp.src(source + '*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(dist));
});

gulp.task('pug-watch', ['templates'], function() {
  return browsersync.reload();
});

// Dev Tasks
// ---------
gulp.task('default', ['templates'], function(){
  browsersync.init({
    server: {
      baseDir: dist,
    },
    open: false
  });

  gulp.watch(source + '**/*.pug', ['pug-watch']);
  gulp.watch(source + 'img/*', ['images']);
  gulp.watch(source + 'styles/**/*.scss', ['sass']);
});

gulp.task('build', ['css'], function(){
  return gulp.src(dist + '*')
  .pipe(zip('conntourage.zip'))
  .pipe(gulp.dest(dist));
});