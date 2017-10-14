const Sequelize = require("sequelize");
const db = require("../src/data/database.js");
const seed = require("../src/data/seed.js");

db.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    seed();
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});


