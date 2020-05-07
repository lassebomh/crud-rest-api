
const http = require('http')


class Props {
    constructor (req, res, db) {
        this.req = req
        this.res = res
        this.db = db
    }
}

responses = {
    ":orm_id": (props) => {
        console.log(props.orm_id);
    },
    "api": async (props) => {
        // props.session_id
        return {
            "article": {
                ":master": async (props) => {
                    console.log(props);
                }
            }
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
    result = await location(inputs);
    console.log(result, map.slice(1));

    switch (typeof result) {
        case "function":
            console.log("funky!")
            break
        case "object":
            console.log('thingy!');
            break
    }

}

http.createServer(async (req, res) => {


    let runLocation = req.url.match(/\/((\/?[\w]+)*)\??.*/)[1].split('/')   
    // console.log(runLocation);

    traverse(responses, runLocation, new Props(req, res, 420))

    res.writeHead(200, 'It worked!', {'Content-Type': "text/html"})
    res.end('<b>this is some bold text!</b>')

}).listen(5000);
console.log('[running] Hosting on http://localhost:5000');
