import users from "./users.js";
import stories from './stories.js';

const constructorMethod = (app) => {
    app.use("/users",users);
    app.use("/stories",stories);

    app.use('*',(req,res) => {
        res.status(404).json({error:"Route not found"});
    });
}

export default constructorMethod;