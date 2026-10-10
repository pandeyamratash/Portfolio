const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
    readDatabase,
    writeDatabase
} = require("../utils/db");

const router = express.Router();

// =========================================================
// DESIGN IMAGE UPLOAD
// =========================================================

const designUploadDir = path.join(
    __dirname,
    "..",
    "uploads",
    "design"
);

if (!fs.existsSync(designUploadDir)) {
    fs.mkdirSync(
        designUploadDir,
        { recursive: true }
    );
}

const designStorage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            designUploadDir
        );

    },

    filename: (req, file, cb) => {

        const extension =
            path.extname(
                file.originalname
            );

        const baseName =
            path.basename(
                file.originalname,
                extension
            )
            .replace(
                /[^a-zA-Z0-9-_]/g,
                "-"
            )
            .toLowerCase();

        cb(
            null,
            `${Date.now()}-${baseName}${extension}`
        );

    }

});

const designUpload =
    multer({
        storage: designStorage
    });


router.post(
    "/upload",
    designUpload.single("image"),
    (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    message:
                        "No image uploaded."

                });

            }

            const imagePath =
                `/uploads/design/${req.file.filename}`;

            res.json({

                success: true,

                message:
                    "Design image uploaded successfully.",

                data: {
                    image: imagePath
                }

            });

        } catch (error) {

            console.error(
                "Design image upload error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to upload design image."

            });

        }

    }
);

// =========================================================
// GET ALL DESIGNING DATA
// =========================================================

router.get("/", async (req, res) => {

    try {

        const db = await readDatabase();

        const designing = db.designing || {
            posterGrid: [],
            featuredPosters: []
        };

        res.json({
            success: true,
            data: designing
        });

    } catch (error) {

        console.error(
            "Designing GET error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load designing data."
        });

    }

});


// =========================================================
// UPDATE ENTIRE DESIGNING DATA
// =========================================================

router.put("/", async (req, res) => {

    try {

        const db = await readDatabase();

        const {
            posterGrid,
            featuredPosters
        } = req.body;

        db.designing = {

            posterGrid:
                Array.isArray(posterGrid)
                    ? posterGrid
                    : [],

            featuredPosters:
                Array.isArray(featuredPosters)
                    ? featuredPosters
                    : []

        };

        await writeDatabase(db);

        res.json({
            success: true,
            message: "Designing data updated successfully.",
            data: db.designing
        });

    } catch (error) {

        console.error(
            "Designing PUT error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update designing data."
        });

    }

});


// =========================================================
// ADD POSTER
// =========================================================

router.post("/posters", async (req, res) => {

    try {

        const db = await readDatabase();

        if (!db.designing) {

            db.designing = {
                posterGrid: [],
                featuredPosters: []
            };

        }

        if (!Array.isArray(db.designing.posterGrid)) {

            db.designing.posterGrid = [];

        }

        const posters =
            db.designing.posterGrid;

        const nextId =
            posters.length
                ? Math.max(
                    ...posters.map(
                        poster => Number(poster.id)
                    )
                ) + 1
                : 1;

        const poster = {

            id: nextId,

            title:
                req.body.title || "",

            category:
                req.body.category || "POSTER",

            year:
                Number(req.body.year) ||
                new Date().getFullYear(),

            image:
                req.body.image || "",

            url:
                req.body.url || "",

            ratio:
                req.body.ratio || "2:3",

            position:
                Number(req.body.position) ||
                posters.length + 1

        };

        posters.push(poster);

        await writeDatabase(db);

        res.status(201).json({

            success: true,

            message:
                "Poster added successfully.",

            data: poster

        });

    } catch (error) {

        console.error(
            "Poster POST error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to add poster."

        });

    }

});


// =========================================================
// UPDATE POSTER
// =========================================================

router.put("/posters/:id", async (req, res) => {

    try {

        const db = await readDatabase();

        if (
            !db.designing ||
            !Array.isArray(
                db.designing.posterGrid
            )
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Poster collection not found."

            });

        }

        const id =
            Number(req.params.id);

        const index =
            db.designing.posterGrid.findIndex(
                poster =>
                    Number(poster.id) === id
            );

        if (index === -1) {

            return res.status(404).json({

                success: false,

                message:
                    "Poster not found."

            });

        }

        db.designing.posterGrid[index] = {

            ...db.designing.posterGrid[index],

            ...req.body,

            id

        };

        await writeDatabase(db);

        res.json({

            success: true,

            message:
                "Poster updated successfully.",

            data:
                db.designing.posterGrid[index]

        });

    } catch (error) {

        console.error(
            "Poster PUT error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to update poster."

        });

    }

});


// =========================================================
// DELETE POSTER
// =========================================================

router.delete("/posters/:id", async (req, res) => {

    try {

        const db = await readDatabase();

        if (
            !db.designing ||
            !Array.isArray(
                db.designing.posterGrid
            )
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Poster collection not found."

            });

        }

        const id =
            Number(req.params.id);

        const posters =
            db.designing.posterGrid;

        const index =
            posters.findIndex(
                poster =>
                    Number(poster.id) === id
            );

        if (index === -1) {

            return res.status(404).json({

                success: false,

                message:
                    "Poster not found."

            });

        }

        const deleted =
            posters.splice(index, 1)[0];

        await writeDatabase(db);

        res.json({

            success: true,

            message:
                "Poster deleted successfully.",

            data:
                deleted

        });

    } catch (error) {

        console.error(
            "Poster DELETE error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to delete poster."

        });

    }

});


// =========================================================
// UPDATE FEATURED POSTERS
// =========================================================

router.put("/featured", async (req, res) => {

    try {

        const db = await readDatabase();

        if (!db.designing) {

            db.designing = {
                posterGrid: [],
                featuredPosters: []
            };

        }

        db.designing.featuredPosters =
            Array.isArray(req.body.featuredPosters)
                ? req.body.featuredPosters
                : [];

        await writeDatabase(db);

        res.json({

            success: true,

            message:
                "Featured posters updated successfully.",

            data:
                db.designing.featuredPosters

        });

    } catch (error) {

        console.error(
            "Featured PUT error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to update featured posters."

        });

    }

});


module.exports = router;