var gulp         = require('gulp');
var plumber      = require('gulp-plumber');
var sass         = require('gulp-sass');
var webserver    = require('gulp-webserver');
var autoprefixer = require('gulp-autoprefixer');
var images = require('gulp-image');
var uglify = require('gulp-uglify');
var concat     = require('gulp-concat');
var merge      = require('merge-stream');
//var handlebars = require('handlebars');

var sourcePaths = {
  styles: ['./app/scss/**/*.scss'],
  images : ['./app/images/**/*.png'],
  script : ['./app/js/**/*.js']
};

var distPaths = {
  styles: './output/css',
  images: './output/images',
  script: './output/js'
};

var server = {
  host: 'localhost',
  port: '3000'
};
 
// Compile scss files to css
gulp.task('sass', function () {
  gulp.src( sourcePaths.styles )
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: true
    }))
    .pipe(gulp.dest( distPaths.styles ));
});

gulp.task('images', function () {
  gulp.src(sourcePaths.images)
      .pipe(image({
        pngquant: true,
        optipng: false,
        zopflipng: true,
        advpng: true,
        jpegRecompress: false,
        jpegoptim: true,
        mozjpeg: true,
        gifsicle: true,
        svgo: true
      }))
      .pipe(gulp.dest( distPaths.images));
});

gulp.task('compress', function() {
  return gulp.src(sourcePaths.script)
      .pipe(uglify('*.js', {
        outSourceMap: true
      }))
      .pipe(gulp.dest(distPaths.script));
});

/*gulp.task('templates', function () {
  var hbsStream = gulp.src('./app/views/*.hbs').pipe(handlebars());
  var jsStream  = gulp.src('./app/js/*.js');
  return merge(hbsStream, jsStream).pipe(concat('templates.js'));
});*/

// Run a local webserver 
gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
      host: server.host, 
      port: server.port, 
      livereload: true,
      directoryListing: false
    }));
});
 
gulp.task('watch', function() {
  gulp.watch(sourcePaths.styles, ['sass']);
  gulp.watch(sourcePaths.script, ['compress']);
});
 
gulp.task('build', ['sass']);
 
gulp.task('default', ['build', 'webserver', 'watch', 'compress', 'templates']);