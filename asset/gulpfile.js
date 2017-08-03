require('es6-promise').polyfill();

var gulp = require('gulp'),
    cssimport = require('gulp-cssimport'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rev = require('gulp-rev'),
    prism = [
        'core',
        'markup',
        'css',
        'clike',
        'javascript',
        'apacheconf',
        'bash',
        'batch',
        'css-extras',
        'diff',
        'docker',
        'git',
        'handlebars',
        'http',
        'ini',
        'json',
        'less',
        'makefile',
        'markdown',
        'nginx',
        'php',
        'php-extras',
        'powershell',
        'puppet',
        'sass',
        'scss',
        'smarty',
        'sql',
        'twig',
        'vim',
        'yaml'
    ];

gulp.task('images', function () {
    return gulp.src('img/*')
        .pipe(gulp.dest('../theme/img/'));
});

gulp.task('scripts', function () {
    var prismComponents = [];
    for (var component in prism) {
        prismComponents[component] = 'node_modules/prismjs/components/prism-' + prism[component] + '.min.js';
    }

    return gulp.src(prismComponents.concat([
            'node_modules/prismjs/plugins/normalize-whitespace/prism-normalize-whitespace.min.js',
            'node_modules/anchor-js/anchor.min.js',
            'js/base.js',
            'js/scripts.js'
        ]))
        .pipe(concat({path: 'scripts.js'}))
        .pipe(uglify({mangle: false}))
        .pipe(rev())
        .pipe(gulp.dest('../theme/js/'))
        .pipe(rev.manifest('../assets.yml', {merge: true}))
        .pipe(gulp.dest('./'));
});

gulp.task('styles', function () {
    return gulp.src('sass/styles.scss')
        .pipe(cssimport({filter: /^..\/node_modules\//gi}))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rev())
        .pipe(gulp.dest('../theme/css/'))
        .pipe(rev.manifest('../assets.yml', {merge: true}))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['images', 'scripts', 'styles']);
