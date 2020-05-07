// NPM packages
const http = require('http')
const uuid = require('uuid').v4
const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose')

// Modules
const mimeTypes = require('./../mimetypes.json')
const apiRoute = require('./api.js')


mongoose.connect('mongodb://localhost/nosql-node-backend', { useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});



function objectifyDirectory(dir) {
    let object = {}
    fs.readdirSync(dir).forEach( f => {
        let dirPath = path.join(dir, f)
        object[f] = fs.statSync(dirPath).isDirectory() ? objectifyDirectory(dirPath) : object[f] = fs.readFileSync(path.join(dir, f))
    })
    return object
};

const wwwRoute = objectifyDirectory('./www/');

let tmp = {
    sessionIds: [
        
    ]
}

function parseCookie(cookie) {
    return Object.fromEntries(cookie.split(';').map((entry) => entry.split('=')))
}

const validFileRequestUrl = /^\/([\w]+\/)*(([\w-_]+)(\?[\w_]+\=[\-\_\.\!\~\*\'\(\)\w\%]+(\&([\w_]+\=[\-\_\.\!\~\*\'\(\)\w\%]+))*)|([\w\.\_\-]+\.\w+))?$/
const validApiRequestUrl = /^\/api\/([\w-_]+\/)+([\w-_]+)(\?[\w_]+\=[\-\_\.\!\~\*\'\(\)\w\%]+(\&([\w_]+\=[\-\_\.\!\~\*\'\(\)\w\%]+))*)?$/

http.createServer((req, res) => {
    try {
        if (validApiRequestUrl.test(req.url) || validFileRequestUrl.test(req.url) ) {
            if (req.headers.cookie !== undefined) {
                const cookie = parseCookie(req.headers.cookie)
                if (tmp.sessionIds.indexOf(cookie.session_id) !== -1) {// Valid session_id
                } else { // Invalid / expired session_id
                    tmp.sessionIds.push(uuid())
                    res.setHeader('Set-Cookie', 'session_id='+tmp.sessionIds[tmp.sessionIds.length - 1]+'; path=/')
                } 
            } else { // No session_id
                tmp.sessionIds.push(uuid())
                res.setHeader('Set-Cookie', 'session_id='+tmp.sessionIds[tmp.sessionIds.length - 1]+'; path=/')
            }
        } else {
            throw [400, "Invalid URL"];
        }
        
        if (validApiRequestUrl.test(req.url)) {

            let fnDir = req.url.match(/\/((\/?[\w]+)+)\??.*/)[1].split('/').slice(1)
            fnDir = fnDir.map(call => /\w*[A-Z][0-9]\w*/.test(call) ? '_index' : call)
            fnDir.push(req.method.match(/^(GET|POST|PUT|DELETE)$/)[0])

            function iter(obj, dirs) {
                return typeof obj[dirs[0]] === "object" ? iter(obj[dirs[0]], dirs.slice(1)) : obj[dirs[0]]
            }

            iter(apiRoute, fnDir)(res, req, db)

        } else if (validFileRequestUrl.test(req.url)) {

            if (req.url === "/") {
                var fileDir = ['root.html']
            } else {
                // reqdir += req.url + (req.url[req.url.length - 1] === '/' ? req.url.match(/.*\/(.+)\/$/)[1]+'.html' : '')

                var fileDir = req.url.match(/\/((\/?[\w\.]+)+)\??.*/)[1].split('/')
                fileDir = fileDir.map(call => /\w*[A-Z][0-9]\w*/.test(call) ? '_index' : call)

                if (/.+\/?[\w\_\-\.]+\.\w+$/.test(fileDir[fileDir.length - 1])){

                } else {
                    fileDir.push(fileDir[fileDir.length - 1] + '.html')
                }
            }

            function iter(obj, dirs) {
                return !(/\.\w+$/.test(dirs[0])) ? iter(obj[dirs[0]], dirs.slice(1)) : obj[dirs[0]]
            }

            try {
                var file = iter(wwwRoute, fileDir)
            } catch(err) {
                throw 404
            }
            if (file === undefined) throw 404;

            res.setHeader('Content-Type', mimeTypes[fileDir[fileDir.length - 1].match(/\.\w+$/)[0]])
            res.end(file)

        }

    } catch(err) {
        let error = [500]
        if (err instanceof Error) {
            console.error(err)
        } else {
            error = Number.isInteger(err) ? [err] : err
            console.error(req.url+" "+error[0]+(error[1] ? " "+error[1] : "" ))
        }
        res.writeHead(...error)
        res.end()
    }
}).listen(5000);

console.log('[running] Hosting on http://localhost:5000');