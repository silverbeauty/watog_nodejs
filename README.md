# Watog API

## How to run
### Dev  
`npm run start:dev`
### Production
`npm start`
### Required Env Variables

Set these env variables in `/var/www/watog_api.com/watog_env`.
Files, docs, db, test db are stored in the following paths defined in `config/path`.

```
  module.exports.FILES_PATH = '/var/www/watog_api.com/files/'
  module.exports.DOCS_PATH = '/var/www/watog_api.com/docs/'
  module.exports.DB_PATH = '/var/www/watog_api.com/watogDB.sqlite'
  module.exports.TEST_DB_PATH = '/var/www/watog_api.com/test_watogDB.sqlite'
  module.exports.ENV_PATH = '/var/www/watog_api.com/watog_env'
```

#### PORT=3000
#### TWILIO_SID=***
#### TWILIO_AUTH_TOKEN=***
#### TWILIO_FROM=+33757916836
#### JWT_SECRET=****
#### WATOG_DOMAIN=http://xxx.com[:port number]
#### SMTP_DOMAIN
#### SMTP_PORT
#### SMTP_SECURE
#### SMTP_USER
#### SMTP_PASS

## Endpoints

### Sign Up. 
   
  POST `/api/user`  
   
  Body: 
  ```
  {
    "email": "user@email.com",
    "user_name": "user",
    "password": "pwd"
    "first_name": ""
    "last_name": ""
    "cell_phone": "",
    "country": "",
    "hospital": ""
  }
  ```

  Response:  
  
  HTTP Status: 200
  ```
    {
        "status": true,
        "data": {
            "id": 2,
            "email": "test1@test.com",
            "first_name": "A",
            "last_name": "B",
            "cell_phone": "1234567890",
            "country": "usa",
            "hospital": "a",
            "updatedAt": "2018-08-16T14:38:33.188Z",
            "createdAt": "2018-08-16T14:38:33.188Z"
        }
    }
  ```

  HTTP Status: 500
  ```
    {
        "status": false,
        "error": [
            {
                "message": "email must be unique",
                "type": "unique violation",
                "path": "email",
                "value": "test1@test.com",
                "origin": "DB",
                "instance": {},
                "validatorKey": "not_unique",
                "validatorName": null,
                "validatorArgs": []
            }
        ]
    }
  ```

### Login.
   
   POST `/api/user/login`  
   
   Body: 
   ```
   {
       "email": // Email or user_name,
       "password": "pwd"
   }
   ```

   Response:

   HTTP Status: 200  
   ```
    {
        "status": true,
        "data": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE1MzQ0MzAwNzV9.ObSw3PxO03keexi6Lb7BXSXtbt8xmdoUhjFpSWbyj3w",
            "user": {
                "id": 1,
                "first_name": "A",
                "last_name": "B",
                "email": "test@test.com",
                "cell_phone": "1234567890",
                "country": "usa",
                "hospital": "a",
                "createdAt": "2018-08-16T14:27:19.854Z",
                "updatedAt": "2018-08-16T14:27:19.854Z"
            }
        }
    }
   ```
   HTTP Status: 401  

   ```
    {
      "status": false,
      "error": "Invalid email or password!"
    }
   ``` 

### User APIs

#### GET `/user/me`  
  Return own profile by JWT  

  Response:  

  HTTP Status: 200  
  ```  
  {
      "status": true,
      "data": {
          "id": 1,
          "first_name": "Test",
          "last_name": "Again",
          "email": "test@test.com",
          "cell_phone": "1234567890",
          "country": "usa",
          "state": null,
          "hospital": "a",
          "proof_of_status": null,
          "proof_of_status_date": null,
          "email_verified_date": null,
          "sms_verified_date": null,
          "picture_profile": null,
          "picture_cover": null,
          "up_vote_count": 0,
          "down_vote_count": 0,
          "vote_score": -1,
          "createdAt": "2018-08-23T04:23:48.689Z",
          "updatedAt": "2018-08-23T05:16:23.498Z",
          "vote_rank": 1,
          "good_posts": [Post] // up to 5, ordered by 'up_vote_count' 
          ]
      }
  }
  ```


#### PUT `/user/me`  

  Edit own profile by JWT  

  Response:  

  HTTP Status: 200  
  ```  
  {
    "status": true,
    "data": User Object
  }
  ```

