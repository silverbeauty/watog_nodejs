# Watog API

## How to run
### Dev  
`npm run start:dev`
### Production
`npm start`
### Required Env Variables
#### JWT_SECRET

## Endpoints

### Sign Up. 
   
  POST `/api/user`  
   
  Body: 
  ```
  {
    "email": "user@email.com",
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
       "email": "user@email.com",
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
- GET `/user/me`  
  Return own profile by JWT  

  Response:  

  HTTP Status: 200  
  ```  
  {
    "status": true,
    "data": User Object
  }
  ```  
- GET `/user?[QUERY]`  
  Query user with [QUERY] - QUERY can be missing  

  Query:  
  ['limit', 'offset', 'first_name', 'last_name', 'country', 'hospital']  

  Response:  

  HTTP Status: 200  
  ```  
  {
    "status": true,
    "data": [User Object]
  }
  ``` 
- GET `/user/:id`
  Return a user with id  

  Response:  

  HTTP Status: 200  
  ```  
  {
    "status": true,
    "data": User Object
  }
  ```  

### File APIs
- GET `/api/file/:id`
  Return file in `files/:id`

- POST `/api/file`
  Upload file 

  Header:  
  
  ```
  "Content-Type": "application/json"
  ```

  Body:  

  ```
  "file": File Object
  ```

- GET `/api/file/verify/:id`
  Return proof of status doc in `files/:id`

- POST `/api/file/verify`
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
- POST `/api/category`

  Body: 
  ```
  { "type": String }
  ```

  Response:  
  HTTP Status: 200. 
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
- GET `/api/category/:id`

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

- GET `/api/category?[QUERY]`
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
- POST `/api/post`
  Create a single post. 
  `picture` should be get by `API host` + `/api/files` + returned id from POST `/api/file`. 

  Body: 
  ```
  {
    "category_id": 1,
    "picture": "localhost:3000/api/files/44230068adab9f01e680c25c26b08bc5.png"
  }
  ```

  Response:  
  HTTP Status: 200. 
  ```
  {
    "status": true,
    "data": {
        "id": 2,
        "category_id": 1,
        "picture": "localhost:3000/api/files/44230068adab9f01e680c25c26b08bc5.png",
        "user_id": 2,
        "updatedAt": "2018-08-20T08:37:12.218Z",
        "createdAt": "2018-08-20T08:37:12.218Z"
    }
  }
  ```
- GET `/api/post/:id`
  Get a single post. 

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

- GET `/api/post?[QUERY]`
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

## Installed Package Requierement

   sudo npm install nodemon -g
   npm install --save sequelize 
   npm install --save sqlite3