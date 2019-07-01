var gulp = require('gulp'),

	name = require('gulp-rename'),
    md   = require('gulp-remarkable'),
    gutil = require('gulp-util'),
    replace = require('gulp-replace'),
    handlebars = require('gulp-compile-handlebars'),

    moment = require('moment'),
    async = require('async'),

	html2pdf = require('./util/gulp-html2pdf'),
	wkhtmltopdf = require('./util/wkhtml2pdf'),

	glob = require('glob'),
	fs = require('fs'),
	path = require('path')
    rename = require('gulp-rename');
var display = require('./util/display');

 function isURL(str) {
     var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
     var url = new RegExp(urlRegex, 'i');
     return str.length < 2083 && url.test(str);
}

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory() && fs.readdirSync(path.join(dir, file)).length;
        });
}

function string_src(filename, string) {
    var src = require('stream').Readable({ objectMode: true });
    src._read = function () {
        this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }));
        this.push(null);
    };
    return src;
}

function handleRelativeImagePaths(imagePath, match, srcPath, folder) {
    if (isURL(imagePath) || imagePath.indexOf("file:///") > -1) {
        return match;
    }
    // if an absolute path add file:/// for wkhtmltopdf
    if (path.isAbsolute(imagePath)) {
        return match.replace(imagePath, "file:///" + imagePath.toLowerCase());
    }
    return match.replace(imagePath, "file:///" + path.resolve(srcPath, folder, imagePath.toLowerCase()));
}

function getContentForFolder(folder, srcPath) {
    var content = '';
    var files = glob.sync(path.join(srcPath, folder, '/**/*.md'));
    var referencedImages = glob.sync(path.join(srcPath, folder, '/**/*.{jpg,png,gif}'));
    var absoluteImagePaths = referencedImages.map(function (imgPath) {
        return path.resolve(process.cwd(), imgPath);
    });
    
    content += "\n<div class='page-break'></div>\n<h1>" + folder + "</h1>\n\n";
    files.forEach(function(file, idx) {
        content += getContentForFile(file, idx, folder, srcPath)
    });
    return content;
}