#### PUT `/user/me`  

  Edit own profile by JWT  

  Response:

  HTTP Status: 200  
  ```  
  {
    "status": true,
  }
  ```

#### GET `/user?[QUERY]`  
  Query users with [QUERY] - QUERY can be missing  

  Query:  
  `limit`, `offset`, `first_name`, `last_name`, `country`, `hospital`, `name`, `order`, `direction`, `not_me` 

  - `order`: one of ['vote_score', 'up_vote_count', 'down_vote_count', 'createdAt', 'updatedAt']
  - `direction`: one of ['DESC', 'ASC']
  - `not_me`: Exclude the current user

  Response:  

  HTTP Status: 200  
  ```  
  {
    "status": true,
    "data": [User Object]
  }
  ``` 
#### GET `/user/:id`
  Return a user with id  

  Response:  

  HTTP Status: 200  
  ```  
  {
    "status": true,
    "data": User Object
  }
  ```

#### PUT `/user/me`
  Edit own profile

  Body:
  ```
  {
    //all user fields except  `password`, `proof_of_status_date`, `email_verified_date`, `sms_verified_date`
    // settings should be stringified using JSON.stringify, eg: "{"notifications":{"vote":true,"participate":true,"spam_mark":true}}"
  }
  ```

#### POST `/user/forgot-password`

Send password reset link through email or verification code to cell phone  
  Body:  
  ```
  {
    email: 
  }
  ```

  Response:  
  ```
  {
    status: true
  }
  ```

#### POST `/reset-password/:token`  

Reset password by the token sent by email

  Body:  
  ```
  {
    password
  }
  ```

  Response:  
  ```
  {
    status: true
  }
  ```


#### POST `/new-password'

Reset password by old password

  Body:
  ```
  {
    old_password,
    new_password
  }
  ```

### Verify APIs  

#### POST `/user/verify/email`  
  
  Send Verification Email (Requires JWT set in `Authorization` header)  

#### POST `/user/verify/sms`. 
  
  Send Verification SMS to `cell_phone` (Requires JWT set in `Authorization` header)

#### GET `/user/verify/email/:code`. 
  
  Link sent in the verify email.  
  User will click this link.   
  Response: normal HTTP response. 

#### GET `/user/verify/sms/:code`
  
  User should make a GET request with the codes sent by SMS.  

  Response:  

  HTTP Status: 200
  ```
  {
    status: true,
    data: User Profile
  }
  ```

  HTTP Status: 400
  ```
  {
    status: false,
    error: one of `expired_code`, `invalid_code`, `already_verified`
  }
  ```

### File APIs

#### GET `/api/file/:name`
  
  Return file in `files/:name`

#### DELETE `/api/file/:name`
  
  Remove a file. 
  Only the files the user created can be removed

#### POST `/api/file`

  Upload a file 

  Header:  
  
  ```
  "Content-Type": "application/json"
  ```

  Body:  


  ```
  "file": File Object // as Form Data
  ```

  or 

  ```
  {
    "file": "data:image/jpeg;base64...."
  }
  ```

  Response:

  ```
  {
    "status": true,
    "data": {
        "file_name": "949b4d70-a48d-11e8-a12f-dd03f72627a4.png",
        "url": "http://localhost:3000/api/file/949b4d70-a48d-11e8-a12f-dd03f72627a4.png"
    }
  }
  ```

#### GET `/api/file/verify/:id`
  
  Return proof of status doc in `files/:id`

#### POST `/api/file/verify`
  
  Upload proof of status doc

  Header:  
  
  ```
    "Content-Type": "application/json"
  ```

  Body:  

  ```
  "file": File Object
  ```

  Response: the same as `/api/user`

### Category APIs

#### POST `/api/category`

  Body: 
  ```
  { "type": String, "description": String(Optinal), "score_ratio": Float (default: 1.0 )}
  ```

  Response:  
  HTTP Status: 200. 
  ```
  {
      "status": true,
      "data": {
          "id": 2,
          "type": "boys",
          "description": "AAAa",
          "user_id": 1,
          "ratio": ,
          "updatedAt": "2018-08-27T16:56:04.173Z",
          "createdAt": "2018-08-27T16:56:04.173Z"
      }
  }
  ```

