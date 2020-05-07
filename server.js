
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
        ":article_id": async (props) => {
            props.res.writeHead(200)
            props.res.write(`The article id is: ${props.article_id}. Amazing!`)
        }
    }
}

async function traverse(terrain, map, inputs) {
    location = terrain[map[0]]
    if (location === undefined) {
        for (let i = 0; i < Object.keys(terrain).length; i++) {
            indexed = Object.keys(terrain)[i]
            if (Object.keys(terrain)[i][0] === ":") {
                location = terrain[indexed]
                inputs[indexed.slice(1)] = map[0]
                break
            }
        }
    }
    let nextTerrain;

    

    if (typeof location === 'function') {
        let result = await location(inputs)
        if (typeof result === 'object') {
            nextTerrain = result
        }
    } else {
        nextTerrain = location
    }

    if (nextTerrain != null) traverse(nextTerrain, map.slice(1), inputs)
    // console.log(nextTerrain);
    
}

http.createServer(async (req, res) => {

    let reqLocation = req.url.match(/\/((\/?[\w]+)*)\??.*/)[1].split('/')   

    await traverse(responses, reqLocation, new Props(req, res, 420))
    res.end()

}).listen(5000);
console.log('[running] Hosting on http://localhost:5000');
