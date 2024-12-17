import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import {checkId, checkString, getDefaultBio, getDefaultImage } from '../helpers.js';
import bcrypt from 'bcrypt';

//TODO: test if works
const getAllUsers = async () => {
    const userCollection = await users();

    const userList = await userCollection.find({ }, {projection: {"HashedPassword":false}} ).toArray();
    if(!userList) throw new Error("Error: Could not get all Users");
    userList = userList.map((element) => {
        element._id = element._id.toString();
        for (let x of element.Bookmarks){
            x = x.toString();
        }
        return element;
    });
    return userList;
}

//Returns user with matching id WITHOUT PASSWORD
const getUserById = async (id) => {
    id = await checkId(id, "id");
    
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)}, {projection: {"HashedPassword":false}});
    if (user === null) throw new Error ("No user with that id.");
    user._id = user._id.toString();
    for (let x of user.Bookmarks){
      x = x.toString()
    }

    return user;
}

//returns user with that name WITHOUT PASSWORD!!!
const getUserByName = async (name) => {
    name = checkString(name, "name");
    
    const userCollection = await users();
    const user = await userCollection.findOne({Username: { $regex: "(?i)" + name + "(?-i)"}}, {projection: {"HashedPassword":false}});
    if (user === null) return new Error ("No user with that name");
    user._id = user._id.toString();
    for (let x of user.Bookmarks){
      x = x.toString()
    }
    return user;
}

//When Creating a new account, users will be prompted with a name, a password, and to reconfirm their password
//Usernames are a minimum of 3 chars, max of 32 chars, cannot contain spaces or any characters that aren't letters, numbers or "_"
//Passwords are a minimum of 8 characters, max of 64, cannot contain spaces, and must have 1 lowercase letter, 1 uppercase letter, 1 special character, and 1 number.
//Returns username and password.
const createUser = async (username, password) => {    
    checkString(username, "username");
    if(username.includes(" ")) throw new Error ("Error: Username cannot contain spaces!");
    for (let x of username){
        let y = x.charCodeAt(0);
        if (((y >= 0) && (y < 48)) || ((y > 57) && (y < 65)) || ((y > 90) && (y < 97)) || (y > 122) ) throw new Error("Error: Username can only contain letters, numbers, or underscores")
    }

    //Checks if name exists (case insensitive)
    const userCollection = await users();
    const existingUser = await userCollection.findOne({Username: { $regex: "(?i)" + username + "(?-i)"}}, {projection: {"HashedPassword":false}});
    if (existingUser !== null) throw new Error ('Error: Username is taken');
    if(username.length < 3) throw new Error ("Error: Username is too short (must be between 3-32 characters)!");
    if(username.length > 32) throw new Error("Error: Username is too long (must be between 3-32 characters)!");

    //validates password
    checkString(password, "password");
    if(password.includes(" ")) throw new Error ("Error: Password cannot contain spaces!");

    if(password.length < 8) throw new Error ("Error: Password is too short (must be between 8-64 characters)!");
    if(password.length > 64) throw new Error ("Error: Password is too long (must be between 8-64 characters)!");

    let hasNum = false;
    let hasLower = false;
    let hasUpper = false;
    let hasSpecial = false;
    
    for(let x of password){
        let y = x.charCodeAt(0);
        if((y > 47) && (y < 58)) hasNum = true;

        if((y > 96) && (y < 123)) hasLower = true;

        if((y > 64) && (y < 91)) hasUpper = true;

        if(((y > 32) && (y < 48)) || ((y > 57) && (y < 65)) || ((y > 90) && (y < 97)) || (y > 122)) hasSpecial = true;
    }

    if(!hasNum || !hasLower || !hasUpper || !hasSpecial) throw new Error("Error: Password must contain 1 lowercase letter, 1 uppercase letter, 1 special character, and 1 number");

    let hashedPassword = await bcrypt.hash(password, 16); 

    let newUser = {
        "Username": username,
        "HashedPassword": hashedPassword,
        "Bio": getDefaultBio(),
        "ProfilePicture": getDefaultImage(),
        "Bookmarks": [],
        "WritingScore": 0
    }

    const insertInfo = await userCollection.insertOne(newUser);

    if (!insertInfo.acknowledged || !insertInfo.insertedId){
        throw new Error ("Internal Server Error");
    }

    const newId = insertInfo.insertedId.toString();
    const user = await getUserById(newId);

    return user;
}

