import { Router } from "express";
import groups from "../data/groups.js";

const router = Router();

// GET all groups
router.route("/")
    .get(async (req, res) => {
        try {
            const allGroups = await groups.getAllGroups();
            res.status(200).json(allGroups);
        } catch (e) {
            res.status(500).json({ error: e.message || "Error fetching groups" });
        }
    })
    // POST to create a new group
    .post(async (req, res) => {
        try {
            const { name, bio, members, stories } = xss(req.body);
            
            // defaults to empty arrays if members or stories not provided
            const newGroup = await groups.createGroup(
                name, 
                bio, 
                members || [], 
                stories || []
            );
            
            res.status(201).json(newGroup);
        } catch (e) {
            res.status(400).json({ error: e.message || "Error creating group" });
        }
    });

// GET group by ID
router.route("/:id")
    .get(async (req, res) => {
        try {
            const group = await groups.getGroupById(xss(req.params.id));
            res.status(200).json(group);
        } catch (e) {
            if (e === "No group with that id.") {
                res.status(404).json({ error: e });
            } else {
                res.status(500).json({ error: e.message || "Error fetching group" });
            }
        }
    })
    // PUT to update a group
    .put(async (req, res) => {
        try {
            const updatedGroup = await groups.updateGroup(xss(req.params.id), xss(req.body));
            res.status(200).json(updatedGroup);
        } catch (e) {
            res.status(400).json({ error: e.message || "Error updating group" });
        }
    })
    // DELETE a group
    .delete(async (req, res) => {
        try {
            const result = await groups.deleteGroup(xss(req.params.id));
            res.status(200).json(result);
        } catch (e) {
            res.status(400).json({ error: e.message || "Error deleting group" });
        }
    });

// GET group by name
router.route("/name/:name")
    .get(async (req, res) => {
        try {
            const group = await groups.getGroupByName(xss(req.params.name));
            if (group === null) {
                return res.status(404).json({ error: "No group found with that name" });
            }
            res.status(200).json(group);
        } catch (e) {
            res.status(500).json({ error: e.message || "Error fetching group by name" });
        }
    });

export default router;