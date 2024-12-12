import { Router } from "express";
import userData from '../data/user.js';
import { checkString } from "../helpers.js";


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

})

//Sign in User Route
router
.route("/signinuser")
.get(async (req, res)=> {
    res.render('../views/signinuser', {title: "Sign In"});
})
//TODO: Takes and validates form input. redirects to user profile once finished.
.post(async (req, res) => {


})

//TEST: Displays the profile of the given user
router
.route("/:username")
.get(async (req, res)=>{
    let username = req.params.username;
    let user;

    try{
        username = checkString(username, "Username", false);
    } catch(e){
        res.status(400).render("../views/user", {title: username, notFound: e.message});
        return;
    }

    try{
        user = await userData.getUserByName(username);
    } catch (e) {
        res.status(404).render("../views/user", {title: user.Username, notFound: e.message});
        return;
    }

    res.render("../views/user", {title: user.Username, Username: user.Username, Bio: user.Bio, ProfilePicture: user.ProfilePicture, Bookmarks: user.Bookmarks, WritingScore: user.WritingScore});
});

export default router;