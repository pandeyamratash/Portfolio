const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// -----------------------------
// ROUTES
// -----------------------------

const photographyRoutes = require("./routes/photography");
const storytellingRoutes = require("./routes/storytelling");
const developmentRoutes = require("./routes/Development");
const designingRoutes = require("./routes/design");

// -----------------------------
// APP
// -----------------------------

const app = express();

const PORT = process.env.PORT || 5000;

// -----------------------------
// MIDDLEWARE
// -----------------------------

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// -----------------------------
// STATIC FILES
// -----------------------------

// Public website
app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// Admin CMS
app.use(
    "/admin",
    express.static(
        path.join(__dirname, "admin")
    )
);

// Uploaded files
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// -----------------------------
// API ROUTES
// -----------------------------

app.use(
    "/api/photography",
    photographyRoutes
);

app.use(
    "/api/storytelling",
    storytellingRoutes
);

app.use(
    "/api/development",
    developmentRoutes
);

app.use(
    "/api/designing",
    designingRoutes
);

// -----------------------------
// PUBLIC WEBSITE
// -----------------------------

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});

// -----------------------------
// ADMIN ACCOUNT
// -----------------------------

app.get("/admin/account", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "admin",
            "account.html"
        )
    );

});

// -----------------------------
// ADMIN DASHBOARD
// -----------------------------

app.get("/admin/dashboard", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "admin",
            "index.html"
        )
    );

});

// -----------------------------
// ADMIN PHOTOGRAPHY
// -----------------------------

app.get("/admin/photography", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "admin",
            "components",
            "photography.html"
        )
    );

});

app.get("/admin/storytelling", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "admin",
            "components",
            "storytelling.html"
        )
    );

});

// -----------------------------
// TEST API
// -----------------------------

app.get("/api/test", (req, res) => {

    res.json({
        success: true,
        message: "Portfolio API is running"
    });

});

// -----------------------------
// 404
// -----------------------------

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found"
    });

});

// -----------------------------
// START SERVER
// -----------------------------

app.listen(PORT, () => {

    console.log(
        `Portfolio running at http://localhost:${PORT}`
    );

});