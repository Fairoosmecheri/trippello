const express = require("express");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
var session = require("express-session");
const path = require("path");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

dotenv.config();
const app = express();

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: "key", cookie: { maxAge: 600000 } }));
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connection Success");
  })
  .catch((err) => {
    console.log(err);
  });

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const restuarantRouter = require("./routes/restuarant");

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/restuarant", restuarantRouter);

app.get('/', (req, res) => {
  res.send("HEllo")
})

app.listen(3000, () => {
  console.log("Server running");
});
