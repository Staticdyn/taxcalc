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
  zehutPoints: 2.5,
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

const insertComma = function (num) {
  // 100,000

  const sLen = String(num).length;
  return `${String(num).slice(0, sLen - 3)},${String(num).slice(-3)}`;
};

const calcPoints = function () {
  fullInfo.zPointValue = zPoints.value * 2820;
  fullInfo.zehutPoints = zPoints.value;
};
const calcExpenses = () => (fullInfo.expenses = Number(expensesValue.value));
const calcDeductions = () =>
  (fullInfo.socialDeductions = Number(deductionsValue.value));

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
const calcNetIncome = function (obj) {
  return (obj.netIncome =
    obj.grossIncome - obj.expenses - obj.incomeTax - obj.socialSecTax);
};

const calcSocialPrecent = (obj) =>
  (obj.socialSecTaxPrecent = (obj.socialSecTax / obj.grossIncome).toFixed(2));
const calcNetPrecent = (obj) =>
  (obj.netIncomePrecemt = (obj.netIncome / obj.grossIncome).toFixed(2));

const updateUI = function (obj) {
  incomeNumber.innerText = insertComma(obj.grossIncome);
  precentLeft.innerText = `${(obj.netIncomePrecemt * 100).toFixed(0)}%`;
  taxedText.innerText = insertComma(obj.netIncome.toFixed(0));
  grossText.innerText = insertComma(
    (obj.grossIncome - obj.netIncome).toFixed(0)
  );

  // Resize graph items

  graphITax.style.width = `${(
    (fullInfo.incomeTax / fullInfo.grossIncome) *
    100
  ).toFixed(0)}%`; //income tax = gross
  graphSTax.style.width = `${(fullInfo.socialSecTaxPrecent * 100).toFixed(0)}%`; //social tax
  graphSdeduct.style.width = `${Number(
    (fullInfo.socialDeductions / fullInfo.grossIncome) * 100
  ).toFixed(0)}%`; // Total deductions (pension and Keren)
  graphExpenses.style.width = `${(
    (fullInfo.expenses / fullInfo.grossIncome) *
    100
  ).toFixed(0)}%`; // taxable Expenses
  graphNet.style.width = `${(
    Number(fullInfo.netIncome / fullInfo.grossIncome) * 100
  ).toFixed(0)}%`; // Total deductions (pension and Keren)
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
  calcNetIncome(obj);
  calcNetPrecent(obj);
  calcSocialPrecent(obj);
  updateUI(obj);
  // console.log(obj);
};

calcAll(fullInfo);


if (window.matchMedia("(max-width: 900px)").matches) {

 
  let _default = 0;
  let inputs = document.querySelectorAll("input");
  let allInputs = Array.from(document.querySelectorAll("input"));
  let maxInputsArray = allInputs.map((el) => Number(el.getAttribute("max")));
  let steps = allInputs.map((el) => Number(el.getAttribute("step")));
  
  inputs.forEach((input, i) => {
    let touchStartPosition = {};
    let start;
  
    function touchstart(e) {
      touchStartPosition.y = e.touches[0].pageY;
      start = parseInt(input.value);
      window.addEventListener("touchmove", touchmove);
      window.addEventListener("touchend", touchend);
    }
  
    function touchmove(e) {
      let diff = (touchStartPosition.y - e.touches[0].pageY) * steps[i];
      let newLeft = start + diff;
      newLeft = newLeft > maxInputsArray[i] ? maxInputsArray[i] : newLeft;
      newLeft = newLeft < 0 ? 0 : newLeft;
      input.value = newLeft;
      calcAll(fullInfo);
    }
  
    function touchend(e) {
      window.removeEventListener("touchmove", touchmove);
      window.removeEventListener("touchend", touchend);
    }
  
    input.addEventListener("touchstart", touchstart);
  
    function inputChange() {
      if (isNaN(parseInt(input.value))) {
        input.value = 0;
      }
    }
  });
  



} else {
    // event listeners
    rangeInput.addEventListener("input", function () {
      calcAll(fullInfo);
    });
    
    for (const ev of allInputFields)
      ev.addEventListener("input", function () {
        calcAll(fullInfo);
      });
    
    ///////////////////////
    //////// Input value scrubber
    
    let _default = 0;
    let inputs = document.querySelectorAll("input");
    let allInputs = Array.from(document.querySelectorAll("input"));
    let maxInputsArray = allInputs.map((el) => Number(el.getAttribute("max")));
    let steps = allInputs.map((el) => Number(el.getAttribute("step")));
    
    inputs.forEach((input, i) => {
      // input.value = _default;
    
      let mouseStartPosition = {};
      let start;
    
      function mousedown(e) {
        mouseStartPosition.y = e.pageY;
        start = parseInt(input.value);
        // start = isNaN(start) ? 0 : start;
        // console.log(start);
    
        window.addEventListener("mousemove", mousemove);
        window.addEventListener("mouseup", mouseup);
      }
    
      function mousemove(e) {
        let diff = (mouseStartPosition.y - e.pageY) * steps[i];
        let newLeft = start + diff;
        newLeft = newLeft > maxInputsArray[i] ? maxInputsArray[i] : newLeft;
        newLeft = newLeft < 0 ? 0 : newLeft;
        input.value = newLeft;
        calcAll(fullInfo);
      }
    
      function mouseup(e) {
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
      }
    
      input.addEventListener("mousedown", mousedown);
    
      function inputChange() {
        if (isNaN(parseInt(input.value))) {
          input.value = 0;
        }
      }
    });
    
    // const root = document.querySelector(":root");
    
    // window.addEventListener("load", getInnerHeight);
    // window.addEventListener("scroll", getInnerHeight);
    // window.addEventListener("resize", getInnerHeight);
    
    // function getInnerHeight() {
    //   root.style.setProperty("--full", window.innerHeight + "px");
    // }
  // Add event listener for larger screens


    console.log("Clicked on document on a large screen");
  }

