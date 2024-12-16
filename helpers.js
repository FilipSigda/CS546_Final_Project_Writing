import { ObjectId } from 'mongodb';

//checks variable for objectID
export const checkId = (id, varName, allowEmpty=false) => {
    checkNull(id,varName);
    checkUndef(id,varName);
    id = checkString(id,varName,allowEmpty);
    if (!ObjectId.isValid(id)) throw new Error( `Error: ${varName} invalid object ID`);
    return id;
}

export const getDefaultImage = () => {
    return "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106";
}

export const checkNull = (input, varName) => {
    if (input === null) {
        throw new Error(`Error: ${varName} is null`);
    }
}

export const checkUndef = (input, varName) => {
    if (typeof input === "undefined") {//we're using typeof since false === undefined. This avoids that.
        throw new Error(`Error: ${varName} is undefined`);
    }
}

export const checkBool = (input, varName) => {
    checkUndef(input,varName);
    checkNull(input,varName);
    if (typeof input !== "boolean") {
        throw new Error(`Error: ${varName} is not boolean`);
    }
}

export const checkString = (strVal, varName, allowEmpty=false) => {
    checkUndef(strVal,varName);
    checkNull(strVal,varName); 
    if (typeof strVal !== 'string') throw new Error(`Error: ${varName} must be a string!`);
    strVal = strVal.trim();
    if (strVal.length === 0 && !allowEmpty)
        throw new Error(`Error: ${varName} is empty when it shouldn't be`);
    return strVal;
}

//checks that value is an integer
export const checkNumber = (input, varName) => {
    checkNull(input, varName);
    checkUndef(input, varName);
    if (!(typeof input === "number")) {
        throw new Error(`Error: ${varName} is not a number`);
    }
}

//checks that it is a number AND an integer
export const checkInt = (input, varName) => {
    checkNumber(input, varName);
    if (!Number.isInteger(input)) {
        throw new Error(`Error: ${varName} is not an Integer`);
    }
    return Number.parseInt(input);
}

//checks that it is an object
export const checkObj = (input, varName) => {
    checkNull(input, varName);
    checkUndef(input, varName);
    if (!(typeof input === "object")) {
        throw new Error(`Error: ${varName} is not an Object`);
    }
}

export const checkArr = (input, varName) => {
    checkObj(input, varName);
    if (!Array.isArray(input)) {
        throw new Error(`Error: ${varName} is not an Array`);
    }
}

//checks that every element is the correct type
export const checkArrType = (input, type, varName) => {
    checkArr(input, varName);
    for (let i = 0; i < input.length; i++) {
        if (typeof input[i] !== type) {
            throw new Error(`Error: value [ ${input[i]} ] in array "${varName[i]}" is type ${typeof input[i]} instead of ${type}`);
        }
    }
}

export const checkMDY = (input, varName) => {
    input = checkString(input, varName);

    var splits = input.split("/");
    if (splits.length != 3) {
        throw new Error(`Error: ${varName} is not formatted in MM/DD/YYYY. Actual value: ${input}`);
    }
    if (splits[0].length != 2 || splits[1].length != 2 || splits[2].length != 4) {
        throw new Error(`Error: ${varName} is not formatted in MM/DD/YYYY. Actual value: ${input}`);
    }

    if (!isNaN(new Date(input))) {
        var date = new Date(input);
    } else {
        throw new Error(`Error: Date provided "${input}" to is not a valid Date`);
    }
    return input;
}

//parses strings in MM/DD/YYYY format
export const parseMDY = (input, varName) => {

    input = checkString(input, varName);

    var splits = input.split("/");
    if (splits.length != 3) {
        throw new Error(`Error: ${varName} is not formatted in MM/DD/YYYY. Actual value: ${input}`);
    }
    if (splits[0].length != 2 || splits[1].length != 2 || splits[2].length != 4) {
        throw new Error(`Error: ${varName} is not formatted in MM/DD/YYYY. Actual value: ${input}`);
    }

    //convert to num
    for (let i = 0; i < 3; i++) {
        splits[i] = Number.parseInt(splits[i]);
    }

    //check values
    if (splits[0] < 1 || splits[0] > 12) {
        throw new Error(`Error: ${varName} month is out of range. ${splits[0]} is not between 1 and 12 inclusive`);
    }
    if (splits[1] < 1 || splits[1] > 31) {
        throw new Error(`Error: ${varName} day is out of range. ${splits[0]} is not between 1 and 31 inclusive`);
    }
    if (splits[2] < 1960 || splits[2] > 2100) {
        throw new Error(`Error: ${varName} year is out of range. ${splits[0]} is not between 1961 and 2100 inclusive`);
    }

    let d = new Date();
    d.setDate(splits[1]);
    d.setMonth(splits[0] - 1);
    d.setFullYear(splits[2]);

    return d;
}

