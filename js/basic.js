const operators = ['+', '-', '*', '/', '^'];
let result = document.getElementById('result');
let history = document.getElementById('history');
let output = document.querySelector('.output');
let memory = 0;
let expression = [0];
let shouldReset = false;

function adjustFontSize() {
    const maxWidth = output.offsetWidth;
    const contentWidth = result.offsetWidth;

    if (contentWidth > maxWidth) {
        const scaleFactor = maxWidth / contentWidth;
        const newFontSize = Math.floor(parseFloat(window.getComputedStyle(result).fontSize) * scaleFactor);
        result.style.fontSize = `${newFontSize}px`;
    } else {
        result.style.fontSize = '';
    }
}

function hasOperatorAtLast(array) {
    const lastElement = array[array.length - 1];
    
    return operators.includes(lastElement);
}

function appendNumber(number) {
    if (shouldReset) {
        expression = [];
        history.textContent = '';
        shouldReset = false;
    }

    if (expression.length == 1 && (expression[0] == '0')) expression.pop();

    if (expression.length > 0 && !operators.includes(expression[expression.length - 1])) {
        number = expression[expression.length - 1].toString() + number.toString();
        expression.pop();
    }

    expression.push(number);
    result.textContent = expression.join('');
    console.log(expression);
    adjustFontSize();
}

function appendOperator(operator) {
    if (shouldReset) {
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = false;
    }
    if (expression.length == 3) {
        calculateResult();
        shouldReset = false;
        expression.push(operator);
        result.textContent = expression.join('');
    }
    else if (hasOperatorAtLast(expression)) {
        expression[expression.length - 1] = operator;
        result.textContent = expression.join('');
    }
    else {
        expression[expression.length - 1] = parseFloat(expression[expression.length - 1]);
        expression.push(operator);
        result.textContent = expression.join('');
    }
    console.log(expression);
    adjustFontSize();
}

function appendDecimalPoint() {
    if (shouldReset) {
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = false;
    }

        if (expression.length == 0) {
            expression.push('0.');
            result.textContent = expression.join('');
        } 
        if (expression[expression.length - 1].toString().includes('.')) return;
        
        let number = '';
        if (expression.length > 0 && !operators.includes(expression[expression.length - 1])) {
            number = expression[expression.length - 1].toString() + '.';
            expression.pop();
        }

        expression.push(number);
        console.log(expression);
        result.textContent = expression.join('');
}

function toggleSign() {
    if (shouldReset) {
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = false;
    }
    if (expression !== []) {
        let temp = expression[expression.length - 1];
        expression.pop();
        expression.push(-parseFloat(temp));
        console.log(expression);
        result.textContent = expression.join('');
    }
}

function calculateResult() {
    try {
        expression[expression.length - 1] = parseFloat(expression[expression.length - 1]);
        const calculatedResult = calculateExpression(expression);
        console.log(calculatedResult);
        adjustFontSize();
        const fullExpression = expression.join('') + "=";
        result.textContent = String(calculatedResult);
        history.textContent = `${fullExpression}`;
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = true;
        adjustFontSize();
    } catch (error) {
        result.textContent = 'Error';
    }
}

function calculateExpression(array) {
    let res = 0;
    let currentOperator = '+';

    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (typeof element === 'number') {
            switch (currentOperator) {
                case '+':
                res += element;
                break;
                case '-':
                res -= element; 
                break;
                case '*':
                res *= element;
                break;
                case '/':
                res /= element;
                break;
                case '^':
                res = Math.pow(res, element);
                break;
                default:
                // Handle invalid operator
                break;
            }
        } else if (typeof element === 'string' && operators.includes(element)) {
        currentOperator = element;
        }
    }
        
    return res;
}

function calculatePercentage() {
    if (shouldReset) {
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = false;
    }
    if (expression !== [] && !operators.includes(expression[expression.length - 1])) {
        const calculatedResult = parseFloat(expression[expression.length - 1]) / 100;
        expression[expression.length - 1] = calculatedResult;
        result.textContent = expression.join('');
        console.log(expression);
    }
}

function resetResult() {
    expression = [0];
    result.textContent = '0';
    history.textContent = '';
    console.log(expression);
    shouldReset = false;
    adjustFontSize();
}