#### GET `/api/category/:id`

  Response:
  HTTP Status: 200,  
  ```
  {
    "status": true,
    "data": {
        "id": 1,
        "type": "boy",
        "user_id": 2,
        "updatedAt": "2018-08-20T08:12:30.304Z",
        "createdAt": "2018-08-20T08:12:30.304Z"
    }
  }
  ```

#### GET `/api/category?[QUERY]`
  
  Query categories
  QUERY can be `limit`, `offset`, `user_id`


  Response:
  HTTP Status: 200,  
  ```
  {
    "status": true,
    "data": [Category Object]
  }
  ```

### Post APIs
#### POST `/api/post`
  Create a single post. 
  `picture` should be get by `API host` + `/api/files` + returned id from POST `/api/file`. 
  `category_id` is from `POST /api/category` or `GET /api/category/:id`
  
  Body: 
  ```
  {
    "category_id": 1,
    "picture": "localhost:3000/api/files/44230068adab9f01e680c25c26b08bc5.png",
    "description": "Description"
  }
  ```

  Response:  
  HTTP Status: 200. 
  ```
  {
      "status": true,
      "data": {
          "id": 2,
          "category_id": 3,
          "picture": "localhost:3000/api/files/44230068adab9f01e680c25c26b08bc5.png",
          "description": "Test",
          "user_id": 1,
          "up_vote_count": 0,
          "down_vote_count": 0,
          "vote_score": 0,
          "updatedAt": "2018-08-27T14:13:56.743Z",
          "createdAt": "2018-08-27T14:13:56.743Z"
      }
  }
  ```
  Response:
  HTTP Status: 400. 
  ```
  {
    "status": false,
    "error": "no_category" // The passed category does not exist
  }
  ```


#### GET `/api/post/:id[?vote&category&user]`
  Get a single post. 
  If `?vote`: return posts with votes
  If `?category`: return posts with `Category`
  If `?user`: return posts with `User`

  Response:
  HTTP Status: 200,  
  ```
  {
    "status": true,
    "data": {
        "id": 3,
        "picture": "localhost:3000/api/files/44230068adab9f01e680c25c26b08bc5.png",
        "category_id": 2,
        "user_id": 1,
        "vote_score": -1,
        "down_vote_count": 1,
        "up_vote_count": 0,
        "createdAt": "2018-08-23T05:10:48.360Z",
        "updatedAt": "2018-08-23T05:16:23.481Z",
        "downVotes": [
            {
                "id": 4,
                "category_id": 2,
                "post_id": 3,
                "user_id": 1,
                "commend": false,
                "createdAt": "2018-08-23T05:11:04.987Z",
                "updatedAt": "2018-08-23T05:16:23.469Z",
                "User": {
                    "id": 1,
                    "first_name": "Test",
                    "last_name": "Again",
                    "hospital": "a",
                    "picture_profile": null
                }
            }
        ],
        "rank": 2,
        "upVotes": [],
        "Category": {
            "id": 2,
            "type": "boy",
            "user_id": 1,
            "createdAt": "2018-08-23T05:10:41.684Z",
            "updatedAt": "2018-08-23T05:10:41.684Z"
        },
        "User": {
            "id": 1,
            "first_name": "Test",
            "last_name": "Again",
            "hospital": "a",
            "picture_profile": null
        }
    }
  }
  ```

#### GET `/api/post?[QUERY]`

  Query posts. valid queries are `limit`, `offset`, `user_id`, `category_id`. `random`, `order`, `direction`, `country`, `vote`, `keyword`, `createdAt`, `updatedAt`, `cfrom`, `cto`,  `not_me`, `user_name`

  `direction`: ASC or DESC  
  `order`: any post field  

  - `random`: Itignores `order` and `direction`  
  - `vote`: It returns the posts with associated `Votes`. 
  - `keword`: It is used to search according to description.
  - `user_name`: It is usued to search posts according to user's user_name, first_name, last_name
  - `cfrom`: It means `createdAt` > `cfrom`. : timestamp or string which new Date() accepts   
  - `cto`: It means `createdAt` < `cto`.  : timestamp or string which new Date() accepts  
  - `createdAt`: timestamp or string which new Date() accepts
  - `updatedAt`: timestamp or string which new Date() accepts
  - `not_me`: exclude the requesting user's posts, when `user_id` is passed `not_me` is ignored. 

  Response:
  HTTP Status: 200
  ```
  {
    "status": true,
    "data": [Post Object]
    ]
  }
  ```

