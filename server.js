const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ✅ Serve static files from the 'public' folder
app.use(express.static('public'));


// Import the Notes model
const Note = require("./models/Note");

// Home Page - Show all notes
app.get("/", async (req, res) => {
  const notes = await Note.find();
  res.render("index", { notes });
});

// Add Note Page
app.get("/add", (req, res) => {
  res.render("addNote");
});

// Save New Note
app.post("/notes", async (req, res) => {
  const { title, content } = req.body;
  await Note.create({ title, content });
  res.redirect("/");
});

// Edit Note Page
app.get("/edit/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.render("editNote", { note });
});

// Update Note
app.put("/notes/:id", async (req, res) => {
  await Note.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/");
});

// Delete Note
app.delete("/notes/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
