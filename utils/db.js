const fs = require("fs").promises;
const path = require("path");

const databasePath = path.join(
    __dirname,
    "..",
    "data",
    "db.json"
);


// =========================================
// READ DATABASE
// =========================================

async function readDatabase() {

    const data = await fs.readFile(
        databasePath,
        "utf-8"
    );

    return JSON.parse(data);
}


// =========================================
// WRITE DATABASE
// =========================================

async function writeDatabase(data) {

    await fs.writeFile(
        databasePath,
        JSON.stringify(data, null, 4),
        "utf-8"
    );

}


module.exports = {
    readDatabase,
    writeDatabase
};