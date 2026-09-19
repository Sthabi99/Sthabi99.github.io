// let language = prompt("What language do you speak?").toLowerCase();
// if (language !== null) {
//   language, toLowerCase();
// }
// let speaksjavascript;
// if (language === "javaScript") {
//   alert("Great! Let's talk JavaScript!");
//   speaksjavascript = true;
// } else {
//   alert("I don't know what you're saying.");
// }
// if (speaksjavascript) {
//   alert("Great to meet you");
// }


// listen for button clicks
document.getElementById("placeOrder").addEventListener("click", placeOrder);

/**
 * gets form values
 * calculates prices
 * produces output
 */
function placeOrder() {
  // get form values
  let numPizzas = document.getElementById("numPizzas").value;
  if (numPizzas.trim() === "" || !Number.isInteger(Number(numPizzas)) || Number(numPizzas) < 1 || Number(numPizzas) > 100) {
    document.getElementById("displayTotal").textContent = "Enter a whole number of pizzas between 1 and 100.";
    return;
  }
  let typePizza = document.getElementById("typePizza").value;
  let deliveryCity = document.getElementById("deliveryCity").value;
  let birthday = document.getElementById("birthday").value;
  // get the pizza price
  let orderPrice = calculatePrice(numPizzas, typePizza);

  // get the delivery price
  let deliveryPrice = calculateDelivery(orderPrice, deliveryCity, birthday);

  // create the output
  let theOutput = "<p>Your example order:</p>";

  // todo: output the delivery price, if there is one
  if (deliveryPrice === 0) {
    theOutput += "<p>You get free delivery!</p>";
  } else {
    theOutput += "<p>Your delivery cost is: $" + deliveryPrice.toFixed(2) + "</p>";
  }

  theOutput += "<p>Your total is: $" + (orderPrice + deliveryPrice).toFixed(2) + "</p>";

  // display the output
  document.getElementById("displayTotal").innerHTML = theOutput;
}

/**
 * calculates pizza price
 */
function calculatePrice(numPizzas, typePizza) {
  let orderPrice = Number(numPizzas) * 10;
  let extraCharge = 0;

  // todo: calculate extraCharge, if there is one.
  if (typePizza === "supreme") {
    extraCharge = Number(numPizzas) * 2;
  }
  orderPrice += extraCharge;
  return orderPrice;
}

/**
 * calculates delivery price
 */
function calculateDelivery(orderPrice, deliveryCity, birthday) {
  let deliveryPrice = 0;

  // todo: calculate delivery price, if there is one
  if ((deliveryCity === "Anytown" && orderPrice > 10)||birthday==="yes") {
    deliveryPrice = 0;
  } else {
    deliveryPrice = 5;
  } 
  return deliveryPrice;
}
