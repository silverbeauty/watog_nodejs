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

   }
   ```

## Installed Package
   npm install --save sequelize 
   npm install --save sqlite3