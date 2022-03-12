const express = require("express");
const app = express();
const db = require("./src/models");
const initRoutes = require("./src/routes/web");
const path = require("path");
const session = require("express-session");
const PORT = process.env.PORT || 3000;
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "pbc",
    cookie: { maxAge: 1 * 60 * 60 * 1000 },
  })
);

global.__basedir = __dirname;
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "resources/static/")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
initRoutes(app);

db.sequelize.sync();

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});
