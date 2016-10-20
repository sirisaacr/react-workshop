var gulp = require('gulp'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	source = require('vinyl-source-stream'),
	connect = require('gulp-connect'),
	buffer = require('vinyl-buffer'),
	uglify = require('gulp-uglify'),
	_ = require('lodash'),
	fs = require('fs'),
	envify = require('gulp-envify'),
	resolve = require('resolve'),
	runSequence = require('run-sequence'),
	del = require('del'),
	config = require('./gulp-config');

gulp.task('client-server', function() {
	connect.server({
		root: config.root,
		livereload: true,
		port: config.port.client
	});
});

gulp.task('build-app', function(){
	var packageJson = require('./package.json'),
		dependencies = Object.keys(packageJson && packageJson.dependencies || {});

	browserify({
	    entries: config.js.appMain,
		extensions: config.js.extensions,
		debug: true
	})
	.external(dependencies)
	.transform(babelify, {presets: config.js.presets, plugins: config.js.plugins})
	.bundle()
	.on('error', console.error.bind(console))
	.pipe(source(config.js.outputName))
	.pipe(buffer())
	.pipe(gulp.dest(config.js.dest))
	.pipe(connect.reload());
});

gulp.task('build-vendor', function () {
	var b = browserify({
		extensions: config.js.extensions,
	});

	var dependencies = config.js.deps;

	getNPMPackageIds().forEach(function (id) {
		if (dependencies.indexOf(id) >= 0) {
			b.require(resolve.sync(id), { expose: id });
		}
	});

	var stream = b
		.transform(envify({
	        _: 'purge',
	        NODE_ENV: 'production'
	    }))
		.bundle()
		.on('error', function(err){
			console.log(err.message);
			this.emit('end');
		})
		.pipe(source('vendor.js'))
		.pipe(buffer())
		.pipe(uglify());

	stream.pipe(gulp.dest(config.js.dest));

	return stream;
});

gulp.task('copy', function() {
	var copy = config.copy;

	gulp.src(copy.index.src)
		.pipe(gulp.dest(copy.index.dest));

	gulp.src(copy.js.src)
		.pipe(gulp.dest(copy.js.dest));

	gulp.src(copy.css.src)
		.pipe(gulp.dest(copy.css.dest));

	gulp.src(copy.img.src)
		.pipe(gulp.dest(copy.img.dest));

	return gulp.src(copy.fonts.src)
		.pipe(gulp.dest(copy.fonts.dest));
});

gulp.task('reload', function(){
	return gulp.src(config.staticIndex)
		.pipe(connect.reload());
});

gulp.task('watch', function(){
	gulp.watch(config.js.watch, ['build-app']);
});

function getNPMPackageIds() {
  var packageManifest = {};
  
  try {
    packageManifest = require('./package.json');
  } catch (e) {
    
  }

  return _.keys(packageManifest.dependencies) || [];
}

gulp.task('default', function() {
	del('client/dist').then(function(path) {
		runSequence('build-vendor', 'build-app', 'copy', 'watch', 'client-server');
	});
});