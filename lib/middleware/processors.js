module.exports = exports = function (req, res, next) {
    if (req.form_config && !req.post_proc) {
        var base_path = __base + 'lib/postprocess/';
        req.post_proc = require(base_path + (req.form_config.processor || 'helpdesk'))
    }
    next();
}