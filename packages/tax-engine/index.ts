import { rules2025, YearlyRules } from '../rules/2025';
import { rules2026 } from '../rules/2026';
import {
  calcDependentDeduction,
  calcEarthquakeDeductionIncome,
  calcIncomeInsuranceDeductions,
  calcIncomeTax,
  calcIncomeTaxable,
  calcResidentInsuranceDeductions,
  calcSpouseDeduction,
  calculateSalaryIncome,
} from './incomeTax';
import { calcAdjustmentDeduction, calcResidentTax, calcResidentTaxable } from './residentTax';
import { calcDonationBreakdown, calcDonationLimits } from './donation';
import { clamp } from './utils';

export type TaxEngineInput = {
  taxYear: number;
  salaryIncome: number;
  socialInsurance: number;
  spouseStatus: 'single' | 'married_dual' | 'married_single';
  dependents: number;
  lifeInsuranceNew: number;
  careInsuranceNew: number;
  earthquakeInsurance: number;
  ideco: number;
  lifeInsuranceOld: number;
  medicalDeduction: number;
  housingLoanDeduction: number;
  useServer?: boolean;
};

export type TaxEngineResult = {
  salaryIncome: number;
  salaryDeduction: number;
  salaryIncomeAfterDeduction: number;
  incomeTaxable: number;
  incomeTax: number;
  reconstructionTax: number;
  residentTaxable: number;
  residentTaxBeforeAdjustments: number;
  housingLoanCreditResident: number;
  adjustmentCredit: number;
  residentTaxFinal: number;
  incomeTaxDeduction: number;
  residentTaxBasicDeduction: number;
  residentTaxSpecialDeduction: number;
  safeDonation: number;
  optDonation: number;
  riskDonation: number;
};

const ruleMap: Record<number, YearlyRules> = {
  2025: rules2025,
  2026: rules2026,
};

const getRules = (year: number): YearlyRules => {
  return ruleMap[year] ?? rules2025;
};

export const calculateTaxes = (input: TaxEngineInput): TaxEngineResult => {
  const rules = getRules(input.taxYear);
  const { salaryAfter: salaryIncomeAfterDeduction, salaryDeduction } = calculateSalaryIncome(
    input.salaryIncome,
    rules,
  );

  const spouseDeduction = calcSpouseDeduction(input.spouseStatus);
  const dependentDeduction = calcDependentDeduction(input.dependents);

  const incomeLifeDeduction = calcIncomeInsuranceDeductions(
    input.lifeInsuranceNew,
    input.careInsuranceNew,
    input.lifeInsuranceOld,
  );
  const residentLifeDeduction = calcResidentInsuranceDeductions(
    input.lifeInsuranceNew,
    input.careInsuranceNew,
    input.lifeInsuranceOld,
  );
  const incomeEarthquake = calcEarthquakeDeductionIncome(input.earthquakeInsurance);
  const residentEarthquake = calcEarthquakeDeductionResident(input.earthquakeInsurance);

  const incomeTaxable = calcIncomeTaxable(salaryIncomeAfterDeduction, {
    basic: rules.basicDeductionIncome,
    socialInsurance: input.socialInsurance,
    lifeInsurance: incomeLifeDeduction,
    earthquake: incomeEarthquake,
    spouse: spouseDeduction,
    dependents: dependentDeduction,
    other: clamp(input.ideco, 0, Number.MAX_SAFE_INTEGER) + clamp(input.medicalDeduction, 0, Number.MAX_SAFE_INTEGER),
  });

  const incomeTax = calcIncomeTax(incomeTaxable, rules);
  const reconstructionTax = Math.floor(incomeTax * 0.021);

  const residentTaxable = calcResidentTaxable(salaryIncomeAfterDeduction, {
    basic: rules.basicDeductionResident,
    socialInsurance: input.socialInsurance,
    lifeInsurance: residentLifeDeduction,
    earthquake: residentEarthquake,
    spouse: spouseDeduction,
    dependents: dependentDeduction,
    other: clamp(input.ideco, 0, Number.MAX_SAFE_INTEGER) + clamp(input.medicalDeduction, 0, Number.MAX_SAFE_INTEGER),
  });

  const residentTaxBeforeAdjustments = calcResidentTax(residentTaxable, rules);

  const housingLoanCreditIncome = clamp(input.housingLoanDeduction, 0, Number.MAX_SAFE_INTEGER);
  const incomeTaxAfterCredits = Math.max(incomeTax - housingLoanCreditIncome, 0);

  const housingLoanCreditResident = Math.min(
    housingLoanCreditIncome - (incomeTax - incomeTaxAfterCredits),
    Math.min(residentTaxable * 0.05, 97_500),
  );

  const peopleDeductionDiff =
    (rules.basicDeductionIncome - rules.basicDeductionResident) +
    (incomeLifeDeduction - residentLifeDeduction) +
    (incomeEarthquake - residentEarthquake);

  const adjustmentCredit = calcAdjustmentDeduction(incomeTaxable, residentTaxable, peopleDeductionDiff);

  const residentTaxFinal = Math.max(
    residentTaxBeforeAdjustments - housingLoanCreditResident - adjustmentCredit,
    0,
  );

  const donationLimits = calcDonationLimits(residentTaxBeforeAdjustments - rules.residentEqualTax);
  const donationBreakdown = calcDonationBreakdown(donationLimits.optimalDonation, incomeTax, 0.05105);

  return {
    salaryIncome: input.salaryIncome,
    salaryDeduction,
    salaryIncomeAfterDeduction,
    incomeTaxable,
    incomeTax: incomeTaxAfterCredits,
    reconstructionTax,
    residentTaxable,
    residentTaxBeforeAdjustments,
    housingLoanCreditResident: Math.floor(housingLoanCreditResident),
    adjustmentCredit,
    residentTaxFinal: Math.floor(residentTaxFinal),
    incomeTaxDeduction: Math.floor(donationBreakdown.incomeTaxDeduction),
    residentTaxBasicDeduction: Math.floor(donationBreakdown.residentBasic),
    residentTaxSpecialDeduction: Math.floor(donationBreakdown.residentSpecial),
    safeDonation: donationLimits.safeDonation,
    optDonation: Math.floor(donationLimits.optimalDonation),
    riskDonation: donationLimits.riskDonation,
  };
};
