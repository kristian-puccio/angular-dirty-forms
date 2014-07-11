var gulp = require('gulp');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var ngmin = require('gulp-ngmin');
var angularTemplates = require('gulp-angular-templates');
var es = require('event-stream');
var sourcemaps = require('gulp-sourcemaps');

// This compiles up the angular stuff ready for prod serving
gulp.task('build', function () {
    var scripts = gulp.src('./src/**/*.js');
    var templates = gulp.src('./src/**/*.tmpl')
        .pipe(plumber())
        .pipe(angularTemplates({module: 'angular-dirty-forms'}));

    return es.concat(scripts, templates)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('angular-dirty-forms.js'))
        .pipe(ngmin())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("./assets/js/"));
});

gulp.task('watch', function() {
    gulp.watch('./src/**/*.js', ['build']);
});
