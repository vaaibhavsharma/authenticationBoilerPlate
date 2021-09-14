const express = require('express');
const auth = require('../controllers/authController');

const userRouter = express.Router();

// TWO FUNCTIONS
// isLoggedIn -> Check if user is logged in (if logged in simply add userID in req)
// protect -> not access if user is not logged in

userRouter.get('/working', auth.isLoggedIn, auth.working)
userRouter.post('/signup', auth.signup)
userRouter.post('/login', auth.login)
userRouter.get('/logout', auth.logout)


module.exports = userRouter;
