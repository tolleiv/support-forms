var fs = require('fs');
var yaml = require('js-yaml');

module.exports = function (app) {
    var path = process.env.DATA_PATH || __base + 'res/data/'
    app.route("/data/:name")
        .get(function (req, res) {
            res.send(app.get(req.params.name))
        })
        .post(function (req, res) {
            fs.writeFile(path + req.params.name + '.yml', req.body.content, function (err) {
                if (!err) {
                    if (process.send) {
                        process.send({ type: 'data', key: req.params.name, value: yaml.safeLoad(req.body.content) });
                    } else {
                        app.set(req.params.name, yaml.safeLoad(req.body.content))
                    }
                    res.status(200).end();
                } else {
                    console.log(err)
                    res.status(500).end();
                }
            })

        });
}

