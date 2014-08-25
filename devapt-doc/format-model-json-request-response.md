
RESTFULL SERVER

Example with application /devapt-tutorial-1/public/ and a model MODEL_AUTH_USERS (a 15 users list):

READ:
GET HTTP REQUEST TO : .../devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/?query_api=2
with an empty content
The result is: {status: "ok", count: 15, error: "", records: Array[15]}

CREATE:
GET HTTP REQUEST TO : .../devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/?query_api=2
with a records as content: