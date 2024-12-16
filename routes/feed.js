import { Router } from "express";
import data from '../data/stories.js';

const router = Router();

router.route('/').get( async (req,res) => {
    let recent = await data.getMostRecent(5);
    let views = await data.getHighestViews(5);

    res.render("../views/homepage", {title: "Homepage", viewedResultsList: views, recentResultsList: recent});
});

export default router;