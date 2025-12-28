import { YearlyRules } from '../rules/2025';
import { clamp, floorTo } from './utils';

export type SpouseStatus = 'single' | 'married_dual' | 'married_single';

export type IncomeDeductions = {
  basic: number;
  socialInsurance: number;
  lifeInsurance: number;
  earthquake: number;
  spouse: number;
  dependents: number;
  other: number;
};

export const calculateSalaryIncome = (salaryIncome: number, rules: YearlyRules) => {
  const divided = Math.floor(salaryIncome / rules.salaryRule.divisor);
  const truncated = floorTo(divided, 1_000);
  const salaryAfter = Math.floor(truncated * rules.salaryRule.multiplier - rules.salaryRule.offset);
  const salaryDeduction = salaryIncome - salaryAfter;
  return { salaryAfter, salaryDeduction };
};

const calcLifeInsuranceDeductionIncome = (amount: number) => {
  if (amount <= 20_000) return amount;
  if (amount <= 40_000) return 10_000 + (amount - 20_000) * 0.5;
  if (amount <= 80_000) return 20_000 + (amount - 40_000) * 0.25;
  return 40_000;
};

const calcLifeInsuranceDeductionResident = (amount: number) => {
  if (amount <= 12_000) return amount;
  if (amount <= 32_000) return 6_000 + (amount - 12_000) * 0.5;
  if (amount <= 56_000) return 14_000 + (amount - 32_000) * 0.25;
  return 28_000;
};

export const calcIncomeInsuranceDeductions = (lifeNew: number, careNew: number, lifeOld: number) => {
  const lifeNewDeduction = calcLifeInsuranceDeductionIncome(lifeNew);
  const careNewDeduction = calcLifeInsuranceDeductionIncome(careNew);
  const lifeOldDeduction = calcLifeInsuranceDeductionIncome(lifeOld);
  const total = Math.min(lifeNewDeduction + careNewDeduction + lifeOldDeduction, 120_000);
  return total;
};

export const calcResidentInsuranceDeductions = (lifeNew: number, careNew: number, lifeOld: number) => {
  const lifeNewDeduction = calcLifeInsuranceDeductionResident(lifeNew);
  const careNewDeduction = calcLifeInsuranceDeductionResident(careNew);
  const lifeOldDeduction = calcLifeInsuranceDeductionResident(lifeOld);
  const total = Math.min(lifeNewDeduction + careNewDeduction + lifeOldDeduction, 70_000);
  return total;
};

export const calcEarthquakeDeductionIncome = (amount: number) => clamp(amount, 0, 50_000);
export const calcEarthquakeDeductionResident = (amount: number) => clamp(amount / 2, 0, 25_000);

export const calcSpouseDeduction = (status: SpouseStatus) => {
  if (status === 'married_single') return 380_000;
  return 0;
};

export const calcDependentDeduction = (dependents: number) => {
  return dependents * 380_000;
};

export const calcIncomeTaxable = (
  salaryAfter: number,
  deductions: Omit<IncomeDeductions, 'spouse' | 'dependents'> & { spouse: number; dependents: number },
) => {
  const total =
    deductions.basic +
    deductions.socialInsurance +
    deductions.lifeInsurance +
    deductions.earthquake +
    deductions.spouse +
    deductions.dependents +
    deductions.other;
  return floorTo(Math.max(salaryAfter - total, 0), 1_000);
};

export const calcIncomeTax = (taxable: number, rules: YearlyRules) => {
  const bracket = [...rules.incomeTaxBrackets].reverse().find((b) => taxable >= b.threshold);
  if (!bracket) return 0;
  const tax = taxable * bracket.rate - bracket.deduction;
  return Math.floor(tax);
};