#### GET `/api/post/count?[QUERY]`
  Query posts. valid queries are `user_id`, `category_id`. 

  Response:
  HTTP Status: 200
  ```
  {
    "status": true,
    "data": { "count": Number }
  }
  ```

#### DELETE `/api/post/:id`  
  Delete a single post. 

### Vote API

#### POST `/api/post/:id/vote`
  Place a vote to a post: up or down. 

  `category_vote_count` in the response: Number of votes for same category


  Body  
  ```
  {
    "commend": true or false
  }
  ```

  Response:  

  Http Status: 200. 
  ```
  {
    "status": true,
    "data": {
        "id": 2,
        "picture": "localhost:3000/api/files/44230068adab9f01e680c25c26b08bc5.png",
        "category_id": 1,
        "user_id": 2,
        "createdAt": "2018-08-20T08:37:12.218Z",
        "updatedAt": "2018-08-20T08:37:12.218Z",
        "downVotes": [],
        "category_vote_count": 2, // Total votes for the same category
        "upVotes": [
            {
                "id": 1,
                "category_id": 1,
                "post_id": 2,
                "user_id": 1,
                "commend": true,
                "createdAt": "2018-08-21T08:50:18.309Z",
                "updatedAt": "2018-08-21T08:50:39.030Z",
                "User": {
                    "id": 1,
                    "first_name": "John",
                    "last_name": "test",
                    "hospital": "a",
                    "picture_profile": null
                }
            }
        ]
    }
  }
  ```

  Http Status: 400. 

  ```
  {
    "status": false,
    "error": `already_voted`
  }
  ```

#### POST `/api/post/:id/vote/cancel`
  Cacnel vote 

  Response:  

  Http Status: 200. 
  ```
  {
    "status": true,
    "data": {
        "id": 2,
        "picture": "localhost:3000/api/files/44230068adab9f01e680c25c26b08bc5.png",
        "category_id": 1,
        "user_id": 2,
        "createdAt": "2018-08-20T08:37:12.218Z",
        "updatedAt": "2018-08-20T08:37:12.218Z",
        "downVotes": [],
        "upVotes": [
            {
                "id": 1,
                "category_id": 1,
                "post_id": 2,
                "user_id": 1,
                "commend": true,
                "createdAt": "2018-08-21T08:50:18.309Z",
                "updatedAt": "2018-08-21T08:50:39.030Z",
                "User": {
                    "id": 1,
                    "first_name": "John",
                    "last_name": "test",
                    "hospital": "a",
                    "picture_profile": null
                }
            }
        ]
    }
  }
  ```

  Http Status: 400. 

  ```
  {
    "status": false,
    "error": `already_voted`
  }
  ```

#### POST `/api/category/:id/vote`

 - Vote category

#### POST `/api/category/:id/vote/cancel`
 - Cancel vote for category

### Report API

#### POST `/api/post/:id/vote`
  Place a reprot to a post with a description

  Body  
  ```
  {
    "type": String // One of 'spam', 'violence', 'sex', 'other',
    "description": String// Optional
  }
  ```

### Learn API
#### GET `/api/learn`

Return the list/video data for learn section.

Response:

```
{
    "status": true,
    "data": {
        "institutional_contents": {
            "name": "Institutional Contents",
            "list": [
                {
                    "name": "WATOG",
                    "videos": [
                        {
                            "link": "https://www.youtube.com/embed/dnnqs-rEUx8",
                            "name": "Jean Christophe MARAN - L'intelligence artificielle pour la médecine et la chirurgie"
                        }, ...
                        
                    ]
                },
                ...
            ]
        },
        "sponsored_contents": {
            "name": "Sponsored Contents",
            "list": [
                {
                    "name": "CCD",
                    "videos": [
                        {
                            "link": "https://www.youtube.com/embed/dnnqs-rEUx8",
                            "name": "Jean Christophe MARAN - L'intelligence artificielle pour la médecine et la chirurgie"
                        },
                        ...
                    ]
                },
                ...
            ]
        }
    }
}
```

### Chat API

