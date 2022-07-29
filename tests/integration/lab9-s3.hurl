# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# We're sending a plain text fragment
Content-Type: text/plain
# Body of the request goes in ```...``` when it's a string
```Hello S3!```

# We expect to get back an HTTP 201
HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
[Captures]
url: header "Location"

# check the fragment exists
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 201

# delete the fragment
DELETE {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 201
[Asserts]
jsonpath "$.deletedFragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.deletedFragment.id" matches "^[A-Za-z0-9_-]+$"

# check the fragment as been deleted
GET {{url}}
HTTP/1.1 401
