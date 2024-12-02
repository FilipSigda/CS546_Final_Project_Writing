import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import helpers from '../helpers.js';

const checkBody = (obj) => {
    helpers.checkObj(obj);
    obj.Title = helpers.checkString(obj.Title, "obj.body[].Title");
    obj.Text = helpers.checkString(obj.Text, "obj.body.Text");
}

const checkTag = (str) => {
    str = helpers.checkString(str,"Tags");
}

const checkRating = (obj) => {
    helpers.checkObj(obj);
    obj.UserId = helpers.checkString(obj.UserId);
    helpers.checkInt(obj.Score);
}

const checkStoryObj = (obj, requireAllKeys = false) => {
    helpers.checkUndef(obj);
    if (obj.Title != null || requireAllKeys) { helpers.checkString(obj.Title, "Title"); };
    if (obj.Body != null || requireAllKeys) {
        helpers.checkArrType(obj.Body, "object", "Body");
        checkBody.apply(null, obj.Body); //checks body for every array element
    }
    if (obj.Description != null || requireAllKeys) { obj.Description = helpers.checkString(obj.Description, "Description"); }
    if (obj.AuthorId != null || requireAllKeys) { obj.AuthorId = helpers.checkId(obj.AuthorId, "AuthorId"); }
    
    if (obj.Previous != null || requireAllKeys) {
        obj.Previous = helpers.checkString(obj.Previous, "Previous");
        if (obj.Previous !== "n/a") {
            obj.Previous = helpers.checkId(obj.Previous, "Previous");
        }
    }

    if (obj.IsAnonymous != null || requireAllKeys) { helpers.checkBool(obj.IsAnonymous,"IsAnonymous"); }
    if(obj.Tags != null || requireAllKeys) { helpers.checkArr(obj.Tags,"Tags");checkTag.apply(null,obj.Tags); }
    if(obj.Ratings != null || requireAllKeys) { helpers.checkArr(obj.Ratings,"Ratings");checkRating.apply(null,obj.Ratings);}
    if(obj.DatePosted != null || requireAllKeys) {obj.DatePosted = helpers.checkMDY(obj.DatePosted, "DatePosted");}
    return obj;
};

const createStory = async (obj) => {
    obj = checkStoryObj(obj, true);
    console.log("ALL GOOD");
    return obj;
};

export default { createStory };