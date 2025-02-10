const mongoose = require("mongoose");

const EntranceSchema = new mongoose.Schema({
    entranceCode: { type: String, required: true },
    dailyEntries: {
        type: [
            {
                date: {type: Date, default: Date.now()},
                entry: { type: mongoose.Schema.Types.ObjectId, ref: "Entries" },
            },
        ],
        default: [],
    },
});

const EntriesSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now() },
    entries: {
        type: [
            {
                student: String,
                checkInTime: { type: Date, default: null },
                checkOutTime: { type: Date, default: null },
            },
        ],
        default: [],
    },
});
module.exports = { Entries: mongoose.model("Entries", EntriesSchema), Entrance: mongoose.model("Entrance", EntranceSchema) };
