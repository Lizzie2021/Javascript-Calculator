import React, { useState } from "react";
import Buttons from "./Buttons";
import Formula from "./Formula";
import Output from "./Output";

function App() {
  const isOperator = /[x/+-]/,
    endsWithOperator = /[x/+-]$/,
    endsWithNegativeSign = /\d[x/+-]{1}-$/;

  const [currentVal, setCurrentVal] = useState("0");
  const [preVal, setPreVal] = useState("0");
  const [formula, setFormula] = useState("");
  const [currentSign, setCurrentSign] = useState("pos");
  const [lastClicked, setLastClicked] = useState("");
  const [evaluated, setEvaluated] = useState(false);

  function initialize() {
    setCurrentVal("0");
    setPreVal("0");
    setFormula("");
    setCurrentSign("pos");
    setLastClicked("");
    setEvaluated(false);
  }

  function handleNumbers(e) {
    setEvaluated(false);
    const value = e.target.value;
    if (evaluated) {
      setCurrentVal(value);
      setFormula(value !== "0" ? value : "");
    } else {
      setCurrentVal(
        currentVal === "0" || isOperator.test(currentVal)
          ? value
          : currentVal + value
      );
      setFormula(
        currentVal === "0" && value === "0"
          ? formula === ""
            ? value
            : formula
          : /([^.0-9]0|^0)$/.test(formula)
          ? formula.slice(0, -1) + value
          : formula + value
      );
    }
  }
  function handleOperators(e) {
    setEvaluated(false);
    const value = e.target.value;
    setCurrentVal(value);
    if (evaluated) {
      setFormula(preVal + value);
    } else if (!endsWithOperator.test(formula)) {
      setPreVal(formula);
      setFormula(formula + value);
    } else if (!endsWithNegativeSign.test(formula)) {
      setFormula(
        (endsWithNegativeSign.test(formula + value) ? formula : preVal) + value
      );
    } else if (value !== "-") {
      setFormula(preVal + value);
    }
  }
  function handleEvaluate() {
    let expression = formula;
    while (endsWithOperator.test(expression)) {
      expression = expression.slice(0, -1);
    }
    expression = expression
      .replace(/x/g, "*")
      .replace(/-/g, "-")
      .replace("--", "+0+");
    let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
    setCurrentVal(answer.toString());
    setFormula(
      expression
        .replace(/\*/g, "x")
        .replace(/-/g, "-")
        .replace("+0+", "--")
        .replace(/(x|\/|\+)-/g, "$1-")
        .replace(/^-/g, "-") +
        "=" +
        answer
    );
    setPreVal(answer);
    setEvaluated(true);
  }
  function handleDecimal() {
    if (evaluated) {
      setCurrentVal("0.");
      setFormula("0.");
      setEvaluated(false);
    } else if (!currentVal.includes(".")) {
      if (
        endsWithOperator.test(formula) ||
        (currentVal === "0" && formula === "")
      ) {
        setCurrentVal("0.");
        setFormula(formula + "0.");
      } else {
        setCurrentVal(formula.match(/(-?\d+\.?\d*)$/)[0] + ".");
        setFormula(formula + ".");
      }
    }
  }
  return (
    <div>
      <Formula formula={formula} />
      <Output currentValue={currentVal} />
      <Buttons
        initialize={initialize}
        numbers={handleNumbers}
        operators={handleOperators}
        evaluate={handleEvaluate}
        decimal={handleDecimal}
      />
      <div className="footer">By Lizzie</div>
    </div>
  );
}
export default App;
