const dotenv = require('dotenv')
dotenv.config({ path: './.env' })
const express = require('express');
const cookieSession = require('cookie-session')
const expressSession = require('express-session')

const connectDB = require('./config/db')
const keys = require('./config/keys')
const passport = require('passport')



connectDB()

const app = express()
//middleware
app.use(express.json())
// app.use(cookieSession({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: [keys.cookieKey] }))
app.use(
    expressSession({
        secret: keys.cookieKey, // Use a secure secret
        resave: false, // Don't resave session if it hasn't been modified
        saveUninitialized: false, // Don't save uninitialized sessions
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000, // Session duration (30 days)
            secure: false, // Set `true` in production with HTTPS
        },
    })
);
app.use(passport.initialize())
app.use(passport.session())

const authentication = require('./routes/Authentication')

app.use('/api/v1/auth', authentication)


app.listen('4500', () => console.log('Server is connected'))