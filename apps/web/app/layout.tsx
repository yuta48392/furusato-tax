import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'ふるさと納税シミュレーター',
  description: '2025年度対応のふるさと納税上限額計算ツール',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen">
        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-5xl px-4 py-4">
            <h1 className="text-lg font-semibold text-slate-800">ふるさと納税シミュレーター</h1>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-500">
            本計算結果は目安です。実際の申告は各自治体・税務署の情報をご確認ください。
          </div>
        </footer>
      </body>
    </html>
  );
}
