import { stories } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import helpers from '../helpers.js';

const checkBody = (obj) => {
    helpers.checkObj(obj);
    obj.Title = helpers.checkString(obj.Title, "obj.body[].Title", true);
    obj.Text = helpers.checkString(obj.Text, "obj.body.Text", true);
}

const checkTag = (str) => {
    str = helpers.checkString(str, "Tags");
}

const checkRating = (obj) => {
    helpers.checkObj(obj);
    obj.UserId = helpers.checkId(obj.UserId, "Rating");

    // validate rating score is between 0 and 10
    const score = helpers.checkNumber(obj.Score, "Rating Score");
    if (score < 0 || score > 10) {
        throw new Error("Rating score must be between 0 and 10");
    }
};

// checking if user has rated story
const hasUserRatedStory = (story, userId) => {
    return story.Ratings.some(rating => rating.UserId === userId);
};

const checkComment = (obj) => {
    helpers.checkObj(obj);
    obj.UserId = helpers.checkId(obj.UserId, "Comments.UserId");
    obj.Body = helpers.checkString(obj.Body, "Comment.Body");
}

//check changes within history
const checkChanges = (obj) => {
    helpers.checkObj(obj, "History.Changes");
    obj.Text = helpers.checkString(obj.Text, "History.Changes.Text");
    obj.Chapter = helpers.checkInt(obj.Chapter, "History.Changes.Chapter");
    obj.Position = helpers.checkInt(obj.Position, "History.Changes.Position");
}

//check history
const checkHistory = (obj) => {
    helpers.checkObj(obj, "History");
    obj.UserId = helpers.checkId(obj.UserId, "History.UserId");
    checkChanges.apply(null, obj.Changes);
    obj.Date = helpers.checkMDY(obj.Date, "History.Date");
    obj.Time = helpers.checkHMS(obj.Time, "History.Time");
}

//check Time limit. ensures its between 0 or 1000, or is exactly -1
const checkTimeLimit = (num) => {
    helpers.checkNumber(num);
    if (num == -1) {
        return;
    }

    if (num < 0 && num > 1000) {
        throw new Error("Time limit out of range. Must be between 0 and 1000 or set to -1");
    }
}

//check additions refs
const checkAdditions = (id) => {
    helpers.checkId(id, "Additions");
}

//check status subdocument
const checkStatus = (str) => {
    str = helpers.checkString(str, "Status");
    switch (str) {
        case "hiatus":
            return;
        case "completed":
            return;
        case "dropped":
            return;
        default:
            throw new Error(`Status must be on of the following: "hiatus","completed", or "dropped". Recieved "${str}"`);
    }
}

//checks settings subdocument
const checkSettings = (obj) => {
    obj.MaxParticipants = helpers.checkInt(50, "MaxParticipants");
    if (obj.AllowedParticipants.length > 0) {
        helpers.checkId.apply(null, obj.AllowedParticipants);
    }
    if (obj.AllowedGroups.length > 0) {
        helpers.checkId.apply(null, obj.AllowedGroups);
    }
    obj.MaxSentences = helpers.checkInt(obj.MaxSentences, "MaxSentences");
    obj.MinWords = helpers.checkInt(obj.MinWords, "MinWords");
    obj.MaxWords = helpers.checkInt(obj.MaxWords, "MaxWords");
    obj.MinWritingScore = helpers.checkInt(obj.MinWritingScore, "MinWritingScore");
    obj.MaxWritingScore = helpers.checkInt(obj.MaxWritingScore, "MaxWritingScore");
    return obj;
}

