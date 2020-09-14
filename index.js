const express=require('express')
const mongoose=require('mongoose')
const passport = require('passport')
const keys = require('./config/keys')
const cookieParser=require('cookie-parser')
const session=require('express-session')
const exphbs=require('express-handlebars')

const auth=require('./routes/auth')
const index=require('./routes/index')
require('./models/User')
require('./config/passport')(passport)

const app=express()
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:true}))


mongoose.connect(keys.mongoURI,{
    useUnifiedTopology:true,
    useNewUrlParser:true
})
let db=mongoose.connection;

db.once('open', ()=>{
    console.log('Connected to MongoDB!!')
})

db.on('error', (err)=>{
    console.log('DB Error!!!')
})

app.set('view engine','handlebars')
app.engine('handlebars',exphbs({
    defaultLayout:'main'
}))

app.use(cookieParser())
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:false
}))



app.use(passport.initialize())
app.use(passport.session())


app.use((req,res,next)=>{
    res.locals.user=req.user||null
    next()
})

app.use('/',index)
app.use('/auth',auth)

const port=process.env.PORT|| 5000

app.listen(port,()=>{
    console.log(`Server started at ${port}`)
})