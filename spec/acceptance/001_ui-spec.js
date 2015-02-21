var Zombie = require('zombie');

var app = require('../helper/app.js');
describe("the index page", function () {
    var browser = Zombie.create();

    beforeEach(function () {
        runs(app.start);
        waitsFor(app.isStarted);
    });
    afterEach(app.stop);

    it('responds with content', function (done) {
        browser.visit('http://localhost:3001/').then(function () {
            browser.assert.success();
            expect(browser.text('title')).toEqual('IT Support forms');
            done();
        });
    });

    it('loads the panels', function (done) {
        browser.visit('http://localhost:3001/').then(function () {
            expect(browser.query('[data-panel="001_dummy"]')).not.toBe(null);
            expect(browser.query('[data-panel="000_problem"]')).toBe(null);
            done();
        });
    });

    it('has no initial form loaded', function (done) {
        browser.visit('http://localhost:3001/').then(function () {
            expect(browser.query('.supportform .inner div')).toBe(null);
            done();
        });
    });

    it('loads the form on demand', function (done) {
        browser.visit('http://localhost:3001/?user=test').then(function () {
            expect(browser.query('.supportform .inner div')).toBe(null);
            browser.click('[data-panel="001_dummy"]', function () {
                expect(browser.query('.supportform .inner div')).not.toBe(null);
                expect(browser.query('.supportform input[type="submit"]')).not.toBe(null);
                expect(browser.query('.supportform input[type="reset"]')).not.toBe(null);
                expect(browser.query('.supportform .inner input[name="title"]')).not.toBe(null);
                expect(browser.query('.supportform .inner textarea[name="description"]')).not.toBe(null);
                done();
            });
        });
    });

    it('fails to load the form if no username is given', function (done) {
        browser.visit('http://localhost:3001/').then(function () {
            expect(browser.query('.supportform .inner div')).toBe(null);
            browser.click('[data-panel="001_dummy"]', function () {
                expect(browser.query('.supportform .inner div.alert-danger')).not.toBe(null);
                expect(browser.query('.supportform input[type="submit"]')).toBe(null);
                expect(browser.query('.supportform .inner input[name="title"]')).toBe(null);
                done();
            });
        });
    });

    it('should navigate back using the browser back button', function (done) {
        browser.visit('http://localhost:3001/?user=test')
            .then(function () {
                return browser.click('[data-panel="001_dummy"]');
            }).then(function () {
                expect(browser.location.href).toContain('#001_dummy');
                expect(browser.query('[data-panel="001_dummy"] .panel.active')).toBeDefined();
                expect(browser.query('.supportform.active')).toBeDefined()
            }).then(function() {
                return browser.back();
            }).then(function() {
                expect(browser.location.href).not.toContain('#001_dummy');
                expect(browser.query('[data-panel="001_dummy"] .panel.active')).toBe(null);
                expect(browser.query('.supportform.active')).toBe(null);
            }).then(done);
    });

    it('should navigate back using the panel close button', function (done) {
        browser.visit('http://localhost:3001/?user=test')
            .then(function () {
                return browser.click('[data-panel="001_dummy"]');
            }).then(function () {
                expect(browser.location.href).toContain('#001_dummy');
                expect(browser.query('[data-panel="001_dummy"] .panel.active')).toBeDefined();
                expect(browser.query('.supportform.active')).not.toBe(null);
            }).then(function() {
                return browser.click('[data-panel="001_dummy"] .close');
            }).then(function() {
                expect(browser.location.href).not.toContain('#001_dummy');
                expect(browser.query('[data-panel="001_dummy"] .panel.active')).toBe(null);
                expect(browser.query('.supportform.active')).toBe(null);
            }).then(done);
    });

    it('should navigate directly to panel when a deeplink is provided', function (done) {
        browser.visit('http://localhost:3001/?user=test#001_dummy')
            .then(function () {
                expect(browser.query('[data-panel="001_dummy"] .panel.active')).toBeDefined();
                expect(browser.query('.supportform.active')).toBeDefined();
            }).then(done);
    });
});