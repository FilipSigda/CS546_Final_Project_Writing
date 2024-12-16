import express from 'express';
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import session from 'express-session';

//copied from lab 8. Might have to rework depending on our requirements
const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    if(req.body && req.body._method){
        req.method = req.body._method;
        delete req.body._method;
    }

    next();
}

//setup express
let app = express();

app.use(express.json());
app.use('/public',express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars',exphbs.engine({defaultLayout:'main'}));
app.set('view engine','handlebars');

//Creates Session for logged in users
app.use(session({

    name: 'AuthenticationState',
  
    secret: 'some secret string!',
  
    resave: false,
  
    saveUninitialized: false
  
}));

app.use('/', (req, res, next) => {
    if(!req.session.user){
        app.locals.signedIn = false;
        app.locals.profilePicture = undefined;
        app.locals.name = undefined;
        app.locals.id = undefined;
    } else {
        app.locals.signedIn = true;
        app.locals.profilePicture = req.session.user.ProfilePicture;
        app.locals.name = req.session.user.Username
        app.locals.id = req.session.user._id
    }
    next();
});

app.use('/users/signinuser', (req, res, next) => {
    if((req.originalUrl === '/users/signinuser')){
         if(!req.session.user){
              next();
         } else{
              res.redirect('/users/' + req.session.user._id);
         }
    } else{
         next();
    }
});

app.use('/users/signupuser', (req, res, next) => {
    if((req.originalUrl === '/users/signupuser')){
         if(!req.session.user){
              next();
         } else{
              res.redirect('/users/' + req.session.user._id);
         }
    } else{
         next();
    }
});

configRoutes(app);

app.listen(3000,() =>{
    console.log("Servers up.");
});