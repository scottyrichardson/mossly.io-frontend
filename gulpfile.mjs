import gulp from "gulp";
import concat from "gulp-concat";
import cleanCSS from "gulp-clean-css";
import terser from "gulp-terser";
import sourcemaps from "gulp-sourcemaps";
import htmlreplace from "gulp-html-replace";
import browserSync from "browser-sync";
import { deleteAsync } from "del";
import rename from "gulp-rename";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import { existsSync } from "fs";

const bs = browserSync.create();

// Clean
const clean = async () => {
  await deleteAsync(["dist"]);
};

// CSS
const css = () => {
  return gulp
    .src("src/assets/css/*.css")
    .pipe(sourcemaps.init())
    .pipe(concat("styles.css"))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/assets/css"))
    .pipe(bs.stream());
};

// JavaScript
const js = (cb) => {
  if (!existsSync("src/assets/js")) {
    // If JS directory doesn't exist, just create an empty dir and complete the task
    return gulp.src("*", { read: false }).pipe(gulp.dest("dist/assets/js"));
  }

  return gulp
    .src("src/assets/js/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("scripts.js"))
    .pipe(terser())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/assets/js"));
};

// Copy Images
const images = () => {
  return gulp
    .src("src/assets/img/**/*", { encoding: false })
    .pipe(gulp.dest("dist/assets/img"));
};

// HTML
const html = () => {
  return gulp
    .src("src/*.html")
    .pipe(
      htmlreplace({
        css: "assets/css/styles.min.css",
        js: "assets/js/scripts.min.js",
      })
    )
    .pipe(gulp.dest("dist"));
};

// Server
const serve = () => {
  bs.init({
    server: "./dist",
  });

  gulp.watch("src/assets/css/*.css", gulp.series(css));
  gulp.watch("src/assets/js/*.js", gulp.series(js)).on("change", bs.reload);
  gulp.watch("src/*.html", gulp.series(html)).on("change", bs.reload);
  gulp
    .watch("src/assets/img/**/*", gulp.series(images))
    .on("change", bs.reload);
};

// Build
const build = gulp.series(clean, gulp.parallel(css, js, images, html));

// Dev
const dev = gulp.series(build, serve);

// Prod
const prod = gulp.series(build);

// Export tasks
export { clean, css, js, images, html, serve, build, dev, prod };

// Default task
export default dev;
