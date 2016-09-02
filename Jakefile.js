/**
 * Created by Evrim Persembe on 8/31/16.
 */

/* global desc:true, task:true, fail:true, complete:true, jake:true, directory:true */

(function () {
  "use strict";

  var semver = require("semver");
  var jshint = require("simplebuild-jshint");
  var karma  = require("simplebuild-karma");
  var shell  = require("shelljs");

  var KARMA_CONFIG  = "karma.conf.js";
  var GENERATED_DIR = "generated";
  var DIST_DIR      = GENERATED_DIR + "/dist";

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
  task("run", [ "build" ], function() {
    jake.exec("node node_modules/.bin/http-server " + DIST_DIR, { interactive: true });
  }, { async: true });

  desc("Erase all generated files");
  task("clean", function() {
    console.log("Erasing generated files: .");

    shell.rm("-rf", GENERATED_DIR);
  });

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
    var lintOptions = require("./package.json").jshintConfig;
    var lintGlobals = lintOptions.globals;

    jshint.checkFiles({
      files: [ "Jakefile.js", "src/**/*.js" ],
      options: lintOptions,
      globals: lintGlobals
    }, complete, fail);
  }, { async: true });

  desc("Run tests");
  task("test", function() {
    console.log("Testing JavaScript:");

    karma.run({
      configFile: KARMA_CONFIG,
      expectedBrowsers: [
        "Chrome 52.0.2743 (Mac OS X 10.11.6)",
        "IE 9.0.0 (Windows 7 0.0.0)",
        "Safari 9.1.3 (Mac OS X 10.11.6)",
        "Firefox 48.0.0 (Mac OS X 10.11.0)",
        "Mobile Safari 9.0.0 (iOS 9.3.0)"
      ],
      strict: !process.env.loose
    }, complete, fail);
  }, { async: true });

  desc("Build distribution directory");
  task("build", [ DIST_DIR ], function() {
    console.log("Building distribution directory: .");

    shell.rm("-rf", DIST_DIR + "/*");
    shell.cp("src/content/*", DIST_DIR);

    jake.exec("node node_modules/.bin/browserify src/javascript/app.js -o " + DIST_DIR + "/bundle.js",
      { interactive: true },
      complete);
  }, { async: true });

  directory(DIST_DIR);
}());