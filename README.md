# What is this?
A stateless RESTful NodeJS backend template. The goal is to follow good design principles that makes the backend scalable and fun to develop in. This repository is only an api template, so you are free to fork the ```stable``` branch if you want to use it yourself.
# Why?
Backend API's have a tendency to become extremely unorganized when the scope of the project increases. This is why we have design patterns such as CRUD and REST. A typical example of how one could make his/her api functions would be like this:
| Url |
| - |
| `/getArticle` |
| `/getArticleComment` |
| `/updateArticleComment` |
| `/removeArticleComment` |
| `/newArticleComment` |

This is bad. Sure, this might work OK when your project is tiny, but it will only take a couple of features to make this list completely un-navigatable and annoying to work with. The code has been written with this problem in mind, and the solution looks a little something like this:
| Url | Method |
| - | - |
| `/article/N8k2` | GET |
| `/article/N8k2/comment/3fA8` | GET |
| `/article/N8k2/comment/3fA8` | PUT | 
| `/article/N8k2/comment/3fA8` | DELETE |
| `/article/N8k2/comment/new` | POST |

This is also advantagous because we now properly communicate to the browser on how it is allowed to handle the data - which in this example allows the browser to cache the result of `/article/N8k2/comment/3fA8`. Here is an example of what the API route could look like in practice:
```
  Api object                                |  Url                                  |  Method
--------------------------------------------|---------------------------------------|-----------------
'article': {
    '_index': {
        'GET': (...) => {                      /api/v1/article/N8k2                     GET

        },
        "comment": {
            '_index': {
                'GET': (...) => {              /api/v1/article/N8k2/comment/3fA8        GET

                },
                'PUT': (...) => {              /api/v1/article/N8k2/comment/3fA8        PUT

                },
                'DELETE': (...) => {           /api/v1/article/N8k2/comment/3fA8        DELETE

                }
            },
            'new': {
                'POST': (...) => {             /api/v1/article/N8k2/comment/new         POST

                }
            }
        }
    }
}
