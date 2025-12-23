const express = require("express");
const cors = require("cors");
const { evaluate } = require("./rules");

const app = express();
app.use(cors());
app.use(express.json());

const history = {
    printer: [],
    cnc: [],
    compressor: []
};


app.post("/evaluate", (req, res) => {
    const { machineId, sensorType, value } = req.body;

    if (!machineId || !sensorType || value === undefined) {
        return res.status(400).json({ error: "Invalid data" });
    }

    const status = evaluate(sensorType, value);

    history[machineId].push({
        time: new Date().toLocaleTimeString(),
        value
    });

  
    if (history[machineId].length > 10) {
        history[machineId].shift();
    }

    if (status === "Critical") {
        console.log("🚨 ALERT:", machineId, "is CRITICAL");
    }

    res.json({ status });
});

app.get("/history/:machineId", (req, res) => {
    const machineId = req.params.machineId;
    res.json(history[machineId] || []);
});

app.listen(3000, () => {
    console.log("✅ Backend running on http://localhost:3000");
});
