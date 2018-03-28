// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by alerts-individual-module.js.
import { name as packageName } from "meteor/alerts-individual-module";

// Write your tests here!
// Here is an example.
Tinytest.add('alerts-individual-module - example', function (test) {
  test.equal(packageName, "alerts-individual-module");
});
