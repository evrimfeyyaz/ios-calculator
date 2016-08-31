/**
 * Created by Evrim Persembe on 8/31/16.
 */

/* global desc:true, task:true, fail:true, complete:true */

(function () {
  "use strict";

  var semver = require("semver");
  var jshint = require("simplebuild-jshint");

  desc("Default build");
  task("default", [ "node_version", "lint" ], function() {
    console.log("BUILD OK!");
  });

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
      files: "Jakefile.js",
      options: packageJson.jshintConfig,
      globals: {}
    }, complete, fail);
  }, { async: true });
}());