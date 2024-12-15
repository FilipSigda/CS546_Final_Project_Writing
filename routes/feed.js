import { Router } from "express";

const router = Router();

router.route('/').get( async (req,res) => {
    res.status(200).json("THIS IS WHERE THE FEED SHOULD GO");
});

export default router;