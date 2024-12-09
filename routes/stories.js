import { Router } from "express";
import data from "../data/stories.js";
import debug from "../debug.js";

const router = Router();

router.route("/")
    .get(async (req, res) => {
        try {
            console.log("CREATED STORY");
            var createdObj = await debug.populateStories();
            res.status(200).json(createdObj);
        } catch (e) {
            if(typeof e === "string"){
                res.status(500).json(e);
            }else{
                res.status(500).json({error: e.message});
            }
        }
    });

    import { Router } from "express";
    import storyData from "../data/stories.js";
    
    
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



    
export default router;