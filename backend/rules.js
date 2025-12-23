const RULES = {
    temperature: {
        normalMax: 70,
        warningMax: 85
    }
};

function evaluate(sensorType, value) {
    const rule = RULES[sensorType];

    if (!rule) {
        return "Normal"; 
    }

    if (value <= rule.normalMax) return "Normal";
    if (value <= rule.warningMax) return "Warning";
    return "Critical";
}

module.exports = { evaluate };
