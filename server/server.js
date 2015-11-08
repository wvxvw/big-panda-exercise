var http       = require('http'),
    https      = require('https'),
    stat       = require('node-static'),
    url        = require('url'),
    routington = require('routington'),
    router     = routington(),
    config     = require('./config'),
    path       = require('path');

function start(config, api) {
    var webroot = config.webroot,
        file = new stat.Server(webroot, { 
            cache: 600, 
            headers: { 'X-Powered-By': 'node-static' } });

    http.createServer(function (req, res) {
        var parsed = url.parse(req.url),
            handler = ((router.match(parsed.pathname) || {}).node || {}).handler;
        console.log('url: ' + req.url);
        console.log('handler: ' + handler);
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
                            console.error('Error serving: ' + req.url);
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

    function forward(res, to) {
        https.get(to, function (result) {
            result.on('data', function (data) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            });
        });
    }

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
