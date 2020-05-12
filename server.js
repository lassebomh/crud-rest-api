
// NPM modules
const http = require('http')
const fs = require('fs')
const mongoose = require('mongoose')

// Local modules
const r = require('./modules/route.js')
const [init, route] = [r.init, r.route]
const secret = require('./secret.json')

mongoose.connect(secret.db.url, { useNewUrlParser: true, useUnifiedTopology: true, user: secret.db.user, pass: secret.db.user});
var db = mongoose.connection;

const errorCodeColors = {
    "2": "\x1b[32m",
    "4": "\x1b[33m",
    "5": "\x1b[31m"
}

async function traverse(terrain, map, pass) {

    terrain = typeof terrain === "function" ? await terrain(pass) : terrain
    
    if (typeof terrain === "object" && !(terrain instanceof Buffer)) {
        let findResult = terrain[map[0]]
        if (findResult === undefined) {
            for (let i = 0; i < Object.keys(terrain).length; i++) {
                indexed = Object.keys(terrain)[i]
                if (Object.keys(terrain)[i][0] === ":") {
                    findResult = terrain[indexed]
                    pass.options[indexed.slice(1)] = map[0]
                    break
                }
            }
        }
        return await traverse(findResult, map.slice(1), pass)
        
    } else return terrain
}

server = http.createServer(async (req, res) => {
    try {
        let reqLocation = req.url.match(/\/((\/?[^\/\?]+)*)\??.*/)[1].split('/')
        reqLocation.push(req.method)
        reqLocation = reqLocation.filter((e) => e !== "")
        
        let pass = {req: req, res: res, db: db, options: {}, cookies: {}}

        try {
            if (pass.req.headers.cookie) {
                pass.req.headers.cookie.split(';').map((entry) => entry.split('=')).map((e) => {
                    pass.cookies[e[0]] = JSON.parse(decodeURIComponent(e[1]))
                })
            }
            
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
            var errorText = e
        } else {
            error = Number.isInteger(e) ? [e] : e
        }
        res.writeHead(...error)
        res.end()
    }
    console.log("    "
        + errorCodeColors[String(res.statusCode)[0]]
        + res.statusCode
        + "\x1b[0m | "
        + ((res.statusMessage) ? (res.statusMessage+" "+" ".repeat(30 - res.statusMessage.length)) : " ".repeat(30))
        + (req.method+" "+" ".repeat(7 - req.method.length))
        + req.url)
    if (errorText) console.error(errorText)
    })
})

console.log(`        | Trying to connect to database at "${secret.db.url}"`);
db.once('open', () => {
    console.log("\x1b[32m", `    OK\x1b[0m | Connected to database`);
    server.listen(secret.hosting.port)
    console.log("\x1b[32m", `    OK\x1b[0m | Hosting server at "http://localhost:${secret.hosting.port}"`);
    console.log("   -----|");
    init(db)
});
