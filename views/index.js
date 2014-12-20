'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator() {
    yeoman.generators.Base.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askForRenderEngine = function askForRenderEngine() {
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

    this.sourceRoot(join(__dirname, '../templates/common/app/views'));

    var files = ['error',
        'index',
        'layout'
    ];

    var thiz = this;
    this._.forEach(files, function (file) {
        file = file + '.' + thiz.viewEngine;
        thiz.template(file, join('views', file));
    });
};
