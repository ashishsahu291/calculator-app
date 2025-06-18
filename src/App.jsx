import React, { useMemo, useReducer } from "react";
import "./App.css";
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";
import { ACTIONS, BUTTON_LAYOUT } from "./utility/constants";

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      return addDigit(state, payload);
    case ACTIONS.CHOOSE_OPERATION:
      return chooseOperation(state, payload);
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        previousOperand: null,
        overwrite: true,
        operation: null,
        currentOperand: evaluate(state),
      };
    case ACTIONS.DELETE_DIGIT:
      return deleteDigit(state);
    default:
      return state;
  }
}

function addDigit(state, payload) {
  if (state.overwrite) {
    return {
      ...state,
      currentOperand: payload.digit,
      overwrite: false,
    };
  }
  if (payload.digit === "0" && state.currentOperand === "0") return state;
  if (payload.digit === "." && state.currentOperand.includes(".")) {
    return state;
  }
  return {
    ...state,
    currentOperand: `${state.currentOperand || ""}${payload.digit}`,
  };
}

function chooseOperation(state, payload) {
  if (state.currentOperand == null && state.previousOperand == null)
    return state;

  if (state.currentOperand == null) {
    return {
      ...state,
      operation: payload.operation,
    };
  }

  if (state.previousOperand == null) {
    return {
      ...state,
      operation: payload.operation,
      previousOperand: state.currentOperand,
      currentOperand: null,
    };
  }

  return {
    ...state,
    previousOperand: evaluate(state),
    operation: payload.operation,
    currentOperand: null,
  };
}

function deleteDigit(state) {
  if (state.overwrite) {
    return {
      ...state,
      overwrite: false,
      currentOperand: null,
    };
  }
  if (state.currentOperand == null) return state;
  if (state.currentOperand.length === 1)
    return { ...state, currentOperand: null };
  return {
    ...state,
    currentOperand: state.currentOperand.slice(0, -1),
  };
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "/":
      computation = prev / current;
      break;
    case "%":
      computation = prev % current;
      break;
  }
  return computation.toString();
}

const INTEGRER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGRER_FORMATTER.format(integer);
  return `${INTEGRER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ previousOperand, currentOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  const formatedPrevious = useMemo(
    () => formatOperand(previousOperand),
    [previousOperand]
  );
  const formatedCurrent = useMemo(
    () => formatOperand(currentOperand),
    [currentOperand]
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatedPrevious}
          {operation}
        </div>
        <div className="current-operand">{formatedCurrent}</div>
      </div>
      {BUTTON_LAYOUT.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((btn, index) => {
            if (btn.digit != null) {
              return (
                <DigitButton
                  dispatch={dispatch}
                  digit={btn.digit}
                  key={index}
                />
              );
            }
            if (btn.operation != null) {
              return (
                <OperationButton
                  dispatch={dispatch}
                  operation={btn.operation}
                  key={index}
                />
              );
            }
            return (
              <button
                className={btn.span ? "span-two" : ""}
                onClick={() => dispatch({ type: btn.type })}
                key={index}
              >
                {btn.label}
              </button>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

export default App;
