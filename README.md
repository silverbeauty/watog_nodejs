# Watog API

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

## Installed Package
   npm install --save sequelize 
   npm install --save sqlite3