var gulp   = require('gulp'),
    sass   = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rev    = require('gulp-rev'),
    prism  = [
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

// Images
gulp.task('images', function () {
    return gulp.src('img/*')
        .pipe(gulp.dest('../theme/img/'));
});

// Icons
gulp.task('icons', function () {
    return gulp.src('node_modules/font-awesome/fonts/**.*')
        .pipe(gulp.dest('../theme/css/fonts'));
});

// JavaScript
gulp.task('scripts', function () {
    var prismComponents = [];
    for (var component in prism) {
        prismComponents[component] = 'node_modules/prismjs/components/prism-' + prism[component] + '.js';
    }

    return gulp.src(
        prismComponents.concat(
            [
                'node_modules/prismjs/plugins/normalize-whitespace/prism-normalize-whitespace.min.js',
                'node_modules/jquery/dist/jquery.min.js',
                'node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js',
                'node_modules/anchor-js/anchor.min.js',
                'js/base.js',
                'js/component-list.js'
            ]
        )
    )
        .pipe(concat({path : 'scripts.js'}))
        .pipe(uglify({mangle : false}))
        .pipe(rev())
        .pipe(gulp.dest('../theme/js/'))
        .pipe(rev.manifest('../assets.yml', {merge : true}))
        .pipe(gulp.dest('./'));
});

// CSS
gulp.task('styles', function () {
    return gulp.src(
        [
            'node_modules/prismjs/themes/prism-okaidia.css',
            'sass/styles.scss'
        ]
    )
        .pipe(sass())
        .pipe(rev())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('../theme/css/'))
        .pipe(rev.manifest('../assets.yml', {merge : true}))
        .pipe(gulp.dest('./'));
});

// Bundle
gulp.task('default', ['images', 'icons', 'scripts', 'styles']);

// Watch
gulp.task('watch', function () {
    gulp.watch(['sass/**/*.scss'], ['styles']);
});