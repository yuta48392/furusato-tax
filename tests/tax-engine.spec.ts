import { describe, expect, it } from 'vitest';
import { calculateTaxes, TaxEngineInput } from '../packages/tax-engine';

describe('tax-engine', () => {
  it('calculates salary and taxes for sample input', () => {
    const input: TaxEngineInput = {
      taxYear: 2025,
      salaryIncome: 4_119_288,
      socialInsurance: 701_625,
      spouseStatus: 'married_dual',
      dependents: 0,
      lifeInsuranceNew: 69_545,
      careInsuranceNew: 539,
      earthquakeInsurance: 8_530,
      ideco: 0,
      lifeInsuranceOld: 0,
      medicalDeduction: 0,
      housingLoanDeduction: 101_441,
    };

    const result = calculateTaxes(input);
    expect(result.salaryIncomeAfterDeduction).toBeGreaterThan(0);
    expect(result.incomeTaxable).toBeGreaterThan(0);
    expect(result.residentTaxable).toBeGreaterThan(0);
    expect(result.optDonation).toBeGreaterThan(result.safeDonation);
  });
});
