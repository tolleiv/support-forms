var form_config = require(__base + 'lib/form_config')
var build_form = require(__base + 'lib/form_render').build_form
var bootstrap_field = require(__base + 'lib/form_render').bootstrap_field
var auth = require(__base + 'lib/middleware/auth');
var load_form = require(__base + 'lib/middleware/load_form');
var processors = require(__base + 'lib/middleware/processors');

function form_route(app, name) {
    var form;
    app.use("/" + name, auth)
    app.use("/" + name, load_form(name))
    app.use("/" + name, processors)
    app.route("/" + name)
        .all(function (req, res, next) {
            form = build_form(app, req.form_config, req.query);
            next();
        })
        .get(function (req, res) {
            // res.set('Access-Control-Allow-Origin', 'https://example.org')
            res.send(form.toHTML(bootstrap_field));
        })
        .post(function (req, res, next) {
            form.handle(req, {
                success: function (form) {
                    req.form_data = form.data
                    next();
                },
                error: function (form) {
                    res.status(400).send(form.toHTML(bootstrap_field))
                }
            })
        },
        function (req, res, next) {
            req.post_proc(req.form_config, req.form_data, function (data) {
                if (typeof data != 'undefined') {
                    var template = 'default';
                    if (req.form_config.confirmation && req.form_config.confirmation.layout) {
                        template = req.form_config.confirmation.layout
                    }
                    res.render('confirmation/' + template,
                        {layout: false, data: data})
                } else {
                    res.render('confirmation/error', {layout: false})
                }
            })
        }
    );
}

module.exports = function (app) {
    form_config.list(function (files) {
        for (var i in files) {
            form_route(app, files[i])
        }
    });
}

