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
                res.status(500).json({error:e.message});
            }
        }
    });

export default router;