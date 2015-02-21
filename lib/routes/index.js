module.exports = exports = function (app) {
    require('./ui')(app)
    require('./data')(app)
    require('./form')(app)
}