const { src, dest, watch, series } = require('gulp');

// CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Imagenes
// const imagemin = require('gulp-imagemin');
// const webp = require('gulp-webp');
// const avif = require('gulp-avif');
const squoosh = require('gulp-libsquoosh');

function css(done) {
    src('src/scss/app.scss')
        .pipe( sourcemaps.init() )
        .pipe( sass() ) // comprimir css { outputStyle: 'compressed' } - expandir css: { outputStyle: 'expanded' }
        .pipe( postcss( [ autoprefixer(), cssnano() ] ) )
        .pipe( sourcemaps.write('.') ) // ( '.' ) significa que se guarda gunto al build 
        .pipe( dest('build/css') ) // es una funcion que gulp entiene que aquí finalizo la tarea, ( si no se le especifica marca un error, o se le puede agregar un return a inicio para no usar ese done() ) 
    done();
}

function imagenes() {
    return src('src/img/**/*')
        .pipe( squoosh() )
        .pipe( dest('build/img') )
}
function versionesWebpAvif() {
    return src('src/img/**/*.{png,jpg}')
        .pipe( squoosh({
            webp: {},
            avif: {}
        }))
        .pipe( dest('build/img') )
}

function dev() {
    watch('src/scss/**/*.scss', css);
    // watch('src/img/**/*', imagenes);
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionesWebpAvif = versionesWebpAvif;
exports.default = series( imagenes, versionesWebpAvif, css, dev );


/*Depencias y Usos 
    1.- GULP: esta es la dependencia por la cual se puede hacer todo lo demas pero mas especificamente se usa
        para tener los siguientes métodos:
        1.- src: para saber de donde se va a obtener el archivo de sass para compilarlo a css
        2.- dest: funcion para guardar eñ compilado de sass a css ( en la carpeta de build )
        3.- watch: para poder ir leyendo los cambios en diferentes archivos en tiempo real he irlos compilando
                   toma dos valores( a que se le tiene que poner atencion(ruta), funcion a llamar cuando haya cambios )
        4.- series: ejecuta una tarea y, cuando la completa pasa a la otra
        5.- parallel: Todas las tareas inician al mismo tiempo
    
    2.- SASS: entiende la gramatica del lenguaje de sass, y se le puede pasar en formado de objetos los 
        siguientes paramentros:
        { outputSytle: 'compressed' } // comprime el archivo compilado de css
        { outputStyle: 'expanded' } // descomprime el archivo compilado de css

    3.- GULP-SASS: es la que permite la conexion con el archivo de gulpfile.js

    4.- AUTOPREFIXER, GULP-POSTCSS, POSTCSS: con estas dependecias vamos a poder escribir código de css de 
        ultima generacion y nos va a crear versiones complatibles para navagadores  que no la soportan

    5.- GULP-WEBP, GULP-AVIF: crear imagenes en esos formatos mas ligeros

    6.- GULP-SOURCEMAPS: te hace un mapa de en cual archivo de .sass esta el codigo de css que estas examinando

    7.- CSSNANO: minifica el tamaño del código de css

    8.- GULP-IMAGEMIN: ya dejo de funcionar ;c pero era para hacer imagenes mas ligeras sin cambiar 
        el formato a .webp o .avif

    9.- gulp-libsquoosh: puede hacer lo que hacia gulp-imagemin y tambien minifica a .webp y .avif

    Notas: 
    **: significa que va a entrar a todas las carpetas
    *.scss: va a buscar todos los archivos que tengan la extencion de .scss
*/          
