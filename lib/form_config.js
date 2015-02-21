var fs = require('fs');
var yaml = require('js-yaml');
var base_path = process.env.FORM_PATH || __base + 'res/forms/';

exports.list = function (cb) {
    fs.readdir(base_path, function (err, files) {
        var forms = []
        for (var i in files) {
            var f = files[i];
            if (f.search(/.yml$/) == -1) {
                continue;
            }
            forms.push(f.replace(/.yml$/, ''))
        }
        cb(forms)
    });
}

exports.get = function (name, cb) {
    fs.readFile(base_path + name + '.yml', function (err, data) {
        if (err) {
            throw err;
        }
        cb(yaml.safeLoad(data))
    });
}

