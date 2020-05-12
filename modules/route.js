
// This is a basic example of a route

const uuid = require('uuid').v4
const fs = require('fs')

exports.init = (db) => {
    
    // This runs once
}

exports.route = (pass) => {
    pass.res.setHeader('Set-Cookie', 'session_id=102030; path=/; sameSite=strict')
    return {
        "GET": async (pass) => {
            return fs.readFileSync('./website.html')
        },
        "article": {
            ":article_id": {
                'comment': {
                    ':comment_id': {
                        "GET": async (pass) => {
                            return `<div>hello world! The article ID is <b>"${pass.options.article_id}"</b> and the comment ID is <b>"${pass.options.comment_id}"</b>! The cookie ${pass.cookie.session_id}. Thanks</div>`
                        }
                    }
                }
            }
        },
        "user": {
            ":user_id": {
                "GET": async (pass) => {
                    return `<div>Hello world! My name is ${pass.options.user_id}</div>`
                }
            }
        }
    }
}