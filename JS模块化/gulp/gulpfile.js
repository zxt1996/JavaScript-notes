let devUrl = "./src";
let {src , dest , watch , series , parallel} = require('gulp');
let sass = require('gulp-sass');
sass.compiler = require('node-sass');
let autoprefixer = require('gulp-autoprefixer');
let browserSync = require('browser-sync').create();
let reload = browserSync.reload;
let babel = require('gulp-babel');
let uglify = require('gulp-uglify');
let imagemin = require('gulp-imagemin');

//开发环境将 sass 编译成 css
function devSass() {
  return src( devUrl + '/scss/**/*.scss' )
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
//  		是否美化样式
            cascade: false
        }))
    .pipe(dest( devUrl + '/css'));
    
}
//上线打包压缩css代码
function minCss(){
	return src( devUrl + '/css/**/*.css')
				.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
   			.pipe(dest('dist/css/'));
}

// 转es5并压缩js
function minJS(){
	return src( devUrl + '/js/**/*.js')
				.pipe(babel({
					presets: ['@babel/env']
				}))
				.pipe(uglify())
				.pipe(dest('dist/js/'));
}

//压缩图片
function miniImg(){
    return src(devUrl + '/images/**/*.*')
        .pipe(imagemin())
        .pipe(dest('dist/images'))
};

// 开启静态服务器
function browser() {
    browserSync.init({
        server: {
//      		对应监听的根目录
            baseDir: devUrl
        },
//  	 修改端口号
        port: (Math.random()*9999)+1000
    });
    watch(devUrl + '/css/**/*.css').on("change", reload);
    watch(devUrl + '/*.html').on("change", reload);
    //监听目录,调用对应任务
  	watch(devUrl + '/scss/**/*.scss',devSass);
};
// 定义一个copy任务
async function copyTask(){
	// 复制html font
	src(devUrl + '/*.html').pipe(dest('dist/'));
	src(devUrl + '/font/*').pipe(dest('dist/font/'));
};
exports.copyTask = copyTask;
//输出sass任务
exports.devSass = devSass;

//输出开发任务
exports.dev = browser;

//定义打包任务 压缩css 压缩js 压缩图片
exports.build = series(devSass,minCss,minJS,miniImg,copyTask);
