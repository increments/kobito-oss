gulp   = require 'gulp'
sass   = require 'gulp-sass'
rename = require 'gulp-rename'
webpack = require 'gulp-webpack'

gulp.task 'default', ['build']
gulp.task 'build', ['build:css', 'webpack']
gulp.task 'build:css', ->
  gulp
    .src('styles/style.scss')
    .pipe(sass())
    .pipe(gulp.dest('src/'))

gulp.task 'webpack', ->
  gulp
    .src('src/index.coffee')
    .pipe(webpack(require('./webpack.config')))
    # .pipe(rename('src/index.coffee'))
    .pipe(gulp.dest('./'))

gulp.task 'watch', ['build'], ->
  gulp.watch 'styles/**/*.scss', ['build:css']
  gulp.watch 'src/**/*', ['webpack']
