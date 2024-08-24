const express = require("express");
const path = require("path"); // Require the path module
const session = require("express-session");
const app = express();
const port = 3000;

// Session configuration
app.use(
  session({
    secret: "your-secret-key", // Replace with a secure random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set `secure: true` if using HTTPS
  })
);

// Set the app to use ejs for rendering
app.set("view engine", "ejs");
app.use(express.json());
// Set location of static files
app.use(express.static(path.join(__dirname, "public"))); // Use path.join to create the correct path

// Set up SQLite

// Initialize the database
const db = "./database.db";
const dbSchemaFile = "./db_schema.sql";

const fs = require("fs"); // Require the fs module

// Initialize SQLite database
const sqlite3 = require("sqlite3").verbose();
global.db = new sqlite3.Database("./database.db", function (err) {
  if (err) {
    console.error(err);
    process.exit(1); // bail out we can't connect to the DB
  } else {
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON"); // tell SQLite to pay attention to foreign key constraints
  }
});

app.get("/", (req, res) => {
  res.render("login.ejs"); // Use res.render to render the EJS template
});

const signupRoutes = require("./routes/signup");
app.use("/signup", signupRoutes);

const homeRoutes = require("./routes/home");
app.use("/home", homeRoutes);

const bookingRoutes = require("./routes/booking");
app.use("/booking", bookingRoutes);

const recordsRoutes = require("./routes/records"); //
app.use("/records", recordsRoutes);

const historyRoutes = require("./routes/history"); //
app.use("/history", historyRoutes);

const loginRoutes = require("./routes/login");
app.use("/login", loginRoutes);

// Make the web application listen for HTTP requests
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
