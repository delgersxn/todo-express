const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING;

app.use(cors({ origin: "*" }));
app.use(express.json());

const url = "https://";
const Todo = require("./model");

app.get("/", async (_req, res) => {
    const todos = await Todo.find({}).exec();

    res.send(todos);
});

app.get("/:id", async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findById({ _id: id });
    if (!todo) res.send("Task does not exist");

    res.send(todo);
});

app.post("/", async (req, res) => {
    const { title, order } = req.body;
    const todo = new Todo({
        title,
        order,
    });

    const newTodo = await todo.save();
    newTodo.url = url + "/" + newTodo._id;
    newTodo.save();

    res.json(todo);
});

app.patch("/:id", async (req, res) => {
    const { id } = req.params;

    const todo = await Todo.findById({ _id: id });
    if (!todo) res.send("Nothing found.");

    await Todo.findOneAndUpdate({ _id: id }, { $set: req.body });
    const result = await Todo.findById(id);

    res.send(result);
});

app.delete("/", async (_req, res) => {
    await Todo.deleteMany({});

    res.json({ result: "Deleted :)" });
});

app.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const deletedTask = await Todo.findOneAndDelete(id);
    if (!deletedTask) res.send("Task does not exist");

    res.send(deletedTask);
});

app.listen(3000, () => console.log("✨ Server is ready…"));

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const DB = mongoose.connection;
DB.once("open", () => console.log("⛺️ Connected to database…"));
DB.on("error", (error) => console.error(error));
