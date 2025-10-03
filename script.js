function factorial(n) {
    n = Math.floor(n);
    if (n < 0 || !isFinite(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

let inp = document.querySelector("input");
let buttons = document.querySelectorAll("button");

let str = "";
let arr = Array.from(buttons);

let sciMode = false;


function simulateButtonPress(button) {
    if (!button) return;
    const activeClass = 'key-active';
    button.classList.add(activeClass);
    setTimeout(() => {
        button.classList.remove(activeClass);
    }, 100);
}


function toggleScientific() {
    sciMode = !sciMode;
    const sciBtns = document.querySelectorAll(".sci");
    const allBtns = document.querySelectorAll("button");
    sciBtns.forEach(btn => {
        btn.classList.toggle("hidden", !sciMode); 
    });
    if (!sciMode) {
        allBtns.forEach(btn => allBtns.forEach(btn => btn.classList.add("small-height")));
    } else {
        allBtns.forEach(btn => allBtns.forEach(btn => btn.classList.remove("small-height")));
    }
}


function addImplicitMultiplication(inputStr) {
    let result = inputStr;
    // FIX: Added '^' to prevent inserting '*' between a number and '^' (e.g., 3^2 remains 3^2, not 3*^2)
    result = result.replace(/(\d+|\)|\.)(?=[(lnlogsincostan√eπ^])/g, '$1*'); 
    result = result.replace(/([eπ])(?=\d|ln|log|sin|cos|tan|√)/g, '$1*');
    return result;
}


(function initializeCalculator() {
    sciMode = true; 
    toggleScientific();
})();


arr.forEach(button => {
    button.addEventListener("click", (e) => {
        inp.blur(); 
        const btnValue = e.target.innerHTML;

        if (btnValue == "=") {
            try {
                let expr = addImplicitMultiplication(str); 
                const DEG_TO_RAD = Math.PI / 180;

                // argPattern: a numeric value (with optional decimal), or a constant, or a parenthetical block.
                const argPattern = '((?:\\d+(?:\\.\\d+)?)|[eπ]|(?:\(.+?\)))'; 

                // 1. Root (Square Root ONLY)
                const sqrtRegex = new RegExp(`√(${argPattern})`, 'g');
                
                expr = expr.replace(sqrtRegex, (match, radicand) => {
                    const rootArg = radicand.startsWith('(') && radicand.endsWith(')') ? radicand : `(${radicand})`;
                    return `Math.sqrt(${rootArg})`; 
                });
                
                // 2. Factorial
                expr = expr.replace(/(\d+(\.\d+)?|\))!/g, (match, p1) => {
                    return `factorial(${p1})`;
                });
                
                // 3. Percentage
                expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
                
                // 4. Normal Trigonometric Functions
                expr = expr.replace(new RegExp(`sin${argPattern}`, 'g'), (match, arg) => {
                    const finalArg = arg.startsWith('(') && arg.endsWith(')') ? arg : `(${arg})`;
                    return `Math.sin(${finalArg} * ${DEG_TO_RAD})`;
                });
                expr = expr.replace(new RegExp(`cos${argPattern}`, 'g'), (match, arg) => {
                    const finalArg = arg.startsWith('(') && arg.endsWith(')') ? arg : `(${arg})`;
                    return `Math.cos(${finalArg} * ${DEG_TO_RAD})`;
                });
                expr = expr.replace(new RegExp(`tan${argPattern}`, 'g'), (match, arg) => {
                    const finalArg = arg.startsWith('(') && arg.endsWith(')') ? arg : `(${arg})`;
                    return `Math.tan(${finalArg} * ${DEG_TO_RAD})`;
                });
                
                // 5. LOGARITHMIC FUNCTIONS
                expr = expr.replace(new RegExp(`log${argPattern}`, 'g'), 'Math.log10($1)');
                
                
                // 6. CONSTANTS AND EXPONENTS - REORDERED FOR CORRECT PARSING
                // MUST RESOLVE CONSTANTS FIRST: e and π are JavaScript identifiers, Math.E and Math.PI are numbers.
                expr = expr.replace(/π/g, `Math.PI`);
                expr = expr.replace(/e/g, `Math.E`);
                
                // THEN RESOLVE EXPONENT: Now that 'e' is Math.E, 'e^2' becomes 'Math.E^2', which is correctly parsed as 'Math.E**2'
                expr = expr.replace(/\^/g, '**'); 

                let evaluationString = `
                    (function() {
                        const factorial = ${factorial.toString()};
                        return eval(arguments[0]);
                    })('${expr}')`;

                let rawResult = eval(evaluationString); 

                
                if (isNaN(rawResult) || !isFinite(rawResult)) {
                    if (expr.includes('Math.log(') || expr.includes('Math.log10(')) {
                        str = "Invalid Input";
                    } else {
                        str = "Error";
                    }
                } else {
                    str = String(rawResult.toFixed(10).replace(/\.?0+$/, ''));
                }

                inp.value = str;

            } catch (e) {
                console.error("Evaluation Error:", e);
                str = "Error";
                inp.value = str;
            }
        }
        
        else if (btnValue == "AC") {
            str = "";
            inp.value = str;
        } else if (btnValue === "Sci") {
            toggleScientific(); 
        }
        else if (btnValue == "√") {
            str += "√"; 
            inp.value = str;
        }
        else if (btnValue === "π") {
            const lastChar = str.slice(-1);
            if (/\d|\)|e|π/.test(lastChar)) {
                str += "*π";
            } else {
                str += "π"; 
            }
            inp.value = str;
        }
        else if (btnValue === "^") {
            str += "^"; 
            inp.value = str;
        }

        else if (btnValue === "e") {
            const lastChar = str.slice(-1);
            if (/\d|\)|π|e/.test(lastChar)) {
                str += "*e";
            } else {
                str += "e"; 
            }
            inp.value = str;
        }
        else if (btnValue === "x!") {
            const lastChar = str.slice(-1);
             if (/\d|\)/.test(lastChar)) {
                 str += "!";
              }
            inp.value = str;
        }
        
        // Function button presses (log, sin, cos, tan)
        else if (btnValue === "log" || btnValue === "sin" || btnValue === "cos" || btnValue === "tan") {
            const lastChar = str.slice(-1);
            // Add multiplication operator if preceding character is a number, parenthesis, or constant
            if (/\d|\)|π|e/.test(lastChar)) {
                str += "*";
            }
            // Only append the function name (NO opening parenthesis)
            str += btnValue; 
            inp.value = str;
        }
        // New e^x button logic
        else if (btnValue === "e^x") {
            const lastChar = str.slice(-1);
            if (/\d|\)|π|e/.test(lastChar)) {
                str += "*"; // Implicit multiplication before the function
            }
            str += "e^"; // Adds the "e" constant followed by the exponent operator
            inp.value = str;
        }
        
        else if (btnValue === "inv") {
            // Inv is treated as generic power operator
            str += "^-1"; 
            inp.value = str;
        }
        
        else if (
            button.querySelector(".fa-delete-left") ||
            e.target.classList.contains("fa-delete-left")
        ) {
            str = str.slice(0, str.length - 1);
            inp.value = str;
        }
        else if (btnValue == "( )" || btnValue == "(" || btnValue == ")") {
             let toAdd = btnValue === "( )" ? (
                 (str.match(/\(/g) || []).length <= (str.match(/\)/g) || []).length ? "(" : ")"
             ) : btnValue;

             if (toAdd === "(" && /\d|\)|π|e/.test(str.slice(-1))) {
                 str += "*";
             }
             
             str += toAdd;
             inp.value = str;
        }
        else {
             str += btnValue;
             inp.value = str;
        }
    });
});

