var gulp = require('gulp'),
	projectName = 'juliasimmons',
	clientName = 'JuliaSimmons',
	jsfiles = [
				'src/js/libs/jquery-3.0.0.min.js',
				'src/js/libs/*.js',
				'src/js/base/define.js',
				'src/js/modules/*.js',
				'src/js/base/router.js'
			],
	outputs = {
		css: 'assets/',
		js: 'assets/',
		css_minified: 'assets/',
		js_uglified: 'assets/'
	};

/////////////
// Modules //
/////////////
var jshint = require ('gulp-jshint'),
	concat = require('gulp-concat'),
	stripDebug = require('gulp-strip-debug'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	notify = require('gulp-notify'),
	gutil = require('gulp-util'),
	rename = require('gulp-rename'),
	size = require('gulp-filesize'),
	jscs = require('gulp-jscs'),
	stylish = require('gulp-jscs-stylish'),
	autoprefixer = require('autoprefixer'),
	postCss = require('gulp-postcss'),
	mqPacker = require('css-mqpacker'),
	pxToRem = require('postcss-pxtorem'),
	sourceMaps = require('gulp-sourcemaps'),
	doiuse = require('doiuse'),
	cssNano = require('gulp-cssnano'),
	nunjucksRender = require('gulp-nunjucks-render'),
	data = require('gulp-data');

var devProcessors = [
        autoprefixer()
        // pxToRem({rootValue: 16, replace: false, mediaQuery: true})
	],
	prodProcessors = [
		// pxToRem({rootValue: 16, replace: false, mediaQuery: true}),
		mqPacker()
	];

///////////
// Tasks //
///////////
gulp.task('js:hint', function(){
	gutil.log(gutil.colors.blue('--> Validating JS '));
	gulp.src(['src/js/base/*.js', 'src/js/modules/*.js', '!src/js/libs/*.js'])
 		.pipe(jshint())
		.pipe(jscs({
			configPath: 'rocketcode.json'
		}))
		.pipe(stylish.combineWithHintResults())
		.pipe(notify(function(file){
			if (file.jshint.success) {
				return false;
			}
			return file.relative + " has errors!";
		}))
		.pipe(jshint.reporter('jshint-stylish', { verbose: true, beep: true }));
});

gulp.task('js:concat', function(){
	gutil.log(gutil.colors.blue('--> Concatenating JS '));
	gulp.src(jsfiles)
		.pipe(sourceMaps.init())
		.pipe(concat(projectName + '.js'))
		.pipe(gulp.dest(outputs.js))
		.pipe(sourceMaps.write())
		.pipe(notify({ title: clientName + ' JS', message: 'Good to go.' }));
});

gulp.task('js:uglify', function(){
	gutil.log(gutil.colors.blue('--> Uglifying JS '));
	gulp.src(jsfiles)
		.pipe(concat(projectName + '.js'))
		.pipe(stripDebug())
		.pipe(uglify(), { mangle: false })
		.pipe(gulp.dest(outputs.js_uglified));
});

gulp.task('css:postsass', function(){
	gutil.log(gutil.colors.blue('--> Compiling CSS Stuffs '));
	gulp.src('src/css/scss/*.scss')
		.pipe(sourceMaps.init())
		.pipe(sass({outputStyle: 'expanded'}).on('error', function(err){
			gutil.log(gutil.colors.bold.white.bgRed('\n \n [SASS] ERROR \n'));
			console.error('', err.message);
			return notify({
				title: 'Sass Error',
				message: 'Error on line ' + err.line + ' of ' + err.file
			}).write(err);
		}))
		.pipe(sourceMaps.write())
		.pipe(postCss(devProcessors))
		.pipe(size())
		.pipe(rename(projectName + '.css'))
		.pipe(gulp.dest('assets/'))
		.pipe(notify({ title: clientName + ' CSS', message: 'CSS Refreshed' }));
});

gulp.task('css:post_build', function(){
	gutil.log(gutil.colors.blue('--> Making CSS Stuffs Smaller '));
	gulp.src('src/css/scss/*.scss')
		.pipe(sass().on('error', function(err){
			gutil.log(gutil.colors.bold.white.bgRed('\n \n [SASS] ERROR \n'));
			console.error('', err.message);
			return notify({
				title: 'Sass Error',
				message: 'Error on line ' + err.line + ' of ' + err.file
			}).write(err);
		}))
		.pipe(postCss(prodProcessors))
		.pipe(cssNano())
		.pipe(rename(projectName + '.css'))
		.pipe(size())
		.pipe(gulp.dest('assets/'))
		.pipe(notify({ title: clientName + ' CSS', message: 'CSS Refreshed' }));
});

gulp.task('css:sass', function(){
	gutil.log(gutil.colors.blue('--> Compiling SASS '));
	gulp.src('src/css/scss/*.scss')
		.pipe(sass().on('error', function(err){
			gutil.log(gutil.colors.bold.white.bgRed('\n \n [SASS] ERROR \n'));
			console.error('', err.message);
			return notify({
				title: 'Sass Error',
				message: 'Error on line ' + err.line + ' of ' + err.file
			}).write(err);
		}))
		.pipe(rename(projectName + '.css'))
		.pipe(size())
		.pipe(gulp.dest(outputs.css))
		.pipe(notify({ title: clientName + ' CSS', message: 'Good to go.' }));
});

gulp.task('nunjucks', function() {
	// Gets .html and .nunjucks files in pages
	return gulp.src('pages/**/*.+(html|nunjucks)')
	.pipe(data(function() {
		return require('./data.json')
	}))
	// Renders template with nunjucks
	.pipe(nunjucksRender({
		path: 'templates/'
	}))
	// output files in app folder
	.pipe(gulp.dest(''))
});

///////////////////
// Coupled Tasks //
///////////////////

gulp.task('build', ['js:uglify', 'css:post_build'], function(){
	gulp.src('gulpfile.js').pipe(notify({
		title: 'Build Scripts',
		message: 'Finished!'
	}));
});

gulp.task('default', ['js:hint', 'js:concat', 'css:postsass'], function() {

	// watch for changes in src
	gulp.watch('src/js/**/*.js', ['js:hint','js:concat']);

	// watch for sass changes
	gulp.watch('src/css/scss/**/*.scss',['css:postsass']);

	// watch for markup changes
	gulp.watch('**/*.nunjucks', ['nunjucks']); 

});