function getContentForFile(file, idx, folder, srcPath) {
    var content = '';
    if (idx !== 0) {
        content += "\n<div class='page-break'></div>";
    }

    content += "\n\n";
    content += fs.readFileSync(file, "utf-8");
    content = content.replace(/src=['"](?:[^"'\/]*\/)*([^'"]+)['"]/g, function (match) {
        var imgPath = match.replace('src="', "").replace('"', "");
        return handleRelativeImagePaths(imgPath, match, srcPath, folder);
    });
    // handle md image tags.
    content = content.replace(/(!\[.*?\]\()(.+?)(\))/g, function(match, alt, imagePath) {
        var betweenQuotes = content.match(/(```([^```])*```)/g); // don't match tags in ``` ```
        var negate = betweenQuotes.reduce(function (result, current) {
            return current.indexOf(imagePath) > -1 ? true : result;
        }, false);
        
        if (negate) {
            return match;
        }
        
        var absoluteMdTag = handleRelativeImagePaths(imagePath, match, srcPath, folder);
        var absoluteImagePath = absoluteMdTag.match(/\(([^)]+)\)/)[1];
        if ((isURL(absoluteImagePath) || absoluteImagePath.indexOf("file:///") > -1)) {
            var altText = alt.match(/[^[\]]+(?=])/g)[0];   
            return '<img alt="' + altText + '" src="' + absoluteImagePath + '">';
        }
        
        return absoluteMdTag;
    });
    return content;
}

function getContentFromMetadataSources(sources) {
    var content = '';
    sources = sources || [];
    for(var i = 0; i < sources.length; i++) {
        var markdown = sources[i];
        if (!markdown.title || !markdown.location) { continue; }
        content += "\n<div class='page-break'></div>\n<h1>" + markdown.title + "</h1>\n\n";
        content += getContentForFile(markdown.location, 0);
    }
    return content;
}

function get_srcs(meta, srcPath) {

    var content = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>' + meta["name"] + ' Documentation</title></head><body>';
    content += "\n\n" + fs.readFileSync(path.join(srcPath, 'index.md'), "utf-8");
    var folders = getFolders(srcPath);
    folders.forEach(function(folder) {
        content += getContentForFolder(folder, srcPath);
    });

    content += getContentFromMetadataSources(meta.include);

    //content += "\n\n<div class='page-break'></div>\n\n" + fs.readFileSync(path.join(srcPath, 'appendix.md'), "utf-8");
    content += '</body></html>';
    return string_src("chapters.build.md", content);
}


function buildDocumentationFor(src, dest, taskDone, root) {
    var srcPath = path.resolve(src);
    var destPath = (typeof dest === 'undefined')
        ? path.resolve(srcPath, "../")
        : path.resolve(dest);
    var rootPath = (typeof root === 'undefined')
        ? path.resolve("./")
        : path.resolve(root);
    wkhtmltopdf.command = path.resolve(rootPath, "./build/tools/wkhtmltopdf-0.12.3.2/wkhtmltopdf.exe");
    display.info('Src', srcPath);
    display.info('Dest', destPath);
    display.info('Root', rootPath);

	var meta = require(path.resolve(srcPath, "meta.json"));

    var cover = {
        template: path.resolve(rootPath, 'build/assets/cover.html'),
        options: {
            title: meta.name || "Documentation",
            author:  meta.author || "Various",
            version: meta.version || "1.0.0",
            date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
        }
	};

    return buildTemplate(cover.template, cover.options, function() {
        return get_srcs(meta, srcPath)
            .pipe(md({
                preset: 'full',
                disable: ['smartquotes'],
                remarkableOptions: {
                    typographer: true,
                    quotes: '“”‘’',
                    linkify: true,
                    breaks: true,
                    html: true
                }
            }))
            .pipe(html2pdf({
                title: meta["name"] + ' Documentation',
                headerHtml: path.resolve(rootPath, './build/assets/header.html'),
                userStyleSheet: path.resolve(rootPath, './build/assets/pdf.css'),
                orientation: 'portrait',
                cover: path.resolve(rootPath, `./build/assets/cover-${meta.name}-temp.html`),
                // important - make sure these toc items are last
                toc: true,
                xslStyleSheet: path.resolve(rootPath, './build/assets/my.xsl')

            }))
            .pipe(name(meta["name"] + ' Documentation.pdf'))
            .pipe(gulp.dest(destPath))
            .on('end', taskDone);
    });
}

function buildTemplate(file, options, cb) {
	return gulp.src(file, {base: "./"})
        .pipe(handlebars(options))
        .pipe(rename(function (path) {
            var newBase = `${path.basename}-${options.title}-temp`;
            path.basename = newBase;
        }))
        .pipe(gulp.dest('.'))
        .on('end', cb);
}

function destroyTemplate() {
    // find -temp.html and delete
}

gulp.task('documentation', function(done) {
    buildDocumentationFor('../../documentation/src', '../reports/documentation', done);
});

gulp.task('all-documentation', function(done) {

    var tasks = [];

    var applications = require('../../src/meta.json').include || [];

    for (var i = 0; i < applications.length; i++) {
        var application = applications[i];
        var src = path.resolve('../../../', application, 'documentation', 'src');
        var meta = path.resolve(src, "meta.json");
        display.log('');
        try {
            fs.statSync(src).isDirectory();
            fs.statSync(meta);
            display.log(src + " OK");
        }
        catch(err) {
            display.error(src + " is NOT a directory or meta file messing");
            continue;
        }

        tasks.push(function(done) {
            return buildDocumentationFor(src, './pdf', done);
        });
    }

    async.parallel(tasks, done);
});
