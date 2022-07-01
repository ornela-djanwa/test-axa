import express from "express";
import nunjucks from "nunjucks";
import path from "path";
const app = express();
const PORT = 4000;

/* app.set("views", path.join(__dirname, "/client"));
app.set("view engine", "html"); */
nunjucks.configure(path.join(__dirname, "./client"), {
  autoescape: true,
  express: app
});

// add middlewares
app.use(express.static(path.join(__dirname, "./client/build")));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});



/* app.use(
  express.static(path.join(__dirname, "/.public"), { maxAge: 31536000000 })
); */

//app.use(require("./app/routes")(app));

app.listen(PORT, () => {
  console.log(`Server started ➜ http://localhost:${PORT}`);
});
