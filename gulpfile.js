"use strict";

var browserSync = require('browser-sync').create();
var beautify = require('gulp-jsbeautify');
var cleanCSS = require('gulp-clean-css');
var eslint = require("gulp-eslint");
var gulp = require("gulp");
var gutil  = require("gulp-util");
var pump = require('pump');
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var sourceMaps = require("gulp-sourcemaps");
var uglify = require('gulp-uglify');



// Default development task
gulp.task("default", ["watch"]);

// Build task
gulp.task("build", ["uglify-js", "uglify-css", "copy-fonts"]);

// Watch task
gulp.task("watch", function() {
	gulp.watch( "./src/js/**/*.js", ["lint-js"] );
	gulp.watch("./src/js/**/*.js", ["js-beautify"]);
	gulp.watch( "./src/css/scss/**/*.scss", ["build-scss"] );

	// Copy files to changed files to dist directory.
	gulp.src("./src/js/slider.js", {base: "./"})
	.pipe(gulp.dest("./dist/js/"));

	gulp.src("./src/css/slider.css", {base: "./"})
	.pipe(gulp.dest("./dist/css/"));	
});

gulp.task("lint-js", function() {
	return gulp.src( ["./src/js/slider.js", "!node_modules/**"], {base: "./"} )
		.pipe( eslint() )
		.pipe( eslint.format() )
		.pipe( eslint.failAfterError() );	
});

gulp.task("js-beautify", function() {
	gulp.src("./src/js/slider.js", {base: "./"})
	.pipe(gulp.dest("./"));	
});

gulp.task("build-scss", function() {
  return gulp.src("./src/css/scss/**/*.scss")
    .pipe( sourceMaps.init() )
    .pipe( sass().on('error', swallowError ) )
    .pipe( sourceMaps.write("./src/css/") )    
    .pipe( gulp.dest("./src/css/slider.css") );
});

gulp.task("uglify-js", function(cb) {
  pump([
        gulp.src("./src/js/slider.js"),
        uglify(),
        rename({suffix: '.min'}),
        gulp.dest('./dist/js/')
    ],
    cb
    );
});

gulp.task("uglify-css", function() {
	return gulp.src("./src/css/slider.css")
		.pipe(cleanCSS())
		.pipe(rename("slider.min.css"))
		.pipe(gulp.dest("./dist/css/"));
});

gulp.task("copy-fonts", function() {
	gulp.src("./src/fonts/*.*")
		.pipe(gulp.dest("./dist/fonts/"));
});

// Catch errors
function swallowError (error) {

  // If you want details of the error in the console
  console.log(error.toString());

  this.emit("end");
}





