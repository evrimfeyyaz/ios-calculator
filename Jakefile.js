/**
 * Created by Evrim Persembe on 8/31/16.
 */

/* global desc:true, task:true, fail:true, complete:true, jake:true */

(function () {
  "use strict";

  var semver = require("semver");
  var jshint = require("simplebuild-jshint");
  var karma  = require("simplebuild-karma");

  var KARMA_CONFIG = "karma.conf.js";

  /* General-purpose tasks */

  desc("Start the Karma server");
  task("karma", function() {
    console.log("Starting Karma server:");

    karma.start({
      configFile: KARMA_CONFIG
    }, complete, fail);
  }, { async: true });

  desc("Default build");
  task("default", [ "node_version", "lint", "test" ], function() {
    console.log("BUILD OK!");
  });

  desc("Run a local server");
  task("run", function() {
    jake.exec("node node_modules/.bin/http-server src", { interactive: true });
  }, { async: true });

  /* Supporting tasks */

  desc("Check Node version");
  task("node_version", function() {
    console.log("Checking Node version: .");

    var packageJson     = require("./package.json");
    var expectedVersion = packageJson.engines.node;
    var actualVersion   = process.version;

    if (semver.neq(expectedVersion, actualVersion)) {
      fail("Incorrect Node version: expected " + expectedVersion + ", but was " + process.version + ".");
    }
  });

  desc("Lint the JavaScript code");
  task("lint", function() {
    process.stdout.write("Linting JavaScript: ");

    // Get the JSHint options from package.json so
    // we can use the same settings in JetBrains IDEs.
    // TODO: Rename this variable to "lintOptions".
    var packageJson = require("./package.json");

    jshint.checkFiles({
      files: [ "Jakefile.js", "src/**/*.js" ],
      options: packageJson.jshintConfig,
      globals: {}
    }, complete, fail);
  }, { async: true });

  desc("Run tests");
  task("test", function() {
    console.log("Testing JavaScript:");

    karma.run({
      configFile: KARMA_CONFIG
    }, complete, fail);
  }, { async: true });
}());