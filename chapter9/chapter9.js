// when the button is clicked
document.getElementById("submit").addEventListener("click",calculateIt);

function calculateIt() {

    //create some variables
    let myOperator;
    let returnValue;
    
    //get the operands
    let operand1 = document.getElementById("operand1").value;
    let operand2 = document.getElementById("operand2").value;

    //get the operand types
    let select1 = document.getElementById("operand1-type");
    let select2 = document.getElementById("operand2-type");
  
    let operand1type = select1.value;
    let operand2type = select2.value;
    
    //get the operator
    let radios = document.getElementsByName('operator');
    
    //convert the operands
    switch (operand1type) {
        case "string":
            operand1 = String(operand1);
            break;
        case "number":
            operand1 = Number(operand1);
            break;
    }
    
    switch (operand2type) {
        case "string":
            operand2 = String(operand2);
            break;
        case "number":
            operand2 = Number(operand2);
            break;
    }
    //loop through each possible operand value and find the checked one
    for (var i = 0, length = radios.length; i < length; i++) {
 
        if (radios[i].checked) {
            myOperator = radios[i].value;
            
            //do a different operation depending on which operator was selected
            switch (radios[i].value) {
                case "+":
                    returnValue = operand1 + operand2;
                    break;
                case "-":
                    returnValue = operand1 - operand2;
                    break;
                case "*":
                    returnValue = operand1 * operand2;
                    break;
                case "/":
                    returnValue = operand1 / operand2;
                    break;
                case "%":
                    returnValue = operand1 % operand2;
                    break;
                case "concat":
                    returnValue = String(operand1) + String(operand2);
                    myOperator = "+";
                    break;
                case "==":
                    returnValue = operand1 == operand2;
                    break;
                case "===":
                    returnValue = operand1 === operand2;
                    break;
                case "!=":
                    returnValue = operand1 != operand2;
                    break;
                case "!==":
                    returnValue = operand1 !== operand2;
                    break;
                case ">":
                    returnValue = operand1 > operand2;
                    break;
                case ">=":
                    returnValue = operand1 >= operand2;
                    break;
                case "<":
                    returnValue = operand1 < operand2;
                    break;
                case "<=":
                    returnValue = operand1 <= operand2;
                    break;
            }

            break;
        }
    }

    //display the operation
    
    if (typeof(operand1)==="string"){
        operand1 = '"' + operand1 + '"';
    }
    if (typeof(operand2)==="string"){
        operand2 = '"' + operand2 + '"';
    }
    document.getElementById("final-operation").textContent = operand1 + myOperator + operand2;
    
    //display the return value
    document.getElementById("result").textContent = returnValue;
};
