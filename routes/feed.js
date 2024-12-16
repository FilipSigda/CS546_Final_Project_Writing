import { Router } from "express";

const router = Router();
router.route('/')
    .get(async (req, res) => {
        try {
            res.status(200).render('./homepage',{resultslist:false});
        } catch (e) {
            res.status(500).json({ error: e.message || "Error fetching Home" });
        }
    })

export default router;