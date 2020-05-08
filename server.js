
// NPM modules
const http = require('http')
const fs = require('fs')
const mongoose = require('mongoose')

// Local modules
const route = require('./modules/route.js')
const secret = require('./secret.json')

mongoose.connect(secret.db.url, { useNewUrlParser: true, useUnifiedTopology: true, user: secret.db.user, pass: secret.db.user});
var db = mongoose.connection;

async function traverse(terrain, map, inputs) {

    terrain = typeof terrain === "function" ? await terrain(inputs) : terrain
    
    if (typeof terrain === "object" && !(terrain instanceof Buffer)) {
        let findResult = terrain[map[0]]
        if (findResult === undefined) {
            for (let i = 0; i < Object.keys(terrain).length; i++) {
                indexed = Object.keys(terrain)[i]
                if (Object.keys(terrain)[i][0] === ":") {
                    findResult = terrain[indexed]
                    inputs.options[indexed.slice(1)] = map[0]
                    break
                }
            }
        }
        return await traverse(findResult, map.slice(1), inputs)
        
    } else return terrain
}

server = http.createServer(async (req, res) => {
    try {
        let reqLocation = req.url.match(/\/((\/?[^\/\?]+)*)\??.*/)[1].split('/')
        reqLocation.push(req.method)
        
        let pass = {req: req, res: res, db: db, options: {}, cookies: {}}

        try {
            pass.req.headers.cookie.split(';').map((entry) => entry.split('=')).map((e) => pass.cookies[e[0]] = JSON.parse(decodeURIComponent(e[1])))
            
            let re = pass.req.url.match(/.+\?(.+)$/)
            if(re) re[1].split('&').map((entry) => entry.split('=')).map((e) => pass.options[e[0]] = JSON.parse(decodeURIComponent(e[1])))
    
        } catch (e) {
            throw e instanceof URIError | e instanceof SyntaxError ? 400 : e
        }

        let body = await traverse(route, reqLocation, pass)
        if (body === undefined) throw 404
        
        res.end(body)

    } catch(e) {
        let error = [500]
        if (e instanceof Error) {
            console.error(e)
        } else {
            error = Number.isInteger(e) ? [e] : e
            console.error(error[0]+(error[1] ? " "+error[1] : "" + " " + req.url))
        }
        res.writeHead(...error)
        res.end()
    }
})

console.log(`        | Trying to connect to database at "${secret.db.url}"`);
db.once('open', () => {
    console.log(`     OK | Connected to database`);
    server.listen(secret.hosting.port)
    console.log(`     OK | Hosting server at "http://localhost:${secret.hosting.port}"`);
});