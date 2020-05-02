const http = require('http');
const uuid = require('uuid').v4

const api = {
    'v1': {
        'article': {
            '_get': (req, db, res) => {

            },
            '_index': {
                '_get': (req, db, res) => {

                },
                "comment": {
                    '_get': {
                        
                    }
                },
                'customFunction': {
                    '_get': (req, db, res) => {

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
    //blah regex have fun

    return Object.fromEntries(cookie.split(';').map((entry) => entry.split('=')))
}

http.createServer((req, res) => {
    try {
        if (req.headers.cookie !== undefined) {
            const cookie = parseCookie(req.headers.cookie)
            if (tmp.sessionIds.indexOf(cookie.session_id) !== -1) {
                // console.log('Valid Cookie! 200 Leet');
            } else {
                // console.log('Your cookie is invalid!');
                tmp.sessionIds.push(uuid())
                res.setHeader('Set-Cookie', 'session_id='+tmp.sessionIds[tmp.sessionIds.length - 1])
            } 
        } else {
            // console.log('No cookie! Giving cookie!');
            tmp.sessionIds.push(uuid())
            res.setHeader('Set-Cookie', 'session_id='+tmp.sessionIds[tmp.sessionIds.length - 1])
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
