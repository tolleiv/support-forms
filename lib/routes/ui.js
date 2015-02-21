var form_config = require(__base + 'lib/form_config')

module.exports = function (app) {
    app.route("/").get(function (req, res) {
        form_config.list(function (list) {
            res.render('index', {panels: list})
        });
    });

    app.route("/nouser").get(function (req, res) {
        res.render('nouser')
    });

    app.route("/panel/:name").get(function (req, res) {
        form_config.get(req.params.name, function (form) {
            res.render('panel', { layout: false, form: form })
        });
    });
}

