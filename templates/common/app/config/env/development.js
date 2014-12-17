module.exports = {
    database: {
        endpoint: 'localhost',
        name: "<%= _.slugify(appname) %>",
        debug: false
    },
    bind: {
        port: 40000
    },
    images: {
        path: __dirname + "/../image",
        cache: __dirname + "/../image/.cache"
    },
    auth: true
};