export const formatMDY = (date) => {
    if (!(date instanceof Date)) {
        if (!isNaN(new Date(date))) {
            date = new Date(date);
        } else {
            throw new Error(`Error: Date provided to is not a valid Date format`);
        }
    }

    var str = "";
    if (date.getMonth() + 1 < 10) {
        str += "0" + (date.getMonth() + 1);
    } else {
        str += (date.getMonth() + 1) + "";
    }
    str += "/";
    if (date.getDate() < 10) {
        str += "0" + date.getDate();
    } else {
        str += date.getDate() + "";
    }
    str += "/" + date.getFullYear();
    return str;
}

//format function for hour/minute/seconds
export const formatHMS = (date) => {
    if (!(date instanceof Date)) {
        if (!isNaN(new Date(date))) {
            date = new Date(date);
        } else {
            throw new Error(`Error: Date provided to is not a valid Date format`);
        }
    }

    var str = "";
    if (date.getHours() < 10) {
        str += "0" + (date.getHours());
    } else {
        str += (date.getHours()) + "";
    }
    str += ":";
    if (date.getMinutes() < 10) {
        str += "0" + date.getMinutes();
    } else {
        str += date.getMinutes() + "";
    }
    str += ":";
    if(date.getSeconds() < 10) {
        str += "0" + date.getSeconds();
    }else{
        str += date.getSeconds() + "";
    }
    return str;
}

export const parseHMS = (input,varName) => {
    input = checkString(input, varName);

    var splits = input.split(":");
    if (splits.length != 3) {
        throw new Error(`Error: ${varName} is not formatted in HH:MM:SS. Actual value: ${input}`);
    }
    if (splits[0].length != 2 || splits[1].length != 2 || splits[2].length != 2) {
        throw new Error(`Error: ${varName} is not formatted in HH:MM:SS. Actual value: ${input}`);
    }

    //convert to num
    for (let i = 0; i < 3; i++) {
        splits[i] = Number.parseInt(splits[i]);
    }

    //check values
    if (splits[0] < 0 || splits[0] > 24) {
        throw new Error(`Error: ${varName} month is out of range. ${splits[0]} is not between 1 and 12 inclusive`);
    }
    if (splits[1] < 0 || splits[1] > 59) {
        throw new Error(`Error: ${varName} day is out of range. ${splits[0]} is not between 1 and 31 inclusive`);
    }
    if (splits[2] < 0 || splits[2] > 59) {
        throw new Error(`Error: ${varName} year is out of range. ${splits[0]} is not between 1961 and 2100 inclusive`);
    }

    let d = new Date();
    d.setHours(splits[0]);
    d.setMinutes(splits[1] );
    d.setSeconds(splits[2]);

    return d;
}

export const checkHMS = (input,varName) => {
    input = checkString(input, varName);

    var splits = input.split(":");
    if (splits.length != 3) {
        throw new Error(`Error: ${varName} is not formatted in HH:MM:SS. Actual value: ${input}`);
    }
    if (splits[0].length != 2 || splits[1].length != 2 || splits[2].length != 2) {
        throw new Error(`Error: ${varName} is not formatted in HH:MM:SS. Actual value: ${input}`);
    }

    parseHMS(input,varName);
    return input;
}

//Takes a story object and returns what the author(s) are.
//Returns either the author(s), anonymous, or null depending on what is supplied in the object.
export const getAuthor = (story) => {
    if(story.IsAnonymous){
        return "anonymous";
    }
    if(story.IsPrivate){
        return null;
    }

    return "TBD";
}

export default {
    checkId, checkString, checkNumber, checkInt, checkUndef, checkNull, checkObj, checkArr, checkArrType,
    checkBool, parseMDY, formatMDY, checkMDY, formatHMS, parseHMS, checkHMS,getDefaultImage, getAuthor
}