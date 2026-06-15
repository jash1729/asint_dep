import * as dotenv from 'dotenv'
import allureReporter from '@wdio/allure-reporter';
import * as fs from 'fs';
import * as path from 'path';
import { loginToSAP } from './utils/login.helper';
import utils from './utils/utils';

if (!process.env.CI) {
  dotenv.config();
}
const downloadDir = path.resolve(process.cwd(), 'downloads');
const isHeadless = process.env.CI === 'true' || process.argv.includes('--headless');

export const config: WebdriverIO.Config = {
    runner: 'local',
    tsConfigPath: './tsconfig.json',
    specs: [
        // './functional_location/functional_location.e2e.ts',
        // './equipment/equipment.e2e.ts',
        './configuration/**/*.e2e.ts',
        './planning/task_management/task_management.e2e.ts',
        './reliability/asset_risk_and_criticality_analysis/asset_risk_and_criticality_analysis.e2e.ts',
        './reliability/asset_risk_and_criticality_template/asset_risk_and_criticality_template.e2e.ts',
        './reliability/asset_rcm_analysis/*.e2e.ts',
        './reliability/asset_strategy_analysis_for_classes/*.e2e.ts',
        './integrity/asset_strategy_development/*.e2e.ts',
        './integrity/inspection_templates/inspection_template.e2e.ts',
        './documents/documents.e2e.ts',
        './integrity_configuration/cml_template/*.e2e.ts',
        './integrity/asset_cloning_suite/asset_cloning_suite.e2e.ts',
        './reliability/root_cause_analysis/*.e2e.ts',
        './planning/maintenance_spend_planning/*e2e.ts',
        './planning/recommendation_workbench/*e2e.ts',
        './planning/notifications/notifications.e2e.ts',
        './planning/maintenance_orders/maintenance_orders.e2e.ts',
        // './integrity/cmls/cmls.e2e.ts',
        // './safety_group/safety.e2e.ts',
    ],
    exclude: [],
    maxInstances: 1,

    capabilities: [
        {
            browserName: 'chrome',
            'goog:chromeOptions': {
            prefs: {
            'download.default_directory': downloadDir,
            'download.prompt_for_download': false,
            'download.directory_upgrade': true,
            'plugins.always_open_pdf_externally': true
            },
            args: isHeadless ? ['--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1920,1080'] : []
        }
        }
    ],
    logLevel: 'info',
    logLevels: {
        webdriver: 'silent',
        '@wdio/mocha-framework': 'info'
    },
    bail: 0, 
    waitforTimeout: 60000, 
    connectionRetryTimeout: 600000,
    connectionRetryCount: 3,

    services: [],
    automationProtocol: 'webdriver',
    framework: 'mocha',
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            useCucumberStepReporter: false,
            disableWebdriverStepsReporting: true,
            addExecutorInfo: true,
        }]
    ],
    mochaOpts: {
        ui: 'bdd',
        timeout: 900000,
        reporter: 'spec'
    },
    onPrepare: function (config, capabilities) {
        const allureResultsDir = './allure-results';
        if (fs.existsSync(allureResultsDir)) {
            fs.rmSync(allureResultsDir, { recursive: true, force: true });
            console.log('✓ Cleaned old allure-results');
        }
        const allureReportDir = './allure-report';
        if (fs.existsSync(allureReportDir)) {
            fs.rmSync(allureReportDir, { recursive: true, force: true });
            console.log('✓ Cleaned old allure-report');
        }
    },

    before: async function (capabilities) {
        const browserName = (capabilities as any).browserName || 'unknown';
        allureReporter.addFeature(`Browser: ${browserName}`);
        if (!isHeadless) {
        await browser.maximizeWindow();
    };
    },

    beforeSuite: async function (suite) {
        console.log(`Starting suite: ${suite.title}`);
        await utils.createDownloadDir();
        await utils.cleanDownloads();
        await loginToSAP();
        const browserName = (browser.capabilities as any).browserName || 'unknown';
        suite.title = `[${browserName}] ${suite.title}`;
        allureReporter.addEpic(browserName);
    },

    beforeTest: function (test) {
        const browserName = (browser.capabilities as any).browserName || 'unknown';
        allureReporter.addLabel('browser', browserName);
        allureReporter.addLabel('tag', browserName);
        allureReporter.addStory(`Browser: ${browserName}`);
    },

    afterTest: async function (test, context, { passed }) {
        if (!passed) {
            const screenshot = await browser.takeScreenshot();
            allureReporter.addAttachment(
                'Failure Screenshot',
                Buffer.from(screenshot, 'base64'),
                'image/png'
            );
        }
    },
}
