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
            choices: ['String', 'Number', '[String]', '[Number]', 'Date']
        }], function (response) {
            if (response.name && response.type) {
                //this.elements.push({
                //    name: response.name,
                //    type: response.type
                //});
                this.elements[response.name] = response.type;
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