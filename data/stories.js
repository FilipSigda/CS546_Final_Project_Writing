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
    obj.UserId = helpers.checkString(obj.UserId,"Rating");
    helpers.checkInt(obj.Score);
}

const checkComment = (obj) => {
    helpers.checkObj(obj);
    obj.UserId = helpers.checkString(obj.UserId,"Comment");
    obj.Body = helpers.checkString(obj.Body,"Comment");
}

const checkChanges = (obj) => {
    helpers.checkObj(obj,"History.Changes");
    obj.Text = helpers.checkString(obj.Text,"History.Changes.Text");
    obj.Chapter = helpers.checkInt(obj.Chapter,"History.Changes.Chapter");
    obj.Position = helpers.checkInt(obj.Position,"History.Changes.Position");
}

const checkHistory = (obj) => {
    helpers.checkObj(obj,"History");
    obj.UserId = helpers.checkId(obj.UserId,"History.UserId");
    checkChanges.apply(null,obj.Changes);
    obj.Date = helpers.checkMDY(obj.Date,"History.Date");
    obj.Time = helpers.checkHMS(obj.Time,"History.Time");
}

const checkTimeLimit = (num) =>{
    helpers.checkNumber(num);
    if(num == -1){
        return;
    }
    
    if(num < 0 && num > 1000){
        throw new Error("Time limit out of range. Must be between 0 and 1000 or set to -1");
    }
}

const checkAdditions = (id) => {
    helpers.checkId(id,"Additions");
}

const checkStatus = (str) => {
    str = helpers.checkString(str,"Status");
    switch(str){
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

const checkSettings = (obj) => {
    obj.MaxParticipants = helpers.checkInt(50,"MaxParticipants");
    helpers.checkId.apply(null,obj.AllowedParticipants);
    helpers.checkId.apply(null,obj.AllowedGroups);
    obj.MaxSentences = helpers.checkInt(obj.MaxSentences,"MaxSentences");
    obj.MinWords = helpers.checkInt(obj.MinWords,"MinWords");
    obj.MaxWords = helpers.checkInt(obj.MaxWords,"MaxWords");
    obj.MinWritingScore = helpers.checkInt(obj.MinWritingScore,"MinWritingScore");
    obj.MaxWritingScore = helpers.checkInt(obj.MaxWritingScore,"MaxWritingScore");
    return obj;
}

const checkStoryObj = (obj, requireAllKeys = false) => {
    helpers.checkUndef(obj);
    if (obj.Title != undefined || requireAllKeys) { helpers.checkString(obj.Title, "Title"); };
    if (obj.Body != undefined || requireAllKeys) {
        helpers.checkArrType(obj.Body, "object", "Body");
        checkBody.apply(null, obj.Body); //checks body for every array element
    }
    if (obj.Description != undefined || requireAllKeys) { obj.Description = helpers.checkString(obj.Description, "Description"); }
    if (obj.AuthorId != undefined || requireAllKeys) { obj.AuthorId = helpers.checkId(obj.AuthorId, "AuthorId"); }
    
    if (obj.Previous != undefined || requireAllKeys) {
        obj.Previous = helpers.checkString(obj.Previous, "Previous");
        if (obj.Previous !== "n/a") {
            obj.Previous = helpers.checkId(obj.Previous, "Previous");
        }
    }

    if (typeof obj.IsAnonymous !== "undefined" || requireAllKeys) { helpers.checkBool(obj.IsAnonymous,"IsAnonymous"); }
    if(obj.Tags != undefined || requireAllKeys) { helpers.checkArr(obj.Tags,"Tags");checkTag.apply(null,obj.Tags); }
    if(obj.Ratings != undefined || requireAllKeys) { helpers.checkArr(obj.Ratings,"Ratings");checkRating.apply(null,obj.Ratings);}
    if(obj.DatePosted != undefined || requireAllKeys) {obj.DatePosted = helpers.checkMDY(obj.DatePosted, "DatePosted");}
    if(obj.TimePosted != undefined || requireAllKeys) {obj.TimePosted = helpers.checkHMS(obj.TimePosted, "TimePosted");}
    if(obj.TimeLimit != undefined || requireAllKeys) {obj.TimeLimit = checkTimeLimit(obj.TimeLimit);}
    if(obj.Additions != undefined || requireAllKeys) { helpers.checkArr(obj.Additions,"Additions");checkAdditions.apply(null,obj.Additions); }
    if(obj.Status != undefined || requireAllKeys) {checkStatus(obj.Status);}
    if(typeof obj.IsPrivate !== "undefined" || requireAllKeys){helpers.checkBool(obj.IsPrivate,"IsPrivate");}
    if(typeof obj.InviteOnly !== "undefined" || requireAllKeys){helpers.checkBool(obj.InviteOnly,"InviteOnly");}
    if(typeof obj.AllowComments !== "undefined" || requireAllKeys){helpers.checkBool(obj.AllowComments,"AllowComments");}
    if(obj.Comments != undefined || requireAllKeys) {helpers.checkArr(obj.Comments,"Comments");checkComment.apply(null,obj.Comments);}
    if(obj.History != undefined || requireAllKeys) {helpers.checkArr(obj.History,"History");checkHistory.apply(null,obj.History);}
    if(obj.Views != undefined || requireAllKeys) {obj.Views = helpers.checkInt(obj.Views);}
    if(obj.Picture != undefined || requireAllKeys) {obj.Picture = helpers.checkString(obj.Picture);}
    if(obj.Settings != undefined || requireAllKeys) {obj.Settings = checkSettings(obj.Settings);}

    return obj;
};

const createStory = async (obj) => {
    obj = checkStoryObj(obj, true);
    console.log("ALL GOOD");
    return obj;
};

export default { createStory };