//this monstrosity checks every single field in the story object.
const checkStoryObj = (obj, requireAllKeys = false) => {
    helpers.checkUndef(obj, "storycheckObj");
    if (obj.Title != undefined || requireAllKeys) { helpers.checkString(obj.Title, "Title"); };
    if (obj.Body != undefined || requireAllKeys) {
        helpers.checkArrType(obj.Body, "object", "Body");
        checkBody.apply(null, obj.Body); //checks body for every array element
    }
    if (obj.Description != undefined || requireAllKeys) { obj.Description = helpers.checkString(obj.Description, "Description", true); }
    if (obj.AuthorId != undefined || requireAllKeys) { obj.AuthorId = helpers.checkId(obj.AuthorId, "AuthorId"); }
    if (obj.GroupId != undefined || requireAllKeys) { obj.GroupId = helpers.checkString(obj.GroupId, "GroupId", true); if (obj.GroupId.length > 0) { obj.GroupId = helpers.checkId(obj.GroupId) } }

    if (obj.Previous != undefined || requireAllKeys) {
        obj.Previous = helpers.checkString(obj.Previous, "Previous");
        if (obj.Previous !== "n/a") {
            obj.Previous = helpers.checkId(obj.Previous, "Previous");
        }
    }
    if (typeof obj.IsAnonymous !== "undefined" || requireAllKeys) {
        helpers.checkBool(obj.IsAnonymous, "IsAnonymous");
    }
    if (obj.Tags != undefined || requireAllKeys) {
        helpers.checkArr(obj.Tags, "Tags");
        if (obj.Tags.length > 0) {
            checkTag.apply(null, obj.Tags);
        }
    }
    if (obj.Ratings != undefined || requireAllKeys) {
        helpers.checkArr(obj.Ratings, "Ratings");
        if (obj.Ratings.length > 0) {
            checkRating.apply(null, obj.Ratings);
        }
    }
    if (obj.DatePosted != undefined || requireAllKeys) {
        obj.DatePosted = helpers.checkMDY(obj.DatePosted, "DatePosted");
    }
    if (obj.TimePosted != undefined || requireAllKeys) {
        obj.TimePosted = helpers.checkHMS(obj.TimePosted, "TimePosted");
    }
    if (obj.TimeLimit != undefined || requireAllKeys) {
        checkTimeLimit(obj.TimeLimit);
    }
    if (obj.Additions != undefined || requireAllKeys) {
        helpers.checkArr(obj.Additions, "Additions");
        if (obj.Additions.length > 0) {
            checkAdditions.apply(null, obj.Additions);
        }
    }
    if (obj.Status != undefined || requireAllKeys) { checkStatus(obj.Status); }
    if (typeof obj.IsPrivate !== "undefined" || requireAllKeys) {
        helpers.checkBool(obj.IsPrivate, "IsPrivate");
    }
    if (typeof obj.InviteOnly !== "undefined" || requireAllKeys) {
        helpers.checkBool(obj.InviteOnly, "InviteOnly");
    }
    if (typeof obj.AllowComments !== "undefined" || requireAllKeys) {
        helpers.checkBool(obj.AllowComments, "AllowComments");
    }
    if (obj.Comments != undefined || requireAllKeys) {
        helpers.checkArr(obj.Comments, "Comments");
        if (obj.Comments.length > 0) {
            checkComment.apply(null, obj.Comments);
        }
    }
    if (obj.History != undefined || requireAllKeys) {
        helpers.checkArr(obj.History, "History");
        if (obj.History.length > 0) {
            checkHistory.apply(null, obj.History);
        }
    }
    if (obj.Views != undefined || requireAllKeys) {
        obj.Views = helpers.checkInt(obj.Views);
    }
    if (obj.Picture != undefined || requireAllKeys) {
        obj.Picture = helpers.checkString(obj.Picture);
    }
    if (obj.Settings != undefined || requireAllKeys) {
        obj.Settings = checkSettings(obj.Settings);
    }

    return obj;
};

const defaultStoryObj = {
    "Title": "Untitled",
    "Body":
        [
            {
                "Title": "Chapter",
                "Text": ""
            }
        ],
    "Description": "",
    "AuthorId": "",
    "GroupId": "",
    "Previous": "n/a",
    "IsAnonymous": false,
    "Tags": [],
    "Ratings": [],
    "DatePosted": helpers.formatMDY(Date.now()),
    "TimePosted": helpers.formatHMS(Date.now()),
    "TimeLimit": -1,
    "Additions": [],
    "Status": "hiatus",
    "IsPrivate": true,
    "InviteOnly": false,
    "AllowComments": true,
    "Comments": [],
    "History": [],
    "Views": 0,
    "Picture": helpers.getDefaultImage(),
    "Settings": {
        "MaxParticipants": 99999,
        "AllowedParticipants": [],
        "AllowedGroups": [],
        "MaxSentences": 99999,
        "MinWords": 0,
        "MaxWords": 999999,
        "MinWritingScore": 0,
        "MaxWritingScore": 99999
    }

};

//creates a story using the starting template for a blank new story
const createDefaultStory = async (AuthorId) => {
    var temp = defaultStoryObj;
    temp.AuthorId = AuthorId;
    return await createStory(temp);
}

