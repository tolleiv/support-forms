var http = require('http');
var path = require('path');

var server, started = false, middleware = false, env = 'test';

var startServer = function () {
    global.__base = path.join(__dirname, '..', '..') + '/';
    process.env.FORM_PATH = path.join(__dirname, '..', 'fixtures', 'forms') + '/';
    process.env.DATA_PATH = path.join(__dirname, '..', 'fixtures', 'tmp') + '/';
    process.env.NODE_ENV = env;
    var app = require(path.join(__dirname, '..', '..', 'lib', 'app')).app;
    app.use(function(req, res, next) {
        middleware ? middleware.call(this,req, res, next) : next();
    });
    require(path.join(__dirname, '..', '..', 'lib', 'routes'))(app);
    app.set('env', env);
    require(path.join(__dirname, '..', '..', 'lib', 'data'))(app);
    server = http.createServer(app);
    server.listen(3001)
        .on('listening', function () {
            setTimeout(function () {
                started = true;
            }, 100)
        })
        .on('close', function () {
            started = false;
        });
};

exports.start = startServer;

exports.startMocked = function(fn) {
    middleware = fn;
    return startServer;
};

exports.isStarted = function () {
    return started;
};

exports.stop = function (cb) {
    server.close(cb);
};
