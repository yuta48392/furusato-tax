import { YearlyRules } from '../rules/2025';
import { floorTo } from './utils';

export const calcResidentTaxable = (
  salaryAfter: number,
  deductions: {
    basic: number;
    socialInsurance: number;
    lifeInsurance: number;
    earthquake: number;
    spouse: number;
    dependents: number;
    other: number;
  },
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

export const calcResidentTax = (taxable: number, rules: YearlyRules) => {
  const incomePortion = Math.floor(taxable * 0.1);
  return incomePortion + rules.residentEqualTax;
};

export const calcAdjustmentDeduction = (
  incomeTaxable: number,
  residentTaxable: number,
  peopleDeductionDiff: number,
) => {
  const base = Math.min(peopleDeductionDiff * 0.05, residentTaxable * 0.05);
  const rounded = floorTo(base, 100);
  return Math.max(rounded, 0);
};
