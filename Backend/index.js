const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Entrance, Entries } = require("./model.js");
const app = express();
app.use(cors());
app.use(express.json());

mongoose
    .connect("mongodb://localhost:27017/entrancescanner")
    .then(() => console.log("Connected to DB"))
    .catch(() => console.log("Error Connecting to DB"));

const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
};

app.post("/api/createentrance", async (req, res) => {
    // console.log("1")
    try {
        let it = 0;
        let entranceCode = "";
        while (it < 1000) {
            entranceCode = generateRandomCode();
            const match = await Entrance.findOne({
                entranceCode: entranceCode,
            });
            if (!match) break;
        }
        if (it >= 1000) {
            return res.status(404).send("Error with server");
        }
        // const todayEntry = await Entries.create({ date: new Date() });
        await Entrance.create({
            entranceCode: entranceCode,
            // dailyEntries: [{ date: todayEntry.date, entry: todayEntry._id }],
        });

        return res.status(201).json({ entranceCode });
    } catch (e) {
        console.log(e);
        return res.status(500).send("Error with server");
    }
});

app.get("/api/existentrance", async (req, res) => {
    try {
        const entranceCode = req.query.eid;
        const entrance = await Entrance.findOne({ entranceCode: entranceCode });
        if (entrance) {
            return res.status(200).send("Exists");
        } else {
            return res.status(404).send("Not exists");
        }
    } catch {
        return res.status(500).send("Error with server");
    }
});

app.get("/api/getentrance", async (req, res) => {
    try {
        const entranceCode = req.query.eid;
        const duration = req.query.duration || "Today";

        let begin = 1;

        switch (duration) {
            case "All time":
                begin = 9999999;
                break;
            case "Last 5 days":
                begin = 5;
                break;
        }
        const entrance = await Entrance.findOne({ entranceCode: entranceCode }).lean();
        const dailyEntryIds = entrance.dailyEntries.slice(Math.max(0, entrance.dailyEntries.length - begin));
        console.log(dailyEntryIds)
        const entries = await Entries.find({ _id: { $in: dailyEntryIds } });
        // entrance.entries = [];
        // for (let i of entries) {
        //     entrance.entries = [...entrance.entries, ...(i.entries)];
        // }
        
        // delete entrance.dailyEntries;
        const perDayEntries = {}
        for (let i of entries){
            const date = i.date
            date.setHours(0, 0, 0, 0)
            perDayEntries[date] = i.entries
        }
        if (entrance) {
            // console.log(entrance)
            return res.status(200).json({ entries: perDayEntries });
        } else {
            return res.status(404).send("Not exists");
        }
    } catch (e) {
        console.log(e);
        return res.status(500).send("Error with server");
    }
});

app.post("/api/scan", async (req, res) => {
    const dateDiff = (d1, d2) => {
        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);
        return (d1 - d2) / (1000 * 24 * 60 * 60);
    };
    try {
        const { mode, student, time } = req.body;
        const entranceCode = req.query.eid;
        const entrance = await Entrance.findOne({ entranceCode: entranceCode });
        let lastEntry;
        let createNew = false;
        if (entrance.dailyEntries.length === 0) createNew = true;
        else {
            lastEntry = await Entries.findById(entrance.dailyEntries[entrance.dailyEntries.length - 1]);
            if (dateDiff(new Date(), lastEntry.date) >= 1) {
                createNew = true;
            }
        }
        if (createNew) {
            lastEntry = await Entries.create({ date: Date.now(), entries: [] });
            entrance.dailyEntries.push(lastEntry._id);
            await entrance.save();
        }
        if (mode === "OUT") {
            if (lastEntry.entries.some(e => e.student === student && e.checkInTime === null)) {
                return res.status(400).send("Anomaly");
            }
            lastEntry.entries.push({ student, checkOutTime: time, checkInTime: null });
            await lastEntry.save();
        } else if (mode === "IN") {
            const index = lastEntry.entries.findIndex(e => e.student === student && e.checkInTime === null);
            if (index !== -1) {
                lastEntry.entries[index].checkInTime = time;
                await lastEntry.save();
            } else {
                return res.status(400).send("Anomaly");
            }
        }
        return res.status(201).send("Entried");
    } catch (e) {
        console.log(e);
        return res.status(500).send("ERROR");
    }
});

app.listen(4000, () => console.log("Server running on port 4000"));
