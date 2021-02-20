if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}


const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const Mo = require('method-override')
const path = require('path')
const mongo = require('mongoose')
const ejsmate = require('ejs-mate')
const apperror = require('./utils/apperror');
const joi = require('joi')
const passport = require('passport');
const passportlocal = require('passport-local');
const user = require('./models/user');
const sanitize = require('express-mongo-sanitize')
const { campschema, reviewschema } = require('./schemas.js');

const campground_router = require('./routes/camp');
const review_router = require('./routes/reviews');
const user_router = require('./routes/users')


const MongoDBStore = require("connect-mongo")(session);

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongo.connect(dbUrl, {
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
});

const db = mongo.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.engine('ejs',ejsmate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended: true}));
app.use(Mo('_method'))
app.use(express.static('public'))
app.use(flash())
app.use(sanitize())

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 3600
});

store.on("error", function(e){

})

const sessionconfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionconfig))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportlocal(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



app.use((req,res,next ) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

app.get('/',(req,res) => {
    res.render('home');
})

app.use('/camps',campground_router)
app.use('/camps/:id/review', review_router)
app.use('/users', user_router)

app.all('*', (req,res,next)=>{
    next(new apperror('Page Not Found', 404))
})

app.use((err,req,res,next) => {
    const { status = 500, message = 'Wrong'} = err;
    //console.log(message);
    res.status(status).render('error',{err});
    //res.send("CANT DO IT BRO. I JUST CANT (˃̣̣̥⌓˂̣̣̥ )")
})



app.listen(3000,()=>{
    console.log("Working");
}) 