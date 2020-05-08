const uuid = require('uuid').v4

module.exports = (props) => {
    props.res.setHeader('Set-Cookie', 'session_id=123000123; path=/')

    return {
        "article": {
            ":article_id": {
                'comment': {
                    ':comment_id': {
                        "GET": async (props) => {
                            return `<div>hello world! The article ID is <b>"${props.article_id}"</b> and the comment ID is <b>"${props.comment_id}"</b>! Thanks</div>`
                        }
                    }
                }
            }
        },
        "user": {
            ":user_id": {
                "GET": async (props) => {
                    return `<div>My name is ${props.user_id}</div>`
                }
            }
        }
    }
}