var Zombie = require('zombie');

var app = require('../helper/app.js');
describe("the application", function () {
    var browser = Zombie.create();

    beforeEach(function () {
        runs(app.start);
        waitsFor(app.isStarted);
    });
    afterEach(app.stop);

    it('responds with content', function (done) {
        browser.visit('http://localhost:3001/').then(function () {
            browser.assert.success();
            expect(browser.html("base")).toEqual('<base href="">');
            done();
        });
    });
});