
const http = require('http')
const uuid = require('uuid').v4
const fs = require('fs')

async function responses(props) {
    props.res.setHeader('Set-Cookie', 'session_id=42069420; path=/')

    return {
        ":article_id": {
            'comment': {
                ':comment_id': {
                    "GET": async (props) => {
                        return ''
                    }
                }
            }
        }
    }
}

async function traverse(terrain, map, inputs) {

    terrain = typeof terrain === "function" ? await terrain(inputs) : terrain
    
    if (typeof terrain === "object" && !(terrain instanceof Buffer)) {
        let findResult = terrain[map[0]]
        if (findResult === undefined) {
            for (let i = 0; i < Object.keys(terrain).length; i++) {
                indexed = Object.keys(terrain)[i]
                if (Object.keys(terrain)[i][0] === ":") {
                    findResult = terrain[indexed]
                    inputs[indexed.slice(1)] = map[0]
                    break
                }
            }
        }
        return await traverse(findResult, map.slice(1), inputs)
        
    } else return terrain
}

http.createServer(async (req, res) => {

    try {
        let reqLocation = req.url.match(/\/((\/?[^\/]+)*)\??.*/)[1].split('/')
        reqLocation.push(req.method)
        
        let props = {req: req,
                     res: res,
                     db: 420}

        try {
            props.req.headers.cookie.split(';').map((entry) => entry.split('=')).map((e) => props[e[0]] = JSON.parse(decodeURIComponent(e[1])))
            
            let re = props.req.url.match(/.+\?(.+)$/)
            if(re) re[1].split('&').map((entry) => entry.split('=')).map((e) => props[e[0]] = !JSON.parse(decodeURIComponent(e[1])))
    
        } catch (e) {
            throw e instanceof URIError ? 400 : e
        }

        let body = await traverse(responses, reqLocation, props)
        
        console.log(body);
        if (body === undefined) {
            throw 404
        }
        
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
}).listen(5000);
console.log('[running] Hosting on http://localhost:5000');
