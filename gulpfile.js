// Пути
let path = {
    build: {
        html: 'build/',
        css: 'build/css/',
        js: 'build/js/',
        img: 'build/img/',
        fonts: 'build/fonts'
    },
    src: {
        html: 'src/*.html',
        css: 'src/scss/*.scss',
        js: 'src/js/*.js',
        img: 'src/img/**/*.{jpg,png,svg,webp,ico}',
        fonts: 'src/fonts/*.ttf'
    },
    watch: {
        html: 'src/**/*.html',
        css: 'src/scss/**/*.scss',
        js: 'src/js/**/*.js',
        img: 'src/img/**/*.{jpg,png,svg,webp,ico}'
    },
    clean: './build'
}
let {dest, src} = require('gulp'),
    gulp = require('gulp'), // подключаем gulp
    browsersync = require('browser-sync'), // обновление браузера
    sass = require('gulp-sass'), // работа с препроцессорами
    imagemin = require('gulp-imagemin'), // сжимание картинок
    clean_css = require('gulp-clean-css'), // сжимание .css
    rename = require('gulp-rename'), // переименуем сжатые файлы в .min.css и .min.js
    uglify = require('gulp-uglify-es').default, // сжимание .js
    webp = require('gulp-webp'), // конвертируем картинки в .webp
    webphtml = require('gulp-webp-html'); // интегрируем .webp с тегом img

function browserSync() {
    browsersync({
        server: {
            baseDir: './build'
        },
        notify: false,
        port: 3000
    })
}

function html() {
    return src(path.src.html)
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(sass())
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: '.min.css'
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(
            rename({
                extname: '.min.js'
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function image() {
    return src(path.src.img)
        .pipe(webp({
            quality: 70
        }))
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}],
            optimizationLevel: 3
        }))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

// Следим за файлами
function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], image);
}

let build = gulp.parallel(html, css, js, image);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.image = image;
exports.html = html;
exports.js = js;
exports.css = css;
exports.build = build;
exports.watch = watch;
exports.default = watch;