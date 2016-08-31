/**
 * Created by Evrim Persembe on 8/31/16.
 */

(function () {
  "use strict";

  var semver = require("semver");

  desc("Default build");
  task("default", [ "node_version" ], function() {
    console.log("BUILD OK!");
  });

  desc("Check Node version");
  task("node_version", function() {
    var packageJson     = require("./package.json");
    var expectedVersion = packageJson.engines.node;
    var actualVersion   = process.version;

    if (semver.neq(expectedVersion, actualVersion)) {
      fail("Incorrect Node version: expected " + expectedVersion + ", but was " + process.version + ".");
    }
  });
}());