var gulp = require("gulp");
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var uglify = require("gulp-uglify");
var runSequence = require('run-sequence');
var sass = require("gulp-sass");
var environments = require("gulp-environments");
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync").create(); // webserver & livereload watch change file
var browserify = require("browserify");
var minifyCss = require('gulp-minify-css');
var useref = require("gulp-useref");
var imagemin = require("gulp-imagemin");
const babel = require('gulp-babel');
var del = require('del');
const theload = "DoDoc";
const mien = "Beverage" ; // Beverage
const baseDir =  "./"; //"./src/"+mien+"/"+ theload;
const buildDir = "./Build";
// build source
gulp.task("useref", function() {
    return gulp
        .src(baseDir + "index.html")
        .pipe(useref())
        .pipe(gulpIf(['**/*.js', '!**/*.min.js'],babel({
            presets: ['@babel/env']
        })))
        .pipe(gulpIf(['**/*.js', '!**/*.min.js'],uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest(buildDir));
});
// Combind scss and css
gulp.task("scss", function() {
    gulp.src(baseDir + "/scss/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer('last 2 versions') )
        .pipe(minifyCss())
        .pipe(
            browserSync.reload({
                stream: true
            })
        )
        .pipe(gulp.dest(baseDir+"/css"));
});
// live reload
gulp.task("browserSync", function() {
    browserSync.init({
        server: {
            baseDir: baseDir
        }
    });
});
// compress Image

gulp.task('imagess', function(){
    return gulp.src(baseDir + '/assets/images/**/*.+(png|jpg|jpeg|gif)')
    .pipe(gulp.dest(buildDir + "/assets/images"))
  });

// copy sounds

gulp.task('sound', function(){
    return gulp.src(baseDir + '/assets/sound/**/*.+(mp3)')
    .pipe(gulp.dest(buildDir + "/assets/sound"))
  });
//
gulp.task('cleans', function() {
    return del.sync(buildDir);
  })
// default watch dev
gulp.task("watch", ["browserSync", "scss"], function() {
    gulp.watch( baseDir+ "/scss/**/*.scss", ["scss"]);
    gulp.watch(
        [baseDir+"/**/*.{html,htm,css,js}", "index.html"],
        browserSync.reload
    );
});
//scssBB
gulp.task("scss-build", function() {
    gulp.src(baseDir + "/scss/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer('last 2 versions') )
        .pipe(minifyCss())
        .pipe(gulp.dest(baseDir+"/css"));
});

// Build
// gulp.task('build', [`cleans`, `useref`, `images`], function (){
//     console.log('Building files');
//   })

gulp.task('build', function (callback) {
runSequence('cleans', 
    ['useref', 'imagess','sound'],
    callback
)
})


gulp.task("test", function() {
    browserSync.init({
        server: {
            baseDir: buildDir
        }
    });
});