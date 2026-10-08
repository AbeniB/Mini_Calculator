(() => {
  const display = document.querySelector(".answerCont");
  const buttons = document.querySelector(".numCont");
  let expression = "";
  let justEvaluated = false;
  let repeatOperation = null;

  function calculate(source) {
    const tokens = source.match(/(?:\d+\.?\d*|\.\d+)|[+*/-]/g) || [];
    if (!tokens.length || tokens.join("") !== source.replace(/\s/g, "")) throw new Error("Invalid expression");
    let position = 0;
    function factor() {
      let sign = 1;
      while (tokens[position] === "+" || tokens[position] === "-") {
        if (tokens[position++] === "-") sign *= -1;
      }
      const token = tokens[position++];
      if (!token || !/^\d*\.?\d+$/.test(token)) throw new Error("Expected a number");
      return sign * Number(token);
    }
    function term() {
      let value = factor();
      while (tokens[position] === "*" || tokens[position] === "/") {
        const operator = tokens[position++];
        const next = factor();
        value = operator === "*" ? value * next : value / next;
      }
      return value;
    }
    function sum() {
      let value = term();
      while (tokens[position] === "+" || tokens[position] === "-") {
        const operator = tokens[position++];
        const next = term();
        value = operator === "+" ? value + next : value - next;
      }
      return value;
    }
    const result = sum();
    if (position !== tokens.length) throw new Error("Invalid expression");
    if (!Number.isFinite(result)) return "Error";
    return Number(result.toPrecision(12)).toString();
  }

  function show(value = expression) {
    display.value = value;
  }

  function inputDigit(digit) {
    if (justEvaluated) { expression = ""; justEvaluated = false; repeatOperation = null; }
    const match = expression.match(/(?:^|[+*/-])(-?\d*\.?\d*)$/);
    const current = match ? match[1] : "";
    if (digit === "." && current.includes(".")) return;
    if (digit === "." && (!current || current === "-")) digit = "0.";
    expression += digit;
    show();
  }

  function inputOperator(operator) {
    if (justEvaluated) justEvaluated = false;
    if (!expression) {
      if (operator !== "-") return;
      expression = "-";
      show();
      return;
    }
    if (/[+*/-]$/.test(expression)) {
      if (operator === "-" && !/-$/.test(expression)) expression += operator;
      else expression = expression.replace(/[+*/-]+$/, operator);
    } else expression += operator;
    repeatOperation = null;
    show();
  }

  function equals() {
    if (!expression) return;
    try {
      let source = expression;
      if (justEvaluated && repeatOperation) source = `${display.value}${repeatOperation.operator}${repeatOperation.operand}`;
      const match = source.match(/([+*/-])(-?\d*\.?\d+)$/);
      if (match && match.index > 0) repeatOperation = { operator: match[1], operand: match[2] };
      const result = calculate(source.replace(/[+*/-]+$/, ""));
      expression = result;
      show(result);
      justEvaluated = true;
      if (result === "Error") repeatOperation = null;
    } catch {
      expression = "";
      show("Error");
      justEvaluated = true;
      repeatOperation = null;
    }
  }

  buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || !buttons.contains(button)) return;
    const value = button.textContent.trim();
    if (value === "C") {
      expression = "";
      justEvaluated = false;
      repeatOperation = null;
      show("");
    } else if (value === "=") equals();
    else if (/^\d$/.test(value) || value === ".") inputDigit(value);
    else if (["+", "-", "*", "/"].includes(value)) inputOperator(value);
  });
})();
