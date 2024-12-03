/*
* This is for debugging, where you can put fake data for us to use to test things on startup
*/
import { ObjectId } from 'mongodb';
import helpers from './helpers.js';
import stories from "./data/stories.js";

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

export default { populateStories };