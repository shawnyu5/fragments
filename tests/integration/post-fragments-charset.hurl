# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# We're sending a plain text fragment
Content-Type: text/plain; charset=utf-8
# Body of the request goes in ```...``` when it's a string
```This is a fragment!```

# We expect to get back an HTTP 201
HTTP/1.1 201
# We have various assertions about the response that we want to check
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.Fragments.id" matches "^[A-Za-z0-9_-]+$"
# Our ownerId hash is a hex encoded string
jsonpath "$.Fragments.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.Fragments.created" isString
jsonpath "$.Fragments.updated" isString
jsonpath "$.Fragments.type" == "text/plain; charset=utf-8"
# 19 is the length of our fragment data: 'This is a fragment!'
jsonpath "$.Fragments.size" == 19
