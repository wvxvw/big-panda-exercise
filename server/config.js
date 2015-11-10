/* global require, process, module */

var fs = require('fs');

function optParse(argv) {
    // Do not use `node-commandline' it has multiple issues
    return { program: argv[0], script: argv[1] };
}

module.exports.readConfig = function (continuation) {
    var options = optParse(process.argv);
    
    fs.readFile('./server/config.json', function (err, data) {
        var result;
        if (err) {
            console.error(
                'Could not load configuration from: ./server/config.json, because ' + err);
            result = { };
        } else {
            result = JSON.parse(data);
        }
        result.webroot = result.webroot ||
            options.script.replace(/\/[^\/]+$/g, './httpdoc');
        result.port = result.port || 8000;
        continuation(result);
    });
};
