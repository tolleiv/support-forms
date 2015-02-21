var form_config = require(__base + 'lib/form_config')

module.exports = exports = function (name) {
    return function (req, res, next) {
        form_config.get(name, function (config) {
            req.form_config = config
            next();
        })
    }
}