const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/entranceDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const EntranceSchema = new mongoose.Schema({
  entranceCode: String,
});
const Entrance = mongoose.model("Entrance", EntranceSchema);

app.post("/api/entrance", async (req, res) => {
  const entranceCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  await Entrance.create({ entranceCode });
  res.json({ entranceCode });
});

app.post("/api/validate", async (req, res) => {
  const { code } = req.body;
  const found = await Entrance.findOne({ entranceCode: code });
  res.json({ valid: !!found });
});

app.post("/api/scan", (req, res) => {
  console.log("Scanned Data:", req.body);
  res.json({ message: "QR Data Received" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
