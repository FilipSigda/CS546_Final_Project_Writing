import { Router } from "express";
import userData from '../data/users.js';
import { checkId } from "../helpers.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import xss from 'xss';


const router = Router();

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
    
    if(!xss(req.body["username"])) missing.push("Username");
    if(!xss(req.body["password"])) missing.push("Password");

    if(missing.length > 0){
        res.status(400).render('../views/signupuser', {title: "Sign Up", missing: missing});
        return;
    }

    let user = null;

    try {
        user = await userData.createUser(xss(req.body["username"]), xss(req.body["password"]));
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
    
    if(!xss(req.body["user_name"])) missing.push("Username");
    if(!xss(req.body["password"])) missing.push("Password");

    if(missing.length > 0){
        res.status(400).render('../views/signinuser', {title: "Sign In", missing: missing});
        return;
    }

    let user = null;

    try {
        user = await userData.signInUser(xss(req.body["user_name"]), xss(req.body["password"]));
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

router
.route('/signoutuser')
.get(async (req, res) => {
    //code here for GET
    req.session.destroy();
  
    res.redirect('/');
});

// displays profile of given user
router
.route("/:id")
.get(async (req, res)=>{
    let id = xss(req.params.id);
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

    // add a flag to check if the logged-in user is viewing their own profile
    const canEdit = xss(req.session.user) && xss(req.session.user._id) === id;

    res.render("../views/user", {
        title: user.Username, 
        Username: user.Username, 
        Bio: user.Bio, 
        ProfilePicture: user.ProfilePicture, 
        Bookmarks: user.Bookmarks, 
        WritingScore: user.WritingScore,
        _id: user._id,
        canEdit: canEdit
    }); 
});


// configure multer file upload and storage for pfp submissions
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile-pictures');
        
        // create directory if it doesnt exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // generates unique filename using timestamp and original file extension
        const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = path.extname(file.originalname);
        cb(null, `${uniquePrefix}${extension}`);
    }
});

// validate image uploads
const fileFilter = (req, file, cb) => {
    // accept certain file formats only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// configure multer upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    }
});

// profile edit route
router
.route("/editprofile/:id")
.get(async (req, res) => {
    // Ensure user is logged in
    if (!xss(req.session.user)) {
        return res.redirect('/users/signinuser');
    }

    // Ensure user can only edit their own profile
    if (xss(req.params.id) !== xss(req.session.user._id)) {
        throw new Error("You are not authorized to edit this profile");
    }
    
    try {
        const user = await userData.getUserById(xss(req.params.id));
        res.render('../views/editprofile', {
            title: "Edit Profile", 
            user: user
        });
    } catch (e) {
        throw new Error("The user profile could not be found");
    }
})
.post(upload.single('profilePicture'), async (req, res) => {
    // Ensure user is logged in
    if (!xss(req.session.user)) {
        return res.redirect('/users/signinuser');
    }

    // Ensure user can only edit their own profile
    if (xss(req.params.id) !== xss(req.session.user._id)) {
        throw new Error("You are not authorized to edit this profile");
    }

    try {
        const updateData = {
            bio: xss(req.body.bio)
        };

        // profile picture upload
        if (xss(req.file)) {
            // constructs path
            updateData.profilePicture = `/uploads/profile-pictures/${xss(req.file.filename)}`;
        }

        const updatedUser = await userData.updateUserProfile(xss(req.params.id), updateData);

        req.session.user = updatedUser;
        res.redirect('/users/' + updatedUser._id);
    } catch (e) {
        // if update fails, delete the uploaded file and throw the error
        if (xss(req.file)) {
            try {
                fs.unlinkSync(xss(req.file.path));
            } catch (unlinkError) {
                console.error('Error removing uploaded file:', unlinkError);
            }
        }

        throw new Error("upload failed");

    }
});



export default router;