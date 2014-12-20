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


        this.sourceRoot(path.join(__dirname, '../templates/common/app'));
    }
    ;

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome() {
    this.log(yosay(
        'Welcome to the ' + chalk.red('Routeinjector') + ' generator! Take your time to populate as your needs!'
    ));
};

Generator.prototype.askForViews = function askForViews() {
    var cb = this.async();
    this.prompt([{
        name: 'engine',
        type: 'list',
        choices: ['jade', 'ejs'],
        message: '- Choice your preferred view engine'
    }], function (response) {
        this.viewEngine = response.engine;
        cb();
    }.bind(this));
};

Generator.prototype.copyViews = function copyViews() {
    var join = path.join;

    //this.sourceRoot(join(__dirname, '../templates/common/app/views'));

    var files = ['error',
        'index',
        'layout'
    ];

    var thiz = this;
    this._.forEach(files, function (file) {
        file = file + '.' + thiz.viewEngine;
        thiz.template('views/' + file, join('views', file));
    });
};


Generator.prototype.copybin = function copybin() {
    var binary = 'bin/www';
    this.template(binary, binary);
};

Generator.prototype.packageFiles = function packageFiles() {
    this.template('_package.json', 'package.json');
};