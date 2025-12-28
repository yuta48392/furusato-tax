import Link from 'next/link';

const cards = [
  {
    title: '入力フォーム',
    description: '給与収入や控除額を入力して計算を始めます',
    href: '/input',
  },
  {
    title: '計算結果',
    description: '計算後の結果カードに遷移します',
    href: '/result',
  },
  {
    title: '制度解説',
    description: '計算ロジックや根拠資料の概要を確認',
    href: '/docs',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-slate-800">2025年度対応 ふるさと納税上限額シミュレーター</h2>
        <p className="mt-3 text-slate-600">
          給与収入や各種控除を入力し、所得税・住民税の計算過程を透明に表示します。クライアント計算とサーバー計算を切り替え、計算根拠を確認しながら最適な寄付額を検討できます。
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="block rounded-lg bg-white p-5 shadow transition hover:-translate-y-0.5">
            <h3 className="text-lg font-semibold text-slate-800">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{card.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
