// NPM packages
const http = require('http')
const uuid = require('uuid').v4
const path = require('path')
const fs = require('fs')
var mongoose = require('mongoose');

// Modules
const mimeTypes = require('./../mimetypes.json')
const apiRoute = require('./api.js')

mongoose.connect('mongodb://127.0.0.1/nosql-node-backend', { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;
let tmp = {sessionIds: []}

function parseCookie(cookie) {
    return Object.fromEntries(cookie.split(';').map((entry) => entry.split('=')))
}

// const validApiRequestUrl = /^\/api\/([\w-_]+\/)+([\w-_]+)(\?[\w_]+\=[\-\_\.\!\~\*\'\(\)\w\%]+(\&([\w_]+\=[\-\_\.\!\~\*\'\(\)\w\%]+))*)?$/

http.createServer(async (req, res) => {
    try {
        if (validApiRequestUrl.test(req.url)) {
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

            // let fnDir = req.url.match(/\/((\/?[\w]+)+)\??.*/)[1].split('/').slice(1)
            // fnDir = fnDir.map(call => /\w*[A-Z][0-9]\w*/.test(call) ? '_index' : call)
            // fnDir.push(req.method.match(/^(GET|POST|PUT|DELETE)$/)[0])

            // function iter(obj, dirs) {
            //     return typeof obj[dirs[0]] === "object" ? iter(obj[dirs[0]], dirs.slice(1)) : obj[dirs[0]]
            // }



            res.end(iter(apiRoute, fnDir)())

        }

    } catch(e) {
        let error = [500]
        if (e instanceof Error) {
            console.error(e)
        } else {
            error = Number.isInteger(e) ? [e] : e
            console.error(req.url+" "+error[0]+(error[1] ? " "+error[1] : "" ))
        }
        res.writeHead(...error)
        res.end()
    }
}).listen(5000);

console.log('[running] Hosting on http://localhost:5000');