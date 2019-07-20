#!/usr/bin/env node

const HotLoader = require("./hotloader").HotLoader;

const args = process.argv;
let loader;

if (args.length > 2) {
  loader = new HotLoader(args, "js", "node");
  loader.run();
}
