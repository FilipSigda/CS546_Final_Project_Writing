import { ObjectId } from 'mongodb';

//checks variable for objectID
const checkId = (id, varName) => {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
        throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
}

const getDefaultImage = () => {
    return "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106";
}

const checkNull = (input, varName) => {
    if (input === null) {
        throw new Error(`Error: ${varName} is null`);
    }
}

const checkUndef = (input, varName) => {
    if (typeof input === "undefined") {//we're using typeof since false === undefined. This avoids that.
        throw new Error(`Error: ${varName} is undefined`);
    }
}

const checkBool = (input, varName) => {
    checkUndef(input,varName);
    checkNull(input,varName);
    if (typeof input !== "boolean") {
        throw new Error(`Error: ${varName} is not boolean`);
    }
}

const checkString = (strVal, varName) => {
    checkUndef(strVal,varName);
    checkNull(strVal,varName); 
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
        throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    return strVal;
}

//checks that value is an integer
const checkNumber = (input, varName) => {
    checkNull(input, varName);
    checkUndef(input, varName);
    if (!(typeof input === "number")) {
        throw new Error(`Error: ${varName} is not a number`);
    }
}

//checks that it is a number AND an integer
const checkInt = (input, varName) => {
    checkNumber(input, varName);
    if (!Number.isInteger(input)) {
        throw new Error(`Error: ${varName} is not an Integer`);
    }
    return Number.parseInt(input);
}

//checks that it is an object
const checkObj = (input, varName) => {
    checkNull(input, varName);
    checkUndef(input, varName);
    if (!(typeof input === "object")) {
        throw new Error(`Error: ${varName} is not an Object`);
    }
}

const checkArr = (input, varName) => {
    checkObj(input, varName);
    if (!Array.isArray(input)) {
        throw new Error(`Error: ${varName} is not an Array`);
    }
}

//checks that every element is the correct type
const checkArrType = (input, type, varName) => {
    checkArr(input, varName);
    for (let i = 0; i < input.length; i++) {
        if (typeof input[i] !== type) {
            throw new Error(`Error: value [ ${input[i]} ] in array "${varName[i]}" is type ${typeof input[i]} instead of ${type}`);
        }
    }
}

const checkMDY = (input, varName) => {
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
const parseMDY = (input, varName) => {

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

const formatMDY = (date) => {
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
const formatHMS = (date) => {
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

const parseHMS = (input,varName) => {
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

const checkHMS = (input,varName) => {
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

export default {
    checkId, checkString, checkNumber, checkInt, checkUndef, checkNull, checkObj, checkArr, checkArrType,
    checkBool, parseMDY, formatMDY, checkMDY, formatHMS, parseHMS, checkHMS,getDefaultImage
}