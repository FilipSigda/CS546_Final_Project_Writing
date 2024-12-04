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
    var ret = await stories.createStory(
        {
            "Title": "TEST TITLE", "Body":
                [
                    {
                        "Title": " chapter title                ",
                        "Text": "chapter  text "
                    },
                    {
                        "Title": "chapter title 2",
                        "Text": "chapter text 2"
                    }
                ],
            "Description": "Test Description",
            "AuthorId": (new ObjectId()).toHexString(),
            "Previous": "n/a",
            "IsAnonymous": false,
            "Tags": [
                "fiction",
                "adventure",
                "hero's journey"
            ],
            "Ratings":
                [
                    {
                        "UserId":(new ObjectId()).toHexString(),
                        "Score": 7
                    }
                ],
            "DatePosted": helpers.formatMDY(Date.now()),
            "TimePosted": helpers.formatHMS(Date.now()),//helpers.formatHMS(Date.now())),//"18:00:23",
            "TimeLimit": -1,
            "Additions": [
               (new ObjectId()).toHexString(),
               (new ObjectId()).toHexString()
            ],
            "Status": "hiatus",
            "IsPrivate": false,
            "InviteOnly": false,
            "AllowComments": true,
            "Comments": [
                {
                    "UserId":(new ObjectId()).toHexString(),
                    "Body": "wow what a great story! It was so good I commented!"
                }
            ],
            "History": [
                {
                    "UserId":(new ObjectId()).toHexString(),
                    "Changes": [
                        {
                            "Text": "This sentence was added to the story",
                            "Chapter": 2,
                            "Position": 123
                        }
                    ],
                    "Date": "05/02/2024",
                    "Time": "12:00:23"
                }
            ],
            "Views":50,
            "Picture":"https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106",
            "Settings": {
                "MaxParticipants": 50,
                "AllowedParticipants": [
                   (new ObjectId()).toHexString()
                ],
                "AllowedGroups": [
                   (new ObjectId()).toHexString()
                ],
                "MaxSentences":99999,
                "MinWords":500,
                "MaxWords":999999,
                "MinWritingScore":50,
                "MaxWritingScore":100
            }

        }
    );
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