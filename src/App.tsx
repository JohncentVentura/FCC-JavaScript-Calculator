import { useState } from 'react'
import './App.css'

function App() {
  const [answer, setAnswer] = useState(''); //Output
  const [expression, setExpression] = useState('0'); //Input
  const et = expression.trim(); //trim() removes whitespace from both sides of a string

  const isOperator = (symbol: string) => { //Returns a boolean if a regex pattern exists in symbol
    return /[*/+-]/.test(symbol);
  };

  const buttonPress = (symbol: string) => {
    if (symbol === "clear") {
      setAnswer("");
      setExpression("0");
    } else if (isOperator(symbol)) {
      setExpression(et + " " + symbol + " ");
    } else if (symbol === "=") {
      calculate();
    } else if (symbol === "0"){ //Only add 0 if it's not the first number in expression
      if (expression.charAt(0) !== "0") {
        setExpression(expression + symbol);
      }
    } else if (symbol === ".") { //Only add decimal once
      //expresion is split by operators, example is 2 + 4. will return 2 , 4.
      //pop to only return the last number in expression, example is 2 , 4. will return 4.
      const lastNumber = expression.split(/[-+/*]/g).pop();
      
      //If last number already has a decimal, don't add another and return
      if (!lastNumber || lastNumber?.includes(".")) return;
      //Else, add symbol to expression
      setExpression(expression + symbol);

    } else { //If first number is 0 then replace it with the symbol, else then add symbol to expression
      if (expression.charAt(0) === "0") { 
        setExpression(expression.slice(1) + symbol);
      } else {
        setExpression(expression + symbol);
      }
    }

    
  }

  const calculate = () => {
    //If last char in et is an operator, do nothing
    if (isOperator(et.charAt(et.length - 1))) return;

    //Clean the expression so that two operators in a row uses the last operator
    const parts = et.split(" "); //split et by white spaces, example is 2 * - + 4 will return 2,*,-,+,4 
    const newParts = []; //Will contain the clean expression after some calculations, example is 2 * - + 4 will return 2 + 4

    for (let i = parts.length - 1; i >= 0; i--) { //Loop from last string to first string
      //If "*", "/", or "+" is included in parts[i], And parts[i - 1] which is the symbol before parts[i] is an Operator, return true
      //Example: 2 * - + 4, this will return true when parts[i] is + and parts[i - 1] is - since they are both operators that is side by side
      if (["*", "/", "+"].includes(parts[i]) && isOperator(parts[i - 1])) {
        newParts.unshift(parts[i]); //Insert parts[i] at the start of newParts[]
        
        //We'll decrement i, so we will continue to the next symbol which isn't an operator
        let j = 0; //Placeholder for assigning i a new value after the while loop
        let k = i - 1; //Same index in isOperator(parts[i - 1])
        //While parts[k] is an operator, decrement k and increment j, until parts[k] is not an operator to stop
        while (isOperator(parts[k])) { 
          k--;
          j++;
        }
        i -= j; //Assign the decremented value of i

      } else { //Add the symbol
        newParts.unshift(parts[i]); //Insert parts[i] at the start of newParts[]
      }
    }

    const newExpression = newParts.join(" "); //join the newParts[] to make it into a string
    if (isOperator(newExpression.charAt(0))) { //Returns true for example is newExpression is "+ 2" and answer is "10" 
      setAnswer(eval(answer + newExpression) as string); //eval() evaluates the answer with the newExpression
    } else { //Calculating for the first time
      setAnswer(eval(newExpression) as string); //eval() evaluates the newExpression
    }

    setExpression(""); //Clears expression to create or follow up new calculations
  };

  return (
    <>
      <div className="calculator-container">
        <div id="display">
          <div id="answer">{answer}</div>
          <div id="expression">{expression}</div>
        </div>
        <div className="calculator-buttons">
          <button id="equals" onClick={() => buttonPress("=")}>=</button>
          <button id="zero" onClick={() => buttonPress("0")}>0</button>
          <button id="one" onClick={() => buttonPress("1")}>1</button>
          <button id="two" onClick={() => buttonPress("2")}>2</button>
          <button id="three" onClick={() => buttonPress("3")}>3</button>
          <button id="four" onClick={() => buttonPress("4")}>4</button>
          <button id="five" onClick={() => buttonPress("5")}>5</button>
          <button id="six" onClick={() => buttonPress("6")}>6</button>
          <button id="seven" onClick={() => buttonPress("7")}>7</button>
          <button id="eight" onClick={() => buttonPress("8")}>8</button>
          <button id="nine" onClick={() => buttonPress("9")}>9</button>
          <button id="add" onClick={() => buttonPress("+")}>+</button>
          <button id="subtract" onClick={() => buttonPress("-")}>-</button>
          <button id="multiply" onClick={() => buttonPress("*")}>*</button>
          <button id="divide" onClick={() => buttonPress("/")}>/</button>
          <button id="decimal" onClick={() => buttonPress(".")}>.</button>
          <button id="clear" onClick={() => buttonPress("clear")}>Clear</button>
        </div>
      </div>
    </>
  )
}

export default App
