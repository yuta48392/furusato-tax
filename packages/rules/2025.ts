export type TaxBracket = {
  threshold: number;
  rate: number;
  deduction: number;
};

export type YearlyRules = {
  taxYear: number;
  basicDeductionIncome: number;
  basicDeductionResident: number;
  residentEqualTax: number;
  salaryRule: {
    divisor: number;
    multiplier: number;
    offset: number;
  };
  incomeTaxBrackets: TaxBracket[];
};

export const rules2025: YearlyRules = {
  taxYear: 2025,
  basicDeductionIncome: 480_000,
  basicDeductionResident: 430_000,
  residentEqualTax: 5_000,
  salaryRule: {
    divisor: 4,
    multiplier: 3.2,
    offset: 440_000,
  },
  incomeTaxBrackets: [
    { threshold: 0, rate: 0.05, deduction: 0 },
    { threshold: 1_950_000, rate: 0.10, deduction: 97_500 },
    { threshold: 3_300_000, rate: 0.20, deduction: 427_500 },
    { threshold: 6_950_000, rate: 0.23, deduction: 636_000 },
    { threshold: 9_000_000, rate: 0.33, deduction: 1_536_000 },
    { threshold: 18_000_000, rate: 0.40, deduction: 2_796_000 },
    { threshold: 40_000_000, rate: 0.45, deduction: 4_796_000 }
  ],
};
