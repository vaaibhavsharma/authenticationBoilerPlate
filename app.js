const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const authRouter = require('./routes/authRoutes')

// MIDDLEWARES ///////////////////////////////////////////////////////
const app = express();
app.use(helmet())
app.use(express.json({limit: '10kb'})); // applies to every single request (req,re,next())
app.use(cookieParser())
app.use(mongoSanitize());
app.use(xss())

const limiter = rateLimit({
    max: 100,
    windowMs: 60*60*1000,
    message: 'Too many request Baby!'
})

app.use('/api',limiter);

const fourOfour = (req,res,next) => {
    res.status(404).json({
        status: "404"
    })
    next();
}

// ROUTERS ////////////////////////////////////////////////////////////

app.use('/api/v1/auth', authRouter)



app.all('*', fourOfour)

module.exports = app;
