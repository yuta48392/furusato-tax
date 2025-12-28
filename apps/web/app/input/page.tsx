'use client';

import { useState } from 'react';
import { InputForm } from '../components/InputForm';
import { ResultCard } from '../components/ResultCard';
import { TaxEngineResult } from '@tax-engine/index';

export default function InputPage() {
  const [result, setResult] = useState<TaxEngineResult | null>(null);

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-slate-800">入力フォーム</h2>
        <p className="mt-2 text-sm text-slate-600">
          必須項目を入力すると「計算する」ボタンが有効になります。サーバー計算をオンにすると API 経由で計算を実施し、オフにするとブラウザのみで計算します。
        </p>
        <div className="mt-4">
          <InputForm onResult={setResult} />
        </div>
      </div>
      <ResultCard result={result} />
    </div>
  );
}
