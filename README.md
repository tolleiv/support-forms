Usage
=====

Run `npm start` or `npm test` so either run the application or the
tests.

If you run the application - make sure that you either just use the
"console" backend for the forms or that you're able to connect to
DeskPro (e.g. be in the AOEHQ network).

Development
===========

In order to work with a reduced formset you can use the fixture forms
from the tests with:

`FORM_PATH=spec/fixtures/forms/ node index.js`

You can then open up the browser e.g. with http://localhost:3000/?user=tolleiv
to see the forms.


