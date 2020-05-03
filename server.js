// NPM packages
const http = require('http')
const uuid = require('uuid').v4
const path = require('path')
const fs = require('fs')

// Modules
const mimeTypes = require('./mimetypes.json')

// const rights = require('./modules/rights.js')

// console.log(rights);

// function wrap(wrapper, func) {
//     return (...props) => {
//         wrapper(...props);
//         func(...props)
//     }
// }

// Wrapping example
//
// var runMeYes = wrap((req, res, db) => {
//     console.log('wrapped', req, res, db)
//     }, (req, res, db) => {
//     console.log(req, res, db);
// })
//
//runMeYes('a', 'b', 'c')

const apiRoute = {
    'v1': {
        'article': {
            'GET': (req, res, db) => {
                console.log('v1 article get');
            },
            '_index': {
                'GET': (req, res, db) => {
                    console.log('v1 article index get');
                },
                "comment": {
                    '_index': {
                        'GET': (req, res, db) => {
                            console.log('v1 article index comment index get');
                        }
                    }
                },
                'customFunction': {
                    'GET': (req, res, db) => {
                        console.log('v1 article index customFunction');
                    }
                }
            },
            'customFunction': (req, res, db) => {
                console.log('v1 article customFunction');
            }
        }
    }
}

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
    //todo: Validate Cookie with regex
    return Object.fromEntries(cookie.split(';').map((entry) => entry.split('=')))
}

http.createServer((req, res) => {
    try {
        if (req.headers.cookie !== undefined) {
            const cookie = parseCookie(req.headers.cookie)
            if (tmp.sessionIds.indexOf(cookie.session_id) !== -1) {// Valid session_id
            } else { // Invalid / expired session_id
                tmp.sessionIds.push(uuid())
                res.setHeader('Set-Cookie', 'session_id='+tmp.sessionIds[tmp.sessionIds.length - 1])
            } 
        } else { // No session_id
            tmp.sessionIds.push(uuid())
            res.setHeader('Set-Cookie', 'session_id='+tmp.sessionIds[tmp.sessionIds.length - 1])
        }
        
        if (req.url.slice(0, 5) === '/api/') { // Api call todo: regex check

            let fnDir = req.url.match(/\/((\/?[\w]+)+)\??.*/)[1].split('/').slice(1)
            fnDir = fnDir.map(call => /\w*[A-Z][0-9]\w*/.test(call) ? '_index' : call)
            fnDir.push(req.method.match(/^(GET|POST|PUT|DELETE)$/)[0])

            function iter(obj, dirs) {
                return typeof obj[dirs[0]] === "object" ? iter(obj[dirs[0]], dirs.slice(1)) : obj[dirs[0]]
            }

            iter(apiRoute, fnDir)()

            res.writeHead(200, {'Content-Type': "text/html"})
            res.end()

        } else if (1) { // Resource call todo: regex check

            // let requestLocation = ""
            // const re = req.url.match(/\/[\w\.]+$/)
            // if (re != null && fs.existsSync('./www/_public'+re[0])){
            //     requestLocation = './www/_public'+req.url.match(/\/[\w\.]+$/)[0]
            // } else if (req.url === '/') {
            //     requestLocation = './www/index.html'
            // } else {
            //     const re = req.url.match(/\/([\w-]+)\/$/)
            //     requestLocation = './www' + req.url + (req.url[req.url.length-1] === '/' ? re[1]+'.html' : '')
            // }
            // if (!fs.existsSync(requestLocation)) {throw [404, `Cannot find ${req.url}`]; }
    
            // res.setHeader('Content-Type', mimeTypes[requestLocation.match(/\.\w+$/)[0]])
            // res.end(fs.readFileSync(requestLocation))

            
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
                return (/.+\/[\w\_\-\.]+\.\w+$/.test(dirs[0])) ? iter(obj[dirs[0]], dirs.slice(1)) : obj[dirs[0]]
            }

            res.setHeader('Content-Type', mimeTypes[fileDir[fileDir.length - 1].match(/\.\w+$/)[0]])
            res.end(iter(wwwRoute, fileDir))//(fs.readFileSync(reqdir))

        } else { // Invalid call!
            throw 400;
        }

    } catch(err) {
        let error = [500]
        if (err instanceof Error) {
            console.error(err)
        } else {
            error = Number.isInteger(err) ? [err] : err
            console.error("Error "+error[0]+': '+error[1])
        }
        res.writeHead(...error)
        res.end()
    }

}).listen(5000);

console.log('[running] Hosting on http://localhost:5000');
