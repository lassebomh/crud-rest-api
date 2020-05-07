
module.exports = {
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