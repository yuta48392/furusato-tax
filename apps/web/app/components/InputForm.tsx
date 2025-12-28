'use client';

import { useEffect, useMemo, useState } from 'react';
import { calculateTaxes, TaxEngineInput, TaxEngineResult } from '@tax-engine/index';

const numberFields: (keyof TaxEngineInput)[] = [
  'salaryIncome',
  'socialInsurance',
  'dependents',
  'lifeInsuranceNew',
  'careInsuranceNew',
  'earthquakeInsurance',
  'ideco',
  'lifeInsuranceOld',
  'medicalDeduction',
  'housingLoanDeduction',
];

const defaultInput: TaxEngineInput = {
  taxYear: 2025,
  salaryIncome: 0,
  socialInsurance: 0,
  spouseStatus: 'single',
  dependents: 0,
  lifeInsuranceNew: 0,
  careInsuranceNew: 0,
  earthquakeInsurance: 0,
  ideco: 0,
  lifeInsuranceOld: 0,
  medicalDeduction: 0,
  housingLoanDeduction: 0,
  useServer: true,
};

export function InputForm({ onResult }: { onResult: (result: TaxEngineResult) => void }) {
  const [input, setInput] = useState<TaxEngineInput>(defaultInput);
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('furusato-input');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setInput({ ...defaultInput, ...parsed });
      } catch (e) {
        console.warn('failed to parse input', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('furusato-input', JSON.stringify(input));
  }, [input]);

  const isValid = useMemo(() => {
    return input.salaryIncome > 0 && input.socialInsurance >= 0 && input.taxYear > 0;
  }, [input]);

  const handleNumberChange = (key: keyof TaxEngineInput) => (value: string) => {
    const numeric = Number(value.replace(/,/g, ''));
    if (Number.isNaN(numeric)) return;
    setInput((prev) => ({ ...prev, [key]: numeric }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      if (input.useServer) {
        const response = await fetch('/api/calc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message ?? '計算に失敗しました');
        }
        const result = await response.json();
        onResult(result);
      } else {
        const result = calculateTaxes(input);
        onResult(result);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '計算に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const renderNumberField = (
    key: keyof TaxEngineInput,
    label: string,
    description?: string,
    required?: boolean,
  ) => (
    <label className="space-y-1" key={key}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        {required && <span className="text-xs text-rose-500">*</span>}
      </div>
      <input
        type="number"
        className="w-full rounded border border-slate-200 px-3 py-2 text-right"
        value={(input[key] as number) ?? 0}
        onChange={(e) => handleNumberChange(key)(e.target.value)}
      />
      {description && <p className="text-xs text-slate-500">{description}</p>}
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-800">税計算対象年度 *</span>
          <select
            className="w-full rounded border border-slate-200 px-3 py-2"
            value={input.taxYear}
            onChange={(e) => setInput((prev) => ({ ...prev, taxYear: Number(e.target.value) }))}
          >
            {[2025, 2026].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-800">配偶者の有無と区分 *</span>
          <select
            className="w-full rounded border border-slate-200 px-3 py-2"
            value={input.spouseStatus}
            onChange={(e) => setInput((prev) => ({ ...prev, spouseStatus: e.target.value as TaxEngineInput['spouseStatus'] }))}
          >
            <option value="single">独身</option>
            <option value="married_dual">配偶者あり（共働き）</option>
            <option value="married_single">配偶者あり（専業）</option>
          </select>
        </label>
        {renderNumberField('salaryIncome', '給与収入（額面）', '源泉徴収票の支払金額', true)}
        {renderNumberField('socialInsurance', '社会保険料等の金額', '源泉徴収票の社会保険料等')}
        {renderNumberField('dependents', '扶養人数', '0以上の整数', true)}
        {renderNumberField('lifeInsuranceNew', '生命保険料支払額（新制度）')}
        {renderNumberField('careInsuranceNew', '介護保険料支払額（新制度）')}
        {renderNumberField('earthquakeInsurance', '地震保険料支払額')}
        {renderNumberField('ideco', 'iDeCo（小規模企業共済掛金）')}
        {renderNumberField('lifeInsuranceOld', '生命保険料（旧制度）')}
        {renderNumberField('medicalDeduction', '医療費控除')}
        {renderNumberField('housingLoanDeduction', '住宅借入金等特別控除額')}
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={input.useServer}
          onChange={(e) => setInput((prev) => ({ ...prev, useServer: e.target.checked }))}
        />
        サーバーで計算する（オフでブラウザ計算）
      </label>

      {error && <div className="rounded bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</div>}

      <button
        disabled={!isValid || isSubmitting}
        onClick={handleSubmit}
        className="inline-flex items-center justify-center rounded bg-indigo-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? '計算中...' : '計算する'}
      </button>
    </div>
  );
}
