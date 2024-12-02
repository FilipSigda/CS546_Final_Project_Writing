import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as helpers from '../helpers.js';

const createStoryObject = (obj) => {

}

const createPartialStoryObject = (obj) => {
    helpers.checkString(obj.Title,"Title");
    helpers.checkString(obj);
}

const createStory = (obj) => {

}

export default {createStory}