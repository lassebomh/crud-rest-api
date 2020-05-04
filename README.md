# What is this?
A stateless & RESTful NodeJS backend that uses MongoDB. The goal is to follow good design principles that makes the backend scalable and fun to develop in. This repository is only an api template, so you are free to fork the ```stable``` branch if you want to use it yourself.
# Why?
Backend API's have a tendency to become extremely unorganized when the scope of the project increases. This is why we have design patterns such as CRUD and REST. A typical (and quite problematic) example of how one could make his/her api would be like this:
| Url |
| - |
| `/api/getArticle?id=N8k2` |
| `/api/getArticleComment?article_id=N8k2&comment_id=1` |
| `/api/updateArticleComment?article_id=N8k2&comment_id=2` |
| `/api/removeArticleComment?article_id=N8k2&comment_id=3` |
| `/api/newArticleComment?article_id=N8k2` |

This is bad. Sure, this might work OK when your project is tiny, but it will only take a couple of features to make this list completely un-navigatable and annoying to work with. The code has been written with this problem in mind, and the solution looks a little something like this:
| Url | Method |
| - | - |
| `/api/article/N8k2` | GET |
| `/api/article/N8k2/comment/1` | GET |
| `/api/article/N8k2/comment/2` | PUT | 
| `/api/article/N8k2/comment/3` | DELETE |
| `/api/article/N8k2/comment/new` | POST |

How organized! This doesn't just make it easier to use for the consumer of the API, it also makes it more convenient for the person developing the API to find what functions are assocated with an asset, because all the functions associated with that asset will be found in its personal scope.

Another advantage is that we now properly communicate what the browser is allowed to do with the response. GET requests are for an example cachable. This allows the browser to cache the result of `/article/N8k2/comment/3fA8`.

Here is an example of what the API route could look like in practice:
```
  Api object                                |  Url                                  |  Method
--------------------------------------------|---------------------------------------|-----------------
'article': {
    '_index': {
        'GET': (...) => {                      /api/v1/article/N8k2                     GET

        },
        "comment": {
            '_index': {
                'GET': (...) => {              /api/v1/article/N8k2/comment/3           GET

                },
                'PUT': (...) => {              /api/v1/article/N8k2/comment/3           PUT

                },
                'DELETE': (...) => {           /api/v1/article/N8k2/comment/3           DELETE

                }
            },
            'new': {
                'POST': (...) => {             /api/v1/article/N8k2/comment/new         POST

                }
            }
        }
    }
}
