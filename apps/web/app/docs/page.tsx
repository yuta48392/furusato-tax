const items = [
  {
    title: '給与所得控除',
    description: '支払金額を4で割り、千円未満切り捨て後に3.2倍して440,000円を控除する2025年度ルールを採用しています。',
  },
  {
    title: '所得控除',
    description: '基礎控除・社会保険料控除・生命保険料控除・地震保険料控除・扶養控除などの合計を1,000円未満切捨て後の課税所得を算出します。',
  },
  {
    title: '住民税調整控除',
    description: '所得税と住民税の人的控除差額を5%控除する簡易モデルを実装しています。',
  },
  {
    title: 'ふるさと納税控除',
    description: '寄付額から2,000円を差し引いた控除ベースをもとに、所得税5.105%、住民税10%、残余を特例控除として計算します。',
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow">
      <h2 className="text-lg font-semibold text-slate-800">計算ロジックの概要</h2>
      <p className="text-sm text-slate-600">
        制度改正に合わせて年度別パラメータを packages/rules 配下に定義しています。端数処理や控除額の内訳を表示しやすいように、tax-engine パッケージでは純粋関数として計算を構成しました。
      </p>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.title} className="rounded border border-slate-100 p-4">
            <h3 className="text-base font-semibold text-slate-800">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
