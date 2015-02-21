module.exports = exports = function (req, res, next) {
    if (!req.query.user) {
        res.redirect('/nouser');
    } else {
        next();
    }
}