// Keydown logic (no changes here, keeping existing functionality)
document.addEventListener("keydown", (e) => {
    if (document.activeElement === inp) return; 
    const key = e.key;
    let targetButton = null;

    
    const findButton = (content) => Array.from(buttons).find(btn => btn.innerHTML === content);

    
    const findBackspaceButton = () => Array.from(buttons).find(btn =>
        btn.querySelector(".fa-delete-left") || btn.innerHTML === "⌫"
    );

    
    if ((/\d/).test(key) || "+-*/.".includes(key)) {
        targetButton = findButton(key);
        if (targetButton) {
            str += key;
            inp.value = str;
            simulateButtonPress(targetButton); 
            e.preventDefault();
        }
    } else if (key === "Enter" || key === "=") {
        targetButton = findButton("=");
        if (targetButton) {
            targetButton.click();
            simulateButtonPress(targetButton); 
        }
        e.preventDefault();
    } else if (key === "Backspace") {
        targetButton = findBackspaceButton();
        if (targetButton) {
            str = str.slice(0, str.length - 1);
            inp.value = str;
            simulateButtonPress(targetButton); 
            e.preventDefault();
        }
    } else if (key === "Escape") {
        targetButton = findButton("AC");
        if (targetButton) {
            str = "";
            inp.value = str;
            simulateButtonPress(targetButton); 
            e.preventDefault();
        }
    } else if (key === "%") {
        targetButton = findButton("%");
        if (targetButton) {
            str += "%";
            inp.value = str;
            simulateButtonPress(targetButton); 
            e.preventDefault();
        }
    } else if (key === "(" || key === ")") {
        let parenthesesButton = findButton("( )") || findButton("(") || findButton(")"); 
        if (parenthesesButton) {
            parenthesesButton.click(); 
            simulateButtonPress(parenthesesButton); 
            e.preventDefault();
        }
        else {
            str += key;
            inp.value = str;
            e.preventDefault();
        }

    } else if (sciMode) { 
        if (key === "p") { 
            targetButton = findButton("π");
            if (targetButton) {
                targetButton.click();
                simulateButtonPress(targetButton);
                e.preventDefault();
            }
        } else if (key === "e") { 
            // 'e' key should now map to the 'e' constant button
            targetButton = findButton("e");
            if (targetButton) {
                targetButton.click();
                simulateButtonPress(targetButton);
                e.preventDefault();
            }
        } else if (key === "s") { 
            targetButton = findButton("sin");
            if (targetButton) {
                targetButton.click(); 
                simulateButtonPress(targetButton); 
                e.preventDefault();
            }
        } else if (key === "c") { 
            targetButton = findButton("cos");
            if (targetButton) {
                targetButton.click(); 
                simulateButtonPress(targetButton);
                e.preventDefault();
            }
        } else if (key === "t") { 
            targetButton = findButton("tan");
            if (targetButton) {
                targetButton.click(); 
                simulateButtonPress(targetButton); 
                e.preventDefault();
            }
        } else if (key === "r") { 
            targetButton = findButton("√");
            if (targetButton) {
                targetButton.click();
                simulateButtonPress(targetButton); 
                e.preventDefault();
            }
        } else if (key === "!") { 
            targetButton = findButton("x!");
            if (targetButton) {
                targetButton.click();
                simulateButtonPress(targetButton); 
                e.preventDefault();
            }
        } else if (key === "l") { 
            // Using 'L' for 'log' (base 10)
            targetButton = findButton("log");
            if (targetButton) {
                targetButton.click(); 
                simulateButtonPress(targetButton); 
                e.preventDefault();
            }
        } 
        else if (key === "x") { 
            // Using 'X' for 'e^x'
            targetButton = findButton("e^x"); 
            if (targetButton) {
                targetButton.click(); 
                simulateButtonPress(targetButton); 
                e.preventDefault();
            }
        }
        else if (key === "i") { 
            targetButton = findButton("inv");
            if (targetButton) {
                targetButton.click();
                simulateButtonPress(targetButton); 
                e.preventDefault();
            }
        } else if (key === "^" || (e.shiftKey && e.code === "Digit6")) {
            targetButton = findButton("^");
            if (targetButton) {
                str += "^"; 
                inp.value = str;
                simulateButtonPress(targetButton); 
                e.preventDefault();
            }
        }
    }
    
    if (key === "m") {
        targetButton = findButton("Sci");
        if (targetButton) {
            targetButton.click();
            simulateButtonPress(targetButton); 
            e.preventDefault();
        }
    }
});