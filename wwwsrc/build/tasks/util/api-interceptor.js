const path = require('path');
const fs = require("fs");
const proxyMiddleware = require('http-proxy-middleware');
const https = require('https');
const zlib = require('zlib');
const argv = require('yargs').argv;
const winston = require('winston');

var loggingDir = path.join(__dirname, "../../../../logs");
!fs.existsSync(loggingDir) && fs.mkdir(loggingDir);

var todayDate = new Date().toISOString().substring(0, 10);
winston.configure({
    transports: [
      new (winston.transports.File)({ 
            json: false,
            timestamp: function() {
                return new Date().toISOString()
            },
            formatter: function(options) {
                // Return string will be passed to logger.
                return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (options.message ? options.message : '') +
                (options.meta.headers && Object.keys(options.meta.headers).length ? '\n\n\t'+ JSON.stringify(options.meta.headers) : '' ) + 
                (options.meta.body && Object.keys(options.meta.body).length ? '\n\n\t'+ JSON.stringify(options.meta.body) : '' );
            },
    
          filename: path.join(loggingDir, argv.env + "-" + todayDate + ".log" ) 
        })
    ]
  });

function log(req, body, baseRoute) {
    winston.log("info", "API Request " + req.req.method + " " + req.statusCode + " https://" + req.socket._host + "" + req.req.path, {
        headers: req.headers,
        body: body
    })
}

module.exports = function configInterceptor() {
    var configFile = null;
    var configPath = path.join(__dirname, "../../../configurations", "app.config." + argv.env + ".json");

    if (!fs.existsSync(configPath)) {
        display.log("Cannot find env: " + argv.env);
        process.exit();
    }

    configFile = fs.readFileSync(configPath, 'utf8');
    var json = JSON.parse(configFile);

    var proxies = [];
    Object.keys(json).forEach(function (key) {
        if (typeof json[key] === 'object') {
            var apiService = json[key];
            if (apiService.clients) {
                apiService.clients.forEach(function(client, index) {
                    if (client.root && client.root.indexOf('pulse') > -1) {
                        let pathRewrite = {};
                        pathRewrite["/api/" + client.name + '/'] = "";
                        var clientRoute = client.root;
                        var lastRequest;
                        proxies.push(
                            proxyMiddleware('/api/' + client.name + '/**', {
                                target: clientRoute,
                                pathRewrite: pathRewrite,
                                xfwd: true,
                                secure: true,
                                changeOrigin: true,
                                logLevel: "debug",
                                headers: {
                                    cookie: ""
                                },
                                onProxyReq(proxyReq, req, res) {
                                    var chunks = [];
                                    req.on('data', function(data) {
                                        chunks.push(data);
                                    });

                                    req.on('end', function () {
                                        var buffer = Buffer.concat(chunks);
                                        var encoding = req.headers['content-encoding'];
                                        if (encoding == 'gzip') {
                                            zlib.gunzip(buffer, function(err, decoded) {
                                            if (err) return
                                            lastRequest = decoded.toString();
                                            });
                                        } else if (encoding == 'deflate') {
                                            zlib.inflate(buffer, function(err, decoded) {
                                            if (err) return
                                            lastRequest = decoded.toString();
                                            })
                                        } else {
                                            lastRequest = buffer.toString();
                                        }
                                    })
                                },
                                onProxyRes: ( proxyRes, req, res ) => {
                                    var chunks = [];

                                    proxyRes.on('data', function(data) {
                                        chunks.push(data);
                                    });

                                    proxyRes.on('end', function () {
                                        var buffer = Buffer.concat(chunks);
                                        var encoding = proxyRes.headers['content-encoding'];
                                        if (encoding == 'gzip') {
                                            zlib.gunzip(buffer, function(err, decoded) {
                                            if (err) return
                                            log(proxyRes, lastRequest || decoded && decoded.toString(), clientRoute);
                                            });
                                        } else if (encoding == 'deflate') {
                                            zlib.inflate(buffer, function(err, decoded) {
                                            if (err) return
                                            log(proxyRes, lastRequest || decoded && decoded.toString(), clientRoute);
                                            })
                                        } else {
                                            log(proxyRes, lastRequest || buffer.toString(), clientRoute);
                                        }
                                    })
                                }
                            })
                            
                        );
                        json[key].clients[index].root = 'https://localhost:9000/api/' + client.name + '/';
                    }
                })
            }
        }
    });

    return proxies.concat(function (req, res, next) {
        if (req.url === "/app.config.json" && argv.env) {
            return res.end(JSON.stringify(json, null, 2, 2));
        }
        next();
    });
}