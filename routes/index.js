import users from "./users.js";
import stories from './stories.js';
import groups from './groups.js';
import home from './home.js';

const constructorMethod = (app) => {
    app.use("/", home);
    app.use("/users",users);
    app.use("/stories",stories);
    app.use("/groups",groups);

    app.use('*',(req,res) => {
        res.status(404).json({error:"Route not found"});
    });
}

export default constructorMethod;