const createStory = async (obj) => {
    obj = checkStoryObj(obj, true);

    var db = await stories();
    var prevstory = null;
    try {
        if (obj.Previous != "n/a") {
            prevstory = await getStoryById(obj.Previous);
        }
    } catch (e) {
        throw new Error("Previous story does not exist");
    }
    var story = await db.insertOne(obj);

    if (prevstory != null) {
        prevstory.Additions.append(story._id);
        await updateStory(prevstory._id, { Additions: prevstory.Additions });
    }

    if (!story.acknowledged) {
        throw new Error("Story failed to save");
    }

    return story;
};

const getStoryById = async (id) => {
    id = helpers.checkId(id, "id");
    var objID = ObjectId.createFromHexString(id);

    var db = await stories();
    var story = await db.findOne(objID);

    return story;
};

const getAllStories = async () => {
    var db = await stories();
    var story = await db.find({}).toArray();

    return story;
};

const updateStory = async (id, obj, userId = null) => {
    id = helpers.checkId(id, "id");
    helpers.checkObj(obj, "updateobj");

    // handling ratings
    if (obj.Ratings) {
        const story = await getStoryById(id);

        // check for rating update
        if (obj.Ratings.length > 0) {
            const newRating = obj.Ratings[0];

            // validate rating
            checkRating(newRating);

            // check if user has already rated this story
            if (hasUserRatedStory(story, newRating.UserId)) {
                throw new Error("You can only rate a story once");
            }
        }
    }

    //validates previousStory and updates it.
    if(obj.Previous){
        const story = await getStoryById(obj.Previous);

        if(!story.Additions.includes(id)){
            story.Additions.push(id);
            obj.Additions = obj.Additions.concat(story.Additions);
        }
    }

    obj = checkStoryObj(obj, false);

    var db = await stories();
    var story = await db.findOneAndUpdate(
        { _id: { $eq: ObjectId.createFromHexString(id) } },
        { $set: obj },
        { returnDocument: 'after' }
    );

    if (!story) {
        throw new Error("Story update failed");
    }

    return story;
};


const deleteStory = async (id) => {
    id = helpers.checkId(id);

    var db = await stories();
    var story = await db.deleteOne({ _id: { $eq: ObjectId.createFromHexString(id) } });

    if (!story) {
        throw new Error("Story delete failed");
    }

    return story;
};

const searchStories = async (searchParams) => {
    // validate/prep search params
    const query = {};
    const excludeQuery = {};

    // title search
    if (searchParams.name) {
        query.Title = { $regex: searchParams.name, $options: 'i' };
    }
    if (searchParams.excludeName) {
        excludeQuery.Title = { $not: { $regex: searchParams.excludeName, $options: 'i' } };
    }

    // date range search
    if (searchParams.startDate || searchParams.endDate) {
        query.DatePosted = {};
        if (searchParams.startDate) {
            query.DatePosted.$gte = helpers.formatMDY(new Date(searchParams.startDate));
        }
        if (searchParams.endDate) {
            query.DatePosted.$lte = helpers.formatMDY(new Date(searchParams.endDate));
        }
    }

    // completion status
    if (searchParams.status) {
        query.Status = searchParams.status;
    }
    if (searchParams.excludeStatus) {
        excludeQuery.Status = { $ne: searchParams.excludeStatus };
    }

    // story rating by min/max
    if (searchParams.minRating || searchParams.maxRating) {
        query.$expr = {};
        if (searchParams.minRating) {
            query.$expr.$gte = [
                { $avg: "$Ratings.Score" },
                searchParams.minRating
            ];
        }
        if (searchParams.maxRating) {
            query.$expr.$lte = [
                { $avg: "$Ratings.Score" },
                searchParams.maxRating
            ];
        }
    }

    // min. number of ratings
    if (searchParams.minRatingCount) {
        query.$expr = query.$expr || {};
        query.$expr.$gte = [
            { $size: "$Ratings" },
            searchParams.minRatingCount
        ];
    }

    // group exclusiveness
    if (searchParams.groupExclusive !== undefined) {
        query.GroupId = searchParams.groupExclusive ? { $ne: "" } : "";
    }

    // tags (+ exclude option)
    if (searchParams.tags && searchParams.tags.length > 0) {
        query.Tags = { $all: searchParams.tags };
    }
    if (searchParams.excludeTags && searchParams.excludeTags.length > 0) {
        excludeQuery.Tags = { $nin: searchParams.excludeTags };
    }

    // length (based on total words)
    if (searchParams.minLength || searchParams.maxLength) {
        query.$expr = query.$expr || {};
        const bodyLengthCalculation = {
            $reduce: {
                input: "$Body",
                initialValue: 0,
                in: {
                    $add: [
                        "$$value",
                        { $size: { $split: ["$$this.Text", " "] } }
                    ]
                }
            }
        };

        if (searchParams.minLength) {
            query.$expr.$gte = [bodyLengthCalculation, searchParams.minLength];
        }
        if (searchParams.maxLength) {
            query.$expr.$lte = [bodyLengthCalculation, searchParams.maxLength];
        }
    }

    // story pictures and descriptions
    if (searchParams.hasPicture !== undefined) {
        query.Picture = searchParams.hasPicture
            ? { $ne: helpers.getDefaultImage() }
            : helpers.getDefaultImage();
    }
    if (searchParams.descriptionKeyword) {
        query.Description = {
            $regex: searchParams.descriptionKeyword,
            $options: 'i'
        };
    }

    // merging the exclude queries together
    Object.keys(excludeQuery).forEach(key => {
        query[key] = { ...query[key], ...excludeQuery[key] };
    });

    // search page number calculations
    const page = searchParams.page || 1;
    const limit = searchParams.limit || 10;
    const skip = (page - 1) * limit;

    // doing the actual search
    const db = await stories();
    const searchResults = await db.find(query)
        .skip(skip)
        .limit(limit)
        .toArray();

    // gets total results for finding search 
    const totalCount = await db.countDocuments(query);

    return {
        stories: searchResults,
        totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit)
    };
};

