import users from "./users.js";
import stories from './stories.js';
import groups from './groups.js';
import feed from './feed.js';

const constructorMethod = (app) => {
    app.use("/",feed);
    app.use("/users",users);
    app.use("/stories",stories);
    app.use("/groups",groups);

    app.use('*',(req,res) => {
        //res.status(301).redirect("/");
        res.status(404).json({error:"Route not found"});
    });
}

export default constructorMethod;