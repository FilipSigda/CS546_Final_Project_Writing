import { invites } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as users from './users.js';
import * as groups from './groups.js';
import helpers from '../helpers.js';

//Checks if the invite already exists.
const inviteExists = async (sender, receiver, type, storyOrGroupId) => {
    try{
        helpers.checkString(type);
        if(type !== "group" || type !== "user"){
            throw "type must be group or user"
        }
    }
    catch(e){
        throw new Error("inviteExists type: " + e);
    }

    try{
        helpers.checkString(sender);
        users.getUserById(sender);
    }
    catch(e){
        throw new Error("inviteExists sender: " + e);
    }

    try{
        helpers.checkString(receiver);
        users.getUserById(receiver);
    }
    catch(e){
        throw new Error("inviteExists receiver: " + e);
    }

    try{
        helpers.checkString(storyOrGroupId);
        if(type === "user"){
            users.getUserById(storyOrGroupId);
        }
        else{
            groups.getGroupById(storyOrGroupId);
        }
    }
    catch(e){
        throw new Error("inviteExists storyOrGroupId: " + e);
    }

    const db = await invites();
    let possibleInvite = await db.findOne({sender: new ObjectId(sender), receiver: new ObjectId(receiver), type: type, storyOrGroupId: new ObjectId(storyOrGroupId)}).toArray();
    if (possibleInvite.length === 0){
        return false;
    }
    return true;
}

//Creates an invite.
const createInvite = async (sender, receiver, type, storyOrGroupId) => {
    try{
        if (inviteExists(sender, receiver, type, storyOrGroupId)){
            throw 'Invite exists';
        }
    }
    catch(e){
        throw new Error("createInvite: " + e);
    }

    const db = await invites();

    let newInvite = {
        Sender: new ObjectId(sender),
        Receiver: new ObjectId(receiver),
        Type: type,
        StoryOrGroupId: new ObjectId(storyOrGroupId)
    }

    const insertInfo = await db.insertOne(newInvite);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw new Error("createInvite: Could not create invite");
    }

    newInvite = await db.findOne({_id: insertInfo.insertedId});
    newInvite._id = newInvite._id.toString();
    newInvite.Sender = newInvite.Sender.toString();
    newInvite.Receiver = newInvite.Receiver.toString();
    newInvite.StoryOrGroupId = newInvite.StoryOrGroupId.toString();
    return newInvite;
}

//Removes an invite.
const deleteInvite = async (id) => {
    try{
        id = helpers.checkId(id, "id");
    }
    catch(e){
        throw new Error("deleteInvite: " + e);
    }

    const db = await invites();
    let deleteInfo = await db.deleteOne({_id: new ObjectId(id)});

    if(deleteInfo.deletedCount === 0){
        throw new Error("deleteInvite: Could not delete invite");
    }
    return id;
}

//Gets specific type invites for a user.
const getTypeInvites = async (userId, type) => {
    try{
        helpers.checkString(type);
        if(type !== "group" || type !== "user"){
            throw "type must be group or user"
        }
    }
    catch(e){
        throw new Error("getTypeInvites type: " + e);
    }

    try{
        helpers.checkString(userId);
        users.getUserById(userId);
    }
    catch(e){
        throw new Error("getTypeInvites userId: " + e);
    }

    const db = await invites();
    let typeInvites = await db.find({Receiver: new ObjectId(userId), Type: type}).project({'_id': 1, 'Sender': 1, 'StoryOrGroupId': 1}).toArray();

    return typeInvites;
}

export {createInvite, deleteInvite, getTypeInvites};