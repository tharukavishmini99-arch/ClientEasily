export const COMMISSION_RATE = Number(
  process.env.CREATOR_COMMISSION_RATE || "0.20"
);

export function commissionForSubscription(amountCents: number) {
  return Math.round(amountCents * COMMISSION_RATE);
}
