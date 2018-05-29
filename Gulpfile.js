// Gulp configuration
'use strict';

const

  // source and build folders
  dir = {
    src: 'src/',
    build: 'dist/'
  },

  // Gulp and plugins
  gulp			    = require('gulp'),
	gutil			    = require('gulp-util'),
  newer			    = require('gulp-newer'),
  imagemin		  = require('gulp-imagemin'),
  pngquant      = require('imagemin-pngquant'),
  sass			    = require('gulp-sass'),
  postcss			  = require('gulp-postcss'),
	deporder		  = require('gulp-deporder'),
	concat			  = require('gulp-concat'),
	stripdebug	  = require('gulp-strip-debug'),
	uglify			  = require('gulp-uglify'),
	notify			  = require('gulp-notify'),
	plumber			  = require('gulp-plumber'),
	rename			  = require('gulp-rename'),
	zip				    = require('gulp-zip'),
  del				    = require('del'),
  browserSync   = require('browser-sync').create(),
  packageJSON	  = require('./package.json')
;

/**
 * Image settings and processing
 */
const images = {
  src     : dir.src + 'images/**/*.+(png|jpg|jpeg|gif|svg)',
  build   : dir.build + 'images/'
};

// optimizes all PNG, JPG, and SVG images. */
gulp.task('images', () => {
  return gulp.src(images.src)
    .pipe(newer(images.build))
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(images.build))
});

gulp.task('fonts', () => {
  return gulp.src(dir.src + 'fonts/**/*.+(ttf|otf|woff|woff2|eot|svg)')
    .pipe(gulp.dest(dir.build + 'fonts/'))
})

/**
 * CSS settings and processing
 */
let css = {
	src			: dir.src + 'scss/style.scss',
	cssSrc	: dir.src + 'css/**/*.css',
	watch		: dir.src + 'scss/**/*',
	build		: dir.build,
	sassOpts: {
		outputStyle		: 'nested',
		imagePath		: images.build,
		precision		: 3,
		errLogToConsole : true
	},
	processors: [
		require('postcss-assets')({
			loadPaths	: ['images/'],
			basePath	: dir.build,
			baseUrl		: dir.src + './'
		}),
		require('autoprefixer')({
			browsers	: ['last 2 versions', '> 2%']
		}),
		require('css-mqpacker'),
		require('cssnano')
	]
};

gulp.task('sass', ['images'], () => {
  return gulp.src(css.src)
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(sass(css.sassOpts))
    .pipe(postcss(css.processors))
		.pipe(gulp.dest(css.build + 'css/'))
		.pipe(browserSync.stream({match: '**/*.css'}))
});

// Copy stylesheet files
gulp.task('copy-css', () => {
	return gulp.src(css.cssSrc)
    .pipe(gulp.dest(css.build + 'css/'));
});

gulp.task('copy-sass', () => {
  return gulp.src(css.watch)
    .pipe(gulp.dest(css.build + 'scss/'));
})

/**
 * Scripts settings and processing
 */
const js = {
	src			  : dir.src + 'js/**/*.js',
	build		  : dir.build
};

gulp.task('scripts', () => {
  return gulp.src(js.src, {base: dir.src})
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(deporder())
    .pipe(stripdebug())
		.pipe(uglify())
		.pipe(gulp.dest(js.build))
		.pipe(browserSync.stream());
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: dir.build
    },
    open: false,
    notify: false
  });
});

/**
 * Lists all files that should be copied
 * to the 'dist' folder for build tasks
 */
const copyFiles = [
  dir.src + '*.ico',
  dir.src + '*.html',
];

// copy files
gulp.task('copy-files', () => {
	return gulp.src(copyFiles)
		.pipe(newer(dir.build))
		.pipe(gulp.dest(dir.build))
		.pipe(browserSync.stream());
});

/**
 * Clean directory of system files
 */
gulp.task('clean', () => {
  return del.sync([
    dir.build + '**/DS_Store',
		dir.build + '**/*.DS_Store',
    dir.build + '**/*.ini',
    dir.build + '**/*.db'
  ]);
});

/**
 * Compress build directory to dist package
 */
gulp.task('zip', () => {
  return gulp.src(dir.build + '**/*')
    .pipe(zip(packageJSON.name + '-v' + packageJSON.version + '.zip'))
    .pipe(gulp.dest('./'))
});

/**
 * Watch tasks to ensure processes finish before reloading the browser
 */
gulp.task('css-watch', ['sass'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('js-watch', ['scripts'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('html-watch', (done) => {
  browserSync.reload();
  done();
});

/**
 * Delete task for removing 'dist' directory
 */
gulp.task('delete', () => {
  return del.sync(dir.build);
})

/**
 * Build task for production that deletes unwanted files,
 * and zips them for distribution
 */
gulp.task('build', ['sass', 'images', 'scripts', 'fonts', 'copy-sass', 'copy-css', 'copy-files', 'clean', 'zip'], () => {
  gulp.src(dir.build, {base: dir.build});
});

/**
 * Default gulp task
 */
gulp.task('default', ['sass', 'scripts', 'images', 'fonts', 'copy-sass', 'copy-css', 'copy-files', 'clean', 'browser-sync'], () => {
  // add browserSync.reload to the tasks array to make
  // all browsers reload after tasks are complete.
  gulp.watch(css.watch, ['sass']);
  gulp.watch(css.src, ['css-watch']);
  gulp.watch(js.src, ['js-watch']);
  gulp.watch(dir.src + '*.html', ['html-watch']);
});
