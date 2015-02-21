var Zombie = require('zombie');
var fs = require('fs');
var request = require('request');

var app = require('../helper/app.js');
describe("the smart data driven forms", function () {
    var browser = Zombie.create();

    beforeEach(function () {
        runs(function () {
            fs.createReadStream(__dirname + '/../fixtures/data/colors.yml')
                .pipe(fs.createWriteStream(__dirname + '/../fixtures/tmp/colors.yml'));
        })
        runs(app.start);
        waitsFor(app.isStarted);
    });
    afterEach(app.stop);

    it("use persisted data within fields", function (done) {
        open_003_data(function () {
            expect(browser.queryAll('.supportform select option').length).toEqual(3)
            done();
        });
    });

    it("can update persisted data", function (done) {
        var stage = 0;
        runs(function () {
            request.get('http://localhost:3001/data/colors', function (err, response, body) {
                expect(err).toBe(null)
                expect(body).toContain('blue');
                expect(body).not.toContain('violett');
                stage = 1;
            });
        });
        waitsFor(function () {
            return stage == 1;
        });
        runs(function () {
            request.post(
                {
                    url: 'http://localhost:3001/data/colors',
                    method: 'POST',
                    form: { content: "{values:[red,green,blue,violett]}" }
                },
                function (err) {
                    expect(err).toBe(null)
                    stage = 2;
                })
        })
        waitsFor(function () {
            return stage == 2;
        });

        runs(function () {
            request.get('http://localhost:3001/data/colors', function (err, response, body) {
                expect(err).toBe(null)
                expect(body).toContain('violett');
                done()
            });
        });
    });

    it("use data which was changed during runtime", function (done) {
        var stage = 0;
        runs(function () {
            request.post(
                {
                    url: 'http://localhost:3001/data/colors',
                    method: 'POST',
                    form: { content: "{values:[red,green,blue,violett]}" }
                },
                function (err) {
                    expect(err).toBe(null)
                    stage = 1;
                })
        })
        waitsFor(function () {
            return stage == 1;
        });
        runs(function () {
            open_003_data(function () {
                expect(browser.queryAll('.supportform select option').length).toEqual(4)
                done();
            });
        });
    });

    function open_003_data(cb) {
        browser.visit('http://localhost:3001/?user=test').then(function () {
            browser.click('[data-panel="003_data"]', function () {
                cb();
            });
        });
    }

});