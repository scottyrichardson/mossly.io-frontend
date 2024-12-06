const gulp = require('gulp');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const htmlreplace = require('gulp-html-replace');
const browserSync = require('browser-sync').create();
const { deleteAsync } = require('del');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

// Clean
gulp.task('clean', async () => {
    await deleteAsync(['dist']);
});

// CSS
gulp.task('css', () => {
    return gulp.src('src/assets/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(concat('styles.css'))
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.stream());
 });

// JavaScript
gulp.task('js', () => {
    return gulp.src('src/assets/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/assets/js'));
 });

// Copy Images
gulp.task('images', () => {
    return gulp.src('src/assets/img/**/*', { encoding: false })
        .pipe(gulp.dest('dist/assets/img'));
});

// HTML
gulp.task('html', () => {
    return gulp.src('src/*.html')
        .pipe(htmlreplace({
            'css': 'assets/css/styles.min.css',
            'js': 'assets/js/scripts.min.js'
        }))
        .pipe(gulp.dest('dist'));
});

// Server
gulp.task('serve', () => {
    browserSync.init({
        server: "./dist"
    });

    gulp.watch('src/assets/css/*.css', gulp.series('css'));
    gulp.watch('src/assets/js/*.js', gulp.series('js')).on('change', browserSync.reload);
    gulp.watch('src/*.html', gulp.series('html')).on('change', browserSync.reload);
    gulp.watch('src/assets/img/**/*', gulp.series('images')).on('change', browserSync.reload);
});

// Build
gulp.task('build', gulp.series('clean', gulp.parallel('css', 'js', 'images', 'html')));

// Dev
gulp.task('dev', gulp.series('build', 'serve'));

// Prod
gulp.task('prod', gulp.series('build'));

// Default
gulp.task('default', gulp.series('dev'));