var fs      = require('fs'),
    path    = require('path');

var newrelicFile = path.join(process.cwd(), 'newrelic.js');

if (fs.existsSync(newrelicFile) && !process.env.NO_EXT_MONITOR) {

    var newrelicInfo = require(newrelicFile);
    console.log('Using newrelic: ' + JSON.stringify(newrelicInfo));

    //reference newrelic lib/instrumentation/core/blobals
    //new relic defines a handler on _fatalException which causes that whenever a domain throws an error it first goes through their handler
    //in their handler they are reporting the error. this is bad because if we catch the error in the domain error handler and report it, we will get 2 reports to new relic
    var fatalException = process._fatalException;
    process._fatalException = undefined;
    var nr = require('newrelic');
    process._fatalException = fatalException;

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
        createBackgroundTransaction: function(name, group, handle) {
            return nr.createBackgroundTransaction(name, group, handle);
        },
        createTracer: function(name, handle){
            return nr.createTracer(name, handle);
        },
        addCustomParameter: function(name, value){
            nr.addCustomParameter(name, value);
        },
        recordCustomEvent: function(name, value){
            nr.recordCustomEvent(name, value);
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
    createBackgroundTransaction: function(name, group, handle) {
        return handle;
    },
    createTracer: function(name, handle) {
        return handle;
    },
    addCustomParameter: function(name, value) {},
    recordCustomEvent: function(name, value) {}
};


