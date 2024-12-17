/*
* This is for debugging, where you can put fake data for us to use to test things on startup
*/
import { ObjectId } from 'mongodb';
import helpers from './helpers.js';
import stories from "./data/stories.js";
import groups from "./data/groups.js";
import users from "./data/users.js";

var templatestory = {
    "Title": "This is the test tiltle",
    "Body":
        [
            {
                "Title": "Chapter",
                "Text": ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum velit id lectus vestibulum vulputate. Nam at mollis velit. Fusce quis tempus libero. Aenean vulputate eleifend pretium. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris rhoncus dignissim lacus, eget sodales eros blandit non. Nullam fringilla lacinia dolor, at blandit lacus porttitor nec. Maecenas vel consequat massa, eget facilisis sapien. In hac habitasse platea dictumst. Nunc convallis leo lorem, eu fermentum magna cursus ut. Ut et enim massa. Quisque non tincidunt velit, in venenatis massa. Vestibulum consequat dictum diam, id fermentum libero dignissim eu. Pellentesque pellentesque, nibh id faucibus vehicula, elit dui lacinia diam, quis condimentum nunc lacus ac eros. Quisque sollicitudin hendrerit est, at malesuada quam volutpat non. Sed vel dictum mauris. Cras eget risus odio. Mauris porta eu ante in ullamcorper. Pellentesque placerat commodo odio, sed vulputate tellus lacinia at. Cras porta tempor dictum. Donec blandit ex risus, et interdum massa sollicitudin id. Ut tincidunt dui vitae massa rhoncus bibendum. Fusce finibus, magna quis maximus aliquet, lectus lorem luctus mauris, sit amet ultricies lacus arcu id purus. Nulla metus est, faucibus ut est ut, commodo mollis nulla. Nam nec ex ac nisi euismod ornare id eget ligula. Etiam varius in nisl non gravida. In hac habitasse platea dictumst. Suspendisse potenti. Fusce venenatis pretium feugiat. Proin risus turpis, lobortis vestibulum dapibus at, mollis vitae enim. Proin lacinia efficitur erat sit amet gravida. Curabitur leo purus, aliquam sed sagittis et, lacinia in enim. Vivamus interdum consequat fermentum. Quisque lacinia mi in ipsum aliquam ullamcorper. Etiam eu enim sed est porta ullamcorper. In nec ligula ac urna pretium mollis. Phasellus et nunc suscipit, semper nisl sed, eleifend dolor. Quisque laoreet, justo vitae posuere gravida, leo metus laoreet nisl, nec aliquam lacus lorem a urna. In quis lorem congue, ullamcorper augue at, blandit metus. Integer leo nunc, efficitur ac pharetra sit amet, gravida vitae urna. Phasellus bibendum leo nulla, eget suscipit magna ultrices vitae. Aenean feugiat condimentum pulvinar. Curabitur venenatis nulla vel mauris pellentesque, at rhoncus leo fringilla. Sed tincidunt neque eu felis ornare, ac finibus elit dignissim. Ut in malesuada ipsum, sit amet gravida est. Cras id odio purus. Ut non consequat justo. Nunc sit amet hendrerit quam, quis semper ex. Aliquam condimentum posuere tellus, placerat congue nisi ullamcorper at. Curabitur in eros et lectus rutrum auctor a vel orci. Nullam egestas hendrerit enim sit amet suscipit. `
            },
            {
                "Title": "Chapter 2: what could've been",
                "Text": ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum velit id lectus vestibulum vulputate. Nam at mollis velit. Fusce quis tempus libero. Aenean vulputate eleifend pretium. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris rhoncus dignissim lacus, eget sodales eros blandit non. Nullam fringilla lacinia dolor, at blandit lacus porttitor nec. Maecenas vel consequat massa, eget facilisis sapien. In hac habitasse platea dictumst. Nunc convallis leo lorem, eu fermentum magna cursus ut. Ut et enim massa. Quisque non tincidunt velit, in venenatis massa. Vestibulum consequat dictum diam, id fermentum libero dignissim eu. Pellentesque pellentesque, nibh id faucibus vehicula, elit dui lacinia diam, quis condimentum nunc lacus ac eros. Quisque sollicitudin hendrerit est, at malesuada quam volutpat non. Sed vel dictum mauris. Cras eget risus odio. Mauris porta eu ante in ullamcorper. Pellentesque placerat commodo odio, sed vulputate tellus lacinia at. Cras porta tempor dictum. Donec blandit ex risus, et interdum massa sollicitudin id. Ut tincidunt dui vitae massa rhoncus bibendum. Fusce finibus, magna quis maximus aliquet, lectus lorem luctus mauris, sit amet ultricies lacus arcu id purus. Nulla metus est, faucibus ut est ut, commodo mollis nulla. Nam nec ex ac nisi euismod ornare id eget ligula. Etiam varius in nisl non gravida. In hac habitasse platea dictumst. Suspendisse potenti. Fusce venenatis pretium feugiat. Proin risus turpis, lobortis vestibulum dapibus at, mollis vitae enim. Proin lacinia efficitur erat sit amet gravida. Curabitur leo purus, aliquam sed sagittis et, lacinia in enim. Vivamus interdum consequat fermentum. Quisque lacinia mi in ipsum aliquam ullamcorper. Etiam eu enim sed est porta ullamcorper. In nec ligula ac urna pretium mollis. Phasellus et nunc suscipit, semper nisl sed, eleifend dolor. Quisque laoreet, justo vitae posuere gravida, leo metus laoreet nisl, nec aliquam lacus lorem a urna. In quis lorem congue, ullamcorper augue at, blandit metus. Integer leo nunc, efficitur ac pharetra sit amet, gravida vitae urna. Phasellus bibendum leo nulla, eget suscipit magna ultrices vitae. Aenean feugiat condimentum pulvinar. Curabitur venenatis nulla vel mauris pellentesque, at rhoncus leo fringilla. Sed tincidunt neque eu felis ornare, ac finibus elit dignissim. Ut in malesuada ipsum, sit amet gravida est. Cras id odio purus. Ut non consequat justo. Nunc sit amet hendrerit quam, quis semper ex. Aliquam condimentum posuere tellus, placerat congue nisi ullamcorper at. Curabitur in eros et lectus rutrum auctor a vel orci. Nullam egestas hendrerit enim sit amet suscipit. `
            },
            {
                "Title": "Chapter 3: how did this happen",
                "Text": ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum velit id lectus vestibulum vulputate. Nam at mollis velit. Fusce quis tempus libero. Aenean vulputate eleifend pretium. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris rhoncus dignissim lacus, eget sodales eros blandit non. Nullam fringilla lacinia dolor, at blandit lacus porttitor nec. Maecenas vel consequat massa, eget facilisis sapien. In hac habitasse platea dictumst. Nunc convallis leo lorem, eu fermentum magna cursus ut. Ut et enim massa. Quisque non tincidunt velit, in venenatis massa. Vestibulum consequat dictum diam, id fermentum libero dignissim eu. Pellentesque pellentesque, nibh id faucibus vehicula, elit dui lacinia diam, quis condimentum nunc lacus ac eros. Quisque sollicitudin hendrerit est, at malesuada quam volutpat non. Sed vel dictum mauris. Cras eget risus odio. Mauris porta eu ante in ullamcorper. Pellentesque placerat commodo odio, sed vulputate tellus lacinia at. Cras porta tempor dictum. Donec blandit ex risus, et interdum massa sollicitudin id. Ut tincidunt dui vitae massa rhoncus bibendum. Fusce finibus, magna quis maximus aliquet, lectus lorem luctus mauris, sit amet ultricies lacus arcu id purus. Nulla metus est, faucibus ut est ut, commodo mollis nulla. Nam nec ex ac nisi euismod ornare id eget ligula. Etiam varius in nisl non gravida. In hac habitasse platea dictumst. Suspendisse potenti. Fusce venenatis pretium feugiat. Proin risus turpis, lobortis vestibulum dapibus at, mollis vitae enim. Proin lacinia efficitur erat sit amet gravida. Curabitur leo purus, aliquam sed sagittis et, lacinia in enim. Vivamus interdum consequat fermentum. Quisque lacinia mi in ipsum aliquam ullamcorper. Etiam eu enim sed est porta ullamcorper. In nec ligula ac urna pretium mollis. Phasellus et nunc suscipit, semper nisl sed, eleifend dolor. Quisque laoreet, justo vitae posuere gravida, leo metus laoreet nisl, nec aliquam lacus lorem a urna. In quis lorem congue, ullamcorper augue at, blandit metus. Integer leo nunc, efficitur ac pharetra sit amet, gravida vitae urna. Phasellus bibendum leo nulla, eget suscipit magna ultrices vitae. Aenean feugiat condimentum pulvinar. Curabitur venenatis nulla vel mauris pellentesque, at rhoncus leo fringilla. Sed tincidunt neque eu felis ornare, ac finibus elit dignissim. Ut in malesuada ipsum, sit amet gravida est. Cras id odio purus. Ut non consequat justo. Nunc sit amet hendrerit quam, quis semper ex. Aliquam condimentum posuere tellus, placerat congue nisi ullamcorper at. Curabitur in eros et lectus rutrum auctor a vel orci. Nullam egestas hendrerit enim sit amet suscipit. `
            }
        ],
    "Description": "This is a sample description meant to give a proper example of the story to finish everything",
    "AuthorId": "",
    "GroupId": "",
    "Previous": "n/a",
    "IsAnonymous": false,
    "Tags": ["fantasy", "sci-fi", "ground-breaking"],
    "Ratings": [
        {
            "UserId": "675f38c0ee612b11ba467936",
            "Score": 7
        }
    ],
    "DatePosted": helpers.formatMDY(Date.now()),
    "TimePosted": helpers.formatHMS(Date.now()),
    "TimeLimit": -1,
    "Additions": [],
    "Status": "hiatus",
    "IsPrivate": true,
    "InviteOnly": false,
    "AllowComments": true,
    "Comments": [
        {
            "UserId": "675f38c0ee612b11ba467936",
            "Body": "wow what a great story"
        }
    ],
    "History": [
        {
            "UserId": "675f38c0ee612b11ba467936",
            "Changes": [
                {
                    "Text": "this sentence was added to the story",
                    "Chapter": 2,
                    "Position": 123,
                }
            ],
            "Date":helpers.formatMDY(Date.now()),
            "Time":helpers.formatHMS(Date.now())
        }
    ],
    "Views": 0,
    "Picture": helpers.getDefaultImage(),
    "Settings": {
        "MaxParticipants": 99999,
        "AllowedParticipants": [
            (new ObjectId()).toHexString()
        ],
        "AllowedGroups": [
            (new ObjectId()).toHexString()
        ],
        "MaxSentences": 99999,
        "MinWords": 0,
        "MaxWords": 999999,
        "MinWritingScore": 0,
        "MaxWritingScore": 99999
    }

};

//populates mongodb with dummy stories
const populateStories = async () => {
    templatestory.AuthorId = await users.getUserByName("johndoe")._id.toHexString();
    var story = await stories.createStory(templatestory);
    var dupe = templatestory;
    dupe.AuthorId = await users.getUserByName("testuser2")._id.toHexString();
    dupe.Title = "An alternate title";
    var story = await stories.createStory(dupe);
    return story.insertedId;
}


const populateGroups = async () => {
    try {
        // test users
        const user1 = await users.createUser("johndoe", "theBestTractor");
        const user2 = await users.createUser("testuser2", "admin");
        const user3 = await users.createUser("amyhear", "zoom!");

        // test groups
        const group1 = await groups.createGroup(
            "Writing Group",
            "A fanatics of writing",
            [user1._id, user2._id]
        );

        const group2 = await groups.createGroup(
            "Fiction Enthusiasts",
            "Passionate about fictional storytelling",
            [user2._id, user3._id]
        );

    } catch (error) {
        console.error("Error in populating groups:", error);
        throw error;
    }
};

export default { populateStories, populateGroups };