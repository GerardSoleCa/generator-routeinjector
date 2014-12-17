var f = require('./functions');
var shardValues = require('../elements/regions.json');

module.exports = {
    id: "_id",
    path: "<%= apiPath %>",
    plural: "<%= apiPlural %>",
    displayField: "_id",
    extraDisplayFields: [],
    get: {},
    post: {},
    put: {},
    delete: {},
    search: {}
};