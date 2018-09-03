# Watog API

## How to run
### Dev  
`npm run start:dev`
### Production
`npm start`
### Required Env Variables

Set these env variables in .env file at the root level of the project

#### PORT=3000
#### TWILIO_SID=***
#### TWILIO_AUTH_TOKEN=***
#### TWILIO_FROM=***
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


#### GET `/user/me`  

  Edit own profile by JWT  

  Response:  

  HTTP Status: 200  
  ```  
  {
    "status": true,
    "data": User Object
  }
  ```

#### GET `/user?[QUERY]`  
  Query users with [QUERY] - QUERY can be missing  

  Query:  
  `limit`, `offset`, `first_name`, `last_name`, `country`, `hospital`, `name`, `order`, `direction`  

  - `order`: one of ['vote_score', 'up_vote_count', 'down_vote_count', 'createdAt', 'updatedAt']
  - `direction`: one of ['DESC', 'ASC']

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
  { "type": String, "description": String(Optinal) }
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
  Query posts. valid queries are `limit`, `offset`, `user_id`, `category_id`. 


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


## Installed Package Requirements

   sudo npm install nodemon -g
   sudo npm install --save sequelize 
   sudo npm install --save sqlite3
