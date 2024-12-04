import { groups } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import helpers from '../helpers.js';

// get all groups
const getAllGroups = async () => {
    const groupCollection = await groups();
    const allGroups = await groupCollection.find({}).toArray();
    
    return allGroups.map(group => {
        group._id = group._id.toString();
        group.Members = group.Members.map(member => member.toString());
        group.Stories = group.Stories.map(story => story.toString());
        return group;
    });
};

// get group by ID
const getGroupById = async (id) => {
    id = helpers.checkId(id, "id");
    
    const groupCollection = await groups();
    const group = await groupCollection.findOne({ _id: { $eq: new ObjectId(id) } });
    
    if (group === null) throw "No group with that id.";
    
    group._id = group._id.toString();
    group.Members = group.Members.map(member => member.toString());
    group.Stories = group.Stories.map(story => story.toString());
    
    return group;
};

// get group by name (case-insensitive)
const getGroupByName = async (name) => {
    name = helpers.checkString(name, "name");
    
    const groupCollection = await groups();
    const group = await groupCollection.findOne({ Name: { $regex: "(?i)" + name + "(?-i)" } });
    
    if (group === null) return null;
    
    group._id = group._id.toString();
    group.Members = group.Members.map(member => member.toString());
    group.Stories = group.Stories.map(story => story.toString());
    
    return group;
};

// create a new group with name, bio, members, stories
const createGroup = async (name, bio, members = [], stories = []) => {
    name = helpers.checkString(name, "name");
    if (name.length < 3) throw "Error: Group name is too short (must be above 3 characters)!";
    if (name.length > 50) throw "Error: Group name is too long (must be below 50 characters)!";

    // check if group name already exists
    const existingGroup = await getGroupByName(name);
    if (existingGroup !== null) throw 'Error: Group name is already taken';

    // validate bio
    bio = helpers.checkString(bio, "bio");
    if (bio.length > 500) throw "Error: Group bio is too long (must be below 500 characters)!";

    // validate members and convert to ObjectIds
    helpers.checkArr(members, "members");
    const memberObjectIds = members.map(memberId => {
        return new ObjectId(helpers.checkId(memberId, "member id"));
    });

    // validate stories and convert to ObjectIds
    helpers.checkArr(stories, "stories");
    const storyObjectIds = stories.map(storyId => {
        return new ObjectId(helpers.checkId(storyId, "story id"));
    });

    // creates new group object
    const newGroup = {
        Name: name,
        Members: memberObjectIds,
        Bio: bio,
        Stories: storyObjectIds
    };

    // inserts group into database
    const groupCollection = await groups();
    const insertInfo = await groupCollection.insertOne(newGroup);

    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw "Could not add group";
    }

    // returns newly created group
    return await getGroupById(insertInfo.insertedId.toString());
};

// update a group
const updateGroup = async (id, updateObject) => {
    id = helpers.checkId(id, "id");
    helpers.checkObj(updateObject, "updateObject");
    
    // validates update object
    const updateFields = {};
    
    if (updateObject.Name !== undefined) {
        updateFields.Name = helpers.checkString(updateObject.Name, "name");
        // todo: Add name length validation
    }
    
    if (updateObject.Bio !== undefined) {
        updateFields.Bio = helpers.checkString(updateObject.Bio, "bio");
        // todo: Add bio length validation
    }
    
    if (updateObject.Members !== undefined) {
        helpers.checkArr(updateObject.Members, "Members");
        updateFields.Members = updateObject.Members.map(memberId => 
            new ObjectId(helpers.checkId(memberId, "member id"))
        );
    }
    
    if (updateObject.Stories !== undefined) {
        helpers.checkArr(updateObject.Stories, "Stories");
        updateFields.Stories = updateObject.Stories.map(storyId => 
            new ObjectId(helpers.checkId(storyId, "story id"))
        );
    }
    
    const groupCollection = await groups();
    const updateResult = await groupCollection.findOneAndUpdate(
        { _id: { $eq: new ObjectId(id) } },
        { $set: updateFields },
        { returnDocument: 'after' }
    );
    
    if (!updateResult) {
        throw "Could not update group";
    }
    
    const updatedGroup = updateResult;
    updatedGroup._id = updatedGroup._id.toString();
    updatedGroup.Members = updatedGroup.Members.map(member => member.toString());
    updatedGroup.Stories = updatedGroup.Stories.map(story => story.toString());
    
    return updatedGroup;
};

// delete a group
const deleteGroup = async (id) => {
    id = helpers.checkId(id, "id");
    
    const groupCollection = await groups();
    const deleteResult = await groupCollection.deleteOne({ _id: { $eq: new ObjectId(id) } });
    
    if (deleteResult.deletedCount === 0) {
        throw "Could not delete group. Group not found.";
    }
    
    return { deleted: true, groupId: id };
};

export default {
    getAllGroups,
    getGroupById,
    getGroupByName,
    createGroup,
    updateGroup,
    deleteGroup
};