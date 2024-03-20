// //automatizar funciones de javascript

// function task (callback){
//     console.log('tarea');
//     callback();         //informar de que la tarea fue finalizada
// }

// //hacer disponibla la llamada de la funcion para node

// exports.firstTask /*parte a llamar */ = task; //parte de referencia


const { src, dest, watch, parallel, series } = require("gulp");

//CSS
const sass = require("gulp-sass")(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const cache = require('gulp-cache');
const avif = require('gulp-avif');

//javascript
const terser = require('gulp-terser-js');

function css(callback) {
    //identificar archivo sass
    //compilar archivo sass
    //almacenar el archivo compilado

    src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'));

    callback();
}

function versionWebp(callback) {

    const options = {
        quality: 100
    };

    src('src/img/**/*.{png, jpg}')
        .pipe(webp(options))
        .pipe(dest('build/img'))
    callback();
}

function versionAvif(callback) {

    const options = {
        quality: 100
    };

    src('src/img/**/*.{png, jpg}')
        .pipe(avif(options))
        .pipe(dest('build/img'))
    callback();
}

function imagenes(callback) {
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png, jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    callback();
}

function javascript(callback) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    callback();
}

function dev(callback) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);

    callback();
}

exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.javascript = javascript;
exports.css = css;
exports.dev = parallel(javascript, dev);
exports.imagenes = series(versionWebp, versionAvif, imagenes);

