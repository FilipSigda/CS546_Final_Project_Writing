/*
* This is for debugging, where you can put fake data for us to use to test things on startup
*/
import { ObjectId } from 'mongodb';
import helpers from './helpers.js';
import stories from "./data/stories.js";
import groups from "./data/groups.js";
import users from "./data/users.js";

//populates mongodb with dummy stories
const populateStories = async () => {
    var story = await stories.createDefaultStory(new ObjectId().toHexString());

    console.log("create finished");

    var ret = await stories.getAllStories();

    console.log("getall finished");
    ret = await stories.getStoryById(story.insertedId.toHexString());//await stories.updateStory(story.insertedId.toHexString(),{Title:"Balls"});
    console.log("update finished");
    return ret;
}


const populateGroups = async () => {
    try {
        // test users
        const user1 = await users.createUser("testuser1", "Password123!");
        const user2 = await users.createUser("testuser2", "Password456!");
        const user3 = await users.createUser("testuser3", "Password789!");

        // test groups
        const group1 = await groups.createGroup(
            "Test Writing Group",
            "A group for testing writing features",
            [user1._id, user2._id]
        );

        const group2 = await groups.createGroup(
            "Fiction Enthusiasts",
            "Passionate about fictional storytelling",
            [user2._id, user3._id]
        );

        // group retrieval
        const retrievedGroup1 = await groups.getGroupById(group1._id);
        console.log("Retrieved Group 1:", retrievedGroup1);

        const retrievedGroupByName = await groups.getGroupByName("Fiction Enthusiasts");
        console.log("Retrieved Group by Name:", retrievedGroupByName);

        // group update
        const updatedGroup = await groups.updateGroup(group1._id, {
            Name: "Updated Writing Group",
            Bio: "An improved group for collaborative writing",
            Members: [user1._id, user2._id, user3._id]
        });
        console.log("Updated Group:", updatedGroup);

        // getting all groups
        const allGroups = await groups.getAllGroups();
        console.log("All Groups:", allGroups);

        // group deletion (uncomment to test)
        // const deletedGroup = await groups.deleteGroup(group2._id);
        // console.log("Deleted Group:", deletedGroup);

        return {
            user1,
            user2,
            user3,
            group1,
            group2,
            updatedGroup
        };

    } catch (error) {
        console.error("Error in populating groups:", error);
        throw error;
    }
};

export default { populateStories, populateGroups };