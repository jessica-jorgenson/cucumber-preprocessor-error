/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineConfig } from "cypress";

const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const nodePolyfills =
  require("@esbuild-plugins/node-modules-polyfill").NodeModulesPolyfillPlugin;
const addCucumberPreprocessorPlugin =
  require("@badeball/cypress-cucumber-preprocessor").addCucumberPreprocessorPlugin;

const setupNodeEvents = async (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> => {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [nodePolyfills(), createEsbuildPlugin.default(config)],
    })
  );

  // let's increase the browser window size when running headlessly
  // this will produce higher resolution images and videos
  // https://on.cypress.io/browser-launch-api
  on("before:browser:launch", (browser, launchOptions) => {
    // the browser width and height we want to get
    // our screenshots and videos will be of that resolution
    const width = 1920;
    const height = 1080;

    if (browser.name === "chrome" && browser.isHeadless) {
      launchOptions.args.push(`--window-size=${width},${height}`);

      // force screen to be non-retina and just use our given resolution
      launchOptions.args.push("--force-device-scale-factor=1");
    }

    if (browser.name === "electron" && browser.isHeadless) {
      // might not work on CI for some reason
      launchOptions.preferences.width = width;
      launchOptions.preferences.height = height;
    }

    if (browser.name === "firefox" && browser.isHeadless) {
      launchOptions.args.push(`--width=${width}`);
      launchOptions.args.push(`--height=${height}`);
    }

    // IMPORTANT: return the updated browser launch options
    return launchOptions;
  });

  // Make sure to return the config object as it might have been modified by the plugins
  return config;
};

export default defineConfig({
  e2e: {
    specPattern: ["**/*.feature", "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}"],
    viewportHeight: 1080,
    viewportWidth: 1920,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 90000,
    experimentalStudio: true,
    numTestsKeptInMemory: 1,
    chromeWebSecurity: false,
    experimentalMemoryManagement: true,
    setupNodeEvents,
  },
  env: {
    urls: {
      main: "https://www.bing.com/",
    },
    testPassword: "Test1234",
    debugCommands: false,

    snapshotOnly: true,
    requestMode: true,
  },
  reporter: "junit",
  reporterOptions: {
    mochaFile: "cypress/results/results.xml",
    toConsole: false,
  },
  retries: {
    runMode: 1,
    openMode: 0,
  },
});
