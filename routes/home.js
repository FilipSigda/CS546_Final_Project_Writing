import {Router} from "express";

const router = Router();

//Opens the homepage.
router.route("/")
.get(async (req,res) => {
    res.render("../views/homepage", {title: "Homepage"});
});

export default router;