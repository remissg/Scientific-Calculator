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
        allBtns.forEach(btn => btn.classList.add("small-height"));
    } else {
        allBtns.forEach(btn => allBtns.forEach(btn => btn.classList.remove("small-height")));
    }
}


function addImplicitMultiplication(inputStr) {
    let result = inputStr;
    result = result.replace(/(\d+|\)|\.)(?=\()/g, '$1*');
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
                // ADDED: Constant for converting radians to degrees for inverse trig results
                const RAD_TO_DEG = 180 / Math.PI; 

                expr = expr.replace(/((?:\d+(?:\.\d+)?)|[)eπ])?√((?:\d+(?:\.\d+)?)|[eπ]|(?:\(.+?\)))/g, (match, base, radicand) => {
                    const rBase = base || '2'; 
                    const rootArg = radicand.startsWith('(') && radicand.endsWith(')') ? radicand : `(${radicand})`;
                    const power = `1/(${rBase})`;
                    return `Math.pow${rootArg}, ${power})`;
                });
                
                expr = expr.replace(/(\d+(\.\d+)?|\))!/g, (match, p1) => {
                    return `factorial(${p1})`;
                });
                
                expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

                
                const argPattern = '((?:\\d+(?:\\.\\d+)?)|[eπ]|(?:\(.+?\)))'; 

                // ADDED: New regex replacements for inverse trigonometric functions (sin^-1, cos^-1, tan^-1)
                expr = expr.replace(new RegExp(`sin\\^-1${argPattern}`, 'g'), (match, arg) => {
                    // Inverse trig functions return a result in radians, so we multiply by RAD_TO_DEG
                    const finalArg = arg.startsWith('(') && arg.endsWith(')') ? arg : `(${arg})`;
                    return `(Math.asin(${finalArg}) * ${RAD_TO_DEG})`;
                });
                expr = expr.replace(new RegExp(`cos\\^-1${argPattern}`, 'g'), (match, arg) => {
                    const finalArg = arg.startsWith('(') && arg.endsWith(')') ? arg : `(${arg})`;
                    return `(Math.acos(${finalArg}) * ${RAD_TO_DEG})`;
                });
                expr = expr.replace(new RegExp(`tan\\^-1${argPattern}`, 'g'), (match, arg) => {
                    const finalArg = arg.startsWith('(') && arg.endsWith(')') ? arg : `(${arg})`;
                    return `(Math.atan(${finalArg}) * ${RAD_TO_DEG})`;
                });
                // END ADDED

                // Existing regex replacements for standard trig functions
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
                

                expr = expr.replace(/π/g, `Math.PI`);
                expr = expr.replace(/\^/g, '**'); 
                expr = expr.replace(/e/g, `Math.E`);

                
                expr = expr.replace(new RegExp(`ln${argPattern}`, 'g'), 'Math.log($1)');
                expr = expr.replace(new RegExp(`log${argPattern}`, 'g'), 'Math.log10($1)');
                
                let evaluationString = `
                    (function() {
                        const factorial = ${factorial.toString()};
                        return eval(arguments[0]);
                    })('${expr}')`;

                let rawResult = eval(evaluationString); 

                
                if (isNaN(rawResult) || !isFinite(rawResult)) {
                    str = "Error";
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
            const lastChar = str.slice(-1);
            if (/\d|\)/.test(lastChar) && !str.endsWith("√")) {
                str += "√"; 
            } else if (/\D/.test(lastChar) || str.length === 0) {
                str += "√"; 
            } else {
                 str += "√"; 
            }
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
        // MODIFIED: This logic block now handles all trig, log, and inverse trig functions (when inv is pressed after one of them).
        else if (btnValue === "ln" || btnValue === "log" || btnValue === "sin" || btnValue === "cos" || btnValue === "tan") {
            const lastChar = str.slice(-1);
            // Add multiplication operator if preceding character is a number, parenthesis, or constant
            if (/\d|\)|π|e/.test(lastChar)) {
                str += "*";
            }
            
            str += btnValue; 
            inp.value = str;
        }
        
        else if (btnValue === "inv") {
            // ADDED: Check if the previous entry was a trigonometric or log function
            const lastFuncMatch = str.match(/(sin|cos|tan|log|ln)$/);
            
            if (lastFuncMatch) {
                // If it was a function, append ^-1 to make it an inverse function (e.g., 'sin^-1')
                str += "^-1"; 
            } else {
                // If not, append it as a standalone power of -1 operator
                str += "^-1"; 
            }
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
// (The keydown event listener remains the same, assuming 'i' maps to the 'inv' button)
// ...
// ... (All keydown logic is unchanged)
// ...
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
            targetButton = findButton("log");
            if (targetButton) {
                targetButton.click();
                simulateButtonPress(targetButton); 
                e.preventDefault();
            }
        } else if (key === "n") { 
             targetButton = findButton("ln");
            if (targetButton) {
                targetButton.click();
                simulateButtonPress(targetButton); 
                e.preventDefault();
            }
        } else if (key === "i") { 
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