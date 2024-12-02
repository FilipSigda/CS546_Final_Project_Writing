import express from 'express';
import configRoutes from './routes/index.js';

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

configRoutes(app);

app.listen(3000,() =>{
    console.log("Servers up.");
});
