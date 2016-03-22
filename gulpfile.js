var gulp = require("gulp");

// jade
gulp.task("jade", function() {
    var jade = require("gulp-jade");

    gulp.src("./source/*.jade")
        .pipe(jade())
        .pipe(gulp.dest("./"))
});

// sass
gulp.task("sass", function() {
    var postcss = require("gulp-postcss");
    var autoprefixer = require("autoprefixer-core");
    var sass = require("gulp-sass");

    gulp.src("./source/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(postcss([ autoprefixer({ browsers: ["last 2 versions"] }) ]))
        .pipe(gulp.dest("./"));
});

// watch
gulp.task("watch", function() {
    gulp.watch("./source/*.jade", ["jade"]);
    gulp.watch("./source/*.scss", ["sass"]);
});

// default
gulp.task("default", ["jade", "sass"]);
