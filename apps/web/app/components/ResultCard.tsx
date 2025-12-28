'use client';

import { TaxEngineResult } from '@tax-engine/index';

export function ResultCard({ result }: { result: TaxEngineResult | null }) {
  if (!result) return <p className="text-slate-600">まだ計算が行われていません。</p>;

  const rows: { label: string; value: number | string }[] = [
    { label: '給与所得控除額', value: result.salaryDeduction },
    { label: '給与所得', value: result.salaryIncomeAfterDeduction },
    { label: '課税所得（所得税）', value: result.incomeTaxable },
    { label: '所得税額', value: result.incomeTax },
    { label: '復興特別所得税', value: result.reconstructionTax },
    { label: '課税所得（住民税）', value: result.residentTaxable },
    { label: '住民税(調整前)', value: result.residentTaxBeforeAdjustments },
    { label: '住宅ローン控除（住民税振替）', value: result.housingLoanCreditResident },
    { label: '調整控除額', value: result.adjustmentCredit },
    { label: '住民税(最終)', value: result.residentTaxFinal },
    { label: '寄付の目安（安全）', value: result.safeDonation },
    { label: '寄付の目安（最適）', value: result.optDonation },
    { label: '寄付の目安（攻め）', value: result.riskDonation },
  ];

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-lg font-semibold text-slate-800">計算結果</h2>
      <p className="mt-2 text-sm text-slate-600">
        表示額は概算です。所得税と住民税の内訳、住宅ローン控除や調整控除を含めた結果を示します。
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded border border-slate-100 px-4 py-3">
            <span className="text-sm text-slate-700">{row.label}</span>
            <span className="text-base font-semibold text-slate-900">{row.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded bg-slate-50 px-4 py-3 text-sm text-slate-600">
        ふるさと納税の特例控除上限は住民税所得割の20%で計算されます。特例分が上限に近づくと損をする可能性があるため、「安全額」も併せてご確認ください。
      </div>
    </div>
  );
}
