

module.exports = (props) => {
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