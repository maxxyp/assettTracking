module.exports = function(config) {
    config.set({

        basePath: '',

        htmlReporter: {
            outputDir: '../reports/', // where to put the reports
            templatePath: null, // set if you moved jasmine_template.html
            focusOnFailures: true, // reports show failures on start
            namedFiles: false, // name files instead of creating sub-directories
            pageTitle: null, // page title for reports; browser info by default
            urlFriendlyName: false, // simply replaces spaces with _ for files/dirs
            reportName: 'unit', // report summary filename; browser info by default

            // experimental
            preserveDescribeNesting: false, // folded suites stay folded
            foldAll: false // reports start folded (only with preserveDescribeNesting)
        },

        trxReporter: {
            outputFile: '../reports/unit/unit-test-report.trx',
            shortTestName: true
        },

        preprocessors: {
            'tests/unit/**/*.js': ["sourcemap"],
            'app/**/*.js': ["sourcemap", 'coverage']
        },

        coverageReporter: {
            dir: '../reports/coverage/',
            reporters: [
                {
                    type: 'text-summary',
                    subdir: '.'
                },
                {
                    type: 'json',
                    subdir: '.'
                },
                {
                    type: 'cobertura',
                    file: 'coverage-test-report.xml',
                    subdir: '.'
                }
            ]
        },

        port: 9876 + Math.floor((Math.random() * 100) + 1),

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: false,

        captureTimeout: 60000,

        browserDisconnectTimeout : 10000,
        browserDisconnectTolerance : 1,
        browserNoActivityTimeout : 60000
    });
};
