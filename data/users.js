import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import {checkId, checkString, getDefaultImage } from '../helpers.js';

//TODO
const getAllUsers = async => {
    return;
}

const getUserById = async (id) => {
    id = await checkId(id, "id");
    
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)});
    if (user === null) throw "No user with that id.";
    user._id = user._id.toString();
    for (let x of user.Bookmarks){
      x = x.toString()
    }

    return user;
}

//returns user with that name, returns null if no user exists.
const getUserByName = async (name) => {
    name = await checkString(name, "name");
    
    const userCollection = await users();
    const user = await userCollection.findOne({Username: { $regex: "(?i)" + name + "(?-i)"}});
    if (user === null) return null;
    user._id = user._id.toString();
    for (let x of user.Bookmarks){
      x = x.toString()
    }
    return user;
}

//When Creating a new account, users will be prompted with a name, a password, and to reconfirm their password
//Usernames are a minimum of 3 chars, max of 32 chars, cannot contain spaces or any characters that aren't letters, numbers or "_"
//Passwords are a minimum of 8 characters, max of 64, cannot contain spaces, and must have 1 lowercase letter, 1 uppercase letter, 1 special character, and 1 number.
//Returns User as an object
const createUser = async (username, password, ) => {    
    await checkString(username, "username");
    if(username.includes(" ")) throw "Error: Username cannot contain spaces!";
    for (let x of username){
        let y = x.charCodeAt(0);
        if (((y >= 0) && (y < 48)) || ((y > 57) && (y < 65)) || ((y > 90) && (y < 97)) || (y > 122) ) throw "Error: Username can only contain letters, numbers, or underscores"
    }

    //Checks if name exists (case insensitive)
    let existingUser = await getUserByName(username);
    if (existingUser !== null) throw 'Error: Username is taken';
    if(username.length < 3) throw "Error: Username is too short (must be above 3 characters)!";
    if(username.length > 32) throw "Error: Username is too long (must be below 32 characters)!";

    //validates password
    await checkString(password, "password");
    if(username.includes(" ")) throw "Error: Password cannot contain spaces!";

    if(username.length < 8) throw "Error: Password is too short (must be above 8 characters)!";
    if(username.length > 64) throw "Error: Password is too long (must be below 64 characters)!";

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

    if(!hasNum || !hasLower || !hasUpper || !hasSpecial) throw "Error: Password must contain 1 lowercase letter, 1 uppercase letter, 1 special character, and 1 number";

    //TODO: ACTUALLY HASH THE PASSWORD
    let newUser = {
        "Username": username,
        "HashedPassword": password,
        "Bio": "",
        "ProfilePicture": getDefaultImage(),
        "Bookmarks": [],
        "WritingScore": 0
    }

    const userCollection = await users();
    const insertInfo = await userCollection.insertOne(newUser);

    if (!insertInfo.acknowledged || !insertInfo.insertedId){
        throw "could not add user";
    }

    const newId = insertInfo.insertedId.toString();

    const user = await getUserById(newId);
    return user;
}

//TODO
const deleteUser = async(id) => {
    return;
}

export default {getAllUsers, getUserById, getUserByName, createUser, deleteUser}