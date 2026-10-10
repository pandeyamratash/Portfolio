const express = require("express");
const router = express.Router();

const {
    readDatabase,
    writeDatabase
} = require("../utils/db");

// =============================
// GET ALL STORIES
// =============================

router.get("/", async (req, res) => {
    try {
        const db = await readDatabase();

        res.json({
            success: true,
            data: db.storytelling
        });
    } catch (error) {
        console.error("Error fetching stories:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch stories"
        });
    }
});

// =============================
// GET STORY BY ID
// =============================

router.get("/:id", async (req, res) => {
    try {
        const db = await readDatabase();

        const story = db.storytelling.find(
            item => item.id === Number(req.params.id)
        );

        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Story not found"
            });
        }

        res.json({
            success: true,
            data: story
        });
    } catch (error) {
        console.error("Error fetching story:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch story"
        });
    }
});

// =============================
// CREATE STORY
// =============================

router.post("/", async (req, res) => {
    try {
        const db = await readDatabase();

        const {
            title,
            description,
            category,
            year,
            url,
            position
        } = req.body;

        // Validation
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required"
            });
        }

        // Generate new ID
        const newId =
            db.storytelling.length > 0
                ? Math.max(
                    ...db.storytelling.map(item => item.id)
                ) + 1
                : 1;

        const newStory = {
            id: newId,
            title,
            description,
            category: category || "JOURNAL",
            year: Number(year) || new Date().getFullYear(),
            url: url || "",
            position: Number(position) || newId
        };

        db.storytelling.push(newStory);

        await writeDatabase(db);

        res.status(201).json({
            success: true,
            message: "Story created successfully",
            data: newStory
        });

    } catch (error) {
        console.error("Error creating story:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create story"
        });
    }
});

// =============================
// UPDATE STORY
// =============================

router.put("/:id", async (req, res) => {
    try {
        const db = await readDatabase();

        const storyIndex = db.storytelling.findIndex(
            item => item.id === Number(req.params.id)
        );

        if (storyIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Story not found"
            });
        }

        const existingStory =
            db.storytelling[storyIndex];

        const {
            title,
            description,
            category,
            year,
            url,
            position
        } = req.body;

        db.storytelling[storyIndex] = {
            ...existingStory,

            title:
                title !== undefined
                    ? title
                    : existingStory.title,

            description:
                description !== undefined
                    ? description
                    : existingStory.description,

            category:
                category !== undefined
                    ? category
                    : existingStory.category,

            year:
                year !== undefined
                    ? Number(year)
                    : existingStory.year,

            url:
                url !== undefined
                    ? url
                    : existingStory.url,

            position:
                position !== undefined
                    ? Number(position)
                    : existingStory.position
        };

        await writeDatabase(db);

        res.json({
            success: true,
            message: "Story updated successfully",
            data: db.storytelling[storyIndex]
        });

    } catch (error) {
        console.error("Error updating story:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update story"
        });
    }
});

// =============================
// DELETE STORY
// =============================

router.delete("/:id", async (req, res) => {
    try {
        const db = await readDatabase();

        const storyIndex = db.storytelling.findIndex(
            item => item.id === Number(req.params.id)
        );

        if (storyIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Story not found"
            });
        }

        const deletedStory =
            db.storytelling.splice(storyIndex, 1)[0];

        await writeDatabase(db);

        res.json({
            success: true,
            message: "Story deleted successfully",
            data: deletedStory
        });

    } catch (error) {
        console.error("Error deleting story:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete story"
        });
    }
});

module.exports = router;