function toggleNextField() {
    const nextField = document.getElementById('nextField');
    nextField.classList.toggle('hidden');
}

function toggleButtons() {
    const buttons = document.getElementsByClassName('buttons')[0];
    const arrowButton = document.getElementById('arrow');
    const additionalButtons = document.getElementById('additionalButtons');

    if (buttons.style.display === 'none') {
        buttons.style.display = 'flex';
        arrowButton.innerHTML = '&rarr;';
        additionalButtons.style.display = 'none';
    } else {
        buttons.style.display = 'none';
        arrowButton.innerHTML = '&larr;';
        additionalButtons.style.display = 'flex';
    }
}

function clearMemory() {
    memory = 0;
}

function recallMemory() {
    if (memory !== 0) {
        if (!operators.includes(expression[expression.length - 1])) {
            expression[expression.length - 1] = memory;
        } else {
            expression.push(memory);
        }
        result.textContent = expression.join('');
        console.log(expression);
    }
}

function addToMemory() {
    if (!operators.includes(expression[expression.length - 1])) {
        const lastElement = expression[expression.length - 1];
        const lastElementAsNumber = parseFloat(lastElement);
        if (!isNaN(lastElementAsNumber)) {
            memory += lastElementAsNumber;
        }
    } else {
        const firstElement = expression[0];
        const firstElementAsNumber = parseFloat(firstElement);
        if (!isNaN(firstElementAsNumber)) {
            memory += firstElementAsNumber;
        }
    }
    console.log("memory stores " + memory);
}

function subtractFromMemory() {
    if (!operators.includes(expression[expression.length - 1])) {
        const lastElement = expression[expression.length - 1];
        const lastElementAsNumber = parseFloat(lastElement);
        if (!isNaN(lastElementAsNumber)) {
            memory -= lastElementAsNumber;
            console.log("memory stores " + memory);
        }
    } else {
        const firstElement = expression[0];
        const firstElementAsNumber = parseFloat(firstElement);
        if (!isNaN(firstElementAsNumber)) {
            memory -= firstElementAsNumber;
            console.log("memory stores " + memory);
        }
    }
}

function viewMemory() {
    history.textContent = "memory: " + memory;
    console.log("memory stores " + memory);
}

function calculateFactorial() {
    if (shouldReset) {
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = false;
    }
    if (expression !== [] && !operators.includes(expression[expression.length - 1])) {
        const number = parseFloat(expression[expression.length - 1]);

        if (number < 0 || Math.floor(number) - number != 0) {
            expression[expression.length - 1] = NaN;
        }
        else if (number > 170) {
            expression[expression.length - 1] = Infinity;
        }
        else {
            let result = 1;

            for (let i = 2; i <= number; i++) {
                result *= i;
            }

            expression[expression.length - 1] = result;
        }
        result.textContent = expression.join('');
        console.log(expression);
        adjustFontSize();
    }
}

function calculateSqrt() {
    if (shouldReset) {
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = false;
    }
    if (expression !== [] && !operators.includes(expression[expression.length - 1])) {
        const calculatedResult = Math.sqrt(parseFloat(expression[expression.length - 1]));
        expression[expression.length - 1] = calculatedResult;
        result.textContent = expression.join('');
        console.log(expression);
        adjustFontSize();
    }
}

function fromDecimalToBinary() {
    if (shouldReset) {
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = false;
    }
    if (expression !== [] && !operators.includes(expression[expression.length - 1])) {
        let decimal = parseFloat(expression[expression.length - 1]);
        
        if (decimal === 0) {
            return '0';
        }
        
        let binary = '';
        let quotient = decimal;
    
        while (quotient > 0) {
            const remainder = quotient % 2;
            binary = remainder + binary;
            quotient = Math.floor(quotient / 2);
        }

        expression[expression.length - 1] = binary;
        
        result.textContent = expression.join('');
        console.log(expression);
        shouldReset = true;
    }
}

