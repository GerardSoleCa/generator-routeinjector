'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var stringifyObject = require('stringify-object');

String.prototype.capitalize = function () {
    var s = this.toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
};

var Generator = module.exports = function Generator() {
    yeoman.generators.Base.apply(this, arguments);
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askForModelName = function askForModelName() {
    var cb = this.async();

    this.prompt([{
        type: 'input',
        name: 'modelName',
        message: 'Write your model name (ex: User)'
    }, {
        type: 'input',
        name: 'apiPath',
        message: function (props) {
            return '- Endpoint path'
        },
        default: function (props) {
            return props.modelName.toLowerCase();
        }
    }, {
        type: 'input',
        name: 'apiPlural',
        message: function (props) {
            return '- Endpoint plural'
        },
        default: function (props) {
            return props.apiPath.toLowerCase() + 's';
        }
    }], function (props) {
        this.modelName = props.modelName.capitalize();
        this.apiPath = props.apiPath.toLowerCase();
        this.apiPlural = props.apiPlural.toLowerCase();
        cb();
    }.bind(this));
};

Generator.prototype.writeModel = function writeModel() {
    var join = path.join;

    this.sourceRoot(join(__dirname, '../templates/common/app/models/model'));

    var files = ['index.js', 'injector.js'];

    var thiz = this;
    this._.forEach(files, function (file) {
        thiz.template(file, join('models', thiz.modelName.toLowerCase(), file));
    });
};

Generator.prototype.askForSchema = function askForSchema() {
    var cb = this.async();
    this.elements = {};
    var thiz = this;

    var prompt = function () {
        this.prompt([{
            name: 'addNew',
            type: 'confirm',
            message: '- Add an element to the Schema?'
        }, {
            when: function (response) {
                return response.addNew;
            },
            type: 'input',
            name: 'name',
            message: '- Element name'
        }, {
            when: function (response) {
                return (response.addNew && response.name != "" );
            },
            type: 'list',
            name: 'type',
            message: '- Select element type',
            choices: function () {
                var types = ['String', 'Number', 'Date', 'Mixed','Reference', 'String array', 'Number array', 'Date array', 'Reference array'];
                return types;
            }
        }, {
            when: function (response) {
                var types = ['Embedded array', 'Reference', 'Reference array'];
                return thiz._.contains(types, response.type);
            },
            type: 'input',
            name: 'model',
            message: '- Write the model to which this element points'
        }], function (response) {
            if (response.name && response.type) {
                switch (response.type) {
                    case 'String':
                    case 'Number':
                    case 'Date':
                        this.elements[response.name] = response.type;
                        break;
                    case 'Mixed':
                        this.elements[response.name] = {type: {}};
                        break;
                    case 'Reference':
                        this.elements[response.name] = {type: 'ObjectId', ref: response.model};
                        break;
                    case 'String array':
                        this.elements[response.name] = [String];
                        break;
                    case 'Number array':
                        this.elements[response.name] = [Number];
                        break;
                    case 'Date array':
                        this.elements[response.name] = [Date];
                        break;
                    case 'Embedded array':
                        this.elements[response.name] = [response.model];
                        break;
                    case 'Reference array':
                        this.elements[response.name] = [{type: 'ObjectId', ref: response.model}];
                        break;
                }
            }
            if (!response.addNew) {
                cb();
            } else {
                prompt();
            }
        }.bind(this));
    }.bind(this);
    prompt();
};

Generator.prototype.writeSchema = function writeSchema() {
    var join = path.join;

    this.sourceRoot(join(__dirname, '../templates/common/app/models/model'));

    var files = ['schema.js'];

    this.elements = stringifyObject(this.elements, {
        singleQuotes: true
    });

    var thiz = this;
    this._.forEach(files, function (file) {
        thiz.template(file, join('models', thiz.modelName.toLowerCase(), file));
    });
};