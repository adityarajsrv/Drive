const express = require('express');
const app = express();
const userRouter = require('./routes/user.routes')
const indexRouter = require('./routes/index.routes')
const dotenv = require('dotenv')
dotenv.config()
const connectToDB = require('./config/db')
const cookieParser = require('cookie-parser')
const path = require('path')
connectToDB();

app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/', indexRouter)
app.use('/user', userRouter)

app.listen(3000, ()=>{
    console.log('Server is running on port http://localhost:3000')
})