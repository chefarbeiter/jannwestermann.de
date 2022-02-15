var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass')(require('sass'));
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var copy = require('copy');
var merge = require('merge-stream');

// Create CSS from SASS, concat all files, minify and write to dist/j.css
gulp.task('css', function () {
    var sassFiles = gulp.src('./Styles/*.scss')
        .pipe(sass({
            includePaths: ['.'],
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe(concat('sass.css'))
        .pipe(csso());
    var cssFiles = gulp.src('./Styles/**/*.css').pipe(concat('core.css'));

    return merge(cssFiles, sassFiles)
        .pipe(concat('j.css'))
        .pipe(gulp.dest('./dist'));
});

// Gulp task to minify JavaScript files
gulp.task('js', () =>
    gulp.src('./Scripts/**/*.js')
        .pipe(concat('j.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'))
);

// Minify and copy HTML-sites
gulp.task('html', () =>
    gulp.src('./*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true
        }))
        .pipe(gulp.dest('./dist'))
);

// Copy all images to output
gulp.task('images', (c) => copy('./images/*', './dist/', c));

// Clean output directory
gulp.task('clean', () => del(['dist']));

// Complete build...
gulp.task('default', gulp.series('clean', 'css', 'js', 'html', 'images'));