const express = require("express"); // Require the Express framework
const path = require("path"); // Require the path module for handling file paths
const session = require("express-session"); // Require the express-session module for session management
const app = express(); // Initialize the Express app
const port = 3000; // Define the port to listen on

//configure the session of middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

//require body parser and use of body parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Set the app to use ejs for rendering HTML
app.set("view engine", "ejs");
app.use(express.json());
// Set location of static files
app.use(express.static(path.join(__dirname, "public"))); // Use path.join to create the correct path

// Initialize the path to database
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

//Define route for the root URL ("/") and render the login page
app.get("/", (req, res) => {
  res.render("login.ejs"); // Use res.render to render to login page
});

//require to handle on various routes
const signupRoutes = require("./routes/signup"); //import signup route
app.use("/signup", signupRoutes); //use signup route for "/signup" URL

const homeRoutes = require("./routes/home"); //import home route
app.use("/home", homeRoutes);

const bookingRoutes = require("./routes/booking"); //import booking route
app.use("/booking", bookingRoutes);

const recordsRoutes = require("./routes/records"); //import record route
app.use("/records", recordsRoutes);

const loginRoutes = require("./routes/login"); //import login route
app.use("/login", loginRoutes);

const chatRoutes = require("./routes/chat"); //import chat route
app.use("/chat", chatRoutes);

const uploadRecRoutes = require("./routes/upload_med"); //import upload_med route
app.use("/upload_med", uploadRecRoutes);

const medReportRoutes = require("./routes/med_report"); //import med_report route
app.use("/med_report", medReportRoutes);

// Make the web application listen for HTTP requests
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