#### POST `/api/room`.  
  Create a chat room.  
  
  Body. 
  ```
  {
    "category_id": 1,
    "jobs": "OBG",
    "topics": "topic1",
    "description": "Room2 Description",
    "title": "Room2",
    "countries": "USA",
    "members": [1, 2, 3],
    "avatar": "http://xxx.xxx/xxx.jpg"
  }

  ```

  Response
  ```
  {
    "status": true,
    "data": {
        "id": "e63f0c83-cd27-4daa-8163-99a399fbbeb1",
        "user_id": 2,
        "jobs": "OBG",
        "topics": "topic1",
        "title": "Room2",
        "description": "Room2 Description",
        "countries": "USA",
        "is_private": null,
        "is_one_to_one": null,
        "hash": null,
        "avatar": null,
        "background": null,
        "createdAt": "2018-10-03T06:58:08.019Z",
        "updatedAt": "2018-10-03T06:58:08.019Z",
        "category_id": 1,
        "Members": [ // Members
            {
                "id": 5,
                "user_id": 1,
                "room_id": "e63f0c83-cd27-4daa-8163-99a399fbbeb1",
                "removed": false,
                "createdAt": "2018-10-03T06:58:08.032Z",
                "updatedAt": "2018-10-03T06:58:08.032Z",
                "User": {
                    "id": 1,
                    "first_name": "Test0",
                    "last_name": "Last0",
                    "hospital": "Hospital0",
                    "picture_profile": null,
                    "user_name": "test0",
                    "country": "USA"
                }
            },
        ],
        "User": { // Creator
            "id": 2,
            "first_name": "Test1",
            "last_name": "Last1",
            "hospital": "Hospital1",
            "picture_profile": null,
            "user_name": "test1",
            "country": "France"
        }
    }
  }
  ```

#### GET `/api/room/:id`

Get a single room

Response:
```
{
  status: true,
  data: {
    ... Room object,
    message_count: // Message count
  }
}
```

#### PUT `/api/room/:id`.
Edit room.    

Available request body fields: 'jobs', 'topics', 'title', 'description', 'countries', 'is_private', 'avatar', 'background', 'category_id', 'archived', 'member_count_limit'

To archive a room: `archived: true`

Same response with POST

Error response: 

```
  {
    status: false,
    error: 'no_room'
  }
```
Error types: 'no_room', 'invalid_permission'

#### GET `/api/room/my`.  
  Query my rooms.  

  Body. 
  ```
  {
    "status": true,
    "data": [Room]
  }
  ```

#### GET `/api/room?[Query]`.  
  Query rooms.   
  
  Available queries: `user_id`, `title`, `description`

  Body. 
  ```
  {
    "status": true,
    "data": [
        {
            "id": "c3f79091-ec13-492a-9d7f-94a70c075d7e",
            "user_id": 1,
            "category_id": 1,
            "jobs": "obg",
            "title": "test",
            "description": "test room",
            "countries": "USA",
            "is_private": null,
            "is_one_to_one": null,
            "hash": null,
            "avatar": null,
            "background": null,
            "createdAt": "2018-10-02T06:58:07.555Z",
            "updatedAt": "2018-10-02T06:58:07.555Z",
            "Members": [
                {
                    "id": 3,
                    "user_id": 1,
                    "room_id": "c3f79091-ec13-492a-9d7f-94a70c075d7e",
                    "removed": false,
                    "createdAt": "2018-10-02T06:58:07.558Z",
                    "updatedAt": "2018-10-02T06:58:07.558Z",
                    "User": {
                        "id": 1,
                        "first_name": "Test0",
                        "last_name": "Last0",
                        "hospital": "Hospital0",
                        "picture_profile": null,
                        "user_name": "test0",
                        "country": "USA"
                    }
                },
            ],
            "User": { // Creator
                "id": 1,
                "first_name": "Test0",
                "last_name": "Last0",
                "hospital": "Hospital0",
                "picture_profile": null,
                "user_name": "test0",
                "country": "USA"
            }
        }
    ]
  }
  ```

#### GET `/api/room/:id/messages?[Query]`   

Get messages for room  

Query: `from`, `to`, `order`, `direction`, `limit`

- `to`: to return messages created before the timestamp, UTC timestamp by `Date().getTime()`, default: new Date().getTime() 
- `from`: to return messages created after the timestamp, UTC timestamp by `Date().getTime()`, default: new Date().getTime()   

