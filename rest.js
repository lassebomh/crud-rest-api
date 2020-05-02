const http = require('http')
const uuid = require('uuid').v4

const apiRoute = {
    'v1': {
        'article': {
            'GET': (req, db, res) => {

            },
            '_index': {
                'GET': (req, db, res) => {

                },
                "comment": {
                    'GET': {
                        
                    }
                },
                'customFunction': {
                    'GET': (req, db, res) => {

                    }
                }
            },
            'customFunction': (req, db, res) => {

            }
        }
    }
}

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
        
        if (1) { // Determine if it's an api call

        } else if (1) { // Determine if it's an resource call

        } else { // Invalid call!
            throw 400;
        }

        res.writeHead(200, {'Content-Type': "text/html"})
        res.end()


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
