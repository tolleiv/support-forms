var form_config = require(__base + 'lib/form_config');
var yaml = require('js-yaml');
var request = require("request");
var format = require('../form_message').html

module.exports = function (config, data, cb) {
    for (var k in data) {
        if (data.hasOwnProperty(k) && !data[k]) {
            delete data[k];
        }
    }
    var options = {
        method: 'POST',
        url: 'https://' + process.env.HELPDESK_TOKEN + '@' + process.env.HELPDESK_BASEPATH + '/api/tickets',
        form: {
            subject: subject(),
            person_email: data.user + process.env.HELPDESK_USERPOSTFIX,
            message: format(data, ['user']),
            department_id: 2,
            label: tags(),
            message_is_html: 1,
            urgency: urgency(),
            agent_team_id: 4
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode < 400) {
            cb(JSON.parse(body));
        } else {
            cb();
        }
    }

    request(options, callback);



    function subject() {
        var title;
        if (config.postprocess && config.postprocess.title) {
            title = config.postprocess.title
        } else if (data.title) {
            title = data.title
        } else {
            title = config.name
        }

        for (var k in data) {
            if (!data.hasOwnProperty(k)) continue;
            var re = new RegExp("__" + k + "__");
            title = title.replace(re, data[k])
        }
        return title;
    }

    function tags() {
        var tags=[];
        if (config.postprocess && config.postprocess.tags) {
            tags = config.postprocess.tags.split(" ")
        }
        return tags;
    }

    function urgency() {
        var urgency=1;
        if (config.postprocess && config.postprocess.urgency) {
            urgency = config.postprocess.urgency
        }
        return urgency;
    }
}
