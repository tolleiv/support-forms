var fs = require('fs');
var yaml = require('js-yaml');

module.exports = exports = function (app) {
    var path = process.env.DATA_PATH || __base + 'res/data/'
    fs.readdir(path, function (err, files) {
        for (var i in files) {
            var f = files[i];
            if (f.search(/.yml$/) == -1) {
                continue;
            }
            importData(f)
        }
    });

    function importData(f) {
        fs.readFile(path + f, function (err, data) {
            if (err) {
                throw err;
            }
            app.set(f.replace(/.yml$/, ''), yaml.safeLoad(data))
        });
    }
}
