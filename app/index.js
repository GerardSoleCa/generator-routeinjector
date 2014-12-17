'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var wiredep = require('wiredep');
var chalk = require('chalk');

var Generator = module.exports = function Generator(args, options) {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('appname', {type: String, required: false});
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

    args = ['main'];

    if (typeof this.env.options.appPath === 'undefined') {
        this.option('appPath', {
            desc: 'Allow to choose where to write the files'
        });

        this.env.options.appPath = this.options.appPath;

        if (!this.env.options.appPath) {
            try {
                this.env.options.appPath = process.cwd();
            } catch (e) {

            }
        }
    }

    this.appPath = this.env.options.appPath;

    this.hookFor('routeinjector:config', {
        args: args
    });

    this.hookFor('routeinjector:model', {
        args: args
    });

    this.sourceRoot(path.join(__dirname, '../templates/common'));
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome() {
    this.log(yosay(
        'Welcome to the '+ chalk.red('Routeinjector') + ' generator! Take your time to populate as your needs!'
    ));
};

Generator.prototype.copybin = function copybin() {
    var binary = 'bin/www';
    this.copy(
        path.join('app', binary),
        path.join(this.appPath, binary)
    );
};

Generator.prototype.packageFiles = function packageFiles() {
    this.template('app/_package.json', 'package.json');
};