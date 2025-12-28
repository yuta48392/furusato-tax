import Link from 'next/link';

export default function ResultPage() {
  return (
    <div className="space-y-4 rounded-lg bg-white p-6 shadow">
      <h2 className="text-lg font-semibold text-slate-800">結果画面について</h2>
      <p className="text-sm text-slate-600">
        入力ページで計算すると、その場で結果カードが表示されます。このページは共有用の固定リンクとして用意しており、トップページや入力ページに戻って再計算できます。
      </p>
      <Link href="/input" className="inline-flex items-center gap-2 text-indigo-600">
        → 入力ページへ戻る
      </Link>
    </div>
  );
}
