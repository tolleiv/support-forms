var yaml = require('js-yaml');

function wordwrap(str, int_width, cut, indent, str_break, spc) {
    var m = ((arguments.length >= 2) ? arguments[1] : 75);
    var c = ((arguments.length >= 4) ? arguments[2] : false);
    var d = ((arguments.length >= 4) ? arguments[3] : 0);
    var b = ((arguments.length >= 5) ? arguments[4] : '\n' + Array(d).join(' '));
    var e = ((arguments.length >= 6) ? arguments[5] : ' ');

    var i, j, l, s, r;
    str += '';
    if (m < 1) {
        return str;
    }

    for (i = -1, l = (r = str.split(/\r\n|\n|\r/))
        .length; ++i < l; r[i] += s) {
        for (s = r[i], r[i] = ''; s.length > m; r[i] += s.slice(0, j) + ((s = s.slice(j))
            .length ? b : '')) {
            j = c == 2 || (j = s.slice(0, m + 1)
                .match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length || c == 1 && m || j.input.length + (j = s.slice(
                m)
                .match(/^\S*/))[0].length;
        }
    }
    return Array(d).join(e) + r.join(b) + b;
}

exports.format = function format(data, blacklist) {
    var keys = Object.keys(data)
    var exclude = blacklist || []
    var message = '';

    for (index = 0, length = keys.length; index < length; index += 1) {
        tag = keys[index];
        if (exclude.indexOf(tag) != -1) {
            continue;
        }

        message = message + tag.charAt(0).toUpperCase() + tag.substr(1) + ':\n';
        message += wordwrap(data[tag], 75, false, 5)
        message += '\n'
    }
    return message;
};
exports.html = function (data, blacklist) {
    var keys = Object.keys(data)
    var exclude = blacklist || []
    var message = '';

    for (index = 0, length = keys.length; index < length; index += 1) {
        tag = keys[index];
        if (exclude.indexOf(tag) != -1) {
            continue;
        }

        message = message + '<h3>' + tag.charAt(0).toUpperCase() + tag.substr(1) + ':</h3><br/>'
        message += wordwrap(data[tag], 75, false, 5, '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;', '&nbsp;')
        message += '<br/>'
    }
    return message;
};
