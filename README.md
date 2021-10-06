# Authentication Boiler Plate

## Running the server

```
npm start
```
#### For nodemon
```
npm run nice
```


## API ROUTES
### POST /signup
Example: 127.0.0.1:3000/api/v1/auth/signup

Request body:

    {
        "name": "Vaibhav",
        "email": "test@testmail.com",
        "password": "test1234",
        "passwordConfirm": "test1234"
    }

### POST /login
Example: 127.0.0.1:3000/api/v1/auth/login
Request body:

    {
        "email": "test@testmail.com",
        "password": "test1234"
    }
    
### GET /logout
Example: 127.0.0.1:3000/api/v1/auth/logout





