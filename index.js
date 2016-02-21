var fs      = require('fs'),
    path    = require('path');

var newrelicFile = path.join(process.cwd(), 'newrelic.js');

if (fs.existsSync(newrelicFile)) {

    var newrelicInfo = require(newrelicFile);
    console.log('Using newrelic: ' + JSON.stringify(newrelicInfo));

    var nr = require('newrelic');

    var config;

    return module.exports = {

        init: function(_config) {
            config = _config;
        },
        recordMetric: function(ns, val) {
            nr.recordMetric(ns, val);
        },
        noticeError: function(err) {
            nr.noticeError(err);
        },
        endTransaction: function() {
            nr.endTransaction();
        },
        createWebTransaction: function(url, handle) {
            return nr.createWebTransaction(url, handle);
        },
        addCustomParameter: function(name, value){
            nr.addCustomParameter(name, value);
        }
    };
} else {
    console.log('No newrelic config found here: ' + newrelicFile);

}

module.exports = {
    init: function() {},
    recordMetric: function() {},
    noticeError: function() {},
    endTransaction: function() {},
    createWebTransaction: function(url, handle) {
        return handle;
    },
    addCustomParameter: function(name, value) {}
};


