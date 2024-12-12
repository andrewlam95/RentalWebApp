require("./utils.js");

require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const port = process.env.PORT || 3000;

const app = express();

/* secret information section */
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;

var { database } = include("databaseConnection");

const userCollection = database.db(mongodb_database).collection("users");

app.use(express.urlencoded({ extended: false }));

var mongoStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/${mongodb_database}`,
  crypto: {
    secret: mongodb_session_secret,
  },
});

app.use(
  session({
    secret: node_session_secret,
    store: mongoStore, //default is memory store
    saveUninitialized: false,
    resave: true,
  })
);

// Serve static files from the root directory
// app.use(express.static('C:/Users/runni/Downloads/Imperial/Imperial'));
app.use(express.static("C:/PersonalProjects/RentalWebApp/Imperial"));

// app.use(express.static(__dirname + "/Imperial"));

app.get("/", (_, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/createUser", (req, res) => {
  var html = `
  create user
  <form action='/submitUser' method='post'>
  <input name='username' type='text' placeholder='username'>
  <input name='password' type='password' placeholder='password'>
  <button>Submit</button>
  </form>
  `;
  res.send(html);
});

app.post("/submitUser", async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  // const schema = Joi.object(
  //   {
  //     username: Joi.string().alphanum().max(20).required(),
  //     password: Joi.string().max(20).required()
  //   });

  // const validationResult = schema.validate({username, password});
  // if (validationResult.error != null) {
  //    console.log(validationResult.error);
  //    res.redirect("/createUser");
  //    return;
  //  }

  //   var hashedPassword = await bcrypt.hash(password, saltRounds);

  await userCollection.insertOne({ username: username, password: password });
  console.log("Inserted user");

  var html = "successfully created user";
  res.send(html);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
