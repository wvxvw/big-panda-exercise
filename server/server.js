/* global: require */

var http       = require('http'),
    https      = require('https'),
    fs         = require('fs'),
    stat       = require('node-static-alias'),
    url        = require('url'),
    routington = require('routington'),
    router     = routington(),
    config     = require('./config'),
    path       = require('path');

function start(config, api) {
    var webroot = config.webroot,
        file = new stat.Server(webroot, { 
            cache: 600, 
            headers: { 'X-Powered-By': 'node-static' },
            // I chose to use `node-static-alias' because I might need to load
            // some libraries during testing, which I don't load otherwise.
            // This hook is currently not used, so, in general, the code can be
            // replaced with `node-static' without any losses.
            alias: {
                match: function (requested) {
                    var modules = fs.readdirSync('./node_modules').map(String);
                    return modules.indexOf(
                        requested.reqPath.replace(/^\/([^\/]+).*/g, '$1')) > -1;
                },
                serve: function (requested) {
                    // TODO: This should compute the relative path to node_moduoles.
                    return '../../node_modules' + requested.reqPath;
                },
                allowOutside: true
            }
        });

    http.createServer(function (req, res) {
        var parsed = url.parse(req.url),
            handler = ((router.match(parsed.pathname) || {}).node || {}).handler;
        if (handler) {
            handler(res);
        } else {
            req.addListener('end', function () {
                file.serve(req, res, function (err, result) {
                    if (err) {
                        if (req.url == '/') {
                            file.serveFile('/index.html', 200, {}, req, res);
                        }
                        else if ([404, 500].indexOf(err.status) > -1) {
                            console.warn('Error serving: ' + req.url);
                            file.serveFile(err.status + '.html',
                                           err.status, {}, req, res);
                        } else {
                            console.error('Other error: ' + req.url);
                            res.writeHead(err.status, err.headers);
                            res.end();
                        }
                    } else {
                        console.log('serving: ' + req.url); 
                    }
                });
            }).resume();
        }
    }).listen(config.port);

    // Unfortunately, all Node.js libraries which advertise themselves
    // as synchronous HTTP have serious problems: some don't support TLS.
    // Others are too clumsy or have very bad API.  This bit of code assumes
    // that Github API will use HTTPS protocol (which they currently do).
    // One could write an adapter to hide the difference between HTTP and
    // HTTPS, but I chose to make it simple.
    function forward(res, to) {
        https.get(to, function (result) {
            result.on('data', function (data) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            });
        });
    }

    // The ``router'' is really half-baked, so you need to make it a router
    // yourself.  Again, maybe, given a large scale of the project I'd write
    // an actual router, but I chose to make it simple.
    router.get = function (from, to) {
        router.define(from)[0].handler = function (res) { forward(res, to); };
    };

    router.get('/status.json', api.status_url);
    router.get('/last-message.json', api.last_message_url);
    router.get('/messages.json', api.messages_url);
    
    console.log('Server running at http://127.0.0.1:' + config.port + '/');
    console.log('webroot: ' + webroot);
}

function loadApi(config) {
    https.get('https://status.github.com/api.json', function (result) {
        result.on('data', function (data) {
            start(config, JSON.parse(data));
        });
    });
}

config.readConfig(loadApi);
