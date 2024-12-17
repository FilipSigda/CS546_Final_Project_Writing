import { Router } from "express";
import debug from "../debug.js";
import storyData from "../data/stories.js";
import groupData from "../data/groups.js";
import userData from "../data/users.js";
import helpers from "../helpers.js";
import xss from 'xss';

const router = Router();

const renderstory = async (req,res,story,error="") => {
    if(story.isPrivate){
        res.render('readstory',{title:"Story is privated"});
    }

    // gathering story rating and finding average rating
    const averageRating = story.Ratings && story.Ratings.length > 0 
        ? (story.Ratings.reduce((sum, rating) => sum + rating.Score, 0) / story.Ratings.length).toFixed(1)
        : 'Unrated';

    const totalRatings = story.Ratings ? story.Ratings.length : 0;

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
    var jumplinkhtml = "";
    for(let i=0;i<story.Body.length;i++){
        chapterhtml += `<li><h2 id="${'ch'+i}" name="Chapter ${i}">${story.Body[i].Title}</h2><p>${story.Body[i].Text}</h2></li>`;
        jumplinkhtml += `<li><a id='${'jl'+i}' href='#${'ch'+i}'>${story.Body[i].Title}</a></li>`
    }

    res.render("readstory",{
        title: story.Title,
        authors:authorhtml,
        imglink:story.Picture,
        description:story.description,
        chapters:chapterhtml,
        urlid:xss(req.params.id),
        loggedin:(typeof xss(req.session.user) !== "undefined"),
        jump_links:jumplinkhtml,
        previous:story.Previous,
        loggedin:(typeof req.session.user !== "undefined"),
        averageRating: averageRating,
        totalRatings: totalRatings
    });
}

router.route("/")
    //post should be used for creating stories
    .post(async (req, res) => {
        try {
            var id = xss(req.params.id);
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
                name: xss(req.query.name),
                excludeName: xss(req.query.excludeName),

                // Date 
                startDate: xss(req.query.startDate),
                endDate: xss(req.query.endDate),

                // Status (complete, hiatus, dropped)
                status: xss(req.query.status),
                excludeStatus: xss(req.query.excludeStatus),

                // Ratings
                minRating: xss(req.query.minRating) ? parseFloat(xss(req.query.minRating)) : undefined,
                maxRating: xss(req.query.maxRating) ? parseFloat(xss(req.query.maxRating)) : undefined,
                minRatingCount: xss(req.query.minRatingCount) ? parseInt(xss(req.query.minRatingCount)) : undefined,

                // Group exclusive?
                groupExclusive: xss(req.query.groupExclusive) === 'true',

                // Tags
                tags: xss(req.query.tags) ? xss(req.query.tags).split(',') : undefined,
                excludeTags: xss(req.query.excludeTags) ? xss(req.query.excludeTags).split(',') : undefined,

                // Length
                minLength: xss(req.query.minLength) ? parseInt(xss(req.query.minLength)) : undefined,
                maxLength: xss(req.query.maxLength) ? parseInt(xss(req.query.maxLength)) : undefined,

                // Picture
                hasPicture: xss(req.query.hasPicture) === 'true',

                // Description
                descriptionKeyword: xss(req.query.descriptionKeyword),

                // Paging Results
                page: xss(req.query.page) ? parseInt(xss(req.query.page)) : 1,
                limit: xss(req.query.limit) ? parseInt(xss(req.query.limit)) : 10
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
            var story = await storyData.getStoryById(xss(req.params.id));

            renderstory(req,res,story);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    })
    .post(async (req,res) => {
        try{
            if(req.session.user){
                var user = await userData.getUserById(xss(req.session.user._id));
                
                var story = await storyData.createDefaultStory(user._id);
                story = await storyData.getStoryById(story.insertedId.toString());

                story.Previous = xss(req.params.id);

                const sid = story._id;
                delete story._id;
                /*TODO validation if they are allowed to create an offshoot story here*/

                var updated = await storyData.updateStory(sid.toString(),story);

                res.redirect('/stories/'+updated._id+'/edit');
            }else{
                res.redirect('/users/signupuser');
            }

        }catch(e){
            res.status(400).json({error:e.message});
        }
    })
    //this will be mainly used for updating subdocuments like comments and ratings
    .patch(async (req,res) => {
        try {
            if (!xss(req.session.user)) {
                return res.status(401).json({ error: "You must be logged in to rate a story" });
            }
            const userId = xss(req.session.user._id);

            var story = await storyData.updateStory(xss(req.params.id), xss(req.body), userId);
            
            // if rating was added, update the user's writing score
            if (xss(req.body.Ratings) && xss(req.body.Ratings.length) > 0) {
                await updateUserWritingScore(story.AuthorId);
            }

            res.status(200).json(story);
        } catch(e) {
            res.status(400).json({error: e.message});
        }
    });

// helper function to update user's writing score
const updateUserWritingScore = async (authorId) => {
    // get all stories by author (including group stories)
    const authorStories = await storyData.searchStories({
        AuthorId: authorId,
        IsAnonymous: false
    });

    // calculate total ratings and number of stories
    let totalRatings = 0;
    let storyCount = 0;

    authorStories.stories.forEach(story => {
        if (story.Ratings.length > 0) {
            totalRatings += story.Ratings.reduce((sum, rating) => sum + rating.Score, 0);
            storyCount++;
        }
    });

    // calculate writing score
    const writingScore = storyCount > 0 ? totalRatings / storyCount : 0;

    // update user's writing score
    await userData.updateUserProfile(authorId, { writingScore });
};

    router.route('/:id/download')
    .get(async (req, res) => {
        try {
            
            const story = await storyData.getStoryById(xss(req.params.id));

            
            let fileContent = `${story.Title}\n\n`;
            
            
            if (story.Description) {
                fileContent += `Description: ${story.Description}\n\n`;
            }

            
            story.Body.forEach((chapter, index) => {
                fileContent += `Chapter ${index + 1}: ${chapter.Title}\n\n`;
                fileContent += `${chapter.Text}\n\n`;
            });

            
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', `attachment; filename="${story.Title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt"`);
            
            
            res.send(fileContent);
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    });


    router.route('/:id/edit')
    .get(async (req,res) =>{
        try{
            res.render('editstory',{});
        }catch(e){
            res.status(400).json({error: e.message});
        }
    });

export default router;