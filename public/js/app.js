console.log("Amratansh Portfolio loaded.");


// =========================================
// PUBLIC PHOTOGRAPHY
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    loadPublicPhotography();
    loadPublicStorytelling();
    loadPublicDevelopment();
});

// =========================================
// LOAD
// =========================================

async function loadPublicPhotography() {

    try {

        const response =
            await fetch(
                "/api/photography"
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load photography"
            );

        }


        renderPublicPhotography(
            data.data
        );


    } catch (error) {

        console.error(
            "Photography error:",
            error
        );

    }

}


// =========================================
// RENDER
// =========================================

function renderPublicPhotography(
    photos
) {

    const firstGrid =
        document.querySelector(
            "#photography1 .photo-grid"
        );


    const secondGrid =
        document.querySelector(
            "#photography2 .photo-grid"
        );


    if (!firstGrid || !secondGrid) {

        console.warn(
            "Photography grids not found."
        );

        return;

    }


    /*
     * FIXED PUBLIC LAYOUT
     *
     * 1, 2, 3 → first grid
     * 4, 5    → second grid
     */

    const fixedPhotos =
        photos
            .sort(
                (a, b) =>
                    Number(a.id) -
                    Number(b.id)
            )
            .slice(0, 5);


    firstGrid.innerHTML = "";

    secondGrid.innerHTML = "";


    fixedPhotos
        .slice(0, 3)
        .forEach(
            (photo) => {

                firstGrid.appendChild(
                    createPhotoCard(
                        photo
                    )
                );

            }
        );


    fixedPhotos
        .slice(3, 5)
        .forEach(
            (photo) => {

                secondGrid.appendChild(
                    createPhotoCard(
                        photo
                    )
                );

            }
        );

}


// =========================================
// CREATE CARD
// =========================================

function createPhotoCard(
    photo
) {

    const figure =
        document.createElement(
            "figure"
        );


    figure.className =
        "photo-card";


    const image =
        document.createElement(
            "img"
        );


    image.src =
        photo.image;


    image.alt =
        photo.caption ||
        "Photography";


    image.loading =
        "lazy";


    const caption =
        document.createElement(
            "figcaption"
        );


    caption.textContent =
        photo.caption ||
        "";


    figure.appendChild(
        image
    );


    figure.appendChild(
        caption
    );


    return figure;

}
// ========================================
// PUBLIC STORYTELLING
// ========================================

async function loadPublicStorytelling() {
    try {
        const response = await fetch("/api/storytelling");
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Failed to load storytelling"
            );
        }

        renderPublicStorytelling(result.data);

    } catch (error) {
        console.error("Storytelling error:", error);
    }
}


// ========================================
// RENDER PUBLIC STORIES
// ========================================

function renderPublicStorytelling(stories) {

    const storyList =
        document.querySelector("#storytelling .story-list");

    if (!storyList) {
        console.warn("Story list not found.");
        return;
    }

    const sortedStories = [...stories].sort(
        (a, b) =>
            Number(a.position) - Number(b.position)
    );

    storyList.innerHTML = "";

    sortedStories.forEach((story, index) => {

        const article =
            document.createElement("article");

        article.className = "story";

        // --------------------------------
        // STORY TITLE / CONTENT
        // --------------------------------

        const blockquote =
            document.createElement("blockquote");

        blockquote.textContent =
    story.title || "";
    if (story.description) {
        const description =
        document.createElement("span");
        description.textContent =
        story.description;

    blockquote.appendChild(
        document.createElement("br")
    );

    blockquote.appendChild(
        description
    );
}

        // --------------------------------
        // STORY META
        // --------------------------------

        const meta =
            document.createElement("div");

        meta.className = "story-meta";

        meta.textContent =
            `${story.category || ""} · ${story.year || ""}`;

        // --------------------------------
        // BUILD STORY
        // --------------------------------

        article.appendChild(blockquote);
        article.appendChild(meta);

        // --------------------------------
        // OPTIONAL STORY URL
        // --------------------------------

        if (story.url) {

            article.style.cursor = "pointer";

            article.addEventListener("click", () => {

                window.open(
                    story.url,
                    "_blank"
                );

            });

        }

        storyList.appendChild(article);

        // --------------------------------
        // PRESERVE ORIGINAL SPACING
        // --------------------------------

        if (index === 0) {

            const spacer =
                document.createElement("br");

            storyList.appendChild(spacer);

            storyList.appendChild(
                document.createElement("br")
            );

            storyList.appendChild(
                document.createElement("br")
            );
        }

    });
}


// ========================================
// ESCAPE PUBLIC HTML
// ========================================

function escapePublicHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}
/* =========================================================
   PUBLIC DEVELOPMENT
   ========================================================= */

