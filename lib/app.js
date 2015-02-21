var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var path = require('path');
var dotenv = require('dotenv');
dotenv.load();

var app = express();
exports.app = app;

/* istanbul ignore next */
var env = process.env.NODE_ENV || 'development';

app.set('views', path.join(__dirname, '..', 'res', 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true;

app.locals.base_path = process.env.APP_BASEPATH || '';
app.locals.helpdesk_base_path = process.env.HELPDESK_BASEPATH || '';
app.use(favicon(path.join(__dirname, '..', 'res', 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '..', 'res', 'public')));

/* istanbul ignore if */
if (env == 'development') {
    var logger = require('bucker').createLogger({
        console: {
            color: true
        }
    }, 'it-support-forms');
    app.use(logger.middleware());
    app.use(errorhandler());
}
