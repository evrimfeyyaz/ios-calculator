/**
 * Created by Evrim Persembe on 8/31/16.
 */

/* global desc:true, task:true, fail:true, complete:true, jake:true */

(function () {
  "use strict";

  var semver = require("semver");
  var jshint = require("simplebuild-jshint");

  /* General-purpose tasks */

  desc("Default build");
  task("default", [ "node_version", "lint" ], function() {
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
    var packageJson = require("./package.json");

    jshint.checkFiles({
      files: [ "Jakefile.js", "src/**/*.js" ],
      options: packageJson.jshintConfig,
      globals: {}
    }, complete, fail);
  }, { async: true });
}());