//TODO: test
const signInUser = async(username, password) =>{
    //validate Username
    try{
        checkString(username, "username");
    } catch {
        throw new Error ("Either Username or Password is Invalid.")
    }

    if(username.includes(" ")) throw new Error ("Either Username or Password is Invalid.");
    for (let x of username){
        let y = x.charCodeAt(0);
        if (((y >= 0) && (y < 48)) || ((y > 57) && (y < 65)) || ((y > 90) && (y < 97)) || (y > 122) ) throw new Error ("Either Username or Password is Invalid.");
    }
    if(username.length < 3) throw new Error ("Either Username or Password is Invalid.");
    if(username.length > 32) throw new Error("Either Username or Password is Invalid.");

    //Validate Password
    try{
        checkString(password, "password");
    } catch {
        throw new Error("Either Username or Password is Invalid.");
    }
    if(password.includes(" ")) throw new Error ("Error: Password cannot contain spaces!");

    if(password.length < 8) throw new Error ("Either Username or Password is Invalid.");
    if(password.length > 64) throw new Error ("Either Username or Password is Invalid.");

    let hasNum = false;
    let hasLower = false;
    let hasUpper = false;
    let hasSpecial = false;
    
    for(let x of password){
        let y = x.charCodeAt(0);
        if((y > 47) && (y < 58)) hasNum = true;

        if((y > 96) && (y < 123)) hasLower = true;

        if((y > 64) && (y < 91)) hasUpper = true;

        if(((y > 32) && (y < 48)) || ((y > 57) && (y < 65)) || ((y > 90) && (y < 97)) || (y > 122)) hasSpecial = true;
    }

    if(!hasNum || !hasLower || !hasUpper || !hasSpecial) throw new Error("Either Username or Password is Invalid.");

    const userCollection = await users();
    const user = await userCollection.findOne({Username: { $regex: "(?i)" + username + "(?-i)"}});
    if(user === null) throw "Either the Username or password is invalid";

    let comparePassword = false;

    try{
        comparePassword = await bcrypt.compare(password, user.HashedPassword);
    } catch (e){}

    if(!comparePassword) throw "Either the Username or Password is invalid";

    for(let x of user.Bookmarks){
        x = x.toString();
    }

    return {_id: user._id.toString(), Username: user.Username, Bio: user.Bio, ProfilePicture: user.ProfilePicture, Bookmarks: user.Bookmarks, WritingScore: user.WritingScore}
}

const updateUserProfile = async (id, updateData) => {
    id = await checkId(id, "id");
    const userCollection = await users();

    const updateDoc = {};

    if (typeof updateData.profilePicture === 'string') {
        updateDoc.ProfilePicture = updateData.profilePicture;
    } else if (updateData.profilePicture !== undefined) {
        throw new Error("Profile picture must be a valid path");
    }

    if (updateData.bio !== undefined) {
        updateData.bio = checkString(updateData.bio, "Bio", true);
        if (updateData.bio.length > 500) {
            throw new Error("Bio cannot exceed 500 characters");
        }
        if (updateData.bio === ""){
            updateData.bio = getDefaultBio();
        }

        updateDoc.Bio = updateData.bio;
    }

    if (updateData.writingScore !== undefined) {
        updateDoc.WritingScore = parseFloat(updateData.writingScore.toFixed(2));
    }

    const updateResult = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateDoc },
        { returnDocument: 'after', projection: { HashedPassword: 0 } }
    );

    if (!updateResult) {
        throw new Error("Could not update user profile");
    }

    return {
        _id: updateResult._id.toString(),
        Username: updateResult.Username,
        Bio: updateResult.Bio,
        ProfilePicture: updateResult.ProfilePicture,
        WritingScore: updateResult.WritingScore
    };
}


//TODO
const deleteUser = async(id) => {


    return;
}

export default {getAllUsers, getUserById, getUserByName, createUser, deleteUser, signInUser, updateUserProfile}