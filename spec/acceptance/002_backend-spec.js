var Zombie = require('zombie');
var request = require('request');

var server = require('../helper/app.js');
describe("the form processing", function () {
    var browser = Zombie.create();
    var data, post_proc;

    beforeEach(function () {
        runs(server.startMocked(function (req, res, next) {
            req.post_proc = post_proc;
            next();
        }));
        waitsFor(server.isStarted);
    });
    afterEach(server.stop);

    it("pushes data to the processing backends", function (done) {
        data = null;

        post_proc = function (config, d, cb) {
            expect(config.fields.user).not.toBe(null);
            expect(d.title).toEqual('Hans');
            expect(d.description).toEqual('Damp');
            cb({});
        };

        open_001_dummy(function () {
            browser.fill("title", "Hans")
                .fill("description", "Damp")
                .pressButton("Request help", done.bind(this))
        });
    });

    function open_001_dummy(cb) {
        browser.visit('http://localhost:3001/?user=test').then(function () {
            browser.click('[data-panel="001_dummy"]', function () {
                cb();
            });
        });
    }

    it(" handles posts after app restart without failure", function (done) {
        post_proc = function (config, d, cb) {
            cb({})
        };
        request.post(
            {
                url: 'http://localhost:3001/001_dummy?user=name',
                method: 'POST',
                form: "user=name&title=demo+dem&description=demo+demo"
            },
            function (err) {
                expect(err).toBe(null)
                done()
            })
    })
});