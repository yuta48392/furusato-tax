import { floorTo, clamp } from './utils';

export const calcDonationBreakdown = (
  donation: number,
  residentTaxPortion: number,
  incomeTaxRateEff: number,
) => {
  const base = Math.max(donation - 2_000, 0);
  const incomeTaxDeduction = base * incomeTaxRateEff;
  const residentBasic = base * 0.1;
  const residentSpecialRate = 1 - 0.1 - incomeTaxRateEff;
  const specialBeforeCap = base * residentSpecialRate;
  const specialCapped = Math.min(specialBeforeCap, residentTaxPortion * 0.2);
  return {
    base,
    incomeTaxDeduction: Math.floor(incomeTaxDeduction),
    residentBasic: Math.floor(residentBasic),
    residentSpecial: Math.floor(specialCapped),
  };
};

export const calcDonationLimits = (residentTaxPortion: number) => {
  const specialLimit = residentTaxPortion * 0.2;
  const bMax = Math.floor(specialLimit / 0.84895);
  const dMax = bMax + 2_000;
  const safeDonation = floorTo(dMax * 0.75, 1_000);
  const riskDonation = clamp(Math.ceil(dMax / 1000) * 1000, 0, dMax + 1_000);
  return { optimalDonation: dMax, safeDonation, riskDonation };
};
