import { Router } from "express";
import debug from "../debug.js";
import storyData from "../data/stories.js";
import groupData from "../data/groups.js";
import userData from "../data/users.js";
import helpers from "../helpers.js";

const router = Router();

router.route("/")
    //post should be used for creating stories
    .post(async (req, res) => {
        try {
            var id = req.params.id;
            helpers.checkString(id);

        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    });


router.route("/search")
    .get(async (req, res) => {
        try {
            // converting to proper types
            const searchParams = {
                // Name 
                name: req.query.name,
                excludeName: req.query.excludeName,

                // Date 
                startDate: req.query.startDate,
                endDate: req.query.endDate,

                // Status (complete, hiatus, dropped)
                status: req.query.status,
                excludeStatus: req.query.excludeStatus,

                // Ratings
                minRating: req.query.minRating ? parseFloat(req.query.minRating) : undefined,
                maxRating: req.query.maxRating ? parseFloat(req.query.maxRating) : undefined,
                minRatingCount: req.query.minRatingCount ? parseInt(req.query.minRatingCount) : undefined,

                // Group exclusive?
                groupExclusive: req.query.groupExclusive === 'true',

                // Tags
                tags: req.query.tags ? req.query.tags.split(',') : undefined,
                excludeTags: req.query.excludeTags ? req.query.excludeTags.split(',') : undefined,

                // Length
                minLength: req.query.minLength ? parseInt(req.query.minLength) : undefined,
                maxLength: req.query.maxLength ? parseInt(req.query.maxLength) : undefined,

                // Picture
                hasPicture: req.query.hasPicture === 'true',

                // Description
                descriptionKeyword: req.query.descriptionKeyword,

                // Paging Results
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 10
            };

            // Remove undefined values
            Object.keys(searchParams).forEach(key =>
                searchParams[key] === undefined && delete searchParams[key]
            );

            const results = await storyData.searchStories(searchParams);
            res.status(200).json(results);
        } catch (e) {
            if (e.message.startsWith('Invalid search parameters:')) {
                res.status(400).json({ error: e.message });
            } else {
                res.status(500).json({ error: 'An unexpected error occurred during story search.' });
            }
        }
    });


router.route('/:id')
    .get(async (req, res) => {
        try {
            //story read page TODO: make pretty and use handlebars
            var story = await storyData.getStoryById(req.params.id);

            console.log(req.session);

            var authorlist = [story.AuthorId];
            // if(story.GroupId){
            //     var group = await groupData.getGroupById();
            //     console.log(group);
            // }
            var authorhtml = "";
            for(let i=0;i<authorlist.length;i++){
                var authorobj = await userData.getUserById(authorlist[i]);
                authorhtml += `<a href='/users/${authorobj._id}'>${authorobj.Username}</a>`
                if(i<authorlist.length - 1){
                    authorhtml += ', ';
                }
            }

            var chapterhtml = "";
            for(let i=0;i<story.Body.length;i++){
                chapterhtml += `<li><h2 id="${'ch'+i}">${story.Body[i].Title}</h2><p>${story.Body[i].Text}</h2></li>`;
            }

            res.render("readstory",{
                title: story.Title,
                authors:authorhtml,
                imglink:story.Picture,
                description:story.description,
                chapters:chapterhtml
            });
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    })
    //this will be mainly used for updating subdocuments like comments and ratings
    .patch(async (req,res) => {
        try{
            var story = await storyData.updateStory(req.params.id,req.body);
            res.status(200).json(story); // REPLACE WITH RENDER
        }catch(e){
            res.status(400).json({error: e.message});
        }
    });


export default router;