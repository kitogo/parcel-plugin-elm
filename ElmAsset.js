const elmCompiler = require('node-elm-compiler');
const findAllDependencies = require("find-elm-dependencies").findAllDependencies;
const fs = require('fs');
const path = require('path');
const process = require('process');
const Asset = require('parcel-bundler/src/Asset');

class ElmAsset extends Asset {

  constructor(name, options) {
    super(name, options);
    this.type = 'js';
  }

  getParserOptions() {
    const defaultOptions = {
      cwd: process.cwd(),
    };
    return defaultOptions;
  }
  
  async getDependencies() {
    let deps = await findAllDependencies(this.name);
    deps.forEach(dep => {
      this.addDependency(dep, { includedInParent: true });
    });
  }

  async generate() {
    const options = this.getParserOptions();
    const data = await elmCompiler.compileToString(this.name, options);

    return [
      {
        type: 'js',
        value: data.toString()
      }
    ];
  }
}

module.exports = ElmAsset;

