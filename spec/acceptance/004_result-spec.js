var Zombie = require('zombie');

var app = require('../helper/app.js');
describe("the result page", function () {
    var browser = Zombie.create();
    var post_proc;

    beforeEach(function () {
        post_proc=function(c,d,cb) { cb({})};
        runs(app.startMocked(function (req, res, next) {
            req.post_proc = post_proc;
            next();
        }));
        waitsFor(app.isStarted);
    });
    afterEach(app.stop);

    it('responds with DeskPro as default response', function (done) {
        open('001_dummy', function () {
            browser.fill("title", "Hansi")
                .fill("description", "Dampfer")
                .pressButton("Request help", function() {
                    expect(browser.queryAll('.alert-success').length).toEqual(1);
                    expect(browser.text('.alert:first-child')).toContain("Open within HelpDesk")
                    done()
                })
        });
    });

    it('responds with a nice error page in case sth. goes wrong', function (done) {
        post_proc=function(c,d,cb) { cb()};
        open('001_dummy', function () {
            browser.fill("title", "Hansi")
                .fill("description", "Dampfer")
                .pressButton("Request help", function() {
                    expect(browser.queryAll('.alert-danger').length).toEqual(1);
                    expect(browser.text('.alert:first-child')).toContain("friendly ghost");
                    done()
                })
        });
    });

    it('can be configured to an alternate layout', function (done) {;
        open('004_alternatedummy', function () {
            browser.fill("title", "Hansi")
                .fill("description", "Dampfer")
                .pressButton("Request help", function() {
                    expect(browser.queryAll('.alert-success').length).toEqual(1);
                    expect(browser.text('.alert:first-child')).not.toContain("Open within HelpDesk");
                    expect(browser.text('.alert:first-child')).toContain("Design team");
                    done()
                })
        });
    });

    function open(form, cb) {
        browser.visit('http://localhost:3001/?user=test').then(function () {
            browser.click('[data-panel="' + form + '"]', function () {
                cb();
            });
        });
    }

});