const getHighestViews = async (limit) => {
    const db = await stories();
    let highestViews;

    try {//Limits query size if asked for.
        helpers.checkInt(limit);
        if(!Number.isNaN(limit)){
            highestViews = await db.find({IsPrivate: false}).project({'_id': 1, 'Title': 1, 'Description': 1, 'AuthorId': 1, 'GroupId': 1, 'IsAnonymous': 1, 'IsPrivate': 1, 'Views': 1, 'Picture': 1}).sort({Views: -1}).limit(limit).toArray();
        }
        else {
            throw "";//Intentionally left empty.
        }
    }
    catch (e) {
        highestViews = await db.find({ IsPrivate: false }).project({ '_id': 1, 'Title': 1, 'Description': 1, 'AuthorId': 1, 'GroupId': 1, 'IsAnonymous': 1, 'IsPrivate': 1, 'Views': 1 }).sort({ Views: -1 }).toArray();
    }
    for (let i = 0; i < highestViews.length; i++) {//Puts in the correct author(s) for each story.
        highestViews[i]['Author'] = helpers.getAuthor(highestViews[i]);
    }

    return highestViews;
};

const getMostRecent = async (limit) => {
    const db = await stories();
    let mostRecent;

    try {//Limits query size if asked for.
        helpers.checkInt(limit);
        if(!Number.isNaN(limit)){
            mostRecent = await db.find({IsPrivate: false}).project({'_id': 1, 'Title': 1, 'Description': 1, 'AuthorId': 1, 'GroupId': 1, 'IsAnonymous': 1, 'IsPrivate': 1, 'DatePosted': 1, 'TimePosted': 1, 'Picture': 1}).sort({DatePosted: -1, TimePosted: -1}).limit(limit).toArray();
        }
        else {
            throw "";//Intentionally left empty.
        }
    }
    catch(e){
        mostRecent = await db.find({IsPrivate: false}).project({'_id': 1, 'Title': 1, 'Description': 1, 'AuthorId': 1, 'GroupId': 1, 'IsAnonymous': 1, 'IsPrivate': 1, 'DatePosted': 1, 'TimePosted': 1, 'Picture': 1}).sort({DatePosted: -1, TimePosted: -1}).toArray();
    }

    for (let i = 0; i < mostRecent.length; i++) {//Puts in the correct author(s) for each story.
        mostRecent[i]['Author'] = helpers.getAuthor(mostRecent[i]);
    }

    return mostRecent;
};

export default { createStory, getStoryById, getAllStories, updateStory, deleteStory, createDefaultStory, searchStories, getHighestViews, getMostRecent };