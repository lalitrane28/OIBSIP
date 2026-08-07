const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let expression = "";

function updateDisplay() {
    display.value = expression || "";
}

function evaluateExpression() {
    try {
        if (!expression) {
            return;
        }

        const safeExpression = expression.replace(/×/g, "*").replace(/÷/g, "/");

        if (safeExpression.includes("/0")) {
            expression = "";
            display.value = "Error";
            return;
        }

        const result = Function(`"use strict"; return (${safeExpression})`)();
        expression = result.toString();
        display.value = expression;
    } catch {
        expression = "";
        display.value = "Error";
    }
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;

        if (value === "C") {
            expression = "";
            updateDisplay();
        }

        else if (value === "←") {
            expression = expression.slice(0, -1);
            updateDisplay();
        }

        else if (value === "=") {
            evaluateExpression();
        }

        else {
            expression += value;
            updateDisplay();
        }
    });
});

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9.+\-*/]$/.test(key)) {
        expression += key;
        updateDisplay();
        event.preventDefault();
    }

    if (key === "Enter") {
        evaluateExpression();
        event.preventDefault();
    }

    if (key === "Backspace") {
        expression = expression.slice(0, -1);
        updateDisplay();
        event.preventDefault();
    }

    if (key === "Escape") {
        expression = "";
        updateDisplay();
    }
});