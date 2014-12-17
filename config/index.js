'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator() {
    yeoman.generators.Base.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.setupEnv = function setupEnv() {
    var join = path.join;

    this.sourceRoot(join(__dirname, '../templates/common/app/config'));

    var files = ['env/development.js', 'application.js',
        'auth.js',
        'backoffice.js',
        'globals.js',
        'log.js',
        'routes.js',
        'session.js',
        'swagger.js'];

    var thiz = this;
    this._.forEach(files, function (file) {
        thiz.template(file, join('config', file));
    });
};
