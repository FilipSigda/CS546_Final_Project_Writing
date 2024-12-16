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
app.use('public',express.static('public'));
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

configRoutes(app);

app.listen(3000,() =>{
    console.log("Servers up.");
});