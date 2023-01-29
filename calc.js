"use strict";

// import "./draggable.js";

const socialBrackets = [
  // [start, end, taxPrecent]
  [0, 85464, 0.0597], // A bracket lower than 60% of median salary (7,122ILS in 2023)
  [85465, 569579, 0.1783], // Second beacket above the median salary
  [569580, 750000, 0], // Social tax caps at 47,465ILS per month (in 2023), 0% tax above that level
];
const incomeBrackets = [
  // [start, end, taxPrecent]
  [0, 77400, 0.1],
  [77401, 110880, 0.14],
  [110881, 178080, 0.2],
  [178001, 247440, 0.31],
  [247441, 514920, 0.35],
  [514921, 663240, 0.47],
  [663241, 700000, 0.5],
];

const rangeInput = document.querySelector(".range-slider");
const incomeNumber = document.querySelector("#user-input");
const precentLeft = document.querySelector("#precent-left");
const taxedText = document.querySelector("#taxed-income");
const grossText = document.querySelector("#gross");
const socialSecCheckbox = document.querySelector("#social-sec");
const graphWrap = document.querySelector(".graph-content");
const graphITax = document.querySelector(".part1");
const graphSTax = document.querySelector(".part2");
const graphSdeduct = document.querySelector(".part3");
const graphExpenses = document.querySelector(".part4");
const graphNet = document.querySelector(".part5");
const zPoints = document.querySelector("#z-points");
const expensesValue = document.querySelector("#expenses");
const deductionsValue = document.querySelector("#deductions");
const allInputFields = document.querySelectorAll(".income-number");

const fullInfo = {
  grossIncome: "xxx",
  socialSecTax: "xxx",
  incomeTax: "xxx",
  taxableIncome: "xxx",
  expenses: "xxx",
  zPointValue: "xxx",
  zehutPoints: "xxx",
  socialDeductions: "0",
  socialSecTaxPrecent: "xxx",
  netIncome: "xxx",
  netIncomePrecemt: "xxx",
};

const init = function () {
  return Number(rangeInput.value);
};

const convertToPrecentage = function (num) {
  return `${(num * 100).toFixed(0)}%`;
};

const calcPoints = function () {
  fullInfo.zPointValue = zPoints.value * 2820;
  fullInfo.zehutPoints = zPoints.value;
};
const calcExpenses = () => (fullInfo.expenses = Number(expensesValue.value));
const calcDeductions = () => (fullInfo.socialDeductions = Number(deductionsValue.value));

// const calcIncomeTax = function (obj) {
//   let taxAmt = 0;
//   for (const bracket of incomeBrackets) {
//     if (obj.taxableIncome > bracket[1]) {
//       taxAmt += (bracket[1] - bracket[0]) * bracket[2];
//     } else if (obj.taxableIncome <= bracket[1]) {
//       taxAmt += (obj.taxableIncome - bracket[0]) * bracket[2];
//       obj.incomeTax = taxAmt;
//       return taxAmt.toFixed(0);
//     }
//   }
// };
const calcTax = function (obj, arr) {
  let taxAccum = 0;
  arr.forEach((arr) => {
    taxAccum +=
      obj.taxableIncome > arr[0] && obj.taxableIncome > arr[1]
        ? (arr[1] - arr[0]) * arr[2]
        : obj.taxableIncome > arr[0] && obj.taxableIncome < arr[1]
        ? (obj.taxableIncome - arr[0]) * arr[2]
        : 0;
    // console.log(arr, arr[1] - arr[0],arr[2],((arr[1] - arr[0]) * arr[2]).toFixed(0),taxAccum );
  });

  return taxAccum.toFixed(0);
};

const calcAllDeductubles = function (obj) {
  obj.taxableIncome =
    obj.grossIncome - obj.expenses - obj.zPointValue - obj.socialDeductions;
};
// const calcSocialSec = function (obj) {
//   let socialSecTax = 0;

//   for (const tax of socialBrackets) {
//     socialSecTax +=
//       obj.taxableIncome > tax[1]
//         ? tax[1] * tax[2]
//         : (obj.taxableIncome - tax[0]) * tax[2];
//   }
//   return (obj.socialSecTax = socialSecTax);
// };