async function loadPublicDevelopment() {

    try {

        const response =
            await fetch("/api/development");

        const data =
            await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message ||
                "Failed to load development."
            );
        }

        renderPublicDevelopment(data.data);

    } catch (error) {

        console.error(
            "Development error:",
            error
        );

    }

}


/* =========================================================
   DEVELOPMENT RENDERER
   ========================================================= */

function renderPublicDevelopment(development) {

    renderPublicProjects(
        development.projects || []
    );

    renderPublicSkills(
        development.skills || []
    );

    renderPublicCertificates(
        development.certificates || []
    );

}


/* =========================================================
   PROJECTS
   ========================================================= */

function renderPublicProjects(projects) {

    const grid =
        document.getElementById(
            "publicProjectsGrid"
        );

    if (!grid) return;

    const sortedProjects =
        [...projects].sort(
            (a, b) =>
                Number(a.position) -
                Number(b.position)
        );

    grid.innerHTML = "";

    sortedProjects.forEach(project => {

        const card =
            document.createElement("a");

        card.className =
            "project-card";

        card.href =
            project.url || "#";

        if (project.url) {
            card.target = "_blank";
            card.rel = "noopener noreferrer";
        }

        const tagsHTML =
            (project.tags || [])
                .map(tag => `
                    <span>
                        ${escapeHTML(tag)}
                    </span>
                `)
                .join("");

        card.innerHTML = `

            <div class="project-image">

                ${
                    project.image
                        ? `
                            <img
                                src="${escapeHTML(project.image)}"
                                alt="${escapeHTML(project.title || "Project")}"
                            >
                        `
                        : ""
                }

            </div>


            <div class="project-content">

                <div class="project-top">

                    <span class="project-category">
                        ${escapeHTML(project.category || "")}
                    </span>

                    <span class="project-year">
                        ${escapeHTML(project.year || "")}
                    </span>

                </div>


                <h4>
                    ${escapeHTML(project.title || "")}
                </h4>


                <p>
                    ${escapeHTML(project.description || "")}
                </p>


                <div class="project-tags">

                    ${tagsHTML}

                </div>

            </div>
        `;

        grid.appendChild(card);

    });

}


/* =========================================================
   SKILLS
   ========================================================= */

function renderPublicSkills(skills) {

    const grid =
        document.getElementById(
            "publicSkillsGrid"
        );

    if (!grid) return;

    const sortedSkills =
        [...skills].sort(
            (a, b) =>
                Number(a.position) -
                Number(b.position)
        );

    grid.innerHTML = "";

    sortedSkills.forEach((skill, index) => {

        const card =
            document.createElement("div");

        card.className =
            "skill-card";

        const tags =
            Array.isArray(skill.tags)
                ? skill.tags
                : String(skill.description || "")
                    .split("·")
                    .map(item => item.trim())
                    .filter(Boolean);

        card.innerHTML = `

            <span class="skill-number">
                ${String(index + 1).padStart(2, "0")}
            </span>

            <h4>
                ${escapeHTML(skill.title || "")}
            </h4>

            <p>
                ${escapeHTML(tags.join(" · "))}
            </p>
        `;

        grid.appendChild(card);

    });

}


/* =========================================================
   CERTIFICATES
   ========================================================= */

function renderPublicCertificates(certificates) {

    const grid =
        document.getElementById(
            "publicCertificatesGrid"
        );

    if (!grid) return;

    const sortedCertificates =
        [...certificates].sort(
            (a, b) =>
                Number(a.position) -
                Number(b.position)
        );

    grid.innerHTML = "";

    sortedCertificates.forEach(certificate => {

        const card =
            document.createElement("a");

        card.className =
            "certificate-card";

        card.href =
            certificate.url ||
            certificate.image ||
            "#";

        if (
            certificate.url ||
            certificate.image
        ) {
            card.target = "_blank";
            card.rel = "noopener noreferrer";
        }

        const preview =
            certificate.image
                ? `
                    <img
                        src="${escapeHTML(certificate.image)}"
                        alt="${escapeHTML(certificate.title || "Certificate")}"
                    >
                  `
                : `
                    <span>
                        ${String(certificate.position)
                            .padStart(2, "0")}
                    </span>
                  `;

        card.innerHTML = `

            <div class="certificate-preview">

                ${preview}

            </div>


            <div class="certificate-info">

                <h4>
                    ${escapeHTML(certificate.title || "")}
                </h4>

                <p>
                    ${escapeHTML(
                        certificate.organization ||
                        certificate.issuer ||
                        ""
                    )}
                </p>

                <span class="certificate-year">
                    ${escapeHTML(certificate.year || "")}
                </span>

            </div>
        `;

        grid.appendChild(card);

    });

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}