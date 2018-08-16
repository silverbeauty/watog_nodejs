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
   
  POST `/api/users`  
   
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

### Login.
   
   POST `/api/users/login`  
   
   Body: 
   ```
   {
       "email": "user@email.com",
       "password": "pwd"
   }
   ```

   Response:

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

## Installed Package
   npm install --save sequelize 
   npm install --save sqlite3