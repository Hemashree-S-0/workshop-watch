function getColor(status) {
    if (status === "Normal") return "green";
    if (status === "Warning") return "orange";
    if (status === "Critical") return "red";
    return "grey";
}

function getColor(status) {
    if (status === "Normal") return "green";
    if (status === "Warning") return "orange";
    if (status === "Critical") return "red";
    return "grey";
}

function updateMachine(machineId, valueId, statusId, timeId) {
    const value = Math.floor(Math.random() * (90 - 40 + 1)) + 40;

    fetch("http://localhost:3000/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            machineId,
            sensorType: "temperature",
            value
        })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById(valueId).innerText = value;
        document.getElementById(statusId).innerText = data.status;
        document.getElementById(machineId).style.backgroundColor =
            getColor(data.status);
        document.getElementById(timeId).innerText = "0";
        loadChart(); // 🔥 load chart AFTER data insert
    });
}

setInterval(() => {
    ["printerTime", "cncTime", "compressorTime"].forEach(id => {
        const el = document.getElementById(id);
        el.innerText = parseInt(el.innerText) + 1;
    });
}, 1000);


const ctx = document.getElementById("historyChart").getContext("2d");

const chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [
            { label: "Printer", data: [], borderColor: "red", fill: false },
            { label: "CNC", data: [], borderColor: "blue", fill: false },
            { label: "Compressor", data: [], borderColor: "green", fill: false }
        ]
    }
});

function loadChart() {
    Promise.all([
        fetch("http://localhost:3000/history/printer").then(r => r.json()),
        fetch("http://localhost:3000/history/cnc").then(r => r.json()),
        fetch("http://localhost:3000/history/compressor").then(r => r.json())
    ])
    .then(([printer, cnc, compressor]) => {
        if (printer.length === 0) return;

        chart.data.labels = printer.map(x => x.time);
        chart.data.datasets[0].data = printer.map(x => x.value);
        chart.data.datasets[1].data = cnc.map(x => x.value);
        chart.data.datasets[2].data = compressor.map(x => x.value);
        chart.update();
    });
}

updateMachine("printer", "printerValue", "printerStatus", "printerTime");
updateMachine("cnc", "cncValue", "cncStatus", "cncTime");
updateMachine("compressor", "compressorValue", "compressorStatus", "compressorTime");

setInterval(() => {
    updateMachine("printer", "printerValue", "printerStatus", "printerTime");
    updateMachine("cnc", "cncValue", "cncStatus", "cncTime");
    updateMachine("compressor", "compressorValue", "compressorStatus", "compressorTime");
}, 30000);
