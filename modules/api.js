
class Result {
    constructor(status, statusText, headers, body)
}

api = {
    v1: async (req, res, db, options) => {
        if (1) {
            return {value: 200, status: 200, statusText: 'OK'}
        } else {
            return {
                article: 4
            }
        }
    }
}

async function main() {
    console.log(await api.v1);
    
}