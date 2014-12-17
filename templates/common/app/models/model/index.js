var mongoose = require('mongoose');
var schema = require('./schema').getSchema();
var model = mongoose.model('<%= modelName %>', schema);
module.exports.Model = model;