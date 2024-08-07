const express = require('express');
const path = require('path'); // Require the path module
const app = express();
const port = 3000;

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Set the app to use ejs for rendering
app.set('view engine', 'ejs');

// Set location of static files
app.use(express.static(path.join(__dirname, 'public'))); // Use path.join to create the correct path

// Set up SQLite
const sqlite3 = require('sqlite3').verbose();

// Initialize the database
const dbFile = './database.db';
const dbSchemaFile = './db_schema.sql';

const fs = require('fs'); // Require the fs module

// Initialize SQLite database
global.db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error(err.message);
        process.exit(1); // bail out we can't connect to the DB
    } else {
        console.log("Database connected");
        global.db.run("PRAGMA foreign_keys=ON"); // tell SQLite to pay attention to foreign key constraints

        // Run the schema file to create tables and insert initial data
        const schema = fs.readFileSync(dbSchemaFile, 'utf8');
        global.db.exec(schema, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log("Database schema created and initial data inserted");
            }
        });
    }
});

app.get('/', (req, res) => {
    res.render('login'); // Use res.render to render the EJS template
});

app.get('/home', (req, res) => {
    res.render('home'); // Use res.render to render the EJS template
});



// Make the web application listen for HTTP requests
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
