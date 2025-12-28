import { describe, expect, it } from 'vitest';
import { POST } from '../apps/web/app/api/calc/route';
import { TaxEngineInput } from '../packages/tax-engine';

const buildRequest = (body: Partial<TaxEngineInput>) => {
  return new Request('http://localhost/api/calc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

describe('api route', () => {
  it('rejects missing payload', async () => {
    const response = await POST(buildRequest({}));
    expect(response.status).toBe(400);
  });

  it('calculates payload', async () => {
    const response = await POST(
      buildRequest({
        taxYear: 2025,
        salaryIncome: 4_000_000,
        socialInsurance: 500_000,
        spouseStatus: 'single',
        dependents: 0,
        lifeInsuranceNew: 0,
        careInsuranceNew: 0,
        earthquakeInsurance: 0,
        ideco: 0,
        lifeInsuranceOld: 0,
        medicalDeduction: 0,
        housingLoanDeduction: 0,
      }),
    );
    expect(response.status).toBe(200);
    const json = (await response.json()) as { salaryIncomeAfterDeduction: number };
    expect(json.salaryIncomeAfterDeduction).toBeDefined();
  });
});
