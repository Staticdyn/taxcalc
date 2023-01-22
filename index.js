"use strict";

const taxBrackets = [
  [0, 77400, 0.1],
  [77401, 110880, 0.14],
  [110881, 178080, 0.2],
  [178001, 247440, 0.31],
  [247441, 514920, 0.35],
  [514921, 663240, 0.47],
  [663241, 700000, 0.5],
];

const rangeInput = document.querySelector(".range-slider");
const incomeNumber = document.querySelector(".income-number");
const incomeText = document.querySelector("#income");
const taxedText = document.querySelector("#taxed-income");
const grossText = document.querySelector("#gross");
const socialSecCheckbox = document.querySelector("#social-sec");
const graphWrap = document.querySelector(".graph-content");
const graphITax = document.querySelector(".part1");
const graphSTax = document.querySelector(".graph-part part2");
const graphSdeduct = document.querySelector(".graph-part part3");
const graphNet = document.querySelector(".graph-part part4");

let userInputSalary = rangeInput.value;

const calcPoints = function(){
  
}

const calcIncomeTax = function (salary) {
  console.clear();

  let taxAmt = 0;
  let netLeft = 0;
  for (const bracket of taxBrackets) {
    if (salary > bracket[1]) {
      taxAmt += (bracket[1] - bracket[0]) * bracket[2];
      netLeft += (bracket[1] - bracket[0]) * (1 - bracket[2]);
      // console.log(
      //   `On ${bracket[0]} - ${bracket[1]}, net is: ${Math.floor(
      //     netLeft
      //   )}, taxes are: ${Math.floor(taxAmt)} (${Math.floor(bracket[2] * 100)}%)`
      // );
    } else if (salary <= bracket[1]) {
      taxAmt += (salary - bracket[0]) * bracket[2];
      netLeft += (salary - bracket[0]) * (1 - bracket[2]);
      // console.log(
      //   `On ${bracket[0]} - ${bracket[1]}, net is: ${Math.floor(
      //     netLeft
      //   )}, taxes are: ${Math.floor(taxAmt)} (${Math.floor(
      //     bracket[2] * 100
      //   )}%)-`
      // );
      
      // `${(netLeft / grossIncome).toFixed(2) * 100}%`,
      return [taxAmt.toFixed(0)];
    }
  }
};

const calcSocialSec = function (salary) {
  const taxes = [
    [85464, 0.0597],
    [85465, 0.1783],
  ];
  let socialSecTax = 0;

  salary < taxes[0][0] && salary > 0
    ? (socialSecTax = salary * taxes[0][1])
    : (socialSecTax =
        taxes[0][0] * taxes[0][1] + (salary - taxes[0][0]) * taxes[1][1]);

  return socialSecTax, Math.floor((socialSecTax / salary) * 100);
};



// Event Listeners
rangeInput.addEventListener("input", function () {
  incomeNumber.textContent = rangeInput.value;
  [incomeText.textContent, taxedText.textContent, grossText.textContent] =
    calcIncomeTax(rangeInput.value);
  console.log(calcSocialSec(rangeInput.value));

  //move total graph with slider
  graphWrap.style.width = `${Math.round(
    (rangeInput.value / 450000 - 0.4444) * 100
  )}%`;
  //grow grpah items
  graphITax.style.width = `${Math.round(
    Number(incomeText.textContent) / rangeInput.value
  )}%`;
});

const Full = {
  grossIncome: 'xxx',
  incomeTaxed: 'xxx',
  socialDeductions: 'xxxx',
  zehutPoints: 'xxx',
  zPointValue: 'xxx',
  socialSecTax: 'xxx',
  socialSecTaxPrecent: 'xxx',
  netIncome: 'xx',

};


