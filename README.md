# ⚛️ Scientific Calculator: Precision and Elegance on the Web

This is a robust, responsive web application for a **Scientific Calculator**, meticulously crafted using **HTML, CSS, and pure JavaScript**. It's designed to offer the power of a handheld scientific tool with the convenience and modern aesthetic of a web app. From basic arithmetic to advanced trigonometry and logarithms, this calculator is built for both students and professionals.

## 🚀 Experience the Live Demo

Test the full functionality, including the scientific mode and keyboard shortcuts, right now:

👉 **[Launch Scientific Calculator](https://remissg.github.io/Scientific-Calculator/)** 👈

-----

## 📸 Project Preview & Setup

The calculator features a clean, intuitive interface with a distinctive modern design.

### Standard Calculator
<img width="2759" height="1548" alt="Screenshot 2025-10-03 144128" src="https://github.com/user-attachments/assets/0d0cd367-2d29-49c1-9089-53950f9669a4" />

### Scientific Calculator 
<img width="2756" height="1564" alt="Screenshot 2025-10-03 144158" src="https://github.com/user-attachments/assets/d816f16a-93b7-4756-83e5-473c95c3a082" />

-----

## ✨ Key Features

### 1\. Dynamic Dual-Mode Interface

  * **Toggle Control:** Easily switch between a compact **Standard Calculator** interface and the expanded **Scientific Mode** using the dedicated **"Sci"** button. The interface dynamically adjusts its layout and height using the `hidden` and `small-height` CSS classes for a seamless transition.
  * **Aesthetic Design:** The interface uses a vibrant, gradient background and buttons styled with an interactive, modern design that provides excellent visual feedback on press.

### 2\. Comprehensive Scientific Functionality

The calculator supports a rich set of mathematical operations, crucial for complex problem-solving:

| Function Category | Functions Available | Description |
| :--- | :--- | :--- |
| **Trigonometry** | $\text{sin}$, $\text{cos}$, $\text{tan}$, $\text{inv}$ | Calculates sine, cosine, and tangent. All trigonometric inputs are assumed to be in **degrees**, and inverse results are returned in **degrees**, ensuring practical usability. |
| **Logarithms** | $\text{ln}$, $\text{log}$ | Supports **natural logarithm** ($\text{ln}$, base $e$) and **common logarithm** ($\text{log}$, base 10). |
| **Advanced Math**| $\wedge$ (Power), $\sqrt{}$ (Root), $x!$ (Factorial) | Handles exponentiation, square roots, and the factorial function for non-negative integers. |
| **Constants** | $\pi$, $e$ | Precision constants for Pi and Euler's number are easily inserted into any expression. |

### 3\. Intelligent Expression Parsing (JavaScript Logic)

The core JavaScript engine is engineered for precision and user-friendliness:

  * **Implicit Multiplication:** The application automatically inserts the multiplication operator where mathematically implied, simplifying input (e.g., `5(2+3)` is parsed as `5*(2+3)`, and `9π` as `9*π`).
  * **Trigonometric Handling:** Sophisticated **Regular Expressions** are used to parse function calls and correctly apply **Degrees-to-Radians** conversion before calculation, ensuring accurate results for all trig functions.
  * **Robust Error Management:** Includes `try...catch` blocks and input validation to gracefully manage math domain errors (e.g., $\sqrt{-1}$, $\log(0)$) and syntax errors, displaying a clean `"Error"` message instead of crashing.

-----

## ⌨️ Full Keyboard Accessibility

For fast and efficient use, the calculator fully supports keyboard input, allowing for rapid calculations without needing to click the screen buttons.

| Key / Key Combination | Action Performed | Key / Key Combination | Action Performed |
| :--- | :--- | :--- | :--- |
| **`0`-`9`, `+`, `-`, `*`, `/`, `.`** | Standard Input | **`Enter`** or **`=`** | Evaluate the expression (Equals) |
| **`Backspace`** | Delete the last character | **`Esc`** | All Clear (**AC**) |
| **`^`** (or `Shift+6`) | Power/Exponent function | **`!`** (or `Shift+1`) | Factorial function |
| **`p`** / **`e`** | Insert $\pi$ and $e$ constants | **`m`** | Toggle Scientific Mode |
| **`s`** / **`c`** / **`t`** | $\text{sin}$, $\text{cos}$, $\text{tan}$ functions | **`i`** | Inverse function ($\text{inv}$) |

-----

## 💡 Future Enhancements (Roadmap)

This project is actively developed. The following features are planned to be added to enhance its capabilities:

1.  **Memory Functions (M+, M-, MR, MC):** Implement standard calculator memory functions to store and recall temporary results.
2.  **Hypotenuse/Hyperbolic Functions:** Add buttons and logic for $\text{hyp}$, $\text{sinh}$, $\text{cosh}$, and $\text{tanh}$.
3.  **Base Logarithm ($\text{log}_y x$):** Implement a function for custom base logarithms beyond the current base $e$ and base 10.
4.  **Display History:** A feature to view the sequence of previous calculations and reuse results.
5.  **Dark Mode Toggle:** Introduce a theme switch for user preference and accessibility.
6.  **Radians/Degrees Switch:** Allow users to toggle between input/output in degrees and radians, instead of being fixed to degrees.

-----

## 💻 Tech Stack Deep Dive

This project is a testament to the power of vanilla front-end development:

  * **HTML5 (Structure):** Used for the semantic layout of the calculator grid and input display.
  * **CSS3 (Style and Responsiveness):** Utilized a custom font (`'Quintessential', serif`), vibrant `linear-gradient` background, and sophisticated **hover and active states** (`.hov`, `.key-active`) to provide deep user feedback and a premium visual experience.
  * **JavaScript (Logic and Interactivity):** The core logic relies on meticulous **DOM manipulation** and robust **Regular Expression** parsing to transform user input into a safely evaluable expression string. It's a clean, module-like structure built without external frameworks.

-----

## ⬇️ Setup and Contribution

### Local Setup

To get a copy of the project running on your local machine:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/remissg/Scientific-Calculator.git
    ```
2.  **Navigate:**
    ```bash
    cd Scientific-Calculator
    ```
3.  **Run:** Open the `index.html` file in your preferred web browser.
------
## 🤝 Contributing

Pull requests are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request



-----

## 👤 Author

  * **remissg** - [GitHub Profile](https://github.com/remissg)

## 📜 License

Feel free to use, modify, and share it with proper attribution.
