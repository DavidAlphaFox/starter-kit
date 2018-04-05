const gulp           = require('gulp');
const postcss        = require('gulp-postcss');
const sourcemaps     = require('gulp-sourcemaps');
const tailwind       = require('tailwindcss');
const postcssImport  = require('postcss-import');
const nunjucksRender = require('gulp-nunjucks-render');
const webpack        = require('webpack-stream');

const paths = {
  config: {
    tailwind: './tailwind.js',
    webpack:  './webpack.config.js'
  },
  src: {
    html: {
      pages: 'src/pages/**/*',
      templates: ['src/templates/']
    },
    css: 'src/css/styles.css',
    js: 'src/js/index.js'
  },
  dist: {
    html: './dist/',
    css:  './dist/css/',
    js:   './dist/js'
  }
}

var html = function() {
  return gulp.src(paths.src.html.pages)
    .pipe(nunjucksRender({
      path: paths.src.html.templates
    }))
    .pipe(gulp.dest(paths.dist.html))
}

var js = function() {
  return gulp.src(paths.src.js)
    .pipe(webpack(require(paths.config.webpack)))
    .pipe(gulp.dest(paths.dist.js));
}

var css = function() {
  return gulp.src(paths.src.css)
    .pipe(sourcemaps.init())
    .pipe(postcss([
      postcssImport(),
      tailwind(paths.tailwindConfig)
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist.css));
};

gulp.task('build', gulp.parallel(html, css, js));