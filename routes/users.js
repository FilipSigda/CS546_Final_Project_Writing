import { Router } from "express";

const router = Router();

router.route("/")
.get(async (req,res) => {
        res.status(200).json({res:"Temporary Response"});
    });

export default router;