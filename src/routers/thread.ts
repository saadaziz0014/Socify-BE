import Thread from '../models/Thread';
import express from 'express';
const router = express.Router();

router.post("/add", async (req, res) => {
    try {
        const { title, text, user } = req.body;
        if (!title || !text || !user) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const threads = await Thread.find({ user, isDeleted: false }).countDocuments();
        if (threads >= 5) {
            return res.status(400).json({ message: "Maximum 5 Threads per user" });
        }
        const thread = {
            title,
            text,
            user
        };
        const json = await Thread.create(thread);
        res.status(201).json(json);
    } catch (error: any) {
        res.status(500).json({ error: error.toString() })
    }
})

router.get("/all", async (req, res) => {
    try {
        const threads = await Thread.find({ isDeleted: false }).populate("user").sort({ createdAt: -1 });
        res.status(200).json(threads);
    } catch (error: any) {
        res.status(500).json({ error: error.toString() })
    }
})

router.post("/delete", async (req, res) => {
    try {
        const { id, user } = req.body;
        if (!id || !user) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const thread = await Thread.findOne({ _id: id, user, isDeleted: false });
        if (!thread) {
            return res.status(400).json({ message: "Thread does not exist" });
        }
        const json = await Thread.findByIdAndUpdate(id, { isDeleted: true });
        res.status(200).json(json);
    } catch (error: any) {
        res.status(500).json({ error: error.toString() })
    }
})

router.post("/update", async (req, res) => {
    try {
        const { id, title, text, user } = req.body;
        if (!id || !title || !text || !user) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const thread = await Thread.findOne({ _id: id, isDeleted: false, user });
        if (!thread) {
            return res.status(400).json({ message: "Thread does not exist" });
        }
        const json = await Thread.findByIdAndUpdate(id, { title, text });
        res.status(200).json(json);
    } catch (error: any) {
        res.status(500).json({ error: error.toString() })
    }
})

export default router