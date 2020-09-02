var fs      = require('fs'),
    path    = require('path');

var newrelicFile = path.join(process.cwd(), 'newrelic.js');

if (process.env.LIGHTSTEP_ACCESS_TOKEN) {
    var newrelicInfo = require(newrelicFile);

    const { lightstep } = require("lightstep-opentelemetry-launcher-node");

    const serviceName = newrelicInfo.config.app_name[0].split('[')[0];
    console.log(`Using lightstep: ${serviceName}`);

    const sdk = lightstep.configureOpenTelemetry({
        accessToken: process.env.LIGHTSTEP_ACCESS_TOKEN,
        serviceName: serviceName,
    });

    sdk.start();

    return module.exports = {
        init: function() {},
        recordMetric: function() {},
        noticeError: function() {},
        endTransaction: function() {},
        createWebTransaction: function(url, handle) {
            return handle();
        },
        createBackgroundTransaction: function(name, group, handle) {
            return handle();
        },
        addCustomParameter: function(name, value) {},
        recordCustomEvent: function(name, value) {}
    };

} else if (fs.existsSync(newrelicFile) && !process.env.NO_EXT_MONITOR) {

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
        noticeError: function(err, customParameters) {
            nr.noticeError(err, customParameters);
        },
        endTransaction: function() {
            nr.endTransaction();
        },
        createWebTransaction: function(url, handle) {
            return nr.startWebTransaction(url, handle);
        },
        createBackgroundTransaction: function(name, group, handle) {
            return nr.startBackgroundTransaction(name, group, handle);
        },
        addCustomParameter: function(name, value){
            nr.addCustomAttribute(name, value);
        },
        recordCustomEvent: function(name, value){
            nr.recordCustomEvent(name, value);
        }
    };
} else if (!process.env.NO_EXT_MONITOR) {
    console.log('No newrelic config found here: ' + newrelicFile);

}

module.exports = {
    init: function() {},
    recordMetric: function() {},
    noticeError: function() {},
    endTransaction: function() {},
    createWebTransaction: function(url, handle) {
        return handle();
    },
    createBackgroundTransaction: function(name, group, handle) {
        return handle();
    },
    addCustomParameter: function(name, value) {},
    recordCustomEvent: function(name, value) {}
};


