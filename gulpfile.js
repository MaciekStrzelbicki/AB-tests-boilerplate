var gulp = require('gulp');
var clean = require('gulp-clean');
var inline = require('gulp-inline');
var uglify = require('gulp-uglify-js');
var minifyCss = require('gulp-minify-css');
var htmlmin = require('gulp-htmlmin');
var autoprefixer = require('gulp-autoprefixer');
var inject = require('gulp-js-text-inject');
var codeInject = require('gulp-inject');
var sass = require('gulp-sass');
var path = require('path');
var removeHtmlComments = require('gulp-remove-html-comments');
var stripJsComments = require('gulp-strip-comments');
var prettify = require('gulp-jsbeautifier');
var replace = require('gulp-replace');
var debug = require('gulp-debug');
var runSequence = require('run-sequence');

gulp.task('sass', function() {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/temp'));
});

gulp.task('clean-dist', function() {
  return gulp.src(['dist/*'], {
      read: false
    })
    .pipe(clean());
});


gulp.task('clean-debug', function() {
  return gulp.src(['debug/*'], {
      read: false
    })
    .pipe(clean());
});

gulp.task('clean-temp', function() {
  return gulp.src(['src/temp/'], {
      read: false
    })
    .pipe(clean());
});

gulp.task('minify-templates', function() {
  return gulp.src('src/temp/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('src/temp/'));
});

gulp.task('inline-templates', function() {
  return gulp.src('src/js/*.js')
    .pipe(stripJsComments())
    .pipe(inject({
      basepath: 'src/temp'
    }))
    .pipe(gulp.dest('src/temp/'));
});

gulp.task('inline-img', function() {
  return gulp.src('src/HTMLFragments/*.html')
    .pipe(inline({
      base: 'src/img/'
    }))
    .pipe(gulp.dest('src/temp/'));
});

gulp.task('inline-dist', function() {
  return gulp.src('src/index.html')
    .pipe(inline({
      base: 'src/',
      css: [minifyCss, autoprefixer({
        browsers: ['last 2 versions']
      })]
    }))
    .pipe(removeHtmlComments())
    .pipe(gulp.dest('dist/'));
});


gulp.task('uglifyjs', function() {
    uglify('./src/temp')
});

gulp.task('inline-debug', function() {
  return gulp.src('src/index.html')
    .pipe(inline({
      base: 'src/'
    }))
    .pipe(removeHtmlComments())
    .pipe(prettify())
    .pipe(gulp.dest('debug/'));
});

gulp.task('inline-code', function() {
  return gulp.src('src/temp/main.js')
    .pipe(codeInject(
      gulp.src(['src/temp/*.js']), {
        starttag: '<!-- inject:{{path}} -->',
        relative: true,
        transform: function(filePath, file) {
          return file.contents.toString('utf8');
        }
      }
    ))
    .pipe(removeHtmlComments())
    .pipe(gulp.dest('src/temp'));
});

gulp.task('removeLoggers', function(){
  return gulp.src(['src/temp/*.*'])
    .pipe(replace(/console\.(log|warn|error)\(([^)]+)\)(;*)+/g, ''))
    .pipe(gulp.dest('src/temp'));
});

gulp.task('removeHTTP-S', function(){
  return gulp.src(['src/temp/*.*'])
    .pipe(replace(/(http(s*):\/\/)+/g, '//'))
    .pipe(gulp.dest('src/temp'));
});

gulp.task('correctWrongInternalLinks', function(){
  return gulp.src(['src/temp/*.*'])
    .pipe(replace('/JS/core/', '/core/'))
    .pipe(gulp.dest('src/temp'));
});

gulp.task('dist', function() {
	runSequence(
		'clean-dist',	'sass', 'inline-img', 'minify-templates', 'inline-templates', 'inline-code', 'removeLoggers', 'removeHTTP-S', 'correctWrongInternalLinks', 'uglifyjs', 'inline-dist'
	);
});
gulp.task('debug', function() {
	runSequence(
		'clean-debug',	'sass', 'inline-img', 'minify-templates', 'inline-templates', 'inline-code', 'removeHTTP-S', 'correctWrongInternalLinks', 'inline-debug', 'clean-temp'
	);
});
