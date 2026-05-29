exports.config = {

    runner: 'local',

    specs: [
        './test/specs/**/*.js'
    ],

    maxInstances: 1,

    capabilities: [{
        browserName: 'chrome'
    }],

    logLevel: 'info',

    framework: 'mocha',

    reporters: ['spec'],

    services: ['chromedriver'],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }

};