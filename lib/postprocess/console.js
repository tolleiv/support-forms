var format = require('../form_message').format

module.exports = function (config, data, cb) {
    console.log(format(data, ['user']))
    cb({});
}
