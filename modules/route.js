const uuid = require('uuid').v4

module.exports = (pass) => {
    pass.res.setHeader('Set-Cookie', 'session_id=123000123; path=/')

    return {
        "article": {
            ":article_id": {
                'comment': {
                    ':comment_id':  async (pass) => {
                        return `<div>hello world! The article ID is <b>"${pass.options.article_id}"</b> and the comment ID is <b>"${pass.options.comment_id}"</b>! Thanks</div>`
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