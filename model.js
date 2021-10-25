const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    url: {
        type: String,
    },
    order: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("Todos", todoSchema);
