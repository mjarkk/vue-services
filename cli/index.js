#! /usr/bin/env node

const install = require('./install');
const make = require('./controller');

const path = require('path');
const fs = require('fs');

const command = process.argv[2];
const argument = process.argv[3];
const parameter = process.argv[4];

switch (command) {
    case 'install':
        install.createControllerIndexFile();
        install.createMainFile();
        install.createAppFile();
        install.createStaticDataFile();
        install.createAuthFiles();
        console.log('Installed succesfully');
        break;
    case 'make:controller':
        make.controller(argument, parameter);
        break;
    case 'update:controllerindex':
        make.updateControllerIndex();
        break;
    default:
        console.log(fs.readFileSync(path.join(__dirname, '..', 'README.md')).toString());
        break;
}
