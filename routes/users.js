import { Router } from "express";
import userData from '../data/users.js';
import { checkId } from "../helpers.js";


const router = Router();

//TODO: Gets a page where you can search and look at all users
router.route("/")
.get(async (req,res) => {
    res.status(200).json({res:"Temporary Response"});
});

//Sign up route
router
.route("/signupuser")
.get(async (req, res)=> {
    res.render('../views/signupuser', {title: "Sign Up"});
})
//TODO: Takes and validates form input. Then signs them up and redirects to the user profile once finished.
.post(async (req, res) => {
    let missing = [];
    
    if(!req.body["username"]) missing.push("Username");
    if(!req.body["password"]) missing.push("Password");

    if(missing.length > 0){
        res.status(400).render('../views/signupuser', {title: "Sign Up", missing: missing});
        return;
    }

    let user = null;

    try {
        user = await userData.createUser(req.body["username"], req.body["password"]);
    } catch (e){
        if(e.message === "Internal Server Error"){
            res.status(500).render('../views/signupuser', {title: "Sign Up", error: e.message});
            return;
        }else {
            res.status(400).render('../views/signupuser', {title: "Sign Up", error: e.message});
            return;
        }
    }

    req.session.user = user;

    res.redirect('/users/' + user._id);
})

//Sign in User Route
router
.route("/signinuser")
.get(async (req, res)=> {
    res.render('../views/signinuser', {title: "Sign In"});
})
//TODO: Takes and validates form input. redirects to user profile once finished.
.post(async (req, res) => {
    let missing = [];
    
    if(!req.body["user_name"]) missing.push("Username");
    if(!req.body["password"]) missing.push("Password");

    if(missing.length > 0){
        res.status(400).render('../views/signinuser', {title: "Sign In", missing: missing});
        return;
    }

    let user = null;

    try {
        user = await userData.signInUser(req.body["user_name"], req.body["password"]);
    } catch (e){
        res.status(400).render('../views/signinuser', {title: "Sign In", error: e.message});
        return;
    }

    if (user == null){
        res.status().render('../views/signinuser', {title: "Sign In", error: "Either the Username or Password is invalid"});
        return;
    }

    req.session.user = user;

    res.redirect('/users/' + user._id)
})

//TEST: Displays the profile of the given user
router
.route("/:id")
.get(async (req, res)=>{
    let id = req.params.id;
    let user;

    try{
        id = await checkId(id, "Id", false);
    } catch(e){
        res.status(400).render("../views/user", {title: id, notFound: e.message});
        return;
    }

    try{
        user = await userData.getUserById(id);
    } catch (e) {
        res.status(404).render("../views/user", {title: user.Username, notFound: e.message});
        return;
    }

    res.render("../views/user", {title: user.Username, Username: user.Username, Bio: user.Bio, ProfilePicture: user.ProfilePicture, Bookmarks: user.Bookmarks, WritingScore: user.WritingScore}); 
});

export default router;