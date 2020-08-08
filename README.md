# q-and-api
The Node + Express RESTful API for a code-oriented flash cards database.

base url: `https://arcane-stream-45843.herokuapp.com/`

## GET `/questions`

*SAMPLE RESPONSE*
```json
[
  {
    "categories": [
      "CSS"
    ],
    "_id": "-o9MW52GG",
    "prompt": "What CSS display value will cause the element to fill the space of its container?",
    "difficulty": 2,
    "answer": "display: block",
    "createdAt": "2020-08-08T05:22:49.112Z",
    "gist": "https://gist.github.com/cnocon/25c10c5a228ef004de9ca54fe64f7411.js",
    "__v": 0
  },
  {
    "categories": [
      "JavaScript",
      "Node"
    ],
    "_id": "OW1YItFAf",
    "prompt": "What language is the V8 engine behind Node JS written in?",
    "difficulty": 6,
    "answer": "C++",
    "createdAt": "2020-08-08T04:42:49.066Z",
    "__v": 0
  },
]
```
