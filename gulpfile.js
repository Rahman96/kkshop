var gulp = require("gulp"),
    connect = require("gulp-connect"),
    rimraf = require("gulp-rimraf"),
    streamqueue = require("streamqueue"),
    templateCache = require("gulp-angular-templatecache"),
    ngFilesort = require("gulp-angular-filesort"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    ngAnnotate = require('gulp-ng-annotate'),
    rename = require("gulp-rename"),
    less = require("gulp-less"),
    cssmin = require("gulp-cssmin"),
    sequence = require("run-sequence"),
    replace = require("gulp-replace"),
    path = require("path");
var config = {
    dest: "www",
    server: {
        host: "localhost",
        port: "8000"
    },
    fonts: [
        "./bower_components/material-design-icons/iconfont/MaterialIcons-Regular.*",
        // "./bower_components/material-design-icons/iconfont/roboto/*.*"
    ],
    js: [
        // "./bower_components/jquery/dist/jquery.js",
        "./bower_components/angular/angular.js",
        "./bower_components/angular-route/angular-route.js",
        "./bower_components/angular-animate/angular-animate.js",
        "./bower_components/angular-aria/angular-aria.js",
        "./bower_components/angular-material/angular-material.js",
        "./bower_components/angular-local-storage/dist/angular-local-storage.js",
        "./bower_components/ng-flow/dist/ng-flow-standalone.js"
    ],
    less: {
        src: [
            './src/less/app.less'
        ],
        paths: [
            './src/less'
        ]
    }
};
// require configuration
if (require("fs").existsSync("./config.js")) {
    var configObject = require("./config")();
    var configData = [];
    for (key in configObject) {
        configData = configData.concat(configObject[key]);
    }
}
gulp.on('error', function(e) {
    throw (e);
});
// auto generate factory constant
gulp.task("config", function() {
    // config;
    var configuration = {};
    for (key in configObject) {
        configuration[key] = configObject[key];
    }
    gulp.src("./src/js/config.tmpl")
        .pipe(replace("$sidebar", JSON.stringify(configuration)))
        .pipe(rename({
            basename: "config",
            extname: ".js"
        }))
        .pipe(gulp.dest("./src/js/"));
});
// auto generate controller
gulp.task("controller", function() {
    // consoles;
    configData.map(function(ctrl) {
        if (ctrl.type == "link") {
            var controllername = ctrl.url.replace(/[a-z]\/[a-z]/g, function(letter) {
                return letter.replace(/\/[a-z]/g,function(l){
                    l = l.replace("/","").toUpperCase();
                    return l;
                })
            }).replace("/","");
            controllername = controllername + "Controller";
            var foldername = ctrl.url.split("/")[1];
            gulp.src("./src/js/controllers/controller.tmpl")
                .pipe(replace("$controllername", controllername))
                .pipe(rename({
                    basename: controllername,
                    extname: ".js"
                }))
                .pipe(gulp.dest("./src/js/controllers/" + foldername))
        }
        return ctrl;
    });
});
// auto generate templates
gulp.task("template", function() {
    configData.map(function(template) {
        if (template.type == "link") {
            var template_folder = template.url.split("/")[1];
            var template_file = template.url.split("/")[2];
            gulp.src("./src/templates/template.tmpl")
                .pipe(replace("$pagename", template_file))
                .pipe(rename({
                    basename: template_file,
                    extname: ".html"
                }))
                .pipe(gulp.dest("./src/templates/" + template_folder))
        }
        return template;
    })
});
// start a web server
gulp.task("connect", function() {
    connect.server({
        root: config.dest,
        port: config.server.port,
        livereload: true
    });
});
// liveload on source changes
gulp.task("livereload", function() {
    gulp.src(path.join(config.dest, "*.html"))
        .pipe(connect.reload());
});
// minify images
// gulp.task("images", function() {

// });
// copy images
gulp.task("images", function() {
    return gulp.src("./src/images/*.*")
        .pipe(gulp.dest(path.join(config.dest, "images")));
});
// copy svg
gulp.task("svg", function() {
    return gulp.src("./src/images/svg/*.svg")
        .pipe(gulp.dest(path.join(config.dest, "images/svg")));
});
// copy fonts
gulp.task("fonts", function() {
    return gulp.src(config.fonts)
        .pipe(gulp.dest(path.join(config.dest, "fonts")));
});
// copy html file to dest 
gulp.task("html", function() {
    gulp.src(["./src/html/**/*.html"])
        .pipe(gulp.dest(config.dest));
});
// compile less
gulp.task("less", function() {
    return gulp.src(config.less.src).pipe(less({
            paths: config.less.paths.map(function(p) {
                return path.resolve(__dirname, p)
            })
        }))
        .pipe(cssmin())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(path.join(config.dest, "css")));
});
// compile and minify js generating source map
gulp.task("js", function() {
    streamqueue({
                objectMode: true
            },
            gulp.src(config.js),
            gulp.src("./src/js/**/*.js").pipe(ngFilesort()),
            gulp.src(["./src/templates/**/*.html"]).pipe(templateCache({
                module: "kkshop"
            }))
        )
        .pipe(concat("app.js"))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(path.join(config.dest, "js")));
});
gulp.task("watch", function() {
    if (typeof config.server === 'object') {
        gulp.watch([config.dest + '/**/*'], ['livereload']);
    }
    gulp.watch(["./src/html/**/*"], ["html"]);
    gulp.watch(["./src/less/**/*"], ["less"]);
    gulp.watch(["./src/js/**/*", "./src/templates/**/*", config.js], ["js"]);
});
// build sequence
gulp.task("build", function(done) {
    var tasks = ['html', 'fonts', 'less', 'js', "images", "svg"];
    sequence("clean", tasks, done)
});
// clear dest foleder
gulp.task("clean", function(cb) {
    return gulp.src([
        path.join(config.dest, "index.html"),
        path.join(config.dest, "images"),
        path.join(config.dest, "css"),
        path.join(config.dest, "js"),
        path.join(config.dest, "font")
    ], {
        read: false
    }).pipe(rimraf());
});
// default;
gulp.task("default", function(done) {
    var tasks = [];
    if (typeof config.server === "object") {
        tasks.push("connect");
    }
    tasks.push("watch");
    sequence("build", tasks, done);
});
