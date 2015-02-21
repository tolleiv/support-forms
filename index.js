var cluster = require('cluster');
global.__base = __dirname + '/';

if (cluster.isMaster) {

    function process_datamsg(msg) {
        if (msg.type != 'data') return;
        for (var id in cluster.workers) {
            cluster.workers[id].send(msg)
        }
    }

    var cpuCount = require('os').cpus().length;
    for (var i = 0; i < cpuCount; i += 1) {
        worker = cluster.fork();
        worker.on('message', process_datamsg);
    }
    cluster.on('exit', function (worker) {
        worker = cluster.fork();
        worker.on('message', process_datamsg);
    });
} else {
    var http = require('http');
    var app = require("./lib/app").app;
    require('./lib/routes')(app);
    var server = http.createServer(app);
    server.listen(process.env.PORT || 3000);
    require('./lib/data')(app)

    process.on('message', function (msg) {
        if (msg.type == 'data') {
            app.set(msg.key, msg.value)
        }
    });
}