- `direction`: ordering direction, `ASC` or `DESC`, default: `ASC` 
- `order`: ordering field name, default: `createdAt`
- `limit`: limit count
- `text`: query for text

##### Example 
- /api/room/c3f79091-ec13-492a-9d7f-94a70c075d7e/messages?limit=10
 Get last 10 messages for room: `c3f79091-ec13-492a-9d7f-94a70c075d7e`  

- /api/room/c3f79091-ec13-492a-9d7f-94a70c075d7e/messages?text=test&limit=100
 Get last 100 messages for room: `c3f79091-ec13-492a-9d7f-94a70c075d7e`  containing `test`

Body

```
{
    "status": true,
    "data": [
        {
            "id": "e2857217-a2b7-4ad1-961a-90f07b3fc2db",
            "room_id": "c3f79091-ec13-492a-9d7f-94a70c075d7e",
            "member_id": 1,
            "text": "test",
            "is_announcement": null,
            "createdAt": "2018-10-02T16:50:21.363Z",
            "updatedAt": "2018-10-02T16:50:21.363Z",
            "Member": {
                "id": 1,
                "user_id": 2,
                "room_id": "c3f79091-ec13-492a-9d7f-94a70c075d7e",
                "removed": false,
                "createdAt": "2018-10-02T06:58:07.558Z",
                "updatedAt": "2018-10-02T06:58:07.558Z",
                "User": {
                    "id": 2,
                    "first_name": "Test1",
                    "last_name": "Last1",
                    "hospital": "Hospital1",
                    "picture_profile": null,
                    "user_name": "test1",
                    "country": "France"
                }
            }
        }, {...}, {...}        
    ]
}
```
#### POST `/api/room/:id/report`

Report a room

Body:
```
{
  "type": // 'spam', 'violence', 'sex', 'other',
  "description": // can be missed
}
```

Response
```
{
  status:
  data: {
    "type":
    "description":
    "user_id":
    "room_id":    
  }
}
```

#### POST `/api/room/:id/member`

Add member to a room

Request:
```
{
  "user_id": 
}
```
Response: 
```
{
  Member object
}
```

Error codes: `no_room`, `already_joined`, `removed_by_creator`, `already_left`, `member_count_limit_reached`

#### DELETE `/api/room/:id/member`

Kick a member from a room (member's removed field is set to false)

Request:
```
{
  "user_id": 
}
```
Response: 
```
{
  Member object
}
```

#### POST `/api/room/:id/join`

Join a room

Body:
```
{

}
```

Response
```
{
  status: true,
  data: { // Member object

  }
}
```

Error codes: `no_room`, `already_joined`, `removed_by_creator`, `already_left`, `member_count_limit_reached`


#### POST `/api/room/:id/leave`

Leave a room

Body:
```
{

}
```

Response
```
{
  status: true,
  data: { // Member object

  }
}
```

Error codes: `no_room`, `creator_not_allowed`, `not_member`, `already_left`

### Socket.io signals
Socket.io Connection URL: http://xxx:port?token=`JWT string`  

After connected, the client will receive `authenticated` signal

#### Client -> Server

##### `authenticate`: Send JWT token to authenticate

```
{
  token: 
}
```

##### `send_message`: Send a new message
Data  

```
{
 "text": "test3",
  "room_id": "c3f79091-ec13-492a-9d7f-94a70c075d7e"
}
```

#### Server -> Client

#### `authenticated`: Socket.io login success
#### `new_message`: New message is created (Message object)
#### `room_updated`: Room is updated (Room Object)
#### `new_room`: A new room is created (Room Object)
#### `new_member`:  A member added to the room (Member Object)
#### `member_left_room`:  A member left the room (Member Object)

Data  
```
{
  id,
  room_id,
  member_id,
  text,
  is_announcement,
  createdAt:
  updatedAt:
  room_message_count:  // Count of messages in the room
  Member: {
    id,
    user_id,
    room_id,
    removed,
    createdAt,
    updatedAt,
    User: {
      id,
      first_name,
      last_name,
      user_name,
      country,
      picture_profile
    }
  }
}
```
Example: ![Response](https://image.ibb.co/iVQymz/Screen_Shot_2018_10_02_at_9_24_08_PM.png)

## Installed Package Requirements

   sudo npm install nodemon -g
   sudo npm install --save sequelize 
   sudo npm install --save sqlite3
