const bs = require("browser-sync").create();
const display = require('./util/display');
const cwd = 'tests/functionaltest/selenium/e2e';
const mvn = require('maven').create({cwd});

require('./build');

display.banner("E2E Selenium Tests");
display.log("Starting Browsersync");

bs.init({
    open: false,
    port: 9000,
    ui: {
        port: 9001
    },
    https: true,
    online: true,
    server: {
        baseDir: ['.'],
        middleware: (req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
        }
    }
});

function exitBs() {
    return setTimeout(() => {
        bs.exit();
        display.log('Closed browserSync')
    }, 3000);
}

let params = ['clean','test'];

let filter = "";
if (process.argv.length === 1) {
    const param = process.argv[0];
    filter = `-Dcucumber.options="--tags @${param}`;
    params = [...params, filter]
}

mvn.execute(params, {'skipTests': false}).then(() => {
    exitBs();
    display.log('done');
}).catch(err => {
    display.log(err);
    exitBs();
});
