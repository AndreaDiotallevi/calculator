const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
};

updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event; // const target = event.target;

    if (target.classList.contains('operator')) handleOperator(target.value);
    if (target.classList.contains('decimal')) inputDecimal(target.value);
    if (target.classList.contains('reset')) resetCalculator();
    if (target.classList.contains('undo')) undo();
    if (target.classList.contains("digit")) inputDigit(target.value);

    updateDisplay();
});

function inputDigit(digit) {
    const { displayValue, operator, waitingForSecondOperand } = calculator;

    if (digit == "0" && operator == "/" && waitingForSecondOperand) {
        alert("You cannot divide by 0!");
        return;
    }

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }

    console.log(calculator);
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) return;
    // If the `displayValue` does not contain a decimal point
    if (!calculator.displayValue.includes(dot)) {
        // Append the decimal point
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator, waitingForSecondOperand } = calculator
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
        calculator.operator = nextOperator;
        console.log(calculator);
        return;
    }

    if (firstOperand == null) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        let result = performCalculation[operator](firstOperand, inputValue);
        result = Math.round(result * 100) / 100;

        calculator.displayValue = String(result);
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
    console.log(calculator);
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand
};

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    console.log(calculator);
}

function undo() {
    const { displayValue, waitingForSecondOperand } = calculator

    if (!displayValue || waitingForSecondOperand) return;

    if (displayValue.length > 1) calculator.displayValue = displayValue.slice(0, -1);
    else calculator.displayValue = "0";

    console.log(calculator);
}

//Keyboard input functionality
document.onkeydown = function (event) {
    const { key } = event;

    if (key >= 0 && event.key <= 9) inputDigit(key);
    if (key == ".") inputDecimal(".");
    if (["/", "*", "+", "-"].includes(key)) handleOperator(key);
    if (key == "Enter") handleOperator("=");
    if (key == "Backspace") undo();
    
    updateDisplay();
}