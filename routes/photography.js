const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const {
    readDatabase,
    writeDatabase
} = require("../utils/db");

// -----------------------------------------
// MULTER STORAGE
// -----------------------------------------

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            path.join(
                __dirname,
                "..",
                "uploads",
                "photography"
            )
        );

    },

    filename: (req, file, cb) => {

        const extension =
            path.extname(file.originalname);

        const filename =
            `${Date.now()}-${Math.round(
                Math.random() * 1E9
            )}${extension}`;

        cb(null, filename);

    }

});


// -----------------------------------------
// FILE FILTER
// -----------------------------------------

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, PNG and WEBP images are allowed."
            )
        );

    }

};


const upload = multer({
    storage,
    fileFilter
});


// -----------------------------------------
// GET ALL PHOTOGRAPHS
// -----------------------------------------

router.get("/", async (req, res) => {

    try {

        const db =
            await readDatabase();

        res.json({

            success: true,

            count:
                db.photography.length,

            data:
                db.photography

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Failed to fetch photography"

        });

    }

});


// -----------------------------------------
// GET SINGLE PHOTOGRAPH
// -----------------------------------------

router.get("/:id", async (req, res) => {

    try {

        const db =
            await readDatabase();

        const photo =
            db.photography.find(
                item =>
                    item.id ===
                    Number(req.params.id)
            );

        if (!photo) {

            return res.status(404).json({

                success: false,

                message:
                    "Photograph not found"

            });

        }

        res.json({

            success: true,

            data: photo

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Failed to fetch photograph"

        });

    }

});


// -----------------------------------------
// ADD PHOTOGRAPH
// -----------------------------------------

router.post(
    "/",
    upload.single("image"),
    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Photograph file is required"

                });

            }

            const caption =
                req.body.caption?.trim();
            const ratio =req.body.ratio || "1:1";

            if (!caption) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Caption is required"

                });

            }

            const db =
                await readDatabase();

            const newId =
                db.photography.length > 0
                    ? Math.max(
                        ...db.photography.map(
                            photo => photo.id
                        )
                    ) + 1
                    : 1;

            const newPhoto = {

                id: newId,

                image:
                    `/uploads/photography/${req.file.filename}`,

                caption: caption,
                ratio:ratio

            };

            db.photography.push(
                newPhoto
            );

            await writeDatabase(db);

            res.status(201).json({

                success: true,

                message:
                    "Photograph added successfully",

                data:
                    newPhoto

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Failed to add photograph"

            });

        }

    }
);


// -----------------------------------------
// UPDATE PHOTOGRAPH
// -----------------------------------------

router.put(
    "/:id",
    async (req, res) => {

        try {

            const db =
                await readDatabase();

            const photoIndex =
                db.photography.findIndex(
                    item =>
                        item.id ===
                        Number(req.params.id)
                );

            if (photoIndex === -1) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Photograph not found"

                });

            }

            const {
                image,
                caption,
                ratio
            } = req.body;

            if (
                image !== undefined
            ) {

                db.photography[
                    photoIndex
                ].image = image;

            }

            if (
                caption !== undefined
            ) {

                db.photography[
                    photoIndex
                ].caption = caption;

            }
            if (
                ratio !== undefined
            ) {
                db.photography[
                    photoIndex
                ].ratio = ratio;
            }

            await writeDatabase(db);

            res.json({

                success: true,

                message:
                    "Photograph updated successfully",

                data:
                    db.photography[
                        photoIndex
                    ]

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message:
                    "Failed to update photograph"

            });

        }

    }
);


// -----------------------------------------
// DELETE PHOTOGRAPH
// -----------------------------------------

router.delete(
    "/:id",
    async (req, res) => {

        try {

            const db =
                await readDatabase();

            const photoIndex =
                db.photography.findIndex(
                    item =>
                        item.id ===
                        Number(req.params.id)
                );

            if (photoIndex === -1) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Photograph not found"

                });

            }

            const deletedPhoto =
                db.photography.splice(
                    photoIndex,
                    1
                )[0];

            await writeDatabase(db);

            res.json({

                success: true,

                message:
                    "Photograph deleted successfully",

                data:
                    deletedPhoto

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message:
                    "Failed to delete photograph"

            });

        }

    }
);


module.exports = router;