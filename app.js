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

//prevents signed in users from signing up again
app.use('/users/signinuser', (req, res, next) => {
    if((req.method === "GET") && (req.originalUrl === '/users/signinuser')){
         if(!req.session.user){
              next();
         } else{
              res.redirect('/users/' + req.session.user._id);
         }
    } else{
         next();
    }
});

//Prevents signed in users from signing in again.
app.use('/users/signupuser', (req, res, next) => {
    if((req.method === "GET") && (req.originalUrl === '/users/signupuser')){
         if(!req.session.user){
              next();
         } else{
              res.redirect('/users/' + req.session.user._id);
         }
    } else{
         next();
    }
});

//Prevents users who aren't signed in from signing out
app.use('/users/signoutuser', (req, res, next) => {
     if(req.originalUrl === '/users/signoutuser'){
          if(!req.session.user) res.redirect('/users/signinuser');
          else{
               next();
          }
     }
});

//Prevent users who aren't signed in from editing a profile
//Prevents signed in users from editing profiles that aren't their own
app.use('/users/editprofile/:id', (req, res, next) => {
     if((req.method === "GET") && (req.originalUrl === '/users/editprofile/' + req.params.id)){
          if(!req.session.user) res.redirect('/users/' + req.params.id);
          else if(req.session.user._id === req.params.id) next();
          else res.redirect('/users/' + req.params.id);

     }
});
configRoutes(app);

app.listen(3000,() =>{
    console.log("Servers up.");
});