const calcNetIncome = function (obj) {
  return (obj.netIncome =
    obj.grossIncome - obj.expenses - obj.incomeTax - obj.socialSecTax);
};

const calcSocialPrecent = (obj) =>
  (obj.socialSecTaxPrecent = (obj.socialSecTax / obj.grossIncome).toFixed(2));
const calcNetPrecent = (obj) =>
  (obj.netIncomePrecemt = (obj.netIncome / obj.grossIncome).toFixed(2));

// event listener

const updateUI = function (obj) {
  incomeNumber.innerText = `${obj.grossIncome}ש"ח`;
  precentLeft.innerText = `${(obj.netIncomePrecemt * 100).toFixed(0)}%`;
  taxedText.innerText = obj.netIncome.toFixed(0);
  grossText.innerText = (obj.grossIncome - obj.netIncome).toFixed(0);

  // update graph
  //// move total graph with slider

  // graphWrap.style.width = `${Math.round(
  //     (rangeInput.value / 450000 - 0.4444) * 100
  //     )}%`;

  // Resize graph items

  graphITax.style.width = `${((fullInfo.incomeTax / fullInfo.grossIncome) *100).toFixed(0)}%`; //income tax = gross
  graphSTax.style.width = `${(fullInfo.socialSecTaxPrecent * 100).toFixed(0)}%`; //social tax
  graphSdeduct.style.width = `${Number((fullInfo.socialDeductions / fullInfo.grossIncome) * 100).toFixed(0)}%`; // Total deductions (pension and Keren)
  graphExpenses.style.width = `${((fullInfo.expenses / fullInfo.grossIncome) *100).toFixed(0)}%`; // taxable Expenses
  graphNet.style.width = `${(Number(fullInfo.netIncome / fullInfo.grossIncome) * 100).toFixed(0)}%`; // Total deductions (pension and Keren)

    // // hide item if value is 0
    // graphSdeduct.style.width === "0%"
    //   ? (graphSdeduct.style.display = "none")
    //   : (graphSdeduct.style.display = "flex");

    // graphExpenses.style.width === "0%"
    //   ? (graphSdeduct.style.display = "none")
    //   : (graphSdeduct.style.display = "flex");
};

const calcAll = function (obj) {
  fullInfo.grossIncome = init();
  init();
  calcExpenses();
  calcPoints();
  calcDeductions();
  calcAllDeductubles(obj);
  obj.incomeTax = calcTax(obj, incomeBrackets);
  obj.socialSecTax = calcTax(obj, socialBrackets);
  // calcIncomeTax(obj);
  // calcSocialSec(obj);
  calcNetIncome(obj);
  calcNetPrecent(obj);
  calcSocialPrecent(obj);
  updateUI(obj);
  // console.clear();
  console.log(obj);
};

calcAll(fullInfo);

// event listeners
rangeInput.addEventListener("input", function () {
  calcAll(fullInfo);
});

for (const ev of allInputFields)
  ev.addEventListener("input", function () {
    calcAll(fullInfo);
  });


////////////////////////
let max = 650000;
let _default = 0;
let numInput = document.getElementById('expenses');
numInput.value = _default;

let mouseNumStartPosition = {};
let numStart;

function mousedownNum(e) {
  mouseNumStartPosition.y = e.pageY;
  numStart = parseInt(numInput.value);
  numStart = isNaN(numStart) ? 0 : numStart;
  calcAll(fullInfo);



  // add listeners for mousemove, mouseup
  window.addEventListener("mousemove", mousemoveNum);
  window.addEventListener("mouseup", mouseupNum);
}

function mousemoveNum(e) {
  console.log(e.pageY);
  let diff = (mouseNumStartPosition.y - e.pageY)*8;
  let newLeft = numStart + diff;
  newLeft = newLeft > max ? max : newLeft;
  newLeft = newLeft < 0 ? 0 : newLeft;
  numInput.value = newLeft;
  calcAll(fullInfo);

}

function mouseupNum(e) {
  window.removeEventListener("mousemove", mousemoveNum);
  window.removeEventListener("mouseup", mouseupNum);
}

numInput.addEventListener("mousedown", mousedownNum);

function numInputChange() {
  if(isNaN(parseInt(numInput.value))) {
    numInput.value = 0;
  }
}


