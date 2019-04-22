const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
//const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const pngquant = require('imagemin-pngquant');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref =require('gulp-useref');
// A JavaScript parser and mangler/compressor toolkit for ES6+.
const terser = require('gulp-terser');
// gulp if is to filter the content
const gulpIf = require('gulp-if');
const cleancss = require('gulp-clean-css');
// to remove files
const del = require('del');
//const cache = require('gulp-cache');
const postcss      = require('gulp-postcss');
const sourcemaps   = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');


gulp.task('img', function () {
    return gulp.src('img/*')
      .pipe(imagemin([
        imagemin.gifsicle(),
        imagemin.svgo(),
        pngquant({
            quality: [0.7, 0.9],
            speed: 1,
            dithering: 0.5
        }),
        imageminJpegRecompress({
          //progressive: true,
          loops:6,
          min: 40,
          max: 85,
          quality:'low'
        })
      ], {
          //progressive: true,
          interlaced: true
        }))
  
      .pipe(gulp.dest('dist/img'));
  
  });


gulp.task('browserSync', function(done) {
    browserSync.init({

        server: {baseDir: './'},
        
    });    
    done();
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return (gulp.src('*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass()).on('error', sass.logError)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream())
    )
});


gulp.task('default', gulp.series('browserSync', function watching () {
    gulp.watch('*.scss').on('change', gulp.series('sass'));
    gulp.watch('*.css').on('change', browserSync.reload);
    //gulp.watch('css/*.scss').on('change', gulp.series('sass'));
    gulp.watch('index.html').on('change', browserSync.reload);
    //gulp.watch('index.html', browserSync.reload);// reloads only once
    gulp.watch('*.js').on('change', browserSync.reload);
    gulp.watch('img/').on('change', browserSync.reload);
}))

gulp.task('combi', function() {
    return gulp.src('index.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', babel()))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', postcss([ autoprefixer() ])))
        .pipe(gulpIf('*.css', cleancss()))
        .pipe(gulp.dest('dist/'))
});


gulp.task('fonts', function() {
    return gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(gulp.dest('dist/node_modules/@fortawesome/fontawesome-free/webfonts/'));
});
gulp.task('aws', function() {
    return gulp.src('./node_modules/@fortawesome/fontawesome-free/css/all.min.css')
    .pipe(gulp.dest('dist/node_modules/@fortawesome/fontawesome-free/css/'))
})
gulp.task('clean:dist', function(){
    return del(['dist']).then(paths => {
           console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});


/*gulp.task('prefix', function() {
    return gulp.src('*.css')
    //.pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer() ]))
    //.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
})*/

gulp.task('build', gulp.series('clean:dist', 'sass', gulp.parallel('combi', 'img', 'fonts', 'aws'))
);

  
  