const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
    readDatabase,
    writeDatabase
} = require("../utils/db");
const projectsUploadDir = path.join(
    __dirname,
    "..",
    "uploads",
    "projects"
);

if (!fs.existsSync(projectsUploadDir)) {
    fs.mkdirSync(projectsUploadDir, {
        recursive: true
    });
}

const projectStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, projectsUploadDir);
    },

    filename: (req, file, cb) => {
        const extension =
            path.extname(file.originalname);

        const baseName =
            path.basename(
                file.originalname,
                extension
            )
            .replace(/[^a-zA-Z0-9-_]/g, "-")
            .toLowerCase();

        cb(
            null,
            `${Date.now()}-${baseName}${extension}`
        );
    }
});

const projectUpload = multer({
    storage: projectStorage
});


// ======================================================
// GET COMPLETE DEVELOPMENT SECTION
// ======================================================

router.get("/", async (req, res) => {
    try {

        const db = await readDatabase();

        res.json({
            success: true,
            data: db.development
        });

    } catch (error) {

        console.error(
            "Error fetching development:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch development data"
        });

    }
});
router.post(
    "/projects/upload",
    projectUpload.single("image"),
    (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No image uploaded"
                });
            }

            const imagePath =
                `/uploads/projects/${req.file.filename}`;

            res.json({
                success: true,
                message: "Project image uploaded successfully",
                data: {
                    image: imagePath
                }
            });

        } catch (error) {

            console.error(
                "Project image upload error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Failed to upload project image"
            });
        }
    }
);


// ======================================================
// UPDATE COMPLETE DEVELOPMENT SECTION
// ======================================================

router.put("/", async (req, res) => {
    try {

        const db = await readDatabase();

        const {
            projects,
            skills,
            certificates
        } = req.body;


        if (projects !== undefined) {
            db.development.projects = projects;
        }

        if (skills !== undefined) {
            db.development.skills = skills;
        }

        if (certificates !== undefined) {
            db.development.certificates = certificates;
        }


        await writeDatabase(db);


        res.json({
            success: true,
            message: "Development section updated successfully",
            data: db.development
        });

    } catch (error) {

        console.error(
            "Error updating development:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update development data"
        });

    }
});


// ======================================================
// ADD PROJECT
// ======================================================

router.post("/projects", async (req, res) => {
    try {

        const db = await readDatabase();

        const {
            title,
            category,
            year,
            image,
            description,
            tags,
            url
        } = req.body;


        if (!title || !category || !description) {

            return res.status(400).json({
                success: false,
                message:
                    "Title, category and description are required"
            });

        }


        const newId =
            db.development.projects.length > 0
                ? Math.max(
                    ...db.development.projects.map(
                        project => Number(project.id)
                    )
                ) + 1
                : 1;


        const newProject = {
            id: newId,
            title,
            category,
            year: Number(year) || new Date().getFullYear(),
            image: image || "",
            description,
            tags: Array.isArray(tags) ? tags : [],
            url: url || "",
            position: newId
        };


        db.development.projects.push(newProject);

        await writeDatabase(db);


        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: newProject
        });

    } catch (error) {

        console.error(
            "Error creating project:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to create project"
        });

    }
});


// ======================================================
// UPDATE PROJECT
// ======================================================

router.put("/projects/:id", async (req, res) => {
    try {

        const db = await readDatabase();

        const id = Number(req.params.id);

        const projectIndex =
            db.development.projects.findIndex(
                project => Number(project.id) === id
            );


        if (projectIndex === -1) {

            return res.status(404).json({
                success: false,
                message: "Project not found"
            });

        }


        const existing =
            db.development.projects[projectIndex];


        const updatedProject = {
            ...existing,

            ...req.body,

            id: existing.id,

            year:
                req.body.year !== undefined
                    ? Number(req.body.year)
                    : existing.year,

            tags:
                req.body.tags !== undefined
                    ? (
                        Array.isArray(req.body.tags)
                            ? req.body.tags
                            : []
                    )
                    : existing.tags
        };


        db.development.projects[projectIndex] =
            updatedProject;


        await writeDatabase(db);


        res.json({
            success: true,
            message: "Project updated successfully",
            data: updatedProject
        });

    } catch (error) {

        console.error(
            "Error updating project:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update project"
        });

    }
});


// ======================================================
// DELETE PROJECT
// ======================================================

router.delete("/projects/:id", async (req, res) => {
    try {

        const db = await readDatabase();

        const id = Number(req.params.id);

        const projectIndex =
            db.development.projects.findIndex(
                project => Number(project.id) === id
            );


        if (projectIndex === -1) {

            return res.status(404).json({
                success: false,
                message: "Project not found"
            });

        }


        const deleted =
            db.development.projects.splice(
                projectIndex,
                1
            )[0];


        await writeDatabase(db);


        res.json({
            success: true,
            message: "Project deleted successfully",
            data: deleted
        });

    } catch (error) {

        console.error(
            "Error deleting project:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to delete project"
        });

    }
});


// ======================================================
// UPDATE SKILLS
// ======================================================

router.put("/skills", async (req, res) => {
    try {

        const db = await readDatabase();

        if (!Array.isArray(req.body.skills)) {

            return res.status(400).json({
                success: false,
                message: "Skills must be an array"
            });

        }


        db.development.skills =
            req.body.skills;


        await writeDatabase(db);


        res.json({
            success: true,
            message: "Skills updated successfully",
            data: db.development.skills
        });

    } catch (error) {

        console.error(
            "Error updating skills:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update skills"
        });

    }
});


// ======================================================
// UPDATE CERTIFICATES
// ======================================================

router.put("/certificates", async (req, res) => {
    try {

        const db = await readDatabase();

        if (!Array.isArray(req.body.certificates)) {

            return res.status(400).json({
                success: false,
                message: "Certificates must be an array"
            });

        }


        db.development.certificates =
            req.body.certificates;


        await writeDatabase(db);


        res.json({
            success: true,
            message: "Certificates updated successfully",
            data: db.development.certificates
        });

    } catch (error) {

        console.error(
            "Error updating certificates:",
            error
        );

        res.status(200).json({
            success: true,
            message: "Certificates updated successfully",
            data: db.development.certificates
        });

    }
});


module.exports = router;