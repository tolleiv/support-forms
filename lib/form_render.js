var extend = require('util')._extend

var widget_options = {
    checkbox: {classes: ['widget']},
    label: {classes: ['widget']},
    hidden: {},
    textarea: {rows: 10, classes: ['input-with-feedback', 'form-control', 'widget']},
    multipleSelect: {size: 10, classes: ['input-with-feedback', 'form-control', 'widget']},
    'default': {classes: ['input-with-feedback', 'form-control', 'widget']}
};

function map_widget(widgets, definition) {
    var widget;

    var options = extend({}, widget_options[definition.type] || widget_options['default'])
    options = extend(options, definition)

    if (definition.type == 'label') {
        widget = widgets.label({content: definition.content, classes: ['widget']})
    } else if (typeof widgets[definition.type] == 'function') {
        widget = widgets[definition.type].call(this, options)
    } else {
        widget = widgets.text(options)
    }
    return widget;
}

function smart_choices(app, name) {
    values = app.get(name).values
    // We don't want to deal with numerical values
    if (Object.prototype.toString.call(values) === '[object Array]') {
        var new_values = {}
        for (var i in values) {
            new_values[values[i]] = values[i]
        }
        values = new_values;
    }
    return values
}

function build_form(app, definition, values) {
    var forms = require('forms');
    var fields = forms.fields;
    var widgets = forms.widgets;
    var validators = forms.validators;

    var my_fields = {}
    for (var field in definition.fields) {

        def = definition.fields[field]
        my_fields[field] = fields.string({
            required: def.required,
            label: def.label,
            value: values[field] || null,
            choices: def.choices || (def.smart_choices ? smart_choices(app, def.smart_choices) : null),
            widget: map_widget(widgets, def),
            errorAfterField: true,
            cssClasses: {
                label: ['control-label']
            }
        })
    }
    return forms.create(my_fields);
};

function bootstrap_field(name, object) {
    var label = object.labelHTML(name);
    if (label) {
        label = label + (object.required ? '* ' : ' ')
    }
    var error = object.error ? '<span class="glyphicon glyphicon-remove form-control-feedback"></span>' : '';
    var rendered;
    object.widget.classes = object.widget.classes || [];
    if (object.widget.classes.indexOf('widget') >= 0) {
        var widget = object.widget.toHTML(name, object);
        rendered = '<div class="form-group ' + (object.error ? 'has-error has-feedback' : '') + '">' + label + widget + error + '</div>';
    } else {
        rendered = object.widget.toHTML(name, object);
    }
    return rendered;
};

exports.build_form = build_form
exports.bootstrap_field = bootstrap_field

