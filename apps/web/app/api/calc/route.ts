import { NextResponse } from 'next/server';
import { calculateTaxes, TaxEngineInput } from '@tax-engine/index';

const requiredFields: (keyof TaxEngineInput)[] = [
  'taxYear',
  'salaryIncome',
  'socialInsurance',
  'spouseStatus',
  'dependents',
  'lifeInsuranceNew',
  'careInsuranceNew',
  'earthquakeInsurance',
  'ideco',
  'lifeInsuranceOld',
  'medicalDeduction',
  'housingLoanDeduction',
];

const validateInput = (body: Partial<TaxEngineInput>): body is TaxEngineInput => {
  return requiredFields.every((key) => body[key] !== undefined && body[key] !== null);
};

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<TaxEngineInput>;
  if (!validateInput(body)) {
    return NextResponse.json({ message: '必須項目が不足しています' }, { status: 400 });
  }
  if (body.salaryIncome! < 0 || body.socialInsurance! < 0) {
    return NextResponse.json({ message: '金額は0以上を入力してください' }, { status: 400 });
  }

  try {
    const result = calculateTaxes(body);
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: '計算中にエラーが発生しました' }, { status: 500 });
  }
}
