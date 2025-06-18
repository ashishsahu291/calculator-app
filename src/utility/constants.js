export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

// Button Layout
export const BUTTON_LAYOUT = [
  [
    { label: "AC", type: ACTIONS.CLEAR },
    { label: "DEL", type: ACTIONS.DELETE_DIGIT },
    { label: "%", operation: "%" },
    { label: "/", operation: "/" },
  ],
  [{ digit: "1" }, { digit: "2" }, { digit: "3" }, { operation: "*" }],
  [{ digit: "4" }, { digit: "5" }, { digit: "6" }, { operation: "+" }],
  [{ digit: "7" }, { digit: "8" }, { digit: "9" }, { operation: "-" }],
  [
    { digit: "." },
    { digit: "0" },
    { label: "=", type: ACTIONS.EVALUATE, span: true },
  ],
];
