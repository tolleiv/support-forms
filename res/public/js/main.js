(function($) {

    function initializePanels() {
        $('[data-panel]').each(function() {
            $this = $(this);
            var panelName = $this.attr('data-panel');
            $this.load($('base').attr('href') + "panel/" + panelName, function() {
                if (window.location.hash !== '') {
                    activatePanel(window.location.hash.replace('#', ''));
                }
            });

            $this.click(function() {
                navigateTo(panelName);
            });

            $this.on('click', '.close', function(e) {
                e.stopPropagation();
                navigateTo("index");
            });
        });
    }

    function navigateTo(route) {
        if (route === 'index') {
            return window.location.hash = '';
        }
        return window.location.hash = route;
    }

    function activatePanel(panelName) {
        $panel = $('[data-panel=' + panelName + ']').find('.panel');
        $('.panel').removeClass('active').addClass('inactive');
        $panel.removeClass('inactive').addClass('active');
        $('.supportform .inner')
            .load($('base').attr('href') + panelName + location.search, '', function() {
                refresh_form(panelName)
            });
    }

    function resetPanels() {
        $('.panel').removeClass('active');
        $('.panel').removeClass('inactive');
        $('.supportform').removeClass('active');
        $('.supportform form .form-group').remove();
        $('.supportform form .inner').html('');
    }

    function refresh_form(panelName) {
        $("select").select2({
            placeholder: '...'
        })
        $('.supportform').addClass('active');
        $('.supportform form').attr('action', $('base').attr('href') + '' + panelName + location.search)
        $('.supportform form > .form-group').remove();
        if ($('.supportform .inner .alert-danger').length > 0) {
            // nothing
        } else if ($('.supportform .inner .input-with-feedback').length > 0) {
            $('.supportform .inner')
                .after('<div class="form-group"><input type="submit" value="Request help" class="btn btn-primary" /><input type="reset" value="Cancel" class="btn btn-link" /></div>');
        } else {
            $('.supportform .inner')
                .after('<div class="form-group"><input type="reset" value="Cancel" class="btn btn-link" /></div>');
        }
        $('.supportform form')
            .unbind('reset').unbind('submit')
            .bind('reset', function(event) {
                navigateTo('index');
                event.preventDefault();
            })
            .submit(function(event) {
                $.ajax({
                    type: "POST",
                    url: $(this).attr('action'),
                    data: $(this).serialize(),
                    dataType: 'html'
                }).always(function(obj, status) {
                    if (status == 'success') {
                        $('.supportform .inner').html(obj)
                        $('.supportform form .form-group').remove();
                    } else {
                        $('.supportform .inner').html(obj.responseText)
                        refresh_form()
                    }
                });
                event.preventDefault();
            });
    }

    $(window).bind('hashchange', function(e) {
        if (window.location.hash === '') {
            return resetPanels();
        }

        var panelName = window.location.hash.replace('#', '');
        return activatePanel(panelName);
    });

    $(document).ready(function() {
        initializePanels();
    });

}(jQuery));