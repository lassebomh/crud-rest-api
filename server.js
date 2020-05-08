
const http = require('http')


class Props {
    constructor (req, res, db) {
        this.req = req
        this.res = res
        this.db = db
    }
}

async function responses(props) {
    props.res.setHeader('Set-Cookie', 'session_id=42069420; path=/')

    return {
        ":article_id": {
            'comment': {
                ':comment_id': async (props) => {
                    props.res.writeHead(200)
                    props.res.write(`Article ${props.article_id}. Comment ${props.comment_id}`)
                }
            }
        }
    }
}

async function traverse(terrain, map, inputs) {

    terrain = typeof terrain === "function" ? await terrain(inputs) : terrain
    
    if (typeof terrain === "object") {
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
        // console.log(terrain, map);
        await traverse(findResult, map.slice(1), inputs)
        
    } else if (terrain === undefined) {
        // console.log(terrain, map);
        
    }
}

http.createServer(async (req, res) => {

    let reqLocation = req.url.match(/\/((\/?[\w]+)*)\??.*/)[1].split('/')   
    
    try {
        await traverse(responses, reqLocation, new Props(req, res, 420))
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

    res.end()

}).listen(5000);
console.log('[running] Hosting on http://localhost:5000');