function fromDecimalToHex() {
    if (shouldReset) {
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = false;
    }
    if (expression !== [] && !operators.includes(expression[expression.length - 1])) {
        let decimal = parseFloat(expression[expression.length - 1]);

        if (decimal === 0) {
            return '0'; // Special case for decimal number 0
        }

        let hex = '';
        let quotient = decimal;

        while (quotient > 0) {
            const remainder = quotient % 16;
            hex = getHexDigit(remainder) + hex;
            quotient = Math.floor(quotient / 16);
        }

        expression[expression.length - 1] = hex;
        
        result.textContent = expression.join('');
        console.log(expression);
        shouldReset = true;
    }
}
  
function getHexDigit(remainder) {
    if (remainder < 10) {
        return String(remainder);
    } else {
        
        return String.fromCharCode(remainder + 55);
    }
}

function convertToDecimal() {
    if (shouldReset) {
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = false;
    }
    if (expression !== [] && !operators.includes(expression[expression.length - 1])) {
        let input = expression[expression.length - 1];
        if (/^[01]+$/.test(input)) {
            // Binary input
            input = binaryToDecimal(input);
        } else if (/^[0-9A-Fa-f]+$/.test(input)) {
            // Hexadecimal input
            input = hexToDecimal(input);
        } else if (/^-?\d*\.?\d+$/.test(input)) {
            // Decimal input
            input = parseFloat(input);
        } else {
            // Invalid input
            console.log("is already decimal", input);
        }

        expression[expression.length - 1] = input;
        
        result.textContent = expression.join('');
        console.log(expression);
    }
}

// Binary to Decimal Converter
function binaryToDecimal(binary) {
    const decimal = parseInt(binary, 2);
    return decimal;
  }
  
  // Hexadecimal to Decimal Converter
  function hexToDecimal(hex) {
    const decimal = parseInt(hex, 16);
    return decimal;
  }

function toCM() {
    if (shouldReset) {
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = false;
    }
    if (expression !== [] && !operators.includes(expression[expression.length - 1])) {
        let input = expression[expression.length - 1] * 1000;
        
        expression[expression.length - 1] = input;
        
        result.textContent = expression.join('');
        console.log(expression);
    }
}

function toM() {
    if (shouldReset) {
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = false;
    }
    if (expression !== [] && !operators.includes(expression[expression.length - 1])) {
        let input = expression[expression.length - 1];
        
        expression[expression.length - 1] = input;
        
        result.textContent = expression.join('');
        console.log(expression);
    }
}

function toKM() {
    if (shouldReset) {
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = false;
    }
    if (expression !== [] && !operators.includes(expression[expression.length - 1])) {
        let input = expression[expression.length - 1] / 1000;
        
        expression[expression.length - 1] = input;
        
        result.textContent = expression.join('');
        console.log(expression);
    }
}

function toG() {
    if (shouldReset) {
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = false;
    }
    if (expression !== [] && !operators.includes(expression[expression.length - 1])) {
        let input = expression[expression.length - 1] * 1000;
        
        expression[expression.length - 1] = input;
        
        result.textContent = expression.join('');
        console.log(expression);
    }
}

function toCM2() {
    if (shouldReset) {
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = false;
    }
    if (expression !== [] && !operators.includes(expression[expression.length - 1])) {
        let input = expression[expression.length - 1] * 1000;
        input *= input;
        
        expression[expression.length - 1] = input;
        
        result.textContent = expression.join('');
        console.log(expression);
    }
}

function toCM2() {
    if (shouldReset) {
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = false;
    }
    if (expression !== [] && !operators.includes(expression[expression.length - 1])) {
        let input = expression[expression.length - 1];
        input *= input;
        
        expression[expression.length - 1] = input;
        
        result.textContent = expression.join('');
        console.log(expression);
    }
}

function toKM2() {
    if (shouldReset) {
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = false;
    }
    if (expression !== [] && !operators.includes(expression[expression.length - 1])) {
        let input = expression[expression.length - 1] / 1000;
        input *= input;
        
        expression[expression.length - 1] = input;
        
        result.textContent = expression.join('');
        console.log(expression);
    }
}

function toKG() {
    if (shouldReset) {
        expression = [];
        expression.push(parseFloat(result.textContent));
        shouldReset = false;
    }
    if (expression !== [] && !operators.includes(expression[expression.length - 1])) {
        let input = expression[expression.length - 1] / 1000;
        
        expression[expression.length - 1] = input;
        
        result.textContent = expression.join('');
        console.log(expression);
    }
}
